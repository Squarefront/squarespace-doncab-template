/**
 * The Squarespace template-level JavaScript API.
 *
 * @exports {Object}
 */
(function(api) {
  // The api name. This will become either the name of the module
  // or the global namespace on the window object.
  // We can change this to Squarespace or whatever else we think we might name
  // this thing once we settle on that.
  var name = 'Core';

  // Is an amd loader available?
  if (typeof define === 'function' && define.amd) {
    define(name, api());

  // Is a common JS loader available?
  } else if (typeof exports === 'object') {
    exports[name] = api();

  // If not, put the api on the window object.
  } else {
    window[name] = api();
  }
}(function() {

  return {
    /**
     * @namespace ImageLoader
     * @memberof Squarespace
     */
    ImageLoader: {

      /**
       * @method load
       * @param {Node} img
       * @param {Object} config
       */
      load: function(img, config) {
        return window.ImageLoader.load(img, config);
      }
    },

    /**
     * Tweaks are items in the Squarespace Style Editor. You can get a tweak
     * value to use in your JavaScript or watch a tweak for a changing value.
     *
     * @namespace Tweak
     * @memberof Squarespace
     */
    Tweak: {

      /**
       * @method getValue
       * @param {String} name
       * @returns {*} The tweak value, can be any type.
       */
      getValue: function(name) {
        if (!name || typeof name !== 'string') {
          return null;
        }

        return Y.Squarespace.Template.getTweakValue(name);
      },

      /**
       * Listen for changes on a tweak item.
       *
       * @method watch
       * @param {String} Optional: the tweak name.
       * @param {Callback}
       */
      watch: function() {
        var tweaksToWatch = [];
        var callback;

        if (arguments.length === 0) {
          return;
        }

        if (arguments.length === 1) {
          if (typeof arguments[0] === 'function') {
            callback = arguments[0];
          } else {
            return;
          }
        } else {
          if (typeof arguments[0] === 'string') {
            tweaksToWatch.push(arguments[0]);
          }

          if (arguments[0].constructor === Array) {
            tweaksToWatch = arguments[0];
          }

          callback = arguments[1];
        }

        Y.Global.on('tweak:change', function(e) {
          var tweakName = e.getName();

          if (tweaksToWatch.length === 0 || tweaksToWatch.indexOf(tweakName) >= 0) {
            var callbackSignature = {
              name: tweakName,
              value: e.config.value
            };

            try {
              callback(callbackSignature);
            } catch (err) {
              console.error(err);
            }
          }
        });
      }
    }
  };
}));
