(function(win, doc) {

  if (!doc.querySelector) {
    return;
  }

  var DEBUG = false;

  /**
   * Cached array of live controllers.
   *
   * @name _liveControllers
   * @type {Array}
   */
  var _liveControllers = [];

  /**
   * Given a controller object, run its
   * function with its element as the
   * context, and return whatever its
   * return is (lifecycle methods).
   *
   * @method process
   * @return {Object} The response object of the controller
   */
  function process(controller) {

    if (!controller.fn || !controller.element) {
      return null;
    }

    return controller.fn.apply(controller.element);

  }

  /**
   * Compare two controller objects and
   * returns whether they are equal
   *
   * @method isEqualController
   */
  function isEqualController(a, b) {

    if (!a.element || !b.element || !a.fn || !b.fn) {
      return null;
    }

    return a.element === b.element && a.fn === b.fn;

  }

  /**
   * Sychronize all controllers. Process
   * new controllers, destroy controllers
   * whose elements are no longer on the
   * DOM, and sync others.
   *
   * @method synchronizeControllers
   */
  function synchronizeControllers() {

    // Get all nodes with controllers and convert to array
    var nodesWithControllers = Array.prototype.slice.call(doc.querySelectorAll('[sqs-controller]'), 0);

    // Create array to house new controller objects
    var newControllers = [];

    // Convert found nodes to controller objects
    // so we can do comparisons later
    nodesWithControllers.forEach(function(node) {

      // Get controller names on node
      var controllerNames = node.getAttribute('sqs-controller').split(',');

      // Loop
      controllerNames.forEach(function(controllerName) {

        controllerName = controllerName.trim();

        // Find controller function on specified namespace
        var foundPath = ['window'];
        var controllerFunction = controllerName.trim().split('.').reduce(function(prevVal, name) {

          if (!prevVal) {
            return prevVal;
          }

          var newVal = prevVal[name];

          if (newVal) {
            foundPath.push(name);
          }

          return newVal;

        }, win);

        // Can't find controller, error out
        if (controllerFunction === win || !controllerFunction) {
          console.error(
            'Could not locate controller with name: %s. Last valid path parsed: %s',
            controllerName,
            foundPath.join('.')
          );
          return;
        }

        // Add to new controller array
        newControllers.push({
          namespace: controllerName,
          element: node,
          fn: controllerFunction
        });

      });

    });

    // Loop through live controllers and
    // find ones that need to be destroyed
    // or synced
    _liveControllers = _liveControllers.filter(function(liveController) {

      // Boolean to indicate whether one of
      // new controllers matches current
      // live controller.
      var isControllerActive = newControllers.some(function(newController) {
        return isEqualController(liveController, newController);
      });

      if (isControllerActive) {

        if (DEBUG) {
          console.log('Sync controller: ' + liveController.namespace);
        }

        // Controller element is still in the
        // DOM, run sync method of controller.
        if (liveController.methods && liveController.methods.sync) {
          liveController.methods.sync.apply(liveController.element, null);
        }

        // Remove existing controllers from new
        // controllers array, so they are not
        // reinitialized.
        newControllers = newControllers.filter(function(newController) {
          return !isEqualController(liveController, newController);
        });

      } else {

        if (DEBUG) {
          console.log('Destroy controller: ' + liveController.namespace);
        }

        // Controller element is no longer in
        // the DOM, call destructor method of
        // controller.
        if (liveController.methods && liveController.methods.destroy) {
          liveController.methods.destroy.apply(liveController.element, null);
        }

      }

      // Filter condition
      return isControllerActive;

    });


    // Process new controllers for the first time
    newControllers.forEach(function(controller) {

      if (DEBUG) {
        console.log('New controller: ' + controller.namespace);
      }

      // Process controller
      controller.methods = process(controller);

      // Push to live controllers array
      _liveControllers.push(controller);

      // Add controller binded info
      var bindedControllersName = [];
      if (controller.element.hasAttribute('sqs-controllers-binded')) {
        var existingControllers = controller.element.getAttribute('sqs-controllers-binded').split(', ');
        bindedControllersName = bindedControllersName.concat(existingControllers);
      }

      bindedControllersName.push(controller.namespace);

      controller.element.setAttribute('sqs-controllers-binded', bindedControllersName.join(', '));

    });

  }

  doc.addEventListener('DOMContentLoaded', synchronizeControllers);

  // Need to expose synchronize on a global
  // namespace, so it can be called by other
  // scripts on ajax load and whatnot.

  win['SQSControllerSync'] = synchronizeControllers;


})(window, document);
