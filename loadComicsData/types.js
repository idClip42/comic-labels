const VOLUME_KEY = " Vol ";

/**
 * 
 * @param {string} name 
 * @param {string} url 
 */
export const ComicRun = function(name, url){
    this.name = name;
    this.volume = "";
    this.url = url;
    /** @type {ComicIssue[]} */
    this.books = [];

    if(this.name.includes(VOLUME_KEY)){
        const spl = this.name.split(VOLUME_KEY);
        this.name = spl[0];
        this.volume = parseInt(spl[1]);
    };
}

/**
 * 
 * @param {string} series 
 * @param {string} volumeName 
 * @param {number|string} issue 
 * @param {string} storyName 
 * @param {Date} releaseDate 
 * @param {string} coverMonth 
 * @param {number} coverYear 
 * @param {string} coverImg 
 * @param {string} issueUrl 
 * @param {string[]} writers 
 * @param {string[]} artists 
 */
export const ComicIssue = function(
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
){
    this.series = series;
    this.volumeName = volumeName;
    this.issue = issue;
    this.storyName = storyName;
    this.releaseDate = releaseDate;
    this.coverMonth = coverMonth;
    this.coverYear = coverYear;
    this.coverImg = coverImg;
    this.issueUrl = issueUrl;
    this.writers = writers;
    this.artists = artists;
};