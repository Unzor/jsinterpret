# jsinterpret
A JavaScript interpreter inside of NodeJS.

# Usage
## NodeJS
First, use this:
```
npm install jsinterpret
```

Then, if you already have NodeJS installed, run ```npm init -y``` and create index.js.

Contents of index.js:
```javascript
var jsinterpret=require('jsinterpret');

jsinterpret.interpret("console.log('Hello World!');", function(e){
  console.log(e);
});
```
To require() a package, use jsinterpret.addPackage(packageName) before any script, or install it in your machine.
Example:

```javascript
var jsinterpret=require('jsinterpret');

jsinterpret.addPackage("chalk")

jsinterpret.interpret(`const chalk=require('chalk'); 
console.log(chalk.blue('Hello World!'));`, function(e){
  console.log(e);
});
```
## Browser
First, get the script from a CDN or download it.
Then, use it like this:
```javascript
var jsinterpret=new JSInterpret();
jsinterpret.interpret("console.log('Hello World!')");
```
If you wanna use it for another reason instead of logging it in the console, use this:

```javascript
var jsinterpret=new JSInterpret();
jsinterpret.interpret("console.log('Hello World!')", function(result){
alert(result);
});
```

You can also ```require()``` the VM module in the interpreter.
