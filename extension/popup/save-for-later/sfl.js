let addWebsiteDiv = document.getElementById("add_website_section");
let websiteDiv = document.getElementById("websites");
let websites;

/* website object has
 *  url -> String,
 *  note -> String
 */

//TODO: refactor code using Element.closest()

function createElementFromHTML(html){
    let div = document.createElement("div");
    div.innerHTML = html.trim();
    return div.firstChild;
}

function findSiteIndex(url){
    let nWebsites = websites.length;
    for(let i = 0; i < nWebsites; i++){
        if(websites[i].url === url) return i;
    }
}


function displayOptions(evt){
    let property = evt.currentTarget.nextElementSibling.style.display;
    evt.currentTarget.nextElementSibling.style.display = (property === "block" ? "none" : "block");
}

function clearOptions(evt){
    evt.currentTarget.nextElementSibling.style.display = "none";
}

function showOptionGear(evt){
    try{
        if(evt.currentTarget.getElementsByClassName("dropdown-content")[0].style.display == "block") return;
        evt.currentTarget.getElementsByClassName("dropdown")[0].style.display = "inline-block";
    } catch(error){
        // ignore
    }
}

function hideOptionGear(evt){
    try{
        if(evt.currentTarget.getElementsByClassName("dropdown-content")[0].style.display == "block") return;
        evt.currentTarget.getElementsByClassName("dropdown")[0].style.display = "none";
    } catch(error){
        // ignore
    }
}

function deleteSite(evt){
    let url = evt.currentTarget.parentElement.parentElement.previousElementSibling.innerText;
    let siteIndex = findSiteIndex(url);
    // remove site from websites list
    websites.splice(siteIndex, 1);
    // update storage
    chrome.storage.sync.set({SavedWebsites: websites});
    // update frontend
    evt.currentTarget.parentElement.parentElement.parentElement.remove();
}

function saveSite(evt){
    let modifiedURL = evt.currentTarget.parentElement.previousElementSibling.previousElementSibling.value;
    let prevURL = evt.currentTarget.parentElement.previousElementSibling.previousElementSibling.getAttribute("prev");
    let modifiedNote = evt.currentTarget.parentElement.previousElementSibling.value;
    let siteDiv = evt.currentTarget.parentElement.parentElement.parentElement;
    siteDiv.innerHTML = "";
    let siteIndex = findSiteIndex(prevURL);
    websites[siteIndex].url = modifiedURL;
    websites[siteIndex].note = modifiedNote;
    siteDiv.appendChild(createWebsiteItem(modifiedURL, modifiedNote));
    chrome.storage.sync.set({SavedWebsites: websites});
}

function cancelEdit(evt){
    let prevURL = evt.currentTarget.parentElement.previousElementSibling.previousElementSibling.getAttribute("prev");
    let prevNote = evt.currentTarget.parentElement.previousElementSibling.getAttribute("prev");
    let siteDiv = evt.currentTarget.parentElement.parentElement.parentElement;
    siteDiv.innerHTML = "";
    let siteIndex = findSiteIndex(prevURL);
    siteDiv.appendChild(createWebsiteItem(prevURL, prevNote));
}

function editSite(evt){
    let siteDiv = evt.currentTarget.parentElement.parentElement.parentElement;
    let url = evt.currentTarget.parentElement.parentElement.previousElementSibling.innerText;
    let note = evt.currentTarget.parentElement.parentElement.previousElementSibling.previousElementSibling.innerText;
    console.log(url, note);
    siteDiv.innerHTML = `
        <input id="editURL" class="input edit-site" type="text" placeholder="mandatory URL">
        <input id="editNote" class="input edit-site" type="text" placeholder="add a side note">
        <p class="edit">
            <button id="save" class="edit-options save">save</button>
            <button id="cancel" class="edit-options cancel">cancel</button>
        </p>
    `;
    siteDiv.firstElementChild.defaultValue = url;
    siteDiv.firstElementChild.setAttribute("prev", url);
    siteDiv.firstElementChild.nextElementSibling.defaultValue = note;
    siteDiv.firstElementChild.nextElementSibling.setAttribute("prev", note);
    siteDiv.getElementsByTagName("button")[0].addEventListener("click", saveSite);
    siteDiv.getElementsByTagName("button")[1].addEventListener("click", cancelEdit);
}

function createWebsiteItem(url, note){
    let template = `
        <div class="website">
            <p class="note">` + note + `</p>
            <a href=` + url + ` target="_blank">` + url + `</a>
            <div class="dropdown">
                <input type="image" src="../../assets/ellipsis.png" />
                <div class="dropdown-content">
                  <a>edit</a>
                  <a>delete</a>
                </div>
            </div>
        </div>
    `;
    let siteDiv = createElementFromHTML(template);
    siteDiv.addEventListener("mouseover", showOptionGear);
    siteDiv.addEventListener("mouseout", hideOptionGear);
    let options = siteDiv.getElementsByTagName('input')[0];
    options.addEventListener("click", displayOptions);
    let edit = siteDiv.getElementsByTagName('a')[1];
    edit.addEventListener("click", editSite);
    let del = siteDiv.getElementsByTagName('a')[2];
    del.addEventListener("click", deleteSite);
    return siteDiv;
}

chrome.storage.sync.get(['SavedWebsites'], function(result) {
    if(result.SavedWebsites){
        websites = result.SavedWebsites;
        let nWebsites = websites.length;
        for(let i = 0; i < nWebsites; i++){
            let site_container = document.createElement('div');
            site_container.appendChild(createWebsiteItem(websites[i].url, websites[i].note));
            websiteDiv.appendChild(site_container);
        }
    } else {
        websites = [];
    }
});

document.getElementById("addWebsiteBtn").addEventListener("click", function(event){
    if(event.currentTarget.getAttribute("state") === "Normal"){
        addWebsiteDiv.innerHTML = `
            <input id="inputURL" class="input" type="text" placeholder="paste the url"\>
            <input id="inputNote" class="input" type="text" placeholder="add a side note"\>
        `;
        event.currentTarget.setAttribute("state", "Input");
    } else {
        //TODO: discard duplicate website
        let inputURL = document.getElementById("inputURL");
        let inputNote = document.getElementById("inputNote");
        if(inputURL.value === "") return;
        websiteDiv.appendChild(createWebsiteItem(inputURL.value, inputNote.value));
        websites.push({url:inputURL.value, note:inputNote.value});
        chrome.storage.sync.set({SavedWebsites: websites}, function() {
          console.log('New website added to storage :' + websites[websites.length-1]);
        });
        event.currentTarget.setAttribute("state", "Normal");
        addWebsiteDiv.innerHTML = "";
    }
});
