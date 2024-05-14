$(document).ready(function(){

    let runningIntervals = [];

    /**
     * Load Gateways Information
     */
    $.ajax({
        url: "/rest/v1/devices",
        type: 'GET',
        dataType: 'json',
        success: function(res) {
            res.forEach((device) => {
                $('#edge-devices-table > tbody').append('<tr data-deviceId="'+device['id']+'">' +
                    '<td class="align-middle">'+device['id']+'</td>' +
                    '<td class="align-middle">'+device['urn']+'</td>' +
                    '<td class="align-middle">'+parseStatus(device['status'])+'</td>' +
                    '<td class="align-middle">'+parseOnlineAt(device['onlineAt'])+'</td>' +
                    '<td class="align-middle">'+getActions()+'</td>' +
                    '</tr>');
            });

            $('.preview-device').off('click').on('click',function(){

                let deviceDiv = $(this).closest('tr');
                let deviceId = deviceDiv.data('deviceid');

                console.log('Total Running Intervals: ' + runningIntervals.length);
                if( runningIntervals.length > 0 ){
                    runningIntervals.forEach(intrvl => { clearInterval(intrvl) });
                    runningIntervals = [];
                }

                /**
                 * Load Device Information
                 */
                $.ajax({
                    url: "/rest/v1/devices/"+deviceId,
                    type: 'GET',
                    dataType: 'json',
                    success: function(res) {
                        $('#device-preview-header').html(res['urn']);
                        $('#device-view').removeClass('d-none');
                        $('#device-status > .badge').remove();
                        $('#device-status').append(parseStatus(res.status));

                        if( res.status === 'CONNECTED' ){
                            /**
                             * Load Device Metrics
                             */
                            updateDeviceDiskUsage(deviceId);
                            runningIntervals.push(setInterval(function(){ updateDeviceDiskUsage(deviceId); },31000));
                            updateDeviceMemoryUsage(deviceId);
                            runningIntervals.push(setInterval(function(){ updateDeviceMemoryUsage(deviceId); },17000));
                            updateDeviceCPUUsage(deviceId);
                            runningIntervals.push(setInterval(function(){ updateDeviceCPUUsage(deviceId); },11000));
                            updateDeviceNetworkUtilization(deviceId);
                            runningIntervals.push(setInterval(function(){ updateDeviceNetworkUtilization(deviceId); },2500));
                        }else{
                            $('#networking-utilization-badges').html('');
                            $('#device-diskusage').html("-");
                            $('#device-memoryusage').html("-");
                            $('#device-cpuutilization').html("-");
                        }

                    }
                });

            });

        }
    });

    /**
     * Update Device Disk Usage
     * @param deviceId
     */
    function updateDeviceDiskUsage(deviceId){
        $.ajax({
            url: "/rest/v1/devices/"+deviceId+"/metrics",
            type: 'POST',
            dataType: 'json',
            contentType:"application/json; charset=utf-8",
            data: JSON.stringify({
                metric: 'disk'
            }),
            success: function(res) {
                $('#device-diskusage').html(res.usage + "%");
            }
        });
    }

    /**
     * Update Device Memory Usage
     * @param deviceId
     */
    function updateDeviceMemoryUsage(deviceId){
        $.ajax({
            url: "/rest/v1/devices/"+deviceId+"/metrics",
            type: 'POST',
            dataType: 'json',
            contentType:"application/json; charset=utf-8",
            data: JSON.stringify({
                metric: 'memory'
            }),
            success: function(res) {
                if( res.length > 0 ){
                    $('#device-memoryusage').html(res[0]['usage'] + "%");
                }

            }
        });
    }

    /**
     * Update Device Memory Usage
     * @param deviceId
     */
    function updateDeviceCPUUsage(deviceId){
        $.ajax({
            url: "/rest/v1/devices/"+deviceId+"/metrics",
            type: 'POST',
            dataType: 'json',
            contentType:"application/json; charset=utf-8",
            data: JSON.stringify({
                metric: 'cpu'
            }),
            success: function(res) {
                if( res.length > 0 ){
                    $('#device-cpuutilization').html(res[0]['utilization'] + "%");
                }

            }
        });
    }

    function updateDeviceNetworkUtilization(deviceId){
        $.ajax({
            url: "/rest/v1/devices/"+deviceId+"/metrics",
            type: 'POST',
            dataType: 'json',
            contentType:"application/json; charset=utf-8",
            data: JSON.stringify({
                metric: 'network'
            }),
            success: function(res) {
                $('#networking-utilization-badges').html('');
                let totalIfs = Object.keys(res).length;
                let netcolSplit = (12 / totalIfs) < 3 ? 3 : parseInt(12 / totalIfs);
                Object.keys(res).forEach(data => {
                    let icon = 'fas fa-question';
                    if( data.startsWith('eth') ){
                        icon = 'fas fa-network-wired';
                    }else if( data.startsWith('wlan') || data.startsWith('wwan') ){
                        icon = 'fas fa-wifi';
                    }

                    let bytesSent = '0KB/s';
                    let bytesReceived = '0KB/s';
                    if( res[data].length > 1 ){
                        let timePeriod = ((new Date(res[data][0]['createdAt']).getTime() - new Date(res[data][1]['createdAt']).getTime()) / 1000);
                        bytesSent = (((parseInt(res[data][0]['bytesSent']) - parseInt(res[data][1]['bytesSent'])) / 1024)  / timePeriod).toFixed(2) + 'KB/s';
                        bytesReceived = ( ((parseInt(res[data][0]['bytesReceived']) - parseInt(res[data][1]['bytesReceived'])) / 1024) / timePeriod ).toFixed(2) + 'KB/s';
                    }

                    $('#networking-utilization-badges')
                        .append('<div class="col-lg-'+netcolSplit+'">' +
                                    '<div class="info-box mb-3">' +
                                        '<span class="info-box-icon elevation-1"><i class="'+icon+'"></i></span>' +
                                        '<div class="info-box-content">' +
                                            '<span class="info-box-text">'+data+'</span>' +
                                            '<span class="info-box-number">Sent: '+bytesSent+'</span>' +
                                            '<span class="info-box-number">Received: '+bytesReceived+'</span>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>'); //TODO Using jquery-template.
                })

            }
        });
    }

    /**
     *
     */
    function renderNetworkInterfaces(netInterfaces){
        let addresses = _.chain(_.filter(netInterfaces, function(iface){return iface['technology'] === 'IPv4';}).map(function(iface) { return iface.adapters; }))
            .map(function(adapter) {
                return _.chain(adapter).filter(function(it){ return it['type'] === 'IP' }).map(function(it){ return it['addresses'].join(',') }).value();
            })
            .value();
        return addresses.join(',');
    }

    function parseOnlineAt(onlineAt){
        if( onlineAt === undefined ) return '-';
        return moment(onlineAt).format('MMMM Do YYYY') + '<br/> At: ' + moment(onlineAt).format('HH:mm:ss');
    }

    function parseStatus(status){
        if( status === undefined ) return '-';
        let label = 'danger';
        if( status === 'CONNECTED' ){
            label = 'success';
        }
        let tmp = status.split('_');

        if( tmp.length == 1 ){
            let str =  tmp[0].charAt(0).toUpperCase() + tmp[0].substr(tmp[0].length - (tmp[0].length-1)).toLowerCase();
            return '<span class="badge bg-'+label+' text-center">'+str+'</span>';
        }

        let capitalized = _.map(tmp, function(phrase){
            return phrase.charAt(0).toUpperCase() + phrase.substr(phrase.length - (phrase.length-1)).toLowerCase();
        });
        return '<span class="badge bg-'+label+' text-center">'+capitalized.join(" ")+'</span>';
    }

    function getActions(){
        return '<button class="btn btn-sm btn-primary preview-device" data-toggle="tooltip" data-placement="right" title="Device Information"><i class="fa fa-eye"></i></button>';
    }

})
