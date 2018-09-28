#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var commander = require("commander");
var fs = require("fs");
(function main() {
    var program = commander.version('1.0.0').parse(process.argv);
    var fileName = program.args[0];
    var readAsObservable = rxjs_1.bindNodeCallback(function (path, encoding, cb) { return fs.readFile(path, encoding, cb); });
    var saveAsObservable = rxjs_1.bindNodeCallback(fs.writeFile);
    readAsObservable(fileName, 'utf8')
        .pipe(operators_1.map(function (text) { return replaceEnvironmentVariables(text); }), operators_1.switchMap(function (text) { return saveAsObservable(fileName, text); }))
        .subscribe(function (_) { return console.log('Done.'); }, function (err) { return console.log('An error has occurred: ' + err); });
})();
function replaceEnvironmentVariables(text) {
    var regex = /(?<!\$)\$\w+/g;
    var matches = regex.exec(text) || [];
    var replaced = text;
    for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
        var match = matches_1[_i];
        var spliced = match.substring(1, match.length);
        var value = process.env[spliced] || '';
        replaced = replaced.replace(match, value);
        console.log('matched', match);
        console.log('spliced', spliced);
        console.log('value', value);
    }
    return replaced;
}
