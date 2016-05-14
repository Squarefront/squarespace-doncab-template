window.Template.Controllers.BodyClassController = function() {
  'use strict';

  var body = document.body;
  var timer;

  var tagline       = body.querySelector('[data-nc-element="tagline"]');
  var secondaryNav  = body.querySelector('[data-nc-element="secondary-nav"]');
  var primaryNav    = body.querySelector('[data-nc-element="primary-nav"]');
  var headerTweaks  = [
    'tagline-position',
    'primary-nav-position',
    'secondary-nav-position'
  ];

  SQS.Tweak.watch(headerTweaks, initNavClasses);

  function initNavClasses() {
    if(tagline && tagline.hasChildNodes()) {
      body.classList.add('has-tagline');
    } else {
      body.classList.remove('has-tagline');
    }

    if(secondaryNav && secondaryNav.hasChildNodes()) {
      body.classList.add('has-secondary-nav');
    } else {
      body.classList.remove('has-secondary-nav');
    }

    if(primaryNav && primaryNav.hasChildNodes()) {
      body.classList.add('has-primary-nav');
    } else {
      body.classList.remove('has-primary-nav');
    }
  }

  initNavClasses();

  return {
    sync: function() {
      initNavClasses();
    },

    destroy: function() {

    }
  };

};
