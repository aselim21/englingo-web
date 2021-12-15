const the_userId = window.localStorage.userId;
const serverURL_EvaluationService = 'https://englingo-evaluation.herokuapp.com';

async function readEvaluation_req() {
    const response = await fetch(`${serverURL_EvaluationService}//${the_match_id}`, {
        method: 'GET',
        headers: headers
    });
    return response.json();
}