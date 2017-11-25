import { ExpressionType, Operator, Expression, InfixOperator } from "./expressionTree";
import { precedenceTable } from "./precedence";
const expr = /\s*(?:([0-9]+(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?)|(\!\=|\+|\-|\*|\/|\=\=|\=|\<|\<\=|\>|\>\=|\&\&|\,\,|\+\+|\-\-|\(|\)|\,)|([a-z_$][a-z0-9_$]*))\s*/giy;

type Token =
  {
    type: Operator | "EOF"
  } | {
    type: "number";
    value: number;
  } | {
    type: "name", value: string
  };

const infixType: InfixOperator[] = ["+", "-", "*", "/", "=", "&&"
  , "||", "==", "!=", "<", "<=", ">", ">="];
export function parse(str: string): Expression {
  let token: Token;
  expr.lastIndex = 0;
  function nextToken() {
    const previousToken = token;
    const { lastIndex } = expr;
    const result = expr.exec(str);
    if (result == null) {
      if (lastIndex == str.length) {
        token = { type: "EOF" as "EOF" };
      } else {
        throw `Unexpected ${str.charAt(lastIndex)}`;
      }
    } else {
      const [_, value, op, name] = result;
      if (value !== undefined) {
        token = { type: "number", value: +value };
      } else if (op != undefined) {
        //constraint on op is from the regex
        token = { type: op as any };
      } else {
        token = { type: "name", value: name };
      }
    }
    return previousToken;
  }
  function nud(): Expression {
    const tk = nextToken();
    switch (tk.type) {
      case "name":
        return {
          type: ExpressionType.Lookup,
          value: tk.value
        };
      case "number":
        return {
          type: ExpressionType.Value,
          value: tk.value
        };
      case "+": return { type: ExpressionType.Unary, value: nud(), operator: "+" };
      case "-": return { type: ExpressionType.Unary, value: nud(), operator: "-" };
      case "(": {
        const ret = led(0);
        if (nextToken().type != ")")
          throw "Unmatched parenthasis";
        return ret;
      }
      default: throw `Unexpected ${tk.type}`;
    }
  }
  function led(bp: number) {
    let lhs = nud();

    while (precedenceTable[token.type] > bp) {
      const tk = nextToken();
      if (infixType.indexOf(tk.type as InfixOperator) != -1) {
        lhs = {
          type: ExpressionType.Infix,
          operator: tk.type as InfixOperator,
          lhs: lhs,
          rhs: led(precedenceTable[tk.type])
        };
      } else if (tk.type == "++" || tk.type == "--") {
        nextToken();
        lhs = { type: ExpressionType.Unary, operator: tk.type, value: lhs };
      } else if (tk.type == "(") {
        const def = (args: Expression[]) => lhs = {
          type: ExpressionType.Invocation,
          function: lhs,
          arguments: args
        };
        if (token.type == ")") {
          def([]);
        } else {
          const arr = [];
          let tk: Token;
          do {
            arr.push(led(0));
          } while ((tk = nextToken()).type == ",");
          //who could have known that state mutations break static analysis /s
          if (tk.type != (")" as any)) {
            throw `Unexpected ${token.type}`;
          }
          nextToken();
          def(arr);
        }
      } else {
        throw `Unexpected ${token.type}`
      }
    }
    return lhs;
  }
  try {
    nextToken();
    return led(0);
  } catch (e) {
    if (typeof e !== "string") throw e;
    return {
      type: ExpressionType.Error,
      message: e
    };
  }
}
(window as any).parse = parse;
(window as any).lex = function (s) {
  var f = [];
  s.replace(expr, (m) => f.push(m));
  return f;
}