const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const sharp = require("sharp");
// DB load Shop Report model
const ShopReport = require("../../models/ShopReport");
// Mail init
const nodemailer = require("nodemailer");
const {
  genarateMailList,
  generateMailTemplate,
} = require("../../mail_templates/ShopReportSaved");

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
  fileFilter: multerFilter,
});

// @route POST api/shopReports/add
// @description Add new Shop Report evaluation to DB
// @access Private
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Data
    const shopReport = req.body;

    // Prepare DB document
    const newShopReport = new ShopReport(shopReport);

    newShopReport
      .save()
      .then(shopReport => {
        // Send email
        let transporter = nodemailer.createTransport({
          sendmail: true,
          newline: "unix",
          path: "/usr/sbin/sendmail",
        });
        // Prepare mail list
        genarateMailList(
          shopReport.shop.id,
          shopReport.evaluator.frontline_groups[0].parent_id
        )
          .then(list => {
            // Send separate mail for each recipient
            list.forEach(mailAddress => {
              transporter.sendMail(
                generateMailTemplate(
                  mailAddress,
                  shopReport.shop,
                  shopReport.evaluator
                ),
                (err, info) => {
                  console.log(err);
                }
              );
            });
          })
          .catch(err => console.log(err));

        res.json({ id: shopReport._id, shopData: shopReport.shop });
      })
      .catch(err => console.log(err));
  }
);

// @route POST api/shopReports/:id/pictures
// @description Upload pictures to fronted/public/uploads/shopReport and reference them in Shop Report evaluation
// @access Private
router.post(
  "/:id/pictures",
  passport.authenticate("jwt", { session: false }),
  upload.array("photos", 3),
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
        const filename = `${Date.now()}-${i + 1}-${file.originalname}`;

        try {
          const uploadPath = process.env.SHOP_REPORT_PICTURES_UPLOAD_PATH;
          const image = await sharp(file.buffer);
          await image.metadata((err, metadata) => {
            if (metadata.height > metadata.width) {
              image.rotate(-90);
            }
            return image
              .resize(1000, 1000, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
              })
              .toFile(`${uploadPath}/${filename}`);
          });
          // Populate images array with names of uploaded photos
          req.body.images.push(filename);
        } catch (err) {
          console.log(err);
        }
      })
    );
    // Update Shop Reports picture field with req.body.images
    try {
      const shopReport = await ShopReport.findByIdAndUpdate(
        req.params.id,
        { pictures: req.body.images }
        // {
        //   new: true
        // }
      );
      return res.status(200).json({ msg: "Slike su uspešno snimljene" });
    } catch (err) {
      return res.status(404).json({
        msg: "Došlo je do greške. Slike nisu snimljene",
      });
    }
  }
);

// @route GET api/shopReports/shop/:shop_id
// @description View list of Shop Reports created for selected shop
// @access Private
router.get(
  "/shop/:shop_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const summary = await ShopReport.aggregate([
        {
          $match: {
            "shop.id": parseInt(req.params.shop_id),
          },
        },
        {
          $project: {
            date: "$date",
            evaluator: "$evaluator.fullname",
          },
        },
      ]);
      res.json(summary);
    } catch (e) {
      console.log(e);
    }
  }
);

// @route GET api/shopReports/:shopReport_id
// @description View Shop Report evaluation
// @access Private
router.get(
  "/:shopReport_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ShopReport.findById(req.params.shopReport_id)
      .populate("ActionPlans")
      .exec((err, shopReport) => {
        if (err) {
          console.log(err);
        }
        console.log(shopReport);
        return res.json(shopReport);
      });

    // .then(shopReport => {
    //   res.json(shopReport);
    // })
    // .catch(err =>
    //   res.status(404).json({ shopReportfound: "Shop Report not found" })
    // );
  }
);

// @route GET api/evaluations/dashboard/evaluatorCount
// @description View how many Shop Reports evaluators have created - current month
// @access Private
router.get(
  "/dashboard/evaluatorCount",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Get user's groups from JWT
      const first_group = req.user.frontline_groups[0];
      const now = new Date();
      const curMonth = now.getMonth() + 1; // mongo is not 0 based
      const curYear = now.getFullYear();

      // Aggregate evaluators in your scope
      const evaluatorCount = await ShopReport.aggregate([
        {
          $match: {
            "shop.nest_left": { $gt: first_group.nest_left },
            "shop.nest_right": { $lt: first_group.nest_right },
          },
        },
        {
          $project: {
            month: { $month: "$date" },
            year: { $year: "$date" },
            evaluator_id: "$evaluator.frontline_id",
            evaluator_name: "$evaluator.fullname",
          },
        },
        {
          $match: {
            month: { $eq: curMonth },
            year: { $eq: curYear },
          },
        },
        {
          $group: {
            _id: "$evaluator_id",
            fullname: { $first: "$evaluator_name" },
            count: { $sum: 1 },
          },
        },
      ]);

      res.json(evaluatorCount);
    } catch (e) {
      console.log(e);
    }
  }
);

module.exports = router;
