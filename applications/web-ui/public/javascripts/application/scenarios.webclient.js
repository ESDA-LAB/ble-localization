$(document).ready(function(){

    const DEFAULT_RESULT_CHARTS = ['throughput','delay','packet_loss','jitter'];
    const applicationId = $('#scenario-references').data('applicationid');
    const scenarioId = $('#scenario-references').data('scenarioid');

    function getDefaultPlotOptions(yAxisLabel = ''){
        return {
            grid : { hoverable : true, borderColor: '#f3f3f3', borderWidth: 1, tickColor : '#f3f3f3'},
            series: { shadowSize: 0, lines : { show: true }, points : { show: true } },
            lines : { fill : false, color: ['#f56954'] },
            yaxis : { show: true, position: 'left',  axisLabel: yAxisLabel },
            xaxis : { show: false, position: 'bottom', axisLabel: '' },
            legend: { position: "ne", show: true, noColumns: 1, backgroundColor: '#f3f3f3', backgroundOpacity: 0.8 }
        }
    }

    $(document).on("throughput-results-event", function(type, data){
        const results = _.map( data.results, function( parameters ) {
            return {
                data:  _.map( parameters.results, function( result ) { return [result.idx, result.result]; }),
                label: parameters.value
            };
        })
        $.plot('#throughput-chart', results, getDefaultPlotOptions('Throughput (bps)'));
        $("#throughput-chart").unbind("plothover").unbind("plothovercleanup")
            .bind("plothover", function (event, pos, item) {
                if (!pos.x || !pos.y) return;
                if (item) {
                    $("#charts-tooltip").html("Throughput: " + item.datapoint[1] + "bps").css({top: item.pageY+5, left: item.pageX+5}).fadeIn(200);
                } else {
                    $("#charts-tooltip").hide();
                }
            }).bind("plothovercleanup", function (event, pos, item) {
                $("#charts-tooltip").hide();
            });

    }); //End of throughput-results-event

    $(document).on("delay-results-event", function(type, data){
        const results = _.map( data.results, function( parameters ) {
            return {
                data:  _.map( parameters.results, function( result ) { return [result.idx, result.result]; }),
                label: parameters.value
            };
        })
        $.plot('#delay-chart', results, getDefaultPlotOptions('Mean Delay (ms)'));
        $("#delay-chart").unbind("plothover").unbind("plothovercleanup")
            .bind("plothover", function (event, pos, item) {
                if (!pos.x || !pos.y) return;
                if (item) {
                    $("#charts-tooltip").html("Mean Delay: " + item.datapoint[1] + "ms").css({top: item.pageY+5, left: item.pageX+5}).fadeIn(200);
                } else {
                    $("#charts-tooltip").hide();
                }
            }).bind("plothovercleanup", function (event, pos, item) {
            $("#charts-tooltip").hide();
        });
    });//End of delay-results-event

    $(document).on("packet_loss-results-event", function(type, data){
        const results = _.map( data.results, function( parameters ) {
            return {
                data:  _.map( parameters.results, function( result ) { return [result.idx, result.result]; }),
                label: parameters.value
            };
        })
        $.plot('#packet_loss-chart', results, getDefaultPlotOptions('Packet loss (%)'));
        $("#packet_loss-chart").unbind("plothover").unbind("plothovercleanup")
            .bind("plothover", function (event, pos, item) {
                if (!pos.x || !pos.y) return;
                if (item) {
                    $("#charts-tooltip").html("Packet Loss: " + item.datapoint[1] + "%").css({top: item.pageY+5, left: item.pageX+5}).fadeIn(200);
                } else {
                    $("#charts-tooltip").hide();
                }
            }).bind("plothovercleanup", function (event, pos, item) {
            $("#charts-tooltip").hide();
        });
    });

    $(document).on("jitter-results-event", function(type, data){
        const results = _.map( data.results, function( parameters ) {
            return {
                data:  _.map( parameters.results, function( result ) { return [result.idx, result.result]; }),
                label: parameters.value
            };
        })
        $.plot('#jitter-chart', results, getDefaultPlotOptions('Mean Jitter (ms)'));
        $("#jitter-chart").unbind("plothover").unbind("plothovercleanup")
            .bind("plothover", function (event, pos, item) {
                if (!pos.x || !pos.y) return;
                if (item) {
                    $("#charts-tooltip").html("Mean Jitter: " + item.datapoint[1] + "ms").css({top: item.pageY+5, left: item.pageX+5}).fadeIn(200);
                } else {
                    $("#charts-tooltip").hide();
                }
            }).bind("plothovercleanup", function (event, pos, item) {
            $("#charts-tooltip").hide();
        });
    });

    $(document).on("optimization-event", function(type, data){
        //TODO
        console.log("TODO, Request the optimized configuration based on the " + data.resultType);
    });

    /**
     * Load Scenario Information
     */
    $.ajax({
        url: "/rest/v1/applications/"+applicationId+'/scenarios/'+scenarioId,
        type: 'GET',
        dataType: 'json',
        beforeSend: function(){
            $('#source-codes').html('');
            $('#scenario-parameters').html('');
        },
        success: function(res) {
            $('#scenario-name').html(res.application)
            $('#scenario-description').html(res.description)
            $( "#_tmpl_scenario_source_view" ).tmpl({sources: res.sources}).appendTo('#source-codes');
            $('[data-toggle="tooltip"]').tooltip();

            let parameterOptions = '';
            let filteredOptions = '<option value="none" selected>None</option>';
            let valuesOptions = '';
            let selectedParameterValue = '';

            let totalParametersSize = res.parameters.length;
            let parametersIdx = 0;
            _.each(res.parameters, function(param){
                parametersIdx++;
                filteredOptions += '<option value="'+param.parameter+'">Parameter: '+param.parameter+'</option>';
                if( parametersIdx === totalParametersSize ) {
                    parameterOptions += '<option value="'+param.parameter+'" selected>Parameter: '+param.parameter+'</option>';
                    _.each(param.values, function(val){
                        valuesOptions += '<option value="'+val+'">'+val+'</option>';
                    });
                    selectedParameterValue = param.values[0];
                }else{
                    parameterOptions += '<option value="'+param.parameter+'">Parameter: '+param.parameter+'</option>';
                }
            })

            $('#scenario-primary-evaluation-parameter').append(parameterOptions);
            $('#scenario-primary-filtered-parameter').append(filteredOptions);
            $('#scenario-primary-evaluation-parameter-values').append(valuesOptions);
            $('#scenario-primary-evaluation-parameter-values option[value='+selectedParameterValue+']').attr('selected','selected');

            /**
             *
             */
            $('#scenario-primary-evaluation-parameter').off('change').on('change',function(){
                $('#simulations-results-filters > span').remove();
                $('#scenario-primary-filtered-parameter').val('none').trigger('change');
                refreshCharts();
            });

            $('#scenario-primary-filtered-parameter').off('change').on('change',function(){
                let evalValuesOptions = '';
                let evalSelectedParameterValue = '';
                let selectedParameter = $(this).val();
                _.each(res.parameters, function(param){
                    if( param.parameter === selectedParameter ) {
                        _.each(param.values, function(val){
                            evalValuesOptions += '<option value="'+val+'">'+val+'</option>';
                        });
                        evalSelectedParameterValue = param.values[0];
                        return;
                    }
                });
                $('#scenario-primary-filtered-parameter-values').find('option').remove().end().append(evalValuesOptions).val(evalSelectedParameterValue);
            })

            /**
             *
             */
            $('.download-source').off('click').on('click',function(e){
                e.preventDefault();
                window.location.href = "/rest/v1/applications/"+applicationId+"/scenarios/"+scenarioId+"/sources/"+$(this).data('filename');
            })

            /**
             * Refreshing Simulation Charts.
             */
            function refreshCharts(chartToRefresh = 'all'){

                let filters = {};
                $('#simulations-results-filters > span').each(function(){
                    filters[$(this).data('parameter')] = $(this).data('parametervalue');
                })

                let resultsCharts = (chartToRefresh === 'all') ? DEFAULT_RESULT_CHARTS : [chartToRefresh]

                /**
                 * Generate default charts.
                 */
                resultsCharts.forEach(function(chart){

                    $.ajax({
                        url: "/rest/v1/applications/"+applicationId+'/scenarios/'+scenarioId+'/results',
                        type: 'POST',
                        dataType: 'json',
                        contentType:"application/json; charset=utf-8",
                        data: JSON.stringify({
                            "requirement": chart,
                            "parameters": [$('#scenario-primary-evaluation-parameter').val()],
                            "evaluation": $('#simulations-results-'+chart+'-threshold-comparison').val() + ',' + $('#simulation-results-'+chart+'-threshold').val().trim(),
                            "limit": $('#simulation-results-limit').val(),
                            "order": $('#simulation-results-order').val(),
                            "filters": filters
                        }),
                        success: function(res) {
                            $(document).trigger(chart+'-results-event', { results: res.results });
                            $(document).trigger('optimization-event', { resultType: chart });
                        }
                    })
                });
            }

            /**
             *
             */
            $('#add-filter-parameter').off('click').on('click',function(){

                if( $('#scenario-primary-evaluation-parameter').val() === $('#scenario-primary-filtered-parameter').val() ){
                    $('#simulations-results-errors').html('Filtered parameter is same with Evaluation parameter. Please select a different parameter to filter.');
                    return;
                }
                $('#simulations-results-errors').html('');

                let parameter = $('#scenario-primary-filtered-parameter').val().trim();
                let parameterValue = $('#scenario-primary-filtered-parameter-values').val().trim();
                let parameterLabel = parameter + '::' + parameterValue;
                let that = $('#simulations-results-filters').children('span[data-parameter="'+parameter+'"]');
                if( that.length > 0 ) that.remove();
                $('#simulations-results-filters').append('<span class="badge badge-info ml-1 p-2 mt-2" data-parameter="'+parameter+'" data-parametervalue="'+parameterValue+'">'+parameterLabel+'<i class="fas fa-times ml-2 mt-1 simulations-results-filter-delete" role="button"></i></span>')

                /**
                 *
                 */
                $('.simulations-results-filter-delete').off('click').on('click', function(){
                    $(this).parent().remove();
                    refreshCharts();
                })
                refreshCharts();
            });

            $('.refresh-results-button').off('click').on('click',function(){
                refreshCharts($(this).data('refresh').trim());
            });

            refreshCharts();

        }
    });

    $('#back-to-applications')
        .off('click')
        .on('click',function(){
            window.location.href = '/simulations/applications';
        });

})
