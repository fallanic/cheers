#!/usr/bin/env node

var cheers = require('../cheers'), args = process.argv.slice(2), config = {};

if(args[0] == '-conf')
{
   try
   {
    config = require(args[1]);
   }
   catch(Exception)
   {
    console.log(Exception);
    process.exit();
   }
}
else
{
   console.error('Please provide the path to the config file to use using -conf option.');
   process.exit();
}

// For some reason the Regexp string of the config file
// has trouble being seen as a RegExp object
for(var key in config.scrape){
    var mapping = config.scrape[key];
    if(mapping['extract'] != undefined)
    {
        var regParts = mapping['extract'].match(/^\/(.*?)\/([gim]*)$/);
        if (regParts) {
            mapping['extract'] = new RegExp(regParts[1], regParts[2]);
        }
    }
}

cheers.scrape(config).then(function (results) {
    console.log(JSON.stringify(results));
}).catch(function (error) {
    console.error(error);
});