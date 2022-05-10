const express = require("express");
const router = express.Router();
const passport = require("passport");
// DB load Evaluation model
const Coaching = require("../../models/Coaching");
// Mail init
const nodemailer = require("nodemailer");
const { generateMailTemplate } = require("../../mail_templates/CoachingSaved");

// @route POST api/coachings/add
// @description Add new Coaching
// @access Private
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Data
    const coaching = req.body;

    // Prepare DB document
    const newCoaching = new Coaching(coaching);

    newCoaching
      .save()
      .then(coaching => {
        // Send email
        let transporter = nodemailer.createTransport({
          sendmail: true,
          newline: "unix",
          path: "/usr/sbin/sendmail",
        });
        // Prepare mail list
        const mailList = [coaching.user.email, coaching.evaluator.email];

        mailList.forEach(mailAddress => {
          transporter.sendMail(
            generateMailTemplate(
              mailAddress,
              coaching.user.fullname,
              coaching.evaluator.fullname
            ),
            (err, info) => {
              console.log(err);
            }
          );
        });

        res.json(coaching);
      })
      .catch(err => console.log(err));
  }
);

// @route GET api/coachings/user/:frontline_id
// @description View user's coachings
// @access Private
router.get(
  "/user/:frontline_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { frontline_id } = req.params;
    try {
      const coachings = await Coaching.find({
        "user.frontline_id": frontline_id,
      }).sort({ date: -1 });
      res.json(coachings);
    } catch (error) {
      res.status(404).json({ coachingsnotfound: "Coachings not found" });
    }
  }
);

// @route POST api/coachings/updateCompleted
// @description Update coaching, set completed to TRUE
// @access Private
router.post(
  "/updateCompleted",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { coaching_id } = req.body;
    // UPDATE COACHING
    try {
      const coaching = await Coaching.findById(coaching_id);
      coaching.completed = true;
      await coaching.save();
      res.json({ coachingupdated: "Coaching marked as completed" });
    } catch (error) {
      res.status(404).send(error.message);
    }
  }
);

// @route POST api/coachings/updateAccepted
// @description Update coaching, set accepted to TRUE
// @access Private
router.post(
  "/updateAccepted",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { coaching_id } = req.body;
    // UPDATE COACHING
    try {
      const coaching = await Coaching.findById(coaching_id);
      coaching.accepted = true;
      await coaching.save();
      res.json({ coachingupdated: "Coaching marked as accepted" });
    } catch (error) {
      res.status(404).send(error.message);
    }
  }
);

module.exports = router;
