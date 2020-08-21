$(function () {
    function divResize () {
        $('.right-jindu').css('height', $('.pageBox').height() + 'px');
        $('.left-dbsx').css('height', $('.pageBox').height() * 0.4 + 'px');
        var cirWid = $('.left-dbsx').width() * 0.25 - 8 - 20;
        var cirHei = $('.pageBox').height() * 0.4 - 120;
        if (cirWid > cirHei) {
            if (cirHei > 168) {
                $('.circle_r').css({
                    'height': '168px',
                    'width': '168px',
                    'line-height': '168px',
                    'display': 'inline-block'
                });
            } else {
                $('.circle_r').css({
                    'height': cirHei + 'px',
                    'width': cirHei + 'px',
                    'line-height': cirHei + 'px',
                    'display': 'inline-block'
                });
            }
        } else {
            if (cirWid > 168) {
                $('.circle_r').css({
                    'height': '168px',
                    'width': '168px',
                    'line-height': '168px',
                    'display': 'inline-block'
                });
            } else {
                $('.circle_r').css({
                    'height': cirWid + 'px',
                    'width': cirWid + 'px',
                    'line-height': cirWid + 'px',
                    'display': 'inline-block'
                });
            }
        }
        $('.left-byzztj').css('height', $('.pageBox').height() * 0.6 - 20 + 'px');
    }
    var zcsqNum = '';
    var hzsqNum = '';
    var zcjsNum = '';
    var hzjsNum = '';
    var color1 = ['#2BC807', '#3B76F6'];
    var color2 = ['#2BC807', '#FD6161'];
    var color3 = ['#3B76F6', '#F7AA2A'];
    var legData1 = ['转出','回转'];
    var legData2 = ['转出','回转'];
    var legData3 = ['接收','回转'];
    var zhPie = echarts.init(document.getElementById("zhPie"));
    var ksZrPie = echarts.init(document.getElementById('ksZrPie'));
    var ksHzPie = echarts.init(document.getElementById('ksHzPie'));
    getCharts();
    function getCharts(){
        getAjax('/home/myToDo', {}, function (resultMsg) {
            $('#zcsq').html(resultMsg.data.turnOut);
            $('#hzsq').html(resultMsg.data.turnBack);
            $('#zcjs').html(resultMsg.data.turnInAcc);
            $('#hzjs').html(resultMsg.data.turnBackAcc);
            zcsqNum = resultMsg.data.turnOut;
            hzsqNum = resultMsg.data.turnBack;
            zcjsNum = resultMsg.data.turnInAcc;
            hzjsNum = resultMsg.data.turnBackAcc;
            getAjax('/stat/statTurnChart', {}, function (resultMsg) {
                // 年度转出&回转申请占比
                var pieData1 = resultMsg.data.list1;
                var pieser1 = [
                    {value: pieData1[0].value, name: pieData1[0].name},
                    {value: pieData1[1].value, name: pieData1[1].name},
                ];
                var zhPieopt = pieOpt('', color1, legData1, pieser1);
                zhPie.setOption(zhPieopt);
                // 年度转出&回转占比
                var pieData2 = resultMsg.data.list2;
                var pieser2 = [
                    {value: zcsqNum, name: pieData2[0].name},
                    {value: hzjsNum, name: pieData2[1].name},
                ];
                var ksZrPieopt = pieOpt('', color2, legData2, pieser2);
                ksZrPie.setOption(ksZrPieopt);
                // 年度接收&回转占比
                var pieData3 = resultMsg.data.list3;
                var pieser3 = [
                    {value: zcjsNum, name: pieData3[0].name},
                    {value: hzsqNum, name: pieData3[1].name},
                ];
                var ksHzPieopt = pieOpt('', color3, legData3, pieser3);
                ksHzPie.setOption(ksHzPieopt);
            });
        });

    }
    function pieOpt(text, colors, legendData, serData) {
        var opt = {
            title: {
                text: text,
                x: 'left',
                textStyle: {
                    fontSize: 16,
                    color:'#43464D'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
            },
            color: colors,
            stillShowZeroSum: false,
            legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 0,
                top: 0,
                bottom: 20,
                icon: 'square',
                data: legendData,
                selected: false
            },
            series: [
                {
                    type: 'pie',
                    radius: '70%',
                    center: ['43%', '50%'],
                    data: serData,
                    label: {
                        normal: {
                            position: 'inner',//隐藏引导线
                            show : false//隐藏标识文字
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            ]
        }
        return opt;
    }
    $('.circle_box').on('click','a',function () {
        if($(this).parent('li').index() === 0){
            jumpGuanxi('转出申请','outTransfer.html');
        }else if($(this).parent('li').index() === 1){
            jumpGuanxi('回转转诊','rotaryTransfer.html');
        }if($(this).parent('li').index() === 2){
            jumpGuanxi('接收转入','acceptTransfer.html');
        }if($(this).parent('li').index() === 3){
            jumpGuanxi('回转列表','rotaryList.html');
        }
    });
    divResize();
    window.onresize = divResize;
    // window.onresize = resize;
    // function resize() {
    //     zhPie.resize();
    //     ksZrPie.resize();
    //     ksHzPie.resize();
    // }
})