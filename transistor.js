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
			allow   : "*",
			require : [
				"transistor_abstract"
			]
		},

		make : function ( what ) {
			return this.library.transistor_abstract.make( what )
		}
	}
)