window.Template.Controllers.IndexNavigationController = function(element){
  'use strict';

  var tweaks = [
    'index-link-style',
    'show-index-navigation'
  ];

  // This is to be used to bind an argument to the revealIndexNextLink function,
  // so that we can removeEventListener on the same function signature later
  var revealFn;

  SQS.Tweak.watch(tweaks, function(tweak) {
    var nav = indexLinkNextUp();
    revealIndexNextLink(nav);
  });

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

    return indexNav;
  };

  function revealIndexNextLink(nav) {
    var inView = isElementInViewport(nav);
    if(inView) {
      nav.classList.add('reveal-index-nav');
    }
  };

  function isElementInViewport (el) {
    var rect = el.getBoundingClientRect();
    return (
        (rect.top >= window.innerHeight / 1.25 && rect.top <= window.innerHeight / 1.1)
        || rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  };

  sync();

  function sync() {
    var indexNav = indexLinkNextUp();
    revealFn = revealIndexNextLink.bind(null, indexNav);
    indexNav.classList.remove('reveal-index-nav');

    window.setTimeout(function(){
      revealIndexNextLink(indexNav);
    }, 250);

    window.addEventListener('scroll', revealFn);
  };

  return {
    sync: sync,
    destroy: function() {
      window.removeEventListener('scroll', revealFn);
    }
  }
};
