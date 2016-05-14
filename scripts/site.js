/**
 * All template-level Javascript is namespaced
 * onto the Template namespace.
 *
 * @namespace
 */
window.Template = {};

/**
 * Template.Constants holds all constants, such
 * as breakpoints, timeouts, etc.
 *
 * @memberof Template
 * @inner
 * use: window.Template.Constants.BREAKPOINT_MOBILE_BAR
 */
window.Template.Constants = {

  BREAKPOINT_MOBILE_BAR: 768,
  AUTHENTICATED: document.documentElement.classList.contains('authenticated-account'),
  AJAXLOADER: true,
  COVER_PAGE: document.querySelector('.sqs-slide-container')

};

/**
 * Template.Controllers holds the controller
 * functions, where all the actual Javascript
 * that does stuff is contained.
 *
 * @memberof Template
 * @inner
 */
window.Template.Controllers = {};
// END controller setup

// START actual site.js
(function() {
  'use strict';

  window.addEventListener('DOMContentLoaded', function () {
    var header = new window.AncillaryCollapse({
      base: document.querySelector('[data-nc-base="header"]'),
      minWidth: 769
    });
    header.base.removeAttribute('data-nc-loading');

    if(window.Template.Constants.AJAXLOADER && !window.Template.Constants.AUTHENTICATED && !window.Template.Constants.COVER_PAGE){
      new AjaxLoader({
        sqsController: true,
        timeout: 6000,
        siteContainer: '.content-container',
        pageTransition: {
          animLink: 'index-page-transition-link',
          animClass: 'tweak-page-transition-animation',
          fadeInDuration: 0.78,
          fadeOutDuration: 0.2,
        },
        beforeRequestAnim: function () {
          var container = document.querySelector('.content-container');
          container.classList.add('slide-up');
        },
        afterRequestAnim: function () {
          var container = document.querySelector('.content-container');
          container.classList.remove('slide-up');
          container.classList.add('slide-into-view');
          window.setTimeout(function() {
            container.classList.remove('slide-into-view');
          }, 500);
        }
      });

    }
  });

}());
