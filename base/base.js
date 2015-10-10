/* global App */

/**
 * Base module
 *
 * Modified: YYYY/MM/DD
 * @author author
 */
App.base = (function (window, document, $, core, undefined) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    // var GUID = '27AB85AB-3AD5-42C6-A086-30FF65668693';

    // Fields

    // Has the events been binded
    var _isEventsBound = false;

    // Store if the module has been initialised
    var _isInitialised = false;

    // Methods

    /**
     * Initialise the module
     *
     * @param {object} config Options to configure the module
     * @return {undefined}
     */
    function init(config) {
        if (_isInitialised) {
            return;
        }

        // Default config that can be overwritten by passing through the config variable
        var defaultConfig = {};

        // Combine the passed config
        $.extend(defaultConfig, config);

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
        // init({});
    });

    // Public API
    return {
        init: init,
        destroy: destroy,
        getVersion: getVersion
    };
})(this, this.document, this.jQuery, App.core);
