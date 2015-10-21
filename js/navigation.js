/* global App */

/**
 * Navigation module
 *
 * Modified: 2015/10/20
 * @author softwarespot
 */
App.navigation = (function (window, document, $, core, undefined) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    // var GUID = 'DDB8034C-DE48-418C-81B4-E8CDB9BFAF1E';

    // Fields

    // Has the events been binded
    var _isEventsBound = false;

    // Store if the module has been initialised
    var _isInitialised = false;

    // Store the body jQuery selector object
    var $_body = null;

    // Store the navigation hyperlinks jQuery selector object
    var $_navigationLinks = null;

    // Events object
    var _events = {
        // Click event string
        navigation: 'click.app.navigation',

        // When the click event is invoked, call the following function
        navigationFn: function navigationFn(event) {
            // Get the href attribute using vanilla JavaScript
            var href = event.currentTarget.getAttribute('href');

            // The following idea was taken from sizzle.js, URL: https://github.com/jquery/sizzle/blob/master/dist/sizzle.js

            // http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
            var identifier = '(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+';

            // Create a regular expression object to test valid id fragments
            var reIdentifier = new window.RegExp('^#' + identifier + '$');

            // Emit to all registered, that the item was selected
            core.emitter.emit(core.events.NAVIGATION_CLICK, href);

            // Only bind if it's a valid anchor link
            if (!reIdentifier.test(href)) {
                return true;
            }

            // Prevent default click propagation
            event.preventDefault();

            // Get the jQuery selector object based on the href attribute value
            var $element = $(href);

            // If an error occurred i.e. no node was found in the DOM, the return false
            // Used to be isjQueryNotEmpty($element)
            if (!core.isjQueryNotEmpty($element)) {
                return false;
            }

            // Scroll to the element intended
            _scrollTo($element, 500);

            // Fallback to prevent jitter
            return false;
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
        _unbindEvents();

        $_body = null;
        $_navigationLinks = null;

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

        // Navigation hyperlink elements
        $_navigationLinks.on(_events.navigation, _events.navigationFn);

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

        $_navigationLinks.off(_events.navigation, _events.navigationFn);

        _isEventsBound = false;
    }

    /**
     * Initialise all DOM cachable variables
     *
     * @return {undefined}
     */
    function _cacheDom() {
        $_body = $('html, body');
        $_navigationLinks = $('header').find('a');
    }

    /**
     * Scroll to an element on the page
     *
     * @param {HTMLElement} $element jQuery HTMLElement node object
     * @param {number|string} speed Speed at which to scroll the element
     * @return {undefined}
     */
    function _scrollTo($element, speed) {
        if (core.isUndefined(speed)) {
            speed = 500;
        }

        // Animate from the body to the top of the element's offset position
        $_body.animate({
            scrollTop: $element.offset().top
        }, speed);
    }

    // Initialise the module
    $(function () {
        init();
    });

    // Public API
    return {
        init: init,
        destroy: destroy,
        getVersion: getVersion
    };
})(this, this.document, this.jQuery, this.App.core);
