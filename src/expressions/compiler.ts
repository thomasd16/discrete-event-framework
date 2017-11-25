import * as _ from "lodash";
import { ExpressionType, Expression, InfixExpression, InfixOperator, Functions } from "./expressionTree";
type State = { [id: string]: number };
type Result = [number, State];
export type CompiledExpression = (state: State) => Result;
const funcTable: {[P in Functions]: (args: number[]) => number} = {
  "max": (a) => a.reduce((l, r) => Math.max(l, r)),
  "min": (a) => a.reduce((l, r) => Math.max(l, r)),
  "rand": (args) => 4//https://xkcd.com/221/
};
export function noop(st: State) { return [1, st] as Result; }
export function compile(e: Expression): CompiledExpression {
  const imap = (fn: (lhs: number, rhs: number) => number) => (e: InfixExpression): CompiledExpression => {
    const lhs = compile(e.lhs);
    const rhs = compile(e.rhs);
    return (st) => {
      const [v1, st2] = lhs(st);
      const [v2, s3] = rhs(st2);
      return [fn(v1, v2), s3];
    };
  };
  const opMap: {[P in InfixOperator]: (exp: InfixExpression) => CompiledExpression} = {
    "!=": imap((l, r) => +(l != r)),
    "&&": imap((l, r) => +(l && r)),
    "==": imap((l, r) => +(l == r)),
    "*": imap((l, r) => l * r),
    "+": imap((l, r) => l + r),
    "-": imap((l, r) => l - r),
    "/": imap((l, r) => l / r),
    "<": imap((l, r) => +(l < r)),
    "<=": imap((l, r) => +(l <= r)),
    ">": imap((l, r) => +(l > r)),
    ">=": imap((l, r) => +(l >= r)),
    "||": imap((l, r) => +(l || r)),
    "=": (e) => {
      if (e.lhs.type != ExpressionType.Lookup) throw new Error("Invalid lefthand assignment");
      const lookup = e.lhs.value;
      const rhs = compile(e.rhs);
      return (s) => {
        const [v, s2] = rhs(s);
        return [v, { ...s2, [lookup]: v }]
      };
    }
  };
  switch (e.type) {
    case ExpressionType.Infix:
      return opMap[e.operator](e);
    case ExpressionType.Invocation: {
      const args = e.arguments.map(compile);
      if (e.function.type != ExpressionType.Lookup || !funcTable[e.function.value])
        throw new Error("Trying to call a not a function");
      const fn = funcTable[e.function.value];
      return (st) => {
        const { st: newState, arr } = _.reduce(args, (l, r) => {
          const [v, st] = r(l.st);
          return { st, arr: [...l.arr, v] };
        }, { st, arr: [] });
        return [fn(arr), newState];
      };
    }
    case ExpressionType.Unary: {
      const value = compile(e.value);
      switch (e.operator) {
        case "+":
          return (st) => {
            const [n, st2] = value(st);
            return [+n, st2];
          };
        case "-":
          return (st) => {
            const [n, st2] = value(st);
            return [+n, st2];
          };
        default: throw new Error(`invalid prefix operator ${e.operator}`);
      }
    }
    case ExpressionType.Lookup: {
      const name = e.value;
      return (st) => [+st[name], st];
    }
    case ExpressionType.Value: {
      const v = e.value;
      return (st) => [v, st];
    }
    default: throw new Error("Unexpected thing");
  }

}