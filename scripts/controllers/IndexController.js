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

  /* Tweak Watcher */
  SQS.Tweak.watch(tweaks, initIndexImages);

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

  /* Sync and Destroy */
  function sync() {
    window.addEventListener('resize', resizeIndexImages);
    initIndexImages();
  }

  function destroy() {
    window.removeEventListener('resize', resizeIndexImages);
  }

  sync();

  return {
    sync: sync,
    destroy: destroy
  };
}
