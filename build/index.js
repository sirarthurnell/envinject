#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var commander = require("commander");
var fs = require("fs");
(function main() {
    var fileToParse = '';
    var program = commander
        .version('1.0.0')
        .command('envinject <file>')
        .action(function (file) { return fileToParse = file; })
        .parse(process.argv);
    if (!fileToParse) {
        console.error('No file specified!');
        process.exitCode = 1;
    }
    else {
        parseFile(fileToParse);
    }
})();
function parseFile(fileName) {
    var readAsObservable = rxjs_1.bindNodeCallback(function (path, encoding, cb) { return fs.readFile(path, encoding, cb); });
    var saveAsObservable = rxjs_1.bindNodeCallback(fs.writeFile);
    readAsObservable(fileName, 'utf8')
        .pipe(operators_1.map(function (text) { return replaceEnvironmentVariables(text); }), operators_1.switchMap(function (text) { return saveAsObservable(fileName, text); }))
        .subscribe(function (_) {
        console.log('Done.');
        process.exitCode = 0;
    }, function (err) {
        console.log('An error has occurred: ' + JSON.stringify(err));
        process.exitCode = 1;
    });
}
function replaceEnvironmentVariables(text) {
    var regex = /(?<!\$)\$\w+/g;
    var matches = regex.exec(text) || [];
    var replaced = text;
    for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
        var match = matches_1[_i];
        var spliced = match.substring(1, match.length);
        var value = process.env[spliced] || '';
        replaced = replaced.replace(match, value);
    }
    return replaced;
}
