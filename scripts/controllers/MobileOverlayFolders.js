window.Template.Controllers.MobileOverlayFolders = function (element) {

  if (window.Template.Constants.DEBUG) { console.log('MobileOverlayFolders'); }

  var handleClick = function (e) {

    var target = e.target;

    while (target !== element && target.getAttribute('data-controller-folder-toggle') === null) {
      target = target.parentNode;
    }

    var folderID = target.getAttribute('data-controller-folder-toggle');

    if (folderID) {

      // FolderID, folder is being clicked
      var folder = element.querySelector('[data-controller-folder="' + folderID + '"]');

      if (folder) {
        folder.classList.toggle('is-active-folder');
        element.classList.toggle('has-active-folder');
      }

    }


  };

  element.addEventListener('click', handleClick);

    return {
    sync: function() {
      // sync();
    }
  };

};
