
const chart_draw = function(chart, chart_name, chart_data, line_color, unit, render){
    return chart = new Highcharts.stockChart({
        chart: {
            renderTo: render,
            defaultSeriesType: 'spline',
        },
        title: {
            text: '    '
        },
        rangeSelector: {
            enabled: false,
        },
        navigator: {
            xAxis:{
                visible: true,
                dateTimeLabelFormats:{
                    millisecond: '%L일차',
                    second: '%L일차',
                    minute: '%L일차',
                    hour: '%L일차',
                    day: '%L일차',
                    week: '%L일차',
                    month: '%L일차',
                    year: '%L일차'
                }
            },
        },
        xAxis:{
            categories: "",
            visible: true,
            dateTimeLabelFormats:{
                millisecond: '%L',
                second: '%L',
                minute: '%L',
                hour: '%L',
                day: '%L',
                week: '%L',
                month: '%L',
                year: '%L'
            }
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: unit,
            }
        },
        tooltip:{
            formatter: this.x,
            valueSuffix: unit,
            dateTimeLabelFormats:{
                millisecond: '%L일차',
                second: '%L일차',
                minute: '%L일차',
                hour: '%L일차',
                day: '%L일차',
                week: '%L일차',
                month: '%L일차',
                year: '%L일차'
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            animation: true,
            name: chart_name,
            data: chart_data,
            color : line_color
        }]
    });
}


const chart_draw2 = function(chart, chart_name1, chart_data1, line_color1, chart_name2, chart_data2, line_color2, unit, render){
    return chart =  new Highcharts.stockChart({
        chart: {
            renderTo: render,
            defaultSeriesType: 'spline',
        },
        title: {
            text: '    '
        },
        rangeSelector: {
            enabled: false
        },
        navigator: {
            xAxis:{
                visible: true,
                dateTimeLabelFormats:{
                    millisecond: '%L일차',
                    second: '%L일차',
                    minute: '%L일차',
                    hour: '%L일차',
                    day: '%L일차',
                    week: '%L일차',
                    month: '%L일차',
                    year: '%L일차'
                }
            },
        },
        xAxis:{
            visible: true,
            dateTimeLabelFormats:{
                millisecond: '%L',
                second: '%L',
                minute: '%L',
                hour: '%L',
                day: '%L',
                week: '%L',
                month: '%L',
                year: '%L'
            },
            title: {
                text: "일차",
            }
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: unit,
            }
        },
        tooltip:{
            formatter: this.x,
            valueSuffix: unit,
            dateTimeLabelFormats:{
                millisecond: '%L일차',
                second: '%L일차',
                minute: '%L일차',
                hour: '%L일차',
                day: '%L일차',
                week: '%L일차',
                month: '%L일차',
                year: '%L일차'
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            animation: true,
            name: chart_name1,
            data: chart_data1,
            color : line_color1
        },{
            animation: true,
            name: chart_name2,
            data: chart_data2,
            color : line_color2
        }]
    });
}

window.addEventListener('resize', function(){
	chart_Wg.reflow();
});




Highcharts.setOptions({
    global: {
        useUTC: false
    }
});