const express = require('express'),
      app     = express();
      http    = require('http').Server(app);
      port    = process.env.PORT || 5000;
      path    = require('path');
      bodyParser = require('body-parser');
      nodemailer = require('nodemailer');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'mustache');
app.engine('mustache', require('hogan-middleware').__express);

app.get("/", (req, res, next) =>{
  res.render("home");
});

app.get("/test", (req, res, next) =>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  var dataArray = [];
  dataArray[dataArray.length] = 41;
  dataArray[dataArray.length] = 3;
  dataArray[dataArray.length] = 56;
  dataArray[dataArray.length] = 42;
  dataArray[dataArray.length] = 5
  console.log("Sending data: " + dataArray);
  var data = JSON.stringify(dataArray);
  res.json(data);
});

app.post("/email", (req,res,next) =>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'colel1410@gmail.com',
      pass: 'baseball2901'
    }
  });

  var text = req.body.text;

  console.log("Email text: " + text);

  const mailOptions = {
    from: 'colel1410@gmail.com',
    to: 'hmk0809@icloud.com',
    subject: "Test Email using node.js",
    text: text
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

})

app.post("/bookingForm", (req,res,next) =>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  var email = req.body.Email;
  var name = req.body.Name;
  var subject = req.body.Subject;
  var message = req.body.Message;

  console.log("Form data: " + email + " " + name + " " + subject + " " + message);
})

http.listen(port, function(){
  console.log('listening on *:' + port);
});

module.exports = app;
