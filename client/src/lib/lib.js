
var lib = {};

lib.escapeSingleQuotes = function(s) {
    return s.replace(/[']/g, "''");
};

module.exports = lib;

