// const serverURL_rooms = 'http://localhost:3000';
const serverURL_MatchService = 'https://webrtc-englingo.herokuapp.com';
const serverURL_MissionService = 'https://englingo-missions.herokuapp.com';
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');
headers.append("Access-Control-Allow-Credentials", "true");
headers.append("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Credentials, Cookie, Set-Cookie, Authorization');
headers.append('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS, HEAD');
const the_match_id = window.location.pathname.split('/')[3]; //https://englingo.herokuapp.com/rooms/topicsth/123-545-545-567 window.location.pathname.split('/')
const the_userId = window.localStorage.userId;
const the_topic = window.location.pathname.split('/')[2];
let missionId;

const configuration = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
}
const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
};


let peerConnection = new RTCPeerConnection({ configuration: configuration, iceServers: [{ 'urls': 'stun:stun.l.google.com:19302' }] });

//Monitor the state of the Peer Connection
peerConnection.onconnectionstatechange = function (event) {
    console.log('State changed ' + peerConnection.connectionState);
    //Start Speech recognition wenn connectionState == connected

    if (peerConnection.connectionState == 'connected') {
        console.log("Starting speech recognition");
        recognition.start();
    }
}

//------------In case there is an error or it takes too long to establish a connection with the Peer
setTimeout(() => {
    if (peerConnection.connectionState != 'connected') {
        alert("Your match left.");
        deleteMatchInfo_req();
        closeVideoCall();
        window.location.replace(`/home`);
    }
    // 10 seconds
}, 12000);

//Duraion of the Call
// setTimeout(() => {
//     closeVideoCall();
//     //1minute
// }, 108000);

const finish_call_btn = document.getElementById('js-finish-call');
finish_call_btn.addEventListener("click", async (e) => {
    deleteMatchInfo_req();
    closeVideoCall();
});

let dataChannel;

const localVideo = document.getElementById('webcamVideo');
const remoteVideo = document.getElementById('remoteVideo');

//Event-Listeners for the videos
localVideo.addEventListener('loadedmetadata', function () {
    console.log(`Local video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
});

remoteVideo.addEventListener('loadedmetadata', function () {
    console.log(`Remote video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
});

//1. First start sharing media

async function startMediaSharing() {

    const mediaConstraints_toSend = { audio: true, video: true };
    const mediaConstraints_toDisplay = { audio: false, video: true };

    let localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints_toSend);
    let localStream_toDisplay = await navigator.mediaDevices.getUserMedia(mediaConstraints_toDisplay);
    let remoteStream = new MediaStream();

    localStream.getTracks().forEach((track) => {
        console.log("tracks sent");
        peerConnection.addTrack(track, localStream);
    });
    localVideo.srcObject = localStream_toDisplay;

    peerConnection.ontrack = function (event) {
        console.log('track received');
        event.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
        })
        remoteVideo.srcObject = remoteStream;
    }
}
await startMediaSharing();

//------------------------------------WebRTC Peer Connection Handshake Process--------------------------------------------------

const matchInfo = await readMyMatchInfo_req();

//Im am user 1 and i have my own tasks
if (the_userId == matchInfo.user1_id) {
    console.log('User1-creating an offer');
    await createOffer_user1(updateMatchInfo_req);
    await readMissionToMatchId_req().then((missionInfo) => {
        showMissionData(missionInfo);
    });
    processAnswerWhenReady_user1();
}

//Im am user 2 and i have my own tasks
if (the_userId == matchInfo.user2_id) {
    const missionInput = {
        topic : the_topic,
        user1_id : matchInfo.user1_id,
        user2_id : matchInfo.user2_id,
        match_id : the_match_id
    }
    createMission_user2_req(missionInput).then((result) => {
        readMissionToMatchId_req().then((missionInfo) => {
            showMissionData(missionInfo)
        })

    })
    //User 2 Processing Offer
    processOfferWhenReady_user2();
}
function showMissionData(the_missionInfo) {
    //topic 2nd level
    const missionTopic_tag = document.getElementById("js-mission-topic");
    missionTopic_tag.innerHTML = the_missionInfo.topic_level2;

    const missionWords_tag = document.getElementById('js-mission-words');
    for (let index = 0; index < missionWords_tag.children.length; index++) {
        missionWords_tag.children[index].innerHTML = the_missionInfo.words[index];
    }
}

//~~~~~~~~~~~ 1. User 1 creates an offer ~~~~~~~~~~~
async function createOffer_user1(callback) {
    console.log("in createOffer_user1")
    dataChannel = peerConnection.createDataChannel('channel1');
    dataChannel.onmessage = e => console.log('Got a message: ' + e.data);
    dataChannel.onopen = e => console.log('Connection opened');
    peerConnection.onicecandidate = function (e) {
        console.log("ICE candidate (peerConnection)", e);
    };
    setTimeout(() => {
        console.log('PUT OFFER');
        callback({ user1_offer: peerConnection.localDescription });
    }, 2000)
    const offer = await peerConnection.createOffer(offerOptions);
    await peerConnection.setLocalDescription(offer);
    return offer;
}
//~~~~~~~~~~~2. User 2 processes the offer when the offer is ready ~~~~~~~~~~~
async function processOfferWhenReady_user2() {
    console.log('in processOfferWhenReady_user2');
    setTimeout(async function () {
        const matchInfo = await readMyMatchInfo_req();
        const user1_offer = matchInfo.user1_offer;
        const user2_answer = matchInfo.user2_answer;
        if (user1_offer && !user2_answer) {
            await createAnswerAndConnect_user2(user1_offer, updateMatchInfo_req);
            return 0;
        } else {
            console.log('staring processOfferWhenReady_user2 again')
            await processOfferWhenReady_user2()
        }
    }, 1000)
    return -1;
}
//~~~~~~~~~~~3. User 2 processes the offer - creates an aswer ~~~~~~~~~~~
async function createAnswerAndConnect_user2(offer, callback) {
    peerConnection.addEventListener('datachannel', event => {
        dataChannel = event.channel;
        dataChannel.onopen = e => console.log('Connection opened');
        dataChannel.onmessage = e => console.log('Got a message: ' + e.data);
    });
    peerConnection.onicecandidate = function (e) {
        console.log("ICE candidate (peerConnection)", e);
        setTimeout(() => {
            console.log("PUT ANSWER");
            callback({ user2_answer: peerConnection.localDescription });
        }, 2000)
    };
    const remoteDesc = new RTCSessionDescription(offer);
    await peerConnection.setRemoteDescription(remoteDesc);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return answer;
}
//~~~~~~~~~~~4. User 1 processes the answer when the answer is ready ~~~~~~~~~~~
async function processAnswerWhenReady_user1() {
    console.log('in processAnswerWhenReady_user1');
    setTimeout(async function () {
        const matchInfo = await readMyMatchInfo_req();
        const user2_answer = matchInfo.user2_answer;
        if (user2_answer) {
            const remoteDesc = new RTCSessionDescription(user2_answer);
            await peerConnection.setRemoteDescription(remoteDesc);
            await deleteMatchInfo_req();
            return 0;
        } else {

            console.log('staring processAnswerWhenReady_user1 again')
            await processAnswerWhenReady_user1()
        }
    }, 1000)
    return -1;
}

//Requests
async function readMyMatchInfo_req() {
    console.log('in readMyMatchInfo_req');
    const response = await fetch(`${serverURL_MatchService}/matches/${the_match_id}`, {
        method: 'GET',
        headers: headers
    });
    return response.json();
}
async function updateMatchInfo_req(data) {
    console.log('in updateMatchInfo_req')
    const response = await fetch(`${serverURL_MatchService}/matches/${the_match_id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(data)
    });
    return response.json();
};

async function deleteMatchInfo_req() {
    const response = await fetch(`${serverURL_MatchService}/matches/${the_match_id}`, {
        method: 'DELETE',
        headers: headers
    });
    return response;
};

async function updateUserTranscripts_req(data) {
    const response = await fetch(`/userTranscripts`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(data)
    });
    return response;
}

async function createMission_user2_req(data) {
    const response = await fetch(`${serverURL_MissionService}/missions`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    });
    return response;
}

async function readMissionToMatchId_req() {
    const response = await fetch(`${serverURL_MissionService}/missions/match/${the_match_id}`, {
        method: 'GET',
        headers: headers
    });
    return response;
}
//-------------------Speech Recognition


let spokenFromSession = {
    userId: the_userId,
    words: [],
    missionId: "" //TODO
};

const SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// create a SpeechRecognition object
const recognition = new SpeechRecognition();
// set the language to english
recognition.lang = 'en-EN';
// false = speech recognition will stop after a few seconds of silence
// true = when the user stops talking, speech recognition will continue until we stop it
recognition.continuous = true;
// to retrieve results, starts an input when the recognition identifies a word and returns it with the word it identified before
// called every time the Speech APi captures a line 

let numberSentancesSpoken = 0;
recognition.onresult = function (event) {
    // event is a SpeechRecognitionEvent object, it holds all the lines we have captured so far
    // event.resultIndex = read-only, returns the lowest index value result in the array that has actually changed 
    numberSentancesSpoken++;
    var current = event.resultIndex;
    // event.results = read-only, returns an object representing all the speech recognition results for the current session
    // [current] = returns an object representing all the speech recognition results for the current session
    // .transcript = read-only, returns a string containing the transcript of the recognized word
    var transcript = event.results[current][0].transcript;
    spokenFromSession.words.push(transcript);
    console.log(spokenFromSession.words);

    //After 5 sentences restart the speech recognition, because speech recognition cannot record longer than 5 mins.
    //This is to prevent errors.
    if (numberSentancesSpoken % 3 == 0) {
        recognition.stop();
        setTimeout(() => {
            //save the words in json object through the web server
            updateUserTranscripts_req(spokenFromSession);
            spokenFromSession.words = [];
            console.log('Restarting speech recognition');
            recognition.start();
        }, 100)
    }
}
// perform an action when the recognition starts
recognition.onstart = function () {
    // overwrites or returns the text content of the selected elements
    console.log('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onerror = function (event) {
    if (event.error == 'no-speech') {
        console.error('No speech was detected. Try again.');
    };
}

function closeVideoCall() {
    if (peerConnection) {
        peerConnection.ontrack = null;
        peerConnection.onremovetrack = null;
        peerConnection.onremovestream = null;
        peerConnection.onicecandidate = null;
        peerConnection.oniceconnectionstatechange = null;
        peerConnection.onsignalingstatechange = null;
        peerConnection.onicegatheringstatechange = null;
        peerConnection.onnegotiationneeded = null;

        if (remoteVideo.srcObject) {
            remoteVideo.srcObject.getTracks().forEach(track => track.stop());
        }
        if (localVideo.srcObject) {
            localVideo.srcObject.getTracks().forEach(track => track.stop());
        }
        alert('Call ended.');
        peerConnection.close();
        peerConnection = null;
    }
}