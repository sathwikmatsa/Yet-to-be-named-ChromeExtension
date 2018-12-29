let currentTime;
let startTime;
let countDownTimer;
let interval;
let timer;
let startButton;
let pauseButton;
let resetButton;
let isPaused;

function setup(){
    noCanvas();
    chrome.runtime.sendMessage({sendTimerDetails: true}, function(response) {
        currentTime = response.current_time;
        startTime = response.start_time;
        countDownTimer = response.countdown_time;
        isPaused = response.is_paused;
        console.log(isPaused);
        let countDownComplete = response.countdown_complete;
        let pausedTS = response.paused_ts;
        timer = select("#timer");
        if(isPaused && !countDownComplete){
            timer.html(formattedTime(1000 + countDownTimer - (pausedTS - startTime)));
        }
        if(!countDownComplete){
            timeIt();
            interval = setInterval(timeIt, 1000);
        }
        else timer.html(formattedTime(0));

        startButton = select("#start");
        startButton.mousePressed(restartTimer);
        pauseButton = select("#pause");
        pauseButton.mousePressed(pauseTimer);
        resetButton = select("#reset");
        resetButton.mousePressed(resetTimer);
    });
}

function formattedTime(t){
    // TODO: resolve this bug!
    if(t > countDownTimer) t = countDownTimer;
    let time = floor(t/1000);
    let seconds = time % 60;
    time = floor(time/60);
    let minutes = time % 60;
    let hours = floor(time/60);

    return (hours!=0 ? nf(hours, 2)+":" : "") + nf(minutes, 2) +":"+ nf(seconds, 2);
}

function timeIt(){
    console.log("FLAG1");
    if(isPaused) return;
    // currentTime - startTime : time already counted in background script
    if((currentTime - startTime + millis()) > countDownTimer){
        timer.html(formattedTime(0));
        clearInterval(interval);
        isPaused = true;
        console.log("FLAG2")
        return;
    }
    console.log("FLAG3")
    // 'countdown'
    timer.html(formattedTime(1000 + countDownTimer - (currentTime - startTime + millis())));
}

function restartTimer(){
    if(!isPaused) return;
    chrome.runtime.sendMessage({restartTimer: true}, function(response) {
        console.log("timer restarted");
        isPaused = false;
        clearInterval(interval);
        // millis() is subtracted in order to make current time of popup to be relatively set to 0
        currentTime = response.current_time - millis();
        startTime = response.start_time;
        countDownTimer = response.countdown_time;
        timeIt();
        interval = setInterval(timeIt, 1000);
    });
}

function pauseTimer(){
    if(isPaused) return;
    chrome.runtime.sendMessage({pauseTimer: true}, function(response) {
        isPaused = response.is_paused;
    });
}

function resetTimer(){
    console.log("reset pressed!");
    chrome.runtime.sendMessage({resetTimer: true}, function(response) {
        countDownComplete = response.countdown_complete;
        clearInterval(interval);
        timer.html(formattedTime(countDownTimer));
        isPaused = true;
    });
}
