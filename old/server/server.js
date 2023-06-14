//npm run devStart
const express = require('express');
const app = express();
const path = require('path');
app.use(express.json());
app.use(express.static("src"));
const PORT = process.env.PORT || 3000;

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


app.get('/evaluation/:id', (req,res)=>{
    res.sendFile(path.join(__dirname, '../src', 'evaluation.html'));
});



//~~~~~~~~~~~~~~~~~~~~~~~~~ run server ~~~~~~~~~~~~~~~~~~~~~~~~~
app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}...`);
});

