const express = require("express");
const router = express.Router();
const LdapClient = require("ldapjs-client");
const ldapParams = require("../../config/ldap");
const tokenKey = require("../../config/keys").tokenKey;
const mysql = require("mysql2/promise");
const mysqlConn = require("../../config/mysql").connection;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Init LDAP client
const client = new LdapClient({ url: ldapParams.ldapURL });

// @route  POST api/login
// @description Connection to LDAP with username and password
// @access Public
router.post("/login", async (req, res) => {
  // Post vars
  const username = req.body.username;
  const password = req.body.password;

  // LDAP bind
  try {
    await client.bind(`AD\\${username}`, password);

    // LDAP search by domain
    try {
      const options = {
        filter: `(sAMAccountName=${username})`,
        scope: "sub",
      };

      const entries = await client.search(ldapParams.domainSearch, options);

      // Deconstruct result - only one allowed
      if (entries.length > 0) {
        const { mail } = entries[0];
        console.log("Enriji postoje");
        if (mail != null && mail != undefined) {
          console.log("LDAP OK: " + mail);
        }

        // MySQL connection
        const connection = await mysql.createConnection(mysqlConn);

        // MySQL Query - Find FL user by email
        const [user, user_fields] = await connection.execute(
          `SELECT * FROM users WHERE email='${mail}' LIMIT 1`
        );

        // MySQL Query - Find groups by user ID
        const [groups, group_fields] = await connection.execute(
          `SELECT * FROM rainlab_user_elearn_pivot
           LEFT JOIN rainlab_user_elearn_group
           ON rainlab_user_elearn_pivot.group_id=rainlab_user_elearn_group.id
           WHERE user_id=${user[0].id};`
        );

        // Prepare groups
        const groups_arr = groups.map(element => {
          const group_obj = {
            id: element.id,
            name: element.name,
            active: element.active,
            nest_left: element.nest_left,
            nest_right: element.nest_right,
            nest_depth: element.nest_depth,
            parent_id: element.parent_id,
          };

          return group_obj;
        });

        // Data for JWT
        const payload = {
          username: username,
          email: mail,
          fullname: user[0].name + " " + user[0].surname,
          frontline_id: user[0].id,
          elearningrole: user[0].elearningrole,
          frontline_groups: groups_arr,
        };

        // Create JWT
        jwt.sign(
          payload,
          tokenKey,
          {
            expiresIn: 36000,
          },
          (err, token) => {
            res.json({
              login: "Login success",
              token: token,
              payload: payload,
            });
          }
        );
      } else {
        return res.status(404).json({ login: "Login error, user not found" });
      }
    } catch (e) {
      return res.status(404).json({ login: "Login error, user not found" });
    }
  } catch (e) {
    // If user does not exist in LDAP then we try to check if he exist in October's database
    try {
      // MySQL connection
      const connection = await mysql.createConnection(mysqlConn);

      // MySQL Query - Find FL user by email
      const [user] = await connection.execute(
        `SELECT * FROM users WHERE username='${username}' LIMIT 1`
      );

      hash = user[0].password.replace(/^\$2y(.+)$/i, "$2a$1");

      bcrypt.compare(password, hash, async (err, result) => {
        //console.log(result);
        if (result) {
          //console.log("Proso si");
          // MySQL Query - Find groups by user ID
          const [groups, group_fields] = await connection.execute(
            `SELECT * FROM rainlab_user_elearn_pivot
           LEFT JOIN rainlab_user_elearn_group
           ON rainlab_user_elearn_pivot.group_id=rainlab_user_elearn_group.id
           WHERE user_id=${user[0].id};`
          );

          // Prepare groups
          const groups_arr = groups.map(element => {
            const group_obj = {
              id: element.id,
              name: element.name,
              active: element.active,
              nest_left: element.nest_left,
              nest_right: element.nest_right,
              nest_depth: element.nest_depth,
              parent_id: element.parent_id,
            };

            return group_obj;
          });

          // Data for JWT
          const payload = {
            username: username,
            email: user[0].email,
            fullname: user[0].name + " " + user[0].surname,
            frontline_id: user[0].id,
            elearningrole: user[0].elearningrole,
            frontline_groups: groups_arr,
          };

          // Create JWT
          jwt.sign(
            payload,
            tokenKey,
            {
              expiresIn: 36000,
            },
            (err, token) => {
              res.json({
                login: "Login success",
                token: token,
                payload: payload,
              });
            }
          );
        } else {
          return res.status(401).json({ error: "Pogrešna lozinka" });
        }
      });
    } catch (e) {
      return res.status(404).json({ error: "Uneti username ne postoji" });
    }
  }
});

// @route  POST api/loginFL
// @description Generate JWT for users from FL
// @access Public
router.post("/loginFL", async (req, res) => {
  try {
    // Post vars
    const persist_code = req.body.persist_code;
    const pcode = persist_code.replace(/€/g, "/");
    // MySQL connection
    const connection = await mysql.createConnection(mysqlConn);

    // MySQL Query - Find FL user by email
    const [user, user_fields] = await connection.execute(
      `SELECT * FROM users WHERE persist_code='${pcode}' LIMIT 1`
    );
    if (user.length > 0) {
      // MySQL Query - Find groups by user ID
      const [groups, group_fields] = await connection.execute(
        `SELECT * FROM rainlab_user_elearn_pivot
           LEFT JOIN rainlab_user_elearn_group
           ON rainlab_user_elearn_pivot.group_id=rainlab_user_elearn_group.id
           WHERE user_id=${user[0].id};`
      );

      // Prepare groups
      const groups_arr = groups.map(element => {
        const group_obj = {
          id: element.id,
          name: element.name,
          active: element.active,
          nest_left: element.nest_left,
          nest_right: element.nest_right,
          nest_depth: element.nest_depth,
          parent_id: element.parent_id,
        };

        return group_obj;
      });

      // Data for JWT
      const payload = {
        username: user[0].username,
        email: user[0].email,
        fullname: user[0].name + " " + user[0].surname,
        frontline_id: user[0].id,
        elearningrole: user[0].elearningrole,
        frontline_groups: groups_arr,
      };

      // Create JWT
      jwt.sign(payload, tokenKey, (err, token) => {
        res.json({
          login: "Login success",
          token: token,
          payload: payload,
        });
      });
    } else {
      return res.status(404).json({ login: "Login failed. User not found." });
    }
  } catch (e) {
    return res.status(401).json({ login: "Login failed." });
  }
});

module.exports = router;
