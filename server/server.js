//npm run devStart
const express = require('express');
const app = express();
const path = require('path');
app.use(express.json());
app.use(express.static("src"));
const PORT = process.env.PORT || 3000;
let fs = require('fs');
const serverURL_EvaluationService = 'https://englingo-evaluation.herokuapp.com';

app.use((req, res, next) => {
    const corsWhitelist = [
        'https://webrtc-englingo.herokuapp.com',
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        'https://englingo.herokuapp.com'
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
    const trancriptedWords = req.body.words;
    const mission_id = req.body.missionId
    let userTranscripts = JSON.parse(fs.readFileSync('server/userTranscripts.json'));

    //check mission ID if the same, update, if different, zero and change
    if(mission_id != userTranscripts.missionId) userTranscripts.words = [];
    userTranscripts.userId = user_id;
    userTranscripts.missionId = mission_id;
    userTranscripts.transcriptSentences = userTranscripts.transcriptSentences.concat(trancriptedWords);

    rewriteFile("server/userTranscripts.json", userTranscripts);
    res.status(200).send();
});

app.post('/my-evaluation', (req, res) => {
    let data = JSON.parse(fs.readFileSync('server/userTranscripts.json'));
    data.topicLev2 = req.body.topicLev2;
    data.missionWords = req.body.missionWords;
    console.log(data);
   
    createMyEvaluation_req(data).then((result)=>{ 

        res.status(200).send(result);
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

async function createMyEvaluation_req(data) {
    const response = await fetch(`${serverURL_EvaluationService}/evaluations`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    });
    return response.json();
}
