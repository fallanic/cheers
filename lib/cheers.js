(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        define(["q","cheerio","curlrequest","node-squad"], function(Q,cheerio,curlrequest,Squad){
            return (root.blocks = factory(Q,cheerio,curlrequest,Squad));
        });
    } else if(typeof module === "object" && module.exports) {
        module.exports = (root.blocks = factory(require("q"),require("cheerio"),require("curlrequest"),require("node-squad")));
    } else {
        root.blocks = factory(root.q,root.cheerio,root.curlrequest,root.Squad);
    }
}(this, function(Q,cheerio,curlrequest,Squad) {
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
                if(mapping['extract'] instanceof RegExp) {
                    result[key] = elem.html() ? elem.html().match(mapping['extract']) : "";
                }else if(mapping['extract'] === "html"){
                    result[key] = elem.html();
                }else if(mapping['extract'].toLowerCase() === "outerhtml"){
                    result[key] = $.html(elem);
                }else if(mapping['extract'] === "text"){
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

                if (!mapping['selector'] || !mapping['extract']) {
                    var errorMsg = "Incorrect scraper mapping, each item must have a 'selector' and an 'extract' attribute.\n";
                    errorMsg += key + ":" + JSON.stringify(mapping);

                    mappingErrors.push(errorMsg);
                }
            }

            if(mappingErrors.length > 0){
                deferred.reject(mappingErrors);
            }else{
                var urlArray = config.url;
                if(!Array.isArray(urlArray)){
                    urlArray = [urlArray];
                }

                Squad.run(urlArray,function(url){
                    var jobDeferred = Q.defer();

                    //curl based scraper
                    var curlOptions = config.curlOptions ? config.curlOptions: {};
                    curlOptions.url = url;

                    curlrequest.request(curlOptions, function (err, html) {
                        if(err){
                            jobDeferred.reject(err);
                        }else{
                            var results = extractResults(html,config);

                            jobDeferred.resolve(results);
                        }
                    });

                    return jobDeferred.promise;
                },{
                    disableLogs:true,
                    squadSize:config.number_of_scrapers ? config.number_of_scrapers : 2
                }).then(function(scraping_results){
                    //if only one url, no need to return an array
                    if(!Array.isArray(config.url)){
                        scraping_results = scraping_results[0];
                    }

                    deferred.resolve(scraping_results);
                }).catch(function(error){
                    deferred.reject(error);
                });
            }
        }

        return deferred.promise;
    };

    return module;
}));
