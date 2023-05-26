// const {stdin, stdout} = require("process")
// const readline = require('readline')

// const EVAL=(data)=>{
//     return data;
// }

// const PRINT=(data)=>{
//     return data;
// }

// const READ=(data)=>{
//     return data;
// }

// const rep=(data)=>{
//     return PRINT(EVAL(READ(data)));
// }

// const rep=()=>{
//     stdin.setEncoding("utf-8");
//     stdin.write("user> ");
//     stdin.on('data', (line)=>{
//         stdin.write(rep(line));
//         stdin.write("user> ");
//     });
// }

// main();


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  const READ = str => str;
  const EVAL = str => str;
  const PRINT = str => str;
  
  const rep = str => PRINT(EVAL(READ(str)));
  
  const repl = () =>
    rl.question('user> ', line => {
      console.log(rep(line));
      repl();
    });
  
  repl();