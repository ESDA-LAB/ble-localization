const config = require('config');
const unirest = require('unirest');

const queryManagerApiBaseUrl = config.get('adapters.query.url') + config.get('adapters.query.version');
const OBJECT_POSITIONS_ENDPOINT = '/locations/{locationId}/objects';
const OBJECT_AMBIENT_ENDPOINT = '/locations/{locationId}/ambient';
const METRICS_ENDPOINT = '/metrics/{type}/{id}/';

const AVAILABLE_METRICS = ['cpu','disk','memory','network']
const DEVICE_TYPES_MAP = {
    'device' : 'devices',
    'gateway' : 'gateways'
}

const authHeader = ( config.has('adapters.query.credentials.username') && config.has('adapters.query.credentials.password') )
    ? `Basic ${Buffer.from(`${config.get('adapters.query.credentials.username')}:${config.get('adapters.query.credentials.password')}`).toString('base64')}`
    : '';

const AMBIENT_QUERY_API_HEADERS = {
    'Accept': 'application/json',
    'Content-Type':'application/json',
    'Authorization': authHeader
};


module.exports = {

    /**
     * Get Object Positions
     */
    getObjectPositions: function(locationId){
        return new Promise((resolve, reject) => {
            let objectUrl = OBJECT_POSITIONS_ENDPOINT.replace("{locationId}", locationId);
            unirest('POST', queryManagerApiBaseUrl + objectUrl)
            .headers(AMBIENT_QUERY_API_HEADERS)
            .send({
                'from': new Date(),
                'until': new Date()
            })
            .end(function (res) {
                if (res.error) {
                    reject(new Error(res.error));
                    return;
                }
                resolve(res.body)
            });
        });
    },

    getAmbient: function(locationId){
        return new Promise((resolve, reject) => {
            let ambientUrl = OBJECT_AMBIENT_ENDPOINT.replace("{locationId}", locationId);
            unirest('POST', queryManagerApiBaseUrl + ambientUrl)
                .headers(AMBIENT_QUERY_API_HEADERS)
                .send({
                    'from': new Date(),
                    'until': new Date()
                })
                .end(function (res) {
                    if (res.error) {
                        reject(new Error(res.error));
                        return;
                    }
                    resolve(res.body)
                });
        });
    },

    getMetrics: function(parameters){
        return new Promise((resolve, reject) => {
            if( parameters['metricType'] === undefined || !AVAILABLE_METRICS.includes(parameters['metricType']) ){
                reject('NOT_VALID_METRIC')
                return;
            }
            let metricsUrl = METRICS_ENDPOINT.replace("{type}", DEVICE_TYPES_MAP[parameters['deviceType']]).replace("{id}", parameters['deviceId']);
            unirest('GET', queryManagerApiBaseUrl + metricsUrl + parameters['metricType'])
                .headers(AMBIENT_QUERY_API_HEADERS)
                .end(function (res) {
                    if (res.error) {
                        console.error("An error occured: " + res.error);
                        reject(res.error);
                        return;
                    }
                    resolve(res.body);
                });
        });
    }

}
