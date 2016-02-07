/* global App */

/**
 * Emitter module
 * Note: This is the same as the mediator pattern or publish-subscribe pattern
 *
 * Modified: 2016/02/07
 * @author softwarespot
 */
App.core.emitter = (function emitterModule(window, document, $, core) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    // var GUID = 'DCCE65D7-978E-468B-8DB2-AC2B40553F27';

    // Value of indexOf when a value isn't found
    var IS_NOT_FOUND = -1;

    // First item in the array
    var ARRAY_FIRST_ITEM = 1;

    // Fields

    // Unique events object for both standard and one
    var _events = core.objectEmpty();
    var _eventsOne = core.objectEmpty();

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
     * Clear the registered event string or all registered callback functions for an event string
     *
     * @param {string|undefined} event If undefined all event strings will be clear; otherwise, the event string to clear
     * @return {undefined}
     */
    function clear(event) {
        _clear(event, _events);
        _clear(event, _eventsOne);
    }

    /**
     * Call all registered callback functions for the following event string
     *
     * @param {string} event Event string to invoke all registered callback functions of
     * @param {arguments} arg0...argN [optional] Arguments to pass to the callback function e.g. emit('EVENT_STRING', arg0, arg1, argN)
     * @return {undefined}
     */
    function emit(event) {
        // Check if the event string is a valid event string
        if (!_isEvent(event)) {
            return;
        }

        // Create a new arguments array, skipping the first element due to this being the event string
        var args = [];
        for (var i = 1, length = arguments.length; i < length; i++) {
            args.push(arguments[i]);
        }

        // Emit for both the standard events object literal and one events object literal
        _emit(event, args, _events);
        _emit(event, args, _eventsOne);

        // Remove all registered one event callback functions
        _clear(event, _eventsOne);
    }

    /**
     * Unregister an event
     *
     * @param {string} event Event string to unregister a callback function
     * @param {function} callback The previously associated callback function for the event string
     * @return {undefined}
     */
    function off(event, callback) {
        // Check if the event if a valid string and callback function
        if (!_isEvent(event) || !core.isFunction(callback)) {
            return;
        }

        _off(event, callback, _events);
        _off(event, callback, _eventsOne);
    }

    /**
     * Register an event
     *
     * @param {string} event Event string to register a callback function
     * @param {function} callback Callback function to be invoked when the event is 'emitted'
     * @return {undefined}
     */
    function on(event, callback) {
        // Check if the event is a valid string and callback function
        if (!_isEvent(event) || !core.isFunction(callback)) {
            return;
        }

        _on(event, callback, _events);
    }

    /**
     * Register an event that invokes the callback function only once and unregisters once called
     *
     * @param {string} event Event string to register a callback function
     * @param {function} callback Callback function to be invoked when the event is 'emitted'
     * @return {undefined}
     */
    function one(event, callback) {
        // Check if the event is a valid string and callback function
        if (!_isEvent(event) || !core.isFunction(callback)) {
            return;
        }

        _on(event, callback, _eventsOne);
    }

    /**
     * Clear all registered events or callback functions for a single event
     *
     * @param {string|null} event Event string to clear all registered callback functions; otherwise, null to remove all registered event strings
     * @param {object} events Events object to clear
     * @return {undefined}
     */
    function _clear(event, events) {
        // Clear the event string callback functions
        if (_isEvent(event)) {
            if (_isCallbacks(events[event])) {
                events[event] = [];
            }

            return;
        }

        // Clear all event strings
        events = core.objectEmpty();
    }

    /**
     * Call all registered callbacks for the following event string
     *
     * @param {string} event Event string to invoke all registered callback functions of
     * @param {array} args Arguments to pass to the callback function
     * @param {object} events Events object to bind the event string and callback to
     * @return {undefined}
     */
    function _emit(event, args, events) {
        // Get the callback functions for the event
        var callbacks = events[event];

        // Check if the event contains any registered callback functions
        if (!_isCallbacks(callbacks)) {
            return;
        }

        // Iterate through the callbacks array and apply the arguments to the function call
        callbacks.forEach(function forEachCallback(callback) {
            // callback.apply(this, args); // Synchronous
            // Queue the callback function, as setTimeout is asynchronous
            window.setTimeout(function emitTimeout() {
                callback.apply(this, args);
            }.bind(this), 0);
        });
    }

    /**
     * Check if the callback function array is a valid array
     *
     * @param {array} callbacks Value to check
     * @return {boolean} True, is valid callback function; otherwise, false
     */
    function _isCallbacks(callbacks) {
        return core.isArray(callbacks) && callbacks.length > 0;
    }

    /**
     * Check if an event string is a valid string
     *
     * @param {string} event Value to check
     * @return {boolean} True, is valid event string; otherwise, false
     */
    function _isEvent(event) {
        return core.isString(event) && event.trim().length > 0;
    }

    /**
     * Remove an event registration
     *
     * @param {string} event Event string to register a callback function
     * @param {function} callback Callback function to be invoked when the event is 'emitted'
     * @param {object} events Events object to bind the event string and callback to
     * @return {undefined}
     */
    function _off(event, callback, events) {
        // Get the callbacks array for the event
        var callbacks = events[event];

        // Check if the event contains any registered callback functions
        if (!_isCallbacks(callbacks)) {
            return;
        }

        // If the callback function exists in the callbacks array, then remove the callback
        // using the provided index value
        var index = callbacks.indexOf(callback);
        if (index !== IS_NOT_FOUND) {
            // Only remove one value from the callbacks array
            callbacks.splice(index, ARRAY_FIRST_ITEM);
        }
    }

    /**
     * Create an event registration
     *
     * @param {string} event Event string to register a callback function
     * @param {function} callback Callback function to be invoked when the event is 'emitted'
     * @param {object} events Events object to bind the event string and callback to
     * @return {undefined}
     */
    function _on(event, callback, events) {
        // Ensure the event contains a valid array datatype
        events[event] = events[event] || [];

        // Get the callbacks array for the event
        var callbacks = events[event];

        // Check the callback function isn't already registered for the event
        if (callbacks.indexOf(callback) === IS_NOT_FOUND) {
            // Push the callback function to the callbacks array
            callbacks.push(callback);
        }
    }

    // Public API
    return {
        getVersion: getVersion,
        clear: clear,
        emit: emit,
        off: off,
        on: on,
        one: one,
    };
}(window, window.document, window.jQuery, window.App.core));
