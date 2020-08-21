// 跳转关系页面
function jumpGuanxi(jumpTitle,jumpUrl) {
    var tabSrc = parent.parent.tabSrc;
    var menusrc = jumpUrl;
    if (tabSrc.join(',').indexOf(menusrc) < 0) {
        // 去掉补位li的act样式
        $('.mend-head', parent.parent.document).removeClass('mend-act');
        $('.mend-foot', parent.parent.document).addClass('mend-act');
        tabSrc.push(menusrc);
        // 底部圆角切换
        $('.tab-li', parent.parent.document).children('div').css('border-bottom-right-radius', '0px');
        $('.tab-li', parent.parent.document).children('div').css('border-bottom-left-radius', '0px');
        $('.tab-li', parent.parent.document).eq(tabSrc.length - 1).children('div').css('border-bottom-right-radius', '10px');
        $('.tab-li', parent.parent.document).removeClass('act-tab');
        $('.tab-ul', parent.parent.document).append(' <li class="tab-li act-tab" src="' + menusrc + '">' +
            '<div><span>'+jumpTitle+'</span>' +
            '<i class="iconfont iconBtn">&#xe716;</i></div></li>');
        menuWid();
    } else {
        $('.tab-li', parent.parent.document).removeClass('act-tab');
        // 清除底部圆角
        $('.tab-li', parent.parent.document).children('div').css('border-bottom-right-radius', '0px');
        $('.tab-li', parent.parent.document).children('div').css('border-bottom-left-radius', '0px');
        for (var i = 0; i < $('.tab-li', parent.parent.document).length; i++) {
            if ($('.tab-li', parent.parent.document).eq(i).attr('src').indexOf(menusrc) > -1) {
                $('.tab-li', parent.parent.document).eq(i - 1).children('div').css('border-bottom-right-radius', '10px');
                if (i == ($('.tab-li', parent.parent.document).length - 1)) {
                    $('.mend-foot', parent.parent.document).addClass('mend-act');
                } else {
                    $('.mend-foot', parent.parent.document).removeClass('mend-act');
                    $('.tab-li', parent.parent.document).eq(i + 1).children('div').css('border-bottom-left-radius', '10px');
                }
                $('.tab-li', parent.parent.document).eq(i).addClass('act-tab');
            }
        }
    }
    for (var i = 0; i < $('.menu-div', parent.parent.document).length; i++) {
        var menui = $('.menu-div', parent.parent.document).eq(i);
        if (menui.attr('src') == menusrc) {
            $('.erji-ul', parent.parent.document).find('.menu-li').removeClass('erji-divact');
            menui.parent('li').addClass('erji-divact');
            $('.menu-li', parent.parent.document).removeClass('yiji-divact');
            menui.parent().parent().parent('.menu-li').addClass('yiji-divact');
        }
    }
    // window.location.href = 'referralRelationship.html?hospitalId=' + hospitalId;
    window.location.href = menusrc;
    return false;
}
// 菜单变化
function menuWid () {
    var liWid = $('.tab-li', parent.parent.document).eq(1).width();
    var liLen = $('.tab-li', parent.parent.document).length;
    $('.tab-ul', parent.parent.document).css('width', ((liLen - 1) * liWid + 88) + 'px');
    $('.menu-box-wid', parent.parent.document).css('width', ($('.tab-ul', parent.parent.document).width() + 20) + 'px');
    var maxbox = $('.head-left', parent.parent.document).width() - 40;
    if ($('.menu-box-wid', parent.parent.document).width() < maxbox) {
        $('.menu-box', parent.parent.document).css('width', $('.menu-box-wid', parent.parent.document).width() + 'px');
        $('.arrow-btn', parent.parent.document).html('');
    } else {
        $('.menu-box', parent.parent.document).css('width', maxbox + 'px')
        $('.arrow-l', parent.parent.document).html('<i class="iconfont">&#xe62b;</i>');
        $('.arrow-r', parent.parent.document).html('<i class="iconfont">&#xe62a;</i>');
    }
    // 滚动
    for (var i = 0; i < $('.tab-li').length; i++) {
        if ($('.tab-li', parent.parent.document).eq(i).hasClass('act-tab')) {
            $('.menu-box', parent.parent.document).scrollLeft(liWid * (i - 1) + 88);
        }
    }
}