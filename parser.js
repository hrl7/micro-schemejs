const { Types: TokenTypes } = require("./tokenizer");
const Types = {
  PROC_CALL: "PROC_CALL",
  NUMBER: "NUMBER",
  DEFINE_VAR: "DEFINE_VAR",
  IDENT: "IDENT",
  LAMBDA: "LAMBDA",
  OPERATOR: TokenTypes.OPERATOR,
};

const parse = (tokens) => {
  let i = 0;
  const debug = (msg) =>
    console.log(`${msg}. ${JSON.stringify(cur())} at ${i}`);
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
    operator: operator,
    operands,
  });
  const createLambda = (formals, body) => ({
    type: Types.LAMBDA,
    formals,
    body,
  });
  const createNumber = (token) => ({ type: Types.NUMBER, val: token.val });
  const createVarDef = (name, body) => ({ type: Types.DEFINE_VAR, name, body });
  const createIdentifier = (name) => ({ type: Types.IDENT, name });

  const parseFormals = () => {
    if (!consume(TokenTypes.LPAREN)) {
      throw new Error(`expected '(', got ${JSON.stringify(cur())}`);
    }
    let node = shift();
    const formals = [];
    while (node && node.type === TokenTypes.IDENT) {
      formals.push(createIdentifier(node.val));
      node = shift();
    }
    i--;
    if (!consume(TokenTypes.RPAREN)) {
      throw new Error(`expected '(', got ${JSON.stringify(cur())}`);
    }
    return formals;
  };

  const parseIdent = () => {
    const identTok = shift();
    if (identTok.type !== TokenTypes.IDENT) {
      throw new Error(`expected identifier, got ${JSON.stringify(cur())}`);
    }
  };

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
      if (consume(TokenTypes.LAMBDA)) {
        const formals = parseFormals();
        const body = [];
        body.push(expr());
        if (!consume(TokenTypes.RPAREN)) {
          throw new Error(`expected ')', got ${JSON.stringify(cur())}`);
        }
        return createLambda(formals, body);
      }
      let operator = expr();
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
    if (cur().type === TokenTypes.OPERATOR) {
      return shift();
    }
    throw new Error(`expected number or ident, got ${JSON.stringify(cur())}`);
  };

  const program = [];
  while (i < tokens.length) {
    program.push(expr());
  }
  return program;
};

module.exports = {
  parse: parse,
  Types: Types,
};
