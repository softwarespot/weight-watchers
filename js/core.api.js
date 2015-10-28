/* global App */

/**
 * API module
 *
 * Modified:  2015/10/28
 * @author softwarespot
 */
App.core.api = (function (window, document, $, core, undefined) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    // var GUID = '27AB85AB-3AD5-42C6-A086-30FF65668693';

    // Fake fetch time
    var FETCH_TIME = 750;

    /**
     * Common RESTful methods
     *
     * @type {object}
     */
    var methods = {
        DELETE: 'delete',
        GET: 'get',
        PATCH: 'patch',
        POST: 'post',
        PUT: 'put'
    };

    /**
     * Common HTTP status codes
     *
     * @type {object}
     */
    var httpStatus = {

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
         * Indicates multiple options for the resource that the client may follow
         * @type {number}
         */
        MULTIPLE_CHOICES: 300,

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

    // API prefix e.g. api/
    var _prefix = '';

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
        window.NProgress.configure({
            minimum: 0.1,
            showSpinner: false
        });

        // When an ajax request is started
        $_document.ajaxStart(function ajaxStart() {
            window.NProgress.start();
        });

        // When an ajax request has stopped
        $_document.ajaxStop(function ajaxStop() {
            window.NProgress.done();
        });
    }

    /**
     * Check the response status was a SUCCESS
     *
     * @param {object} response Response object returned by fetch()
     * @return {object} The response initially passed; otherwise, throws an error
     */
    function _fetchCheckStatus(response) {
        if (response.status >= httpStatus.OK && response.status < httpStatus.MULTIPLE_CHOICES) {
            return response;
        } else {
            var error = new window.Error(response.statusText);
            error.response = response;
            throw error;
        }
    }

    /**
     * Parse JSON in the response object
     * @param {object} response Response object returned by fetch()
     * @return {object|null} JSON object; otherwise, original response
     */
    function _fetchParseJSON(response) {
        var json = response.json();
        return json ? json : response;
    }

    /**
     * Simple wrapper
     *
     * @param {string} url Url to parse
     * @param {object} method methods.* option e.g. methods.GET
     * @param {object} object Object to parse with the url
     * @param {object} body Body to pass to the request if methods.PUT or methods.POST is used
     * @return {object} Fetch promise object
     */
    function _fetchWrapper(url, method, object, body) {
        return new window.Promise(function promise(resolve, reject) {
            // Reject the promise if not a string
            url = parseUrl(url, object);
            url = getPrefix() + trimSlashes(url);

            if (core.isDebug()) {
                // Simulate an ajax request with a 750 millisecond delay progress bar
                window.setTimeout(function setTimeoutPromise() {
                    // This will fail once in a while, due to 0 - 1000
                    if (core.randomNumber(0, 1000) === 0) {
                        reject();
                    } else {
                        resolve();
                    }
                }, FETCH_TIME);
            } else {
                // Lets use GitHub's fetch instead
                var init = {
                    method: method,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                };

                var isBody = method === methods.PUT || method === methods.POST;
                if (isBody) {
                    // Use the body with the fetch()
                    window.console.log('fetch() body...', body);
                    init.body = window.JSON.stringify(body);
                }

                window.console.log('fetch() in progress...', url, init);

                // Start fetching the resource
                window.fetch(url, init)
                    .then(_fetchCheckStatus)
                    .then(_fetchParseJSON)
                    .then(function thenFetch(data) {
                        resolve(data);
                    })
                    .catch(function catchFetch() {
                        reject();
                    });
            }
        });
    }

    /**
     * Simulate an ajax request by displaying a progress bar
     *
     * @return {undefined}
     */
    function fetch() {
        // Simulate an ajax request with a delayed progress bar
        window.NProgress.start();
        window.setTimeout(window.NProgress.done, FETCH_TIME);
    }

    /**
     * Ajax DELETE request
     *
     * @param {string} url Url to DELETE
     * @param {object} object Key/value pair to overwrite parts of the url. See parseUrl()
     * @return {object} Promise object
     */
    function del(url, object) {
        return new window.Promise(function promise(resolve, reject) {
            // Start the progress bar
            window.NProgress.start();

            // Create a fetch request
            _fetchWrapper(url, methods.DELETE, object)
                .then(function thenFetch(response) {
                    window.NProgress.done();
                    resolve(response);
                })
                .catch(function catchFetch(exception) {
                    window.NProgress.done();
                    reject(exception);
                });
        });
    }

    /**
     * Ajax GET request
     *
     * @param {string} url Url to GET
     * @param {object} object Key/value pair to overwrite parts of the url. See parseUrl()
     * @return {object} Promise object
     */
    function get(url, object) {
        return new window.Promise(function promise(resolve, reject) {
            // Start the progress bar
            window.NProgress.start();

            // Create a fetch request
            _fetchWrapper(url, methods.GET, object)
                .then(function thenFetch(response) {
                    window.NProgress.done();
                    resolve(response);
                })
                .catch(function catchFetch(exception) {
                    window.NProgress.done();
                    reject(exception);
                });
        });
    }

    /**
     * Ajax PUT request
     *
     * @param {string} url Url to PUT
     * @param {object} object Key/value pair to overwrite parts of the url. See parseUrl()
     * @param {object} object JSON to pass to the request
     * @return {object} Promise object
     */
    function put(url, object, body) {
        return new window.Promise(function promise(resolve, reject) {
            // Start the progress bar
            window.NProgress.start();

            // Create a fetch request
            _fetchWrapper(url, methods.PUT, object, body)
                .then(function thenFetch(response) {
                    window.NProgress.done();
                    resolve(response);
                })
                .catch(function catchFetch(exception) {
                    window.NProgress.done();
                    reject(exception);
                });
        });
    }

    /**
     * Ajax POST request
     *
     * @param {string} url Url to POST
     * @param {object} object Key/value pair to overwrite parts of the url. See parseUrl()
     * @param {object} object JSON to pass to the request
     * @return {object} Promise object
     */
    function post(url, object, body) {
        return new window.Promise(function promise(resolve, reject) {
            // Start the progress bar
            window.NProgress.start();

            // Create a fetch request
            _fetchWrapper(url, methods.POST, object, body)
                .then(function thenFetch(response) {
                    window.NProgress.done();
                    resolve(response);
                })
                .catch(function catchFetch(exception) {
                    window.NProgress.done();
                    reject(exception);
                });
        });
    }

    /**
     * Parse a url by replacing segment such as {item}, with the
     *
     * @param {string} url Url string to parse
     * @param {object} object Object literal with one level only. The keys should match the segments in the url
     * @return {string|null} Parsed string; otherwise, null
     */
    function parseUrl(url, object) {
        // Check if the url is a string and the object parameter is an object literal
        if (!core.isString(url) || !core.isObjectLiteral(object)) {
            return url;
        }

        // Clone the url, so the replaced values, if they contain {}, don't interfere with matching
        var urlReplace = core.toString(url);

        // Regular expression to parse items between {} e.g. {username}
        var reParseURLParts = /{([^\}]+)}/g;
        while (true) {
            // Get the matches and check if any were found
            var match = reParseURLParts.exec(urlReplace);
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

        return url;
    }

    /**
     * Get the API prefix
     *
     * @return {string} Stored API prefix
     */
    function getPrefix() {
        return _prefix;
    }

    /**
     * Set the API prefix
     *
     * @param {string} prefix API string prefix
     * @return {undefined}
     */
    function setPrefix(prefix) {
        if (!core.isString(prefix) || prefix.trim().length === 0) {
            return;
        }

        _prefix = trimSlashes(prefix) + '/';
    }

    /**
     * Trim forward slashes at the start and end of a string
     *
     * @param {string} value Value to trim
     * @return {string} Trimmed string; otherwise, empty string
     */
    function trimSlashes(value) {
        if (!core.isString(value)) {
            return '';
        }

        return core.trim(value, '/');
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
        Methods: methods,
        HTTPStatus: httpStatus,
        fetch: fetch,
        delete: del,
        get: get,
        put: put,
        post: post,
        parseUrl: parseUrl,
        getPrefix: getPrefix,
        setPrefix: setPrefix,
        trimSlashes: trimSlashes
    };
})(this, this.document, this.jQuery, App.core);
