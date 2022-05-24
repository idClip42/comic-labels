/** @typedef {import("./../convertToLabelData/types").Label} Label */

const CONFIG = {
    "HIDE_ON_PRINT_CLASS" : "hide-on-print",
    "LABEL_CONTROL_CLASS" : "label-control",
    "TOP_LIST_ID" : "top-list"
};

/**
 * 
 * @param {Label} label 
 * @param {Element} element 
 */
const LabelElement = function(label, element){
    this.label = label;
    this.element = element;
}

/**
 * @type {Object<string, LabelElement[]>}
 */
const labelElements = {};

window.onload = () => {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function () {
        OnLoadData(
            JSON.parse(
                this.responseText
            )
        );
    });
    oReq.open("GET", "/config");
    oReq.send();
};

/**
 * 
 * @param {Label[]} labelsSet 
 */
const OnLoadData = function (labelsSet) {
    let template = document.getElementsByClassName("tab-label")[0];
    template.parentElement.removeChild(template);

    let parentElement = document.getElementById("tabs-column");

    labelsSet.forEach(labelData => {

        // Skip the weird ones
        if (typeof (labelData.issues.start) !== "number") return;
        if (labelData.issues.start < 1) return;
        if (labelData.issues.start > 999) return;

        let newTab = template.cloneNode(true);
        newTab.getElementsByClassName("run-name")[0].innerHTML = labelData["run-name"];
        parentElement.appendChild(newTab);

        let coverImg = labelData["cover"];
        newTab.getElementsByClassName("cover")[0].src = coverImg;
        newTab.getElementsByClassName("background-img")[0].src = coverImg;

        let issueList = newTab.getElementsByClassName("issues")[0];
        let liTemplate = issueList.getElementsByTagName("li")[0];
        issueList.removeChild(liTemplate);

        let newLi = liTemplate.cloneNode(true);
        let label = newLi.getElementsByClassName("label")[0];
        if (labelData.volume != undefined) {
            if (labelData.volume > 1)
                label.innerHTML = `(Vol. ${labelData.volume}) `;
        }
        if (labelData.issues.start === labelData.issues.end) {
            newLi.getElementsByClassName("start")[0].parentElement.innerHTML = `${labelData.issues.start}`;
        }
        else {
            newLi.getElementsByClassName("start")[0].innerHTML = labelData.issues.start;
            newLi.getElementsByClassName("end")[0].innerHTML = labelData.issues.end != null ? labelData.issues.end : "__";
        }
        issueList.appendChild(newLi);

        let yearsEl = newTab.getElementsByClassName("years")[0];
        if (labelData.years) {
            if (labelData.years.start === labelData.years.end) {
                yearsEl.getElementsByClassName("start")[0].parentElement.innerHTML = `(${labelData.years.start})`
            }
            else {
                yearsEl.getElementsByClassName("start")[0].innerHTML = labelData.years.start;
                yearsEl.getElementsByClassName("end")[0].innerHTML = labelData.years.end != null ? labelData.years.end : "____";
            }
        } else {
            yearsEl.parentElement.removeChild(yearsEl);
        }

        /** @type {HTMLElement} */
        const writerList = newTab.getElementsByClassName("writers")[0];
        if (labelData.writers.length > 0) {
            for (const writer of labelData.writers) {
                AddSimpleListItem(writer, writerList);
            }
        }
        else {
            writerList.style.display = "none";
        }
        /** @type {HTMLElement} */
        const artistList = newTab.getElementsByClassName("artists")[0];
        if (labelData.artists.length > 0) {
            for (const artist of labelData.artists) {
                AddSimpleListItem(artist, artistList);
            }
        }
        else {
            artistList.style.display = "none";
        }
        const credits = newTab.getElementsByClassName("credits")[0];
        credits.appendChild(writerList);
        credits.appendChild(artistList);

        const labelElementSetName = `${labelData["run-name"]} (Vol. ${labelData.volume})`;
        if(!labelElements.hasOwnProperty(labelElementSetName)){
            labelElements[labelElementSetName] = [];
        }
        labelElements[labelElementSetName].push(
            new LabelElement(
                labelData,
                newTab
            )
        );

        const labelShowHideControls = document.createElement("div");
        labelShowHideControls.classList.add(CONFIG.HIDE_ON_PRINT_CLASS);
        labelShowHideControls.classList.add(CONFIG.LABEL_CONTROL_CLASS);
        AddShowHideButtons(
            labelShowHideControls,
            () => newTab.classList.remove(CONFIG.HIDE_ON_PRINT_CLASS),
            () => newTab.classList.add(CONFIG.HIDE_ON_PRINT_CLASS)
        );
        newTab.appendChild(labelShowHideControls);
    });

    console.log(labelElements);
    const topList = document.getElementById(CONFIG.TOP_LIST_ID);
    for(const key in labelElements){
        const topItem = document.createElement("li");
        topList.appendChild(topItem);
        console.log(key);
        AddShowHideButtons(
            topItem,
            () => labelElements[key].forEach(ish => ish.element.classList.remove(CONFIG.HIDE_ON_PRINT_CLASS)),
            () => labelElements[key].forEach(ish => ish.element.classList.add(CONFIG.HIDE_ON_PRINT_CLASS))
        );
        const label = document.createElement("span");
        label.innerHTML = key;
        topItem.appendChild(label);
    }
};

/**
 * 
 * @param {string} text 
 * @param {HTMLElement} list 
 */
const AddSimpleListItem = function (text, list) {
    const item = document.createElement("li");
    item.innerHTML = text;
    list.appendChild(item);
}

/**
 * 
 * @param {Element} parent 
 * @param {Function} showCallback 
 * @param {Function} hideCallback 
 */
const AddShowHideButtons = function(parent, showCallback, hideCallback){
    const showButton = document.createElement("button");
    showButton.innerHTML = "SHOW";
    showButton.onclick = showCallback;
    parent.appendChild(showButton);

    const hideButton = document.createElement("button");
    hideButton.innerHTML = "HIDE";
    hideButton.onclick = hideCallback;
    parent.appendChild(hideButton);
};