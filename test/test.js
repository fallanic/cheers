// Test requirements

var chai = require('chai'),should = chai.should(), chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised), cheers = require('../lib/cheers.js'), app = require('./app.js');

// Declaring our different configs to test

var wellFormedConfig = {
        url: "http://localhost:3000/echojs.html",
        blockSelector: "article",
        scrape: { title: { selector: "h2 a", extract: "text" } }
    },

    noUrlConfig = {
        blockSelector: "article",
        scrape: { title: { selector: "h2 a", extract: "text" } }
    },

    badScrapperConfig = {
	    url: "http://localhost:3000/echojs.html",
        blockSelector: "article",
        scrape: { title: {  extract: "text" } }
    };

// Let the tests begin (config)

describe('Configurations test', function(){

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

    describe('Types of config error - bad scrapper (missing selector)', function() {
        it('should return with bad scrapper error', function() {
            return cheers.scrape(badScrapperConfig).should.be.rejectedWith("Incorrect scraper mapping, each item must have a 'selector' and an 'extract' attribute.\n");
        });
    });

});

// Testing scrapping returned data

describe('cheers returned data', function () {
    var server;

    before(function () {
        server = app.listen(3000, function () {});
    });

    var configForTitle = {
        url: "http://localhost:3000/echojs.html",
        blockSelector: "head",
        scrape: {
            title: {
                selector: "title",
                extract: "text"
            }
        }
    };

    describe('Scrapping result test - title of a page', function() {
        it('should return the title of the echojs frontpage', function() {
            return cheers.scrape(configForTitle).should.eventually.
                deep.equal(Array({"title": "\nEcho JS - JavaScript News\n"}));
        });
    });

    var configForArticles = {
        url: "http://localhost:3000/echojs.html",
        blockSelector: "article",
        scrape: {
            articleLink: {
                selector: "h2 b",
                extract: "text"
            }
        }
    };

    describe('Scrapping result test - article link ', function() {
        it('should return an array of 30 results', function() {
            return cheers.scrape(configForArticles).should.eventually.
                not.be.empty.and.should.eventually.have.lengthOf(30);
        });
    });

    after(function () {
        server.close();
    });
});