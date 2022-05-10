const express = require("express");
const router = express.Router();
const passport = require("passport");
const mysql = require("mysql2/promise");
const mysqlConn = require("../../config/mysql").connection;
const multer = require("multer");
const sharp = require("sharp");
// Multer
// Set multer to store files into memory so we can access them later
const multerStorage = multer.memoryStorage();
// Filter which file types are accepted
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Please upload an image file"), false);
  }
};
// Congigure Multer middleware
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
// @route GET api/users/:frontline_id
// @description View user's details by frontline ID
// @access Private
router.get(
  "/:frontline_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Find single user form FL database
    try {
      // MySQL connection
      const connection = await mysql.createConnection(mysqlConn);

      // MySQL Query - Find FL user by ID
      const frontline_id = parseInt(req.params.frontline_id);
      const [user, user_fields] = await connection.execute(
        `SELECT users.id,
                users.username,
                CONCAT(users.name, ' ', users.surname) AS fullname,
                users.email,
                rainlab_user_elearn_group.name as group_name,
                rainlab_user_elearn_group.id as group_id,
                rainlab_user_elearn_group.nest_left as group_nest_left,
                rainlab_user_elearn_group.nest_right as group_nest_right,
                rainlab_user_elearn_group.nest_depth as group_nest_depth,
                rainlab_user_elearn_group.parent_id as group_parent_id
        FROM users
        LEFT JOIN rainlab_user_elearn_pivot ON users.id=rainlab_user_elearn_pivot.user_id
        LEFT JOIN rainlab_user_elearn_group ON rainlab_user_elearn_pivot.group_id=rainlab_user_elearn_group.id
        WHERE users.id=${frontline_id} LIMIT 1`
      );

      return res.json(user[0]);
    } catch (e) {
      res.json(e);
    }
  }
);

// @route GET api/users
// @description All users from related to groups in JWT
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Get user's groups from JWT
      const first_group = req.user.frontline_groups[0];

      // MySQL connection
      const connection = await mysql.createConnection(mysqlConn);

      // Find IDs of all groups and subgroups
      let groups_ids_string = "";

      // SHOP LEADER ACCESS
      if (first_group.nest_depth == 3) {
        groups_ids_string = first_group.id;

        // RSM and HEAD ACCESS
      } else if (first_group.nest_depth <= 2) {
        const [groups_ids, fields] = await connection.execute(
          `SELECT id FROM rainlab_user_elearn_group
          WHERE nest_left>${first_group.nest_left}
          AND nest_right<${first_group.nest_right}`
        );

        // Prepare group IDs string
        const groups_ids_arr = groups_ids.map(element => element.id);

        groups_ids_string = groups_ids_arr.join();
      }

      // Find all users related to ids of groups
      const [users, users_fields] = await connection.execute(
        `SELECT 
            users.id,
            users.username,
            users.name,
            users.surname,
            users.email,
            rainlab_user_elearn_group.id as group_id,
            rainlab_user_elearn_group.nest_left as group_nest_left,
            rainlab_user_elearn_group.nest_right as group_nest_right,
            rainlab_user_elearn_group.nest_depth as group_nest_depth,
            rainlab_user_elearn_group.parent_id as group_parent_id,
            rainlab_user_elearn_group.name as group_name
        FROM rainlab_user_elearn_pivot
        LEFT JOIN users ON rainlab_user_elearn_pivot.user_id=users.id
        LEFT JOIN rainlab_user_elearn_group ON rainlab_user_elearn_pivot.group_id=rainlab_user_elearn_group.id
        WHERE users.deleted_at IS NULL AND users.elearningrole!=3 AND users.id!=${req.user.frontline_id}
        AND rainlab_user_elearn_pivot.group_id IN (${groups_ids_string})`
      );

      // Filter out unnecessary fields
      const users_filtered = users.map(user => {
        return {
          id: user.id,
          fullname: user.name + " " + user.surname,
          email: user.email,
          username: user.username,
          group_name: user.group_name,
          group_id: user.group_id,
          group_nest_left: user.group_nest_left,
          group_nest_right: user.group_nest_right,
          group_nest_depth: user.group_nest_depth,
          group_parent_id: user.group_parent_id,
          elearningrole: user.elearningrole
        };
      });

      return res.json({ users: users_filtered });
    } catch (e) {
      res.json(e);
    }
  }
);

// @route GET api/users/shop/:shop_id
// @description All users from shop by shop id
// @access Private
router.get(
  "/shop/:shop_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const shop_id = req.params.shop_id;

      // MySQL connection
      const connection = await mysql.createConnection(mysqlConn);

      // Find all users from shop
      const [users, users_fields] = await connection.execute(
        `SELECT 
            users.id,
            users.username,
            users.name,
            users.surname,
            users.email,
            rainlab_user_elearn_group.id as group_id,
            rainlab_user_elearn_group.nest_left as group_nest_left,
            rainlab_user_elearn_group.nest_right as group_nest_right,
            rainlab_user_elearn_group.nest_depth as group_nest_depth,
            rainlab_user_elearn_group.parent_id as group_parent_id,
            rainlab_user_elearn_group.name as group_name
        FROM rainlab_user_elearn_pivot
        LEFT JOIN users ON rainlab_user_elearn_pivot.user_id=users.id
        LEFT JOIN rainlab_user_elearn_group ON rainlab_user_elearn_pivot.group_id=rainlab_user_elearn_group.id
        WHERE users.deleted_at IS NULL AND users.elearningrole!=3
        AND rainlab_user_elearn_pivot.group_id=${shop_id}`
      );

      // Filter out unnecessary fields
      const users_filtered = users.map(user => {
        return {
          id: user.id,
          fullname: user.name + " " + user.surname,
          email: user.email,
          username: user.username,
          group_name: user.group_name,
          group_id: user.group_id,
          group_nest_left: user.group_nest_left,
          group_nest_right: user.group_nest_right,
          group_nest_depth: user.group_nest_depth,
          group_parent_id: user.group_parent_id,
          elearningrole: user.elearningrole
        };
      });

      return res.json({ users: users_filtered });
    } catch (e) {
      res.json(e);
    }
  }
);

// @route POST api/users/avatarPicture
// @description Upload pictures to fronted/public/uploads/usersAvatar/
// @access Private
router.post(
  "/avatarPicture/:userName/:userId",
  passport.authenticate("jwt", { session: false }),
  upload.array("photos", 1),
  async (req, res) => {
    //Check if files are sent
    if (!req.files) {
      return res.status(404).json({ msg: "No images uploded" });
    }

    // Initialise images array into req.body object
    req.body.images = [];

    // Photos array - loop over them and save them
    await Promise.all(
      req.files.map(async (file, i) => {
        const filename = `${req.params.userId}`;

        try {
          await sharp(file.buffer)
            .resize(1000, 1000)
            .toFile(`../frontend/public/uploads/usersAvatar/${filename}`);
          // Populate images array with names of uploaded photos
          req.body.images.push(filename);
          res.json({ imgUpload: true });
        } catch (err) {
          console.log(err);
        }
      })
    );
  }
);

module.exports = router;
