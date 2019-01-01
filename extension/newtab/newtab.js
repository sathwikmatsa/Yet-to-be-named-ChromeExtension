chrome.runtime.sendMessage({getWallpaperURL: true}, function(response) {
    let bg_url = response.url != undefined ? response.url : "/assets/fallback_wallpapers/"+Math.round(Math.random()*9)+".jpg";
    document.getElementsByTagName("body")[0].style.backgroundImage = 'url(' + bg_url +')' ;
});

function pad(n){
    return (n < 10) ? ('0' + n) : n;
}
function timeNow(i) {
    let d = new Date(),
        h = d.getHours(),
        m = d.getMinutes();
    let H = Number(h);
    let M = Number(m);
    let time, day;
    if(H == 0) {time = 12 + ':' + pad(M); day = "AM";}
    else if(H < 12) {time = H + ':' + pad(M); day = "AM";}
    else if(H == 12) {time =  12 + ':' + pad(M); day = "PM";}
    else {time = (H - 12) + ':' + pad(M); day = "PM";}
    document.getElementById("time").innerHTML = time;
    document.getElementById("day").innerHTML = day;

}

timeNow();
setInterval(timeNow, 60*1000);
