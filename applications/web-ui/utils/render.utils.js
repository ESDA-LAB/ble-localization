/**
 * UI Rendering Utilities
 */
const config = require('config');
const _ = require('underscore');
const devicesAdapter = require('../adapters/devices.manager.adapter');

const DEFAULT_SEPARATOR = '-';
const OVERRIDES = {
    "applications-add": "Add Application",
    "scenarios-add": "Add Scenario",
    "tools-basestations-placement": "Base Stations Placement Tool"
}

/**
 * Generate the title of the page.
 * Split the "-" with space.
 * @param title
 */
function getPageTitle(title){
    if( OVERRIDES[title] !== undefined ) return OVERRIDES[title];
    return _.map(title.split(DEFAULT_SEPARATOR), function(part){
        return part.charAt(0).toUpperCase() + part.slice(1);
    }).join(" ");
}

/**
 * Generate the title of the page.
 * Split the "-" with space.
 * @param title
 */
function getWebClientPath(clientPath){
    return clientPath.split(DEFAULT_SEPARATOR).join("/");
}

module.exports = {

    /**
     * Concatenate options provided with common options and return.
     * @param location
     * @param data
     * @param plots
     * @returns {Promise<unknown>}
     */
    getRenderOptions: function(location, data = {}, plots = []){

        return new Promise((resolve, reject) => {

            devicesAdapter.getLocations().then(locations => {
                resolve(Object.assign(
                    {
                            page: getPageTitle(location)
                        },
                {
                            pageScript: '/javascripts/application/' + getWebClientPath(location) + '.webclient.js',
                            title: config.get('application.name'),
                            appVersion: config.get('application.version'),
                            copyright: config.get('application.copyright'),
                            services: ['localization', 'simulations'], //TODO From Session.
                            roles: ['user', 'admin'], //TODO From Session.
                            locations: locations
                        },
                {
                            plotScripts: _.map(plots, function (val) {
                                return '/javascripts' + val;
                            })
                        },
                        data
                    )
                );
            }).catch(err => {
                reject(err);
            });

        });
    }

}

