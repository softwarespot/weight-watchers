// Create an 'App' namespace
var App = {};

/**
 * Core module
 *
 * Modified: 2015/11/21
 * @author softwarespot
 */
App.core = (function coreModule(window, document, $, undefined) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Application name
    var APP_NAME = 'SoftwareSpot';

    // Unique global identifier. Internal usage only
    // var GUID = 'A76C1BF8-7F80-4D96-B627-CEA9E1BFBED6';

    // Value of indexOf when a value isn't found
    var NOT_FOUND = 1;

    // Store an empty string
    var STRING_EMPTY = '';

    // Fields

    // Store if the module has been initialised
    var _isInitialised = false;

    // Native functions
    var _nativeArrayIsArray = window.Array.isArray;
    var _nativeMathFloor = window.Math.floor;
    var _nativeMathRandom = window.Math.random;
    var _nativeStringIncludes = window.String.prototype.includes;
    var _nativeStringTrim = window.String.prototype.trim;

    // Return strings of toString() found on the Object prototype
    // Based on the implementation by lodash inc. is* function as well
    var _objectStrings = {
        BOOLEAN: '[object Boolean]',
        FUNCTION: '[object Function]',
        GENERATOR: '[object GeneratorFunction]',
        NUMBER: '[object Number]',
        OBJECT: '[object Object]',
        STRING: '[object String]',
    };

    // Store the object prototype
    var _objectPrototype = window.Object.prototype;

    // Store the hasOwnProperty method
    var _objectHasOwnProperty = _objectPrototype.hasOwnProperty;

    // Store the toString method
    var _objectToString = _objectPrototype.toString;

    // Regular expressions

    // Float values
    var _reFloat = /(?:^-?(?!0+)\d+\.\d+$)/;

    // Integer values
    var _reInteger = /(?:^-?(?!0+)\d+$)/;

    // Regular expression meta characters
    var _reRegExpEscape = /([\].|*?+(){}^$\\:=[])/g;

    // Parse items between {} that are of an integer value
    var _reStringFormat = /(?:{(\d+)})/g;

    // Strip leading whitespace
    var _reTrimLeft = /^[\s\uFEFF\xA0]+/;

    // Strip trailing whitespace
    var _reTrimRight = /[\s\uFEFF\xA0]+$/;

    // Strip leading and trailing whitespace
    // Idea by MDN, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
    var _reTrim = new window.RegExp(_reTrimLeft.source + '|' + _reTrimRight.source, 'g');

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
        window.NProgress.configure({
            minimum: 0.1,
            showSpinner: false,
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
     *
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
        if (!isArray(array) || array.length === 0) {
            return;
        }

        // Pop all items on the array until empty
        while (array.length > 0) {
            array.pop();
        }
    }

    /**
     * Peek at the last item in the array
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
     * @return {boolean} True, the property exists; otherwise, false
     */
    function has(object, property) {
        return _objectHasOwnProperty.call(object, property);
    }

    /**
     * Check if a variable is a function datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a function datatype; otherwise, false
     */
    function isFunction(value) {
        var tag = isObject(value) ? _objectToString.call(value) : null;
        return tag === _objectStrings.FUNCTION || tag === _objectStrings.GENERATOR;
    }

    /**
     * Check if a variable is an array datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is an array datatype; otherwise, false
     */
    var isArray = isFunction(_nativeArrayIsArray) ? _nativeArrayIsArray : function isArray(value) {
        return _objectToString.call(value) === _objectStrings.ARRAY;
    };

    /**
     * Check if a variable is a boolean datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a boolean datatype; otherwise, false
     */
    function isBoolean(value) {
        return value === true || value === false || _objectToString.call(value) === _objectStrings.BOOLEAN;
    }

    /**
     * Check if a variable is empty
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is empty; otherwise, false
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
     * @returns {boolean} True, the value is a float; otherwise, false
     */
    function isFloat(value) {
        return isNumber(value) && _reFloat.test(toString(value));
    }

    /**
     * Check if a variable is an integer datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is an integer; otherwise, false
     */
    function isInteger(value) {
        return isNumber(value) && _reInteger.test(toString(value));
    }

    /**
     * Check if a variable is an instance of jQuery
     *
     * @param {mixed} $element Element to check
     * @return {boolean} True is an instance of jQuery; otherwise, false
     */
    function isjQuery($element) {
        return $element instanceof $;
    }

    /**
     * Check if a variable is an instance of jQuery and contains at least one element node
     *
     * @param {mixed} $element Element to check
     * @return {boolean} True is an instance of jQuery and contains at least one element node; otherwise, false
     */
    function isjQueryNotEmpty($element) {
        return isjQuery($element) && $element.length > 0;
    }

    /**
     * Check if a variable is not null
     *
     * @param {mixed} value Value to check
     * @return {boolean} True, the value is not null; otherwise, false
     */
    function isNotNull(value) {
        return !isNull(value);
    }

    /**
     * Check if a variable is null
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is null; otherwise, false
     */
    function isNull(value) {
        return value === null;
    }

    /**
     * Check if a variable is null or undefined
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is null or undefined; otherwise, false
     */
    function isNullOrUndefined(value) {
        return isNull(value) || isUndefined(value);
    }

    /**
     * Check if a variable is a number datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a number datatype; otherwise, false
     */
    function isNumber(value) {
        return typeof value === 'number' || _objectToString.call(value) === _objectStrings.NUMBER;
    }

    /**
     * Check if a variable is an object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is an object; otherwise, false
     */
    function isObject(value) {
        // Store the typeof value
        var type = typeof value;

        // !!value is basically checking if value is not 'truthy' e.g. null or zero and then inverts that boolean value
        // So, !'Some test' is false and then inverting false is true. There if value contains 'something', continue
        return !!value && (type === 'object' || type === 'function');
    }

    /**
     * Check if a variable is an object literal
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is an object literal; otherwise, false
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
     * @param {string} value Value to check
     * @returns {boolean} True, the value is a string datatype; otherwise, false
     */
    function isString(value) {
        return typeof value === 'string' || _objectToString.call(value) === _objectStrings.STRING;
    }

    /**
     * Check if a variable is a string and representing a float
     *
     * @param {string} value Value to check
     * @returns {boolean} True, the value is representing a float; otherwise, false
     */
    function isStringFloat(value) {
        return isString(value) && _reFloat.test(value);
    }

    /**
     * Check if a variable is a string and representing an integer
     *
     * @param {string} value Value to check
     * @returns {boolean} True, the value is representing an integer; otherwise, false
     */
    function isStringInteger(value) {
        return isString(value) && _reInteger.test(value);
    }

    /**
     * Check if a variable is a string and representing a number
     *
     * @param {string} value Value to check
     * @returns {boolean} True, the value is representing a number; otherwise, false
     */
    function isStringNumber(value) {
        return isString(value) && (_reFloat.test(value) || _reInteger.test(value));
    }

    /**
     * Check if a variable is undefined
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is undefined; otherwise, false
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
        return _nativeMathFloor((_nativeMathRandom() * max) + min);
    }

    /**
     * Escape RegExp characters with a prefixed backslash
     *
     * @param {string} value String value to escape
     * @return {string} Escaped string; otherwise, an empty string
     */
    function regExpEscape(value) {
        if (!isString(value) || value.length === 0) {
            return STRING_EMPTY;
        }

        // Escape RegExp special characters only
        // $& => Last match, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastMatch
        return value.replace(_reRegExpEscape, '\\$&');
    }

    /**
     * Check if a string contains another string
     *
     * @param {string} value String value to search in
     * @param {string} searchFor Value to search for
     * @return {boolean} True, the string is found; otherwise, false
     */
    function stringContains(value, searchFor) {
        if (!isString(value)) {
            return false;
        }

        return isFunction(_nativeStringIncludes) ?
            _nativeStringIncludes.call(value, searchFor) :
            value.indexOf(searchFor) !== NOT_FOUND;
    }

    /**
     * String format. Similar to the C# implementation
     * Idea from StackOverflow, URL: http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format. User: @Filipiz
     *
     * @param {string} value String value to format
     * @param {arguments} arguments Arguments to replace the string identifiers with e.g. stringFormat('Some string like {0}', 'this')
     * @return {string} Formatted string, with {n} identifiers replaced with the passed arguments; otherwise, an empty string on error
     */
    function stringFormat(value) {
        if (!isString(value)) {
            return STRING_EMPTY;
        }

        if (value.length === 0) {
            return value;
        }

        // Create a temporary arguments array, skipping the first element, as this contains the string value
        var args = [];
        for (var i = 1, length = arguments.length; i < length; i++) {
            args.push(arguments[i]);
        }

        return value.replace(_reStringFormat, function stringFormatKeys(fullMatch, index) {
            // Coerce as a number and get the value at the index position in the arguments array
            index = +index;
            var value = args[index];

            return isUndefined(value) ? fullMatch : value;
        });
    }

    /**
     * Strip leading and trailing whitespace
     *
     * @param {string} value String value to strip
     * @return {string} New string with stripped leading and trailing whitespace; otherwise, an empty string
     */
    function stringStripWS(value) {
        if (!isString(value)) {
            return STRING_EMPTY;
        }

        return isFunction(_nativeStringTrim) ?
            _nativeStringTrim.call(value) :
            value.replace(_reTrim, STRING_EMPTY);
    }

    /**
     * Coerce a value to a string. Null or undefined are coerced as an empty string
     *
     * @param {mixed} value Value to convert
     * @return {string} New string value
     */
    function toString(value) {
        if (isString(value)) {
            // Return the original value
            return value;
        }

        return isNullOrUndefined(value) || isObjectLiteral(value) ? STRING_EMPTY : (STRING_EMPTY + value);
    }

    /**
     * Trim characters from the left-hand and right-hand side of a string.
     * Idea by underscore.string, URL: https://github.com/epeli/underscore.string
     *
     * @param {string} value String value to trim
     * @param {string} characters Character set to trim. If null or undefined, then the native String.prototype.trim will be used instead
     * @return {string} Trimmed string; otherwise, an empty string on error
     */
    function trim(value, characters) {
        if (!isString(value)) {
            return STRING_EMPTY;
        }

        if (value.length === 0) {
            return value;
        }

        // If null or undefined, then use the native trim
        if (isNullOrUndefined(characters)) {
            return stringStripWS(value);
        }

        // Coerce as a string and escape the meta regular expression characters
        characters = '[' + regExpEscape(toString(characters)) + ']';

        return value.replace(new window.RegExp('^' + characters + '+|' + characters + '+$', 'g'), STRING_EMPTY);
    }

    /**
     * Check if a variable is an object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is an object; otherwise, false
     */
    function _isObjectLike(value) {
        return _objectToString.call(value) === _objectStrings.OBJECT;

        // return !!value && typeof value === 'object';
    }

    // Invoked when the DOM has loaded
    $(function coreReady() {
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
        regExpEscape: regExpEscape,
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
        stringContains: stringContains,
        stringFormat: stringFormat,
        stringStripWS: stringStripWS,
        toString: toString,
        trim: trim,
    };
})(window, window.document, window.jQuery);
