const { Types } = require("./parser");

const createNumber = (num) => ({ type: Types.NUMBER, val: num });
const createEnvironment = () => ({
  global: {
    "+": (args) =>
      args.reduce((acc, n) => createNumber(acc.val + n.val), createNumber(0)),
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
  if (ast.type === Types.NUMBER) {
    return ast;
  }

  throw new Error(`unknown node: ${JSON.stringify(ast)}`);
};

module.exports = {
  evaluate: evaluate,
  createEnvironment: createEnvironment,
};
