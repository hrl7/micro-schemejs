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

it("program", () => {
  const env = createEnvironment();
  const source = `
    (define twice
      (lambda (x) (+ x x)))
    (twice (twice 4))
    (define x 9)
    (twice x)
  `;
  expect(evaluate(parse(tokenize(source)), env)).toEqual({
    type: "NUMBER",
    val: 18,
  });
});
