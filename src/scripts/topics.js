// const serverURL_rooms = 'http://localhost:3000';
const serverURL_MatchService = 'https://webrtc-englingo.herokuapp.com';
const headers = new Headers();
// headers.append("Access-Control-Allow-Credentials", "true");
// headers.append("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Access-Control-Allow-Credentials, Access-Control-Allow-Methods,Access-Control-Allow-Headers');
// headers.append('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS, HEAD');


//Create userId
let userId = window.localStorage.userId;
if (!userId) {
    window.localStorage.setItem('userId', `englingo_user${Math.floor(Math.random() * 10000000)}`);
    userId = window.localStorage.userId;
}
//Topic buttons
const list_of_topic_btns = document.getElementsByClassName('js-topic-button');

//attach event listener to all Topic Buttons
for (let index = 0; index < list_of_topic_btns.length; index++) {
    const element = list_of_topic_btns[index];
    element.addEventListener("click", async (e) => {
        deactivateOtherButtons(e.currentTarget);
        const topic_name = e.srcElement.getAttribute('topic');
        const data = {
            userId: userId,
            topic: topic_name
        }
        createParticipant_req(data).then(() => {
            findMatch(topic_name);
        });
    });
}
function deactivateOtherButtons(the_except_btn) {
    for (let index = 0; index < list_of_topic_btns.length; index++) {
        const element = list_of_topic_btns[index];
        if (element != the_except_btn) {
            element.disabled = true;
        }
    }
}
//Keep asking for a match; If there is one, then open the room
async function findMatch(the_topic) {
    let match_id;
    match_id = await readMatchID_req();
    if (match_id == 'no match') {
        console.log('searching...');
        setTimeout(async function () {
            await findMatch(the_topic);
            // 5000 -> 100    
        }, 100)
    } else {
        //TODO: Create a Mission here - Audit 4
        window.location.assign(`/rooms/${the_topic}/${match_id}`);
    }
}

//Requests
async function createParticipant_req(data) {
    const response = await fetch(`${serverURL_MatchService}/participant`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
    return response;
}

async function readMatchID_req() {
    const response = await fetch(`${serverURL_MatchService}/matches/participants/${userId}`, {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        credentials: 'include'
    });
    return response.json();
}

