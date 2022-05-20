import { RangeSet, Label } from "./types.js";
import CONFIG from "./../config.json" assert { type: 'json' };
/** @typedef {import("./../loadComicsData/types").ComicRun} ComicRun */
/** @typedef {import("./../loadComicsData/types").ComicIssue} ComicIssue */

/**
 * 
 * @param {ComicRun[]} comicRuns 
 */
export const ConvertToLabelData = function(comicRuns){
    const results = [];
    for(let run of comicRuns){
        results.push(
            ...HandleComicRun(run)
        );
    }
    return results;
};

/**
 * 
 * @param {ComicRun} comicRun 
 */
const HandleComicRun = function(comicRun){
    /** @type {Label} */
    const results = [];

    if(comicRun.length === 0) return results;

    comicRun.books.sort((a,b) => {
        return a.issue - b.issue;
    });

    /** @type {Label} */
    let currentLabel = null;

    for(let issue of comicRun.books){

        let shouldMakeNewLabel = false;
        // If there is no current label
        shouldMakeNewLabel |= !currentLabel;
        // Or if we're on a first issue
        shouldMakeNewLabel |= issue.issue === 1;
        // Or if we've hit the label interval
        shouldMakeNewLabel |= issue.issue % CONFIG.labelInterval === 0;
        if(currentLabel){
            // Or if we've jumped past the label interval (like FF vol. 1 jumps from 416 to 500)
            const nextLabelIssue = currentLabel.issues.start + CONFIG.labelInterval;
            shouldMakeNewLabel |= issue.issue > nextLabelIssue;
        }

        if(shouldMakeNewLabel){
            currentLabel = new Label(
                comicRun.name,
                issue.coverImg,
                new RangeSet(
                    GetYear(issue),
                    GetYear(issue)
                ),
                new RangeSet(
                    issue.issue,
                    issue.issue
                ),
                comicRun.volume,
                [],
                []
            )
            results.push(currentLabel);
        }
        else {
            currentLabel.years.AddValue(GetYear(issue));
            currentLabel.issues.AddValue(issue.issue);
        }
        issue.writers.forEach(name => currentLabel.AddWriter(name));
        issue.artists.forEach(name => currentLabel.AddArtist(name));
    }

    return results;
};

/**
 * 
 * @param {ComicIssue} issue 
 */
const GetYear = function(issue){
    if(issue.releaseDate)
        return issue.releaseDate.getFullYear();
    if(issue.coverYear)
        return issue.coverYear;
    return -1;
};