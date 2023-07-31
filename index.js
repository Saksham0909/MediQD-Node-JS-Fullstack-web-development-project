// ------------------------------------------------ Dependencies used ------------------------------------------------
var express = require("express");
var fileuploader = require("express-fileupload");
var nodemailer = require("nodemailer");
var mysql = require("mysql2");
var app = express();


// ------------------------------------------------ Port configuration ------------------------------------------------
var PORT = 3000;
app.listen(PORT, function () {
  console.log(`Server started at port:- ${PORT}`);
});


// ------------------------------------------------ Dependencies configuration ------------------------------------------------
app.use(express.static("public"));
app.use(fileuploader());
app.use(express.urlencoded(true));

var dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "Kumar@29",
  database: "signupform",
};

var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function (err) {
  if (err == null) {
    console.log(`Successfully connected to:- ${dbConfig.database}`);
  } else {
    console.log(err);
  }
});

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "arora.saksham.k@gmail.com",
    pass: "zvhwbcctnsnmayxu",
  }
});


// ------------------------------------------------ Index page API's started ------------------------------------------------
// ------------------------------------------------ Signup email check function ------------------------------------------------
app.get("/signup-chk-email", function (req, resp) {
  var email = req.query.emailentered;
  dbCon.query("select * from users1 where email = ?", [email], function (err, result) {
      if (err == null) {
        if (result.length == 1) {
          resp.send(" Email already exists, please login...");
        } else {
          resp.send(" Available...");
        }
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Do signup function ------------------------------------------------
app.get("/dosignup", function (req, resp) {
  var email = req.query.emailentered;
  var pwd = req.query.pwdentered;
  var type = req.query.typeentered;

  var mailOptions = {
    from: "arora.saksham.k@gmail.com",
    to: email,
    subject: "Account has been created on MEDIQD.com",
    text: `Welcome ${email}, you have been successfully registed as a ${type} on our website. If not please just ignore this mail. With regards from MediQD`
  };

  dbCon.query("insert into users1 values(?,?,?,current_date(),1)", [email, pwd, type], function (err) {
      if (err == null) {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log(`Email successfully sent to ${email}`);
          }
        });
        resp.send("Record saved successfully");
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Do login function ------------------------------------------------
app.get("/dologin", function (req, resp) {
  var email = req.query.emailentered;
  var pwd = req.query.pwdentered;

  var mailOptions = {
    from: "arora.saksham.k@gmail.com",
    to: email,
    subject: "Account login on MEDIQD.com",
    text: `Your email:- ${email} has been used to login on our website. If not please please check your account activity and if possible change your account password to something secure. With regards from MediQD`
  };

  dbCon.query("select * from users1 where email = ?", [email], function (err, result) {
      if (err == null) {
        if (result.length == 1) {
          if (result[0].pwd == pwd) {
            if (result[0].status == 1) {
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log(`Email successfully sent to ${email}`);
                }
              });
              resp.send(result[0].type);
            } else {
              resp.send(" The user has been blocked...");
            }
          } else {
            resp.send(" Invalid password...");
          }
        } else {
          resp.send(" No user found...");
        }
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Index page API's ended ------------------------------------------------


// ------------------------------------------------ Donor profile page API's started ------------------------------------------------
// ------------------------------------------------ Do donor profile search function ------------------------------------------------
app.get("/profile-donor-search", function (req, resp) {
  var email = req.query.emailentered;
  dbCon.query("select * from donors where email = ?", [email], function (err, result) {
      if (err == null) {
        resp.send(result);
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Do donor profile submit function ------------------------------------------------
app.post("/profile-donor-submit", function (req, resp) {
  var email = req.body.txtemail;
  var name = req.body.txtname;
  var contact = req.body.txtcontact;
  var address = req.body.txtaddress;
  var city = req.body.txtcity;
  var proof = req.body.txtid;
  var pic = "nopic.jpg";
  var ahours = req.body.fromtime + "," + req.body.totime;

  if (req.files != null) {
    pic = req.files.txtimage.name;
    var path = process.cwd() + "/public/uploads/" + pic;
    req.files.txtimage.mv(path);
  }

  dbCon.query("insert into donors values(?,?,?,?,?,?,?,?)", [email, name, contact, address, city, proof, pic, ahours], function (err) {
      if (err == null) {
        resp.sendFile(process.cwd()+"/public/record-saved.html");
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Do donor profile update function ------------------------------------------------
app.post("/profile-donor-update", function (req, resp) {
  var email = req.body.txtemail;
  var name = req.body.txtname;
  var contact = req.body.txtcontact;
  var address = req.body.txtaddress;
  var city = req.body.txtcity;
  var proof = req.body.txtid;
  var pic = "nopic.jpg";
  var ahours = "";
  ahours = req.body.fromtime + "," + req.body.totime;

  if (req.files != null) {
    pic = req.files.txtimage.name;
    var path = process.cwd() + "/public/uploads/" + pic;
    req.files.txtimage.mv(path);
  } else {
    pic = req.body.hdnpicname;
  }

  dbCon.query("update donors set name = ?, mobile = ?, address = ?, city = ?, proof = ?, pic = ?, ahours = ? where email = ?", [name, contact, address, city, proof, pic, ahours, email], function (err) {
      if (err == null) {
        resp.sendFile(process.cwd()+"/public/record-saved.html");
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Donor profile page API's ended ------------------------------------------------


// ------------------------------------------------ Avail medicines page API's started ------------------------------------------------
// ------------------------------------------------ Donor do avail function ------------------------------------------------
app.get("/doavail", function (req, resp) {
  var email = req.query.emailsent;
  var med = req.query.medsent;
  var expdate = req.query.expdatesent;
  var packing = req.query.packingsent;
  var qty = req.query.qtysent;
  dbCon.query("insert into medsavailable value(0,?,?,?,?,?)", [email, med, expdate, packing, qty], function (err) {
      if (err == null) {
        resp.send("Added successfully");
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Avail medicines page API's ended ------------------------------------------------


// ------------------------------------------------ Donor dashboard page API's started ------------------------------------------------
// ------------------------------------------------ Change password function ------------------------------------------------
app.get("/changepassword", function (req, resp) {
  var email = req.query.emailsent;
  var oldpassword = req.query.oldpasswordsent;
  var confirmedpassword = req.query.confirmedpassword;

  dbCon.query("select * from users1 where email = ? and pwd = ?", [email, oldpassword], function (err, result) {
      if (err == null) {
        if (result.length == 1 && result[0].status == 1) {
          dbCon.query("update users1 set pwd = ? where email = ?", [confirmedpassword, email], function (err) {
              if (err == null) {
                resp.send("Password changed successfully");
              } else {
                resp.send(err);
              }
            });
        } else {
          resp.send("No user found");
        }
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Donor dashboard page API's ended ------------------------------------------------


// ------------------------------------------------ Needy profile page API's started ------------------------------------------------
// ------------------------------------------------ Needy check data function ------------------------------------------------
app.get("/check-data", function (req, resp) {
  var email = req.query.emailsent;

  dbCon.query("select * from needy where email = ?", [email], function (err, result) {
      if (err == null) {
        if (result.length == 1) {
          resp.send("User exists");
        } else {
          resp.send("User does not exist");
        }
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Needy fetch data function ------------------------------------------------
app.get("/fetch-data", function (req, resp) {
  var email = req.query.emailsent;
  dbCon.query("select * from needy where email = ?", [email], function (err, result) {
      if (err == null) {
        resp.send(result);
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Do needy profile submit function ------------------------------------------------
app.post("/profile-needy-submit", function (req, resp) {
  var email = req.body.txtemail;
  var name = req.body.txtname;
  var contact = req.body.txtcontact;
  var dob = req.body.txtdob;
  var gender = req.body.txtgender;
  var city = req.body.txtcity;
  var address = req.body.txtaddress;
  var pic = "nopic.jpg";

  if (req.files != null) {
    pic = req.files.txtid.name;
    var path = process.cwd() + "/public/uploads/" + pic;
    req.files.txtid.mv(path);
  }

  dbCon.query("insert into needy values(?,?,?,?,?,?,?,?)", [email, name, contact, dob, gender, city, address, pic], function (err) {
      if (err == null) {
        resp.sendFile(process.cwd()+"/public/record-saved.html");
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Do needy profile update function ------------------------------------------------
app.post("/profile-needy-update", function (req, resp) {
  var email = req.body.txtemail;
  var name = req.body.txtname;
  var contact = req.body.txtcontact;
  var dob = req.body.txtdob;
  var gender = req.body.txtgender;
  var city = req.body.txtcity;
  var address = req.body.txtaddress;
  var pic = "nopic.jpg";

  if (req.files != null) {
    pic = req.files.txtid.name;
    var path = process.cwd() + "/public/uploads/" + pic;
    req.files.txtid.mv(path);
  } else {
    pic = req.body.hdnpicname;
  }

  dbCon.query("update needy set name = ?, mobile = ?, dob = ?, gender = ?, city = ?, address = ?, pic = ? where email = ?", [name, contact, dob, gender, city, address, pic, email], function (err) {
      if (err == null) {
        resp.sendFile(process.cwd()+"/public/record-saved.html");
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Needy profile page API's ended ------------------------------------------------


// ------------------------------------------------ Admin users panel page API's started ------------------------------------------------
// ------------------------------------------------ Fetching users data function ------------------------------------------------
app.get("/fetch-users-data", function (req, resp) {
  dbCon.query("select * from users1", function (err, result) {
    if (err == null) {
      resp.send(result);
    } else {
      resp.send(err);
    }
  });
});

// ------------------------------------------------ Deleting users data function ------------------------------------------------
app.get("/delete-users-data", function (req, resp) {
  var email = req.query.email;
  dbCon.query("delete from users1 where email = ?", [email], function (err, result) {
      if (err == null) {
        resp.send("Account deleted successfully");
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Blocking users data function ------------------------------------------------
app.get("/block-users-data", function (req, resp) {
  var email = req.query.email;
  dbCon.query("update users1 set status = 0 where email = ?", [email], function (err, result) {
      if (err == null) {
        resp.send("Account blocked");
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Resuming users data function ------------------------------------------------
app.get("/resume-users-data", function (req, resp) {
  var email = req.query.email;
  dbCon.query("update users1 set status = 1 where email = ?", [email], function (err, result) {
      if (err == null) {
        resp.send("Account resumed");
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Admin users panel page API's ended ------------------------------------------------


// ------------------------------------------------ Admin donors panel page API's started ------------------------------------------------
// ------------------------------------------------ Fetching donors data function ------------------------------------------------
app.get("/fetch-donors-data", function (req, resp) {
  dbCon.query("select * from donors", function (err, result) {
    if (err == null) {
      resp.send(result);
    } else {
      resp.send(err);
    }
  });
});

// ------------------------------------------------ Admin donors panel page API's ended ------------------------------------------------


// ------------------------------------------------ Admin needy panel page API's started ------------------------------------------------
// ------------------------------------------------ Fetching needy data function ------------------------------------------------
app.get("/fetch-needy-data", function (req, resp) {
  dbCon.query("select * from needy", function (err, result) {
    if (err == null) {
      resp.send(result);
    } else {
      resp.send(err);
    }
  });
});

// ------------------------------------------------ Admin needy panel page API's ended ------------------------------------------------


// ------------------------------------------------ Expired medicine page API's started ------------------------------------------------
// ------------------------------------------------ Removing expired medicines function ------------------------------------------------
app.get("/remove-expired-meds", function (req, resp) {
  dbCon.query("delete from medsavailable where expdate < current_date()", function (err, result) {
    if (err == null) {
      resp.send("Successfully removed");
    } else {
      resp.send(err);
    }
  });
});

// ------------------------------------------------ Expired medicine page API's ended ------------------------------------------------


// ------------------------------------------------ Medicine manager page API's started ------------------------------------------------
// ------------------------------------------------ Fetching medicines function ------------------------------------------------
app.get("/fetch-medicine", function (req, resp) {
  var email = req.query.email;
  dbCon.query("select * from medsavailable where email = ? and expdate > current_date()", [email], function (err, result) {
    if (err == null) {
      resp.send(result);
    } else {
      resp.send(err);
    }
  });
});

// ------------------------------------------------ Unavailing medicines function ------------------------------------------------
app.get("/unavail-medicine", function (req, resp) {
  var id = req.query.id;
  dbCon.query("delete from medsavailable where id = ?", [id], function (err, result) {
      if (err == null) {
        resp.send("Medicine unavailed successfully");
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Medicine manager page API's ended ------------------------------------------------


// ------------------------------------------------ Medicine finder page API's started ------------------------------------------------
// ------------------------------------------------ Fetching cities function ------------------------------------------------
app.get("/fetch-cities", function (req, resp) {
  dbCon.query("select distinct city from donors", function (err, result) {
    if (err == null) {
      resp.send(result);
    } else {
      resp.send(err);
    }
  });
});

// ------------------------------------------------ Fetching medicines function ------------------------------------------------
app.get("/fetch-meds", function (req, resp) {
  dbCon.query("select distinct med from medsavailable", function (err, result) {
    if (err == null) {
      resp.send(result);
    } else {
      resp.send(err);
    }
  });
});

// ------------------------------------------------ Fetching donors function ------------------------------------------------
app.get("/fetch-donors",function(req,resp){
  var med=req.query.medselected;
  var city=req.query.cityselected;

  dbCon.query("select donors.email, donors.name, donors.mobile, donors.address, donors.city, donors.ahours, medsavailable.med from donors inner join medsavailable on donors.email = medsavailable.email where medsavailable.med = ? and donors.city=? and medsavailable.expdate > current_date()", [med,city], function(err,result){
    if(err==null){
      resp.send(result);
    }else{
      resp.send(err);
    }
  });
});

// ------------------------------------------------ Medicine finder page API's ended ------------------------------------------------