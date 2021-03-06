(function(){

  'use strict';

  var DEBUG = false;

  window.Template.Util = {

    resizeEnd: function (fn) {

      var RESIZE_TIMEOUT = 100;
      var isDragging = false;
      var _resizeMeasureTimer;

      window.addEventListener('resize', function (){
        if (!isDragging) {
          isDragging = true;
        }

        if (_resizeMeasureTimer) {
          clearTimeout(_resizeMeasureTimer);
        }

        _resizeMeasureTimer = setTimeout(function () {
          fn();

          isDragging = false;
        }, RESIZE_TIMEOUT);
      });
    },

    reloadImages: function (selector, options) {
      for(var i = 0; i < selector.length; i++) {
        SQS.ImageLoader.load(selector[i], options);
      }
    },

    getClosest: function (elem, selector) {

      var firstChar = selector.charAt(0);

      // Get closest match
      for ( ; elem && elem !== document; elem = elem.parentNode ) {

          // If selector is a class
          if ( firstChar === '.' ) {
              if ( elem.classList.contains( selector.substr(1) ) ) {
                  return elem;
              }
          }

          // If selector is an ID
          if ( firstChar === '#' ) {
              if ( elem.id === selector.substr(1) ) {
                  return elem;
              }
          }

          // If selector is a data attribute
          if ( firstChar === '[' ) {
              if ( elem.hasAttribute( selector.substr(1, selector.length - 2) ) ) {
                  return elem;
              }
          }

          // If selector is a tag
          if ( elem.tagName.toLowerCase() === selector ) {
              return elem;
          }

      }

      return false;

    }

  };

})();
