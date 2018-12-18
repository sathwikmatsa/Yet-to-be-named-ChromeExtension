let startTime;
let countDownTimer;

function setup(){
    noCanvas();
    startTime = millis();
    console.log("init: ", startTime);
    chrome.storage.sync.get(['default_timer'], function(result) {
        countDownTimer = result.key != undefined ? result.key : 25*60*1000;
        console.log('countDownTimer: ' + countDownTimer);
    });
}
