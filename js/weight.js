/* global App, moment, NProgress */

/**
 * Weight module
 *
 * Modified: 2015/10/03
 * @author softwarespot
 */
App.weight = (function (window, document, $, core, undefined) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    var GUID = '772C021E-61EA-4B15-8330-B2274E891371';

    // Fields

    // Store if the module has been initialised
    var _isInitialised = false;

    // Has the events been binded
    var _isEventsBound = false;

    // Store the weights submitted to the back-end API. Testing only
    var _weightsList = [];

    // Store the id value. Testing only
    var _internalId = 0;

    // Events object
    var _events = {
        // When the current key is released event string
        keyup: 'keyup.app.weight',

        // Remove event string
        remove: 'click.remove.app.weight',

        // Reset event string
        reset: 'click.reset.app.weight',

        // Submit event string
        submit: 'submit.app.weight',

        // When the reset event is invoked, call the following function
        destroy: function ( /*event*/ ) {
            NProgress.done();

            // Hide the error message
            $_weightFormError.hide();

            // Clear the weight list session
            _session.clear();

            // Render the template
            _render(_weightsList);
        },

        // When the keyup event is invoked, call the following function
        keyRelease: function (event) {
            // Prevent default propagation
            event.preventDefault();

            // If an invalid weight value, the disable the submit button
            var weightValue = event.currentTarget.value;
            if (!isValidWeight(weightValue)) {
                // Disable the submit button
                $_weightFormSubmit.prop('disabled', true);
                $_weightFormSubmit.addClass('red');
                return;
            }

            // Enabled the submit button
            $_weightFormSubmit.prop('disabled', false);
            $_weightFormSubmit.removeClass('red');
        },

        // When the remove event is invoked, call the following function
        removal: function (event) {
            // Prevent default propagation
            event.preventDefault();

            var id = event.currentTarget.getAttribute(_dataAttributeId);
            _remove(id);

            // Save the current state of the weights list
            _session.save(_weightsList);

            // Render the template
            _render(_weightsList);
        },

        // When the submit event is invoked, call the following function
        submission: function (event) {
            // Prevent the form from submitting
            event.preventDefault();

            var form = event.currentTarget[0];
            // $form.serializeJSON():

            // Disable the submit button
            $_weightFormSubmit.prop('disabled', true);
            $_weightFormSubmit.addClass('red');

            // If an invalid weight value, the disable the submit button
            var weightValue = form.value;
            if (!isValidWeight(weightValue)) {
                // Show the error message
                $_weightFormError.show();
                return;
            }

            // Simulate an ajax request
            core.ajax();

            // Clear the input contents
            $_weightFormInput.val('');

            // Hide the error message
            $_weightFormError.hide();

            // Add the weight value
            _add(weightValue);

            // Save the current state of the weights list
            _session.save(_weightsList);

            // Render the template
            _render(_weightsList);
        }
    };

    // Session handler for the weights list
    var _session = {
        // Unique weights list session id
        key: GUID + '_app.weight_list',

        // Clear the weights list session storage item
        clear: function () {
            sessionStorage.removeItem(this.key);

            // Clear the elements in the weights array
            core.arrayClear(_weightsList);
        },

        // Get the weights list that was previously stored in the session storage
        get: function () {
            var items = sessionStorage.getItem(this.key);

            // If null then return an empty string; otherwise, parse as a JSON object literal
            return core.isNull(items) ? [] : JSON.parse(items);
        },

        // Save the weights list to the session storage
        save: function (array) {
            if (!core.isArray(array)) {
                return;
            }

            sessionStorage.setItem(this.key, JSON.stringify(array));
        }
    };

    // Store the jQuery selector object for the document
    var $_document = null;

    // Store the jQuery selector object to add the weight data to it
    var $_content = null;

    // Store the jQuery selector objects for the weight form
    var $_weightForm = null;
    var $_weightFormInput = null;
    var $_weightFormReset = null;
    var $_weightFormSubmit = null;

    var $_weightFormError = null;

    var _dataAttributeId = null;

    // Template string selectors
    var _templateWeightList = null;

    // If the value is an integer (without leading zeros) or a floating point value with a single decimal
    var _reIsValidWeight = /^(?!0+)(?:\d+(?:\.\d)?)$/;

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

        // Data attribute for the id value
        _dataAttributeId = config.data_id;

        // Store the template strings
        _templateWeightList = config.templates.weight_list;

        _cacheDom(config.dom);
        _bindEvents();

        // Disable the submit button
        $_weightFormSubmit.prop('disabled', true);
        $_weightFormSubmit.addClass('red');
        $_weightFormError.hide();

        _weightsList = _session.get();

        // If items exist in the array, then get the last element object and the id
        var peek = core.arrayPeek(_weightsList);
        if (!core.isUndefined(peek)) {
            _internalId = peek.id;
        }
        _internalId++;

        // Render the template
        _render(_weightsList);

        _isInitialised = true;
    }

    /**
     * Destroy the module
     *
     * @return {undefined}
     */
    function destroy() {
        _unbindEvents();

        $_document = null;
        $_content = null;
        $_weightForm = null;
        $_weightForm = null;
        $_weightFormReset = null;
        $_weightFormSubmit = null;

        $_weightFormError = null;

        // Clear the elements in the weights array
        core.arrayClear(_weightsList);

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
     * @param {object} dom Object literal containing strings to locate the DOM nodes
     * @return {undefined}
     */
    function _cacheDom(dom) {
        $_document = $(document);
        $_content = $(dom.weight_list);

        $_weightForm = $(dom.forms.weight);
        $_weightFormInput = $_weightForm.find('input[type="text"]');
        $_weightFormReset = $_weightForm.find('[type="reset"]');
        $_weightFormSubmit = $_weightForm.find('input[type="submit"]');

        $_weightFormError = $(dom.weight_list_error);
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

        $_document.on(_events.remove, '[' + _dataAttributeId + ']', _events.removal);
        $_weightForm.on(_events.submit, _events.submission);
        $_weightFormInput.on(_events.keyup, _events.keyRelease);
        $_weightFormReset.on(_events.reset, _events.destroy);

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

        $_document.off(_events.remove, '[' + _dataAttributeId + ']', _events.removal);
        $_weightForm.off(_events.submit, _events.submission);
        $_weightFormInput.off(_events.keyup, _events.keyRelease);
        $_weightFormReset.off(_events.reset, _events.destroy);

        _isEventsBound = false;
    }

    /**
     * Add a weight value to the internal array by creating a new object
     *
     * @param {number} value Valid weight value
     * @return {undefined}
     */
    function _add(value) {
        // If not a float then parse as a floating ppint number datatype
        if (!core.isFloat(value)) {
            value = parseFloat(value); // Important, as the database will be DECIMAL(5,1)
        }

        // Get a epoch timestamp of the current date and time i.e. now
        var nowTimeStamp = moment().unix();

        // Push the 'fake' object to the internal array
        _weightsList.push({
            id: _internalId,
            value: value,
            time: nowTimeStamp,
            username: 'User ' + _internalId,
            iso8601: moment.unix(nowTimeStamp).toISOString()
        });

        // Increase the internal id
        _internalId++;
    }

    /**
     * Remove a weight object from the internal array
     *
     * @param {number} id Id of the object to find
     * @return {undefined}
     */
    function _remove(id) {
        // If not an integer then parse as an integer number datatype
        if (!core.isInteger(id)) {
            id = parseInt(id);
        }

        // In browsers that support ES2015, for...of can be used or .find()
        for (var i = 0, length = _weightsList.length; i < length; i++) {
            var weight = _weightsList[i];

            // Remove the item from the weights list array
            if (weight.id === id) {
                _weightsList.splice(i, 1);
                break;
            }
        }
    }

    /**
     * Render the weights data
     *
     * @param {boolean} isSuccess True renders the 'done' template; otherwise, false renders the 'fail' template
     * @param {object} data Data to pass to the template
     * @return {undefined}
     */
    function _render(data) {
        $_content.handlebars('add', _templateWeightList, data, {
            remove_type: 'same',
            validate: !core.isEmpty(data)
        });
    }

    /**
     * Check if a variable is a string and representing a valid weight value i.e. 3 or 3.1
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is representing a valid weight value; otherwise, false
     */
    function isValidWeight(value) {
        if (!core.isString(value)) {
            value = '' + value;
        }

        return value.trim().length > 0 && _reIsValidWeight.test(value);
    }

    // Invoked when the DOM has loaded
    $(function () {
        init({
            data_id: 'data-weight-id',
            dom: {
                forms: {
                    weight: '#weight-post-form'
                },
                weight_list: '#weight-list',
                weight_list_error: '#weight-list-error'
            },
            templates: {
                weight_list: '#template-weight-list'
            }
        });
    });

    // Public API
    return {
        init: init,
        destroy: destroy,
        getVersion: getVersion,
        isValidWeight: isValidWeight
    };
})(this, this.document, this.jQuery, App.core);
