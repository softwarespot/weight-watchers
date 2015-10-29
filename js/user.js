/* global App */

/**
 * User module
 *
 * Modified:  2015/10/28
 * @author softwarespot
 */
App.user = (function (window, document, $, core, undefined) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    var GUID = 'B33D672B-E507-478E-99D1-3B0CA10CD765';

    // API resource URIs
    var _api = {
        USERS: 'users'
    };

    // Fields

    // Has the events been binded
    var _isEventsBound = false;

    // Store if the module has been initialised
    var _isInitialised = false;

    // Store the jQuery selector object for the user list
    var _$userList = null;

    // Generate a random array of username
    var _users = ['softwarespot', 'squidge', 'brainbox'];

    // Template string selectors
    var _templateUserList = null;

    // Generic session handler
    var _sessionHandler = new core.session(GUID + '_users,app');

    // Events object
    var _events = {
        // Change event string
        select: core.events.USER_SELECT,

        // Sign in event string
        signIn: core.events.NAVIGATION_CLICK,

        // When an item from the user list is selected
        selectFn: function selectFn() {
            // Get the current value
            var username = event.currentTarget.value;
            if (core.isString(username)) {
                // Emit to all registered, that the item was selected
                core.emitter.emit(_events.select, username);
            }
        },

        // When the get users is invoked, call the following function
        usersFn: function usersFn() {
            var storage = _sessionHandler.get();

            if (!core.isNull(storage)) {
                // Render the user list
                _render({
                    usernames: window.JSON.parse(storage)
                });

                return;
            }

            // Simulate an ajax GET request
            core.api.get(_api.USERS)

            // Done, the ajax request was successful
            .then(function thenFetch(users) {
                if (core.isDebug()) {
                    users = _users;
                }

                // Store the user list
                _sessionHandler.set(window.JSON.stringify(users));

                // Render the user list
                _render({
                    usernames: users
                });
            })

            // Fail, an issue occurred with the request
            .catch(function catchFetch() {
                // On error

                // Render the user list, passing in a value that is incorrect
                _render(null);
            });
        },

        // When the sign in event is invoked, call the following function
        signInFn: function signInFn(link) {
            // If the link selected was not the sign in link, then do nothing
            if (link !== '#signin-section') {
                return;
            }

            window.console.log('Sign in was called, but nothing took place as of yet');
        }
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

        // Store the template strings
        _templateUserList = config.templates.userList;

        _cacheDom(config.dom);
        _bindEvents();

        // Set the API prefix
        core.api.setPrefix('api');

        _events.usersFn();

        _isInitialised = true;
    }

    /**
     * Destroy the module
     *
     * @return {undefined}
     */
    function destroy() {
        _unbindEvents();

        _$userList = null;

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

        core.emitter.on(_events.signIn, _events.signInFn);
        _$userList.on(_events.select, _events.selectFn);

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

        core.emitter.off(_events.signInEvent, _events.signIn);
        _$userList.off(_events.select, _events.selectFn);

        _isEventsBound = false;
    }

    /**
     * Initialise all DOM cachable variables
     *
     * @param {object} dom Object literal containing strings to locate the DOM nodes
     * @return {undefined}
     */
    function _cacheDom(dom) {
        var $html = $(dom.html);

        _$userList = $html.find(dom.userList);
    }

    /**
     * Render the weights data
     *
     * @param {boolean} isSuccess True renders the 'done' template; otherwise, false renders the 'fail' template
     * @param {object} data Data to pass to the template
     * @return {undefined}
     */
    function _render(data) {
        // Get the template as compiled only, as the jQuery-handlebars wrapper is not required
        var html = _$userList.handlebars('add', _templateUserList, data, {
            remove_type: 'same',
            type: 'COMPILED',
            validate: !core.isEmpty(data)
        });

        // Append to the user list
        _$userList.append(html);
    }

    // Invoked when the DOM has loaded
    $(function () {
        init({
            dom: {
                // Required property
                html: '#weight-post-form',
                userList: 'select[name="username"]'
            },
            templates: {
                userList: '#template-user-list'
            }
        });
    });

    // Public API
    return {
        init: init,
        destroy: destroy,
        getVersion: getVersion
    };
})(this, this.document, this.jQuery, App.core);
