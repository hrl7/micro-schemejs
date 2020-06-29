const { parse } = require("./parser");
const { tokenize } = require("./tokenizer");

process.stdin.setEncoding("utf8");

process.stdout.write("\n>> ");
process.stdin.on("readable", () => {
  let chunk;
  while ((chunk = process.stdin.read()) !== null) {
    try {
      const tokens = tokenize(chunk);
      const ast = parse(tokens);
      process.stdout.write(JSON.stringify(ast, null, 2));
    } catch (e) {
      console.log(e);
    }
    process.stdout.write("\n>> ");
  }
});

process.stdin.on("end", () => {
  process.stdout.write("good bye!\n");
});
