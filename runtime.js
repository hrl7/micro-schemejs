const { Types } = require("./parser");

const newNumber = (num) => ({ type: Types.NUMBER, val: num });
const newIdent = (name) => ({ type: Types.IDENT, name });

const createEnvironment = () => ({
  global: {
    "+": (args) =>
      args.reduce((acc, n) => newNumber(acc.val + n.val), newNumber(0)),
  },
  scopes: [],
});

const evaluateLambda = (expr, args, env) => {
  env.scopes.push({ [expr.formals[0].name]: args[0] });
  const result = evaluate(expr.body, env);
  env.scopes.pop();
  return result;
};

const lookup = (name, env) => {
  if (name.type === Types.LAMBDA) {
    return (args) => evaluateLambda(name, args, env);
  }
  let targetName = name,
    result = null;
  if (name.type === Types.OPERATOR) {
    targetName = name.val;
  }
  if (name.type === Types.IDENT) {
    targetName = name.name;
  }

  for (let i = 0; i < env.scopes.length; i++) {
    result = env.scopes[i][targetName];
    if (result) {
      break;
    }
  }
  if (!result) {
    result = env.global[targetName];
  }
  if (!result) {
    throw new Error(`Undefined variable ${JSON.stringify(name)}`);
  }
  return result;
};

const evaluate = (ast, env) => {
  if (ast instanceof Array) {
    let result;
    for (let i = 0; i < ast.length; i++) {
      result = evaluate(ast[i], env);
    }
    return result;
  }
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
    const value = evaluate(ast.body, env);
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
  if (ast.type === Types.LAMBDA) {
    return (args) => evaluateLambda(ast, args, env);
  }

  throw new Error(`unknown node: ${JSON.stringify(ast)}`);
};

module.exports = {
  evaluate: evaluate,
  createEnvironment: createEnvironment,
};
