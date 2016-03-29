window.Template.Controllers.ProjectController = function(element){
  'use strict';

  /* All images */
  var images = Array.prototype.map.call(document.querySelectorAll('.project-slide-image-wrapper img[data-src]'), function(img){
    return img;
  });

  var slides = Array.prototype.map.call(document.querySelectorAll('.project-slide'), function(slide){
    return slide;
  });

  var firstImage = document.querySelector('.project-slide-image-wrapper img[data-src]');

  /* Tweaks Array for Tweak Watcher */
  var tweaks = [
    'project-image-portrait-caption-style'
  ];

  /* Tweak Watcher */
  SQS.Tweak.watch(tweaks, function(tweak){
    window.Template.Util.reloadImages(document.querySelectorAll('img[data-src]'), {
      load: true
    });
  });

  SQS.Tweak.watch(['collapse-landscape-spacing', 'show-project-captions'], collapseLandscapeSpacing);

  /* Functions */
  function addAspectRatioClass(img) {
    var ratio = getImageRatio(img);
    // Just a magic number based on image ratio.
    if (ratio > 200) {
      return 'project-slide-pano project-slide-landscape';

    } else if (ratio > 115) {
      return 'project-slide-landscape';

    } else if (ratio < 85) {
      return 'project-slide-portrait project-slide-staggerable';

    } else {
      return 'project-slide-square project-slide-staggerable';
    }
  };

  // Set margin-bottom to 0 on Landscapes when Collapse Landscape Spacing is checked
  function collapseLandscapeSpacing() {
    var body = document.body;
    var landscapes;

    // If Collapse Landscape Spacing is checked
    if(body.classList.contains('collapse-landscape-spacing')) {
      landscapes = document.querySelectorAll('.project-slide-landscape');
      Array.prototype.forEach.call(landscapes, function(landscape){
        landscape.removeAttribute('style');
      });

      // If Show Project Captions is checked
      if(body.classList.contains('show-project-captions')) {
        landscapes = document.querySelectorAll('.project-slide-landscape.project-slide-has-no-description');
        Array.prototype.forEach.call(landscapes, function(landscape){
          landscape.removeAttribute('style');
          // if the next slide is a captionless Landscape slide, set margin-bottom to 0
          if(landscape.nextElementSibling && landscape.nextElementSibling.classList.contains('project-slide-landscape')) {
            landscape.style.marginBottom = '0px';
          }
          // if there's a caption, remove the margin bottom
          if(landscape.classList.contains('project-slide-has-description')) {
            landscape.removeAttribute('style');
          }
        });
        // Else, if Show Project Captions is unchecked, set margin-bottom to 0 on all Landscapes
      } else {
        landscapes = document.querySelectorAll('.project-slide-landscape');
        Array.prototype.forEach.call(landscapes, function(landscape){
          if(landscape.nextElementSibling && landscape.nextElementSibling.classList.contains('project-slide-landscape')) {
            landscape.style.marginBottom = '0px';
          }
        });
      }
      // Else, if Collapse Landscape Spacing is unchecked, removing margin bottom values
    } else {
      landscapes = document.querySelectorAll('.project-slide-landscape');
      Array.prototype.forEach.call(landscapes, function(landscape){
        landscape.removeAttribute('style');
      });
    }
  };

  function getImageRatio(img) {
    var dimensions = img.getAttribute('data-image-dimensions').split('x');
    return (parseInt(dimensions[0], 10) / parseInt(dimensions[1], 10)) * 100;
  };

  function loadAllImages() {
    var staggerables = [];
    images.forEach(function(img) {
      var parentSlide = window.Template.Util.getClosest(img, '.project-slide');
      parentSlide.className += (' ' + addAspectRatioClass(img));
      // Sets an even/odd class on Portraits if Stagger Portraits is checked
      if(parentSlide.classList.contains('project-slide-staggerable')) {
        staggerables.push(parentSlide);
        if(staggerables.length % 2 === 0 ) {
          parentSlide.classList.add('portrait-caption-alternate-even');
        } else {
          parentSlide.classList.add('portrait-caption-alternate-odd');
        }
      }
      SQS.ImageLoader.load(img, {
        load: true
      });
    });
    slideIntoView();
    collapseLandscapeSpacing();
  };

  // Loads first image on page before downloading all images
  function loadFirstImage(e) {
    var firstSlide = document.querySelectorAll('.project-slide')[0];
    removeImgLoadingClass(e);

    // var inView = isElementInViewport(firstSlide);

    // if(inView) {
    //   firstSlide.classList.add('slide-in');
    // }
    firstSlide.classList.add('slide-in');
    loadAllImages();
  };

  function isElementInViewport (el) {

    var rect = el.getBoundingClientRect();

    return (
        (rect.top >= window.innerHeight / 1.25 && rect.top <= window.innerHeight / 1.1)
        // rect.left >= 0 &&
        || rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        // rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  function slideIntoView() {
    var inView;
    Array.prototype.forEach.call(slides, function(slide){
      inView = isElementInViewport(slide);
      if(inView) {
        slide.classList.add('slide-in');
      }
    });
  };

  // When image is loaded, remove the .not-ready animation class
  function removeImgLoadingClass(e) {
    e.target.parentNode.classList.remove('not-ready');
  };

  // Reload video thumbnails on window resize
  function resizeVideoThumbs() {
    window.Template.Util.reloadImages(document.querySelectorAll('.project-slide-video-wrapper img[data-src]'), {
      load: true,
      mode: 'fill'
    });
  };

  // For Project Videos - this grabs the embedded iframe's height and width and then
  // sets a max-width on the video wrapper.
  function setVideoWidth() {
    var videos = Array.prototype.map.call(document.querySelectorAll('.project-slide-video-wrapper .sqs-video-wrapper'), function(vid) {
      return vid;
    });

    var videoThumbnails = Array.prototype.map.call(document.querySelectorAll('.project-slide-video-wrapper img[data-src]'), function(thumb) {
      return thumb;
    });

    videos.forEach(function(video, index){
      var string = video.getAttribute('data-html');
      var dum = document.createElement('div');
      dum.innerHTML = string;
      var iframe = dum.firstChild;
      var width = iframe.getAttribute('width');
      video.parentNode.style.maxWidth = width + 'px';

      SQS.ImageLoader.load(video.querySelector('.sqs-video-overlay img'), {
        load: true,
        mode: 'fill'
      });

    });

    videoThumbnails.forEach(function(thumb, index){
      var ratio = getImageRatio(thumb);
      var parentSlide = window.Template.Util.getClosest(thumb, '.project-slide');
      parentSlide.className += (' ' + addAspectRatioClass(thumb));
    });
  };

  /* Sync and Destroy */
  function sync() {
    images.forEach(function(img) {
      img.addEventListener('load', removeImgLoadingClass);
    });

    if(firstImage) {
      firstImage.addEventListener('load', loadFirstImage);
      SQS.ImageLoader.load(firstImage, {
        load: true
      });
    }

    setVideoWidth();
    window.addEventListener('resize', resizeVideoThumbs);
    window.addEventListener('scroll', slideIntoView);

  }

  function destroy() {
    window.removeEventListener('resize', resizeVideoThumbs);
    window.removeEventListener('scroll', slideIntoView);
    if(firstImage) {
      firstImage.removeEventListener('load', loadFirstImage);
    }
    images.forEach(function(img){
      img.removeEventListener('load', removeImgLoadingClass);
    });
  }

  sync();

  return {
    sync: sync,
    destroy: destroy
  };

}
