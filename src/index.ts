#!/usr/bin/env node

import { bindNodeCallback, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as commander from 'commander';
import * as fs from 'fs';

/**
 * Entry point.
 */
(function main() {
  let fileToParse = '';
  const program = commander
    .version('1.0.0')
    .command('envinject <file>')
    .action((file: string) => fileToParse = file)
    .parse(process.argv);

  if(!fileToParse) {
    console.error('No file specified!');
    process.exitCode = 1;
  } else {
    parseFile(fileToParse);
  }
})();

/**
 * Parses the specified file.
 * @param fileName File to parse.
 */
function parseFile(fileName: string): void {
  const readAsObservable = bindNodeCallback(
    (
      path: string,
      encoding: string,
      cb: (err: NodeJS.ErrnoException, data: string | Buffer) => void
    ) => fs.readFile(path, encoding, cb)
  );
  const saveAsObservable = bindNodeCallback(fs.writeFile);

  (readAsObservable(fileName, 'utf8') as Observable<string>)
    .pipe(
      map(text => replaceEnvironmentVariables(text)),
      switchMap(text => saveAsObservable(fileName, text) as Observable<any>)
    )
    .subscribe(
      _ => {
        console.log('Done.');
        process.exitCode = 0;
      },
      err => {
        console.log('An error has occurred: ' + JSON.stringify(err));
        process.exitCode = 1;
      }
    );
}

/**
 * Text with environment variables to replace with
 * their values.
 * @param text Text with environment variables.
 */
function replaceEnvironmentVariables(text: string): string {
  const regex = /(?<!\$)\$\w+/g;
  const matches = regex.exec(text) || [];
  let replaced = text;

  for (const match of matches) {
    const spliced = match.substring(1, match.length);
    const value = process.env[spliced] || '';
    replaced = replaced.replace(match, value);
  }

  return replaced;
}
