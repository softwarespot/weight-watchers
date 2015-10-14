/* global NProgress */

// Create an 'App' namespace
var App = {};

/**
 * Core module
 *
 * Modified: 2015/10/10
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
        GENERATOR: '[object GeneratorFunction]',
        NUMBER: '[object Number]',
        STRING: '[object String]'
    };

    // Store the object prototype
    var _objectPrototype = Object.prototype;

    // Store the hasOwnProperty method
    var _objectHasOwnProperty = _objectPrototype.hasOwnProperty;

    // Store the toString method
    var _objectToString = _objectPrototype.toString;

    // Regular expressions
    var _regExp = {
        // Float values
        FLOAT: /(?:^-?\d+\.\d+$)/,

        // Integer values
        INTEGER: /(?:^-?\d+$)/,
    };

    // Store when the application is in debugging mode
    var _isDebug = false;

    // Methods

    /**
     * Initialise the module
     *
     * @return {undefined}
     */
    function init() {
        if (_isInitialised) {
            return;
        }

        // Disable showing the spinner in the top right hand corner
        NProgress.configure({
            minimum: 0.1,
            showSpinner: false
        });

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
     * Is the application in debugging mode
     * @return {boolean} True, the application is in debugging mode; otherwise, false
     */
    function isDebug() {
        return _isDebug;
    }

    /**
     * Set whether or not in debugging mode
     *
     * @param {boolean} value True, in debugging mode; otherwise, false. Anything else is ignored
     * @return {undefined}
     */
    function setIsDebug(value) {
        if (!isBoolean(value)) {
            return;
        }

        _isDebug = value;
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
     * Look at the last item in the array
     *
     * @param {array} array The array to peek at
     * @return {mixed|undefined} The last item pushed onto the array; otherwise, undefined
     */
    function arrayPeek(array) {
        if (!isArray(array) || array.length === 0) {
            return undefined;
        }

        return array[array.length - 1];
    }

    /**
     * Check if an object contains a key
     *
     * @param {object} object Object to check
     * @param {string} property Property to check exists in the object
     * @return {boolean} True the property exists; otherwise, false
     */
    function has(object, property) {
        return _objectHasOwnProperty.call(object, property);
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
    function _isArray(value) {
        return _objectToString.call(value) === _objectStrings.ARRAY;
    }

    /**
     * Check if a variable is a function datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is a function datatype; otherwise, false
     */
    function isFunction(value) {
        var tag = isObject(value) ? _objectToString.call(value) : '';
        return tag === _objectStrings.FUNCTION || tag === _objectStrings.GENERATOR;
    }

    /**
     * Check if a variable is an array datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is an array datatype; otherwise, false
     */
    var isArray = isFunction(Array.isArray) ? Array.isArray : _isArray;

    /**
     * Check if a variable is empty
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is empty; otherwise, false
     */
    function isEmpty(value) {
        if (isNullOrUndefined(value) || value === 0) {
            return true;
        }

        if (isArray(value) || isString(value)) {
            return value.length === 0;
        }

        for (var key in value) {
            if (has(value, key)) {
                return false;
            }
        }

        return true;
    }

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
     * Check if a variable is an object literal
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is an object literal; otherwise, false
     */
    function isObjectLiteral(value) {
        if (!_isObjectLike(value)) {
            return false;
        }

        // Based on the idea by jQuery
        if (value.constructor && !has(value.constructor.prototype, 'isPrototypeOf')) {
            return false;
        }

        return true;
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

    /**
     * Check if a string contains another string
     *
     * @param {string} value Value to search in
     * @param {string} searchFor Value to search for
     * @return {boolean} True the string is found; otherwise, false
     */
    function stringContains(value, searchFor) {
        if (!isString(value)) {
            return false;
        }

        return isFunction(String.prototype.includes) ? value.includes(searchFor) : value.indexOf(searchFor) !== -1;
    }

    // Invoked when the DOM has loaded
    $(function () {
        init();
    });

    // Public API
    return {
        init: init,
        destroy: destroy,
        getAppName: getAppName,
        getVersion: getVersion,
        isDebug: isDebug,
        setIsDebug: setIsDebug,
        arrayClear: arrayClear,
        arrayPeek: arrayPeek,
        has: has,
        isArray: isArray,
        isBoolean: isBoolean,
        isEmpty: isEmpty,
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
        isObjectLiteral: isObjectLiteral,
        isString: isString,
        isStringFloat: isStringFloat,
        isStringInteger: isStringInteger,
        isStringNumber: isStringNumber,
        isUndefined: isUndefined,
        randomNumber: randomNumber,
        stringContains: stringContains
    };
})(this, this.document, this.jQuery);
