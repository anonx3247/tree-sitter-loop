;keywords

[
  "ret"
  "mut"
  "if"
  "else"
  "for"
  "while"
  "loop"
  "switch"
  "pointer"
  "in"
  "as"
  "is"
  "and"
  "or"
  "not"
  "catch"
  "struct"
  "enum"
  "fn"
] @keyword

(instruction) @keyword

; functions

(function_call_statement name: (object) @function.method)
(function_call_expression name: (object) @function.method)
(function_definition name: (identifier) @function)

; attributes
(variable_mutation variables: (identifier) @attribute)
(struct_definition member: (identifier) @attribute)
(param_list (identifier) @variable.parameter)

; variables
(variable_assignment variables: (identifier) @attribute)
(object) @variable
(identifier) @variable
(module_prefix) @module

; types
(type) @type

; values
(bool) @constant
(string) @string
(number) @constant

; operators
[
  "+"
  "-"
  "*"
  "/"
  "^"
  "%"
  "="
  "+="
  "-="
  "*="
  "/="
  "^="
  "->"
  "=>"
  "."
  "!"
  "?"
] @operator
