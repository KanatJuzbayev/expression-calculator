function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
  return  rate(fixToReverse(getTokens(expr)));
}

const getTokens = function(str) {
  const operators = ["+", "-", "*", "/", "(", ")"];
  return str
    .split("")
    .filter(token => token !== " ")
    .map(token => operators.includes(token) ? " " + token + " " : token)
    .join("")
    .split(" ")
    .filter(token => token !== "");
};

function isNum(value) {
    return /[0-9.]/.test(value);
}

function isOperator(value) {
  return (
    value === "+" ||
    value === "-" ||
    value === "*" ||
    value === "/" ||
    value === "(" ||
    value === ")"
  );
}

function fixToReverse(tokens) {
  const queue = [];
  const stack = [];
  const precedence = {
    "(": 1,
    "+": 2,
    "-": 2,
    "/": 3,
    "*": 3,
    "%": 3
  };

  while (tokens.length) {
    const token = tokens.shift();
    const tokenPrecedence = precedence[token] || 0;
    let stackPrecedence = stack.length
      ? precedence[stack[stack.length - 1]] : 0;
    if (isOperator(token) && token === ")") {
      let op = null;
      while ((op = stack.pop()) !== "(") {
        if (stack.length === 0) {
          throw new Error("Error: Brackets not paired");
        }
        queue.push(op);
      }
    } else if (isNum(token)) {
      queue.push(token);
    } else if (
      isOperator(token) &&
      (!stack.length || token === "(" || tokenPrecedence > stackPrecedence)
    ) {
      stack.push(token);
    } else {
      while (tokenPrecedence <= stackPrecedence) {
        queue.push(stack.pop());
        stackPrecedence = stack.length
          ? precedence[stack[stack.length - 1]] : 0;
      }
      stack.push(token);
    }
  }
  while (stack.length) {
    let op = stack.pop();
    if (op === "(") throw new Error("Error: Brackets not paired");
    queue.push(op);
  }

  return queue;
}

function rate(tokens) {
  const stack = [];

  while (tokens.length) {
    let token = tokens.shift();
    while (isNum(token)) {
      stack.push(parseFloat(token));
      token = tokens.shift();
    }
    const [b, a] = [stack.pop(), stack.pop()];
    switch (token) {
      case "+":
        stack.push(a + b);
        break;
      case "-":
        stack.push(a - b);
        break;
      case "*":
        stack.push(a * b);
        break;
      case "/": {
        if (b === 0) throw new Error("TypeError: Division by zero.");
        stack.push(a / b);
        break;
      }
      case "%":
        stack.push(a % b);
        break;
    }
  }
  return stack.pop();
}

module.exports = {
    expressionCalculator
}
