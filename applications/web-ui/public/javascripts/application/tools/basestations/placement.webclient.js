/**
 *
 */
function showHideDefaultRowOnBaseStationsTable(){
    if( $('#basestations-table > tbody  > tr').length === 0 ){
        $('#basestations-table > tbody').append('<tr data-nobsinfo=""><td colspan="5">No base-stations applied yet.</td></tr>');
        return;
    }
    $('#basestations-table > tbody  > tr[data-nobsinfo=""]').remove();
}

/**
 *
 */
function updateBaseStationsTable(baseStations){

    $('#basestations-table > tbody  > tr').each(function() {
        let current = $(this).data('bs');
        let that = $(this);
        $.each( baseStations, function( key, value ) {
            if( value['bsType'] === current['bsType'] && value['bsRadio'] === current['bsRadio'] && value['bsRadius'] === current['bsRadius'] ){
                that.children('td:eq(4)').html(value['count']);
            }
        });
    });

}

$(document).ready(function(){

    $('#add-basestation').off('click').on('click',function (){
        let bsType = $('#baseStationType option:selected').text();
        let bsTechnology = $('#baseStationTechnology option:selected').text();
        let bsRange = parseInt($('#baseStationRange').val());
        let bsData = { bsType: $('#baseStationType').val(), bsRadio: $('#baseStationTechnology').val(), bsRadius: bsRange };
        showHideDefaultRowOnBaseStationsTable();
        $('#basestations-table > tbody').append('' +
            '<tr data-bs=\''+JSON.stringify(bsData)+'\' data-applied="no-applied">' +
            '<td>-</td>' +
            '<td>'+bsType+'</td>' +
            '<td>'+bsTechnology+'</td>' +
            '<td>'+bsRange+'</td>' +
            '<td>0</td>' +
            '<td><button class="btn btn-sm remove-bs" data-toggle="tooltip" data-placement="right" title="Remove base-station"><i class="fas fa-trash-alt"></i></button></td>' +
            '</tr>');
        $('#baseStationTypeModal').modal('hide');
        $('.remove-bs').off('click').on('click',function (){
            $(this).closest('tr').remove();
            showHideDefaultRowOnBaseStationsTable();
        });
    })

    $('#generate-placement').off('click').on('click', function () {
        let data = new FormData();
        let files = $('#geojson-file')[0].files[0];
        if( files === undefined ){
            toastr.error("No GeoJSON file selected.");
            return;
        }
        data.append('geojson', files);

        if( $('#baseStationIterations').val() === '' ){
            toastr.error("Iterations not defined.");
            return;
        }

        let iterations = parseInt($('#baseStationIterations').val());
        if( iterations < 1 || iterations > 10 ){
            toastr.error("Iterations must be between 1 and 10.");
            return;
        }
        data.append('iterations', iterations);

        let baseStations = [];
        $('#basestations-table > tbody  > tr').each(function() {
            if( $(this).attr('data-applied') === "no-applied" ){
                baseStations.push($(this).data('bs'));
                $(this).children('td:eq(0)').html('<i class="fas fa-check"></i>');
                $(this).attr('data-applied', "applied");
                $(this).addClass("alert alert-applied");
                //TODO This is better to set as applied when the request (/rest/v1/tools/bsplacement) is 200 OK.
                $(this).children('td:eq(5)').find('button.remove-bs').remove();
                return false;
            }
        });
        if( baseStations.length !== 1 ){
            toastr.error("Only one base-station can be applied each time or base-station has been applied already!!");
            return;
        }
        data.append('basestations', JSON.stringify(baseStations));
        data.append('session', ($('#current-placement-session').val() !== '') ? $('#current-placement-session').val() : undefined);

        $('#generate-placement').attr('disabled', 'disabled');
        $.ajax({
            url: '/rest/v1/tools/bsplacement',
            type: 'POST',
            data: data,
            contentType: false,
            processData: false,
            beforeSend: function(){
                showLoading();
            },
            success: function(response, textStatus, jqXHR){
                $('#bs-placement-img').remove();
                $('#placement-visualization').append('<img class="bs-placement-img" id="bs-placement-img" src="/tools/bsplacement/images/'+ response['image'] +'" />');
                $('#current-placement-session').val(response['sessionId']);
                updateBaseStationsTable(response['baseStations']);
                if( parseInt(jqXHR.status) === 200 ){
                    toastr.success("Generation was success!!! Check generated image.")
                }else{
                    toastr.warning("Unable to generate base stations placement.");
                }
            },
            error: function(jqXHR, textStatus){
                toastr.error("Unable to generate base stations placement.");
            },
            complete: function(){
                $('#generate-placement').removeAttr('disabled');
                hideLoading();
            }
        });

    });

    /**
     * Handling the download of the locations.
     */
    $('#download-locations').off('click').on('click',function(){
        let sessionId = $('#current-placement-session').val();
        if( sessionId === '' ){
            toastr.error("Please generate at least on topology.");
            return;
        }
        $.ajax({
            url: "/rest/v1/tools/bsplacement/locations/cartesian?sessionId="+sessionId+"&from=gps",
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                window.open('/tools/bsplacement/locations/'+res.csv , '_blank');
            }
        });
    })

});
