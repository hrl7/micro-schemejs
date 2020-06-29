const { Types: TokenTypes } = require("./tokenizer");
const Types = {
  PROC_CALL: "PROC_CALL",
  NUMBER: "NUMBER",
};

const parse = (tokens) => {
  let i = 0;
  const cur = () => {
    if (i < tokens.length) {
      return tokens[i];
    }
    return {};
  };
  // like https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/shift
  const shift = () => {
    if (i < tokens.length) {
      return tokens[i++];
    }
    return {};
  };
  const peek = () => (i < tokens.length - 1 ? tokens[i + 1] : {});
  const consume = (t) => {
    const tok = cur();
    if (tok && tok.type === t) {
      i++;
      return true;
    }
    return false;
  };

  const createProcCall = (operator, operands) => ({
    type: Types.PROC_CALL,
    operator: operator.val,
    operands,
  });
  const createNumber = (token) => ({ type: Types.NUMBER, val: token.val });

  const expr = () => {
    if (consume(TokenTypes.LPAREN)) {
      const operator = shift();
      const operands = [];
      let node = null;
      while ((node = expr())) {
        operands.push(node);
        if (cur().type === TokenTypes.RPAREN) {
          break;
        }
      }
      if (!consume(TokenTypes.RPAREN)) {
        throw new Error(`expected ')', got ${JSON.stringify(cur())}`);
      }
      return createProcCall(operator, operands);
    }
    if (cur().type === TokenTypes.NUMBER) {
      return createNumber(shift());
    }
    throw new Error(`expected number, got ${JSON.stringify(cur())}`);
  };

  return expr();
};

module.exports = {
  parse: parse,
};
