const { Types: TokenTypes } = require("./tokenizer");
const Types = {
  PROC_CALL: "PROC_CALL",
  NUMBER: "NUMBER",
  DEFINE_VAR: "DEFINE_VAR",
  IDENT: "IDENT",
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
  const createVarDef = (name, body) => ({ type: Types.DEFINE_VAR, name, body });
  const createIdentifier = (name) => ({ type: Types.IDENT, name });

  const expr = () => {
    if (consume(TokenTypes.LPAREN)) {
      if (consume(TokenTypes.DEFINE)) {
        const identTok = shift();
        if (identTok.type !== TokenTypes.IDENT) {
          throw new Error(`expected identifier, got ${JSON.stringify(cur())}`);
        }
        const body = expr();
        if (!consume(TokenTypes.RPAREN)) {
          throw new Error(`expected ')', got ${JSON.stringify(cur())}`);
        }
        return createVarDef(identTok.val, body);
      }
      const operator = shift();
      const operands = [];
      let node = null;
      while (i < tokens.length && cur().type !== TokenTypes.RPAREN) {
        node = expr();
        operands.push(node);
      }
      if (!consume(TokenTypes.RPAREN)) {
        throw new Error(`expected ')', got ${JSON.stringify(cur())}`);
      }
      return createProcCall(operator, operands);
    }
    if (cur().type === TokenTypes.NUMBER) {
      return createNumber(shift());
    }
    if (cur().type === TokenTypes.IDENT) {
      return createIdentifier(shift().val);
    }
    throw new Error(`expected number, got ${JSON.stringify(cur())}`);
  };

  return expr();
};

module.exports = {
  parse: parse,
  Types: Types,
};
