/* global App */

/**
 * Base module
 *
 * Modified: YYYY/MM/DD
 * @author author
 */
App.base = {
    // Constants

    // SemVer version number of the module
    VERSION: '1.0.0',

    // Unique global identifier. Internal usage only
    GUID: '27AB85AB-3AD5-42C6-A086-30FF65668693',

    // Fields

    // Configuration
    config: {},

    // Methods

    /**
     * Initialise the module
     *
     * @param {object} config Options to configure the module
     * @return {undefined}
     */
    init: function (config) {
        // Default config that can be overwritten by passing through the config variable
        var defaultConfig = {};

        // Combine the passed config
        $.extend(defaultConfig, config);

        this._cacheDom();
    },

    /**
     * Destroy the module
     *
     * @return {undefined}
     */
    destroy: function () {},

    /**
     * Get the version number of the module
     *
     * @returns {number} Version number
     */
    getVersion: function () {
        return this.VERSION;
    },

    /**
     * Initialise all DOM cachable variables
     *
     * @return {undefined}
     */
    _cacheDom: function () {}
};
