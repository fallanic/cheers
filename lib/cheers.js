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
    var module = {}

    module.scrape = function(config){
        var deferred = Q.defer();

        //validating config
        if(!config.url){
            var errorMsg = "Incorrect config, missing 'url'";
            console.error(errorMsg)
            deferred.reject(errorMsg);
        }else{
            for(var key in config.scrape){
                var mapping = config.scrape[key];
                var mappingErrors = [];
                if(!mapping["selector"] || !mapping["extract"]){
                    var errorMsg = "Incorrect scraper mapping, each item must have a 'selector' and an 'extract' attribute.\n";
                    errorMsg += key+":"+JSON.stringify(mapping);
                    console.error(errorMsg);
                    mappingErrors.push(errorMsg);
                }
                if(mappingErrors.length > 0){
                    deferred.reject(mappingErrors);
                }else{
                    //config is valid, let's scrape
                    var curlOptions = {
                        url: config.url
                    };

                    var blockSelector = config.blockSelector ? config.blockSelector:"body";
                    var results = [];

                    curlrequest.request(curlOptions, function (err, html) {
                        var $ = cheerio.load(html);
                        var blocks = $(blockSelector);
                        blocks.each(function(index, element){
                            var result = {};
                            for(var key in config.scrape){
                                var mapping = config.scrape[key];
                                if(mapping["extract"] === "html"){
                                    result[key] = $(this).find(mapping['selector']).parent().html();
                                }else if(mapping["extract"] === "text"){
                                    result[key] = $(this).find(mapping['selector']).text();
                                }else{
                                    result[key] = $(this).find(mapping['selector']).attr(mapping["extract"]);
                                }
                            }
                            results.push(result);
                        });

                        deferred.resolve(results);
                    });
                }
            }
        }

        return deferred.promise;
    };

    return module;
}));
