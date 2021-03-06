/**
 * accessible-spinner
 * A simple JQuery plugin that replaces content with a spinner and includes some accessibility features.
 *
 * @version current_version
 * @author Peter Chappell <chappell.peter@abc.net.au>
 * */

(function(definition) {
	if (typeof module !== 'undefined'){
		// Browserify
		module.exports = definition();
	} else if (typeof define === 'function' && typeof define.amd === 'object'){
		// AMD
		define(definition);
	}
	// for just plain JS we install the plugin (added to $ namespace) instead of exposing a new global namespace
	if (typeof jQuery !== 'undefined') {
		definition().installPlugin();
	}
}(function() {

	function AccessibleSpinner(element, options) {
		this.element    =
		this.$element   =
		this.options    = null;

		this.init(element, options);
	}

	AccessibleSpinner.VERSION = 'current_version';

	AccessibleSpinner.DEFAULTS = {
		spinnerText: 'Loading...',
		spinnerClass: 'spinner',
		spinnerTemplate: '<div class="{{spinnerClass}}">{{spinnerText}}</div>',
		ariaStatusText: 'Please wait. We will alert when the content has loaded.',
		ariaAnnounceText: 'The content has loaded.',
		accessibilityHideClass: 'accessibility',
		doAnnouncement: true
	};


	/* METHODS */

	AccessibleSpinner.prototype = {

		init: function (element, options) {
			this.element = element;
			this.$element = $(element);
			this.options = this.getOptions(options);

			this.setAccessibleSpinnerHtml();
		},

		setAccessibleSpinnerHtml: function() {
			this.spinnerHtml = this.options.spinnerTemplate.replace('{{spinnerClass}}', this.options.spinnerClass).replace('{{spinnerText}}', this.options.spinnerText);
			if (this.options.doAnnouncement) {
				this.spinnerHtml += '<div role="alert" class="' + this.options.accessibilityHideClass + ' announcement">' + this.options.ariaStatusText + '</div>';
			}
		},

		getDefaults: function () {
			return AccessibleSpinner.DEFAULTS;
		},

		getOptions: function (options) {
			options = $.extend({}, this.getDefaults(), this.$element.data(), options);
			return options;
		},

		// use for setting new options on the plugin (options can be changed between start/stop)
		setOptions: function(newOptions) {
			this.options = $.extend({}, this.options, newOptions);
			this.setAccessibleSpinnerHtml();
		},

		// start the spinner spinning
		start: function() {
			this.$element.html(this.spinnerHtml);
		},

		// finish the spinner (and announce)
		finish: function() {
			var $spinner,
				$announcement;

			$spinner = $('.' + this.options.spinnerClass, this.$element);

			if (this.options.doAnnouncement) {
				$announcement = $('.announcement', this.$element);
				$spinner.hide();
				$announcement.text(this.options.ariaAnnounceText);
				setTimeout(function() {
					$announcement.hide();
				}, 2000);
			} else {
				$spinner.hide();
			}
		}

	};



	/* PLUGIN DEFINITION */

	function Plugin(arg1, methodOptions) {
		return this.each(function () {
			var $this, dataKey, data, method, options;

			$this   = $(this);
			dataKey = 'plugin-spinner';
			data    = $this.data(dataKey);
			if (typeof arg1 === 'object') {
				options = arg1;
			} else {
				options = methodOptions;
				method = arg1;
			}

			if (!data && method === 'destroy') {
				return;
			}
			if (!data) {
				$this.data(dataKey, (data = new AccessibleSpinner(this, options)));
			}
			if (typeof method === 'string') {
				data[method](options);
			}
		});
	}



	/* INSTALLATION */

	AccessibleSpinner.isPluginInstalled = false;

	AccessibleSpinner.installPlugin = function installPlugin() {

		if (AccessibleSpinner.isPluginInstalled) {
			return;
		}

		var old = $.fn.spinner;

		$.fn.spinner = Plugin;
		$.fn.spinner.Constructor = AccessibleSpinner;

		// no conflict
		$.fn.spinner.noConflict = function () {
			$.fn.spinner = old;
			return this;
		};

		AccessibleSpinner.isPluginInstalled = true;
	};

	return AccessibleSpinner;

}));
