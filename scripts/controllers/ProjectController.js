window.Template.Controllers.ProjectController = function(element){
  'use strict';

  // For smooth scroll
  var timer;
  var body = document.body;
  var staggerables = [];
  var elementsToSlide;

  /* All images */
  var images = Array.prototype.map.call(document.querySelectorAll('.project-slide-image-wrapper img[data-src]'), function(img, index){
    return img;
  });

  var firstImage = images[0];
  var allSlides = Array.prototype.map.call(document.querySelectorAll('.project-slide'), function(slide){
    return slide;
  });
  var slidesToAnimate;

  /* Tweaks Array for Tweak Watcher */
  var captionTweaks = [
    'project-image-portrait-caption-style',
    'project-image-landscape-caption-style'
  ];

  /* Tweak Watcher */

  // Caption Style tweak watcher
  SQS.Tweak.watch(captionTweaks, function(tweak){
    var animatedSlides = [].slice.call(document.querySelectorAll('.slide-in'));
    animatedSlides.forEach(function(slide){
      slide.classList.remove('slide-in');
    });
    slidesToAnimate = getSlidesToAnimate();
    slidesToAnimate.forEach(function(slide, index, arr){
      inView = isElementInViewport(slide);
      if(inView && !slide.classList.contains('already-animated')) {
        slide.classList.add('slide-in');
        return;
      }
    });

    window.Template.Util.reloadImages(document.querySelectorAll('img[data-src]'), {
      load: true
    });
  });

  SQS.Tweak.watch(['collapse-landscape-spacing', 'show-project-captions'], collapseLandscapeSpacing);

  // Cascade Images and Captions tweak watcher
  SQS.Tweak.watch(['tweak-project-slide-transition'], function(tweak) {
    slidesToAnimate = getSlidesToAnimate();
    var animatedSlides = [].slice.call(document.querySelectorAll('.already-animated'));
    animatedSlides.forEach(function(slide){
      slide.classList.add('slide-in');
    });
  });
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
            // -1 to account for weird 1px margin when someone uses % value in style editor
            landscape.style.marginBottom = '-1px';
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
            // -1 to account for weird 1px margin when someone uses % value in style editor
            landscape.style.marginBottom = '-1px';
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

  // function getElementsToSlide() {
  //   var body = document.body;
  //   var portraitOffsetCaptions = body.classList.contains('project-image-portrait-caption-style-offset');
  //   var landscapeOffsetCaptions = body.classList.contains('project-image-landscape-caption-style-offset');

  //   if(portraitOffsetCaptions && landscapeOffsetCaptions) {
  //     elementsToSlide = [].slice.call(document.querySelectorAll('.project-slide-landscape, .project-slide-portrait, .project-slide-video-wrapper, .project-slide-square, .project-slide-description-wrapper'));
  //   } else if(portraitOffsetCaptions) {
  //     elementsToSlide = [].slice.call(document.querySelectorAll('.project-slide-portrait, .project-slide-video-wrapper, .project-slide-square, .project-slide-description-wrapper'));
  //   } else if(landscapeOffsetCaptions) {
  //     elementsToSlide = [].slice.call(document.querySelectorAll('.project-slide-landscape, .project-slide-video-wrapper, .project-slide-description-wrapper'));
  //   } else {
  //     elementsToSlide = [].slice.call(document.querySelectorAll('.project-slide'));
  //   }

  //   return elementsToSlide;
  // };

  // This determines what slides to add the slide-in animation class if captions are offset
  function getSlidesToAnimate() {
    var slides;
    var body = document.body;

    if(body.classList.contains('tweak-project-slide-transition')){
      if(
        // if both portrait and landscape captions are set to offset
        document.body.classList.contains('project-image-portrait-caption-style-offset')
        && document.body.classList.contains('project-image-landscape-caption-style-offset')
        ) {
        slides = Array.prototype.map.call(document.querySelectorAll('.project-slide-image-container, .project-slide-description-wrapper, .project-slide-video-wrapper'), function(slide){
          return slide;
        });
        // if just the portrait captions are offset
      } else if(document.body.classList.contains('project-image-portrait-caption-style-offset')) {
        slides = Array.prototype.map.call(document.querySelectorAll('.project-slide-portrait .project-slide-image-container, .project-slide-portrait .project-slide-description-wrapper, .project-slide-square .project-slide-image-container, .project-slide-square .project-slide-description-wrapper, .project-slide-landscape, .project-slide-video'), function(slide){
          return slide;
        });
        console.log(slides);
        // if just the landscape captions are offset
      } else if(document.body.classList.contains('project-image-landscape-caption-style-offset')) {
        slides = Array.prototype.map.call(document.querySelectorAll('.project-slide-landscape .project-slide-image-container, .project-slide-landscape .project-slide-description-wrapper, .project-slide-portrait, .project-slide-square, .project-slide-video .project-slide-video-wrapper, .project-slide-video .project-slide-description-wrapper'), function(slide){
          return slide;
        });
        // all slides
      } else {
        slides = Array.prototype.map.call(document.querySelectorAll('.project-slide'), function(slide){
          return slide;
        });
      }
    } else {
      slides = Array.prototype.map.call(document.querySelectorAll('.project-slide'), function(slide){
        return slide;
      });
    }

    return slides;
  }

  function loadAllImages() {
    images.forEach(function(img) {
      SQS.ImageLoader.load(img, {
        load: true
      });
    });
  };

  // Loads first image on page before downloading all images
  function loadFirstImage(e) {
    var firstSlide = allSlides[0];
    firstSlide.className += (' ' + addAspectRatioClass(firstImage));
    // Sets an even/odd class on Portraits if Stagger Portraits is checked
    if(firstSlide.classList.contains('project-slide-staggerable')) {
      staggerables.push(firstSlide);
      firstSlide.classList.add('portrait-caption-alternate-odd');
    }

    setMaxWidthOnImgWrapper(firstImage);

    SQS.ImageLoader.load(firstImage, {
      load: true
    });

    // firstSlide.classList.add('slide-in');
  };

  function isElementInViewport (el) {

    var rect = el.getBoundingClientRect();

    return (
        (rect.top >= 0 && rect.top <= window.innerHeight / 1.1)
        || rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  };

  function slideIntoView() {
    var inView;
    var body = document.body;

    slidesToAnimate.forEach(function(slide, index, arr){
      inView = isElementInViewport(slide);
      if(inView && !slide.classList.contains('already-animated')) {
        slide.classList.add('slide-in');
        slide.classList.add('already-animated');
        slidesToAnimate.splice(index, 1);
        return;
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

  function resizeProjectImages() {
    window.Template.Util.reloadImages(document.querySelectorAll('.project-slide-image'), {
      load: true
    });
  };

  function setSlideClasses (img) {
    var parentSlide = window.Template.Util.getClosest(img, '.project-slide');
    var imgWrapper = window.Template.Util.getClosest(img, '.project-slide-image-wrapper');
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
  };

  // Pass it a child of the image wrapper - the fn will get the closest wrapper
  function setMaxWidthOnImgWrapper(img) {
    // Doing this requires putting !important on max-width on image-wrapper
    var imgContainer = window.Template.Util.getClosest(img, '.project-slide-image-container');
    var dimensions = imgContainer.getAttribute('data-image-dimensions').split('x');
    var imgWrapper = window.Template.Util.getClosest(img, '.project-slide-image-wrapper');
    if(window.getComputedStyle(imgWrapper).maxWidth == "none") {
      imgWrapper.style.maxWidth = Math.min(dimensions[0], 2500) + 'px';
    }
    if(window.getComputedStyle(imgWrapper).maxHeight == "none") {
      imgWrapper.style.maxHeight = dimensions[1] + 'px';
    }
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
    });

    videoThumbnails.forEach(function(thumb, index){
      var ratio = getImageRatio(thumb);
      var parentSlide = window.Template.Util.getClosest(thumb, '.project-slide');
      parentSlide.className += (' ' + addAspectRatioClass(thumb));
      SQS.ImageLoader.load(thumb, {
        load: true,
        mode: 'fill'
      });
    });
  };

  function smoothScroll(e) {
    clearTimeout(timer);
    if(!body.classList.contains('disable-hover')) {
      body.classList.add('disable-hover');
    }

    timer = setTimeout(function(){
      body.classList.remove('disable-hover');
    }, 250);
  };


  /* Sync and Destroy */
  function sync() {
    images.forEach(function(img) {
      img.addEventListener('load', removeImgLoadingClass);
      setSlideClasses(img);
      setMaxWidthOnImgWrapper(img);
    });

    if(firstImage) {
      firstImage.addEventListener('load', loadAllImages);
      loadFirstImage();
    }

    slidesToAnimate = getSlidesToAnimate();
    slidesToAnimate[0].classList.add('slide-in');

    setVideoWidth();
    collapseLandscapeSpacing();
    slideIntoView();

    window.addEventListener('resize', resizeVideoThumbs);
    window.addEventListener('resize', resizeProjectImages);
    window.addEventListener('scroll', slideIntoView);
    window.addEventListener('scroll', smoothScroll);

  }

  function destroy() {
    window.removeEventListener('resize', resizeVideoThumbs);
    window.removeEventListener('resize', resizeProjectImages);
    window.removeEventListener('scroll', slideIntoView);
    window.removeEventListener('scroll', smoothScroll);
    if(firstImage) {
      firstImage.removeEventListener('load', loadAllImages);
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
