module.exports = grammar({
  name: 'loop',

  precedences: _ => [
    [
      "function_call",
      "conditional",
      "modulo",
      "exponent",
      "multiplication",
      "addition",
      "type",
      "object"
    ],
  ],

  extras: $ => [
    $.comment,
    /(\s|\n|\r)+/
  ],

  word: $ => $.identifier,

  rules: {

    program: $ => repeat(
      choice(
        $.comment,
        $._statement,
        $.block
      )
    ),
    
    comment: $ => choice($._multi_line_comment, $._single_line_comment),
    _multi_line_comment: $ => seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),
    _single_line_comment: $ => /--.*/,
    

    module_prefix: $ => prec.right(repeat1(
      seq($.identifier, "::")
    )),
    
    expression: $ => $._expression,
    _expression: $ => choice(
      $.object,
      $.number,
      $.sum,
      $.subtraction,
      $.product,
      $.division,
      $.exponent,
      $.modulo,
      $._parenthesized_expression,
      $._braketed_expression,
      $.conditional_expression,
      $.switch_expression,
      $.range,
      $.string,
      $.bool,
      $.function_call_expression,
      $.type,
      $.list_comprehension
    ),

    _statement: $ => seq(
      optional($.instruction),
      choice(
        $._loop,
        $.switch_statement,
        $.conditional_statement,
        $.variable_assignment,
        $.variable_mutation,
        $.function_call_statement,
        $.function_definition,
        $.struct_definition,
        $.enum_definition,
        $.return_statement
      )
    ),


    _loop: $ => choice($.loop, $.while, $.for),

    alias: $ => seq($.object, "as", $.identifier),
    
    loop: $ => seq(
      "loop",
      $.block
    ),

    while: $ => seq(
      "while",
      field("condition", $._condition),
      $.block
    ),

    for: $ => seq(
      "for",
      field("iteration", $._set_cmp),
      $.block
    ),
    
    list: $ => seq(
      "[",
      repeat(seq(choice($.identifier, $.string, $.number), ",")),
      optional(choice($.identifier, $.string, $.number)),
      "]"
    ),

    variable_assignment: $ => prec.left(seq(
      optional("mut"),
      field("variables", repeat(seq($._variable, ","))),
      field("variables", $._variable),
      field("types", seq(":", repeat(seq($.type, ",")), optional($.type))),
      "=",
      repeat(seq($._expression, ",")),
      $._expression
    )),

    variable_mutation: $ => prec.left(seq(
      field("variables", repeat(seq($._variable, ","))),
      field("variables", $._variable),
      choice("=", "+=", "-=", "*=", "/=", "^="),
      repeat(seq($._expression, ",")),
      $._expression
    )),

    _variable: $ => seq(
      optional("pointer"),
      $.identifier
    ),

    range: $ => seq(field("start", choice($.object, $.number, $.string)), "..", field("end", choice($.object, $.number, $.string))),

    conditional_expression: $ => prec.left(
      "conditional",
      seq(
      "if",
      $._condition,
      "{",
      $._expression,
      "}",
      repeat(seq(
        "elif",
        $._condition,
        "{",
        $._expression,
        "}"
      )),
      optional(seq(
        "else",
        "{",
        $._expression,
        "}"
      ))
    )),

    conditional_statement: $ => prec.left(
      "conditional",
      seq(
      "if",
      $._condition,
      $.block,
      repeat(seq(
        "elif",
        $._condition,
        $.block
      )),
      optional(seq(
        "else",
        $.block
      ))
    )),

    _condition: $ => seq(
      $.comparison,
      repeat(
        seq(choice("and", "or"), $.comparison)
      )
    ),

    list_comprehension: $ => seq(
      "[",
      $._expression,
      "for",
      $._set_cmp,
      optional(
        choice(
          seq("if", $._condition),
          $.conditional_expression
        )
      ),
      "]"
    ),

    comparison: $ => seq(
      optional("not"),
      choice(
        $._bool_cmp,
        $._type_cmp,
        $._set_cmp,
        $._expression
      )
    ),

    _bool_cmp: $ => seq(
      $._expression,
      choice(
        "==",
        "!=",
        ">=",
        "<=",
        ">",
        "<"
      ),
      $._expression
    ),

    _type_cmp: $ => seq(
      $.object,
      "is",
      $.type
    ),

    _set_cmp: $ => seq(
      $.object,
      "in",
      choice($.list, $.object, $.range) 
    ),

    switch_expression: $ => seq(
      "switch",
      choice($.object, $.alias),
      "{",
      repeat(seq($._condition, "=>", $._expression, ",")),
      seq("def", "=>", $._expression),
      "}"
    ),

    switch_statement: $ => seq(
      "switch",
      choice($.object, $.alias),
      "{",
      repeat(seq($._condition, "=>",
      choice($._statement, $.block), ","
      )),
      seq("def", "=>", choice($._statement, $.block)),
      "}"
    ),

    return_statement: $ => prec.left(seq("ret",
      optional(repeat(seq($._expression, ","))),
      $._expression
    )),

    block: $ => seq(
      "{",
      repeat($._statement),
      "}"
    ),

    catch_block: $ => seq(
      "catch", choice($.object, $.alias), $.block
    ),

    keyword: $ => /(mut|pointer|and|or|not|ret|catch|as|in|is|break|continue|debug|fn|ret|while|if|else|elif|switch|for|loop)/,
    instruction: $ => /(break|continue|debug)/,

    type: $ => seq(choice($._base_type,$._user_type), optional(choice("?", "!"))),

    _base_type: $ => /(\[\])?(u8|u16|u32|u64|i32|i64|f32|f64|bool|str|none|err)/,
    _user_type: $ => seq(optional($.module_prefix), /(\[\])?[A-Z][a-z]*/),

    _param: $ => seq($.identifier, ":", $.type),

    param_list: $ => seq(
      "(",
      repeat(
        seq($._param, ",")
      ),
      optional($._param),
      ")"
    ),

    type_list: $ => choice(
      $.type,
      seq(
        repeat1(seq($.type, ",")),
        $.type
      )
    ),

    function_definition: $ => seq(
      "fn",
      field("name", $.identifier),
      $.param_list,
      "->",
      $.type_list,
      $.block
    ),

    object: $ => seq(
      optional($.module_prefix),
      $.identifier,
      prec.right("object", repeat(seq(".", $.identifier))),
      optional($._braketed_expression)
    ),

    function_call_expression: $ => prec.left("function_call", seq(
      field("name", choice($.object,$.type)),
      "(",
      choice(
        repeat(seq(
          $.identifier, ":", $._expression, ","
        )),
        seq(optional(seq($.identifier, ":")), $._expression)
      ),
      ")",
      optional(choice("?", "!", $.catch_block))
    )),

    function_call_statement: $ => seq(
      field("name", $.object),
      "(",
      choice(
        repeat(seq(
          $.identifier, ":", $._expression, ","
        )),
        seq(optional(seq($.identifier, ":")), $._expression)
      ),
      ")", // possibility of a catch block for errors
      optional(choice(
        "?",
        "!",
        $.catch_block
      ))
    ),

    struct_definition: $ => seq(
      "struct",
      field("name", $.type),
      "{",
      repeat(field("member", seq($._param, optional(",")))),
      field("member", $._param),
      "}"
    ),

    enum_definition: $ => seq(
      "enum",
      field("name", $.type),
      "{",
      repeat(field("member", seq($.type, optional(",")))),
      field("member", $.type),
      "}"
    ),

    implementation: $ => seq("impl", field("interface", $.identifier), "for", field("class", $.object), $.block),

    interface: $ => seq("interface", $.block),
    
    sum: $ => prec.left(
      "addition",
      seq(
        field("left", $._expression),
        "+",
        field("right", $._expression),
      ),
    ),

    subtraction: $ => prec.left(
      "addition",
      seq(
        field("left", $._expression),
        "-",
        field("right", $._expression),
      ),
    ),

    product: $ => prec.left(
      "multiplication",
      seq(
        field("left", $._expression),
        "*",
        field("right", $._expression),
      ),
    ),

    division: $ => prec.left(
      "multiplication",
      seq(
        field("left", $._expression),
        "/",
        field("right", $._expression),
      ),
    ),

    exponent: $ => prec.left(
      "exponent",
      seq(
        field("base", $._expression),
        "^",
        field("exponent", $._expression),
      ),
    ),

    modulo: $ => prec.left(
      "modulo",
      seq(
        field("dividend", $._expression),
        "%",
        field("divisor", $._expression),
      ),
    ),

    _parenthesized_expression: $ => seq(
      "(",
      $._expression,
      ")",
    ),
    _braketed_expression: $ => seq(
      "[",
      $._expression,
      "]",
    ),

    number: _ => /\d+(\.\d+)?/,
    identifier: _ => /([a-z][0-9a-zA-Z_]*)/,
    string: _ => /(\"[^"]*\"|\'[^']*\')/,
    bool: _ => /(true|false|none|err)/,
  }
});