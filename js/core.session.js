/* global App */

/**
 * Session module
 *
 * Modified: 2015/10/28
 * @author softwarespot
 */
App.core.session = (function sessionModule(window, core) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    var GUID = '3943925F-EDCC-45E2-B451-8F0178F6BB24';

    // Default storage object
    var STORAGE = window.sessionStorage;

    // Fields

    // Methods

    /**
     * Session interface
     *
     * @param {string} key Unique storage key
     * @param {object} storage Valid storage object; otherwise, sessionStorage is used by default
     */
    function Session(key, storage) {
        // Check if the key is valid; otherwise, default to the module GUID
        this._key = !core.isString(key) || key.length === 0 ? GUID : GUID + key;

        // Check if the injected storage object is a valid storage object; otherwise, default to sessionStorage (STORAGE)
        this._has = _isStorage(storage);
        this._storage = this._has ? storage : STORAGE;
    }

    /**
     * Append functions to the Session prototype
     * @type {object}
     */
    Session.prototype = {
        /**
         * Clear the storage data
         *
         * @return {undefined}
         */
        clear: function clear() {
            // There is an issue with IE when running from the local file system
            try {
                this._storage.removeItem(this._key);
            } catch (ex) {
                window.console.log('An error occurred with Session.clear()', ex);
            }
        },

        /**
         * Get the storage data
         *
         * @return {mixed|null} Storage data; otherwise, null
         */
        get: function get() {
            var items = null;

            // There is an issue with IE when running from the local file system
            try {
                items = this._storage.getItem(this._key);
            } catch (ex) {
                window.console.log('An error occurred with Session.get()', ex);
            }

            return items;
        },

        /**
         * Check if the storage is supported
         *
         * @return {boolean} True, it's supported; otherwise, false
         */
        has: function has() {
            return this._has;
        },

        /**
         * See documentation above for clear()
         */
        remove: this.clear,

        /**
         * Set the storage data
         *
         * @param {mixed} data Data to add to the storage
         */
        set: function set(data) {
            // There is an issue with IE when running from the local file system
            try {
                this._storage.setItem(this._key, data);
            } catch (ex) {
                window.console.log('An error occurred with Session.set()', ex);
            }
        },

        /**
         * Get the SemVer version number of the module
         *
         * @return {number} SemVer version module
         */
        getVersion: function getVersion() {
            return VERSION;
        },
    };

    /**
     * Check if a valid storage object
     *
     * @param {type} storage Storage object
     * @return {boolean} storage True, is valid storage object; otherwise, false
     */
    function _isStorage(storage) {
        return core.isObject(storage) &&
            'key' in storage &&
            'getItem' in storage &&
            'setItem' in storage &&
            'removeItem' in storage &&
            'clear' in storage;
    }

    // Public API
    return Session;
})(window, window.App.core);
