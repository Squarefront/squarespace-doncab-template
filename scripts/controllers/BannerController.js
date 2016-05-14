window.Template.Controllers.BannerController = function(element){
  'use strict';

  var bannerWrapper = document.querySelector('.page-banner-wrapper');
  var page;

  var bannerImgTweaks = [
    'show-index-banner',
    'show-album-banner',
    'show-blog-banner',
    'show-events-banner',
    'show-gallery-banner',
    'show-page-banner',
    'show-products-banner',
    'show-project-banner',
    'banner-height',
    'banner-image-crop',
    'banner-image-alignment',
    'site-outer-padding',
    'siteCustomSpacing',
    'siteMaxWidth',
    'auto-color-banner-background',
    'full-bleed-project'
  ];

  var showBannerFontSizeTweaks = [
    'banner-page-description-font-font-size',
    'banner-page-description-title-font-size',
    'bannerPageTitleMin',
    'bannerPageDescriptionMin',
    'scale-banner-description-font-size',
    'scale-banner-title-font-size',
    'banner-title-spacing',
    'page-banner-text-width'
  ];

  SQS.Tweak.watch(bannerImgTweaks, function(tweak){
    autoColorBannerBackground(page);
    moveIntroTextWrapper(page);
    setMinHeight();
    handleBannerImage(page);
  });

  SQS.Tweak.watch(showBannerFontSizeTweaks, function(tweak){
    setMinHeight();
    handleBannerImage(page);
  });


  initialize();

  // Function Declarations

  function handleBannerImage(page) {
    var body = document.querySelector('body.collection-type-' + page);
    var headerImgWrapper = document.querySelector('.collection-thumbnail-image-container');
    var headerImg = document.querySelector('.js-page-banner-image')

    if(body.classList.contains('show-' + page + '-banner')) {
      headerImgWrapper.classList.remove('hide-collection-image');
    } else {
      headerImgWrapper.classList.add('hide-collection-image');
    }

    if( body.classList.contains('banner-image-alignment-left') || body.classList.contains('banner-image-alignment-right') || body.classList.contains('banner-image-alignment-center')) {
      if(body.classList.contains('banner-image-crop')) {
        headerImgWrapper.classList.add('content-fill');
        headerImg.classList.remove('page-banner-image');
      } else {
        headerImgWrapper.classList.remove('content-fill');
        headerImg.removeAttribute('style')
        headerImg.classList.add('page-banner-image');
      }
    } else {
      body.classList.remove('banner-image-crop');
      headerImgWrapper.classList.remove('content-fill');
      headerImg.removeAttribute('style')
      headerImg.classList.add('page-banner-image');
    }

    window.Template.Util.reloadImages(document.querySelectorAll('.page-banner-image-container:not(.hide-collection-image) .js-page-banner-image'), {
      load: true
    });
  };

  // This function puts span tags in the paragraph tags outputted
  // by the JSONT {description}
  function wrapPageDescriptionText() {
    var pageDesc = document.querySelectorAll('.page-description p');
    for(var i = 0; i < pageDesc.length; i++) {
      var html = '<span>' + pageDesc[i].innerHTML + '</span>';
      pageDesc[i].innerHTML = html;
    }
  };

  // If no promoted image or thumbnail, move the page wrapper out of the banner image container
  function moveIntroTextWrapper(page) {
    var pageTextWrapper = document.querySelector('.page-text-wrapper');
    var mainPage = document.querySelector('#page');

    if(!document.body.classList.contains('show-' + page + '-banner')) {
      mainPage.insertBefore(pageTextWrapper, mainPage.firstChild);
    } else {
      document.querySelector('.page-banner-wrapper').appendChild(pageTextWrapper);
    }

    pageTextWrapper.classList.remove('hide');
  };

  // Returns the a string indicating the collection type, based on the body class .collection-type-*
  function determineCollectionType() {
    var page;
    var elClasses = document.body.classList.toString().split ( ' ' );

    elClasses.forEach(function(i){
      if(i.match( /collection-type-\w+/ ) ){
        page = i.split('-')[2];
      }
    });

    return page;
  };

  function autoColorBannerBackground(page){
    var body = document.querySelector('body.collection-type-' + page);
    var color;
    var pageBannerWrapper = document.querySelector('.page-banner-wrapper');

    if( body.classList.contains('show-' + page + '-banner') ) {
      if( body.classList.contains('auto-color-banner-background') ) {
        color = pageBannerWrapper.dataset.suggestedBgColorThumbnail;
        pageBannerWrapper.style.backgroundColor = color;
      } else {
        pageBannerWrapper.removeAttribute('style');
      }
    } else {
      pageBannerWrapper.removeAttribute('style');
    }
  };

  function resizeBanner() {
    setMinHeight();
    window.Template.Util.reloadImages(document.querySelectorAll('.collection-thumbnail-image-container img'), {load: true});
  }

  // Set a minimum height so large banner text doesn't get cut off
  function setMinHeight() {
    var pageType = determineCollectionType();
    if(!document.body.classList.contains('show-' + pageType + '-banner')) {
      bannerWrapper.style.minHeight = 0;
      return;
    }

    var pageTextWrapper = document.querySelector('.page-text-wrapper');
    bannerWrapper.style.minHeight = pageTextWrapper.offsetHeight + 'px';
  }

  function initialize() {
    page = determineCollectionType();

    window.Template.Util.reloadImages(document.querySelectorAll('.collection-thumbnail-image img'), {load: true});
    window.addEventListener('resize', resizeBanner);

    autoColorBannerBackground(page);
    wrapPageDescriptionText();
    moveIntroTextWrapper(page);
    setMinHeight();
    handleBannerImage(page);
  };

  return {
    sync: function() {
      initialize();
    },
    destroy: function() {
      page = null;
      window.removeEventListener('resize', resizeBanner);

    }
  };

};
