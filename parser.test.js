const { parse } = require("./parser");
const { tokenize } = require("./tokenizer");
it("(+ 1 2)", () => {
  expect(parse(tokenize("(+ 1 2)"))).toEqual({
    type: "PROC_CALL",
    operator: "+",
    operands: [
      { type: "NUMBER", val: 1 },
      { type: "NUMBER", val: 2 },
    ],
  });
});

it("(+ 1 2 3)", () => {
  expect(parse(tokenize("(+ 1 2 3)"))).toEqual({
    type: "PROC_CALL",
    operator: "+",
    operands: [
      { type: "NUMBER", val: 1 },
      { type: "NUMBER", val: 2 },
      { type: "NUMBER", val: 3 },
    ],
  });
});

it("(+ 1 (- 2 4) 3)", () => {
  expect(parse(tokenize("(+ 1 (- 2 4) 3)"))).toEqual({
    type: "PROC_CALL",
    operator: "+",
    operands: [
      { type: "NUMBER", val: 1 },
      {
        type: "PROC_CALL",
        operator: "-",
        operands: [
          { type: "NUMBER", val: 2 },
          { type: "NUMBER", val: 4 },
        ],
      },
      { type: "NUMBER", val: 3 },
    ],
  });
});
