var cheers = require('../lib/cheers.js');

//let's scrape this excellent JS news website
var config = {
    url: "http://www.echojs.com/",
    blockSelector: "article",
    scrape: {
        title: {
            selector: "h2 a",
            extract: "text"
        },
        link: {
            selector: "h2 a",
            extract: "href"
        },
        linkHtml: {
            selector: "p",
            extract: "html"
        }
    }
};

cheers.scrape(config).then(function (results) {
    console.log(JSON.stringify(results));
}).catch(function (error) {
    console.error(error);
});
