const Types = {
  LPAREN: "LPAREN",
  RPAREN: "RPAREN",
  OPERATOR: "OPERATOR",
  NUMBER: "NUMBER",
};

function isSpace(c) {
  return /\s+/.test(c);
}
function isDigit(c) {
  return /\d+/.test(c);
}

const LParenToken = { type: Types.LPAREN };
Object.freeze(LParenToken);
const RParenToken = { type: Types.RPAREN };
Object.freeze(RParenToken);

const createOperator = (c) => ({ type: Types.OPERATOR, val: c });
const createNumber = (c) => ({ type: Types.NUMBER, val: +c });

const tokenize = (source) => {
  let i = 0,
    c = "";
  const tokens = [];

  for (i = 0; i < source.length; i++) {
    c = source[i];
    if (isSpace(c)) {
      continue;
    }
    let token = null;
    switch (c) {
      case "(":
        token = LParenToken;
        break;
      case ")":
        token = RParenToken;
        break;
      case "+":
      case "-":
      case "*":
      case "/":
      case "=":
        token = createOperator(c);
        break;
      default:
        break;
    }
    if (token) {
      tokens.push(token);
      continue;
    }
    let buf = "";
    while (isDigit(c)) {
      buf += c;
      c = source[++i];
    }
    i--;
    tokens.push(createNumber(buf));
  }

  return tokens;
};

module.exports = {
  isSpace: isSpace,
  isDigit: isDigit,
  tokenize: tokenize,
  Types: Types,
};
