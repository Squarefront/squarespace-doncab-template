(function (Template, Core) {

  'use strict';

  Template.Controllers.MobileOffset = function () {

    var sync = function () {

      if (window.innerWidth < Template.Constants.MOBILE_BREAKPOINT) {

        var offset = 0;
        var elementStyles = window.getComputedStyle(this);

        if (elementStyles.display !== 'none' && elementStyles.position === 'fixed') {
          offset = this.offsetHeight;
        }

        if (parseFloat(elementStyles.bottom) === 0) {
          // Bottom bar
          document.body.style.marginBottom = offset + 'px';

          var mobileInfoBar = document.querySelector('.sqs-mobile-info-bar');

          if (mobileInfoBar) {

            mobileInfoBar.style.bottom = offset + 'px';

          }

        } else {
          // Top bar
          document.body.style.marginTop = offset + 'px';
        }

      } else {
        document.body.style.marginTop = '';
        document.body.style.marginBottom = '';
      }

    }.bind(this);

    // Sync on tweak change
    var tweaks = [
      'tweak-mobile-bar-bottom-fixed',
      'tweak-mobile-bar-top-fixed'
    ];
    Core.Tweak.watch(tweaks, sync);

    // Sync on resize
    Template.Util.resizeEnd(sync);


    // Sync on init
    sync();


    return {

      sync: sync

    };

  };



})(window.Template, window.SQS);
