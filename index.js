const express = require('express')
const app = express()
const cors = require('cors')
// const underscore = require('underscore.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser');
app.use(cors({
  origin: '*'
}))
app.use(bodyParser.urlencoded({
  extended: true
}));
const url = process.env.MONGO_URI;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const exercise = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  log: [{
    description: {
      type: String
    },
    duration: {
      type: Number
    },
    date: {
      type: String
    }
  }]
});
let Exercise = mongoose.model('Exercise', exercise);

//CREATE USERS
app.route('/api/users').post((req, res, done) => {
  // console.log("API/USERS");
  var username = req.body.username;
  // console.log("AFTER API/USERS");
  console.log(username);
  var user1 = new Exercise({
    username: username
  });
  console.log(user1);
  user1.save((err, data) => {
    if (err) return console.log("Failed");
    else console.log("Success");
    done(null, data)
  });
  res.json({
    username: username,
    _id: user1._id
  })
}).get((req, res, done) => {
  console.log("Start of /api/users");
  Exercise.find({}, (err, allusers) => {
    if (!err) {
      console.log(allusers);
      res.json(allusers);
      done(null, allusers);
    } else return console.log("Error");
  });

});

//GET USERS LOG
app.get('/api/users/:_id/logs', (req, res, done) => {
  console.log("Inside api/users/_id/logs")
  console.log(req.query);
  const id = req.params._id;
  var obj;
  const paramLimit = req.query.limit;
  console.log("this is id:" + id);
  Exercise.findById({
    _id: id
  }, async (err, user) => {

    if (err) return console.log("Failed to get the user from databse with logs");
    else console.log("Success, the user is retrieved from database with logs");
    await console.log("this is the user retrieved: " + user)
    console.log("Running query filters")
    let logs = user.log;
    logs = logs.map(log => ({
      description: log.description,
      duration: log.duration,
      date: log.date
    }));
    if (req.query.from || req.query.to) {
      let fromDate = req.query.from ? new Date(req.query.from) : new Date(0); // If 'from' is not provided, set to beginning of time
      let toDate = req.query.to ? new Date(req.query.to) : new Date(); // If 'to' is not provided, set to current date
      logs = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= fromDate && logDate <= toDate;
      });

      var allLogsBetweenQuery;
      console.log("First Logs print");
      console.log(logs);
      if (req.query.limit) {
        allLogsBetweenQuery = logs.slice(0, Number(paramLimit));
        // console.log(allLogsBetweenQuery);
      } else {
        allLogsBetweenQuery = logs;
      }
      console.log("Prinitng with limit");
      console.log(allLogsBetweenQuery);

      obj = {
        _id: user._id,
        username: user.username,
        from: new Date(req.query.from).toDateString(),
        to: new Date(req.query.to).toDateString(),
        count: allLogsBetweenQuery.length,
        log: allLogsBetweenQuery
      }
    } else {
      // if(req.query.limit){
      if (req.query.limit) {
        logs = logs.slice(0, Number(req.query.limit));
        // console.log(allLogsBetweenQuery);
      }
      // }
      console.log("else staetment")
      obj = {
        username: user.username,
        count: logs.length,
        _id: user._id,
        log: logs
      }

    }
    console.log("printing what will be printed on scrren ");
    console.log(obj);
    res.json(obj);
    done(null, user);

  });




});

//ADD EXERCISE
app.post('/api/users/:_id/exercises', (req, res, done) => {
  const id = req.params._id;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date;
  console.log(typeof (date));
  var formattedDate;
  if (date == null || date == '') {
    formattedDate = new Date().toDateString();
  } else {
    formattedDate = new Date(date).toDateString();
  }
  console.log("ID = " + id + " description= " + description + " Duration = " + duration + " date = " + date + " formattedDate = " + formattedDate);
  console.log("Finding user by id now");
  Exercise.findById(id, (err, user) => {
    if (err) return console.log("Failed");
    else console.log("Success");
    console.log("data Username:" + user.username);
    var toBeAddedInLogobject = {
      description: description,
      duration: duration,
      date: formattedDate
    }
    console.log("Iam to be added:" + toBeAddedInLogobject);
    user.log.push(toBeAddedInLogobject);
    // existingExerciseLogObject.push(toBeAddedInLogobject);

    // var exerciseLogObject = [{
    //             description: description
    //         },
    //         {
    //             duration: duration
    //         },
    //         {
    //             date: formattedDate
    //         }
    //     ]
    // user.description = description;
    // user.date = formattedDate;
    // user.duration = duration;
    const arraySize = user.log.length;
    console.log("Size of Exercise is:" + arraySize);
    obj = {
      username: user.username,
      description: user.log[arraySize - 1].description,
      duration: user.log[arraySize - 1].duration,
      date: user.log[arraySize - 1].date,
      // log: exerciseLogObject,
      _id: user._id,
    }


    console.log("See what is getting Updated now: " + obj);
    Exercise.updateOne({
      _id: id
    }, user, (error, userInfo) => {
      if (error) return console.log("Failed to save the user to database");
      else console.log("User information updated to database");
      // res.json(obj);
      done(null, userInfo);
    });
    res.json(obj);
    done(null, user);

  });


  // const user = Exercise.findById(id, (err, data) => {
  //     if (err) return console.log("Failed");
  //     else console.log("Success");
  //     done(null, data);
  // });
  // //update the information
  // user.description = description;
  // user.date = formattedDate;
  // user.duration = duration;

  // // console.log(obj);
  // const userInfo = Exercise.updateOne({
  //     _id: id
  // }, user, (error, userInfo) => {
  //     if (error) return console.log("Failed to save the user to database");
  //     else console.log("User information updated to database");
  //     // console.log("dataUsername:" + data.description);

  //     // console.log(userInfo);
  //     done(null, userInfo);
  // });




  // console.log("after user");
  // console.log(userInfo.username);

  // user.save((err, data) => {
  //     if (err) return console.log("Failed to save the user to database");
  //     else console.log("User information updated to database");
  //     done(null, data);
  // });
  // const userInfo = 

  // console.log("username = " + user.username + " ID = " + user.id + " description= " + user.description + " Duration = " + user.duration + " date = " + user.date + " formattedDate = " + formattedDate);
  // obj = {
  //         username: user.username,
  //         description: user.description,
  //         duration: user.duration,
  //         date: user.date,
  //         _id: user._id
  //     }
  //     // console.log(obj);

  // res.json(obj);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})