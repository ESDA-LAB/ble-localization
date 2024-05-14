const config = require('config');
const unirest = require('unirest');

const deviceManagersBaseUrl = config.get('adapters.devices.url') + config.get('adapters.devices.version');
const ROBOTS_ENDPOINT = '/robots';
const DEVICES_ENDPOINT = '/devices';
const GATEWAYS_ENDPOINT = '/gateways';
const LOCATIONS_ENDPOINT = '/locations';
const APPENDAGES_ENDPOINT = '/appendages';

const authHeader = ( config.has('adapters.devices.credentials.username') && config.has('adapters.devices.credentials.password') )
                    ? `Basic ${Buffer.from(`${config.get('adapters.devices.credentials.username')}:${config.get('adapters.devices.credentials.password')}`).toString('base64')}`
                    : '';

const DEVICES_API_HEADERS = {
    'Accept': 'application/json',
    'Authorization': authHeader
};

module.exports = {

    /**
     * List Available Robots.
     */
    getRobots: function(callback){

        unirest('GET', deviceManagersBaseUrl + ROBOTS_ENDPOINT)
            .headers(DEVICES_API_HEADERS)
            .end(function (res) {
                if (res.error) throw new Error(res.error);
                callback(res.body);
            });

    },

    /**
     * List Available Gateways.
     */
    getGateways: function(callback){

        unirest('GET', deviceManagersBaseUrl + GATEWAYS_ENDPOINT)
            .headers(DEVICES_API_HEADERS)
            .end(function (res) {
                if (res.error) throw new Error(res.error);
                callback(res.body);
            });

    },

    /**
     * List Available Gateways.
     */
    getGateway: function(gatewayId){

        return new Promise((resolve, reject) => {
            unirest('GET', deviceManagersBaseUrl + GATEWAYS_ENDPOINT + "/"+gatewayId)
                .headers(DEVICES_API_HEADERS)
                .end(function (res) {
                    if (res.error) {
                        console.error("An error occured: " + res.error);
                        reject(res.error);
                        return;
                    }
                    resolve(res.body);
                });
        });
    },

    /**
     * List Available Locations.
     */
    getLocations: function() {

        return new Promise((resolve, reject) => {
            unirest('GET', deviceManagersBaseUrl + LOCATIONS_ENDPOINT + '?sort=id,asc')
                .headers(DEVICES_API_HEADERS)
                .end(function (res) {
                    if (res.error){
                        console.error("An error occured: " + res.error);
                        reject(res.error);
                        return;
                    }
                    resolve(res.body.data);
                });
        });

    },

    /**
     * List Available Locations.
     */
    getLocationMap: function(locationId){
        return new Promise((resolve, reject) => {
            unirest('GET', deviceManagersBaseUrl + LOCATIONS_ENDPOINT + '/'+locationId + '/map')
                .headers(DEVICES_API_HEADERS)
                .end(function (res) {
                    if (res.error){
                        console.error("An error occured: " + res.error);
                        reject(res.error);
                        return;
                    }
                    resolve(res.body);
                });
        });
    },

    /**
     * Return specific information about a specific location.
     * @param appendageId
     * @returns {Promise<unknown>}
     */
    getLocation(locationId){

        return new Promise((resolve, reject) => {
            unirest('GET', deviceManagersBaseUrl + LOCATIONS_ENDPOINT + '/'+locationId)
                .headers(DEVICES_API_HEADERS)
                .end(function (res) {
                    if (res.error){
                        console.error("An error occured: " + res.error);
                        reject(res.error);
                        return;
                    }
                    resolve(res.body);
                });
        });

    },

    /**
     * Return information related with the appendage.
     */
    getAppendageInformation(appendageId){

        return new Promise((resolve, reject) => {
            unirest('GET', deviceManagersBaseUrl + APPENDAGES_ENDPOINT + "/" + appendageId)
                .headers(DEVICES_API_HEADERS)
                .end(function (res) {
                    if (res.error) reject(new Error(res.error));
                    resolve(res.body)
                });
        });

    },

    /**
     * List Available Devices.
     */
    getDevices: function(){

        return new Promise((resolve, reject) => {
            unirest('GET', deviceManagersBaseUrl + DEVICES_ENDPOINT)
                .headers(DEVICES_API_HEADERS)
                .end(function (res) {
                    if (res.error) {
                        console.error("An error occured: " + res.error);
                        reject(res.error);
                        return;
                    }
                    resolve(res.body);
                });
        });
    },

    /**
     * Return specific information about a specific device.
     * @param deviceId
     * @returns {Promise<unknown>}
     */
    getDevice(deviceId){

        return new Promise((resolve, reject) => {
            unirest('GET', deviceManagersBaseUrl + DEVICES_ENDPOINT + '/' + deviceId)
                .headers(DEVICES_API_HEADERS)
                .end(function (res) {
                    if (res.error){
                        console.error("An error occured: " + res.error);
                        reject(res.error);
                        return;
                    }
                    resolve(res.body);
                });
        });

    }

}
