function checkBrowser() {
    const browserInfo = window.navigator.userAgent.split(" ");
    const index = browserInfo.findIndex(element => element[0] == "C");
    if (index != -1) {
        const browserInfoToVersions = browserInfo[index].split("/");
        const version = browserInfoToVersions[1][0] + browserInfoToVersions[1][1];
        if (parseInt(version) >= 98) return true;
    }
    return false;
}

function checkProtocol() {
    const currentProtocol = window.location.protocol;
    if (currentProtocol == "http:") window.location.protocol = "https:";
}

function Alert_Browser() {
    alert("We detected that you are not using Chrome Browser. Please change your browser to have the best experience. Some functionalities are not supported from other browsers.");
}

checkProtocol();
const correctBrowser = checkBrowser();
if (!correctBrowser) Alert_Browser()