async function updateMatchInfo_req(data) {
    console.log('PUTing Match Info')
    const response = await fetch(`${serverURL_rooms}/match/${the_match_id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(data)
    });
    return response.json();
};
const the_match_id = window.location.pathname.slice(6);
const the_userId = window.localStorage.userId;
//test
function test(){
    createOffer_user1(updateMatchInfo_req).then((res)=>{
        console.log("Test function finished");
        test();
    })
}

//WebRTC Functions
async function createOffer_user1(callback) {
    console.log("createOffer_user1 FUNCTION")
    dataChannel = peerConnection.createDataChannel('channel1');
    dataChannel.onmessage = e => console.log('Got a message: ' + e.data);
    dataChannel.onopen = e => console.log('Connection opened');
    peerConnection.onicecandidate = function (e) {
        console.log("ICE candidate (peerConnection)", e);
    };
    setTimeout(()=>{
        console.log('PUT OFFER IN THE CALLBACK');
        callback({ user1_offer: peerConnection.localDescription });
    },2000)
    const offer = await peerConnection.createOffer(offerOptions);
    await peerConnection.setLocalDescription(offer);
    return offer;
}

const configuration = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
}
const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
};

let peerConnection = new RTCPeerConnection({ configuration: configuration, iceServers: [{ 'urls': 'stun:stun.l.google.com:19302' }] });