// const serverURL_rooms = 'http://localhost:3000';
const serverURL_MatchService = 'https://webrtc-englingo.herokuapp.com';
const serverURL_MissionService = 'https://englingo-missions.herokuapp.com';
const serverURL_EvaluationService = 'https://englingo-evaluations.herokuapp.com';
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');
headers.append("Access-Control-Allow-Credentials", "true");
headers.append("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Credentials, Cookie, Set-Cookie, Authorization');
headers.append('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS, HEAD');
const the_match_id = window.location.pathname.split('/')[3];
const the_userId = window.localStorage.userId;
const the_topic_level1 = window.location.pathname.split('/')[2];
let the_transcriptId;
let the_missionId;
let the_topic_level2;
let the_mission_words;
let spokenFromSession = {
    userId: the_userId,
    transcriptSentences: [],
    missionId: the_missionId
    // topicLev2: the_topic_level2,
    // missionWords: the_mission_words
};

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
peerConnection.onconnectionstatechange = async function (event) {
    console.log('State changed ' + peerConnection.connectionState);
    //Start Speech recognition wenn connectionState == connected

    if (peerConnection.connectionState == 'connected') {
        console.log("Starting speech recognition");
        recognition.start();
        const the_transcript = await createUserTranscripts_req(spokenFromSession);
        the_transcriptId = the_transcript._id
        //Duration of the Call
        setTimeout(async function() {
            recognition.stop();
            updateUserTranscripts_req(spokenFromSession);
             closeVideoCall();
            //POST für evaluation
            const data = {
                userId : the_userId,
                missionId : the_missionId,
                transcriptId: the_transcriptId
            }
            const the_evaluation = await createYourEvaluation_req(data);
            // window.location.assign(`/evaluation/${the_evaluation._id}`);

            // const evaluationInput = {
            //     topicLev2: the_topic_level2,
            //     missionWords: the_mission_words
            // }
            // getEvaluationInstance_req().then((the_eval_id) => {
            //     console.log(the_eval_id)
            //window.location.assign(`/evaluation/${the_eval_id}`);
            // })

            //max 1 minute call
        }, 60000);
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
    // 20 seconds
}, 20000);



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


//-------------------Speech Recognition


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
    spokenFromSession.transcriptSentences.push(transcript);
    console.log(spokenFromSession.transcriptSentences);

    //After 5 sentences restart the speech recognition, because speech recognition cannot record longer than 5 mins.
    //This is to prevent errors.
    if (numberSentancesSpoken % 5 == 0) {
        //save the words in json object through the web server
        updateUserTranscripts_req(spokenFromSession);
        spokenFromSession.transcriptSentences = [];

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
        recognition.stop();
    };
}

recognition.onspeechend = function () {
    recognition.stop();
}

//------------------------------------WebRTC Peer Connection Handshake Process--------------------------------------------------

const matchInfo = await readMyMatchInfo_req();

//Im am user 1 and i have my own tasks
if (the_userId == matchInfo.user1_id) {
    console.log('User1-creating an offer');
    await createOffer_user1(updateMatchInfo_req);
    await displayMissionDataWhenReady();

    await processAnswerWhenReady_user1();
}

//Im am user 2 and i have my own tasks
if (the_userId == matchInfo.user2_id) {
    const missionInput = {
        topic: the_topic_level1,
        user1_id: matchInfo.user1_id,
        user2_id: matchInfo.user2_id,
        match_id: the_match_id
    }
    await createMission_user2_req(missionInput);
    await displayMissionDataWhenReady();
    //User 2 Processing Offer
    await processOfferWhenReady_user2();
}
async function displayMissionDataWhenReady() {
    const missionInfo = await readMissionToMatchId_req();
    if (missionInfo == -1) {
        setTimeout(displayMissionDataWhenReady, 500)
    } else {
        the_missionId = missionInfo._id;
        the_topic_level2 = missionInfo.topic_level2;
        the_mission_words = missionInfo.words
        //topic 2nd level
        const missionTopic_tag = document.getElementById("js-mission-topic");
        missionTopic_tag.innerHTML = the_topic_level2;

        const missionWords_tag = document.getElementById('js-mission-words');
        for (let index = 0; index < missionWords_tag.children.length; index++) {
            missionWords_tag.children[index].innerHTML = missionInfo.words[index];
        }
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
    const offer = await peerConnection.createOffer(offerOptions);
    await peerConnection.setLocalDescription(offer);
    setTimeout(() => {
        console.log('PUT OFFER');
        callback({ user1_offer: peerConnection.localDescription });
        // 2000 -> 1500    
    }, 1500)
    return offer;
}
//~~~~~~~~~~~2. User 2 processes the offer when the offer is ready ~~~~~~~~~~~
async function processOfferWhenReady_user2() {
    console.log('in processOfferWhenReady_user2');
    // constantly to check if offer is ready
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
        // 500 -> 100    
    }, 100)
    return -1;
}
//~~~~~~~~~~~3. User 2 processes the offer - creates an answer ~~~~~~~~~~~
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
            // 2000 -> 1500      
        }, 1500)
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
    // constantly to check if answer is ready
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
        // 500 -> 100    
    }, 100)
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

async function createUserTranscripts_req(data) {
    const response = await fetch(`${serverURL_EvaluationService}/userTranscripts`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    });
    return response.json();
}

async function updateUserTranscripts_req(data) {
    const response = await fetch(`${serverURL_EvaluationService}/userTranscripts/${the_transcriptId}`, {
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
    return response.json;
}

async function readMissionToMatchId_req() {
    const response = await fetch(`${serverURL_MissionService}/missions/match/${the_match_id}`, {
        method: 'GET',
        headers: headers
    });
    return response.json();
}

async function createYourEvaluation_req(data) {
    const response = await fetch(`${serverURL_EvaluationService}/evaluations`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    });
    return response.json();
}

async function getEvaluationInstance_req() {
    const response = await fetch(`/myEvaluation`, {
        method: 'GET',
        headers: headers
    });
    return response.json();
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
        //alert('Call ended.');
        peerConnection.close();
        peerConnection = null;
    }
}