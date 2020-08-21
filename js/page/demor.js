$(function () {
    function boxWid(){
        var b_box = $(".pie_box").width()
        if(b_box < 1500){
            $(".pie_box_t ").css("width","100%").css("margin-right","0")
        }else{
            $(".pie_box_t").css("width","32.6%")
            $(".mg_r").css("margin-right","1%")
        }
    }
    boxWid()
    // var year = ''
    // var date=new Date;
    // var y = date.getFullYear()
    // for(var i = 1900; i <= y; i++){
    //     year +=  '<option value="'+i+'">'+i+'年</option>'
    // }
    // $("#yearList").append(year)
    // var month = ''
    // for(var i = 1; i <= 12; i++){
    //     if(i<10){
    //         month +=  '<option value="0'+i+'">0'+i+'月</option>'
    //     }else{
    //         month +=  '<option value="'+i+'">'+i+'月</option>'
    //     }
    // }
    // $("#monthList").append(month)
    var jsonParam = {
        year:'',
        month:'',
        keshi:''
    }
    layui.use('form', function(){
        var form = layui.form
            ,layer = layui.layer
        var date = new Date;
        var y = date.getFullYear();
        getTime();
        function getTime () {
            var year = '';
            for(var i = y; i > 2000; i--){
                year +=  '<option value="' + i + '">' + i + '年</option>';
            }
            $("#yearList").append(year);
            $("#yearList").val(y);
            var month = '';
            for(var i = 1; i <= 12; i++){
                if(i < 10){
                    month +=  '<option value="0'+i+'">' + i + '月</option>';
                }else{
                    month +=  '<option value="'+i+'">' + i + '月</option>';
                }
            }
            $("#monthList").append(month);
            form.render();
        }
        // 查询科室列表
        getArea();
        function getArea(){
            var jsonParamk = {
                codeOrName :'',
                pageSize:'1000',
                orgId : parent.loginUserInfo.orgId,
            }
            getAjax('/sys/dep/getOrgDepList', jsonParamk, function (resultMsg) {
                $.each(resultMsg.data, function (i, item) {
                    $("#deptList").append('<option value="' + item.id + '">' + item.dep_name + '</option>');
                });
                layui.form.render("select");
            })
        }
        //监听搜索
        form.on('submit(search)', function(data){
            // console.log(data.field)
            jsonParam.year = data.field.year
            jsonParam.month = data.field.month
            jsonParam.depId = data.field.keshi
            getCharts(jsonParam)
            return false
        });
    });
    getCharts(jsonParam)
    function getCharts(jsonParam){
        var color2 = ['#2BC807', '#F7AA2A'];
        var legData2 = ['转入','回转'];
        var paiban = echarts.init(document.getElementById('barcharts'));
        getAjax('/stats/statsTurnAndRotray', jsonParam, function (resultMsg) {
            var xdatabar = resultMsg.data.xList
            var barser = [
                {
                    name: legData2[0],
                    data: resultMsg.data.y1List,
                    // data: [320, 362, 301, 134, 590],
                    type: 'bar',
                    barWidth: 12
                },
                {
                    name: legData2[1],
                    data: resultMsg.data.y2List,
                    // data: [220, 332, 301, 334, 390],
                    type: 'bar',
                    barWidth: 12
                },
            ];
            var paibanopt = chartOpt(xdatabar, color2, legData2, barser, 'shadow');
            paiban.setOption(paibanopt);
        });
        function chartOpt(xData, colors, legendData, serData , type) {
            var opt = {
                xAxis: {
                    type: 'category',
                    data: xData,
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: '#F2F6FA',
                            width: '1'//坐标线的宽度
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#A3A8AE'
                        }
                    },
                },
                yAxis:  {
                    minInterval: 1,
                    type : 'value',
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: 'none',//左边线的颜色
                            width: '1'//坐标线的宽度
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#A3A8AE'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: ['#F2F6FA']
                        }

                    }
                },
                grid: {
                    left: '3%',
                    right: '0%',
                    bottom: '3%',
                    containLabel: true
                },
                color: colors,
                legend: {
                    data: legendData,
                    x: 'right', y: 'top',
                    textStyle: {color: '#C0C3C7',fontSize: 12},
                    itemWidth: 12,
                    itemHeight: 12,
                    icon: 'roundRect',
                },
                series: serData,
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : type        // 默认为直线，可选为：'line' | 'shadow'
                    }
                }
            };
            return opt;
        }
        // 转出&回转占比
        var zhPie = echarts.init(document.getElementById('zhPie'));
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
            },
            color: ['#32B16C', '#0091FF', '#F7AA2A', '#FD6161'],
            stillShowZeroSum: false,
            series: [
                {
                    name: '转出&回转占比',
                    type: 'pie',
                    radius: '70%',
                    center: ['50%', '57%'],
                    data: [
                        {value: 1, name: '科室名称1'},
                        {value: 3, name: '科室名称2'},
                    ],
                    labelLine: {    //引导线设置
                        normal: {
                            show: true,   //引导线显示
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        zhPie.setOption(option);

        // 科室转入
        var ksZrPie = echarts.init(document.getElementById('ksZrPie'));
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
            },
            stillShowZeroSum: false,
            series: [
                {
                    name: '转出&回转占比',
                    type: 'pie',
                    radius: '70%',
                    center: ['50%', '50%'],
                    data: [
                        {value: 1, name: '科室名称1'},
                        {value: 3, name: '科室名称2'},
                        {value: 7, name: '科室名w称3'},
                        {value: 4, name: '科室名v称4'},
                        {value: 4, name: '科室vbn名称4'},
                        {value: 4, name: '科室名bn称4'},
                        {value: 4, name: '科室bnh名称4'},
                        {value: 4, name: '科室hg名称4'},
                        {value: 4, name: '科室ghg名称4'},
                        {value: 4, name: '科室名称4'},
                        {value: 4, name: '科室bn名称4'},
                        {value: 4, name: '科室h名称4'},
                        {value: 4, name: '科室nf名称4'},
                        {value: 4, name: '科室c名称4'},
                        {value: 4, name: '科室fh名称4'},
                        {value: 4, name: '科室名g称4'},
                        {value: 4, name: '科室g名称h4'},
                        {value: 4, name: '科室名称h4'},
                        {value: 4, name: '科室名称g4'},
                    ],
                    labelLine: {    //引导线设置
                        normal: {
                            show: true,   //引导线显示
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        ksZrPie.setOption(option);

        // 科室回转占比
        var ksHzPie = echarts.init(document.getElementById('ksHzPie'));
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
            },
            // stillShowZeroSum: false,
            series: [
                {
                    name: '转出&回转占比',
                    type: 'pie',
                    radius: '70%',
                    center: ['50%', '50%'],
                    data: [
                        {value: 1, name: '科室名称1'},
                        {value: 3, name: '科室名称2'},
                        {value: 7, name: '科室名w称3'},
                        {value: 4, name: '科室名v称4'},
                        {value: 4, name: '科室vbn名称4'},
                        {value: 4, name: '科室名bn称4'},
                        {value: 4, name: '科室bnh名称4'},
                        {value: 4, name: '科室hg名称4'},
                        {value: 4, name: '科室ghg名称4'},
                        {value: 4, name: '科室名称4'},
                        {value: 4, name: '科室bn名称4'},
                        {value: 4, name: '科室h名称4'},
                        {value: 4, name: '科室nf名称4'},
                        {value: 4, name: '科室c名称4'},
                        {value: 4, name: '科室fh名称4'},
                        {value: 4, name: '科室名g称4'},
                        {value: 4, name: '科室g名称h4'},
                        {value: 4, name: '科室名称h4'},
                        {value: 4, name: '科室名称g4'},
                    ],
                    labelLine: {    //引导线设置
                        normal: {
                            show: true,   //引导线显示
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        ksHzPie.setOption(option);

        // var zhPie = echarts.init(document.getElementById("zhPie"));
        // var ksZrPie = echarts.init(document.getElementById('ksZrPie'));
        // var ksHzPie = echarts.init(document.getElementById('ksHzPie'));
        var jsonParam = {
            year:'2020',
            month:'',
            type:'2', //1为转出2未转入
            depId:''   //科室标识
        }
        getAjax('/stats/statsTurnAndRotray', jsonParam, function (resultMsg) {
            console.log(resultMsg)
        });
        //
        function pieOpt(tittxt,colors, data) {
            var opt = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                color: ['#32B16C', '#0091FF', '#F7AA2A', '#FD6161'],
                series: [
                    {
                        name: '转出&回转占比',
                        type: 'pie',
                        radius: '70%',
                        center: ['50%', '50%'],
                        data: [
                            {value: 1, name: '科室名称1'},
                            {value: 3, name: '科室名称2'},
                            {value: 7, name: '科室名称3'},
                            {value: 4, name: '科室名称4'},
                            {
                                value: data, // 数据值
                                name: tittxt, // 数据项名称
                                selected: false, //该数据项是否被选中
                            }
                        ],
                        labelLine: {    //引导线设置
                            normal: {
                                show: true,   //引导线显示
                            }
                        },
                        emphasis: {
                            itemStyle: {
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

        window.onresize = resize;
        function resize() {
            paiban.resize();
            zhPie.resize();
            ksZrPie.resize();
            ksHzPie.resize();
        }
    }
})