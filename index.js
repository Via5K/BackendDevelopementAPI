// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({
    optionsSuccessStatus: 200
})); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

function invalidDatePassed(req, res) {
    console.log("Error");
    var obj = {
        error: "Invalid Date"
    }
    console.log(obj)
    res.json(obj);
}
app.get("/api/", (req, res) => {
    // var current = new Date();
    var unixDate = new Date().getTime();
    var utcDate = new Date().toString();

    var obj = {
        unix: unixDate,
        utc: utcDate
    }
    console.log(obj);
    res.json(obj);
    // done();
});
app.get("/api/:date", (req, res) => {
    var datePassed = (req.params.date).toString();
    var unixDate;
    var UTCDate;
    console.log("Date Passed: " + datePassed);

    justDate = new Date(datePassed).toUTCString();
    console.log("JustDate:" + justDate)
    if (justDate.includes("Invalid")) {
        console.log("Invalid Date provided Checking for Number");
        datePassed = Number(datePassed);
        console.log(datePassed);
        unixDate = new Date(datePassed).getTime();
        var validUnix = unixDate.toString();
        console.log("UnixFomrat" + unixDate);
        console.log("ValidUnixFomrat" + Number.isNaN(datePassed));

        if (validUnix.includes("Invalid") || (Number.isNaN(datePassed) == true)) {

            // console.log("Inside invalid method")
            // res.json({
            // error: "Invalid Date"
            // });
            invalidDatePassed(req, res);
        } else {
            // datePassed = Number(datePassed);
            UTCDate = new Date(datePassed).toUTCString();
            //     
            var obj = {
                unix: unixDate,
                utc: UTCDate
            };
            console.log(obj);
            res.json(
                obj
            );
        }

    } else {
        UTCDate = justDate;
        // datePassed = Number(datePassed);
        unixDate = new Date(datePassed).getTime();
        var validUnix = unixDate.toString();
        console.log("UnixFomrat" + unixDate);

        var obj = {
            unix: unixDate,
            utc: UTCDate
        };
        console.log(obj);
        res.json(
            obj
        );
    }

    // if (datePassed.includes("-")) {
    //     UTCDate = new Date(datePassed).toString();
    //     unixDate = new Date(datePassed).getTime();
    //     var validUnix = unixDate.toString();
    //     console.log(unixDate);

    //     if (UTCDate.includes("Invalid") || validUnix.includes("Invalid")) {
    //         console.log("Invalid Date provided in - format");
    //         invalidDatePassed(req, res);
    //     }
    // } else {
    //     datePassed = Number(datePassed);
    //     UTCDate = new Date(datePassed).toString();
    //     unixDate = new Date(datePassed).getTime();
    //     var validUnix = unixDate.toString();
    //     console.log(unixDate);

    //     if (UTCDate.includes("Invalid") || validUnix.includes("Invalid")) {
    //         console.log("Invalid Date provided in - format");
    //         invalidDatePassed(req, res);
    //     }
    // }


    // var obj = {
    //     unix: unixDate,
    //     utc: UTCDate
    // };
    // res.json(
    //     obj
    // );
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
    res.json({
        greeting: 'hello API'
    });
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});