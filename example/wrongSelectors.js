var cheers = require('../lib/cheers.js');

//TODO these should be unit tests

//let's scrape this excellent JS news website
var config = {
    url: "http://www.echojs.com/",
    blockSelector: "article.IDontExist",
    scrape: {
        title: {
            selector: "h2 a.IDontExist",
            extract: "text"
        },
        link: {
            selector: "h2 a.IDontExist",
            extract: "href"
        },
        articleInnerHtml: {
            selector: ".",
            extract: "html"
        },
        articleOuterHtml: {
            selector: ".",
            extract: "outerHTML"
        },
        articlePublishedTime: {
            selector: 'p.IDontExist',
            extract: /\d* (?:hour[s]?|day[s]?) ago/
        }
    }
};

cheers.scrape(config).then(function (results) {
    console.log(JSON.stringify(results));
}).catch(function (error) {
    console.error(error);
});

config = {
    url: "http://www.echojs.com/",
    blockSelector: "article",
    scrape: {
        title: {
            selector: "h2 a.IDontExist",
            extract: "text"
        },
        link: {
            selector: "h2 a.IDontExist",
            extract: "href"
        },
        articleInnerHtml: {
            selector: ".",
            extract: "html"
        },
        articleOuterHtml: {
            selector: ".",
            extract: "outerHTML"
        },
        articlePublishedTime: {
            selector: 'p.IDontExist',
            extract: /\d* (?:hour[s]?|day[s]?) ago/
        }
    }
};

cheers.scrape(config).then(function (results) {
    console.log(JSON.stringify(results));
}).catch(function (error) {
    console.error(error);
});