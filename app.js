//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// Use express Static for (CSS, Images, etc) for static pages
app.use(express.static("public"));
//URL encoded - Use for bodyParser
app.use(bodyParser.urlencoded({extended: true}));
// Home page to get and send the Signup page
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});
//App post on HP
app.post("/", function(req, res){
// Form inputs from signup.html
  const firstName = req.body.n1;
  const lastName = req.body.n2;
  const email = req.body.email;
// Creating data mailchimp Doc.
  const data = {
    members: [ {
      email_address: email,
      status: "subscribed",
      merge_fields : {
        FNAME: firstName,
        LNAME: lastName
      },
    }]
  };
//Convert  JS to Json strings
const jsondata = JSON.stringify(data);
console.log(jsondata);
//mailchimp API endpoint
  const url = `https://us10.api.mailchimp.com/3.0/lists/<Mailchimp List ID>`;
// options for Methods and Authorization
  const options = {
    method: "POST",
    headers : {
      //Search for (base64-encoded credentials) Or Check this website https://mixedanalytics.com/knowledge-base/api-connector-encode-credentials-to-base-64/
'Authorization' : 'Basic <Any mailchimp username:MailchimpAPI-key>'
}
  };

//passing the data to mailchimp
  const request = https.request(url, options, function(response){

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname+"/failure.html");
    }
  });
  request.write(jsondata);
  request.end();
});
// Redirect to HP if failure
app.post("/failure", function(req,res){
  res.redirect("/");
});
// Listen to port
app.listen(process.env.PORT || 3000, function(){
  console.log("You are now live");
});
