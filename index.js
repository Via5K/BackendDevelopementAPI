require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');

const url = require('url');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  encoded: false
}));
// Basic Configuration
const port = process.env.PORT || 3000;
var idVsUrl = new Map();
var urlVsId = new Map();
// var origin = [];
app.use(cors({
  origin: '*'
}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
app.get('/api/shorturl/:id', (req, res, next) => {
  var id = Number(req.params.id);
  var url = idVsUrl.get(id).toString();
  console.log("id is: " + id);
  console.log("url is: " + url);
  // origin.push(url)
  // console.log("i am origin" + origin)
  res.status(301).redirect(url);
  next;
  // next();
  // done(null, req);
});

function validUrl(originalurl, res) {
  console.log("ORIGINALURL:" + originalurl)
  var shorturl = "";
  //returns the value if there exists a value already otehrwise null.
  const existingUrl = urlVsId.get(originalurl);
  if (existingUrl) {
    shorturl = existingUrl;
    console.log("Existing URL already there:" + shorturl);
  } else {
    var uniqueUrlIdentifier = Math.floor(Math.random() * 1000000) + 1
    console.log("UniqueIdentifier For URL is: " + uniqueUrlIdentifier);
    while (idVsUrl.get(uniqueUrlIdentifier)) {
      var uniqueUrlIdentifier = Math.floor(Math.random() * 1000000) + 1
      console.log("New UniqueIdentifier For URL is: " + uniqueUrlIdentifier);
    }
    shorturl = uniqueUrlIdentifier;
    urlVsId.set(originalurl, uniqueUrlIdentifier);
    idVsUrl.set(uniqueUrlIdentifier, originalurl);
  }

  var obj = {
    original_url: originalurl,
    short_url: shorturl
  }

  res.json(obj);
}
app.route('/api/shorturl').post(async (req, res) => {
  console.log("POST");
  const errorCount = 0;
  var originalurl = req.body.url;
  var look = dns.lookup(url.parse(originalurl).hostname, async (err, address) => {
    console.log("Inside lokup");
    if (!address) {
      res.json({
        error: "invalid url"
      });
    } else {
      await validUrl(originalurl, res);
    }
  });

});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({
    greeting: 'hello API'
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});