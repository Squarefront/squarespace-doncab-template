window.Template.Controllers.NavCollisionController = function () {

  var body = document.body;
  var header = document.querySelector('header');

  function detectCollision(parent, child) {
    var parentRect = parent.getBoundingClientRect();
    var childRect = child.getBoundingClientRect();

    return parentRect.left >= childRect.right || parentRect.right <= childRect.left;

  };

  function toggleMobileNav(bool) {
    document.body.classList.toggle('display-mobile-navigation', bool);
  }

  function getBrowserWidth() {
    return window.innerWidth;
  }

  function handleNavDisplay() {

    if(getBrowserWidth() <= 768) {
      toggleMobileNav(true);
      return;
    }

    // Ancillary Container elements
    var ncContainers = Array.prototype.map.call(header.querySelectorAll('[data-nc-container]'), function(c){
      return c;
    });

    ncContainers.forEach(function(container){
      if(container.children) {
        for(var i = 0; i < container.children.length; i++) {
          if(detectCollision(container, container.children[i])) {
            return toggleMobileNav(true);
          }
        }
        toggleMobileNav(false);
      }
    });
  };

  function sync() {
    handleNavDisplay();
    window.addEventListener('resize', handleNavDisplay);
  };

  function destroy() {
    window.removeEventListener('resize', handleNavDisplay);
  };

  // Race condition - fix this!
  // setTimeout(sync, 50);
  // sync();

  // Notes: need to hide the main nav when .display-mobile-navigation is present

  return {
    sync: sync,
    destroy: destroy
  };
};
