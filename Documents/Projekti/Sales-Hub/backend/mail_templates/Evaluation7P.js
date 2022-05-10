const nodemailer = require("nodemailer");

const evalution7PSavedMail = evaluation => {
  // Send email
  let transporter = nodemailer.createTransport({
    sendmail: true,
    newline: "unix",
    path: "/usr/sbin/sendmail",
  });
  transporter.sendMail(
    {
      from: "salesbox@telenor.rs",
      to: evaluation.user.email,
      subject: "Sales Box - Nova 7P ocena",
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
                    <h2>Nova 7P ocena</h2>
                  <table width="50%" border="1px solid #444;" cellpadding="4" 
                  cellspacing="3" bgcolor="#FEFEFE">
                      
                      <thead>
                      <tr>
                          <td width="25%" align="center" valign="top" bgcolor="#0D588D">
                            <font color="white">Ocenio</font>
                          </td>
                          <td width="15%" align="center" valign="top" bgcolor="#0D588D">
                            <font color="white">Ocena</font>
                          </td>
                      </tr>
                      </thead>
                      <tbody>
                          
                          <tr>
                              
                          <td align="center" valign="top">${evaluation.evaluator.fullname}</td>
                          <td align="center" valign="top"><strong>${evaluation.evaluation.score}</strong></td>
              
                          </tr>
                          
                          
                      </tbody>
                  </table>
                  <p>Detaljniji prikaz ocene možete videti u Sales Box aplikaciji.</p>
                </center>
              </body>
              </html>`,
    },
    (err, info) => {
      console.log(err);
    }
  );
};

const feedbackReplyMail = evaluation => {
  let transporter = nodemailer.createTransport({
    sendmail: true,
    newline: "unix",
    path: "/usr/sbin/sendmail",
  });
  transporter.sendMail(
    {
      from: "salesbox@telenor.rs",
      to: evaluation.evaluator.email,
      subject: "Sales Box - 7P odgovor prodavca",
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
                        <h2>Nova 5G ocena</h2>
                      <table width="50%" border="1px solid #444;" cellpadding="4"
                      cellspacing="3" bgcolor="#FEFEFE">

                          <thead>
                          <tr>
                              <td width="25%" align="center" valign="top" bgcolor="#0D588D">
                                <font color="white">Ime prodavca</font>
                              </td>
                              <td width="15%" align="center" valign="top" bgcolor="#0D588D">
                                <font color="white">Shop</font>
                              </td>
                          </tr>
                          </thead>
                          <tbody>

                              <tr>

                              <td align="center" valign="top">${evaluation.user.fullname}</td>
                              <td align="center" valign="top"><strong>${evaluation.user.group_name}</strong></td>

                              </tr>

                          </tbody>
                      </table>
                      <p>Prodavac je odgovorio na vaš savet za unapređenje prodajnih veština</p>
                    </center>
                  </body>
                  </html>`,
    },
    (err, info) => {
      console.log(err);
    }
  );
};

module.exports.evalution7PSavedMail = evalution7PSavedMail;
module.exports.feedbackReplyMail = feedbackReplyMail;
