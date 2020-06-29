const { parse } = require("./parser");
const { tokenize } = require("./tokenizer");
const { evaluate, createEnvironment } = require("./runtime");

it("operator +", () => {
  const env = createEnvironment();
  expect(evaluate(parse(tokenize("(+ 1 2)")), env)).toEqual({
    type: "NUMBER",
    val: 3,
  });
  expect(evaluate(parse(tokenize("(+ 1 2 3 4 5)")), env)).toEqual({
    type: "NUMBER",
    val: 15,
  });
  expect(evaluate(parse(tokenize("(+ 1 (+ 2 3) (+ 4 5))")), env)).toEqual({
    type: "NUMBER",
    val: 15,
  });
});
