let startTime;
let countDownTimer;
let interval;
let countDownComplete;
let alarm;
let isPaused;
let pausedTimeStamp;
let autoStartTimer;

function timeIt(){
    if(isPaused) return;
    if((millis() - startTime) > countDownTimer){
        countDownComplete = true;
        clearInterval(interval);
        let options = {
            type: "basic",
            title: "Pomodoro Timer",
            message: "Take a small break!",
            iconUrl: "../assets/timer.png"
        }
        chrome.notifications.create(options);
        isPaused = true;
        alarm.play();
        // restart after every 5 minutes
        autoStartTimer = setTimeout(function(){
            startTime = millis();
            isPaused = false;
            countDownComplete = false;
            clearInterval(interval);
            interval = setInterval(timeIt, 1000);
        }, 5*60*1000);
    }
}

function preload(){
    alarm = loadSound("../assets/alarm.mp3");
}

function setup(){
    console.log("Time executed: " ,new Date());
    noCanvas();

    chrome.storage.sync.get(['default_timer'], function(result) {
        countDownTimer = result.key != undefined ? result.key : 25*60*1000;
        console.log('countDownTimer: ' + countDownTimer);
        countDownComplete = false;
        startTime = millis();
        console.log("init: ", startTime);
        isPaused = false;
        console.log("1");
        interval = setInterval(timeIt, 1000);
    });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("received request from popup!", countDownComplete, countDownTimer);
    if (request.sendTimerDetails){
      sendResponse({
          current_time: millis(),
          start_time: startTime,
          countdown_time: countDownTimer,
          is_paused: isPaused,
          countdown_complete : countDownComplete,
          paused_ts: pausedTimeStamp
      });
    }
    else if(request.restartTimer){
        if(isPaused && !countDownComplete){
          startTime = millis() - (pausedTimeStamp - startTime);
        }
        else startTime = millis();
        isPaused = false;
        console.log("2");
        countDownComplete = false;
        clearInterval(interval);
        // TODO: make sure to update countDownTimer if changed
        interval = setInterval(timeIt, 1000);
        sendResponse({
        current_time: millis(),
        start_time: startTime,
        countdown_time: countDownTimer
        });
        clearTimeout(autoStartTimer);
    }
    else if(request.pauseTimer){
        if(!countDownComplete){
          pausedTimeStamp = millis();
          isPaused = true;
          console.log("3T");
        }
        sendResponse({is_paused: isPaused});
    }
    else if(request.resetTimer){
        countDownComplete = true;
        isPaused = true;
        console.log("4T")
        clearInterval(interval);
        sendResponse({countdown_complete: true});
    }
  });

// reset timer on closing all windows
chrome.windows.onRemoved.addListener(function(){
    chrome.windows.getAll({},function(windows){
        if(windows.length == 0){
            countDownComplete = true;
            isPaused = true;
            clearInterval(interval);
            clearTimeout(autoStartTimer);
        }
    });
});

// restart timer on reopening chrome
chrome.windows.onCreated.addListener(function(){
    chrome.windows.getAll({},function(windows){
        if(windows.length == 1){
            startTime = millis();
            isPaused = false;
            countDownComplete = false;
            clearInterval(interval);
            interval = setInterval(timeIt, 1000);
            clearTimeout(autoStartTimer);
        }
    });
})
