const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  evalution7PSavedMail,
  feedbackReplyMail,
} = require("../../mail_templates/Evaluation7P");

// 7P Evaluation mongo model
const Evaluation7P = require("../../models/7P");

// @route POST api/7p/add
// @description Add new 7P evaluation to DB
// @access Private
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Prepare DB document
    const document = new Evaluation7P(req.body);
    try {
      const evaluation = await document.save();
      // Send email
      evalution7PSavedMail(evaluation);

      res.json(evaluation);
    } catch (error) {
      res.status(404).send(error.message);
    }
  }
);

// @route GET api/7p/:evaluation_id
// @description View evaluation
// @access Private
router.get(
  "/:evaluation_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { evaluation_id } = req.params;
    try {
      const evaluation = await Evaluation7P.findById(evaluation_id);
      res.json(evaluation);
    } catch (error) {
      res.status(404).send(error.message);
    }
  }
);

// @route POST api/7p/datepicker/shop/:shop_id
// @description View evaluations for the selected shop and posted dates
// @access Private
router.post(
  "/datepicker/shop/:shop_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const date_from = new Date(req.body.date_from); // midnight
    date_from.setHours(00);
    date_from.setMinutes(00);
    let date_to = new Date(req.body.date_to);
    date_to.setDate(date_to.getDate() + 1);
    date_to.setHours(00);
    date_to.setMinutes(00);

    Evaluation7P.find({
      "user.group_id": req.params.shop_id,
      date: { $gte: date_from, $lt: date_to },
    })
      .sort({ date: -1 })
      .then(evaluations => {
        res.json(evaluations);
      })
      .catch(err =>
        res.status(404).json({ evaluationnotfound: "Evaluations not found" })
      );
  }
);

// @route POST api/7p/datepicker/region/:region_id
// @description View evaluations for the selected region and posted dates
// @access Private
router.post(
  "/datepicker/region/:region_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Data
    const date_from = new Date(req.body.date_from); // midnight
    date_from.setHours(00);
    date_from.setMinutes(00);
    let date_to = new Date(req.body.date_to);
    date_to.setDate(date_to.getDate() + 1);
    date_to.setHours(00);
    date_to.setMinutes(00);

    Evaluation7P.find({
      "user.group_parent_id": req.params.region_id,
      date: { $gte: date_from, $lt: date_to },
    })
      .sort({ date: -1 })
      .then(evaluations => {
        res.json(evaluations);
      })
      .catch(err =>
        res.status(404).json({ evaluationnotfound: "Evaluations not found" })
      );
  }
);

// @route POST api/7p/datepicker/user/:frontline_id
// @description View evaluations for the selected user and posted dates
// @access Private
router.post(
  "/datepicker/user/:frontline_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const date_from = new Date(req.body.date_from); // midnight
    date_from.setHours(00);
    date_from.setMinutes(00);
    let date_to = new Date(req.body.date_to);
    date_to.setDate(date_to.getDate() + 1);
    date_to.setHours(00);
    date_to.setMinutes(00);

    Evaluation7P.find({
      "user.frontline_id": req.params.frontline_id,
      date: { $gte: date_from, $lt: date_to },
    })
      .sort({ date: -1 })
      .then(evaluations => {
        res.json(evaluations);
      })
      .catch(err =>
        res.status(404).json({ evaluationnotfound: "Evaluations not found" })
      );
  }
);

// @route GET api/7p/updateSeen/:evaluation_id
// @description Update evaluation, set evaluation_seen to TRUE
// @access Private
router.get(
  "/updateSeen/:evaluation_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { evaluation_id } = req.params;

    try {
      const doc = await Evaluation7P.findById(evaluation_id);
      doc.evaluation_seen = true;
      await doc.save();
      res.json({ evaluationupdated: "Evaluation seen by user" });
    } catch (error) {
      res.status(404).send(error.message);
    }
  }
);

// @route POST api/7ps/feedbackReplay/:evaluation_id
// @description Update feedbackReplay, set feedbackReplay to string
// @access Private
router.post(
  "/feedbackReplay/:evaluation_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { evaluation_id } = req.params;
    const { feedbackReply } = req.body;

    try {
      const doc = await Evaluation7P.findById(evaluation_id);
      doc.evaluation.feedbackReply = feedbackReply;
      const updatedEvaluation = await doc.save();

      // Send mail
      feedbackReplyMail(updatedEvaluation);
      res.json(updatedEvaluation);
    } catch (error) {
      res.status(404).send(error.message);
    }
  }
);

module.exports = router;
