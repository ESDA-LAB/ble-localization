$(document).ready(function(){

    let canvasInterval = undefined;
    let objectColors = {};
    objectColors["robot"] = "green";
    objectColors["device"] = "red";

    /**
     * Load Robot information
     */
    $.ajax({
        url: "/rest/v1/locations",
        type: 'GET',
        dataType: 'json',
        beforeSend: function(){
            $('#locations-table > tbody').html('');
        },
        success: function(res) {
            res.forEach(location => {
                $('#locations-table > tbody').append('<tr>' +
                    '<td>'+location.locationId+'</td>' +
                    '<td>'+location.label+'</td>' +
                    '<td>'+renderActions(location.locationId)+'</td>' +
                    '</tr>');
            });
            initActions();
        }
    });

    /**
     *
     */
    function renderActions(locationId){
        return '<button data-location="'+locationId+'" type="button" class="btn btn-block btn-outline-primary btn-sm location-map">Map</button>';
    }

    /**
     *
     */
    function initActions(){
        $('.location-map').off('click').on('click', function(){
            let locationId = $(this).data('location');
            if( canvasInterval !== undefined ) clearInterval(canvasInterval);
            $.ajax({
                url: "/rest/v1/locations/"+locationId+"/map",
                type: 'GET',
                dataType: 'json',
                success: function(res) {
                    renderCanvas(locationId, res.identity, res.width, res.height);
                }
            }); // END of AJAX

        });// END of $('.location-map')
    }

    /**
     * Render Virtual Map Canvas.
     * @param width
     * @param height
     * @returns {string}
     */
    function renderCanvas(locationId, mapId, width, height){
        $('#virtualMapCanvas').remove();
        $('#location-virtual-map').html('<canvas id="virtualMapCanvas" width="'+width+'" height="'+height+'"></canvas>');
        initCanvas(locationId, mapId, width, height);
    }

    /**
     *
     */
    function initCanvas(locationId, mapId, width, height){
        let mapCanvas = document.getElementById("virtualMapCanvas");
        if( mapCanvas !== undefined ){
            let ctxMapCanvas = mapCanvas.getContext("2d");
            let images = [];

            //Initialize
            images[0] = new Image();
            images[0].onload = function() {
                ctxMapCanvas.drawImage(images[0],0, 0, width, height);
            }
            images[0].src = 'images/locations/'+mapId+'.png';
            ctxMapCanvas.drawImage(images[0],0, 0, width, height);
            canvasInterval = setInterval(function(){
                $.get( "/rest/v1/locations/"+locationId+"/objects", function(positions) {
                    ctxMapCanvas.drawImage(images[0],0, 0, width, height);
                    positions.forEach(position => {
                        ctxMapCanvas.beginPath();
                        ctxMapCanvas.arc(position.position.x, position.position.y, 7, 0, 2 * Math.PI);
                        ctxMapCanvas.fillStyle = getColor(position.objectId);
                        ctxMapCanvas.fill();
                    });
                });
            },1000);
        }
    }

    /**
     * Helper Function return object color;
     */
    function getColor(objectId){
        let split = objectId.split(":");
        return objectColors[split[split.length-2]];
    }

})
