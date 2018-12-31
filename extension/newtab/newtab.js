function timeNow(i) {
    let d = new Date(),
        h = (d.getHours()<10?'0':'') + d.getHours(),
        m = (d.getMinutes()<10?'0':'') + d.getMinutes();
    let H = Number(h);
    let M = Number(m);
    let time, day;
    if(H == 0) {time =  (12 + H) + ':' + M; day = "AM";}
    else if(H < 12) {time = H + ':' + M; day = "AM";}
    else if(H == 12) {time =  H + ':' + M; day = "PM";}
    else {time = (H - 12) + ':' + M; day = "PM";}
    document.getElementById("time").innerHTML = time;
    document.getElementById("day").innerHTML = day;

}

timeNow();
setInterval(timeNow, 1000);
