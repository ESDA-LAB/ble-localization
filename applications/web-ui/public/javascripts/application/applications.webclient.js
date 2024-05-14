$(document).ready(function(){

    $('#add-application').off('click').on('click',function(){
       window.location.href = '/applications/add';
    });

    /**
     * Load Available Applications
     */
    function loadApplications(){
        $.ajax({
            url: "/rest/v1/applications",
            type: 'GET',
            dataType: 'json',
            beforeSend: function(){
                $('#applications-table > tbody').html('');
            },
            success: function(res) {
                res.forEach(application => {
                    $('#applications-table > tbody').append('<tr>' +
                        '<td>'+application.id+'</td>' +
                        '<td>'+application.application+'</td>' +
                        '<td>'+application.description+'</td>' +
                        '<td>'+renderActions(application.id)+'</td>' +
                        '</tr>');
                });
                initActions();
            }
        });
    }

    /**
     *
     */
    function renderActions(applicationId){
        return '<button data-application="'+applicationId+'" type="button" class="btn btn-sm btn-primary application-info" data-toggle="tooltip" data-placement="right" title="View Application"><i class="fas fa-search"></i></button>';
    }

    function extractComparison(value){
        let tmp = value.split(',');
        switch (tmp[0]){
            case 'gt': return 'Greater than ' + tmp[1]
            case 'gte': return 'Greater than or Equal ' + tmp[1]
            case 'lt': return 'Less than ' + tmp[1]
            case 'lte': return 'Less than or Equal ' + tmp[1]
            case 'eq': return 'Equal to ' + tmp[1]
            case 'neq': return 'Not Equal than ' + tmp[1]
            default: return '?'
        }
    }

    /**
     *
     */
    function initActions(){
        $('.application-info').off('click').on('click', function(){
            let applicationId = $(this).data('application');
            $.ajax({
                url: "/rest/v1/applications/"+applicationId,
                type: 'GET',
                dataType: 'json',
                success: function(res) {
                    $('#application-info').html('');

                    let appRequirements = _.map(res.requirements, function(req){
                        return {
                            description: req.description,
                            value: extractComparison(req.value)
                        };
                    })

                    let applicationInfo = {
                        appId: res.id,
                        name: res.application,
                        description: res.description,
                        requirements: appRequirements,
                        scenarios: res.scenarios
                    }
                    $( "#_tmpl_application_view" ).tmpl(applicationInfo).appendTo('#application-info');

                    $('#add-scenario').off('click').on('click',function(){
                        window.location.href = '/applications/'+applicationId+'/scenarios/add';
                    })

                    $('.scenario-graphs').off('click').on('click',function(){
                        let applicationId = $('#applications-scenarios-tbl').data('application');
                        let scenarioId = $(this).data('scenario');
                        window.location.href = '/simulations/applications/'+applicationId+'/scenarios/'+scenarioId+'/results';
                    });

                    $('.scenario-info').off('click').on('click',function(){
                        let applicationId = $('#applications-scenarios-tbl').data('application');
                        let scenarioId = $(this).data('scenario');
                        window.location.href = '/simulations/applications/'+applicationId+'/scenarios/'+scenarioId+'/view';
                    });

                    $('.scenario-add-parameter').off('click').on('click',function(){
                        alert('(Add new parameter) - TODO');
                    })

                    $('[data-toggle="tooltip"]').tooltip();

                }
            }); // END of AJAX

        });// END of $('.application-info')
        $('[data-toggle="tooltip"]').tooltip();
    }

    loadApplications();

})
