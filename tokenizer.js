const Types = {
  LPAREN: "LPAREN",
  RPAREN: "RPAREN",
  OPERATOR: "OPERATOR",
  NUMBER: "NUMBER",
  DEFINE: "DEFINE",
  IDENT: "IDENT",
};

const spaceRegex = /\s+/;
function isSpace(c) {
  return spaceRegex.test(c);
}
const digitRegex = /\d+/;
function isDigit(c) {
  return digitRegex.test(c);
}
const alnumRegex = /[0-9a-zA-Z?!]/;
function isAlNum(c) {
  return alnumRegex.test(c);
}

const LParenToken = { type: Types.LPAREN };
const RParenToken = { type: Types.RPAREN };
const DefineToken = { type: Types.DEFINE };

const createOperator = (c) => ({ type: Types.OPERATOR, val: c });
const createNumber = (c) => ({ type: Types.NUMBER, val: +c });
const createIdentifier = (c) => ({ type: Types.IDENT, val: c });

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
    if (buf !== "") {
      tokens.push(createNumber(buf));
      continue;
    }

    buf = "";
    while (isAlNum(c)) {
      c = source[++i];
      buf += c;
    }
    buf = buf.slice(0, -1);
    i--;

    if (buf !== "") {
      switch (buf) {
        case "define":
          token = DefineToken;
          break;
        default:
          token = createIdentifier(buf);
      }
    }
    if (token) {
      tokens.push(token);
      continue;
    }

    throw new Error(`Unexpected token: ${c}`);
  }

  return tokens;
};

module.exports = {
  isSpace: isSpace,
  isDigit: isDigit,
  tokenize: tokenize,
  Types: Types,
};
