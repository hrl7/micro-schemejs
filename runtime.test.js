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

it("variable", () => {
  const env = createEnvironment();
  expect(evaluate(parse(tokenize("(define x 123)")), env)).toEqual({
    type: "IDENT",
    name: "x",
  });
  expect(evaluate(parse(tokenize("(+ x 123)")), env)).toEqual({
    type: "NUMBER",
    val: 246,
  });
});

it("lambda", () => {
  const env = createEnvironment();
  expect(evaluate(parse(tokenize("((lambda (x) (+ x x)) 3)")), env)).toEqual({
    type: "NUMBER",
    val: 6,
  });
});
