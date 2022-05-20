/** @typedef {import("./../convertToLabelData/types").Label} Label */

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
        if(typeof(labelData.issues.start) !== "number") return;
        if(labelData.issues.start < 1) return;
        if(labelData.issues.start > 999) return;

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
        if (labelData.volume != undefined){
            if(labelData.volume > 1)
                label.innerHTML = `(Vol. ${labelData.volume}) `;
        }
        newLi.getElementsByClassName("start")[0].innerHTML = labelData.issues.start;
        newLi.getElementsByClassName("end")[0].innerHTML = labelData.issues.end != null ? labelData.issues.end : "__";
        issueList.appendChild(newLi);

        let yearsEl = newTab.getElementsByClassName("years")[0];
        if (labelData.years) {

        if(labelData.years.start === labelData.years.end){
            yearsEl.getElementsByClassName("start")[0].parentElement.innerHTML = `(${labelData.years.start})`
        }
        else {
            yearsEl.getElementsByClassName("start")[0].innerHTML = labelData.years.start;
            yearsEl.getElementsByClassName("end")[0].innerHTML = labelData.years.end != null ? labelData.years.end : "____";
        }
        } else {
            yearsEl.parentElement.removeChild(yearsEl);
        }

        const writerList = newTab.getElementsByClassName("writers")[0];
        for(const writer of labelData.writers){
            AddSimpleListItem(writer, writerList);
        }
        const artistList = newTab.getElementsByClassName("artists")[0];
        for(const artist of labelData.artists){
            AddSimpleListItem(artist, artistList);
        }
        const credits = newTab.getElementsByClassName("credits")[0];
        credits.appendChild(writerList);
        credits.appendChild(artistList);
    });
};

/**
 * 
 * @param {string} text 
 * @param {HTMLElement} list 
 */
const AddSimpleListItem = function(text, list){
    const item = document.createElement("li");
    item.innerHTML = text;
    list.appendChild(item);
}