// $(function () {
    function divResize () {
        $('.bodyBox').css('height', '100%').css('height', '-=50px');
        $('.rightCont').css('width', '100%').css('width', '-=220px');
        $('#mainIframe').css('height', '100%').css('height', '-=100px');
        $('.menubox').css('overflow-y', 'scroll');
        $('.menubox').css('height', '100%').css('height', '-=50px');
        $('.menubox').css('width', '100%').css('width', '+=18px');
        $('.headbox').css('width', '100%');
        // $('.head-left').css('width', '100%').css('width', '-=200px');
        $('.head-left').css('width', '100%');
        menuWid();
    }
    divResize();
    window.onresize = divResize;
    function menuWid () {
        var liWid = $('.tab-li').eq(1).width();
        var liLen = $('.tab-li').length;
        $('.tab-ul').css('width', ((liLen - 1) * liWid + 88) + 'px');
        $('.menu-box-wid').css('width', ($('.tab-ul').width() + 20) + 'px');
        var maxbox = $('.head-left').width() - 40;
        if ($('.menu-box-wid').width() < maxbox) {
            $('.menu-box').css('width', $('.menu-box-wid').width() + 'px');
            $('.arrow-btn').html('');
        } else {
            $('.menu-box').css('width', maxbox + 'px')
            $('.arrow-l').html('<i class="iconfont">&#xe62b;</i>');
            $('.arrow-r').html('<i class="iconfont">&#xe62a;</i>');
        }
        // 滚动
        for (var i = 0; i < $('.tab-li').length; i++) {
            if ($('.tab-li').eq(i).hasClass('act-tab')) {
                $('.menu-box').scrollLeft(liWid * (i - 1) + 88);
            }
        }
    }
    // 左右滚动
    $('.arrow-l').click(function () {
        var liWid = $('.tab-li').eq(1).width();
        var scL = $('.menu-box').scrollLeft();
        $('.menu-box').scrollLeft(scL - liWid);
    })
    $('.arrow-r').click(function () {
        var liWid = $('.tab-li').eq(1).width();
        var scL = $('.menu-box').scrollLeft();
        $('.menu-box').scrollLeft(scL + liWid);
    })

    // 全部的tab标签的src
    var tabSrc = [];
    $('.menubox').on('click', '.menu-div', function () {
        var pf = $(this).parent('li').parent('ul');
        var urls = $(this).attr('src');
        if (pf.hasClass('erji-ul')) {
            // 二级菜单
            $('.erji-ul').find('.menu-li').removeClass('erji-divact');
            $(this).parent('li').addClass('erji-divact');
        } else {
            // 一级菜单
            $('.menu-li').removeClass('yiji-divact');
            $(this).parent('.menu-li').addClass('yiji-divact');
        }
        if (urls != undefined) {
            // 增加tab
            var $this = $(this);
            var menusrc = $this.attr('src');
            var menuName = $this.children('span').html();
            $('#mainIframe').attr('src', urls);
            if (tabSrc.join(',').indexOf(menusrc) < 0) {
                // 去掉补位li的act样式
                $('.mend-head').removeClass('mend-act');
                $('.mend-foot').addClass('mend-act');
                tabSrc.push(menusrc);
                // 底部圆角切换
                $('.tab-li').children('div').css('border-bottom-right-radius', '0px');
                $('.tab-li').children('div').css('border-bottom-left-radius', '0px');
                $('.tab-li').eq(tabSrc.length - 1).children('div').css('border-bottom-right-radius', '10px');
                $('.tab-li').removeClass('act-tab');
                $('.tab-ul').append(' <li class="tab-li act-tab" src="' + menusrc + '">' +
                    '<div><span>' + menuName + '</span>' +
                    '<i class="iconfont iconBtn">&#xe716;</i></div></li>');
            } else {
                $('.tab-li').removeClass('act-tab');
                // 清除底部圆角
                $('.tab-li').children('div').css('border-bottom-right-radius', '0px');
                $('.tab-li').children('div').css('border-bottom-left-radius', '0px');
                for (var i = 0; i < $('.tab-li').length; i++) {
                    if ($('.tab-li').eq(i).attr('src').indexOf(urls) > -1) {
                        $('.tab-li').eq(i - 1).children('div').css('border-bottom-right-radius', '10px');
                        if (i == ($('.tab-li').length - 1)) {
                            $('.mend-foot').addClass('mend-act');
                        } else {
                            $('.mend-foot').removeClass('mend-act');
                            $('.tab-li').eq(i + 1).children('div').css('border-bottom-left-radius', '10px');
                        }
                        $('.tab-li').eq(i).addClass('act-tab');
                    }
                }
            }
        }
        menuWid();
    });
    // 点击tab切换
    $('.tab-ul').on('click', '.tab-li', function () {
        var urls = $(this).attr('src');
        // if (!$(this).hasClass('act-tab')) {
            $('.tab-li').removeClass('act-tab');
            $(this).addClass('act-tab');
            $('#mainIframe').attr('src', urls);
        // }
        $('.erji-ul').find('.menu-li').removeClass('erji-divact');
        $('.menu-li').removeClass('yiji-divact');
        for (var i = 0; i < $('.menu-div').length; i++) {
            var menui = $('.menu-div').eq(i);
            if (menui.attr('src') == urls) {
                $('.erji-ul').find('.menu-li').removeClass('erji-divact');
                menui.parent('li').addClass('erji-divact');
                $('.menu-li').removeClass('yiji-divact');
                menui.parent().parent().parent('.menu-li').addClass('yiji-divact');
            }
        }
        // 底部圆角切换
        var ind = $(this).index();
        var len = $('.tab-li').length;
        // 清除
        $('.mend-head').removeClass('mend-act');
        $('.mend-foot').removeClass('mend-act');
        $('.tab-li').children('div').css('border-bottom-right-radius', '0px');
        $('.tab-li').children('div').css('border-bottom-left-radius', '0px');
        // 只有首页，点击首页
        if (len == 1) {
            $('.mend-head').addClass('mend-act');
            $('.mend-foot').addClass('mend-act');
        } else {
            if (ind == 0) {
                $('.mend-head').addClass('mend-act');
                $('.tab-li').eq(ind + 1).children('div').css('border-bottom-left-radius', '10px');
                // $('.mend-foot').addClass('mend-act');
            } else if (ind == (len - 1)) {
                $('.tab-li').eq(ind - 1).children('div').css('border-bottom-right-radius', '10px');
                $('.mend-foot').addClass('mend-act');
            } else {
                $('.tab-li').eq(ind + 1).children('div').css('border-bottom-left-radius', '10px');
                $('.tab-li').eq(ind - 1).children('div').css('border-bottom-right-radius', '10px');
            }
        }
        menuWid();
    });
    // 关闭tab页签
    $('.tab-ul').on('click', '.iconBtn', function (e) {
        if(e && e.stopPropagation) {
            e.stopPropagation();
        }
        // IE 浏览器
        window.event.cancelBubble = true;
        // 清除
        $('.mend-head').removeClass('mend-act');
        $('.mend-foot').removeClass('mend-act');
        var $this = $(this);
        var tabli = $this.parent().parent();
        var tabind = tabli.index();
        var pageUrl = $('#mainIframe').attr('src');
        if (tabli.hasClass('act-tab')) {
            if (tabSrc.length == 1) {
                pageUrl = 'home.html'
                $('.tab-li').eq(0).addClass('act-tab');
                $('.erji-ul').find('.menu-li').removeClass('erji-divact');
                $('.menu-li').removeClass('yiji-divact');
                $('.tab-ul').css('width', 'auto');
            } else {
                if (tabind == tabSrc.length) {
                    pageUrl = tabli.prev().attr('src');
                    tabli.prev().addClass('act-tab');
                } else {
                    pageUrl = tabli.next().attr('src');
                    $('.tab-li').removeClass('act-tab');
                    tabli.next().addClass('act-tab');
                }
            }
            $('#mainIframe').attr('src', pageUrl);
        }
        // 删除数组，删除li
        tabSrc.splice(tabind - 1, 1);
        tabli.remove();
        if (tabli.hasClass('act-tab')) {
            $('.tab-li').children('div').css('border-bottom-right-radius', '0px');
            $('.tab-li').children('div').css('border-bottom-left-radius', '0px');
            if (tabSrc.length == 0) {
                $('.mend-head').addClass('mend-act');
                $('.mend-foot').addClass('mend-act');
            } else {
                if (tabind == tabSrc.length + 1) {
                    $('.act-tab').prev().children('div').css('border-bottom-right-radius', '10px');
                    $('.mend-foot').addClass('mend-act');
                }
            }
        } else {
            $('.tab-li').children('div').css('border-bottom-right-radius', '0px');
            $('.tab-li').children('div').css('border-bottom-left-radius', '0px');
            $('.act-tab').prev().children('div').css('border-bottom-right-radius', '10px');
            if (tabind == tabSrc.length) {
                $('.mend-foot').addClass('mend-act');
            } else {
                if ($('.act-tab').index() == tabSrc.length) {
                    $('.mend-foot').addClass('mend-act');
                }
                $('.act-tab').next().children('div').css('border-bottom-left-radius', '10px');
            }
        }
        for (var i = 0; i < $('.menu-div').length; i++) {
            var menui = $('.menu-div').eq(i);
            if (menui.attr('src') == pageUrl) {
                $('.erji-ul').find('.menu-li').removeClass('erji-divact');
                menui.parent('li').addClass('erji-divact');
                $('.menu-li').removeClass('yiji-divact');
                menui.parent().parent().parent('.menu-li').addClass('yiji-divact');
            }
        }
        menuWid();
    });
    // 退出登录
    $('.logout').click(function () {
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.open({
                id: 'login',
                type: 1,
                title: '提示',
                skin: 'my-layui-layer', //样式类名
                area: ['360px', '180px'],
                shadeClose: true,
                shade: 0.2,
                content: '<div style="padding: 20px;text-align: center">确认退出系统吗</div>', //iframe的url
                btn: ['关闭', '确认'],
                btn2: function (win) {
                    // getAjax('/login/exit', {}, function (resultMsg) {
                    //     if (resultMsg.retCode == 0) {
                    //         localStorage.setItem('authToken', '');
                    //         window.location.href = '../login.html';
                    //         layer.close(win);
                    //     }
                    // });
                    $.ajax({
                        type: 'get',
                        dataType: "jsonp",
                        jsonp: "callback",//服务端用于接收
                        async: false,
                        contentType: 'application/json',
                        url: noLoghin + '/login/exit',
                        data: {authToken: localStorage.getItem('authTokenTreat')},
                        success: function (resultMsg) {
                            if (resultMsg.retCode == 0) {
                                localStorage.setItem('authToken', '');
                                window.location.href = '../login.html';
                                layer.close(win);
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            console.log(XMLHttpRequest);
                            console.log(textStatus);
                            console.log(errorThrown);
                            alert('加载资源失败');
                        }
                    });
                    return false;
                }
            });
        });
    });
    // 修改密码
    $('.changePassword').click(function () {
        layui.use(['layer','form'], function(){
            var layer = layui.layer;
            var form = layui.form;
            // 密码验证
            form.verify({
                pass: [
                    /^[0-9A-Za-z]{6,12}$/
                    ,'密码为6~12位的英文、数字 或者他们的组合'
                ]
            });
            layer.open({
                type:1,
                title: '修改密码',
                skin: 'my-layui-layer', //样式类名
                area: ['450px', '330px'],
                content: $('#pwdPop'),
                btn: ['关闭', '确认'],
                btn1: function (index) {
                    layer.close(index);
                },
                btn2: function (index) {
                    $('#addBtn').click();
                    return false;
                }
            });
            $('#addBtn').click(function () {
                form.on('submit(addBtn)', function(data){
                    var oldPassword = data.field.password_old;
                    var newPassword = data.field.password;
                    var newPassword2 = data.field.password_t;
                    if(newPassword !== newPassword2){
                        layer.msg('两次密码不一致',{
                            time:2000,
                            icon:5,
                            anim: 6
                        });
                        return false
                    }else {
                        var jsonParam = {
                            oldPassword:oldPassword,
                            newPassword: newPassword, // 新密码
                        };
                        getAjax('/sys/user/updateUserPassword', jsonParam, function (resultMsg) {
                            layer.open({
                                title: '提示',
                                icon: 1,
                                content: '保存成功',
                                skin: 'my-layui-layer',
                                btn: ['关闭', '确认'],
                                btn1: function () {
                                    layer.closeAll();
                                },
                                btn2: function () {
                                    layer.closeAll();
                                    $("#addform")[0].reset();
                                }
                            })
                        });
                    }
                    return false
                });
            });
        });
    });

    var menuObj = [
        {
            name: '转出管理',
            icon: '&#xe607;',
            children: [
                {
                    name: '转出管理',
                    icon: '',
                    src: 'outTransfer.html'
                },
                {
                    name: '回转列表',
                    icon: '',
                    src: 'rotaryList.html'
                }
            ]
        },
        {
            name: '转入管理',
            icon: '&#xe607;',
            children: [
                {
                    name: '接收转入',
                    icon: '',
                    src: 'acceptTransfer.html'
                },
                {
                    name: '回转列表',
                    icon: '',
                    src: 'rotaryTransfer.html'
                }
            ]
        }
    ]

    // 获取登录的详细信息
    var loginUserInfo = {};
    getAjax('/sys/user/getLoginUserInfo', {}, function (resultMsg) {
        loginUserInfo = resultMsg.data;
        localStorage.setItem('roleCode',loginUserInfo.role.roleCode);
        localStorage.setItem('roleType',loginUserInfo.role.roleType);
        var homeIframe = $("#mainIframe").contents().find("#homeIframe");
        gethome(homeIframe,loginUserInfo.role.roleType);
        if (loginUserInfo.name.length > 6) {
            $('#username').html(loginUserInfo.name.substring(0,6) + '..');
        } else {
            $('#username').html(loginUserInfo.name);
        }
        $('#username').attr('title', loginUserInfo.name);
    });
    function gethome (homeIframe, type) {
        if (type == '99' || type == '3') {
            homeIframe.attr('src','home2.html');
        } else if (type == '1' || type == '2') {
            homeIframe.attr('src','home1.html');
        }
    }
    getSysName();
    function getSysName() {
        $.ajax({
            type: 'get',
            dataType: "jsonp",
            jsonp: "callback",//服务端用于接收
            async: false,
            contentType: 'application/json',
            url: noLoghin + '/sys/platform/show',
            data: {},
            success: function (resultMsg) {
                $('#sysBox').find('img').attr('src', resultMsg.data.logo);
                $('#sysBox').find('span').html(resultMsg.data.name);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
                alert('加载资源失败');
            }
        });
    }
    // allMenu();
    var menuList = [];
    var menuZCSQ = []; // 转出申请
    var menuHZZZ = []; // 回转转诊
    var menuYYGL = []; // 医院管理
    var menuKSGL = []; // 科室管理
    var menuYSGL = []; // 医生管理
    var html = '';
    getAjax('/sys/function/getFunListByRoleId',{},function (resultMsg) {
        menuList = resultMsg.data;
        if (menuList) {
            $.each(menuList, function (i, menuItem) {
                if (menuItem.name == '转出管理') {
                    $.each(menuItem.funList, function (i, pageItem) {
                        if (pageItem.name == '转出申请') {
                            menuZCSQ = pageItem.funList;
                            menuZCSQ.sort(function(a,b){
                                // order是规则  objs是需要排序的数组
                                var order = ['审核', '撤回', '修改', '删除', '查看', '退回', '提交', '添加转出单'];
                                return order.join(',').indexOf(a.name) - order.join(',').indexOf(b.name);
                            });
                        }
                    });
                } else if (menuItem.name == '转入管理') {
                    $.each(menuItem.funList, function (i, pageItem) {
                        if (pageItem.name == '回转转诊') {
                            menuHZZZ = pageItem.funList;
                            menuHZZZ.sort(function(a,b){
                                // order是规则  objs是需要排序的数组
                                var order = ['审核', '撤回', '修改', '删除', '查看', '退回', '提交', '添加转出单'];
                                return order.join(',').indexOf(a.name) - order.join(',').indexOf(b.name);
                            });
                        }
                    });
                } else if (menuItem.name == '系统管理') {
                    $.each(menuItem.funList, function (i, pageItem) {
                        if (pageItem.name == '医院管理') {
                            menuYYGL = pageItem.funList;
                            menuYYGL.sort(function(a,b){
                                // order是规则  objs是需要排序的数组
                                var order = ['修改', '删除'];
                                return order.join(',').indexOf(a.name) - order.join(',').indexOf(b.name);
                            });
                        } else if (pageItem.name == '科室管理') {
                            menuKSGL = pageItem.funList;
                            menuKSGL.sort(function(a,b){
                                // order是规则  objs是需要排序的数组
                                var order = ['修改', '删除'];
                                return order.join(',').indexOf(a.name) - order.join(',').indexOf(b.name);
                            });
                        } else if (pageItem.name == '医生管理') {
                            menuYSGL = pageItem.funList;
                            menuYSGL.sort(function(a,b){
                                // order是规则  objs是需要排序的数组
                                var order = ['修改', '删除'];
                                return order.join(',').indexOf(a.name) - order.join(',').indexOf(b.name);
                            });
                        }
                    });
                }
                html += '<li class="menu-li">' +
                    '<div class="menu-div">' +
                    '<i class="iconfont">' + menuItem.icon + '</i>' +
                    '<span>' + menuItem.name + '</span>' +
                    '</div><ul class="menu-ul erji-ul">';
                $.each(menuItem.funList, function (i, pageItem) {
                    html += '<li class="menu-li">' +
                        '<div class="menu-div" src="' + pageItem.url + '">' +
                        '<i class="iconfont"></i>' +
                        '<span>' + pageItem.name + '</span>' +
                        '</div></li>';
                });
                html += '</ul></li>';
            });
            $('#menuUlBox').html(html);
        }
    });
// });