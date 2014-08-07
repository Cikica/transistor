(function ( window, module ) {

	if ( window.define && window.define.amd ) {
		define(module)
	} else { 

		var current_scripts, this_script, module_name

		current_scripts     = document.getElementsByTagName("script")
		this_script         = current_scripts[current_scripts.length-1]
		module_name         = this_script.getAttribute("data-module-name") || "maker"
		window[module_name] = module
	}
})( 
	window,
	{

		define : {
			allow : ".",
		},

		create : function ( node ) {
			
			var body
			body = document.createElement( node.type )
			
			if ( node.style ) {
				for ( var property in node.style ) {
					body.style[property] = node.style[property]
				}
			}

			if ( node.attribute ) {
				for ( var attribute in node.attribute ) {
					body.setAttribute(attribute, node.attribute[attribute] )
				}
			}

			if ( node.property ) {
				for ( var property in node.property ) {
					body[property] = node.property[property]
				}
			}

			return body
		},

		split_definition_into_parent_node_map : function ( split ) {

			split.at         = split.at     || 0
			split.into       = split.into   || []
			split.parent     = split.parent || false
			split.definition = [].concat( split.definition )

			if ( split.at >= split.definition.length ) { 
				return split.into
			} else { 
				var into, definition, parent_to_node, node
				definition     = split.definition.slice(split.at, split.at+1)[0]
				into           = []
				node           = this.create( definition )
				parent_to_node = {
					parent : split.parent,
					node   : node
				}
				if ( definition.child ) {
					into = this.split_definition_into_parent_node_map({
						parent     : node,
						definition : definition.child
					})
				}
				return this.split_definition_into_parent_node_map({
					at         : split.at + 1,
					into       : split.into.concat(parent_to_node, into),
					definition : split.definition,
					parent     : split.parent
				})
			}
		},

		join_parent_to_node_map_by_parent_and_return_base_node : function ( join ) { 
			
			join.at = ( join.at === undefined ? 1 : join.at )
			if ( join.at >= join.map.length ) {
				return join.map[0].node
			} else {
				var indexed
				indexed = join.map.slice( join.at, join.at + 1 )[0]
				indexed.parent.appendChild( indexed.node )
				return this.join_parent_to_node_map_by_parent_and_return_base_node({
					at  : join.at + 1,
					map : join.map.slice(0),
				})
			}
		}
	}		
)