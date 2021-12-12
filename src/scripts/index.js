// const serverURL_rooms = 'http://localhost:3000';
const serverURL_rooms = 'https://webrtc-englingo.herokuapp.com';
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');
headers.append("Access-Control-Allow-Credentials", "true");
headers.append("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Cookie, Set-Cookie, Authorization');
headers.append('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS, HEAD');

//Create userId
window.localStorage.setItem('userId', `englingo_user${Math.floor(Math.random() * 10000000)}`);

//Topic buttons
const topic1_btn = document.getElementById('js-topic1-button');

//Listen to the Button for Topic 1
topic1_btn.addEventListener("click", async (e) => {
    const userId = window.localStorage.userId;
    console.log('Topic: '+ e.srcElement.getAttribute('topic'))
    const data = {
        userId: userId,
        topic: e.srcElement.getAttribute('topic'),
        test:"test"
    }
    createParticipant_req(data).then(()=>{
        findMatch(userId);
    })
});

//Keep asking for a match; If there is one, then open the room
async function findMatch(the_userId) {
    let match_id;
    match_id = await readMatchID_req(the_userId);
    if (match_id == 'no match') {
        console.log('searching...')
        setTimeout(async function () {
            await findMatch(the_userId);
        }, 5000)
    } else {
        window.location.assign(`/room/${match_id}`);
    }
}

//Requests
async function createParticipant_req(data) {
    console.log("posting")
    const response = await fetch(`${serverURL_rooms}/participant`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    });
    console.log(response)
    return response;
}

async function readMatchID_req(the_userId) {
    const response = await fetch(`${serverURL_rooms}/match/participant/${the_userId}`, {
        method: 'GET',
        headers: headers
    });
    return response.json();
}



