const { tokenize, isSpace, isDigit } = require("./tokenizer");

it("isSpace", () => {
  expect(isSpace(" ")).toBe(true);
  expect(isSpace("  ")).toBe(true);
  expect(isSpace("a")).toBe(false);
  expect(isSpace("1")).toBe(false);
  expect(isSpace("-")).toBe(false);
  expect(isSpace("")).toBe(false);
});

it("isDigit", () => {
  expect(isDigit("1")).toBe(true);
  expect(isDigit("2")).toBe(true);
  expect(isDigit("0")).toBe(true);
  expect(isDigit("9")).toBe(true);
  expect(isDigit("a")).toBe(false);
  expect(isDigit(" ")).toBe(false);
});

it("(+ 1 2 3)", () => {
  expect(tokenize("(+ 1 2 3)")).toEqual([
    { type: "LPAREN" },
    { type: "OPERATOR", val: "+" },
    { type: "NUMBER", val: 1 },
    { type: "NUMBER", val: 2 },
    { type: "NUMBER", val: 3 },
    { type: "RPAREN" },
  ]);
});

it("(+ 1 2 3 456 78 9)", () => {
  expect(tokenize("(+ 1 2 3 456 78 9)")).toEqual([
    { type: "LPAREN" },
    { type: "OPERATOR", val: "+" },
    { type: "NUMBER", val: 1 },
    { type: "NUMBER", val: 2 },
    { type: "NUMBER", val: 3 },
    { type: "NUMBER", val: 456 },
    { type: "NUMBER", val: 78 },
    { type: "NUMBER", val: 9 },
    { type: "RPAREN" },
  ]);
});

it("(define x 123)", () => {
  expect(tokenize("(define x 123)")).toEqual([
    { type: "LPAREN" },
    { type: "DEFINE" },
    { type: "IDENT", val: "x" },
    { type: "NUMBER", val: 123 },
    { type: "RPAREN" },
  ]);
});
