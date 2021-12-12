const express = require('express');
const app = express();
const path = require('path');
app.use(express.json());
app.use(express.static("src"));
const { v4: uuidv4 } = require("uuid");
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  const corsWhitelist = [
    'https://webrtc-englingo.herokuapp.com',
    'http://127.0.0.1:3000',
    'http://localhost:3000'
  ];
  if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
  }
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,Access-Control-Allow-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Cookie, Set-Cookie, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS, HEAD');
  next();
});


//~~~~~~~~~~~~~~~~~~~~~~~~~~RESTful Service - Methods~~~~~~~~~~~~~~~~~~~~~~~~~~

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../src', 'index.html'));
});

app.get('/room', (req, res) => {
    res.send("You need a roomId");
//   res.sendFile(path.join(__dirname, '../src', 'room.html'));
});

app.get('/room/:roomId', (req, res) => {
  res.sendFile(path.join(__dirname, '../src', 'room.html'));
});


//~~~~~~~~~~~~~~~~~~~~~~~~~ run server ~~~~~~~~~~~~~~~~~~~~~~~~~
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
