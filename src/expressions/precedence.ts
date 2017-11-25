import {Operator} from "./expressionTree";
export const precedenceTable: {
  [P in Operator | "EOF"]: number;
} = {
    EOF: -1, "=": 1, "&&": 2, "||": 2,
    "==": 3,
    "!=": 3,
    "<": 4,
    ">": 4,
    ">=": 4,
    "<=": 4,
    "+": 5,
    "-": 5,
    "*": 6,
    "/": 6,
    "++": 8,
    "--": 9,
    ",": 0,
    "(": 10,
    ")": 0,
  };