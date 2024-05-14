$(document).ready(function(){

    /**
     * Load Robot information
     */
    $.ajax({
        url: "/rest/v1/robots",
        type: 'GET',
        dataType: 'json',
        success: function(res) {
            res.forEach(robot => {
                $('#robots-table > tbody').append('<tr><td>'+robot.robotId+'</td><td>'+robot.urn+'</td><td>'+robot.type+'</td><td>'+robot.mode+'</td></tr>');
            });
        }
    });

})
