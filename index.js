const express = require('express'),
      app     = express();
      http    = require('http').Server(app);
      port    = process.env.PORT || 5000;
      path    = require('path');
      bodyParser = require('body-parser');
      nodemailer = require('nodemailer');
      mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'mustache');
app.engine('mustache', require('hogan-middleware').__express);

const con = mysql.createPool({
	connectionLimit: 10,
	host: "us-cdbr-iron-east-02.cleardb.net",
	user: "bb6fdf5ccd214b",
	password:"ee0fa2f6",
	port: 3306,
	database: "heroku_8df2f05d6bc3479",
	debug: 'false',
	connectTimeout: 1000
})

function calcMonth(dmonth){
		let month = "";
		switch(dmonth){
			case 1:
				month = "January";
				break;
			case 2:
				month = "February";
				break;
			case 3:
				month = "March";
				break;
			case 4:
				month = "April";
				break;
			case 5:
				month = "May";
				break;
			case 6:
				month = "June";
				break;
			case 7:
				month = "July";
				break;
			case 8:
				month = "August";
				break;
			case 9:
				month = "September";
				break;
			case 10:
				month = "October";
				break;
			case 11:
				month = "November";
				break;
			case 12:
				month = "December";
				break;
			default:
				month = "Error";
				break;
		}
		return month;
	}

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
  var dates = req.body.dates;


  var dateString = [];
  console.log("Form data: " + email + " " + name + " " + subject + " " + message);
  console.log("Dates: ");
  for(let i = 0; i < dates.length; i++){
    console.log(dates[i] + " and ");
    dateString[i] = new Date(dates[i]);
    console.log(dateString[i]);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'robsilvervisualsbooking@gmail.com',
      pass: 'austerity'
    }
  });

  var id = Math.floor(Math.random() * 500) + 100;
  var idString = "#ID: " + id;

  var url="https://ajax-handler.herokuapp.com/respond?Email="+email+"&Name="+name+"&Subject="+subject+"&Message="+message+"&dates="+JSON.stringify(dates);
  console.log(url);

  var toRobText = "A client has submitted a request for a service on your website.\n\n Client Information:\n Email: "
  + email + "\n Name: " + name + "\n Subject: " + subject + "\n Message: " + message + "\n Dates Requested: ";

  toRobText += dateString[0].toDateString();

  for(let i = 1; i < dates.length; i++){
    toRobText += ", " + dateString[i].toDateString();
  }

  toRobText += "\n\nThis client has received an email saying that their message has been received and that\n you will review their request and get back to them within 24 hours.\n" +
  "Go to this link to confirm or deny their request: \n\n" + url + "\nOr Use the email above to respond manually.\n" + idString;

  toClientText = "Hey, it's Rob. \nI got your request that you submitted on my website. I will review it within the next 24 hours and get back to you on whether or not I can complete your request.\nIf you have any further questions or concerns, Email me at r_silver@robsilvervisuals.com or text me at 4436132750\nHave a great day!\n Rob from RobSilverVisuals\n" + idString;


  const ToRob = {
    from: 'robsilvervisualsbooking@gmail.com',
    to: 'r_silver@robsilvervisuals.com',
    subject: "A Client Has Submitted a Booking Request!!!!",
    text: toRobText
  };

  const ToClient = {
    from: 'robsilvervisualsbooking@gmail.com',
    to: email,
    subject: "Your request has been received",
    text: toClientText
  };

  transporter.sendMail(ToRob, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  transporter.sendMail(ToClient, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });


})

app.get("/respond", (req,res,next) =>{
  var email = req.query.Email;
  var name = req.query.Name;
  var subject = req.query.Subject;
  var message = req.query.Message;
  var dates = JSON.parse(req.query.dates);

  var dateString = [];

  for(let i = 0; i < dates.length; i++){
    dateString[i] = new Date(dates[i]).toDateString();
    console.log(dateString[i]);
  }
  var data = req.query;
  data.dates = dateString;
  res.render("confirm",data);
})

app.post("/confirm", (req,res,next) =>{

  var email = req.body.Email;
  var name = req.body.Name;
  var msg = req.body.Msg;
  var conf = req.body.Conf;
  var dates = req.body.Dates;

  console.log("Running Method");
  for(let i = 0; i < dates.length; i++){
    console.log("Running Loop");
    curDate = new Date(dates[i]);
    curMonth = calcMonth(curDate.getMonth());
    curDay = curDate.getDate();
    console.log(curDate.toDateString());
    console.log(curMonth);
    console.log(curDay);
  }

  if(conf){
    var subject = "Request Status: Confirmed";
  }else{
    var subject = "Request Status: Denied";
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'robsilvervisualsbooking@gmail.com',
      pass: 'austerity'
    }
  });

  const confEmail = {
    from: 'robsilvervisualsbooking@gmail.com',
    to: email,
    subject: subject,
    text: msg
  }

  transporter.sendMail(confEmail, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

})

http.listen(port, function(){
  console.log('listening on *:' + port);
});

module.exports = app;
