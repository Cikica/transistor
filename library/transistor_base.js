(function ( window, module ) {

	if ( window.define && window.define.amd ) {
		define(module)
	} else { 

		var current_scripts, this_script, module_name

		current_scripts     = document.getElementsByTagName("script")
		this_script         = current_scripts[current_scripts.length-1]
		module_name         = this_script.getAttribute("data-module-name") || "transistor"
		window[module_name] = module
	}
})( 
	window,
	{

		define : { 
			allow : "*"
		},

		create : function ( what ) { 
			
			var body

			body = this.create_node( what )

			return { 
				node      : body.node,
				mark      : this.merge_two_arrays_into_object({
					key   : body.mark.name,
					value : body.mark.value,
				}),
				jump_to   : function ( which ) {
					if ( this.mark.hasOwnProperty( which.mark ) ) {
						return ( 
							which.full ?
								this.mark[which.mark] : 
								this.mark[which.mark].node
						)
					} else { 
						false 
					}
				},
				append_to : function ( what ) {
					what.appendChild( this.node )
					return what
				}
			}
		},

		create_mark_as : function ( mark ) {
			var self = this
			return { 
				node            : mark.body,
				append          : function ( definition ) {
					var children
					if ( definition.constructor === Array ) {
						console.log( definition )
						children = self.create_children({
							for     : this.node,
							defined : definition 
						})
					} else { 
						children = self.create_node( definition ) 
						children.append_to( this.node )
					}
					return children
				}
			}
		},

		create_node : function ( definition ) {

			var mark, body, self, property, attribute, style

			mark = definition.mark || { name  : [], value : [] }
			body = document.createElement( definition.type || "div" )

			if ( definition.mark_as ) {
				mark.name  = mark.name.concat(definition.mark_as)
				mark.value = mark.value.concat(this.create_mark_as({
					body : body 
				}))
			}

			if ( definition.style ) {
				style = this.set_node({
					object : body.style,
					type   : "property",
					to     : definition.style
				})
			}

			if ( definition.property ) {
				property = this.set_node({
					object : body,
					type   : "property",
					to     : definition.property
				})
			}

			if ( definition.attribute ) {
				attribute = this.set_node({
					object : body,
					type   : "attribute",
					to     : definition.attribute
				})
			}

			return { 
				node : body,
				mark : this.create_children({
					defined : definition.child || [],
					marked  : mark,
					for     : body
				})
			}
		},

		slice_member_out_of_an_array : function ( slice ) {
			return slice.array.slice( slice.at , slice.at +1 )[0]
		},

		create_children : function ( define ) {

			define.at     = define.at     || 0
			define.marked = define.marked || { name : [], value : [] }

			if ( define.at >= define.defined.length ) { 
				return define.marked
			} else {
				slice   = this.slice_member_out_of_an_array({
					array : define.defined,
					at    : define.at
				})
				created = this.create_node(slice)
				define.for.appendChild( created.node )
				return this.create_children({
					at     : define.at + 1,
					marked : {
						name  : define.marked.name.concat( created.mark.name ),
						value : define.marked.value.concat( created.mark.value )
					},
					defined : define.defined.slice(0),
					for     : define.for
				})
			}
		},

		set_node : function (what) {

			var self = this

			return this.homomorph({
				object : what.to,
				with   : function (member) {
					return self.set_node_methods[what.type]({
						object : what.object,
						name   : member.property_name,
						value  : member.value,
					})
				}
			})
		},

		set_node_methods : {
			property : function (style) {
				style.object[style.name] = style.value
				return style.value
			},
			attribute : function (attribute) {
				attribute.object.setAttribute(attribute.name, attribute.value)
				return attribute.value
			}
		},

		homomorph : function (what) {
			var set = {}
			for ( var property in what.object ) {
				if ( what.object.hasOwnProperty(property) ) {
					set[property] = what.with.call({}, {
						value         : what.object[property],
						property_name : property,
						set           : set,
					})
				}
			}
			return set
		},

		merge_two_arrays_into_object : function ( merge ) {
			
			merge.at     = merge.at     || 0
			merge.object = merge.object || {}
			
			if ( merge.at >= merge.key.length ) { 
				return merge.object
			} else { 
				
				var object
				object                            = merge.object
				merge.object[merge.key[merge.at]] = merge.value[merge.at]

				return this.merge_two_arrays_into_object({
					key    : merge.key.slice(0),
					value  : merge.value.slice(0),
					at     : merge.at + 1,
					object : object
				})
			}
		}
	}
)