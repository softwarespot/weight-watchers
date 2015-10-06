/* global App, NProgress */

/**
 * API module
 *
 * Modified: 2015/10/02
 * @author softwarespot
 */
App.core.api = (function (window, document, $, core, undefined) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    // var GUID = '27AB85AB-3AD5-42C6-A086-30FF65668693';

    /**
     * Common HTTP status codes
     *
     * @type {object}
     */
    var HTTPStatus = {

        // Success

        /**
         * The request has succeeded
         * @type {number}
         */
        OK: 200,

        /**
         * The server successfully created a new resource
         * @type {number}
         */
        CREATED: 201,

        /**
         * The server successfully processed the request, though no content is returned
         * @type {number}
         */
        NO_CONTENT: 204,

        // Redirection

        /**
         * The resource has not been modified since the last request
         * @type {number}
         */
        NOT_MODIFIED: 304,

        // Client Error

        /**
         * The request cannot be fulfilled due to multiple errors
         * @type {number}
         */
        BAD_REQUEST: 400,

        /**
         * The user is unauthorized to access the requested resource
         * @type {number}
         */
        UNAUTHORIZED: 401,

        /**
         * The requested resource is unavailable at this present time
         * @type {number}
         */
        FORBIDDEN: 403,

        /**
         * The requested resource could not be found
         *
         * Note: This is sometimes used to mask if there was an UNAUTHORIZED (401) or
         * FORBIDDEN (403) error, for security reasons
         * @type {number}
         */
        NOT_FOUND: 404,

        /**
         * The request method is not supported by the following resource
         * @type {number}
         */
        METHOD_NOT_ALLOWED: 405,

        /**
         * The request was not acceptable
         * @type {number}
         */
        NOT_ACCEPTABLE: 406,

        /**
         * The request could not be completed due to a conflict with the current state
         * of the resource
         * @type {number}
         */
        CONFLICT: 409,

        // Server Error

        /**
         * The server encountered an unexpected error
         *
         * Note: This is a generic error message when no specific message
         * is suitable
         * @type {number}
         */
        INTERNAL_SERVER_ERROR: 500,

        /**
         * The server does not recognise the request method
         * @type {number}
         */
        NOT_IMPLEMENTED: 501
    };

    // Fields

    // Store if the module has been initialised
    var _isInitialised = false;

    // Store the document jQuery selector object
    var $_document = null;

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
        _setAjaxGlobal();

        _isInitialised = true;
    }

    /**
     * Destroy the module
     *
     * @return {undefined}
     */
    function destroy() {
        $_document = null;
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
     * Initialise all DOM cachable variables
     *
     * @return {undefined}
     */
    function _cacheDom() {
        $_document = $(document);
    }

    /**
     * Set display the NProgress nano bar when an ajax request is taking place
     *
     * @returns {undefined}
     */
    function _setAjaxGlobal() {
        // Disable showing the spinner in the top right hand corner
        NProgress.configure({
            minimum: 0.1,
            showSpinner: false
        });

        // When an ajax request is started
        $_document.ajaxStart(function () {
            NProgress.start();
        });

        // When an ajax request has stopped
        $_document.ajaxStop(function () {
            NProgress.done();
        });
    }

    /**
     * Simulate an ajax request by displaying a progress bar
     *
     * @return {undefined}
     */
    function fetch() {
        // Simulate an ajax request with a 1 second delay progress bar
        NProgress.start();
        window.setTimeout(NProgress.done, 1000);
    }

    /**
     * Ajax DELETE request
     *
     * @return {object} jQuery XHR promise
     */
    function del(url, callback) {
        return undefined;
    }

    /**
     * Ajax GET request
     *
     * @return {object} jQuery XHR promise
     */
    function get(url, callback) {
        return undefined;
    }

    /**
     * Ajax POST request
     *
     * @return {object} jQuery XHR promise
     */
    function post(url, callback) {
        return undefined;
    }

    /**
     * Parse a url by replacing segment such as {item}, with the
     *
     * @param {string} url Url string to parse
     * @param {Object} object Object literal with one level only. The keys should match the segments in the url
     * @return {string|null} Parsed string; otherwise, null
     */
    function parseUrl(url, object) {
        // Check if the url is a string and the object parameter is an object literal
        if (!core.isString(url) || !core.isObjectLiteral(object)) {
            return null;
        }

        // Clone the url, so the replaced values, if they contain {}, don't interfere with matching
        var urlClone = '' + url;

        // Regular expression to parse items between {}
        var reParseURLParts = /{([^\}]+)}/g;
        while (true) {
            // Get the matches and check if any were found
            var match = reParseURLParts.exec(urlClone);
            if (core.isNull(match)) {
                break;
            }

            // Store the key and check if it exists in the object literal
            var key = match[1];
            if (!core.has(object, key) || core.isUndefined(object[key])) {
                continue;
            }

            // Replace the url string with the value of the full match
            var fullMatch = match[0];
            url = url.replace(fullMatch, object[key]);
        }
    }

    // Invoked when the DOM has loaded
    $(function () {
        init({});
    });

    // Public API
    return {
        init: init,
        destroy: destroy,
        getVersion: getVersion,
        HTTPStatus: HTTPStatus,
        fetch: fetch,
        delete: del,
        get: get,
        post: post,
        parseUrl: parseUrl
    };
})(this, this.document, this.jQuery, App.core);
