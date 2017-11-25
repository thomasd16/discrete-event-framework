export type Functions = "min"|"max"|"rand";
export type InfixOperator =
  | "+" | "-" | "*" | "/" | "=" | "&&"
  | "||" | "==" | "!=" | "<" | "<=" | ">" | ">=";
export type UnaryOperator = "+" | "-" | "++" | "--";
export type UtilOperator = "," | ")" | "(";
export type Operator = InfixOperator | UnaryOperator | UtilOperator;
export const enum ExpressionType {
  Infix = "infix",
  Unary = "unary",
  Value = "value",
  Lookup = "lookup",
  Invocation = "invocation",
  Error = "error"
};
export interface InfixExpression {
  type: ExpressionType.Infix;
  operator: InfixOperator;
  lhs: Expression;
  rhs: Expression;
}
export interface UnaryExpression {
  type: ExpressionType.Unary;
  operator: UnaryOperator;
  value: Expression;
}
export interface ValueExpression {
  type: ExpressionType.Value;
  value: number;
}
export interface LookupExpression {
  type: ExpressionType.Lookup;
  value: string;
}
export interface InvocationExpression {
  type: ExpressionType.Invocation;
  function: Expression;
  arguments: Expression[];
}
interface InvalidExpression {
  type: ExpressionType.Error;
  message: string;
}
export type Expression =
  | InfixExpression
  | UnaryExpression
  | ValueExpression
  | LookupExpression
  | InvocationExpression
  | InvalidExpression;