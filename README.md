Cheers
==========

Scrape a website efficiently, block by block, page by page.

## Motivations

This is a Cheerio based scraper, useful to extract data from a website using css selectors.
The motivation behind this package is to provide a simple cheerio-based scraping tool, able to divide a website into blocks, and transform each block into a json object using css selectors.

### Built on top of the excellents :

https://github.com/cheeriojs/cheerio
https://github.com/chriso/curlrequest
https://github.com/kriskowal/q

### Css mapping syntax inspired by :

https://github.com/dharmafly/noodle

## Getting Started

Install the module with: `npm install cheers`

## Usage

Configuration options:

- `config.url` : the URL to scrape
- `config.blockSelector` : the CSS selector to apply on the page to divide it in scraping blocks. This field is optional (will use "body" by default)
- `config.scrape` : the definition of what you want to extract in each block. each key has two *mandatory* attributes `selector` (a CSS selector) and `extract`. The possible values for `extract` are *text*, *html* or the name of an attribute on the html element (e.g. "href").


<pre>
var cheers = require('cheers');

//let's scrape this excellent JS news website
var config = {
    url:"http://www.echojs.com/",
    blockSelector:"article",
    scrape:{
        title:{
            selector:"h2 a",
            extract:"text"
        },
        link:{
            selector:"h2 a",
            extract:"href"
        },
        linkHtml:{
            selector:"p",
            extract:"html"
        }
    }
};

cheers.scrape(config).then(function(results){
    console.log(JSON.stringify(results));
}).catch(function(error){
    console.error(error);
});
</pre>


## Roadmap

- website pagination
- option to use a headless browser
- option to use request instead of curl?

That's all folks!

# License
Copyright (c) 2014 Fabien Allanic  
Licensed under the MIT license.