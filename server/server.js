const express = require('express');
const app = express();
const path = require('path');
app.use(express.json());
app.use(express.static("src"));
const PORT = process.env.PORT || 3000;
// const serverURL_WebService = process.env.ENGLINGO_WEB_URL;
// const serverURL_MatchService = process.env.MATCHING_SERVICE_URL;
// const serverURL_MissionService = process.env.MISSION_SERVICE_URL;
// const serverURL_EvaluationService = process.env.EVALUATION_SERVICE_URL;
const cors = require('cors')
const corsOptions = {
    origin: ["https://englingo.herokuapp.com", "https://englingo-missions.herokuapp.com", "https://englingo-evaluation.herokuapp.com", "https://webrtc-englingo.herokuapp.com"]
  };
app.use(cors(corsOptions));

//~~~~~~~~~~~~~~~~~~~~~~~~~~RESTful Service - Methods~~~~~~~~~~~~~~~~~~~~~~~~~~

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../src', 'index.html'));
});

app.get('/rooms', (req, res) => {
    res.send("You need a roomId");
});

app.get('/rooms/:topic/:roomId', (req, res) => {
    res.sendFile(path.join(__dirname, '../src', 'room.html'));
});

app.get('/evaluation/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../src', 'evaluation.html'));
});

//~~~~~~~~~~~~~~~~~~~~~~~~~ run server ~~~~~~~~~~~~~~~~~~~~~~~~~
app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}...`);
});