// Create an 'App' namespace
var App = App || (window.Object.create ? window.Object.create(null) : {});

/**
 * Core module
 *
 * Modified: 2016/02/07
 * @author softwarespot
 */
App.core = (function coreModule(window, document, $) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Application name
    var APP_NAME = 'SoftwareSpot';

    // Unique global identifier. Internal usage only
    // var GUID = 'A76C1BF8-7F80-4D96-B627-CEA9E1BFBED6';

    // Value of indexOf when a value isn't found
    var IS_NOT_FOUND = 1;

    // Store an empty string
    var STRING_EMPTY = '';

    // Fields

    // Store if the module has been initialised
    var _isInitialised = false;

    // Native functions
    var _nativeArray = window.Array;
    var _nativeArrayIsArray = _nativeArray.isArray;

    var _nativeGlobalIsFinite = window.isFinite;

    var _nativeMath = window.Math;
    var _nativeMathAbs = _nativeMath.abs;
    var _nativeMathFloor = _nativeMath.floor;
    var _nativeMathRandom = _nativeMath.random;

    var _nativeNumber = window.Number;
    var _nativeNumberIsFinite = _nativeNumber.isFinite;
    var _nativeNumberIsNaN = _nativeNumber.isNaN;

    var _nativeObject = window.Object;
    var _nativeObjectCreate = _nativeObject.create;
    var _nativeObjectPrototype = _nativeObject.prototype;
    var _nativeObjectHasOwnProperty = _nativeObjectPrototype.hasOwnProperty;
    var _nativeObjectToString = _nativeObjectPrototype.toString;

    var _nativeRegExp = window.RegExp;

    var _nativeString = window.String;
    var _nativeStringPrototype = _nativeString.prototype;
    var _nativeStringIncludes = _nativeStringPrototype.includes;
    var _nativeStringTrim = _nativeStringPrototype.trim;

    // Return strings of toString() found on the Object prototype
    // Based on the implementation by lodash including certain is* function as well
    var _objectStringsArray = '[object Array]';
    var _objectStringsBoolean = '[object Boolean]';
    var _objectStringsFunction = '[object Function]';
    var _objectStringsGenerator = '[object GeneratorFunction]';
    var _objectStringsNumber = '[object Number]';
    var _objectStringsObject = '[object Object]';
    var _objectStringsString = '[object String]';

    // Regular expressions

    // Float values
    var _reFloat = /(?:^-?(?!0{2,})\d+\.\d+$)/;

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
    var _reTrim = new _nativeRegExp(_reTrimLeft.source + '|' + _reTrimRight.source, 'g');

    // Store when the application is in debugging mode
    var _isDebug = false;

    // Initialise the module
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
        isFinite: isFinite,
        isFloat: isFloat,
        isFunction: isFunction,
        isInteger: isInteger,
        isjQuery: isjQuery,
        isjQueryNotEmpty: isjQueryNotEmpty,
        isNaN: isNaN,
        isNil: isNil,
        isNotNull: isNotNull,
        isNull: isNull,
        isNumber: isNumber,
        isObject: isObject,
        isObjectLiteral: isObjectLiteral,
        isString: isString,
        isStringFloat: isStringFloat,
        isStringInteger: isStringInteger,
        isStringNumber: isStringNumber,
        isUndefined: isUndefined,
        objectEmpty: objectEmpty,
        randomNumber: randomNumber,
        stringContains: stringContains,
        stringFormat: stringFormat,
        toInteger: toInteger,
        toString: toString,
        trim: trim,
    };

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
        if (!isArray(array)) {
            return;
        }

        var length = array.length;
        if (length > 0) {
            array.splice(0, length);
        }
    }

    /**
     * Peek at the last item in the array
     *
     * @param {array} array The array to peek at
     * @return {mixed|null} The last item pushed onto the array; otherwise, null
     */
    function arrayPeek(array) {
        if (!isArray(array)) {
            return null;
        }

        var length = array.length;
        if (length === 0) {
            return null;
        }

        var value = array[length - 1];

        return !isNil(value) ? value : null;
    }

    /**
     * Check if an object contains a key
     *
     * @param {object} object Object to check
     * @param {string} property Property to check exists in the object
     * @return {boolean} True, the property exists; otherwise, false
     */
    function has(object, property) {
        return _nativeObjectHasOwnProperty.call(object, property);
    }

    /**
     * Check if a variable is a function datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a function datatype; otherwise, false
     */
    function isFunction(value) {
        var tag = _nativeObjectToString.call(value);
        return tag === _objectStringsFunction || tag === _objectStringsGenerator;
    }

    /**
     * Check if a variable is an array datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is an array datatype; otherwise, false
     */
    var isArray = isFunction(_nativeArrayIsArray) ? _nativeArrayIsArray : function isArray(value) {
        return _nativeObjectToString.call(value) === _objectStringsArray;
    };

    /**
     * Check if a variable is a boolean datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a boolean datatype; otherwise, false
     */
    function isBoolean(value) {
        return value === false || value === true || _nativeObjectToString.call(value) === _objectStringsBoolean;
    }

    /**
     * Check if a variable is empty
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is empty; otherwise, false
     */
    function isEmpty(value) {
        if (isNil(value) || value === 0) {
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
     * Check if a variable is finite
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is finite; otherwise, false
     */
    var isFinite = isFunction(_nativeNumberIsFinite) ? _nativeNumberIsFinite : function isFinite(value) {
        return isNumber(value) && _nativeGlobalIsFinite(value);
    };

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
     * @return {boolean} True, is an instance of jQuery; otherwise, false
     */
    function isjQuery($element) {
        return $element instanceof $;
    }

    /**
     * Check if a variable is an instance of jQuery and contains at least one element node
     *
     * @param {mixed} $element Element to check
     * @return {boolean} True, is an instance of jQuery and contains at least one element node; otherwise, false
     */
    function isjQueryNotEmpty($element) {
        return isjQuery($element) && $element.length > 0;
    }

    /**
     * Check if a variable is a NaN
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is NaN; otherwise, false
     */
    var isNaN = isFunction(_nativeNumberIsNaN) ? _nativeNumberIsNaN : function isNaN(value) {
        return isNumber(value) && value !== value; // eslint-disable-line no-self-compare
    };

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
    function isNil(value) {
        return isNull(value) || isUndefined(value);
    }

    /**
     * Check if a variable is a number datatype
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is a number datatype; otherwise, false
     */
    function isNumber(value) {
        return typeof value === 'number' || _nativeObjectToString.call(value) === _objectStringsNumber;
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
        // So, !'Some test' is false and then inverting false is true. Thus if value contains 'something', continue
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
        return value.constructor && has(value.constructor.prototype, 'isPrototypeOf');
    }

    /**
     * Check if a variable is a string datatype
     *
     * @param {string} value Value to check
     * @returns {boolean} True, the value is a string datatype; otherwise, false
     */
    function isString(value) {
        return typeof value === 'string' || _nativeObjectToString.call(value) === _objectStringsString;
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
     * Create an empty object that doesn't inherit from Object.prototype
     *
     * @return {object} An empty object that hasn't inherited properties from Object.prototype
     */
    function objectEmpty() {
        return isFunction(_nativeObjectCreate) ? _nativeObjectCreate(null) : {};
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
            value.indexOf(searchFor) !== IS_NOT_FOUND;
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

        var STARTING_VALUE = 1;
        var length = arguments.length;
        if (value.length === 0 || length <= STARTING_VALUE) {
            return value;
        }

        // Create a temporary arguments array, skipping the first element, as this contains the string value
        var args = _nativeArray(length);
        var i = STARTING_VALUE;
        var j = 0;
        while (i < length) {
            args[j++] = arguments[i++];
        }

        return value.replace(_reStringFormat, function stringFormatKeys(fullMatch, index) {
            // Coerce as a number and get the value at the index position in the arguments array
            var value = args[toInteger(index)];

            return isUndefined(value) ? fullMatch : value;
        });
    }

    /**
     * Coerce a value to an integer
     * Idea by MDN, URL: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from
     *
     * @param {mixed} value Value to convert
     * @return {number} New integer value
     */
    function toInteger(value) {
        // Convert to a number
        value = _nativeNumber(value);
        if (isNaN(value)) {
            return 0;
        }

        if (value === 0 || !isFinite(value)) {
            return value;
        }

        return (value > 0 ? 1 : -1) * _nativeMathFloor(_nativeMathAbs(value));
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

        return isNil(value) || isObjectLiteral(value) ? STRING_EMPTY : (STRING_EMPTY + value);
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
        if (!isString(value) || value.length === 0) {
            return STRING_EMPTY;
        }

        // If not a string, then use the native function
        if (!isString(characters)) {
            return _trim(value);
        }

        // Escape the meta regular expression characters
        characters = '[' + regExpEscape(characters) + ']';

        return value.replace(new _nativeRegExp('^' + characters + '+|' + characters + '+$', 'g'), STRING_EMPTY);
    }

    /**
     * Check if a variable is an object
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True, the value is an object; otherwise, false
     */
    function _isObjectLike(value) {
        return _nativeObjectToString.call(value) === _objectStringsObject;

        // return !!value && typeof value === 'object';
    }

    /**
     * Trim call around the native function or wrapper
     *
     * @param {string} value String value to trim
     * @return {string} Trimmed string
     */
    function _trim(value) {
        return isFunction(_nativeStringTrim) ?
            _nativeStringTrim.call(value) :
            value.replace(_reTrim, STRING_EMPTY);
    }
}(window, window.document, window.jQuery));
