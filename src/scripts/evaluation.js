const the_userId = window.localStorage.userId;
const serverURL_EvaluationService = 'https://englingo-evaluations.herokuapp.com';
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');
const the_evaluation_id = window.location.pathname.split('/')[2]; 

const evaluationInfo = await readMyEvaluation_req(the_evaluation_id);

document.getElementById('js-score').innerHTML = evaluationInfo.score;

evaluationInfo.missionWordsEvaluated.forEach(element => {
    let li_element = document.createElement('li');
    li_element.innerHTML = element.value;
    if(element.score > 0){
        document.getElementById('js-successful-list').appendChild(li_element);
    }else document.getElementById('js-failed-list').appendChild(li_element);
});


//Requests
async function readMyEvaluation_req(the_id) {
    const response = await fetch(`${serverURL_EvaluationService}/evaluations/${the_id}`, {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        credentials: 'include'
    });
    return response.json();
}
