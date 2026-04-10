function tokenize(expression) {
  const tokens = []
  let i = 0

  while (i < expression.length) {
    const char = expression[i]

    if (char === ' ' || char === '\t' || char === '\n') {
      i += 1
      continue
    }

    if ('+-*/()'.includes(char)) {
      tokens.push(char)
      i += 1
      continue
    }

    if ((char >= '0' && char <= '9') || char === '.') {
      let number = char
      i += 1

      while (i < expression.length) {
        const next = expression[i]
        if ((next >= '0' && next <= '9') || next === '.') {
          number += next
          i += 1
        } else {
          break
        }
      }

      if (number.split('.').length > 2) {
        throw new Error('Invalid number format.')
      }

      tokens.push(number)
      continue
    }

    throw new Error('Expression contains unsupported characters.')
  }

  return tokens
}

function precedence(operator) {
  if (operator === '+' || operator === '-') return 1
  if (operator === '*' || operator === '/') return 2
  return 0
}

function toRpn(tokens) {
  const output = []
  const operators = []

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]

    if (!Number.isNaN(Number(token))) {
      output.push(token)
      continue
    }

    if (token === '(') {
      operators.push(token)
      continue
    }

    if (token === ')') {
      while (operators.length > 0 && operators[operators.length - 1] !== '(') {
        output.push(operators.pop())
      }

      if (operators.length === 0) {
        throw new Error('Mismatched parentheses.')
      }

      operators.pop()
      continue
    }

    while (
      operators.length > 0 &&
      operators[operators.length - 1] !== '(' &&
      precedence(operators[operators.length - 1]) >= precedence(token)
    ) {
      output.push(operators.pop())
    }

    operators.push(token)
  }

  while (operators.length > 0) {
    const top = operators.pop()
    if (top === '(' || top === ')') {
      throw new Error('Mismatched parentheses.')
    }
    output.push(top)
  }

  return output
}

function evaluateRpn(rpnTokens) {
  const stack = []

  for (let i = 0; i < rpnTokens.length; i += 1) {
    const token = rpnTokens[i]

    if (!Number.isNaN(Number(token))) {
      stack.push(Number(token))
      continue
    }

    if (stack.length < 2) {
      throw new Error('Invalid expression.')
    }

    const right = stack.pop()
    const left = stack.pop()
    let result = 0

    if (token === '+') result = left + right
    if (token === '-') result = left - right
    if (token === '*') result = left * right
    if (token === '/') {
      if (right === 0) {
        throw new Error('Division by zero is not allowed.')
      }
      result = left / right
    }

    stack.push(result)
  }

  if (stack.length !== 1 || !Number.isFinite(stack[0])) {
    throw new Error('Invalid expression.')
  }

  return stack[0]
}

export function evaluateExpression(input) {
  const value = String(input).trim()

  if (!value) {
    throw new Error('Price is required.')
  }

  const tokens = tokenize(value)

  if (tokens.length === 0) {
    throw new Error('Price is required.')
  }

  const rpn = toRpn(tokens)
  return evaluateRpn(rpn)
}
