import * as _ from "lodash";
import { Expression, ExpressionType } from "./expressionTree";
import { precedenceTable } from './precedence';
const legalMethods = [
  "min", "max", "rand"
];
export function toString(e: Expression, bp = 0) {
  switch (e.type) {
    case ExpressionType.Value:
    case ExpressionType.Lookup:
      return "" + e.value;
    case ExpressionType.Infix: {
      const precedence = precedenceTable[e.operator];
      const result = `${toString(e.lhs, precedence)}${e.operator}${toString(e.rhs, precedence)}`;
      if (precedenceTable[e.operator] <= bp)
        return `(${result})`;
      return result;
    }
    case ExpressionType.Invocation: {
      const args = e.arguments.map(x => toString(x, precedenceTable[','])).join(",");
      return `${toString(e.function, precedenceTable['('])}(${args})`;
    }
    case ExpressionType.Unary:
      return `${e.operator}${toString(e.value, 10000)}`;
  }
}
const joinValidate =
  (...expressions: (Expression)[]) =>
    [null, ...expressions.map(getError)].reduce((l, r) => l ? l : r);
export function getError(e: Expression): string | null {
  switch (e.type) {
    case ExpressionType.Infix:
      return joinValidate(e.lhs, e.rhs);
    case ExpressionType.Invocation:
      if (e.function.type !== ExpressionType.Lookup ||
        legalMethods.indexOf(e.function.value) == -1) {
        return toString(e.function) + " is not a function";
      }
      return joinValidate(...(e.arguments))
    case ExpressionType.Error: return e.message;
    case ExpressionType.Unary: return getError(e.value);
    default: return null;
  }
}
export function getReferencedVariables(e: Expression) {
  switch (e.type) {
    case ExpressionType.Infix:
      return { ...getReferencedVariables(e.lhs), ...getReferencedVariables(e.rhs) };
    case ExpressionType.Invocation:
      return e.arguments.map(x => getReferencedVariables(x)).reduce((l, r) => ({ ...l, ...r }));
    case ExpressionType.Unary:
      return getReferencedVariables(e.value);
    case ExpressionType.Lookup:
      return { [e.value]: true };
    default: return {};
  }
}
export function hasSideEffects(e: Expression) {
  switch (e.type) {
    case ExpressionType.Infix:
      if (e.operator == "=") return true;
      return hasSideEffects(e.lhs) || hasSideEffects(e.rhs);
    case ExpressionType.Invocation:
      return [false, ...e.arguments.map(x => hasSideEffects(x)).reduce((l, r) => l || r)];
    case ExpressionType.Unary:
      return hasSideEffects(e.value);
    default: return false;
  }
}
