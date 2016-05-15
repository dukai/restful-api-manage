var fs = require('fs');
var path = require('path');

var cwd = process.cwd();
module.exports = {
    read: function(filename, data){
        if(arguments.length == 1){
            data = filename;
            filename = cwd + path.sep + 'config.json';
        }

        fs.writeFileSync(filename, JSON.stringify(data, null, 4));
    },
    save: function(filename, data){
        if(arguments.length == 1){
            data = filename;
            filename = cwd + path.sep + 'config.json';
        }
        return JSON.parse(fs.readFileSync(filename));
    }
};
