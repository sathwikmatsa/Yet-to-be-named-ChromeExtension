// global variable for websites object
let websites;

// Setting up event listener to 'Add Website' button
document.getElementById("addWebsiteBtn").addEventListener("click", function(event){
    let addWebsiteDiv = document.getElementById("add_website_section");
    if(event.currentTarget.getAttribute("state") === "NormalMode"){
        addWebsiteDiv.innerHTML = `
            <input id="inputURL" class="input" type="text" placeholder="paste the url here"\>
            <input id="inputNote" class="input" type="text" placeholder="add a side note"\>
        `;
        event.currentTarget.setAttribute("state", "InputMode")
    } else {
        let url = document.getElementById("inputURL").value;
        let note = document.getElementById("inputNote").value;
        if(url === '') return; // ignore if url field is empty
        document.getElementById('addWebsiteBtn').innerText = 'Loading...';
        document.getElementById('addWebsiteBtn').classList.add('loading');
        getSiteTitle(url, function(title){
            addToStorage(url, note, title);
            addToDisplay(url, note, title);
            document.getElementById('addWebsiteBtn').innerText = 'Add Website';
            document.getElementById('addWebsiteBtn').classList.remove('loading');
        });
        event.currentTarget.setAttribute("state", "NormalMode");
        addWebsiteDiv.innerHTML = "";
    }
});

function addToDisplay(url, note, title){
    let htmlTemplate = `
        <div class="website">
            <div class='content'>
                <a id='url' href=`+url+` target='blank' class='link'>
                <p id='title' class='siteinfo title'>`+ title +`</p>
                <p id='domain' class='siteinfo domain'>`+ (new URL(url)).hostname +`</p>
                <p id='note' class='siteinfo note'>`+note+`</p>
                </a>
                <div id='options'>
                    <input type="image" id='delete_option' src="/assets/icons/delete.png" />
                </div>
            </div>
        </div>
    `;
    // create a list item out of the template
    let listItem = document.createElement("li");
    listItem.innerHTML = htmlTemplate;

    // add event listeners to elements in options div
    listItem.querySelector('#delete_option').addEventListener("click", delete_site);

    // append the element to queue
    document.getElementById("queue").appendChild(listItem);
}

chrome.storage.sync.get(['SavedWebsites'], function(result) {
    if(result.SavedWebsites){
        websites = result.SavedWebsites;
        let nWebsites = websites.length;
        for(let i = 0; i < nWebsites; i++){
            addToDisplay(websites[i].url, websites[i].note, websites[i].title);
        }
    } else {
        websites = [];
    }
});

function addToStorage(url_p, note_p, title_p){
    websites.push({url: url_p, note: note_p, title: title_p});
    chrome.storage.sync.set({SavedWebsites: websites});
    return;
}

function delete_site(event){
    let listItem = event.currentTarget.closest('.website').parentElement;
    let url = listItem.querySelector('#url').getAttribute('href');
    let note = listItem.querySelector('#note').innerText;
    websites.splice(websites.findIndex(site => site.url === url && site.url === note), 1);
    chrome.storage.sync.set({SavedWebsites: websites});
    listItem.remove();
}

function getSiteTitle(url, callback){
    let req = new XMLHttpRequest();
    req.open("GET", 'https://api.allorigins.ml/get?method=raw&url=' + encodeURIComponent(url));
    req.responseType = 'document';
    req.onload = function(){
        if(req.status != 200) return; // bad request
        let title = req.response.title;
        callback(title.substring(0, 100) + (title.length > 100 ? '...' : ''));
    };
    req.send();
}
