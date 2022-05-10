const mysql = require("mysql2/promise");
const mysqlConn = require("../config/mysql").connection;

async function genarateMailList(shop_id, region_id) {
  try {
    // MySQL connection
    const connection = await mysql.createConnection(mysqlConn);

    // MySQL Query - Find users from group ids
    const [maillist, fields] = await connection.execute(
      `SELECT users.email
              FROM users
              LEFT JOIN rainlab_user_elearn_pivot ON users.id=rainlab_user_elearn_pivot.user_id
              WHERE users.elearningrole=2 AND 
              (rainlab_user_elearn_pivot.group_id=${shop_id} OR
              rainlab_user_elearn_pivot.group_id=${region_id})`
    );
    const maillist_mapped = maillist.map(mail => mail.email);
    return maillist_mapped;
  } catch (e) {
    console.log(e);
  }
}

function generateMailTemplate(to, shop, evaluator) {
  return {
    from: "salesbox@telenor.rs",
    to: to,
    subject: `Sales Box - Novi Shop Report za ${shop.fullname}`,
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
                          <h2>Novi Shop Report</h2>
                          <table width="50%" border="1px solid #444;" cellpadding="4" 
                          cellspacing="3" bgcolor="#FEFEFE">
                              
                              <thead>
                              <tr>
                                  <td width="50%" align="center" valign="top" bgcolor="#0D588D">
                                  <font color="white">Izveštaj uneo</font>
                                  </td>
                                  <td width="50%" align="center" valign="top" bgcolor="#0D588D">
                                  <font color="white">Prodavnica</font>
                                  </td>
                              </tr>
                              </thead>
                              <tbody>
                                  <tr>
                                  <td align="center" valign="top">${evaluator.fullname}</td>
                                  <td align="center" valign="top"><strong>${shop.fullname}</strong></td>
                                  </tr>
                              </tbody>
                          </table>
                          <p>Detaljniji prikaz izveštaja možete videti u Sales Box aplikaciji.</p>
                      </center>
                      </body>
                      </html>`
  };
}

module.exports.genarateMailList = genarateMailList;
module.exports.generateMailTemplate = generateMailTemplate;
