window.Template.Controllers.IndexController = function (element) {
  'use strict';

  /* Tweaks array for Tweak Watcher */
  var tweaks = [
    'index-item-image-crop',
    'index-item-image-alignment',
    'index-item-alternate-widths',
    'index-item-spacing',
    'indexItemSpacing',
    'index-item-width',
    'full-bleed-index'
  ];

  var titleTweaks = [
    'index-item-title-display',
    'index-item-title-alignment',
    'index-item-height',
    'index-item-alternate-widths'
  ];

  var indexItemTextWrappers = [].slice.call(document.querySelectorAll('.index-item-text-wrapper'));

  /* Tweak Watcher */
  SQS.Tweak.watch(tweaks, initIndexImages);
  SQS.Tweak.watch(titleTweaks, revealIndexTitles);

  SQS.Tweak.watch('index-item-height', function(tweak){
    window.Template.Util.reloadImages(document.querySelectorAll('.js-index-item-image'), {
      load: true
    });
  });

  /* Functions */
  function initIndexImages() {
    var body = document.body;
    var imgWrapper = document.querySelectorAll('.js-index-item-image-wrapper');
    var img = document.querySelectorAll('.js-index-item-image');
    var i;

    if( body.classList.contains('index-item-image-alignment-left') || body.classList.contains('index-item-image-alignment-right') || body.classList.contains('index-item-image-alignment-center')) {
      if(body.classList.contains('index-item-image-crop')) {
        for(i = 0; i < imgWrapper.length; i++) {
          imgWrapper[i].classList.add('content-fill');
          img[i].classList.remove('index-item-image');
        }

      } else {
        for(i = 0; i < imgWrapper.length; i++) {
          imgWrapper[i].classList.remove('content-fill');
          img[i].removeAttribute('style');
          img[i].classList.add('index-item-image');
        }
      }

    } else {
      body.classList.remove('index-item-image-crop');
      for(i = 0; i < imgWrapper.length; i++) {
        imgWrapper[i].classList.remove('content-fill');
        img[i].removeAttribute('style');
        img[i].classList.add('index-item-image');
      }
    }

    window.Template.Util.reloadImages(document.querySelectorAll('.js-index-item-image'), {
      load: true
    });
  };

  function resizeIndexImages() {
    window.Template.Util.reloadImages(document.querySelectorAll('.js-index-item-image'), {load: true});
  };

  function revealIndexTitles() {
    var body = document.body;
    if(body.classList.contains('index-item-title-display-on-scroll')) {
      slideIntoView();
    } else {
      indexItemTextWrappers.forEach(function(text){
        text.classList.remove('reveal-index-title');
      });
    }
  };


  function isElementInViewport (el) {
    var rect = el.getBoundingClientRect();
    return (
        (rect.top >= window.innerHeight / 1.25 && rect.top <= window.innerHeight / 1.1)
        || rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  };

  function slideIntoView() {
    var inView;
    indexItemTextWrappers.forEach(function(text, index, arr){
      inView = isElementInViewport(text);
      if(inView) {
        text.classList.add('reveal-index-title');
        return;
      }
    });
  };

  /* Sync and Destroy */
  function sync() {
    window.addEventListener('resize', resizeIndexImages);
    window.addEventListener('scroll', revealIndexTitles);
    initIndexImages();
    window.setTimeout(function(){
      revealIndexTitles();
    }, 1000);
  };

  function destroy() {
    window.removeEventListener('resize', resizeIndexImages);
    window.removeEventListener('scroll', revealIndexTitles);
  };

  sync();

  return {
    sync: sync,
    destroy: destroy
  };
}
