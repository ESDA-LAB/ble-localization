$(document).ready(function(){
    let canvasInterval = undefined;
    let objectColors = {
        "device": "#F1904AFF",
        "sensor": "#F1904AFF",
        "object": "#F1904AFF",
        "object_closeTo": "#E86805",
        "beacon": "#FF0000"
    };
    const locationId = $('#user-location-identifier').data('location');

    setInterval(function(){
        $.ajax({
            url: "/rest/v1/locations/"+locationId+'/ambient',
            type: 'GET',
            dataType: 'json',
            success: function(res) {
                parseAmbient(res)
            }
        }); // END of AJAX
    }, 20000);

    /**
     * Initialize gateways
     * @param gateways
     */
    function initGateways(gateways){
        gateways.forEach((gateway, idx) => {
            const IPv4Addr = _.find(gateway.networks,function(net){
                if( net.technology == 'IPv4' ) return net;
            });
            const ipv4Addresses = _.map(
                _.filter(IPv4Addr.adapters, function(adapter){ return (adapter.type === 'IP') }),
                function(adapter){
                    return adapter.addresses.toString();
                }
            );
            let ipv4AddressesLabel = ipv4Addresses.toString().split(',').join('<br/>');
            $('#myloc-gateways-tbl > tbody').append('<tr> <td>'+gateway.identity+' (<strong><i>Version: '+gateway.version+'</i></strong>)</td> <td><span> <strong>IPv4</strong> </span> <br/> '+ipv4AddressesLabel+'</td> </tr>');
        });
    }


    /**
     * Initialize Devices
     * @param devices
     */
    function initDevices(devices){
        const beacons = _.filter(devices, function(device){ return device.urn.includes('beacon') });
        const obstacles = _.filter(devices, function(device){ return device.urn.includes('device') });

        beacons.forEach((beacon, idx) => {
            $('#myloc-beacons-tbl > tbody').append('<tr data-deviceId="'+beacon['id']+'" data-position="'+beacon.virtual.x+','+beacon.virtual.y+'"> <td>' + beacon.urn + '</td> <td> Location(Virtual): ['+beacon.virtual.x+','+beacon.virtual.y+'] </td> </tr>');
        });


        obstacles.forEach((obstacle, idx) => {
            $('#myloc-devices-tbl > tbody').append('<tr data-deviceId="'+obstacle['id']+'" class="d-none"> <td>' + obstacle['urn'] + '</td> <td>Location(Virtual): -</td> </tr>');
        });


    }

    /**
     * Render Virtual Map Canvas.
     * @param width
     * @param height
     * @returns {string}
     */
    function renderCanvas(locationId, mapId, width, height, devices){
        $('#virtualMapCanvas').remove();
        $('#location-virtual-map').html('<canvas id="virtualMapCanvas" width="'+width+'" height="'+height+'"></canvas>');
        const beacons = _.filter(devices, function(device){ return device.urn.includes('beacon') });
        initCanvas(locationId, mapId, width, height, beacons);
    }

    /**
     *
     */
    function initCanvas(locationId, mapId, width, height, beacons){
        let mapCanvas = document.getElementById("virtualMapCanvas");
        let refMapWidth = parseInt($('#refmap-width').val());
        let refMapHeight = parseInt($('#refmap-height').val());
        let beaconPositions = _.map(beacons, function(beacon){
            return {
                "x": (width/2) + (parseFloat(beacon.virtual.x) * ( (1/0.05) / (refMapWidth / width) )),
                "y": (height/2) - (parseFloat(beacon.virtual.y) * ( (1/0.05) / (refMapHeight / height) )) };
        });
        if( mapCanvas !== undefined ){
            let ctxMapCanvas = mapCanvas.getContext("2d");
            let images = [];

            //Initialize
            images[0] = new Image();
            images[0].onload = function() {
                ctxMapCanvas.drawImage(images[0],0, 0, width, height);
            }
            images[0].src = '/images/locations/'+mapId+'.png';
            ctxMapCanvas.drawImage(images[0],0, 0, width, height);
            canvasInterval = setInterval(function(){

                $.get( "/rest/v1/locations/"+locationId+"/objects", function(devices) {
                    ctxMapCanvas.drawImage(images[0],0, 0, width, height);

                    beaconPositions.forEach(position => {
                        ctxMapCanvas.beginPath();
                        ctxMapCanvas.arc(position.x, position.y, 7, 0, 2 * Math.PI);
                        ctxMapCanvas.fillStyle = objectColors["beacon"];
                        ctxMapCanvas.fill();
                    })

                    devices.forEach(device => {
                        ctxMapCanvas.beginPath();
                        if( device.position['cartesian'] !== undefined ){
                            let objectPos = convertObjectPosition(width, height, device.position['cartesian'], refMapWidth, refMapHeight);
                            ctxMapCanvas.arc(objectPos.x, objectPos.y, 7, 0, 2 * Math.PI);
                            ctxMapCanvas.fillStyle = getColor(device['deviceType']);
                            ctxMapCanvas.fill();
                        }else {
                            let cartesian = $('#myloc-beacons-tbl > tbody > tr[data-deviceid="'+device.position['closeTo']['deviceId']+'"]').data('position');
                            let objectPos = convertObjectPosition(width, height, cartesian, refMapWidth, refMapHeight);
                            ctxMapCanvas.arc(objectPos.x, objectPos.y, 85, 0, 2 * Math.PI);
                            ctxMapCanvas.strokeStyle = objectColors["object_closeTo"];
                            ctxMapCanvas.lineWidth = 2;
                            ctxMapCanvas.stroke();
                        }
                        updateTbl(device['deviceId'], device['deviceType'], device.position);
                    });
                });

            },1000);
        }
    }

    /**
     *
     */
    function updateTbl(deviceId, type, position){
        switch (type){
            case 'object':
                if( position['cartesian'] !== undefined ){
                    let tdObj = $('#myloc-devices-tbl > tbody > tr[data-deviceId="'+deviceId+'"]');
                    tdObj.find("td:last-child").html('Location(Virtual): ['+position['cartesian']+']');
                    tdObj.removeClass("d-none");
                }else if( position['closeTo'] !== undefined ){
                    let cartesian = $('#myloc-beacons-tbl > tbody > tr[data-deviceid="'+position['closeTo']['deviceId']+'"]').data('position');
                    let tdObj = $('#myloc-devices-tbl > tbody > tr[data-deviceId="'+deviceId+'"]');
                    tdObj.find("td:last-child").html('Location(CloseTo): ['+position['closeTo']['deviceType']+'] <br/> Location(Virtual): ['+cartesian+']');
                    tdObj.removeClass("d-none");
                }
                break;
        }
    }

    function convertObjectPosition(mapWidth, mapHeight, cartesian, refMapWidth, refMapHeight){
        let tmp = cartesian.split(",");
        if( tmp.length > 1 ) {
            return {
                x: (mapWidth/2) + (parseFloat(tmp[0]) * ( (1/0.05) / (refMapWidth / mapWidth) )),
                y: (mapHeight/2) - (parseFloat(tmp[1]) * ( (1/0.05) / (refMapHeight / mapHeight) ))
            }
        }
        return { x:0, y:0 };
    }

    /**
     * Helper Function return object color;
     */
    function getColor(objectId){
        let split = objectId.split(":");
        return (split.length > 1) ? objectColors[split[split.length-2]] : objectColors[objectId];
    }

    const MeasurementUnits = {
        'temperature': 'C',
        'humidity': 'H'
    };

    /**
     * Parse and visualize ambient data.
     * @param data
     */
    function parseAmbient(data){
        data.forEach(ambient => {
            const measurement = _.first(ambient.measurements);
            $('#mylocation-'+ambient.datatype).html(measurement.measurement + ' ' + MeasurementUnits[ambient.datatype]);
        })
    }


    /**
     * Retrieve the information about my location.
     */
    function getMyLocation(){

        if( canvasInterval !== undefined ){
            clearInterval(canvasInterval);
        }

        $.ajax({
            url: "/rest/v1/locations/"+locationId+"/map",
            type: 'GET',
            dataType: 'json',
            success: function(res) {
                const mapInfo = res;

                $.ajax({
                    url: "/rest/v1/locations/"+locationId,
                    type: 'GET',
                    dataType: 'json',
                    success: function(res) {
                        $('#location-info').html(res.location.label)
                        initGateways(res.gateways);
                        initDevices(res.devices);
                        renderCanvas(locationId, mapInfo.identity, mapInfo.width, mapInfo.height, res.devices);
                    }

                }); // END of AJAX

            }
        }); // END of AJAX

    }

    $('.refmap-dimensions').off('change').on('change',function (){ getMyLocation(); });
    getMyLocation();

})
