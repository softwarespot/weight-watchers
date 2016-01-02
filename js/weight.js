/* global App */

/**
 * Weight module
 *
 * Modified: 2016/01/03
 * @author softwarespot
 */
App.weight = (function weightModule(window, document, $, core, undefined) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    var GUID = '772C021E-61EA-4B15-8330-B2274E891371';

    // API resource URIs
    var _api = {
        USERS: 'users',
        WEIGHT_BY_ID: 'weights/{id}',
        WEIGHT_BY_USERNAME_AND_ID: 'users/{username}/weights/{id}',
        WEIGHTS_ALL: 'weights',
        WEIGHTS_BY_USERNAME: 'users/{username}/weights',
    };

    // Date format for ensuring a weight value isn't entered twice for the same day
    var DATE_FORMAT = 'YYYYMMDD';

    // Fields

    // Has the events been binded
    var _isEventsBound = false;

    // Store if the module has been initialised
    var _isInitialised = false;

    // Store the weights submitted to the back-end API. Testing only
    var _weightsList = [];

    // Store dates of the added weight values. Testing only
    var _weightsDate = new window.Set();

    // Store the next 'moment' date object. Testing only
    var _dateNext = null;

    // Store the id value. Testing only
    var _internalId = 0;

    // Store whether to display all values or unique only. Testing only
    var _isDisplayAll = false;
    var _$displayAll = null;

    // Store the selected username
    var _username = null;

    // Store the jQuery selector object for the document
    var _$document = null;

    // Store the jQuery selector object to add the weight data to it
    var _$content = null;

    // Store the jQuery selector objects for the weight form
    var _$weightForm = null;
    var _$weightFormInput = null;
    var _$weightFormReset = null;
    var _$weightFormSubmit = null;

    // Chart data selector objects
    var _$weightChart = null;
    var _chartData = null;
    var _chartLineData = null;

    var _$weightFormError = null;

    // Store the data-* attribute id
    var _dataAttributeId = null;

    // Template string selectors
    var _templateWeightList = null;

    // If the value is an integer (without leading zeros) or a floating point value with a single decimal
    var _reIsValidWeight = /^(?!0+)(?:\d+(?:[.,]\d)?)$/;

    // Events object
    var _events = {
        // When the display all checkbox is changed event string
        checked: 'change.display_all.weight.app',

        // When the current key is released event string
        keyup: 'keyup.weight.app',

        // Remove event string
        remove: 'click.remove.weight.app',

        // Reset event string
        reset: 'click.reset.weight.app',

        // Change event string
        select: core.events.USER_SELECT,

        // Submit event string
        submit: 'submit.weight.app',

        // When the display all checkbox is changed, call the following function
        displayAllFn: function displayAllFn(event) {
            var element = event.currentTarget;
            _isDisplayAll = element.checked;

            // Emit to internally called the bound callback function
            core.emitter.emit(_events.select, _username);
        },

        // When the keyup event is invoked, call the following function
        keyupFn: function keyupFn(event) {
            // Prevent default propagation
            event.preventDefault();

            // If an invalid weight value, the disable the submit button
            var weightValue = event.currentTarget.value;
            if (!isValidWeight(weightValue)) {
                // Disable the submit button
                _$weightFormSubmit.prop('disabled', true);
                return;
            }

            // Enabled the submit button
            _$weightFormSubmit.prop('disabled', false);
        },

        // When the reset event is invoked, call the following function
        resetFn: function resetFn() {
            window.NProgress.done();

            // Reset the username
            _username = null;

            // Hide the error message
            _$weightFormError.addClass('hide');

            // Clear the weight list session
            _session.clear();

            // Clear the elements in the weights array
            core.arrayClear(_get());

            // Render the template and chart
            _render(_get());
            _renderChart(_get());
        },

        // When the remove event is invoked, call the following function
        removeFn: function removeFn(event) {
            // Prevent default propagation
            event.preventDefault();

            // Get the id value based on the data-attribute
            var id = event.currentTarget.getAttribute(_dataAttributeId);

            // Simulate an ajax GET request
            core.api.delete(_api.WEIGHT_BY_USERNAME_AND_ID, {
                id: id,
                username: _getUsernameById(id),
            })

            // Done, the ajax request was successful
            .then(function thenFetch() {
                // Remove the weight value object from the weights list
                _remove(id);

                // Save the current state of the weights list
                _session.set(_get());

                // Render the template and chart
                _render(_get());
                _renderChart(_get());
            })

            // Fail, an issue occurred with the request
            .catch(function catchFetch() {
                // On error
                window.console.log('Some error occurred with DELETE\'in the weight value');
            });
        },

        // When the user selection is changed
        selectFn: function selectFn(username) {
            username = core.isUndefined(username) ? _username : username;
            if (core.isEmpty(username)) {
                return;
            }

            _username = username;

            // Simulate an ajax GET request
            core.api.get(_api.WEIGHTS_BY_USERNAME, {
                username: _username,
            })

            // Done, the ajax request was successful
            .then(function thenFetch(weights) {
                // Clear the previous session
                _session.clear();

                // Update the internal id (for testing only)
                _weightInit();

                if (core.isDebug()) {
                    var length = core.randomNumber(5, 20);

                    // Check if the next date is a 'moment' object and set to a random date before today
                    if (!window.moment.isMoment(_dateNext)) {
                        _dateNext = window.moment().subtract(length + core.randomNumber(5, 200), 'days');
                    }

                    for (var i = 0; i < length; i++) {
                        // Generate and automatically add
                        _add(_generate(core.randomNumber(45, 200) * 1.0)); // Cast as a floating point value
                    }

                    // Clear the next date as the current date will be used from now on
                    _dateNext = null;
                } else {
                    weights.forEach(function forEachWeights(weight) {
                        _add(weight);
                    });
                }

                // Sort weight value objects
                _sort();

                // Save the current state of the weights list
                _session.set(_get());

                // Update the internal id (for testing only) and render the weights list
                _weightInit();

                // Render the template and chart
                _render(_get());
                _renderChart(_get());
            })

            // Fail, an issue occurred with the request
            .catch(function catchFetch() {
                // On error

                _events.resetFn();
            });
        },

        // When the submit event is invoked, call the following function
        submitFn: function submitFn(event) {
            // Prevent the form from submitting
            event.preventDefault();

            var form = event.currentTarget[0];

            // $form.serializeJSON():

            // Disable the submit button
            _$weightFormSubmit.prop('disabled', true);

            // If an invalid weight value, the disable the submit button
            var weightValue = form.value;
            if (!isValidWeight(weightValue)) {
                // Show the error message
                _$weightFormError.removeClass('hide');
                return;
            }

            // Clear the input contents
            _$weightFormInput.val('');

            // Hide the error message
            _$weightFormError.addClass('hide');

            // Sanitize the weight value
            weightValue = _sanitize(weightValue);

            // Simulate an ajax POST request
            core.api.post(_api.WEIGHTS_BY_USERNAME, {
                username: _username,
            }, {
                id: 0,
                value: weightValue,
                time: 0,
                username: _username,
            })

            // Done, the ajax request was successful
            .then(function thenFetch() {
                if (core.isDebug()) {
                    // Generate a weight value object
                    var weight = _generate(weightValue);

                    // Add the weight value object
                    if (_add(weight)) {
                        // Sort weight value objects
                        _sort();

                        // Save the current state of the weights list
                        _session.set(_get());

                        // Render the template and chart
                        _render(_get());
                        _renderChart(_get());
                    }
                } else {
                    _events.selectFn();
                }
            })

            // Fail, an issue occurred with the request
            .catch(function catchFetch() {
                // On error
                window.console.log('Some error occurred with POST\'in the weight value');
            });
        },
    };

    // Generic session handler
    var _sessionHandler = new core.session(GUID + '_weight_list.app');

    // Session handler for the weights list
    var _session = {
        // Clear the session storage item
        clear: function clear() {
            _sessionHandler.clear();
        },

        // Check if the sessionStorage API exists
        has: function has() {
            return _sessionHandler.has();
        },

        // Clear the session storage item
        remove: this.clear,

        // Get the data that was previously stored in the session storage
        get: function get() {
            var items = _sessionHandler.get();

            // If null then return an empty string; otherwise, parse as a JSON object literal
            return core.isEmpty(items) ? [] : window.JSON.parse(items);
        },

        // Set the data to the session storage
        set: function set(array) {
            if (!core.isArray(array)) {
                return;
            }

            _sessionHandler.set(window.JSON.stringify(array));
        },
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

        // Data attribute for the id value
        _dataAttributeId = config.dataId;

        // Store the template strings
        _templateWeightList = config.templates.weightList;

        _cacheDom(config.dom);
        _bindEvents();

        // Disable the submit button
        _$weightFormSubmit.prop('disabled', true);
        _$weightFormError.addClass('hide');

        // Set the API prefix
        core.api.setPrefix('api');

        // Hide the chart by default
        _renderChart();

        _isInitialised = true;
    }

    /**
     * Destroy the module
     *
     * @return {undefined}
     */
    function destroy() {
        _unbindEvents();

        _$document = null;
        _$content = null;
        _$displayAll = null;

        _$weightForm = null;
        _$weightFormInput = null;
        _$weightFormReset = null;
        _$weightFormSubmit = null;
        _$weightFormError = null;

        _$weightChart = null;

        // Clear the elements in the weights array
        core.arrayClear(_get());

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
        var $html = $(dom.html);

        _$content = $html.find(dom.weightList);

        _$displayAll = $html.find(dom.displayAll);

        _$weightForm = $html.find(dom.forms.weight);
        _$weightFormInput = _$weightForm.find('input[type="text"]');
        _$weightFormReset = _$weightForm.find('[type="reset"]');
        _$weightFormSubmit = _$weightForm.find('input[type="submit"]');
        _$weightFormError = $html.find(dom.weightListError);

        _$weightChart = $html.find(dom.weightChart);

        _$document = $(document);
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

        core.emitter.on(_events.select, _events.selectFn);
        _$document.on(_events.remove, '[' + _dataAttributeId + ']', _events.removeFn);
        _$displayAll.on(_events.checked, _events.displayAllFn);

        _$weightForm.on(_events.submit, _events.submitFn);
        _$weightFormInput.on(_events.keyup, _events.keyupFn);
        _$weightFormReset.on(_events.reset, _events.resetFn);

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

        core.emitter.off(_events.select, _events.selectFn);
        _$document.off(_events.remove, '[' + _dataAttributeId + ']', _events.removeFn);
        _$displayAll.off(_events.checked, _events.displayAllFn);

        _$weightForm.off(_events.submit, _events.submitFn);
        _$weightFormInput.off(_events.keyup, _events.keyupFn);
        _$weightFormReset.off(_events.reset, _events.resetFn);

        _isEventsBound = false;
    }

    /**
     * Check if a variable is a string and representing a valid weight value i.e. 3 or 3.1
     *
     * @param {mixed} value Value to check
     * @returns {boolean} True the value is representing a valid weight value; otherwise, false
     */
    function isValidWeight(value) {
        // Coerce as a string
        value = core.toString(value);

        return !core.isEmpty(value) && _reIsValidWeight.test(value);
    }

    /**
     * Add a weight value object to the internal array
     *
     * @param {object} weight Valid weight value object
     * @return {boolean} True it was added; otherwise, false
     */
    function _add(weight) {
        if (core.isNull(weight)) {
            return false;
        }

        var moment = window.moment(weight.time);

        // Check if the weight object value has not already been set by formatting the 'moment' date object
        // to YYYYMMDD and storing in a set collection
        var date = moment.format(DATE_FORMAT);
        if (!_isDisplayAll && _weightsDate.has(date)) {
            return false;
        }

        // Add missing properties

        // Create a 'moment' date object
        weight.moment = moment;

        // Create an ISO-8601 format of the timestamp
        weight.iso8601 = weight.moment.toISOString();

        // Add the date to the internal set
        _weightsDate.add(date);

        // Push the object to the internal array
        _weightsList.push(weight);

        return true;
    }

    /**
     * Generate a 'fake' weight value object
     *
     * @param {number} value Valid weight value
     * @return {object|null} Weight value object; otherwise, null on error
     */
    function _generate(value) {
        // If not a float then parse as a floating point number datatype
        if (!core.isFloat(value)) {
            // Important, as the database will be DECIMAL(5,1)
            value = window.parseFloat(value);
        }

        // If the weight is zero, which is totally wrong, then return null
        if (value === 0) {
            return null;
        }

        // Get an epoch timestamp of the current date and time i.e. now
        var nowTimeStamp = 0;
        if (window.moment.isMoment(_dateNext)) {
            nowTimeStamp = _dateNext.valueOf();

            // Add one day to the next date 'moment' object
            _dateNext = _dateNext.add(1, 'days');
        } else {
            nowTimeStamp = window.moment().valueOf();
        }

        // Return a weight value object
        return {
            id: _internalId++,
            value: value,
            time: nowTimeStamp,
            username: _username,
        };
    }

    /**
     * Get the weight list or a weight value object
     *
     * @param {number} index Optional index. If invalid i.e. undefined, then the weight list array is returned
     * @return {array|object} Weight list array or individual weight value object
     */
    function _get(index) {
        if (!core.isInteger(index) || index < 0 || index >= _weightsList.length) {
            return _weightsList;
        }

        var weight = _weightsList[index];

        return core.isUndefined(weight) ? _weightsList : weight;
    }

    /**
     * Get the username of a weight value object based on the id
     *
     * @param {number} id Id of the weight value object to find
     * @return {string|null} Username of the weight value object; otherwise, null
     */
    function _getUsernameById(id) {
        // If not an integer then parse as an integer number datatype
        if (!core.isInteger(id)) {
            id = window.parseInt(id);
        }

        if (id === 0) {
            return null;
        }

        // In browsers that support ES2015, for...of can be used or even .find()
        for (var i = 0, length = _weightsList.length; i < length; i++) {
            var weight = _weightsList[i];

            // If the id matches, then return the username
            if (weight.id === id) {
                return weight.username;
            }
        }

        return null;
    }

    /**
     * Remove a weight value object from the internal array
     *
     * @param {number} id Id of the weight value object to find
     * @return {undefined}
     */
    function _remove(id) {
        // If not an integer then parse as an integer number datatype
        if (!core.isInteger(id)) {
            id = window.parseInt(id);
        }

        if (id === 0) {
            return;
        }

        // In browsers that support ES2015, for...of can be used or even .find()
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
     * Sort the weight values internal array by date
     *
     * @return {undefined}
     */
    function _sort() {
        if (!core.isArray(_weightsList) || _weightsList.length === 0) {
            return;
        }

        _weightsList.sort(function sort(weight1, weight2) {
            if (weight1.time < weight2.time) {
                return -1;
            }

            if (weight1.time > weight2.time) {
                return 1;
            }

            return 0;
        });
    }

    /**
     * Render the weights data
     *
     * @param {object} weight Data to pass to the template
     * @return {undefined}
     */
    function _render(weight) {
        _$content.handlebars('add', _templateWeightList, weight, {
            removeType: 'same',
            validate: !core.isEmpty(weight),
        });
    }

    /**
     * Render the weights chart
     *
     * @param {object} weight Data to pass to the chart
     * @return {undefined}
     */
    function _renderChart(weights) {
        // Hide the chart if no weight data was available
        if (!core.isArray(weights) || weights.length === 0) {
            _$weightChart.hide();
            return;
        }

        // Display the chart
        _$weightChart.show();

        if (core.isNull(_chartData)) {
            _chartData = new window.Chart(_$weightChart.get(0).getContext('2d'));
        } else {
            _chartLineData.destroy();
        }

        var LABEL_DATE_FORMAT = 'YYYY/MM/DD';

        var labels = new window.Set();
        var values = [];

        weights.forEach(function forEachWeights(weight) {
            var yearMonth = window.moment(weight.moment).format(LABEL_DATE_FORMAT);
            if (!labels.has(yearMonth)) {
                labels.add(yearMonth);
                values.push(weight.value);
            }
        });

        var data = {
            labels: window.Array.from(labels),
            datasets: [{
                label: 'Weight values',
                fillColor: 'rgba(220,220,220,0.2)',
                strokeColor: 'rgba(220,220,220,1)',
                pointColor: 'rgba(220,220,220,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(220,220,220,1)',
                data: values,
            },],
        };

        _chartLineData = _chartData.Line(data);
    }

    /**
     * Sanitize the weight value
     *
     * @param {string} value Weight value to sanitize e.g. 1, 1,0 or 1.0
     * @return {string} Sanitized weight value; otherwise, original string
     */
    function _sanitize(value) {
        return core.stringContains(value, ',') ? value.replace(',', '.') : value;
    }

    /**
     * Initialise the weights list
     *
     * @return {undefined}
     */
    function _weightInit() {
        _weightsList = _session.get();
        _weightsDate.clear();

        // If items exist in the array, then get the last element object and the id
        var peek = core.arrayPeek(_weightsList);
        if (!core.isUndefined(peek)) {
            _internalId = peek.id;
        }

        _internalId++;
    }

    // Invoked when the DOM has loaded
    $(function weightReady() {
        init({
            dataId: 'data-weight-id',
            dom: {
                // Required property
                html: '#weight-section',
                forms: {
                    weight: '#weight-post-form',
                },
                displayAll: '[name="display-all"]',
                weightChart: '#weight-chart',
                weightList: '#weight-list',
                weightListError: '#weight-list-error',
            },
            templates: {
                weightList: '#template-weight-list',
            },
        });
    });

    // Public API
    return {
        init: init,
        destroy: destroy,
        getVersion: getVersion,
        isValidWeight: isValidWeight,
    };
})(window, window.document, window.jQuery, window.App.core);
