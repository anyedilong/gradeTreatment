// 跳转关系页面
function jumpGuanxi(hospitalId) {
    var tabSrc = parent.tabSrc;
    var menusrc = 'rotaryTransfer.html';
    if (tabSrc.join(',').indexOf(menusrc) < 0) {
        // 去掉补位li的act样式
        $('.mend-head', window.parent.document).removeClass('mend-act');
        $('.mend-foot', window.parent.document).addClass('mend-act');
        tabSrc.push(menusrc);
        // 底部圆角切换
        $('.tab-li', window.parent.document).children('div').css('border-bottom-right-radius', '0px');
        $('.tab-li', window.parent.document).children('div').css('border-bottom-left-radius', '0px');
        $('.tab-li', window.parent.document).eq(tabSrc.length - 1).children('div').css('border-bottom-right-radius', '10px');
        $('.tab-li', window.parent.document).removeClass('act-tab');
        $('.tab-ul', window.parent.document).append(' <li class="tab-li act-tab" src="' + menusrc + '">' +
            '<div><span>回转转诊</span>' +
            '<i class="iconfont iconBtn">&#xe716;</i></div></li>');
        menuWid();
    } else {
        $('.tab-li', window.parent.document).removeClass('act-tab');
        // 清除底部圆角
        $('.tab-li', window.parent.document).children('div').css('border-bottom-right-radius', '0px');
        $('.tab-li', window.parent.document).children('div').css('border-bottom-left-radius', '0px');
        for (var i = 0; i < $('.tab-li', window.parent.document).length; i++) {
            if ($('.tab-li', window.parent.document).eq(i).attr('src').indexOf(menusrc) > -1) {
                $('.tab-li', window.parent.document).eq(i - 1).children('div').css('border-bottom-right-radius', '10px');
                if (i == ($('.tab-li', window.parent.document).length - 1)) {
                    $('.mend-foot', window.parent.document).addClass('mend-act');
                } else {
                    $('.mend-foot', window.parent.document).removeClass('mend-act');
                    $('.tab-li', window.parent.document).eq(i + 1).children('div').css('border-bottom-left-radius', '10px');
                }
                $('.tab-li', window.parent.document).eq(i).addClass('act-tab');
            }
        }
    }
    for (var i = 0; i < $('.menu-div', window.parent.document).length; i++) {
        var menui = $('.menu-div', window.parent.document).eq(i);
        if (menui.attr('src') == 'rotaryTransfer.html') {
            $('.erji-ul', window.parent.document).find('.menu-li').removeClass('erji-divact');
            menui.parent('li').addClass('erji-divact');
            $('.menu-li', window.parent.document).removeClass('yiji-divact');
            menui.parent().parent().parent('.menu-li').addClass('yiji-divact');
        }
    }
    window.location.href = 'rotaryTransferAdd.html?type=jszr&id=' + hospitalId;
    return false;
}
// 菜单变化
function menuWid () {
    var liWid = $('.tab-li', window.parent.document).eq(1).width();
    var liLen = $('.tab-li', window.parent.document).length;
    $('.tab-ul', window.parent.document).css('width', ((liLen - 1) * liWid + 88) + 'px');
    $('.menu-box-wid', window.parent.document).css('width', ($('.tab-ul', window.parent.document).width() + 20) + 'px');
    var maxbox = $('.head-left', window.parent.document).width() - 40;
    if ($('.menu-box-wid', window.parent.document).width() < maxbox) {
        $('.menu-box', window.parent.document).css('width', $('.menu-box-wid', window.parent.document).width() + 'px');
        $('.arrow-btn', window.parent.document).html('');
    } else {
        $('.menu-box', window.parent.document).css('width', maxbox + 'px')
        $('.arrow-l', window.parent.document).html('<i class="iconfont">&#xe62b;</i>');
        $('.arrow-r', window.parent.document).html('<i class="iconfont">&#xe62a;</i>');
    }
    // 滚动
    for (var i = 0; i < $('.tab-li').length; i++) {
        if ($('.tab-li', window.parent.document).eq(i).hasClass('act-tab')) {
            $('.menu-box', window.parent.document).scrollLeft(liWid * (i - 1) + 88);
        }
    }
}