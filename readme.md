# Envinject
Envinject is just a small utility to replace all the environment variables found in a text file with their values. Install it with the following command:

```
npm i envinject
```

## Usage
Let's suppose you have an environment variable called `server` and you want to include its value in several places inside a text file. Simply write the name of the environment variable starting with `$` and run envinject:

```
envinject file.txt
```
All the occurrences with be replace with the variable's value.

If you want to scape the `$` character, simply repeat it: `$$`.

## Considerations
The reason I wrote this small utility is because there are many situations in which you want to include a password inside a configuration file you are going to deploy, but you don't want that password to end up being committed to your repository. A popular solution is to store that password in an environment variable and then, make another program read it. Sometimes you must include its value inside a text file and then is when this small utility can come in handy.
