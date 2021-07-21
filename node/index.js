const shell=require('shelljs');

exports.interpret=function(__code__, callback){
var return_log=function(a){callback(a);}
            function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

const util = require("util");
const repl = require("repl");
const path = require("path");
const fs = require("fs");
const vm = require("vm");
const rl = require("./readline-sync.js");
const Module = require("module");

let r;

// Red errors.
function logError(msg) {
  return_log(msg);
}

// The nodejs repl operates in raw mode and does some funky stuff to
// the terminal. This ns the repl and forces non-raw mode.
function pauseRepl() {
  if (!r) return;

  r.pause();
  process.stdin.setRawMode(false);
}

// Forces raw mode and resumes the repl.
function resumeRepl() {
  if (!r) return;

  process.stdin.setRawMode(true);
  r.resume();
}

// Clear the line if it has anything on it.
function clearLine() {
  if (r && r.line) r.clearLine();
}

// Adapted from the internal node repl code just a lot simpler and adds
// red errors (see https://bit.ly/2FRM86S)
function handleError(e) {
  if (r) {
    r.lastError = e;
  }

  if (e && typeof e === "object" && e.stack && e.name) {
    if (e.name === "SyntaxError") {
      e.stack = e.stack
        .replace(/^repl:\d+\r?\n/, "")
        .replace(/^\s+at\s.*\n?/gm, "");
    }

    logError(e.stack);
  } else {
    // For some reason needs a newline to flush.
    logError("Thrown: " + r.writer(e) + "\n");
  }

  if (r) {
    r.clearBufferedCommand();
    r.lines.level = [];
    r.displayPrompt();
  }
}

function start(context) {
  r = repl.start({
    prompt: process.env.Y_PS1,
    useGlobal: true,
  });

  // remove the internal error and ours for red etc.
  r._domain.removeListener("error", r._domain.listeners("error")[0]);
  r._domain.on("error", handleError);
  process.on("uncaughtException", handleError);
}

global.alert = return_log;
global.require=require;
global.prompt = (p) => {
  pauseRepl();
  clearLine();

  let ret = rl.question(`${p}> `, {
    hideEchoBack: false,
  });

  resumeRepl();

  // Display prompt on the next turn.
  if (r) setImmediate(() => r.displayPrompt());

  return ret;
};

global.confirm = (q) => {
  pauseRepl();
  clearLine();

  const ret = rl.keyInYNStrict(q);

  resumeRepl();

  // Display prompt on the next turn.
  if (r) setImmediate(() => r.displayPrompt());
  return ret;
};

if (__code__) {
  vm.runInThisContext(__code__);
  if (process.env.Y_INTERACTIVE) {
    start();
  }
} else if (process.env.Y_EXP) {
 return_log(vm.runInThisContext(process.env.Y_EXP));
  if (process.env.Y_INTERACTIVE) {
    start();
  }
} else if (process.env.Y_FILE) {
  const mainPath = path.resolve(process.env.Y_FILE);
  const main = fs.readFileSync(mainPath, "utf-8");
  const module = new Module(mainPath, null);

  module.id = ".";
  module.filename = mainPath;
  module.paths = Module._nodeModulePaths(path.dirname(mainPath));

  process.mainModule = module;

  global.module = module;
  global.require = module.require.bind(module);
  global.__dirname = path.dirname(mainPath);
  global.__filename = mainPath;

  let script;
  try {
    script = vm.createScript(__code__, {
      filename: mainPath,
      displayErrors: false,
        require: require,
  console: console
    });
  } catch (e) {
    handleError(e);
  }

  if (script) {
    let res;
    try {
      res = script.runInThisContext({
        displayErrors: false,
      });
     } catch (e) {
      handleError(e);
    }

    module.loaded = true;

    if (typeof res !== "undefined") {
      return_log(util.inspect(res, { colors: true }));
    }
  }

  if (process.env.Y_INTERACTIVE) {
    process.once("SIGINT", () => start());
    process.once("beforeExit", () => start());
  }
} else if (process.env.Y_INTERACTIVE) {
  start();
}
}

exports.addPackage = function(a){
return new Promise((resolve, reject) => {
shell.exec('npm install ' + a);
 resolve('Package installed!');
});
};
