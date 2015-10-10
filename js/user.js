/* global App */

/**
 * User module
 *
 * Modified: 2015/10/10
 * @author softwarespot
 */
App.user = (function (window, document, $, core, undefined) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    // var GUID = 'B33D672B-E507-478E-99D1-3B0CA10CD989';

    // Fields

    // Has the events been binded
    var _isEventsBound = false;

    // Store if the module has been initialised
    var _isInitialised = false;

    // Events object
    var _events = {
        // Sign in event string
        signIn: core.events.NAVIGATION_CLICK,

        // When the sign in event is invoked, call the following function
        signInFn: function (link) {
            // If the link selected was not the sign in link, then do nothing
            if (link !== '#signin-section') {
                return;
            }

            window.console.log('Sign in was called, but nothing took place as of yet');
        }
    };

    // Methods

    /**
     * Initialise the module
     *
     * @param {object} config Options to configure the module
     * @return {undefined}
     */
    function init( /*config*/ ) {
        if (_isInitialised) {
            return;
        }

        // Default config that can be overwritten by passing through the config variable
        // var defaultConfig = {};

        // Combine the passed config
        // $.extend(defaultConfig, config);

        _cacheDom();
        _bindEvents();

        _isInitialised = true;
    }

    /**
     * Destroy the module
     *
     * @return {undefined}
     */
    function destroy() {
        _isInitialised = false;
    }

    /**
     * Get the version number of the module
     *
     * @returns {number} Version number
     */
    function getVersion() {
        return VERSION;
    }

    /**
     * Bind events
     *
     * @return {undefined}
     */
    function _bindEvents() {
        if (_isEventsBound) {
            _unbindEvents();
        }

        core.emitter.on(_events.signIn, _events.signInFn);

        _isEventsBound = true;
    }

    /**
     * Unbind events
     *
     * @return {undefined}
     */
    function _unbindEvents() {
        if (!_isEventsBound) {
            return;
        }

        core.emitter.off(_events.signInEvent, _events.signIn);

        _isEventsBound = false;
    }

    /**
     * Initialise all DOM cachable variables
     *
     * @return {undefined}
     */
    function _cacheDom() {}

    // Invoked when the DOM has loaded
    $(function () {
        init();
    });

    // Public API
    return {
        init: init,
        destroy: destroy,
        getVersion: getVersion
    };
})(this, this.document, this.jQuery, App.core);
