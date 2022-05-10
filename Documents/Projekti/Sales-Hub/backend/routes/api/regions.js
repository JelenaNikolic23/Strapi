const express = require("express");
const router = express.Router();
const passport = require("passport");
const mysql = require("mysql2/promise");
const mysqlConn = require("../../config/mysql").connection;

// DB load Mongo models
const Evaluation7P = require("../../models/7P");
const Evaluation = require("../../models/Evaluation");
const ShopReport = require("../../models/ShopReport");
const Coaching = require("../../models/Coaching");
const Feedback = require("../../models/Feedback");

// @route GET api/regions/:region_id
// @description View region details by FL group ID
// @access Private
router.get(
  "/single/:region_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Find single region form FL database
    try {
      // MySQL connection
      const connection = await mysql.createConnection(mysqlConn);

      // MySQL Query - Find region by ID
      const region_id = parseInt(req.params.region_id);
      const [region, fields] = await connection.execute(
        `SELECT groupChild.id AS id,
        groupChild.name AS name,
        groupChild.nest_depth AS nest_depth,
        groupChild.nest_left AS nest_left,
        groupChild.nest_right AS nest_right,
        groupChild.parent_id AS parent_id,
        groupParent.name AS parentName
        FROM rainlab_user_elearn_group AS groupChild
        LEFT JOIN rainlab_user_elearn_group AS groupParent
        ON groupChild.parent_id=groupParent.id WHERE groupChild.id=${region_id} LIMIT 1`
      );

      return res.json(region[0]);
    } catch (e) {
      res.json(e);
    }
  }
);

// @route GET api/regions
// @description All regions
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Get user's groups from JWT
      const first_group = req.user.frontline_groups[0];

      console.log(first_group.id);

      // MySQL connection
      const connection = await mysql.createConnection(mysqlConn);

      // Regional Sales Manager ACCESS
      if (first_group.nest_depth == 2) {
        // MySQL Query - Find regions by user
        const [regions, fields] = await connection.execute(
          `SELECT * FROM rainlab_user_elearn_group WHERE nest_depth=2 AND id=${first_group.id} LIMIT 1`
        );

        // Prepare groups
        const groups_arr = regions.map(element => {
          const group_obj = {
            id: element.id,
            name: element.name
          };

          return group_obj;
        });

        res.json({ groups_array: groups_arr });
      } else if (first_group.nest_depth <= 1) {
        // HEAD ACCESS
        const [regions, fields] = await connection.execute(
          `SELECT * FROM rainlab_user_elearn_group WHERE nest_depth=2 AND nest_left>${first_group.nest_left} AND nest_right<${first_group.nest_right}`
        );

        // Prepare groups
        const groups_arr = regions.map(element => {
          const group_obj = {
            id: element.id,
            name: element.name
          };

          return group_obj;
        });

        res.json({ groups_array: groups_arr });
      }
    } catch (e) {
      res.json(e);
    }
  }
);

// @route POST api/regions/withEval
// @description All regions with 5G and 7P count and avg
// @access Private
router.post(
  "/withEval",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Get user's groups from JWT
      const first_group = req.user.frontline_groups[0];

      // Datepicker
      const date_from = new Date(req.body.date_from); // midnight
      date_from.setHours(00);
      date_from.setMinutes(00);
      let date_to = new Date(req.body.date_to);
      date_to.setDate(date_to.getDate() + 1);
      date_to.setHours(00);
      date_to.setMinutes(00);

      // MySQL connection
      const connection = await mysql.createConnection(mysqlConn);

      // REGIONAL AND HEAD ACCESS
      if (first_group.nest_depth <= 2) {
        const [regions, fields] = await connection.execute(
          `SELECT * FROM rainlab_user_elearn_group WHERE nest_depth=2 AND nest_left>=${first_group.nest_left} AND nest_right<=${first_group.nest_right}`
        );

        // Find evaluations 5G in MongoDB - aggregate by group_id and calculate count and avg
        const evaluations = await Evaluation.aggregate([
          {
            $match: {
              "user.group_nest_left": { $gt: first_group.nest_left },
              "user.group_nest_right": { $lt: first_group.nest_right },
              date: { $gte: date_from, $lt: date_to }
            }
          },
          {
            $group: {
              _id: "$user.group_parent_id",
              avg: { $avg: "$evaluation.score" },
              count: { $sum: 1 }
            }
          }
        ]);

        // Find evaluations 7P in MongoDB - aggregate by group_id and calculate count and avg
        const evaluations7P = await Evaluation7P.aggregate([
          {
            $match: {
              "user.group_nest_left": { $gt: first_group.nest_left },
              "user.group_nest_right": { $lt: first_group.nest_right },
              date: { $gte: date_from, $lt: date_to }
            }
          },
          {
            $group: {
              _id: "$user.group_parent_id",
              avg: { $avg: "$evaluation.score" },
              count: { $sum: 1 }
            }
          }
        ]);      

        // Find Shop Report count in MongoDB - aggregate by group_id and calculate count
        const shopReports = await ShopReport.aggregate([
          {
            $match: {
              "shop.nest_left": { $gt: first_group.nest_left },
              "shop.nest_right": { $lt: first_group.nest_right },
              date: { $gte: date_from, $lt: date_to }
            }
          },
          {
            $group: {
              _id: "$shop.parent_id",
              count: { $sum: 1 }
            }
          }
        ]);
        
        // Find CoachingCount in MongoDB - aggregate by group_id and calculate count
        const coachingReports = await Coaching.aggregate([
          {
            $match: {
              "user.group_nest_left": { $gt: first_group.nest_left },
              "user.group_nest_right": { $lt: first_group.nest_right },
              date: { $gte: date_from, $lt: date_to }
            }
          },
          {
            $group: {
              _id: "$user.group_parent_id",
              count: { $sum: 1 }
            }
          }
        ]);

        // Find FeedbackCount in MongoDB - aggregate by group_id and calculate count
        const feedbackReports = await Feedback.aggregate([
          {
            $match: {
              "user.group_nest_left": { $gt: first_group.nest_left },
              "user.group_nest_right": { $lt: first_group.nest_right },
              date: { $gte: date_from, $lt: date_to }
            }
          },
          {
            $group: {
              _id: "$user.group_parent_id",
              count: { $sum: 1 }
            }
          }
        ]);

        // Prepare groups
        const groups_arr = regions.map(element => {
          const regionEvals = evaluations.find(eval => eval._id == element.id);
          const regionEvals7P = evaluations7P.find(eval => eval._id == element.id);
          const shopVisits = shopReports.find(report => report._id == element.id);
          const coachingItem = coachingReports.find(report => report._id == element.id);
          const feedbackItem = feedbackReports.find(report => report._id == element.id);

          const group_obj = {
            id: element.id,
            name: element.name,
            evalCount: regionEvals != undefined ? regionEvals.count : null,
            evalAvg: regionEvals != undefined ? regionEvals.avg : null,
            evalCount7P: regionEvals7P != undefined ? regionEvals7P.count : null,
            evalAvg7P: regionEvals7P != undefined ? regionEvals7P.avg : null,
            reportsCount: shopVisits != undefined ? shopVisits.count : null,
            coachingCount: coachingItem != undefined ? coachingItem.count : null,
            feedbackCount: feedbackItem != undefined ? feedbackItem.count : null,
          };

          return group_obj;
        });

        res.json({ groups_array: groups_arr });
      }
    } catch (e) {
      res.json(e);
    }
  }
);

module.exports = router;
