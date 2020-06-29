const { parse } = require("./parser");
const { tokenize } = require("./tokenizer");
const { evaluate, createEnvironment } = require("./runtime");

process.stdin.setEncoding("utf8");
process.stdout.write("\n>> ");
const env = createEnvironment();
process.stdin.on("readable", () => {
  let chunk;
  while ((chunk = process.stdin.read()) !== null) {
    try {
      const tokens = tokenize(chunk);
      const ast = parse(tokens);
      const result = evaluate(ast, env);
      process.stdout.write(JSON.stringify(result.val));
    } catch (e) {
      console.log(e);
    }
    process.stdout.write("\n>> ");
  }
});

process.stdin.on("end", () => {
  process.stdout.write("good bye!\n");
});
