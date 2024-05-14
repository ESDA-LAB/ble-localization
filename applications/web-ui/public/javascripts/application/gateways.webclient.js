$(document).ready(function(){

    let runningIntervals = [];

    /**
     * Load Gateways Information
     */
    $.ajax({
        url: "/rest/v1/gateways",
        type: 'GET',
        dataType: 'json',
        success: function(res) {
            res.forEach((gateway) => {
                $('#gateways-table > tbody').append('<tr data-gatewayId="'+gateway['gatewayId']+'">' +
                    '<td class="align-middle">'+gateway['gatewayId']+'</td>' +
                    '<td class="align-middle">'+gateway.identity+'</td>' +
                    '<td class="align-middle">v'+gateway.version+'</td>' +
                    '<td class="align-middle">'+renderNetworkInterfaces(gateway['networks'])+'</td>' +
                    '<td class="align-middle">'+parseOnlineAt(gateway['onlineAt'])+'</td>' +
                    '<td class="align-middle">'+getActions()+'</td>' +
                    '</tr>');
            });

            $('.preview-gateway').off('click').on('click',function(){

                let gatewayDiv = $(this).closest('tr');
                let gatewayId = gatewayDiv.data('gatewayid');

                console.log('Total Running Intervals: ' + runningIntervals.length);
                if( runningIntervals.length > 0 ){
                    runningIntervals.forEach(intrvl => { clearInterval(intrvl) });
                    runningIntervals = [];
                }

                /**
                 * Load Gateway Information
                 */
                $.ajax({
                    url: "/rest/v1/gateways/"+gatewayId,
                    type: 'GET',
                    dataType: 'json',
                    success: function(res) {
                        $('#gateway-preview-header').html(res['identity'] + ' (#' + gatewayDiv.data('gatewayid') + ')');
                        $('#gateway-view').removeClass('d-none');
                    }
                });

                /**
                 * Load Gateway Metrics
                 */
                updateGatewayDiskUsage(gatewayId);
                runningIntervals.push(setInterval(function(){ updateGatewayDiskUsage(gatewayId); },31000));
                updateGatewayMemoryUsage(gatewayId);
                runningIntervals.push(setInterval(function(){ updateGatewayMemoryUsage(gatewayId); },17000));
                updateGatewayCPUUsage(gatewayId);
                runningIntervals.push(setInterval(function(){ updateGatewayCPUUsage(gatewayId); },11000));
                updateGatewayNetworkUtilization(gatewayId);
                runningIntervals.push(setInterval(function(){ updateGatewayNetworkUtilization(gatewayId); },2500));
            });

        }
    });

    /**
     * Update Gateway Disk Usage
     * @param gatewayId
     */
    function updateGatewayDiskUsage(gatewayId){
        $.ajax({
            url: "/rest/v1/gateways/"+gatewayId+"/metrics",
            type: 'POST',
            dataType: 'json',
            contentType:"application/json; charset=utf-8",
            data: JSON.stringify({
                metric: 'disk'
            }),
            success: function(res) {
                $('#gateway-diskusage').html(res.usage + "%");
                //TODO Time.
            }
        });
    }

    /**
     * Update Gateway Memory Usage
     * @param gatewayId
     */
    function updateGatewayMemoryUsage(gatewayId){
        $.ajax({
            url: "/rest/v1/gateways/"+gatewayId+"/metrics",
            type: 'POST',
            dataType: 'json',
            contentType:"application/json; charset=utf-8",
            data: JSON.stringify({
                metric: 'memory'
            }),
            success: function(res) {
                if( res.length > 0 ){
                    $('#gateway-memoryusage').html(res[0]['usage'] + "%");
                }

            }
        });
    }

    /**
     * Update Gateway Memory Usage
     * @param gatewayId
     */
    function updateGatewayCPUUsage(gatewayId){
        $.ajax({
            url: "/rest/v1/gateways/"+gatewayId+"/metrics",
            type: 'POST',
            dataType: 'json',
            contentType:"application/json; charset=utf-8",
            data: JSON.stringify({
                metric: 'cpu'
            }),
            success: function(res) {
                if( res.length > 0 ){
                    $('#gateway-cpuutilization').html(res[0]['utilization'] + "%");
                }

            }
        });
    }

    function updateGatewayNetworkUtilization(gatewayId){
        $.ajax({
            url: "/rest/v1/gateways/"+gatewayId+"/metrics",
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
                    }else if( data.startsWith('wlan') ){
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
                return _.chain(adapter).filter(function(it){ return it['type'] === 'IP' }).map(function(it){ return it['addresses'].join('<br/>') }).value();
            })
            .value();
        return addresses.join(',');
    }

    function parseOnlineAt(onlineAt){
        if( onlineAt === undefined ) return '-';
        return moment(onlineAt).format('MMMM Do YYYY') + '<br/> At: ' + moment(onlineAt).format('HH:mm:ss');
    }

    function getActions(){
        return '<button class="btn btn-sm btn-primary preview-gateway" data-toggle="tooltip" data-placement="right" title="Gateway Metrics"><i class="fa fa-chart-area"></i></button>';
    }

})
