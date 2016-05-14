window.Template.Controllers.MobileNavController = function() {

  /* This controller adds mobile-menu-open to body when mobileToggle is checked */

  // TRANSITION_DELAY should match @mobileOpacityFadeOut in responsive-nav.less
  var TRANSITION_DELAY = 100;
  var scrollY;
  var scrollX;

  var mobileNavToggle = document.querySelector('#mobileNavToggle');
  var mobileLinks = Array.prototype.map.call(document.querySelectorAll('#overlayNav a'), function(link){
    return link;
  });

  var mobileLogoLink = document.querySelector('.mobile-branding-wrapper a');

  SQS.Tweak.watch('tweak-mobile-bar-position', function(tweak){
    addMarginToBody();
    handleAnnouncementBar();
    handleMobileInfoBar();
  });

  /* Functions */
  function mobileLinkClick() {
    mobileNavToggle.checked = false;
    toggleMobileNav();
  };

  function toggleMobileNav(e) {
    var body = document.body;
    var site = document.querySelector('.site-container');
    var mobileBarWrapper = document.querySelector('.mobile-bar-wrapper');
    var overlayNav = document.querySelector('.overlay-nav-container');
    if(!body.classList.contains('mobile-menu-open')) {
      scrollY = window.scrollY;
      scrollX = window.scrollX;
    }

    document.documentElement.classList.toggle('mobile-menu-open', mobileNavToggle.checked);
    body.classList.toggle('mobile-menu-open', mobileNavToggle.checked);
    if(body.classList.contains('mobile-menu-open')) {
      overlayNav.style.paddingTop = mobileBarWrapper.offsetHeight + 'px';
      overlayNav.style.paddingBottom = mobileBarWrapper.offsetHeight + 'px';
    }

    if(!body.classList.contains('mobile-menu-open')) {
      window.setTimeout(function(){
        window.scrollTo(scrollX, scrollY);
      }, TRANSITION_DELAY);
    } else {

      if(body.classList.contains('tweak-mobile-bar-position-top-fixed')) {
        window.setTimeout(function(){
          window.scrollTo(0, 0);
        }, TRANSITION_DELAY);
      }

      if(body.classList.contains('tweak-mobile-bar-position-bottom-fixed')) {
        window.setTimeout(function(){
          window.scrollTo(0, mobileBarWrapper.getBoundingClientRect().bottom);
        }, TRANSITION_DELAY);
      }

    }
    if(body.classList.contains('tweak-mobile-bar-position-standard')) {
      if(body.classList.contains('mobile-menu-open')) {
        window.setTimeout(function(){
          site.style.marginTop = mobileBarWrapper.offsetHeight + 'px';
        }, TRANSITION_DELAY);
      } else {
        site.style.marginTop = '0px';
      }
    }
  };

  // If the mobile nav is fixed on top or bottom, add margin values equal to the height of the nav
  function addMarginToBody() {
    var body = document.body;
    var mobileBarWrapper = document.querySelector('.mobile-bar-wrapper');
    var site = document.querySelector('.site-container');
    if(window.innerWidth <= 768) {
      if(body.classList.contains('tweak-mobile-bar-position-standard')) {
        site.style.paddingTop = '0px';
        return;
      }

      if(body.classList.contains('tweak-mobile-bar-position-top-fixed')) {
        site.style.paddingTop = mobileBarWrapper.offsetHeight + 'px';
        return;
      }

      if(body.classList.contains('tweak-mobile-bar-position-bottom-fixed')) {
        site.style.paddingBottom = mobileBarWrapper.offsetHeight + 'px';
        return;
      }
    } else {
      site.style.paddingTop = '0px';
      site.style.paddingBottom = '0px';
      return;
    }

  };

  // Add padding equal to the mobile bar height always
  function addPaddingToOverlay() {
    var body = document.body;
    var navContainer = document.querySelector('.overlay-nav-container');
    var mobileBarWrapper = document.querySelector('.mobile-bar-wrapper');

    if(body.classList.contains('mobile-menu-open')) {
      navContainer.style.paddingTop = mobileBarWrapper.offsetHeight + 'px';
      navContainer.style.paddingBottom = mobileBarWrapper.offsetHeight + 'px';
    } else {

        navContainer.style.paddingTop = '0px';
        navContainer.style.paddingBottom = '0px';

    }
  };
  // maintains scroll position when mobile nav is active
  function saveScrollPos(e) {

  }

  function handleAnnouncementBar() {
    var announcementBar = document.querySelector('.sqs-announcement-bar');
    var mobileBarWrapper = document.querySelector('.mobile-bar-wrapper');
    var body = document.body;
    if(announcementBar) {
      if(body.classList.contains('tweak-mobile-bar-position-top-fixed')) {
        announcementBar.style.top = mobileBarWrapper.offsetHeight + 'px';
      } else {
        announcementBar.style.top = 0;
      }
    }
  };

  function handleMobileInfoBar() {
    var mobileInfoBar = document.querySelector('.sqs-mobile-info-bar');
    var mobileBarWrapper = document.querySelector('.mobile-bar-wrapper');
    var body = document.body;
    if(mobileInfoBar) {
      if(body.classList.contains('tweak-mobile-bar-position-bottom-fixed')) {
        mobileInfoBar.style.bottom = mobileBarWrapper.offsetHeight + 'px';
      } else {
        mobileInfoBar.style.bottom = 0;
      }
    }
  };

  /* Sync and Destroy */
  function sync() {

    addMarginToBody();
    handleAnnouncementBar();
    handleMobileInfoBar();

    window.addEventListener('resize', addMarginToBody);
    window.addEventListener('resize', handleAnnouncementBar);
    mobileNavToggle.addEventListener('change', toggleMobileNav);

    mobileLogoLink.addEventListener('click', mobileLinkClick);

    for(var i = 0; i < mobileLinks.length; i++) {
      mobileLinks[i].addEventListener('click', mobileLinkClick);
    }
  };

  function destroy() {
    window.removeEventListener('resize', addMarginToBody);
    window.removeEventListener('resize', handleAnnouncementBar);
    mobileNavToggle.removeEventListener('change', toggleMobileNav);
    mobileLogoLink.removeEventListener('click', mobileLinkClick);
    for(var i = 0; i < mobileLinks.length; i++) {
      mobileLinks[i].removeEventListener('click', mobileLinkClick);
    }
  };

  sync();

  return {
    sync: sync,
    destroy: destroy
  };

};
