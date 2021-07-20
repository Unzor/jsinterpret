# jsinterpret
A JavaScript interpreter inside of NodeJS.

# Usage
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