//npm run devStart
const express = require('express');
var requestify = require('requestify'); 
const axios = require('axios')
const app = express();
const path = require('path');
app.use(express.json());
app.use(express.static("src"));
const PORT = process.env.PORT || 3000;
let fs = require('fs');
const serverURL_EvaluationService = 'https://englingo-evaluation.herokuapp.com';
// const serverURL_EvaluationService = 'http://localhost:3001';

app.use((req, res, next) => {
    const corsWhitelist = [
        'https://webrtc-englingo.herokuapp.com',
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        'https://englingo.herokuapp.com',
        'https://englingo-evaluation.herokuapp.com'
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

app.get('/rooms', (req, res) => {
    res.send("You need a roomId");
    //   res.sendFile(path.join(__dirname, '../src', 'room.html'));
});

app.get('/rooms/:topic/:roomId', (req, res) => {
    res.sendFile(path.join(__dirname, '../src', 'room.html'));
});

app.put('/userTranscripts', (req, res) => {
    const user_id = req.body.userId;
    const trancriptedWords = req.body.transcriptSentences;
    const mission_id = req.body.missionId;
    const topicLev2 = req.body.topicLev2;
    const missionWords = req.body.missionWords;

    let userTranscripts = JSON.parse(fs.readFileSync('server/userTranscripts.json'));

    //check mission ID if the same, update, if different, zero and change
    console.log(mission_id)
    console.log(userTranscripts.missionId)
    if(mission_id != userTranscripts.missionId) {
        console.log("in the if")
        userTranscripts.userId = user_id;
        userTranscripts.missionId = mission_id;
        userTranscripts.transcriptSentences = [];
        userTranscripts.topicLev2 = topicLev2;
        userTranscripts.missionWords = missionWords;
    }
    userTranscripts.transcriptSentences = userTranscripts.transcriptSentences.concat(trancriptedWords);
    rewriteFile("server/userTranscripts.json", userTranscripts);
    res.status(200).send();
});

app.get('/myEvaluation', (req, res) => {

    const data = JSON.parse(fs.readFileSync('server/userTranscripts.json'));
    console.log(data)
    // console.log(JSON.stringify(data));
    // requestify.post(`${serverURL_EvaluationService}/evaluations`, data).then((result)=>{
    //     res.status(200).send(result.body);        
    // }).catch(err => {
    //     console.log(err);
    //     res.status(400).json("Error: " + JSON.stringify(err));
    // });

    // console.log(`${serverURL_EvaluationService}/evaluations`)
    axios.post(`${serverURL_EvaluationService}/evaluations`, data)
      .then((response) => {
          res.send(response.data)
        // console.log(response);
      }, (error) => {
          res.send(error)
        // console.log(error);
      })
});

app.get('/evaluation/:id', (req,res)=>{
    res.sendFile(path.join(__dirname, '../src', 'evaluation.html'));

});


function rewriteFile(file, object, callback) {
    fs.writeFile(file, JSON.stringify(object), function (err) {
        if (err) throw err;
        console.log(`File updated`);
    }
    )
    if (typeof callback == "function")
        callback();
}
//~~~~~~~~~~~~~~~~~~~~~~~~~ run server ~~~~~~~~~~~~~~~~~~~~~~~~~
app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}...`);
});

function createMyEvaluation_req(data) {
    requestify.post(`${serverURL_EvaluationService}/evaluations`, data).then(()=>{

    })
 
    return response.json();
}
