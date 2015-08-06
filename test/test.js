var chai = require('chai');
var should = chai.should();
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var cheers = require('../lib/cheers.js')

var wellFormedConfig = {
    url: "http://www.echojs.com",    
    blockSelector: "article",
    scrape: { title: { selector: "h2 a", extract: "text" } }
};

var noUrlConfig = {
    blockSelector: "article",
    scrape: { title: { selector: "h2 a", extract: "text" } }
};

var badScrapperConfig = {
	url: "http://www.echojs.com",
    blockSelector: "article",
    scrape: { title: { selector: "h2 a" } }
};

var badScrapperConfig = {
	url: "http://www.echojs.com",
    blockSelector: "article",
    scrape: { title: {  extract: "text" } }
};

var missingBlockSelectorConfig = {
	url: "http://www.echojs.com",
    scrape: { title: { selector: "h2 a" } }
};
 

describe('Correct config parsing', function() {
    it('should scrap without error', function() {
      	return cheers.scrape(wellFormedConfig).should.be.fulfilled;
    });
});

describe('Incorrect config parsing', function() {
    it('should return error', function() {
      	return cheers.scrape(noUrlConfig).should.be.rejected;
    });
});

describe('Types of config error - url', function() {
    it('should return with url error', function() {
      	return cheers.scrape(noUrlConfig).should.be.rejectedWith("Incorrect config, missing 'url'");
    });
});

describe('Types of config error - bad scrapper (missing extract)', function() {
    it('should return with bad scrapper error', function() {
      	return cheers.scrape(badScrapperConfig).should.be.rejectedWith("Incorrect scraper mapping, each item must have a 'selector' and an 'extract' attribute.\n");
    });
});

describe('Types of config error - bad scrapper (missing selector)', function() {
    it('should return with bad scrapper error', function() {
      	return cheers.scrape(badScrapperConfig).should.be.rejectedWith("Incorrect scraper mapping, each item must have a 'selector' and an 'extract' attribute.\n");
    });
});

// Testing scrapping returned data - using echo.js for the moment

var resultConfig = {
    url: "http://www.echojs.com/",    
    blockSelector: "head",
    scrape: {
        title: {
            selector: "title",
            extract: "text"
        }
    }
};

describe('Scrapping result test - title of a page', function() {
    it('should return the title of the echo js frontpage', function() {
        return cheers.scrape(resultConfig).should.eventually.
                      deep.equal(Array({"title": "\nEcho JS - JavaScript News\n"}));
    });
});


var resultConfig2 = {
    url: "http://www.echojs.com/",    
    blockSelector: "article",
    scrape: {
        articleLink: {
            selector: "h2 b",
            extract: "text"
        }
    }
};

describe('Scrapping result test - article link ', function() {
    it('should return an array of results', function() {
        return cheers.scrape(resultConfig2).should.eventually.
                      not.be.empty.and.should.eventually.have.lengthOf(30);
    });
});




