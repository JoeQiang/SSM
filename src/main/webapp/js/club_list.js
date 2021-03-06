var page = 1,
    rows = 10;
$(document).ready(function () {
    initJqPaginator();
    //加载俱乐部列表
    load_club_list();
    $(".query_but").click(function () {//查询按钮
        page = 1;
        load_club_list();
    });
    //跳转到场馆登记
    $('.go_register').click(function () {
        window.location.href = getPath() + "/page/club_register.jsp";
    });
});
//初始化分页
function initJqPaginator() {
    $.jqPaginator('#pagination', {
        totalPages: 100,
        visiblePages: 10,
        currentPage: 1,
        first: '<li class="prev"><a href="javascript:;">首页</a></li>',
        last: '<li class="prev"><a href="javascript:;">末页</a></li>',
        prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
        next: '<li class="next"><a href="javascript:;">下一页</a></li>',
        page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
        onPageChange: function (num, type) {
            page = num;
            if (type == "change") {
                load_club_list();
            }
        }
    });
}
//俱乐部列表
function create_club_list(clubs) {
    var club = clubs.club;
    var user = clubs.user;
    var phone = (club.phone != "" ? (club.phone) : (club.servicePhone));
    var authText = "未授权";
    if (club.isAuthority == 2) {
        authText = "已授权";
    }
    var html = '<div class="product_box">'
        + '<div class="br">'
        + '<div class="product_link">'
        + '<div class="product_phc">'
        + '<img class="phc" src="' + fileSystemPath + '/Image/club/' + club.logo + '" onerror="imgError(this,\'club_logo\')" >'
        + '</div>'
        + '<span class="product_name">' + club.name + '</span></div>'
        + '<div class="product_link toto">' + authText + '</div>'
        + '<div class="product_link toto">'
        + '<span>' + user.userName + '</span>'
        + '</div>'
        + '<div class="product_link toto">'
        + '<span>' + phone + '</span></div>'
        + '<div class="product_link toto">'
        + '<span>' + club.coordination + '</span></div>'
        + '<div class="product_link toto product_operation">'
        + '<span onclick="edit_club(' + club.clubId + ')">编辑</span>'
        + '<span onclick="edit_del(' + club.clubId + ')">删除</span></div></div>'
        + '</div>';
    return html;
}
//加载俱乐部列表
function load_club_list() {
    var name = $("#name").val();
    var isAuthority = $("#authorization").val();
    $.ajax({
        type: 'POST',
        url: getPath() + '/club_list.action',
        async: false,
        data: {name: name, page: page, pageSize: rows, isAuthority: isAuthority},
        datatype: 'json',
        success: function (data) {
            if (data.result == 1) {
                $(".product_length_number").html(data.data.count);
                var html = "";
                var count = data.data.count;
                for (var i = 0; i < data.data.clubs.length; i++) {
                    var clubs = data.data.clubs[i];
                    html += create_club_list(clubs);
                }
                $(".product_content").html(html);
                //这里是分页的插件
                $('#pagination').jqPaginator('option', {
                    totalPages: (Math.ceil(count / rows) < 1 ? 1 : Math.ceil(count / rows)),
                    currentPage: page
                });
            } else {
                alert(data.msg);
            }
        }
    });
    $(".product_box:even").css("background", "#e6e6e6");//隔行变色
}
function edit_club(clubId) {
    window.location.href = getPath() + "/page/club_register.jsp?clubId=" + clubId;
}
function edit_del(clubId) {
    var sure = confirm("确认删除吗？");
    if (sure) {
        $.ajax({
            type: 'POST',
            url: getPath() + '/club_delete.action',
            async: false,
            data: {clubId: clubId},
            datatype: 'json',
            success: function (data) {
                if (data.result == 1) {
                    alert("删除成功");
                    window.location.reload();
                } else {
                    alert(data.msg);
                }
            }
        })
    }
}