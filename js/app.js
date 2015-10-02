// Create an 'App' namespace
var App = {};

/**
 * Core module
 *
 * Modified: 2015/10/02
 * @author softwarespot
 */
App.core = (function (window, document, $, undefined) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Application name
    var APP_NAME = 'SoftwareSpot';

    // Unique global identifier. Internal usage only
    // var GUID = 'A76C1BF8-7F80-4D96-B627-CEA9E1BFBED6';

    // Fields

    // Store if the module has been initialised
    var _isInitialised = false;

    // Return strings of toString() found on the Object prototype
    // Based on the implementation by lodash inc. is* function as well
    var _objectStrings = {
        BOOLEAN: '[object Boolean]',
        FUNCTION: '[object Function]',
        NUMBER: '[object Number]',
        STRING: '[object String]'
    };

    // Store the object prototype
    var _objectPrototype = Object.prototype;

    // Store the toString method
    var _objectToString = _objectPrototype.toString;

    // Regular expressions
    var _regExp = {
        // Float values
        FLOAT: /(?:^-?\d+\.\d+$)/,

        // Integer values
        INTEGER: /(?:^-?\d+$)/,
    };

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

        // _cacheDom();

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
     * Initialise all DOM cachable variables
     *
     * @return {undefined}
     */
    // function _cacheDom() {}

    /**
     * Get the name of the application name
     *
     * @returns {string} Application name
     */
    function getAppName() {
        return APP_NAME;
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
     * Clear the contents of an array, but maintain the same reference
     *
     * @param {array} array The array to clear
     * @return {undefined}
     */
    function arrayClear(array) {
        // If not an array then don't continue
        if (!isArray(array)) {
            return;
        }

        // Pop all items on the array until empty
        while (array.length > 0) {
            array.pop();
        }
    }

    /**
     * Check if a variable is a boolean datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a boolean datatype; otherwise, false
     */
    function isBoolean(value) {
        return value === true || value === false || (_isObjectLike(value) && _objectToString.call(value) === _objectStrings.BOOLEAN);
    }

    /**
     * Check if a variable is an array datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is an array datatype; otherwise, false
     */
    var isArray = Array.isArray;

    /**
     * Check if a variable is a float datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a float; otherwise, false
     */
    function isFloat(value) {
        // Coerce as a string
        return isNumber(value) && _regExp.FLOAT.test('' + value);
    }

    /**
     * Check if a variable is a function datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a function datatype; otherwise, false
     */
    function isFunction(value) {
        return isObject(value) && _objectToString.call(value) === _objectStrings.FUNCTION;
    }

    /**
     * Check if a variable is an integer datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is an integer; otherwise, false
     */
    function isInteger(value) {
        // Coerce as a string
        return isNumber(value) && _regExp.INTEGER.test('' + value);
    }

    /**
     * Check if a value is an instance of jQuery
     *
     * @param {mixed} $value Value to check
     * @return {boolean} true is an instance of jQuery; otherwise, false
     */
    function isjQuery($value) {
        return $value instanceof $;
    }

    /**
     * Check if a value is an instance of jQuery and contains element nodes
     *
     * @param {mixed} $value Value to check
     * @return {boolean} true is an instance of jQuery and contains element nodes; otherwise, false
     */
    function isjQueryNotEmpty($value) {
        return isjQuery($value) && $value.length !== 0;
    }

    /**
     * Check if a variable is not null
     *
     * @param {mixed} value Value to check
     * @return {boolean} True the value is not null; otherwise, false
     */
    function isNotNull(value) {
        return value !== null;
    }

    /**
     * Check if a variable is null
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is null; otherwise, false
     */
    function isNull(value) {
        return value === null;
    }

    /**
     * Check if a variable is null or undefined
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is null or undefined; otherwise, false
     */
    function isNullOrUndefined(value) {
        return isNull(value) || isUndefined(value);
    }

    /**
     * Check if a variable is a number datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a number datatype; otherwise, false
     */
    function isNumber(value) {
        return typeof value === 'number' || (_isObjectLike(value) && _objectToString.call(value) === _objectStrings.NUMBER);
    }

    /**
     * Check if a variable is an object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is an object; otherwise, false
     */
    function isObject(value) {
        // Store the typeof value
        var type = typeof value;

        // !!value is basically checking if value is not 'truthy' e.g. null or zero and then inverts that boolean value
        // So, !'Some test' is false and then inverting false is true. There if value contains 'something', continue
        return !!value && (type === 'object' || type === 'function');
    }

    /**
     * Check if a variable is an object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is an object; otherwise, false
     */
    function _isObjectLike(value) {
        return !!value && typeof value === 'object';
    }

    /**
     * Check if a variable is a string datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a string datatype; otherwise, false
     */
    function isString(value) {
        return typeof value === 'string' || _objectToString.call(value) === _objectStrings.STRING;
    }

    /**
     * Check if a variable is a string and representing a float
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is representing a float; otherwise, false
     */
    function isStringFloat(value) {
        return isString(value) && _regExp.FLOAT.test(value);
    }

    /**
     * Check if a variable is a string and representing an integer
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is representing an integer; otherwise, false
     */
    function isStringInteger(value) {
        return isString(value) && _regExp.INTEGER.test(value);
    }

    /**
     * Check if a variable is a string and representing a number
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is representing a number; otherwise, false
     */
    function isStringNumber(value) {
        return isString(value) && (_regExp.FLOAT.test(value) || _regExp.INTEGER.test(value));
    }

    /**
     * Check if a variable is undefined
     *
     * @param {object} value Value to check
     * @returns {boolean} True the value is undefined; otherwise, false
     */
    function isUndefined(value) {
        return value === undefined;
    }

    /**
     * Generate a random number
     *
     * @param {number} min Minimum value
     * @param {number} max Maximum value
     * @return {number} Returns a random number between the minimum and maximum values
     */
    function randomNumber(min, max) {
        if (!isNumber(min) || !isNumber(max)) {
            return 0;
        }

        // URL: http://www.w3schools.com/jsref/jsref_random.asp
        return Math.floor((Math.random() * max) + min);
    }

    // Invoked when the DOM has loaded
    $(function () {
        init({});
    });

    // Public API
    return {
        init: init,
        destroy: destroy,
        getAppName: getAppName,
        getVersion: getVersion,
        arrayClear: arrayClear,
        isArray: isArray,
        isBoolean: isBoolean,
        isFloat: isFloat,
        isFunction: isFunction,
        isInteger: isInteger,
        isjQuery: isjQuery,
        isjQueryNotEmpty: isjQueryNotEmpty,
        isNotNull: isNotNull,
        isNull: isNull,
        isNullOrUndefined: isNullOrUndefined,
        isNumber: isNumber,
        isObject: isObject,
        isString: isString,
        isStringFloat: isStringFloat,
        isStringInteger: isStringInteger,
        isStringNumber: isStringNumber,
        isUndefined: isUndefined,
        randomNumber: randomNumber
    };
})(this, this.document, this.jQuery);
