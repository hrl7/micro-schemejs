const { Types } = require("./parser");

const newNumber = (num) => ({ type: Types.NUMBER, val: num });
const newIdent = (name) => ({ type: Types.IDENT, name });

const createEnvironment = () => ({
  global: {
    "+": (args) =>
      args.reduce((acc, n) => newNumber(acc.val + n.val), newNumber(0)),
  },
});

const lookup = (name, env) => {
  return env.global[name];
};
const evaluate = (ast, env) => {
  if (ast.type === Types.PROC_CALL) {
    const { operator, operands } = ast;
    const proc = lookup(operator, env);
    const args = [];
    for (let i = 0; i < operands.length; i++) {
      args.push(evaluate(operands[i], env));
    }
    return proc(args);
  }
  if (ast.type === Types.DEFINE_VAR) {
    const value = evaluate(ast.body);
    env.global[ast.name] = value;
    return newIdent(ast.name);
  }
  if (ast.type === Types.IDENT) {
    const value = lookup(ast.name, env);
    return value;
  }
  if (ast.type === Types.NUMBER) {
    return ast;
  }

  throw new Error(`unknown node: ${JSON.stringify(ast)}`);
};

module.exports = {
  evaluate: evaluate,
  createEnvironment: createEnvironment,
};
