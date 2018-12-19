let startTime;
let countDownTimer;
let interval;
let countDownComplete;
let alarm;
let isPaused;
let pausedTimeStamp;

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
        alarm.play();
    }
}

function preload(){
    alarm = loadSound("../assets/alarm.mp3");
}

function setup(){
    console.log("Time executed: " ,new Date());
    noCanvas();

    chrome.storage.sync.get(['default_timer'], function(result) {
        countDownTimer = result.key != undefined ? result.key : 10*1000;
        console.log('countDownTimer: ' + countDownTimer);
        countDownComplete = false;
        startTime = millis();
        console.log("init: ", startTime);
        isPaused = false;
        interval = setInterval(timeIt, 1000);
    });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("received request from popup!", countDownComplete, countDownTimer);
    if (request.sendTimerDetails){
      sendResponse({
          current_time: millis() - startTime,
          countdown_time: countDownTimer,
          countdown_complete : countDownComplete
      });
    }
    else if(request.restartTimer){
        countDownComplete = false;
        if(isPaused){
          startTime = millis() - (pausedTimeStamp - startTime);
          isPaused = false;
        }
        else startTime = millis();
        clearInterval(interval);
        // TODO: make sure to update countDownTimer if changed
        interval = setInterval(timeIt, 1000);
        sendResponse({
        current_time: millis() - startTime,
        countdown_time: countDownTimer
        });
    }
    else if(request.pauseTimer){
        if(!countDownComplete){
          pausedTimeStamp = millis();
          isPaused = true;
        }
        sendResponse({is_paused: isPaused});
    }
    else if(request.resetTimer){
        countDownComplete = true;
        isPaused = false;
        clearInterval(interval);
        sendResponse({countdown_complete: true});
    }
  });
