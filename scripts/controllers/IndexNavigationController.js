window.Template.Controllers.IndexNavigationController = function(element){
  'use strict';

  var tweaks = [
    'index-link-style'
  ];

  SQS.Tweak.watch(tweaks, indexLinkNextUp);

  /* This controller handles the 'link-next-up' class on the Index Navigation links */
  function indexLinkNextUp() {
    var body = document.body;
    var activeLink;
    var indexNav;

    if(body.classList.contains('index-link-style-next-inline') || body.classList.contains('index-link-style-next-stacked')) {
      indexNav = document.querySelector('#indexNext');
    }

    if(body.classList.contains('index-link-style-list-inline') || body.classList.contains('index-link-style-list-stacked')) {
      indexNav = document.querySelector('#indexNav');
    }

    indexNav.classList.remove('hide');
    activeLink = indexNav.querySelector('.active-link');

    if(activeLink.nextElementSibling) {
      activeLink.nextElementSibling.classList.add('link-next-up');
    } else {
      indexNav.querySelector('nav').firstElementChild.classList.add('link-next-up');
    }
  };

  indexLinkNextUp();

  return {
    sync: indexLinkNextUp,
    destroy: function() {

    }
  }
};
