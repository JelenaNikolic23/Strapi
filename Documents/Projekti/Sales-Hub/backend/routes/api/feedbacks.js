const express = require("express");
const router = express.Router();
const passport = require("passport");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
const Feedback = require("../../models/Feedback");
//const cors = require("cors");

// Multer
// Set multer to store files into memory so we can access them later
const multerStorage = multer.memoryStorage();
// Filter which file types are accepted
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("application/pdf")) {
    cb(null, true);
  } else {
    cb(new Error("Please upload an pdf file"), false);
  }
};
// Congigure Multer middleware
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// @route POST api/feedbacks/add
// @description Add new feedback to DB
// @access Private
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Data
    const feedback = req.body;

    // Prepare DB document
    const newFeedback = new Feedback(feedback);

    newFeedback
      .save()
      .then(feedback => {
        const pdfData = {
          date: feedback.date,
          score: feedback.score,
          feedback: feedback.feedback,
          evaluator: feedback.evaluator.fullname,
          user: feedback.user.fullname,
        };

        // Send email
        let transporter = nodemailer.createTransport({
          sendmail: true,
          newline: "unix",
          path: "/usr/sbin/sendmail",
        });
        transporter.sendMail(
          {
            from: "salesbox@telenor.rs",
            to: feedback.user.email,
            subject: "Sales Box - Novi Feedback",
            html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
                      <html lang="en">
                      <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                      
                        <title></title>
                      
                        <style type="text/css">
                        </style>    
                      </head>
                      <body style="margin:0; padding:0; background-color:#F2F2F2;">
                        <center>
                            <h2>Novi Feedback</h2>
                          <table width="50%" border="1px solid #444;" cellpadding="4" 
                          cellspacing="3" bgcolor="#FEFEFE">
                              
                              <thead>
                              <tr>
                                  <td width="25%" align="center" valign="top" bgcolor="#0D588D">
                                    <font color="white">Kreirao</font>
                                  </td>
                                  <td width="20%" align="center" valign="top" bgcolor="#0D588D">
                                  <font color="white">Ocena Feedback-a</font>
                                  </td>
                                  <td width="35%" align="center" valign="top" bgcolor="#0D588D">
                                    <font color="white">Naslov</font>
                                  </td>
                              </tr>
                              </thead>
                              <tbody>
                                  
                                  <tr>
                                      
                                  <td align="center" valign="top">${feedback.evaluator.fullname}</td>
                                  <td align="center" valign="top"><strong>${feedback.score}</strong></td>
                                  <td align="center" valign="top">${feedback.title}</td>
                                  </tr>
                                  
                                  
                              </tbody>
                          </table>
                          <p>Detaljniji prikaz feedback-a možete videti u Sales Box aplikaciji.</p>
                        </center>
                      </body>
                      </html>`,
          },
          (err, info) => {
            console.log(err);
          }
        );

        // Retaurn feedback
        res.json(pdfData);
      })
      .catch(err => console.log(err));
  }
);

// @route GET api/feedbacks/user/:frontline_id/:limit?
// @description View user's feedbacks
// @access Private
router.get("/user/:frontline_id/", (req, res) => {
  const limit = parseInt(3);
  let feedbackNum = 0;
  if (!isNaN(limit)) {
    feedbackNum = limit;
  }

  Feedback.find({ "user.frontline_id": req.params.frontline_id })
    .sort({ date: -1 })
    .limit(feedbackNum)
    .then(feedback => {
      res.json(feedback);
    })
    .catch(err =>
      res.status(404).json({ feedbacknotfound: "Feedback not found" })
    );
});

// @route POST api/feedbacks/:id/scanFile
// @description Upload pictures to fronted/public/uploads/feedbacks/scanFiles and reference them in Feedback
// @access Private
router.post(
  "/:id/scanFile",
  passport.authenticate("jwt", { session: false }),
  upload.array("file", 1),
  async (req, res) => {
    //Check if files are sent
    if (!req.files) {
      return res.status(404).json({ msg: "No file uploded" });
    }

    // file array - loop over them and save them
    await Promise.all(
      req.files.map(async file => {
        const PdfUploadPath = process.env.FEEDBACK_PDF_UPLOAD_PATH;
        const filename = `${Date.now()}-${file.originalname}`;
        const filePath = `${PdfUploadPath}/${filename}`;

        try {
          await fs.writeFileSync(filePath, file.buffer, "binary");
        } catch (err) {
          console.log(err);
        }

        // Update Feedback scanFile field with filename
        try {
          const updatedFeedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { fileScan: filename }
          );
          return res
            .status(200)
            .json({ fileName: filename, msg: "Fajl je uspešno snimljen" });
        } catch (err) {
          return res.status(404).json({
            msg: "Došlo je do greške. Fajl nije snimljen",
          });
        }
      })
    );
  }
);

module.exports = router;
