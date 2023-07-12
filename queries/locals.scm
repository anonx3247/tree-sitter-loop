(block) @local.scope
(conditional_expression) @local.scope
(conditional_statement) @local.scope
(switch_expression) @local.scope
(switch_statement) @local.scope
(loop) @local.scope
(for) @local.scope
(while) @local.scope

(variable_assignment name: (identifier) @local.definition)
(function_definition name: (identifier) @local.definition)
(struct_definition name: (type) @local.definition)
(enum_definition name: (type) @local.definition)

(object) @local.reference
(identifier) @local.reference
(type) @local.reference
