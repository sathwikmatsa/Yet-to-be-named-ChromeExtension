let startTime;
let countDownTimer;
let interval;
let timer;

function formattedTime(t){
    let time = floor(t/1000);
    let seconds = time % 60;
    time = floor(time/60);
    let minutes = time % 60;
    let hours = floor(time/60);

    return (hours!=0 ? nf(hours, 2)+":" : "") + nf(minutes, 2) +":"+ nf(seconds, 2);
}

function timeIt(){
    if((millis() + startTime) > countDownTimer){
        clearInterval(interval);
        return;
    }
    timer.html(formattedTime(countDownTimer - (millis() + startTime)));
}

function setup(){
    noCanvas();
    chrome.runtime.sendMessage({sendTimerDetails: true}, function(response) {
        startTime = response.current_time;
        countDownTimer = response.countdown_time;
        let countDownComplete = response.countdown_complete;
        timer = select("#timer");
        if(!countDownComplete) interval = setInterval(timeIt, 1000);
        else timer.html(formattedTime(0));
    });
}


