/* global App */

/**
 * Emitter module
 * Note: This is the same as the mediator pattern or publish-subscribe pattern
 *
 * Modified:  2015/10/28
 * @author softwarespot
 */
App.core.emitter = (function emitterModule(window, document, $, core, undefined) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    // var GUID = 'DCCE65D7-978E-468B-8DB2-AC2B40553F27';

    // Fields

    // Unique events object
    var _events = {};

    // Methods

    /**
     * Get the version number of the module
     *
     * @returns {number} Version number
     */
    function getVersion() {
        return VERSION;
    }

    /**
     * Clear the registered events
     *
     * @return {undefined}
     */
    function clear() {
        _events = {};
    }

    /**
     * Call all registered callbacks for the following event
     *
     * @param {string} event Event string to invoke all registered callback functions of
     * @param {arguments} arg0...argN [optional] Arguments to pass to the callback function e.g. emit('EVENT_STRING', arg0, arg1, argN)
     * @return {undefined}
     */
    function emit(event) {
        // Check if the event string is a valid event string
        if (!_isEventString(event)) {
            return;
        }

        // Get the callback functions for the event
        var callbacks = _events[event];

        // Check if the event contains any registered callback functions
        if (!_isCallbacksArray(callbacks)) {
            return;
        }

        // Create a new arguments array, skipping the first element due to this being the event
        var args = [];
        for (var i = 1, length = arguments.length; i < length; i++) {
            args.push(arguments[i]);
        }

        // Iterate through the callbacks array and apply the arguments to the function call
        callbacks.forEach(function forEachCallbacks(callback) {
            // callback.apply(this, args); // Synchronous
            _emitCallback(this, callback); // Asynchronous
        });

        /**
         * Queue calling the callback function (idea by Nicolas Bevacqua)
         *
         * @param {object} _this The current context to bind the callback function to
         * @param {function} callback Callback function to apply the arguments to
         * @return {undefined}
         */
        function _emitCallback(_this, callback) {
            // Queue the callback function, as setTimeout is asynchronous
            window.setTimeout(function _emitTimeout() {
                callback.apply(_this, args);
            }, 0);
        }
    }

    /**
     * Unregister an event
     *
     * @param {string} event Event string to unregister a callback function
     * @param {function} callback The previously associated callback function for the event
     * @return {undefined}
     */
    function off(event, callback) {
        // Check if the event if a valid string and callback function
        if (!_isEventString(event) || !core.isFunction(callback)) {
            return;
        }

        // Get the callbacks array for the event
        var callbacks = _events[event];

        // Check if the event contains any registered callback functions
        if (!_isCallbacksArray(callbacks)) {
            return;
        }

        // If the callback function exists in the callbacks array, then remove the callback
        // using the provided index value
        var index = callbacks.indexOf(callback);
        if (index !== -1) {
            // Only remove one value from the callbacks array
            callbacks.splice(index, 1);
        }
    }

    /**
     * Regsiter an event
     *
     * @param {string} event Event string to register a callback function
     * @param {function} callback Callback function to be invoked when the event is 'emitted'
     * @return {undefined}
     */
    function on(event, callback) {
        // Check if the event if a valid string and callback function
        if (!_isEventString(event) || !core.isFunction(callback)) {
            return;
        }

        // Ensure the event contains an array
        _events[event] = _events[event] || [];

        // Get the callbacks array for the event
        var callbacks = _events[event];

        // Check the callback function isn't already registered for the event
        if (callbacks.indexOf(callback) === -1) {
            // Push the callback function to the callbacks array
            callbacks.push(callback);
        }
    }

    /**
     * Check if the callback function array is a valid array
     * @param {array} callbacks Value to check
     * @return {boolean} True is valid; otherwise, false
     */
    function _isCallbacksArray(callbacks) {
        return core.isArray(callbacks) && callbacks.length > 0;
    }

    /**
     * Check if an event string is a valid string
     *
     * @param {string} event Value to check
     * @return {boolean} True is valid; otherwise, false
     */
    function _isEventString(event) {
        return core.isString(event) && event.trim().length > 0;
    }

    // Public API
    return {
        getVersion: getVersion,
        clear: clear,
        emit: emit,
        off: off,
        on: on,
    };
})(window, window.document, window.jQuery, window.App.core);
