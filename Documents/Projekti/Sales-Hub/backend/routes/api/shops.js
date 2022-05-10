const express = require("express");
const router = express.Router();
const passport = require("passport");
const mysql = require("mysql2/promise");
const mysqlConn = require("../../config/mysql").connection;

// DB load Mongo models
const Evaluation7P = require ("../../models/7P");
const Evaluation = require("../../models/Evaluation");
const ShopReport = require("../../models/ShopReport");
const Coaching = require("../../models/Coaching");
const Feedback = require("../../models/Feedback");


// @route GET api/shops/:shop_id
// @description View shop details by FL shop ID
// @access Private
router.get(
  "/single/:shop_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Find single shop form FL database
    try {
      // MySQL connection
      const connection = await mysql.createConnection(mysqlConn);

      // MySQL Query - Find FL user by ID
      const shop_id = parseInt(req.params.shop_id);
      const [shop, fields] = await connection.execute(
        `SELECT groupChild.id AS id,
        groupChild.name AS name,
        groupChild.nest_depth AS nest_depth,
        groupChild.nest_left AS nest_left,
        groupChild.nest_right AS nest_right,
        groupChild.parent_id AS parent_id,
        groupParent.name AS parentName
        FROM rainlab_user_elearn_group AS groupChild
        LEFT JOIN rainlab_user_elearn_group AS groupParent
        ON groupChild.parent_id=groupParent.id WHERE groupChild.id=${shop_id} LIMIT 1`
      );

      return res.json(shop[0]);
    } catch (e) {
      res.json(e);
    }
  }
);

// @route GET api/shops
// @description All shops
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

      // SHOP LEADER ACCESS
      if (first_group.nest_depth == 3) {
        // MySQL Query - Find shops by user
        const [shops, fields] = await connection.execute(
          `SELECT * FROM rainlab_user_elearn_group WHERE nest_depth=3 AND id=${first_group.id}`
        );

        // Prepare groups
        const groups_arr = shops.map(element => {
          const group_obj = {
            id: element.id,
            name: element.name
          };

          return group_obj;
        });

        res.json({ groups_array: groups_arr });
      } else if (first_group.nest_depth <= 2) {
        // REGIONAL AND HEAD ACCESS
        // MySQL Query - Find shops by user

        const [shops, fields] = await connection.execute(
          `SELECT shop.id as shop_id,
          shop.name as shop_name,
          shop.nest_left as nest_left,
          shop.nest_right as nest_right,
          shop.nest_depth as nest_depth,
          parent_group.id as parent_id,
          parent_group.name as parent_name
          FROM rainlab_user_elearn_group as shop
          LEFT JOIN rainlab_user_elearn_group as parent_group ON shop.parent_id=parent_group.id
          WHERE shop.nest_depth=3
          AND shop.nest_left>${first_group.nest_left}
          AND shop.nest_right<${first_group.nest_right}`
        );

        // Prepare groups
        const groups_arr = shops.map(element => {
          const group_obj = {
            id: element.shop_id,
            fullname: element.shop_name,
            nest_left: element.nest_left,
            nest_right: element.nest_right,
            nest_depth: element.nest_depth,
            parent_id: element.parent_id,
            parent_name: element.parent_name
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

// @route GET api/shops/region/:region_id
// @description All shops from the region
// @access Private
router.get(
  "/region/:region_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const region_id = parseInt(req.params.region_id);

      // MySQL connection
      const connection = await mysql.createConnection(mysqlConn);

      // MySQL Query - Find shops from the region

      const [shops, fields] = await connection.execute(
        `SELECT * FROM rainlab_user_elearn_group WHERE parent_id=${region_id}`
      );

      // Prepare groups
      const groups_arr = shops.map(element => {
        const group_obj = {
          id: element.id,
          name: element.name
        };

        return group_obj;
      });

      res.json({ groups_array: groups_arr });
    } catch (e) {
      res.json(e);
    }
  }
);

// @route GET api/shops/withEval
// @description All shops with 5G and 7P count and avg
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

      // SHOP LEADER ACCESS
      if (first_group.nest_depth == 3) {
        // MySQL Query - Find shops by user
        const [shops, fields] = await connection.execute(
          `SELECT * FROM rainlab_user_elearn_group WHERE nest_depth=3 AND id=${first_group.id}`
        );

        // Find evaluations 5G in MongoDB - aggregate by group_id and calculate count and avg
        const evaluations = await Evaluation.aggregate([
          {
            $match: {
              "user.group_id": first_group.id,
              date: { $gte: date_from, $lt: date_to }
            }
          },
          {
            $group: {
              _id: "$user.group_id",
              avg: { $avg: "$evaluation.score" },
              count: { $sum: 1 }
            }
          }
        ]);

        // Find evaluations 7P in MongoDB - aggregate by group_id and calculate count and avg
        const evaluations7P = await Evaluation7P.aggregate([
          {
            $match: {
              "user.group_id": first_group.id,
              date: { $gte: date_from, $lt: date_to }
            }
          },
          {
            $group: {
              _id: "$user.group_id",
              avg: { $avg: "$evaluation.score" },
              count: { $sum: 1 }
            }
          }
        ]);


        // Find Shop Report count in MongoDB - aggregate by group_id and calculate count
        const shopReports = await ShopReport.aggregate([
          {
            $match: {
              "shop.id": first_group.id,
              date: { $gte: date_from, $lt: date_to }
            }
          },
          {
            $group: {
              _id: "$shop.id",
              count: { $sum: 1 }
            }
          }
        ]);

        // Find CoachingCount in MongoDB - aggregate by group_id and calculate count
        const coachingReports = await Coaching.aggregate([
          {
            $match: {
              "user.frontline_id": first_group.id,
              date: { $gte: date_from, $lt: date_to }
            }
          },
          {
            $group: {
              _id: "user.frontline_id",
              count: { $sum: 1 }
            }
          }
        ]);

        // Find FeedbackCount in MongoDB - aggregate by group_id and calculate count
        const feedbackReports = await Feedback.aggregate([
          {
            $match: {
              "user.frontline_id": first_group.id,
              date: { $gte: date_from, $lt: date_to }
            }
          },
          {
            $group: {
              _id: "user.frontline_id",
              count: { $sum: 1 }
            }
          }
        ]);
        // Prepare groups
        const groups_arr = shops.map(element => {
          const shopEvals = evaluations.find(eval => eval._id == element.id);
          const shopEvals7P = evaluations7P.find(eval => eval._id == element.id);
          const shopVisits = shopReports.find(report => report._id == element.id);
          const coachingItem = coachingReports.find(report => report._id == element.id);
          const feedbackItem = feedbackReports.find(report => report._id == element.id);

          const group_obj = {
            id: element.id,
            name: element.name,
            evalCount: shopEvals != undefined ? shopEvals.count : null,
            evalAvg: shopEvals != undefined ? shopEvals.avg : null,
            evalCount7P: shopEvals7P != undefined ? shopEvals7P.count : null,
            evalAvg7P: shopEvals7P != undefined ? shopEvals7P.avg : null,
            reportsCount: shopVisits != undefined ? shopVisits.count : null,
            coachingCount: coachingItem != undefined ? coachingItem.count : null,
            feedbackCount: feedbackItem != undefined ? feedbackItem.count : null,
          };

          return group_obj;
        });

        res.json({ groups_array: groups_arr });
      } else if (first_group.nest_depth <= 2) {
        // REGIONAL AND HEAD ACCESS
        // MySQL Query - Find shops by user

        const [shops, fields] = await connection.execute(
          `SELECT * FROM rainlab_user_elearn_group WHERE nest_depth=3 AND nest_left>${first_group.nest_left} AND nest_right<${first_group.nest_right}`
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
              _id: "$user.group_id",
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
              _id: "$user.group_id",
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
              _id: "$shop.id",
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
              _id: "$user.group_id",
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
              _id: "$user.group_id",
              count: { $sum: 1 }
            }
          }
        ]); 

        // Prepare groups
        const groups_arr = shops.map(element => {
          const shopEvals = evaluations.find(eval => eval._id == element.id);
          const shopEvals7P = evaluations7P.find(eval => eval._id == element.id);
          const shopVisits = shopReports.find(report => report._id == element.id);
          const coachingItem = coachingReports.find(report => report._id == element.id);
          const feedbackItem = feedbackReports.find(report => report._id == element.id);         

          const group_obj = {
            id: element.id,
            name: element.name,
            evalCount: shopEvals != undefined ? shopEvals.count : null,
            evalAvg: shopEvals != undefined ? shopEvals.avg : null,
            evalCount7P: shopEvals7P != undefined ? shopEvals7P.count : null,
            evalAvg7P: shopEvals7P != undefined ? shopEvals7P.avg : null,
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

// @route POST api/shops/withEval/region/:region_id
// @description All shops from the region with evaluations
// @access Private
router.post(
  "/withEval/region/:region_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const region_id = parseInt(req.params.region_id);

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

      // MySQL Query - Find shops from the region
      const [shops, fields] = await connection.execute(
        `SELECT * FROM rainlab_user_elearn_group WHERE nest_depth=3 AND parent_id=${region_id}`
      );

      // Find evaluations in MongoDB - aggregate by group_id and calculate count and avg
      const evaluations = await Evaluation.aggregate([
        {
          $match: { "user.group_parent_id": region_id }
        },
        {
          $group: {
            _id: "$user.group_id",
            avg: { $avg: "$evaluation.score" },
            count: { $sum: 1 }
          }
        }
      ]);
    
      const shopReports = await ShopReport.aggregate([
        {
          $match: {
            "shop.parent_id": region_id,
            date: { $gte: date_from, $lt: date_to }
          }
        },
        {
          $group: {
            _id: "$shop.id",
            count: { $sum: 1 }
          }
        }
      ]);

      // Prepare groups
      const groups_arr = shops.map(element => {
        const shopEvals = evaluations.find(eval => eval._id == element.id);
        const shopVisits = shopReports.find(report => report._id == element.id);
        const group_obj = {
          id: element.id,
          name: element.name,
          evalCount: shopEvals != undefined ? shopEvals.count : null,
          evalAvg: shopEvals != undefined ? shopEvals.avg : null,
          reportsCount: shopVisits != undefined ? shopVisits.count : null
        };

        return group_obj;
      });

      res.json({ groups_array: groups_arr });
    } catch (e) {
      res.json(e);
    }
  }
);

module.exports = router;
