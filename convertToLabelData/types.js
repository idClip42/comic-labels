/**
 * 
 * @param {string} name 
 * @param {string} coverUrl 
 * @param {RangeSet} years 
 * @param {RangeSet} issues 
 * @param {number} volume 
 * @param {string[]} writers 
 * @param {string[]} artists 
 */
export const Label = function(name, coverUrl, years, issues, volume, writers, artists){
    this["run-name"] = name;
    this.cover = coverUrl;
    this.years = years;
    this.issues = issues;
    this.volume = volume;
    this.writers = writers;
    this.artists = artists;
};

/**
 * 
 * @param {string} name 
 */
Label.prototype.AddWriter = function(name){
    if(!this.writers.includes(name))
        this.writers.push(name);
}


/**
 * 
 * @param {string} name 
 */
Label.prototype.AddArtist = function(name){
    if(!this.artists.includes(name))
        this.artists.push(name);
}

/**
 * 
 * @param {number} start 
 * @param {number} end 
 */
 export const RangeSet = function(start, end){
    this.start = start;
    this.end = end;
};

/**
 * 
 * @param {number} value 
 */
RangeSet.prototype.AddValue = function(value){
    if(this.end < value){
        this.end = value;
    }
    if(this.start > value){
        this.start = value;
    }
};