const express = require("express");
const router = express.Router();
const passport = require("passport");
// DB load Evaluation model
const ActionPlan = require("../../models/ActionPlan");
const Mongoose = require("mongoose");
const ObjectId = Mongoose.Types.ObjectId;
// Mail init
const nodemailer = require("nodemailer");
const MailChallengeResolved = require("../../mail_templates/ChallengeResolved");
const MailActionCompleted = require("../../mail_templates/ActionCompleted");

// @route POST api/:id/add "This :id belongs to the Shop Report which is connected to this action plan
// @description Add new Action Plan for Shop Report
// @access Private
router.post(
  "/:id/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Data
    console.log("Action plans rade");
    const actionplan = req.body;

    // Prepare DB document
    const newActionPlan = new ActionPlan(actionplan);

    newActionPlan
      .save()
      .then(actionplan => res.json(actionplan))
      .catch(err => console.log(err));
  }
);

// @route GET api/actionPlans/shop/:shop_id
// @description All NOT RESOLVED actions for particular shop
// @access Private
router.get(
  "/shop/:shop_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const shop_id = parseInt(req.params.shop_id);

      ActionPlan.find({ resolved: false, "shop.id": shop_id })
        .sort({ deadline: 1 })
        .then(actionPlans => {
          res.json(actionPlans);
        })
        .catch(err =>
          res.status(404).json({ actionPlans: "Action plans not found" })
        );
    } catch (e) {
      res.json(e);
    }
  }
);

// @route POST api/actionPlans/updateActionCompleted
// @description Update action by action_id and challenge_id
// @access Private
router.post(
  "/updateActionCompleted",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // UPDATE ACTION
    ActionPlan.update(
      {
        _id: req.body.challengeId,
        actions: { $elemMatch: { _id: req.body.actionId } }
      },
      {
        $set: {
          "actions.$.completed": req.body.completedAction
        }
      }
    )
      .then(responseStatus => {
        ActionPlan.findOne({
          _id: ObjectId(req.body.challengeId)
        })
          .then(updatedChallenge => {
            const updatedAction = updatedChallenge.actions.filter(
              a => a._id.toString() === req.body.actionId
            );

            // Send mail if action is marked as TRUE
            if (req.body.completedAction) {
              let transporter = nodemailer.createTransport({
                sendmail: true,
                newline: "unix",
                path: "/usr/sbin/sendmail"
              });
              // Prepare mail list
              MailActionCompleted.genarateMailList(
                updatedChallenge.shop.id,
                updatedChallenge.creator.frontline_groups[0].id,
                updatedChallenge.creator.frontline_groups[0].parent_id
              )
                .then(list => {
                  // Send separate mail for each recipient
                  list.forEach(mailAddress => {
                    transporter.sendMail(
                      MailActionCompleted.generateMailTemplate(
                        mailAddress,
                        updatedChallenge,
                        updatedAction[0].task
                      ),
                      (err, info) => {
                        console.log(err);
                      }
                    );
                  });
                })
                .catch(err => console.log(err));
            }
          })
          .catch(e => console.log(e));

        res.json({ actionupdated: "Action is updated" });
      })
      .catch(err =>
        res.status(404).json({ actionupdated: "Action not updated!" })
      );
  }
);

// @route GET api/actionPlans/creator
// @description All NOT RESOLVED actions for particular creator / Regional Sales Manager
// @access Private
router.get(
  "/creator",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const frontline_id = req.user.frontline_id;

      ActionPlan.find({ resolved: false, "creator.frontline_id": frontline_id })
        .sort({ deadline: 1 })
        .then(actionPlans => {
          res.json(actionPlans);
        })
        .catch(err =>
          res.status(404).json({ actionPlans: "Action plans not found" })
        );
    } catch (e) {
      res.json(e);
    }
  }
);

// @route POST api/actionPlans/updateChallengeResolved
// @description Update challenge by challenge_id
// @access Private
router.post(
  "/updateChallengeResolved",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // UPDATE ACTION
    ActionPlan.update(
      {
        _id: req.body.challengeId
      },
      {
        $set: {
          resolved: req.body.resolved
        }
      }
    )
      .then(responseStatus => {
        ActionPlan.findOne({ _id: ObjectId(req.body.challengeId) })
          .then(challenge => {
            // Send email
            let transporter = nodemailer.createTransport({
              sendmail: true,
              newline: "unix",
              path: "/usr/sbin/sendmail"
            });
            // Prepare mail list
            MailChallengeResolved.genarateMailList(
              challenge.shop.id,
              challenge.creator.frontline_groups[0].parent_id
            )
              .then(list => {
                // Send separate mail for each recipient
                list.forEach(mailAddress => {
                  transporter.sendMail(
                    MailChallengeResolved.generateMailTemplate(
                      mailAddress,
                      challenge
                    ),
                    (err, info) => {
                      console.log(err);
                    }
                  );
                });
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log("Can't find updated challenge"));

        res.json({ challengeupdated: "Challenge is updated" });
      })
      .catch(err =>
        res.status(404).json({ challengeupdated: "Challenge not updated!" })
      );
  }
);

// @route POST api/actionPlans/:shopReport
// @description Find Action Plans for Given Shop Report
// @access Private
router.post("/:shopReport", async (req, res) => {
  try {
    const plans = await ActionPlan.find({
      owner: req.params.shopReport
    });
    res.json(plans);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
