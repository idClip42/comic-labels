import pkg from "isomorphic-fetch";
const { fetch: fetchNpmNode } = pkg;
import { JSDOM } from "jsdom";
import CONFIG from "./../config.json" assert { type: 'json' };
import { ComicRun, ComicIssue } from "./types.js";

const EXT_OPTIONS = [
    ".jpg",
    ".png"
];

/**
 * 
 * @param {string[]} comicRunUrls 
 * @param {boolean} getIndivPageData 
 */
export const LoadComicsData = async function(comicRunUrls, getIndivPageData){
    /** @type {ComicRun[]} */
    const runs = [];
    for(let url of comicRunUrls){
        runs.push(
            await LoadComicRun(
                url,
                getIndivPageData
            )
        );
    }
    return runs;
}

/**
 * 
 * @param {string} url 
 * @param {boolean} getIndivPageData 
 */
const LoadComicRun = async function(url, getIndivPageData){
    const response = await fetch(url);
    const text = await response.text();
    const dom = new JSDOM(text);

    const pageHeader = dom.window.document.getElementById("firstHeading");
    const volumeName = pageHeader.innerHTML.trim().split("<")[0];

    const comicRun = new ComicRun(
        volumeName,
        url
    )

    console.log(`Loading "${volumeName}"...`);

    const galleryItems = dom.window.document.getElementsByClassName(CONFIG.galleryItemClass);
        
    for(let item of galleryItems){
        comicRun.books.push(
            await CreateBook(
                item,
                getIndivPageData,
                comicRun
            )
        );
        if(comicRun.books.length % 10 === 0){
            console.log(`${comicRun.name} : ${comicRun.books.length} books loaded`);
        }
    }

    console.log(`${comicRun.name} : ${comicRun.books.length} books loaded. FINISHED.`);

    return comicRun;
}

/**
 * 
 * @param {Element} domElement 
 * @param {boolean} getIndivPageData 
 * @param {ComicRun} comicRun 
 */
const CreateBook = async function(domElement, getIndivPageData, comicRun){
    let spans = domElement.getElementsByTagName("span");
    let links = domElement.getElementsByTagName("a");
    let images = domElement.getElementsByTagName("img");

    /** @type {string} */
    const series = spans[1].innerHTML;
    const volumeName = comicRun.name;

    const issueLink = links[1];

    const issueNumText = issueLink.innerHTML.split("#")[1];
    const issue = parseFloat(issueNumText) || issueNumText;
    /** @type {string} */
    const storyName = spans[3]?.innerHTML.replace(/\"/g,"") || "";

    const releaseDate = links.length > 4 ? new Date(links[2].innerHTML) : null;
    /** @type {string} */
    // const coverMonth = links.length > 4 ? links[3].innerHTML : links[2].innerHTML;
    const coverMonth = links[links.length-1].innerHTML
    // console.log(links.length)
    const coverYear = parseInt(
        // links.length > 4 ? 
        //     links[4].innerHTML : 
        //     links[3].innerHTML
        links[links.length-1].innerHTML
    );

    // if(!coverMonth || !coverYear){
    //     console.error("ERROR");
    //     console.error(series);
    //     console.error(volumeName);
    //     console.error(issue);
    //     console.error(storyName);
    //     console.error(issueLink);
    //     console.error(releaseDate);
    //     console.error(Array.from(links).map(lnk=>lnk.innerHTML));
    //     console.error(this);
    //     throw "Problem!";
    // }

    /** @type {string} */
    let coverImg = images[0].src;
    for(let ext of EXT_OPTIONS){
        if(coverImg.includes(ext)){
            coverImg = coverImg.split(ext)[0] + ext;
            break;
        }
    }

    const issueUrl = comicRun.url.split("/wiki/")[0] + issueLink.href;

    /** @type {string[]} */
    const writers = [];
    /** @type {string[]} */
    const artists = [];

    if(getIndivPageData){
        const issuePage = await fetch(issueUrl);
        const issuePageText = await issuePage.text();
        const issuePageDom = new JSDOM(issuePageText);
        let h3s = issuePageDom.window.document.getElementsByTagName("h3");
        for(let h of h3s){
            if(h.innerHTML === "Writer(s)"){
                const names = h.parentElement.getElementsByTagName("a");
                for(let n of names){
                    writers.push(n.innerHTML);
                }
            }
            if(h.innerHTML === "Penciler(s)"){
                const names = h.parentElement.getElementsByTagName("a");
                for(let n of names){
                    artists.push(n.innerHTML);
                }
            }
        }
    }

    return new ComicIssue(
        series,
        volumeName,
        issue,
        storyName,
        releaseDate,
        coverMonth,
        coverYear,
        coverImg,
        issueUrl,
        writers,
        artists
    );
}