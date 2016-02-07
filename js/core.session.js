/* global App */

/**
 * Session module
 *
 * Modified: 2016/02/07
 * @author softwarespot
 */
App.core.session = (function sessionModule(window, core) {
    // Constants

    // SemVer version number of the module
    var VERSION = '1.0.0';

    // Unique global identifier. Internal usage only
    var GUID = '3943925F-EDCC-45E2-B451-8F0178F6BB24';

    // Fields

    // Default storage object
    var _storage = window.sessionStorage;

    // Methods

    /**
     * Create an new session instance
     *
     * @param {string} key Unique storage key
     * @param {object} storage Valid storage object; otherwise, sessionStorage is used by default
     * @return {object} A new session instance
     */
    function create(key, storage) {
        return new Session(key, storage);
    }

    /**
     * Session interface
     *
     * @param {string} key Unique storage key
     * @param {object} storage Valid storage object; otherwise, sessionStorage is used by default
     * @return {undefined}
     */
    function Session(key, storage) {
        // Check if the key is valid; otherwise, default to the module GUID
        this._key = core.isString(key) && key.length === 0 ? GUID + key : GUID;

        // Set the private storage
        this._storage = storage;

        // Check if the injected storage object is a valid storage object; otherwise, default to sessionStorage (_storage)
        this._has = _isStorage(this._storage);
        if (!this._has) {
            this._storage = _storage;
            this._has = _isStorage(this._storage);
        }
    }

    /**
     * Clear the storage data
     *
     * @return {undefined}
     */
    Session.prototype.clear = function clear() {
        // There is an issue with IE when running from the local file system
        try {
            this._storage.removeItem(this._key);
        } catch (ex) {
            window.console.log('An error occurred with Session.clear()', ex);
        }
    };

    /**
     * Get the storage data
     *
     * @return {mixed|null} Storage data; otherwise, null
     */
    Session.prototype.get = function get() {
        var items = null;

        // There is an issue with IE when running from the local file system
        try {
            items = this._storage.getItem(this._key);
        } catch (ex) {
            window.console.log('An error occurred with Session.get()', ex);
        }

        return items;
    };

    /**
     * Check if the storage is supported
     *
     * @return {boolean} True, it's supported; otherwise, false
     */
    Session.prototype.has = function has() {
        return this._has;
    };

    /**
     * See documentation above for clear()
     */
    Session.prototype.remove = Session.prototype.clear;

    /**
     * Set the storage data
     *
     * @param {mixed} data Data to add to the storage
     */
    Session.prototype.set = function set(data) {
        // There is an issue with IE when running from the local file system
        try {
            if (!core.isEmpty(data)) {
                this._storage.setItem(this._key, data);
            }
        } catch (ex) {
            window.console.log('An error occurred with Session.set()', ex);
        }
    };

    /**
     * Get the SemVer version number of the module
     *
     * @return {number} SemVer version module
     */
    Session.prototype.getVersion = function getVersion() {
        return VERSION;
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
    return {
        create: create,
    };
}(window, window.App.core));
