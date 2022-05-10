function generateMailTemplate(to, user_fullname, coach_fullname) {
  return {
    from: "salesbox@telenor.rs",
    to: to,
    subject: `Sales Box - Novi koučing`,
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
                          <h2>Novi koučing</h2>
                          <table width="50%" border="1px solid #444;" cellpadding="4" 
                          cellspacing="3" bgcolor="#FEFEFE">
                              
                              <thead>
                              <tr>
                                  <td width="50%" align="center" valign="top" bgcolor="#0D588D">
                                  <font color="white">Koučing uneo</font>
                                  </td>
                                  <td width="50%" align="center" valign="top" bgcolor="#0D588D">
                                  <font color="white">Koučing dobio</font>
                                  </td>
                              </tr>
                              </thead>
                              <tbody>
                                  <tr>
                                  <td align="center" valign="top">${coach_fullname}</td>
                                  <td align="center" valign="top">${user_fullname}</td>
                                  </tr>
                              </tbody>
                          </table>
                          <p>Akcije za uneti koučing možete videti u Sales Box aplikaciji.</p>
                      </center>
                      </body>
                      </html>`
  };
}

module.exports.generateMailTemplate = generateMailTemplate;
