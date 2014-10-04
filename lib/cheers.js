(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        define(["q","cheerio","curlrequest"], function(Q,cheerio,curlrequest){
            return (root.blocks = factory(Q,cheerio,curlrequest));
        });
    } else if(typeof module === "object" && module.exports) {
        module.exports = (root.blocks = factory(require("q"),require("cheerio"),require("curlrequest")));
    } else {
        root.blocks = factory(root.q,root.cheerio,root.curlrequest);
    }
}(this, function(Q,cheerio,curlrequest) {
    var module = {};

    function extractResults(html,config){
        var $ = cheerio.load(html);
        var results = [];

        var blockSelector = config.blockSelector ? config.blockSelector:"body";
        var blocks = $(blockSelector);
        blocks.each(function(index, element){
            var result = {};
            for(var key in config.scrape){
                var mapping = config.scrape[key];
                var elem = mapping['selector'] === '.' ? $(this) : $(this).find(mapping['selector']);
                if(mapping["extract"] instanceof RegExp) {
                    result[key] = elem.html() ? elem.html().match(mapping["extract"]) : "";
                }else if(mapping["extract"] === "html"){
                    result[key] = elem.html();
                }else if(mapping["extract"].toLowerCase() === "outerhtml"){
                    result[key] = $.html(elem);
                }else if(mapping["extract"] === "text"){
                    result[key] = elem.text();
                }else{
                    result[key] = elem.attr(mapping["extract"]);
                }
            }
            results.push(result);
        });

        return results;
    }

    module.scrape = function(config){
        var deferred = Q.defer();

        //validating config
        if(!config.url){
            var errorMsg = "Incorrect config, missing 'url'";

            deferred.reject(errorMsg);
        }else{
            var mappingErrors = [];

            for(var key in config.scrape) {
                var mapping = config.scrape[key];

                if (!mapping["selector"] || !mapping["extract"]) {
                    var errorMsg = "Incorrect scraper mapping, each item must have a 'selector' and an 'extract' attribute.\n";
                    errorMsg += key + ":" + JSON.stringify(mapping);

                    mappingErrors.push(errorMsg);
                }
            }

            if(mappingErrors.length > 0){
                deferred.reject(mappingErrors);
            }else{
                //curl based scraper
                var curlOptions = {
                    url: config.url
                };

                curlrequest.request(curlOptions, function (err, html) {
                    var results = extractResults(html,config);

                    deferred.resolve(results);
                });
            }
        }

        return deferred.promise;
    };

    return module;
}));