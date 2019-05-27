const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
// const request = require('request')
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/music_player', {useNewUrlParser: true});
//mongodb:// localhost:27017/hashAppDb"
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("successfully conencted with mongodb!");
});

var UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true },
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  video_list: [
    {
      video_id: String, 
      liked: { type: Boolean, default:false }
      //likes: { type: Int8Array, default: 0 }
    }
  ],
})

// var VideoSchema = new mongoose.Schema({
//   id: { type:mongoose.Schema.Types.ObjectId, index: true, unique:true, required: true, auto:true },
//   username: { type: String, unique: true, required: true, trim: true },
//   video_list: { type: Array, unique: true},
// })

// schema -> model
var User = mongoose.model('User', UserSchema); 
// var Videos = mongoose.model('Videos', VideoSchema); 
module.exports = User;
// module.exports = Videos;

app.get('/v1/hello', (req, res) => {
  let password = 'Cd18712312';
  res.send({ 
    express: 'Hello From Express', 
    raw_password: password,
  });
});

// {
//   email: ''
// }
app.get('/v1/users/:username', (req, res) => {
  var username = req.params.username;
  // console.log(username + ' hey got cha!');
  var query = { username: username };
  db.collection('users').find(query).toArray((err, result) => {
    // console.log('user: ', result);
    if (err) return console.error(err);
    if (result.length === 1) {
      var email = result[0].email;
      res.send({ email: email }); // currently on email. playlists in the future
      console.log("send email " + email + " to the front-end");
    }
  })
});

// {
//   'username':
//   'video_list': [{},{}...]
// }
app.get('/v1/users/:username/playlist', (req, res) => {
  var username = req.params.username;
  var query = { username: username };
  db.collection('users').find(query).toArray((err, result) => {
    if (err) return console.error(err);
    if (result.length === 1) {
      // console.log("result_0: ", result[0]);
      // console.log("result_1: ", result[0].video_list);
      res.send({ 
        username: username, 
        video_list:result[0].video_list 
      });
    }
  })
})

app.get('/v1/users/:username/playlist/:video_id', (req, res) => {
  var {username, video_id} = req.params;
  if (username && video_id) {
    db.collection('users').find({username:username}).toArray((err, result) => {
      if (err) return console.error(err);
      if (result.length === 1){
        //console.log("send to front-end result: ", result[0]);
        result[0].video_list.forEach((video) => {
          if (video.video_id === video_id)
            res.send({liked:video.liked});
            console.log(video);
        })
      }});
  }
})

app.post('/v1/users/:username/playlist/add', (req, res) => {
  var username = req.params.username;
  var added_video_id = req.body.add_video_id;
  if (added_video_id) {
    db.collection('users').findOneAndUpdate({username:username},
      {$push: {video_list:{video_id: added_video_id, liked:false}}}, (err, result) => {
          if (err) return console.error(err);
          console.log("new video_id: ", added_video_id);
    });
  }
})

// talk with "ListItem.handleVideoLike()"
app.post('/v1/users/:username/playlist/:video_id/like', (req, res) => {
  var username = req.params.username;
  var like_video_id = req.params.video_id;
  var index = req.body.index;
  console.log("like video_id: ", like_video_id);
  var key = `video_list.${index}.liked`;
  if (username && like_video_id) {
    db.users.update(
      { username:username },
      { $set: {"video_list.0.liked":true}}
    )
    console.log("yout just liked me!!!");
    // db.collection('users').findOneAndUpdate({username:username},
    //   {$push: {favorite_list:{video_id: like_video_id}}}, (err, result) => {
    //     if (err) return console.error(err);
    //     console.log("like video_id: ", like_video_id);
    //   })
  }
})

app.delete('/v1/users/:username/playlist/delete', (req, res) => {
  var username = req.params.username;
  var delete_video_id = req.body.delete_video_id;
  if (delete_video_id) {
    db.collection('users').findOneAndUpdate({username:username},
      {$pull: {video_list:{video_id: delete_video_id}}}, (err, result) => {
          if (err) return console.error(err);
          console.log("deleted video_id: ", delete_video_id);
    });
    res.send({
      username: username,
      delete_video_id: delete_video_id,
    })
  }
})


app.post('/v1/login', (req, res) => {
  // console.log(req.body);
  var {username, password} = req.body;
  if (username && password) {
    var query = { username: username };
    var db_password;
    db.collection('users').find(query).toArray(function(err, result) {
      if (err) return console.error(err);
      if (result.length == 1)   
        db_password = result[0].password;
        // compare hashed password
        bcrypt.compare(password, db_password, function(err, result) {
          if (result) {
            // console.log("password matches!");
            res.send({ match: true });
          } else {
            // console.log("please reenter again");
            res.send({ match: false });
          }
        });
      // error handling
      // res.redirect('./hello');
    })
  }
})

app.post('/v1/register', (req, res) => {
  console.log(req.body);
  var {username, email, password} = req.body;
  if (username && email && password) {
    console.log("outer successfuly created!");
    // hash password
    bcrypt
    .hash(password, 10)
    .then(hash => {
      var userData = new User({username:username, email:email, password:hash, video_list:[]});
      console.log(`hashed password:${hash}`);
      userData.save(function(err, user) {
        if (err) 
          return console.error(err);
        res.send(`Hello! you succeessfully registered with username:${username}, email:${email}, password:${password}`)
        console.log(user.username, user.email, user.password);
      })
    })
    .catch(err => console.log(err.message));
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));



