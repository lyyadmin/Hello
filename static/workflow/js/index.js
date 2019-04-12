$(function () {
    Array.prototype.contains = function (needle) {
        for (i in this) {
            if (this[i] == needle) return true;
        }
        return false;
    }
    var w = 0;
    var h = 0;

    function init_size_positon() {
        w = $(document).width();
        h = $(document).height();
        $("#left-menu").css("height", h - 46);
        $("#right-content").css({
            width: (w - 63) + "px",
            height: (h - 46) + "px"
        });
        $("#content-left-menu").css("height", h - 46 - 34 - 46);
        $("#content-right-menu").css("height", h - 46 - 34 - 46);
        $("#work_flow").css({
            width: (w - 587) + "px",
            height: (h - 46 - 29 - 46) + "px"
        });
        $("#m_flow").css("height", h - 46 - 36 - 29 - 46);
        $("#drag_view").css("height", h - 46 - 36 - 29 - 46 - 16);
        $("#m-footer").css({
            width: (w - 63) + "px",
            height: "46px",
            left: 63 + "px",
            top: (h - 92) + "px"
        });
    }

    init_size_positon();
    $(window).resize(function () {
        init_size_positon();
    });
    var menu = document.getElementById("r_menu");
    var isinput = 0;
    var copy_obj;
    $(".r_menu_item").each(function () {
        $(this).click(function (e) {
            var mtd = $(this).attr("method");
            switch (mtd) {
                case "copy":
                    if (copy_form) {
                        copy_obj = get_form_by_id(copy_form);
                    }
                    break;
                case "paste":
                    if (copy_obj) {
                        var size = copy_obj.size();
                        var fw = size[0];
                        var fh = size[1];
                        var x = parseFloat(e.pageX);
                        var y = parseFloat(e.pageY);
                        var px = x - left - fw / 2;
                        var py = y - top - fh / 2;
                        var pid = randomString(9);
                        var elem = $(copy_obj.get_content_element()).clone();
                        var fm = new window.form(fw, fh, px, py, pid, elem, copy_obj.get_color(), copy_obj.get_drag_size());
                        push(forms, fm);
                        $(list).append(fm.get_form_element());
                    }
                    break;
                case "delete":
                    if (del_form) {
                        delete_form_by_id(del_form);
                    }
                    if (del_line) {
                        delete_line_by_lineid(del_line);
                    }
                    break;
                case "add":
                    var x = parseFloat(e.pageX);
                    var y = parseFloat(e.pageY);
                    create_datasource_elem(x, y);
                    show_right_menu();
                    break;
                case "refresh":
                    location.reload();
                    break;
                case "change":
                    if (del_form) {
                        change_form_by_id(del_form);
                        isinput = 1;
                    }
                    break;
                case "start":
                    if (selected_form) {
                        var form = get_form_by_id(selected_form);
                        if (form) {
                            var d = form.data;
                            if (d) {
                                if (d.connect == 0) {
                                    setTimeout(function () {
                                        layer.msg('请连接数据库!', {
                                            icon: 7,
                                            time: 1000
                                        });
                                    }, 500)
                                    return;
                                }
                                var params = d.select_parameters;
                                if (params.length <= 0) {
                                    setTimeout(function () {
                                        layer.msg('请选择参数!', {
                                            icon: 7,
                                            time: 1000
                                        });
                                    }, 500)
                                    return;
                                }
                                var id = selected_form;
                                var keys = params.toString();
                                var datas = {
                                    "mtype": d.type,
                                    "mhost": d.host,
                                    "mport": d.port,
                                    "mdb": d.database,
                                    "muser": d.user,
                                    "mpwd": d.password,
                                    "mtable": d.selecttable,
                                    "mkeys": keys,
                                    "mfunction": form.method
                                };
                                // var wsUri = "ws://192.168.1.104/ws/startrun";
                                // var websocket = new WebSocket(wsUri);
                                // websocket.onopen = function (evt) {
                                //     console.log("onopen");
                                //     change_form_running_status(id, mtd);
                                // };
                                // websocket.onclose = function (evt) {
                                //     console.log("onclose");
                                // };
                                // websocket.onmessage = function (evt) {
                                //     console.log("onmessage:" + evt.data);
                                //     if (evt.data == "100") {
                                //         change_form_running_status(id, "stop");
                                //     } else {
                                //         change_form_running_progress(id, evt.data);
                                //     }
                                // };
                                // websocket.onerror = function (evt) {
                                //     console.log("onerror");
                                // };
                            }
                        }
                    }
                    break;
                case "datas":
                    if (selected_form) {
                        var form = get_form_by_id(selected_form);
                        if (form) {
                            var d = form.data;
                            if (d) {
                                if (d.connect == 0) {
                                    setTimeout(function () {
                                        layer.msg('请连接数据库!', {
                                            icon: 7,
                                            time: 1000
                                        });
                                    }, 500)
                                    return;
                                }
                                var params = d.select_parameters;
                                if (params.length <= 0) {
                                    setTimeout(function () {
                                        layer.msg('请选择参数!', {
                                            icon: 7,
                                            time: 1000
                                        });
                                    }, 500)
                                    return;
                                }
                                var keys = params.toString();
                                $.base64.utf8encode = true;
                                var datas = {
                                    "mtype": d.type,
                                    "mhost": d.host,
                                    "mport": d.port,
                                    "mdb": d.database,
                                    "muser": d.user,
                                    "mpwd": d.password,
                                    "mtable": d.selecttable,
                                    "mkeys": keys
                                };
                                window.open("/workflow/dataview" + $.base64.btoa(JSON.stringify(datas)), "_blank"); //注意第二个参数
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
            del_form = undefined;
        });
    });
    menu.onclick = function () {
        menu.style.display = "none";
    }
    $(".m-menu-item").each(function () {
        $(this).click(function () {
            $(".m-menu-item").each(function () {
                $(this).removeClass("m-menu-item-selected");
            });
            $(this).addClass("m-menu-item-selected")
        });
    });
    var clone_ele;
    var list = document.getElementById("drag_view");
    var left = list.getBoundingClientRect().left;
    var top = list.getBoundingClientRect().top;
    init("drag_view");
    var touchDownX = 0;
    var touchDownY = 0;
    var ctrl = false;
    var z = 0;
    var y = 0;
    $(document).mousemove(function (e) {//鼠标释放
        if (e.which == 1) {
            var newX = parseInt(e.pageX);
            var newY = parseInt(e.pageY);
            if (clone_ele) {
                $(clone_ele).show();
                var l = parseFloat($(clone_ele).attr("w")) / 2;
                var t = parseFloat($(clone_ele).attr("h")) / 2;
                var x = newX - l;
                var y = newY - t;
                $(clone_ele).attr("lt", x);
                $(clone_ele).attr("tp", y);
                $(clone_ele).css({
                    left: x + "px",
                    top: y + "px"
                });
                $(clone_ele).css("z-index", "100");
                return;
            }
            if (scale_tag) {
                var moveX = e.pageX - touchDownX;
                var moveY = e.pageY - touchDownY;
                var form = get_form_by_id(scale_tag);
                if (form) {
                    form.scale_form(moveX, moveY, e.pageX, e.pageY);
                }
                touchDownX = e.pageX;
                touchDownY = e.pageY;
            }
            draw_line(newX, newY);
        } else if (e.which == 3) {

        } else if (e.which == 2) {
            var newX = parseInt(e.pageX);
            var newY = parseInt(e.pageY);
            draw_line(newX, newY);
        }
    }).mouseup(function (e) {
        if (e.which != 3) {
            menu.style.display = "none";
        }
        touch_down = false;
        scale_tag = undefined;
        var x = parseFloat(e.pageX);
        var y = parseFloat(e.pageY);
        var fw = 137;
        var fh = 71;
        var px = x - left - fw / 2;
        var py = y - top - fh / 2;
        if (clone_ele) {
            if (px + fw / 2 > 0 && py + fh / 2 > 0) {
                add_form_elem(fw, fh, px, py, undefined, undefined, $(clone_ele).find("span").html(), $(clone_ele).find("img").attr("src"), $(clone_ele).attr("method"));
            }
            clone_ele.remove();
            clone_ele = undefined;
        } else {
            var newX = parseInt(e.pageX);
            var newY = parseInt(e.pageY);
            var form = get_form(newX, newY);
            confirm_line(form);
        }
        var form = get_form_by_id(selected_form);
        if (form) {
            form.update_position(1);
        }
    }).mousedown(function (e) {
        touchDownX = e.pageX;
        touchDownY = e.pageY;
    }).keydown(function (e) {
        if (e.which == 17) {//ctrl
            ctrl = true;
        }
        if(e.which==13){
            var tar = e.target;
            if($(tar).attr("id")=="input-msg-box"){
                 var msg = $("#input-msg-box").val();
                 websocket.send(msg);
                 $("#input-msg-box").val("");
                return;
            }
        }
        if (ctrl && e.which == 90) {//ctrl+z
            ctrl_z();
            console.log("ctrl_z");
        }
        if (ctrl && e.which == 89) {//ctrl+y
            ctrl_y();
            console.log("ctrl_y");
        }
        if (selected_form) {
            var form = get_form_by_id(selected_form);
            if (!form) {
                return;
            }
            var cd = form.get_can_drag();
            var code = e.which + "";
            switch (code) {
                case "37":
                    form.move_position(-1, 0);
                    break;
                case "38":
                    form.move_position(0, -1);
                    break;
                case "39":
                    form.move_position(1, 0);
                    break;
                case "40":
                    form.move_position(0, 1);
                    break;
                case "13":
                    $(form).find("#input-text").blur();
                    break;
                case "46":
                    if (!form || !cd) {
                        return;
                    }
                    delete_form_by_id(selected_form);
                    break;
                default:
                    break;
            }
        }
    }).keyup(function (e) {
        var form = get_form_by_id(selected_form);
        if (form) {
            form.update_position(1);
        }
        console.log(e.which);
        if (e.which == 17) {//ctrl
            ctrl = false;
        }
    }).bind('contextmenu', function (ev) {
        var oEvent = ev || event;
        //自定义的菜单显示 //自定义的菜单显示
        menu.style.display = "block";
        //让自定义菜单随鼠标的箭头位置移动
        menu.style.left = oEvent.clientX + "px";
        menu.style.top = oEvent.clientY + "px";
        return false;
    });
    $(".m_data_process_menu_li").each(function (i) {
        $(this).mousedown(function (e) {
            var x = e.pageX;
            var y = e.pageY;
            if (e.which == 1) {
                clone_ele = $(this).clone();
                $(clone_ele).hide();
                $(clone_ele).attr("x", x);
                $(clone_ele).attr("y", y - i * 51);
                $(clone_ele).css("position", "absolute");
                $("body").append(clone_ele);
                var imgs = $(clone_ele).find("img");
                for (i in imgs) {
                    imgs[i].ondragstart = imgdragstart;
                }
                var w = parseFloat($(clone_ele).width());
                var h = parseFloat($(clone_ele).height());
                $(clone_ele).attr("w", w);
                $(clone_ele).attr("h", h);
                $(clone_ele).addClass("m_data_process_menu_li_selected");
                $(clone_ele).attr('disabled', "true");
            }
        });
    });

    function create_datasource_elem(x, y) {
        var fw = 68, fh = 54;

        var px = x - left - fw / 2;
        var py = y - top - fh / 2;
        var elm = document.createElement("div");
        elm.className = "m-self-datasource";
        $(elm).css({
            width: "100%",
            height: "100%",
        });
        var img = document.createElement("img");
        img.src = "/static/workflow/images/m_work_flow.png";
        var span = document.createElement("span");
        $(span).css({
            width: fw + "px",
            height: 16 + "px",
            left: "-2.5px",
            top: 32 + "px",
        });
        $(span).html("数据源"+datasource)
        datasource++;
        $(elm).append(img);
        $(elm).append(span);

        var pid = randomString(9);
        var fm = new window.form(fw, fh, px, py, pid, elm, "#CCCCCC", 6);
        fm.type = "datasource";
        push(forms, fm);
        selected_form = pid;
        var ele = fm.get_form_element();
        $(list).append(ele);
        z_history.push(["addform", fm]);
    }

    function add_form_elem(x, y, l, t, idstr, ctrl, title, src, m) {
        var pid = idstr;
        if (!pid) {
            pid = randomString(9);
        }
        var elm = document.createElement("div");
        $(elm).css({width: "100%", height: "100%"});
        elm.className = "m-self-content";
        var img = document.createElement("img");
        if (src) {
            img.src = src;
        } else {
            img.src = "/static/workflow/images/content-icon.png";
        }
        $(img).css({
            width: 21 + "px",
            height: 20 + "px",
            top: "0px"
        });
        var hr = document.createElement("div");
        hr.className = "middle-line";
        var span = document.createElement("span");
        if (!title) {
            title = "独立样本方差检验";
        }
        $(span).html(title);
        $(span).css({
            width: (x) + "px",
            height: 16 + "px",
            left: "-2.5px",
            top: 45 + "px",
            position: "absolute"
        });
        $(span).dblclick(function () {
            $(inpt).show();
            $(inpt).focus();
            isinput = 1;
        });
        var inpt = document.createElement("input");
        $(inpt).val($(span).html());
        $(inpt).attr("type", "text");
        $(inpt).attr("value", "");
        $(inpt).attr("textid", pid);
        $(inpt).attr("id", "input-text");
        inpt.className = "input-title";
        $(inpt).css("padding-left", "6px");
        $(inpt).hide();
        $(inpt).css({
            width: (x - 6) + "px",
            height: 16 + "px",
            left: "-2.5px",
            top: 45 + "px",
            position: "absolute"
        });
        $(inpt).click(function () {
            $(this).focus();

        });
        $(inpt).bind('input propertychange', function () {
            $(span).html($(inpt).val());
        });
        $(inpt).blur(function (e) {
            $(this).hide();
            var form = get_form_by_id(pid);
            form.can_drag(1);
            form.update_position();
            inputflag = 0;
        });
        $(inpt).focus(function () {
            get_form_by_id(pid).can_drag(0);
            inputflag = 1;
        });
        $(inpt).bind('keypress', function (event) {
            if (event.keyCode == 13) {
                $(this).blur();
            }
        });
        var progress = document.createElement("div");
        $(progress).attr("id", "algorith-progress");
        $(progress).hide();
        $(progress).css({
            width: (x) + "px",
            height: 12 + "px",
            left: "0px",
            top: 45 + "px",
            position: "absolute"
        });

        $(elm).append(img);
        $(elm).append(hr);
        $(elm).append(span);
        $(elm).append(inpt);
        $(elm).append(progress);
        var fm = new window.form(x, y, l, t, pid, elm, "#9fc62d", 6);
        fm.type = "algorithlibrary";
        fm.method = m;
        push(forms, fm);
        selected_form = pid;
        var ele = fm.get_form_element();
        $(list).append(ele);
        if (!ctrl) {
            z_history.push(["addform", fm]);
        }
    }

    window.add_form = add_form_elem;

    function addparams(v) {
        if (v == "right") {
            var ops = $("#text-area-left").find("option:selected").each(function () {
                $(this).remove();
                $("#text-area-right").append(this);
                $(this).removeAttr("selected");
                if (selected_form) {
                    var form = get_form_by_id(selected_form);
                    if (form) {
                        var d = form.data;
                        d.select_parameters[d.select_parameters.length] = $(this).val();
                    }
                }
            });
        } else if (v == "left") {
            var text = $("#text-area-right").find("option:selected").each(function () {
                $(this).remove();
                $("#text-area-left").append(this);
                $(this).removeAttr("selected");
                if (selected_form) {
                    var form = get_form_by_id(selected_form);
                    if (form) {
                        var d = form.data;
                        d.select_parameters.remove($(this).val());
                    }
                }
            });
        }
    }

    window.editparams = addparams;
    $("#toggle_left_memu").click(function (self) {
        $('#toggle_left_memu').attr('disabled', "true");
        var lm = $("#content-left-menu");
        if ($(lm).css("display") == "block") {
            $(lm).animate({
                width: "0px",
            }, 100, function () {
                $(lm).hide();
                update_left_top();
            });
            $("#work_flow").animate({
                width: "+=242px",
                left: "-=242px"
            }, 100);
        } else {
            $(lm).show();
            $(lm).animate({
                width: "240px",
            }, 100);
            $("#work_flow").animate({
                width: "-=242px",
                left: "+=242px"
            }, 100, function () {
                update_left_top();
                update_position();
            });
        }
    });
    var tables;
    $("#m-connect").click(function () {
        var driver = $("#m-driver").val();
        var host = $("#m-host").val();
        var port = $("#m-port").val();
        var db = $("#m-database").val();
        var user = $("#m-user").val();
        var pwd = $("#m-password").val();
        var datas = {"mtype": driver, "mhost": host, "mport": port, "mdb": db, "muser": user, "mpwd": pwd};
        $.ajax({
            type: 'POST',
            url: "/workflow/connect_db",
            data: datas,
            dataType: 'json',
            success: function (data) {
                if (data == "0") {
                    alert("连接失败！");
                } else {
                    tables = data;
                    get_tables();
                    if (selected_form) {
                        var form = get_form_by_id(selected_form);
                        if (form && form.type=="datasource") {
                            var d = form.data;
                            d.driver = driver;
                            d.host = host;
                            d.port = parseInt(port);
                            d.database = db;
                            d.user = user;
                            d.password = pwd;
                            d.connect = 1;
                            d.tables = data;
                        }
                    }
                }
            },
            error: function (data) {
                var str = '连接失败！'
                alert(str);
            },
        });
    });
    $("#select-tables").change(function () {
        if (selected_form) {
            var form = get_form_by_id(selected_form);
            if (form) {
                var d = form.data;
                if (d) {
                    d.select_parameters = [];
                }
            }
        }
        set_params($("#select-tables  option:selected").val());
    });
    $("#closed").click(function () {
        if($("#content-right-menu").css("display")=="none"){
            return;
        }
        $("#content-right-menu").animate({
            width: "-=224px",
        }, function () {
            $("#content-right-menu").hide();
        });
        $("#work_flow").animate({
            width: "+=242px",
        });
    });
    $("#little-closed").click(function () {
        if($("#right-lille-menu").css("display")=="none"){
            return;
        }
        $("#right-lille-menu").hide();
        $("#work_flow").animate({
            width: "+=18px",
        });
    });
    $("#hide-params-setting").click(function () {
        if($("#content-right-menu").css("display")=="none"){
            return;
        }
        $("#content-right-menu").animate({
            width: "-=224px",
        }, function () {
            $("#content-right-menu").hide();
        });
        $("#work_flow").animate({
            width: "+=224px",
        }, function () {
            $("#right-lille-menu").show();
        });
    });
    $("#little-hide-params-setting").click(function () {
        if($("#right-lille-menu").css("display")=="none"){
            return;
        }
        $("#right-lille-menu").hide();
        $("#content-right-menu").show();
        $("#content-right-menu").animate({
            width: "+=224px",
        });
        $("#work_flow").animate({
            width: "-=224px",
        }, function () {
            update_position();
        });
    });
    $("#show-right-menu").click(function () {
        if($("#right-lille-menu").css("display")=="none"){
            return;
        }
        $("#right-lille-menu").hide();
        $("#content-right-menu").show();
        $("#content-right-menu").animate({
            width: "+=224px",
        });
        $("#work_flow").animate({
            width: "-=224px",
        }, function () {
            update_position();
        });
    });

    function display(idstr) {
        return $("#" + idstr).css("display");
    }

    function show_right_menu() {
        var d1 = display("content-right-menu");
        var d2 = display("right-lille-menu");
        if (d1 == "none" && d2 == "none") {
            $("#content-right-menu").show();
            $("#content-right-menu").animate({
                width: "+=224px",
            });
            $("#work_flow").animate({
                width: "-=242px",
            }, function () {
                update_position();
            });
        }
    }

    function get_tables(data) {
        if (tables) {
            $("#select-tables").html("");
            for (var i = 0; i < tables.length; i++) {
                var item = tables[i];
                var name = item.name;
                var isadd = false;
                if (data && data.selecttable) {
                    if (data.selecttable == name) {
                        $("#select-tables").append('<option value="' + name + '" selected>' + name + '</option>');
                        isadd = true;
                        set_params(name);
                    }
                } else if (i == 0) {
                    set_params(name);
                }
                if (!isadd) {
                    $("#select-tables").append('<option value="' + name + '">' + name + '</option>');
                }
            }
        } else {
            $("#select-tables").html("");
            $("#text-area-left").html("");
            $("#text-area-right").html("");
        }
    }

    function set_params(nm) {
        if (tables) {
            for (var i = 0; i < tables.length; i++) {
                var item = tables[i];
                var name = item.name;
                if (nm == name) {
                    var key = item.key;
                    $("#text-area-left").html("");
                    $("#text-area-right").html("");
                    for (var j = 0; j < key.length; j++) {
                        if (selected_form) {
                            var form = get_form_by_id(selected_form);
                            if (form) {
                                var d = form.data;
                                if (d) {
                                    d.selecttable = nm;
                                    var selectparam = d.select_parameters;
                                    if (selectparam.contains(key[j])) {
                                        $("#text-area-right").append('<option value="' + key[j] + '">' + key[j] + '</option>');
                                    } else {
                                        $("#text-area-left").append('<option value="' + key[j] + '">' + key[j] + '</option>');
                                    }
                                    continue;
                                }
                            }
                        }
                        $("#text-area-left").append('<option value="' + key[j] + '">' + key[j] + '</option>');
                    }
                }
            }
        }
    }

    $(".m-data-set-item").each(function () {
        $(this).click(function () {
            if ($(this).hasClass("m-data-select-item")) {
                return;
            }
            $(".m-data-set-item").removeClass("m-data-select-item");
            $(this).addClass("m-data-select-item");
            $(".m-param-set-item-menu").hide();
            $("#" + $(this).attr("tab")).show();
        });
    });
    window.show_data_info = function (data) {
        $("#m-driver").val(data.driver);
        $("#m-host").val(data.host);
        $("#m-port").val(data.port);
        $("#m-database").val(data.database);
        $("#m-user").val(data.user);
        $("#m-password").val(data.password);
        if (data.connect == 0) {
            $("#m-connect").val("连接");
            tables = undefined;
            get_tables();
        } else {
            $("#m-connect").val("已连接");
            if (data.tables) {
                tables = data.tables;
                get_tables(data);
            }
        }
    }

    function drop_menu() {
        var d = $("#drop-down-menu").css("display");
        if (d == "none") {
            $("#dropdown-menu").attr("src", "/static/workflow/images/m_arrow_up.png");
            $("#drop-down-menu").slideDown();
            $("#red-point").hide();
        } else {
            $("#dropdown-menu").attr("src", "/static/workflow/images/m_arrow_down.png");
            $("#drop-down-menu").slideUp();
        }
    }

    $("#m-photo-img").click(drop_menu);
    $("#m-nichen").click(drop_menu);
    $("#dropdown-menu").click(drop_menu);
    String.prototype.byteLen = function(){
    　　var len = 0,
    　　i = this.length;
    　　while(i--){
    　　  len += (this.charCodeAt(i)>255 ? 2 : 1);
    　　}
    　　return len;
　　};
    function get_random_number(num) {
        return parseInt(Math.random()*num);
    }
    function get_random_color() {
        return "#"+get_random_number(9)+get_random_number(9)+get_random_number(9)+get_random_number(9)+get_random_number(9)+get_random_number(9);
    }
    var wsUri = "ws://localhost/ws/connect";
    var userid;
    var websocket = new WebSocket(wsUri);
    websocket.onopen = function (evt) {
    };
    websocket.onclose = function (evt) {
        $("#chart-right").html("");
        var child = '<p><span style="margin: 2px;">已与服务器断开连接!</span></p>';
        $("#msg-content").append(child);
        cont.scrollTop = cont.scrollHeight;
    };
    var zimu = [];
    var cont = document.getElementById("msg-content");
    websocket.onmessage = function (evt) {
        var da = evt.data;
        if(da.indexOf("sendmsg")>-1){
            var usermsg = da.substr("sendmsg".length,da.length);
            var child = '<div><span>'+usermsg+'</span></div>';
            $("#msg-content").append(child);
            cont.scrollTop = cont.scrollHeight;
            if(da.indexOf("lm")==da.length-2){
                $("#toggle_left_memu").click();
            }else if(da.indexOf("rm")==da.length-2){
                $("#hide-params-setting").click();
                $("#little-hide-params-setting").click();
            }else{
                // if(da.indexOf(userid)>-1){
                //     return;
                // }
                 var hei = Math.random()*300+46;
                 var let = 1300;
                 var wid = usermsg.byteLen()*12;
                 console.log(wid);
                 // var chiditem = '<span>'+usermsg+'</span>';
                 var chid = document.createElement("span");
                 chid.className = "user-item";
                 $(chid).css("position","absolute");
                 $(chid).css("z-index","20");
                 $(chid).css("font-size","20px");
                 $(chid).css("color",get_random_color);
                 $(chid).css("text-shadow", "2px 2px #ffffff");
                 $(chid).css({
                     width:wid+"px",
                     left:let+"px",
                     top: hei+"px",
                 });
                 $(chid).html(usermsg);
                 $(document.body).append(chid);
                 push(zimu,chid);
            }
        }else if(da.indexOf("currentuser")>-1){
            userid = da.substr(11,da.length);
            $("#m-nichen").html(userid);
        }else if(da.indexOf("closeuser")>-1){
            var idstr = da.substr(9,da.length);
            $('#'+idstr).remove();
        }else if(da.indexOf("user")>-1){
            var idstr = da.substr(4,da.length);
            var child = '<div class="user-item" id="'+idstr+'"><img class="user-item-img" src="/static/workflow/images/m_photo.png"><span>'+idstr+'</span></div>';
            $("#chart-right").append(child);
        }else if(da.indexOf("message")>-1){

        }else{
            var child = '<p><span style="margin: 2px;">'+da+'</span></p>';
            $("#msg-content").append(child);
            cont.scrollTop = cont.scrollHeight;
        }
        if($("#drop-down-menu").css("display")=="none"){
            $("#red-point").show();
        }
    };
    websocket.onerror = function (evt) {
        console.log("onerror");
    };
    $("#send-msg").click(function () {
        var msg = $("#input-msg-box").val();
        websocket.send(msg);
        $("#input-msg-box").val("");
    });
    $("#emo-menu").click(function () {
        $("#emo-list").toggle();
    });
    function add_emo(con,num,dump) {
        for(var i=0;i<num;i++){
            var item = '<li class="emo-item"><img src="/static/workflow/images/lkkbr/'+con+i+'.'+dump+'"/></li>';
            $("#emo-list-box").append(item);
        }
    }
    add_emo("amo",3,"png");
    add_emo("bmo",10,"jpg");
    add_emo("emo",30,"gif");
    $(".emo-item img").click(function () {
        var imgstr = '<img src="'+$(this).attr("src")+'"/>'
        $("#emo-list").toggle();
        websocket.send(imgstr);
    });
    $("#game-menu").click(function () {
         $("#m-photo-img").click();
         window.location = "/workflow/game_group.html?userid="+userid;
    });
    function animal(){
        requestAnimationFrame(animal)
        for(var i=0;i<zimu.length;i++){
            var chid = zimu[i];
            if(chid){
                $(chid).css({
                    left:"-=2px",
                });
                if(parseFloat($(chid).css("left"))<-parseFloat($(chid).css("width"))){
                    $(chid).remove();
                    delete zimu[i];
                }
            }
        }
    }
    animal();
});