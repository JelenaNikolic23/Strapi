const express = require("express");
const router = express.Router();
const passport = require("passport");
const nodemailer = require("nodemailer");
const { evaluationSavedMail, feedbackReplyMail} = require('../../mail_templates/Evaluation5G');

// DB load Evaluation model
const Evaluation = require("../../models/Evaluation");

// @route POST api/evaluations/add
// @description Add new evaluation to DB
// @access Private
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
   // Prepare DB document
   const document = new Evaluation(req.body);
   try {
     const evaluation = await document.save();
     // Send email
     evaluationSavedMail(evaluation);

     res.json(evaluation);
   } catch (error) {
     res.status(404).send(error.message);
   }
  }
);

// @route GET api/evaluations/:evaluation_id
// @description View evaluation
// @access Private
router.get(
  "/:evaluation_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Evaluation.findById(req.params.evaluation_id)
      .then(evaluation => {
        res.json(evaluation);
      })
      .catch(err =>
        res.status(404).json({ evaluationnotfound: "Evaluation not found" })
      );
  }
);

// @route GET api/evaluations/top5 and low 5
// @description View evaluation
// @access Private
router.get(
  "/dashboard/topAndlow5",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Get user's groups from JWT
      const first_group = req.user.frontline_groups[0];
      // Aggregate top 5 salesman in your scope
      const top5G = await Evaluation.aggregate([
        {
          $match: {
            "user.group_nest_left": { $gt: first_group.nest_left },
            "user.group_nest_right": { $lt: first_group.nest_right },
          },
        },
        {
          $group: {
            _id: "$user.frontline_id",
            fullname: { $first: "$user.fullname" },
            shop: { $first: "$user.group_name" },
            avg: { $avg: "$evaluation.score" },
          },
        },
        { $sort: { avg: -1 } },
        { $limit: 5 },
      ]);
      // Aggregate low 5 salesman in your scope
      const low5G = await Evaluation.aggregate([
        {
          $match: {
            "user.group_nest_left": { $gt: first_group.nest_left },
            "user.group_nest_right": { $lt: first_group.nest_right },
          },
        },
        {
          $group: {
            _id: "$user.frontline_id",
            fullname: { $first: "$user.fullname" },
            shop: { $first: "$user.group_name" },
            avg: { $avg: "$evaluation.score" },
          },
        },
        { $sort: { avg: 1 } },
        { $limit: 5 },
      ]);

      res.json({ top5G, low5G });
    } catch (e) {
      console.log(e);
    }
  }
);

// @route GET api/evaluations/dashboard/evaluatorStats
// @description View 5G eval stats by evaluator - current month
// @access Private
router.get(
  "/dashboard/evaluatorStats",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Get user's groups from JWT
      const first_group = req.user.frontline_groups[0];
      const now = new Date();
      const curMonth = now.getMonth() + 1; // mongo is not 0 based
      const curYear = now.getFullYear();

      // Aggregate evaluators in your scope
      const evaluatorStats = await Evaluation.aggregate([
        {
          $match: {
            "user.group_nest_left": { $gt: first_group.nest_left },
            "user.group_nest_right": { $lt: first_group.nest_right },
          },
        },
        {
          $project: {
            month: { $month: "$date" },
            year: { $year: "$date" },
            score: "$evaluation.score",
            evaluator_id: "$evaluator.frontline_id",
            evaluator_name: "$evaluator.fullname",
            evaluator_groups: "$evaluator.frontline_groups",
          },
        },
        {
          $match: {
            month: { $eq: curMonth },
            year: { $eq: curYear },
            "evaluator_groups.0.parent_id": {
              $eq: first_group.id,
            },
          },
        },
        {
          $group: {
            _id: "$evaluator_id",
            fullname: { $first: "$evaluator_name" },
            count: { $sum: 1 },
            avg: { $avg: "$score" },
          },
        },
      ]);

      res.json(evaluatorStats);
    } catch (e) {
      console.log(e);
    }
  }
);

// @route GET api/evaluations/user/:frontline_id/:limit?
// @description View user's evaluations
// @access Private
router.get(
  "/user/:frontline_id/:limit?",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const limit = parseInt(req.params.limit);
    let evalNum = 0;
    if (!isNaN(limit)) {
      evalNum = limit;
    }

    Evaluation.find({ "user.frontline_id": req.params.frontline_id })
      .sort({ date: -1 })
      .limit(evalNum)
      .then(evaluations => {
        res.json(evaluations);
      })
      .catch(err =>
        res.status(404).json({ evaluationnotfound: "Evaluations not found" })
      );
  }
);

// @route POST api/evaluations/datepicker/user/:frontline_id
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

    Evaluation.find({
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

// @route GET api/evaluations/shop/:shop_id/:limit?
// @description View evaluations for the selected shop
// @access Private
router.get(
  "/shop/:shop_id/:limit?",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const limit = parseInt(req.params.limit);
    let evalNum = 0;
    if (!isNaN(limit)) {
      evalNum = limit;
    }

    Evaluation.find({ "user.group_id": req.params.shop_id })
      .sort({ date: -1 })
      .limit(evalNum)
      .then(evaluations => {
        res.json(evaluations);
      })
      .catch(err =>
        res.status(404).json({ evaluationnotfound: "Evaluations not found" })
      );
  }
);

// @route POST api/evaluations/datepicker/shop/:shop_id
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

    Evaluation.find({
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

// @route GET api/evaluations/region/:region_id/:limit?
// @description View user's evaluations
// @access Private
router.get(
  "/region/:region_id/:limit?",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const limit = parseInt(req.params.limit);
    let evalNum = 0;
    if (!isNaN(limit)) {
      evalNum = limit;
    }

    Evaluation.find({ "user.group_parent_id": req.params.region_id })
      .sort({ date: -1 })
      .limit(evalNum)
      .then(evaluations => {
        res.json(evaluations);
      })
      .catch(err =>
        res.status(404).json({ evaluationnotfound: "Evaluations not found" })
      );
  }
);

// @route POST api/evaluations/datepicker/region/:region_id
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

    Evaluation.find({
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

// @route GET api/evaluations/user5Gstats/:frontline_id
// @description View average and count of all evaluations for selected user
// @access Private
router.get(
  "/user5Gstats/:frontline_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const summary = await Evaluation.aggregate([
        {
          $match: {
            "user.frontline_id": parseInt(req.params.frontline_id),
          },
        },
        {
          $group: {
            _id: "$user.frontline_id",
            avg: { $avg: "$evaluation.score" },
            count: { $sum: 1 },
          },
        },
      ]);

      res.json(summary);
    } catch (e) {
      console.log(e);
    }
  }
);

// @route GET api/evaluations/user5Gstats/:frontline_id
// @description Average score by month for the user
// @access Private
router.get(
  "/user5GstatsByMonth/:frontline_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const summary = await Evaluation.aggregate([
        {
          $match: {
            "user.frontline_id": parseInt(req.params.frontline_id),
          },
        },
        {
          $group: {
            _id: { $month: "$date" },
            avg: { $avg: "$evaluation.score" },
          },
        },
      ]);

      res.json(summary);
    } catch (e) {
      console.log(e);
    }
  }
);

// @route GET api/evaluations/user5GworstStep/:frontline_id
// @description Worst performing steps in 5G
// @access Private
router.get(
  "/user5GworstStep/:frontline_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const summary = await Evaluation.aggregate([
        {
          $match: {
            "user.frontline_id": parseInt(req.params.frontline_id),
          },
        },
        {
          $unwind: {
            path: "$evaluation.categories",
          },
        },
        {
          $unwind: {
            path: "$evaluation.categories.categorySteps",
          },
        },
        {
          $group: {
            _id: "$evaluation.categories.categoryName",
            count: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$evaluation.categories.categorySteps.stepValue",
                      "Ne",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);

      res.json(summary);
    } catch (e) {
      console.log(e);
    }
  }
);

// @route GET api/evaluations/shop5Gstats/:frontline_id
// @description View average and count of all evaluations for selected user
// @access Private
router.get(
  "/shop5Gstats/:shop_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const summary = await Evaluation.aggregate([
        {
          $match: {
            "user.group_id": parseInt(req.params.shop_id),
          },
        },
        {
          $group: {
            _id: "$user.group_id",
            avg: { $avg: "$evaluation.score" },
            count: { $sum: 1 },
          },
        },
      ]);

      res.json(summary);
    } catch (e) {
      console.log(e);
    }
  }
);

// @route GET api/evaluations/shop5Gstats/perUser/:shop_id
// @description View AVG and COUNT by user from shop
// @access Private
router.get(
  "/shop5Gstats/perUser/:shop_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const summary = await Evaluation.aggregate([
        {
          $match: {
            "user.group_id": parseInt(req.params.shop_id),
          },
        },
        {
          $group: {
            _id: "$user.frontline_id",
            fullname: { $last: "$user.fullname" },
            avg: { $avg: "$evaluation.score" },
            count: { $sum: 1 },
          },
        },
      ]);

      res.json(summary);
    } catch (e) {
      console.log(e);
    }
  }
);

// @route GET api/evaluations/region5Gstats/:region_id
// @description View average and count of all evaluations for selected user
// @access Private
router.get(
  "/region5Gstats/:region_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const summary = await Evaluation.aggregate([
        {
          $match: {
            "user.group_parent_id": parseInt(req.params.region_id),
          },
        },
        {
          $group: {
            _id: "$user.group_parent_id",
            avg: { $avg: "$evaluation.score" },
            count: { $sum: 1 },
          },
        },
      ]);

      res.json(summary);
    } catch (e) {
      console.log(e);
    }
  }
);

// @route GET api/evaluations/updateSeen/:evaluation_id
// @description Update evaluation, set evaluation_seen to TRUE
// @access Private
router.get(
  "/updateSeen/:evaluation_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { evaluation_id } = req.params;

    try {
      const doc = await Evaluation.findById(evaluation_id);
      doc.evaluation_seen = true;
      await doc.save();
      res.json({ evaluationupdated: "Evaluation seen by user" });
    } catch (error) {
      res.status(404).send(error.message);
    }
  }
);

// @route GET api/evaluations/lastDay/:shop_id
// @description find evaluations for evaluator (today and yesterday)
// @access Private
router.get(
  "/lastDay/:shop_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // FIND DATE
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    Evaluation.find(
      {
        "evaluator.frontline_id": req.user.frontline_id,
        "user.group_id": req.params.shop_id,
        date: {
          $gte: yesterday,
        },
      },
      { "evaluation.score": 1, "user.fullname": 1 }
    )
      .sort({ date: -1 })
      .then(evaluations => {
        const evals = evaluations.map(eval => {
          return {
            id: eval._id,
            user: eval.user.fullname,
            score: eval.evaluation.score,
          };
        });
        res.json(evals);
      })
      .catch(err =>
        res.status(404).json({ evaluationnotfound: "Evaluations not found" })
      );
  }
);

// @route POST api/evaluations/feedbackReplay/:evaluation_id
// @description Update feedbackReplay, set feedbackReplay to string
// @access Private
router.post(
  "/feedbackReplay/:evaluation_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { evaluation_id } = req.params;
    const { feedbackReply } = req.body;

    try {
      const doc = await Evaluation.findById(evaluation_id);
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
