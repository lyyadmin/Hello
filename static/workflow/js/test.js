var forms = [];
var lines = [];
var unit = 80; //节点的宽度和高度
var currId = ""; //当前节点ID
var current_from;
var current_line;
var touch_down = false;
var drag_view;
var margin_left = 0;
var margin_top = 0;
var copy_form;
var del_form;
var selected_form;
var del_line;
var scale_tag;
var detax = 1,detay = 1;
var focus_form;
var inputflag = 0;
var z_history = [];
var y_history = [];
var datasource = 0;
function init(id){
	$(document).bind('selectstart', function(){ return false; }); 
	drag_view = document.getElementById(id);
	update_left_top();
}
function update_left_top(){
	if(drag_view){
		margin_left = drag_view.getBoundingClientRect().left-8;
	    margin_top = drag_view.getBoundingClientRect().top-8;
	}
}
function update_position(){
	for(var i=0;i<forms.length;i++){
		var fm = forms[i];
		if(fm){
			fm.update_position(1);
		}
	}
}
function p(msg){
	console.log(msg);
}
function ctrl_z(){
	if(z_history.length>0){
		var obj = z_history.pop();
		var tag = obj[0];
		var tb = obj[1];
		if(tag=="addform"){
			var id = tb.get_id();
			if(id){
				delete_form_by_id(id,1);
				y_history.push(obj);
			}
		}else if(tag=="addline"){
			var id = tb.id();
			if(id){
				delete_line_by_lineid(id);
				y_history.push(obj);
			}
		}else if(tag=="moveform"){
			var dx = obj[2];
			var dy = obj[3];
			var f = get_form_by_id(tb.get_id());
			if(f){
				f.move_position(-dx,-dy);
				y_history.push(obj);
			}
		}else if(tag=="deleteform"){
			add_form_by_forminfo(tb,1);
			y_history.push(obj);
		}
	}
}
function ctrl_y(){
	if(y_history.length>0){
		var obj = y_history.pop();
		var tag = obj[0];
		var tb = obj[1];
		if(tag=="addform" && tb){
			add_form_by_forminfo(tb);
			z_history.push(obj);
		}else if(tag=="moveform"){
			var dx = obj[2];
			var dy = obj[3];
			var f = get_form_by_id(tb.get_id());
			if(f){
				f.move_position(dx,dy);
				z_history.push(obj);
			}
		}else if(tag=="deleteform"){
			var id = tb.get_id();
			if(id){
				delete_form_by_id(id);
				z_history.push(obj);
			}
		}else if(tag=="addline"){
			var id = tb.id();
			if(id){
				var sf = obj[2];
				var ef = obj[3];
				var sfid = sf.get_id();
				current_from = sfid;
				var line = new arraw_line(id);
				push(lines,line);
				$(drag_view).append(line.get_arrow_line());
				current_line = id;
				var efid = ef.get_id();
				var ef = get_form_by_id(efid);
				confirm_line(ef);
			}
		}
	}
}
function add_form_by_forminfo(f){
	if(f){
		var info = f.get_form_info();
		add_form(info[0],info[1],info[2],info[3],info[4],true);
	}
}
function imgdragstart(){return false;}
function push(arr,obj){
	for(var i=0;i<arr.length;i++){
		var o = arr[i];
		if(!o){
			o = obj;
			break;
		}
	}
	arr[arr.length] = obj;
}
function change_form_running_status(fid,mtd){
	var cfm = get_form_by_id(fid);
	if(cfm){
		var ele = cfm.get_content_element();
		if(mtd=="start"){
			$(ele).find("#algorith-progress").show();
		}else{
			$(ele).find("#algorith-progress").hide();
		}
	}
}
function change_form_running_progress(fid,n) {
	var cfm = get_form_by_id(fid);
	if(cfm){
		var ele = cfm.get_content_element();
		$(ele).find("#algorith-progress").html(n+"%");
	}
}
function change_form_by_id(fid){
	var cfm = get_form_by_id(fid);
	if(cfm){
		var ele = cfm.get_content_element();
		$(ele).find("#input-text").show();
		$(ele).find("#input-text").focus();
	}
}
function move_line(lineid, sf, tf) {
	var line = getlinebyid(lineid);
	if(line) {
		var sp = sf.get_position();
		var tp = tf.get_position();
		if(sp.length >= 2 && tp.length >= 2) {
			var sx = sp[0];
			var sy = sp[1];
			var ex = tp[0];
			var ey = tp[1];
			var size = sf.size();
			var e_size = tf.size();
			line.draw(sx, sy, ex, ey, size, e_size, true);
		}
	}
}

function delete_form_by_id(pid,ctrl){
	for(var i = 0; i < forms.length; i++) {
		var form = forms[i];
		if(form && form.get_id() == pid){
			
			var dom = $(form.get_form_element()).clone();
			form.delete_form();
			var flines = form.getlines();
			delete forms[i];
			delete_formline_by_lines(flines);
			if(!ctrl){
				z_history.push(["deleteform",form]);
			}
		}
	}
}

function delete_formline_by_lines(flines){
	for(var i=0;i<flines.length;i++){
		var lid = flines[i];
		for(var j=0;j<lines.length;j++){
			var line_ = lines[j];
			if(line_){
				var lineid = line_.id();
				if(lid==lineid){
					line_.delete_self();
					delete lines[j];
					line_ = null;
					delete_from_line_by_lineid(lineid);
				}
			}
		}
	}
}

function delete_line_by_lineid(lid){
	if(lid){
		var index = get_index(lines, lid);
		if(lines[index]){
			lines[index].delete_self();
			lines.splice(index,1);
			delete_from_line_by_lineid(lid);
			return;
		}
	}
}

function get_start_form_by_line(id){
	for(var m=0;m<forms.length;m++){
		var form = forms[m];
		if(form){
			if(form.containsline(lid)){
				form.delete_line(lid);
			}
		}
	}
}

function delete_from_line_by_lineid(lid){
	for(var m=0;m<forms.length;m++){
		var form = forms[m];
		if(form){
			if(form.containsline(lid)){
				form.delete_line(lid);
			}
		}
	}
}

function exist_form(f, cf) {
	var fid = f.get_id();
	if(current_from == fid) {
		return true;
	}
	var lis = f.getlines();
	var lineid;
	if(lis && cf) {
		for(var j = 0; j < lis.length; j++) {
			lineid = lis[j];
			if(cf.containsline(lineid)) {
				return true;
			}
		}
	}
	return false;
}

function confirm_line(form) {
	if(form) {
		var cf = get_current_form();
		if(exist_form(form, cf) == false) {
			var sp = form.get_position();
			if(sp) {
				var ex = sp[0];
				var ey = sp[1];
				if(cf) {
					var sp = cf.get_position();
					var sx = sp[0];
					var sy = sp[1];
					if(current_line) {
						line = getlinebyid(current_line);
						if(line) {
							var size = cf.size();
							var e_size = form.size();
							line.draw(sx, sy, ex, ey, size, e_size, true);
							form.setline(current_line, cf, form);
							cf.setline(current_line, cf, form);
							current_line = undefined;
							current_from = undefined;
							z_history.push(["addline",line,cf,form]);
							return;
						}
					}
				}
			}
		}
	}
	if(current_line) {
		line = getlinebyid(current_line);
		if(line) {
			$(line.get_arrow_line()).remove();
			var index = get_index(lines, current_line);
			delete lines[index];
			line = null;
			current_line = undefined;
		}
	}
	current_from = undefined;
}

function draw_line(ex, ey) {
	var cf = get_current_form();
	if(cf) {
		var sp = cf.get_position();
		var sx = sp[0];
		var sy = sp[1];
		var line;
		if(current_line) {
			line = getlinebyid(current_line);
		} else {
			line = new arraw_line(randomString(9))
			line.set_start_from(cf);
			push(lines,line);
			$(drag_view).append(line.get_arrow_line());
		}
		var size = cf.size();
		line.draw(sx, sy, ex-margin_left, ey-margin_top, size,undefined, false);
	}
}

function getlinebyid(id) {
	for(var i = 0; i < lines.length; i++) {
		var li = lines[i];
		if(li){
			if(id == li.id()) {
				return lines[i];
			}
		}
	}
	return undefined;
}

function get_index(lines, id) {
	for(var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if(line){
			if(line.id()== id) {
				return i;
			}
		}
	}
	return undefined;
}

function get_form_index(id) {
	for(var i = 0; i < forms.length; i++) {
		if(forms[i].get_id() == id) {
			return i;
		}
	}
	return undefined;
}

function get_form_by_id(id) {
	for(var i = 0; i < forms.length; i++) {
		var form = forms[i];
		if(form){
			if(form.get_id() == id) {
				return forms[i];
			}
		}
	}
	return undefined;
}

function get_current_form() {
	for(var i = 0; i < forms.length; i++) {
		var f = forms[i];
		if(f){
			if(current_from == f.get_id()) {
				return f;
			}
		}
	}
	return undefined;
}

function get_form(x, y) {
	for(var i = 0; i < forms.length; i++) {
		var f = forms[i];
		if(f){
			if(forms[i].contains(x-margin_left, y-margin_top)) {
				return forms[i];
			}
		}
	}
	return undefined;
}
function select_status(fid){
	for(var i=0;i<forms.length;i++){
		var form = forms[i];
		if(form){
			if(form.get_id()==fid){
				form.select_status();
			}else{
				form.normal_status();
			}
		}
	}
}

function randomString(len) {
	len = len || 32;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	var maxPos = $chars.length;
	var pwd = '';
	for(i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

//求两坐标之间的角度问题
function get_angle(px1, py1, px2, py2) {
	//两点的x、y值
	x = px2 - px1;
	y = py2 - py1;
	hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	//斜边长度
	cos = x / hypotenuse;
	radian = Math.acos(cos);
	//求出弧度
	angle = 180 / (Math.PI / radian);
	//用弧度算出角度
	if(y < 0) {
		angle = -angle;
	} else if((y == 0) && (x < 0)) {
		angle = 180;
	}
	return angle;
}

function get_angle_x_y(x, y) {
	var radian = Math.atan(y / x);
	//求出弧度
	var angle = 180 / (Math.PI / radian);
	//用弧度算出角度
	if(y < 0) {
		angle = -angle;
	} else if((y == 0) && (x < 0)) {
		angle = 180;
	}
	return angle;
}

function form(w, h, l, t, i,content_elem,c,s,tp) {
	var width = w;
	var height = h;
	var min_width = w;
	var min_height = h;
	var left = l;
	var top = t;
	var id = i;
	var line_id = [];
	var start_form = [];
	var end_form = [];
	var content_element = content_elem;
	var form_element;
	var self = this;
	var drag_size = 5;
	var drag_color = "#CCCCCC";
	var leftElem;
	var topElem;
	var rightElem;
	var bottomElem;
	var scalelem_lt;
	var scalelem_rt;
	var scalelem_lb;
	var scalelem_rb;
	var saw = 12;
	var sah = 12;
	var type = tp;
	var stag;
	var candrag = 1;
	var scale_unit = 8;
	var dx = 0;
	var dy = 0;
	this.data = {
		"type":"mysql",
		"host":"",
		"port":0,
		"database":"",
		"user":"",
		"password":"",
		"connect":0,
		"select_parameters":[]
	};
	this.type = undefined;
	function init_form() {
		create_from();
		add_drag_lestener();
		select_status(id);
	}

	function create_from() {
		if(c){
			drag_color = c;
		}
		if(s){
			drag_size = s;
		}
		form_element = document.createElement("div");
		form_element.className = "form-content";
		$(form_element).css({
			width: width + "px",
			height: height + "px",
			left: left + "px",
			top: top + "px"
		});
		$(form_element).css("z-index","1");
		leftElem = document.createElement("div");
		topElem = document.createElement("div");
		rightElem = document.createElement("div");
		bottomElem = document.createElement("div");
		leftElem.className = "drag-block";
		$(topElem).addClass("drag-block");
		$(rightElem).addClass("drag-block");
		$(bottomElem).addClass("drag-block");
		$(leftElem).css({
			width:drag_size+"px",
			height:height+"px",
			left: "0px",
			top: "0px",
			background:drag_color,
			position:"absolute"
		});
		$(topElem).css({
			width:width+"px",
			height:drag_size+"px",
			left: "0px",
			top: "0px",
			background:drag_color,
			position:"absolute"
		});
		$(rightElem).css({
			width:drag_size+"px",
			height:height+"px",
			left: (width-drag_size) + "px",
			top: "0px",
			background:drag_color,
			position:"absolute"
		});
		$(bottomElem).css({
			width:width+"px",
			height:drag_size+"px",
			left: "0px",
			top: (height - drag_size) + "px",
			background:drag_color,
			position:"absolute"
		});
		$(form_element).append(content_element);
		$(form_element).append(leftElem);
		$(form_element).append(topElem);
		$(form_element).append(rightElem);
		$(form_element).append(bottomElem);
		
		scalelem_lt = document.createElement("div");
		scalelem_rt = document.createElement("div");
		scalelem_lb = document.createElement("div");
		scalelem_rb = document.createElement("div");
		scalelem_lt.className = "scale-angle-lt";
		scalelem_rt.className = "scale-angle-rt";
		scalelem_lb.className = "scale-angle-lb";
		scalelem_rb.className = "scale-angle-rb";
		$(scalelem_lt).css({
			left:"0px",
			top:"0px"
		});
		$(scalelem_rt).css({
			left:(width-saw)+"px",
			top:"0px"
		});
		$(scalelem_lb).css({
			left:"0px",
			top:(height-sah)+"px"
		});
		$(scalelem_rb).css({
			left:(width-saw)+"px",
			top:(height-sah)+"px"
		});
		$(form_element).append(scalelem_lt);
		$(form_element).append(scalelem_rt);
		$(form_element).append(scalelem_lb);
		$(form_element).append(scalelem_rb);
		focus_form = id;
	}
	this.update_position = function(update){
		if(update){
			var margin = 8;
			var p = $(form_element).parent();
			var r = $(p).width();
			var b = $(p).height();
			var l = parseFloat($(form_element).css("left"))-margin;
			var t = parseFloat($(form_element).css("top"))-margin;
			if(l<0){
				left=0+margin;
				$(form_element).animate({
					left:left+"px",
				},100,"swing",move_form);
			}
			if(t<0){
				top=0+margin;
				$(form_element).animate({
					top:top+"px"
				},100,"swing",move_form);
			}
			if(l+width>r){
				left = r-width+margin;
				$(form_element).animate({
					left:left+"px",
				},100,"swing",move_form);
			}
			if(t+height>b){
				top = b-height+margin;
				$(form_element).animate({
					top:top+"px"
				},100,"swing",move_form);
			}
		}
	}

	function move_form() {
		if(line_id.length > 0) {
			for(var i = 0; i < line_id.length; i++) {
				var lineid = line_id[i];
				if(lineid){
					var sf = start_form[i];
					var tf = end_form[i];
					move_line(lineid, sf, tf);
				}
			}
		}
		left = parseFloat($(form_element).css("left"));
		top = parseFloat($(form_element).css("top"));
	}
	this.can_drag = function(c){
		candrag = c;
	}
	this.get_can_drag = function(){
		return candrag;
	}
	function add_drag_lestener() {
		$(content_element).mousedown(function(e) {
			select_status(id);
			if(e.which == 1) {
				if(candrag){
					$(this).parent().draggable('enable');
					dx = left;
					dy = top;
				}
				touch_down = true;
				if(self.type && self.type=="datasource"){
					show_data_info(self.data);
				}
			} else if(e.which == 3) {
				copy_form = id;
				del_form = id;
				del_line = undefined;
			} else if(e.which == 2){
				current_from = id;
			}
			$(".input-title").each(function(){
				var tid = $(this).attr("textid");
				if(tid==id){
					return;
				}
				$(this).blur();
			});
		}).mouseup(function() {
			$(this).parent().draggable('disable');
			touch_down = false;
			self.update_position(1);
			move_form();
			if(dx>5 || dy>5){
				z_history.push(["moveform",self,left-dx,top-dy]);
			}
		}).mousemove(function() {
			if(touch_down == false) {
				return;
			}
			move_form();
		}).on("mousewheel DOMMouseScroll", function (e) {
		    var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
		                (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox
		    if (delta > 0) {
		        // 向上滚
				detax = -scale_unit/2;
				detay = -scale_unit/2;
		        self.scale_form(scale_unit,scale_unit);
		    } else if (delta < 0) {
		        // 向下滚
				detax = scale_unit/2;
				detay = scale_unit/2;
		        self.scale_form(-scale_unit,-scale_unit);
		    }
		});
		$(leftElem).mousedown(function(event) {
			current_from = id;
		});
		$(topElem).mousedown(function(event) { 
			current_from = id;
		});
		$(rightElem).mousedown(function(event) { 
			current_from = id;
		});
		$(bottomElem).mousedown(function(event) {
			current_from = id;
		});
		$(scalelem_lt).mousedown(function(e){
			scale_tag = id;
			detax = -1;
			detay = -1;
			stag = "lt";
		}).mouseup(function(){
			scale_tag = undefined;
			stag = undefined;
		});
		$(scalelem_rt).mousedown(function(e){
			scale_tag = id;
			detax = 1;
			detay = -1;
			stag = "rt";
		}).mouseup(function(){
			scale_tag = undefined;
			stag = undefined;
		});
		$(scalelem_lb).mousedown(function(e){
			scale_tag = id;
			detax = -1;
			detay = 1;
			stag = "lb";
		}).mouseup(function(){
			scale_tag = undefined;
			stag = undefined;
		});
		$(scalelem_rb).mousedown(function(e){
			scale_tag = id;
			detax = 1;
			detay = 1;
			stag = "rb";
		}).mouseup(function(){
			scale_tag = undefined;
			stag = undefined;
		});
	}
	this.contains = function(x, y) {
		var left = parseFloat($(form_element).css("left"));
		var top = parseFloat($(form_element).css("top"));
		var width = parseFloat($(form_element).css("width"));
		var height = parseFloat($(form_element).css("height"));
		if(x > left && x < left + width && y > top && y < top + height) {
			return true;
		}
		return false;
	}
	this.init_element = function(){
		init_form();
	}
	this.get_position = function() {
		var l = parseFloat($(form_element).css("left"));
		var t = parseFloat($(form_element).css("top"));
		var w = parseFloat($(form_element).css("width"));
		var h = parseFloat($(form_element).css("height"));
		return Array(l + w / 2, t + h / 2);
	}
	this.size = function() {
		var l = parseFloat($(form_element).css("width"));
		var t = parseFloat($(form_element).css("height"));
		return Array(l, t);
	}
	this.get_form_element = function() {
		return form_element;
	}
	this.set_form_element = function(fe) {
		form_element = fe;;
	}
	this.get_content_element = function() {
		return content_element;
	}
	this.get_id = function() {
		return id;
	}
	this.get_color = function(){
		return drag_color;
	}
	this.get_drag_size = function(){
		return drag_size;
	}
	this.get_form_info = function(){
		return Array(width,height,left,top,id);
	}
	this.setline = function(id, sf, tf) {
		push(line_id,id);
		push(start_form,sf);
		push(end_form,tf);
	}
	this.containsline = function(id) {
		for(i in line_id) {
			if(line_id[i] == id) {
				return true;
			}
		}
		return false;
	}
	this.getlines = function() {
		return line_id;
	}
	this.delete_line = function(lid){
		for(var i=0;i<line_id.length;i++){
			if(line_id[i]==lid){
				line_id.splice(i, 1);
				start_form.splice(i, 1);
				end_form.splice(i, 1);
				return;
			}
		}
	}
	this.delete_form = function(){
		$(form_element).remove();
		form_element = null;
	}
	this.contains_parent = function(px,py){
		var p = $(form_element).parent();
		var l = p.offset().left;
		var t = p.offset().top;
		var r = l+$(p).width();
		var b = t+$(p).height();
		if(px > l && px < r && py > t && py < b) {
			return true;
		}
		return false;
	}
	this.scale_form = function(x,y,px,py){
		if(px && !this.contains_parent(px,py)){
			return;
		}
		var l = $(form_element).offset().left;
		var t = $(form_element).offset().top;
		var canleft = 1;
		var cantop = 1;
		var dx = min_width-width;
		var dy = min_height-height;
		if(!px || !py){
			width = width + x;
			height = height + y;
			if(width<min_width){
				width = min_width;
				canleft = 0;
				console.log("canleft");
			}
			if(height<min_height){
				height = min_height;
				cantop = 0;
				console.log("cantop");
			}
			if(cantop){
				console.log("wheel");
				left = left+detax;
				top = top+detay;
				$(form_element).css({
					left:left+"px",
					top:top+"px",
				});
			}
		}else if(stag == "rb" && (x>0 || y>0)){
			var w = px-(l+width);
			var h = py-(t+height);
			if(w>-3){
				width = width + x*detax;
			}
			if(h>-3){
				height = height + y*detay;
			}
		}else if(stag == "lb" && (x<0 || y>0)){
			var w = l-px;
			var h = py-(t+height);
			if(w>-3){
				width = width + x*detax;
			}else{
				canleft = 0;
			}
			if(h>-3){
				height = height + y*detay;
			}else{
				cantop=0;
			}
		}else if(stag == "lt" && (x<0 || y<0)){
			var w = l-px;
			var h = t-py;
			if(w>-3){
				width = width + x*detax;
			}else{
				canleft = 0;
			}
			if(h>-3){
				height = height + y*detay;
			}else{
				cantop=0;
			}
		}else if(stag == "rt" && (x>0 || y<0)){
			var w = px-(l+width);
			var h = t-py;
			if(w>-3){
				width = width + x*detax;
			}else{
				canleft = 0;
			}
			if(h>-3){
				height = height + y*detay;
			}else{
				cantop=0;
			}
		}else{
			width = width + x*detax;
			height = height + y*detay;
		}
		if(width<min_width){
			width = min_width;
			canleft = 0;
			p("canleft="+dx);
			if(dx<0 && px){
				if(stag == "lb"){
					left = left-dx*(Math.abs(x)/x);
					$(form_element).css({
						left:left+"px",
					});
				}else if(stag == "lt"){
					left = left-dx*(Math.abs(x)/x);
					$(form_element).css({
						left:left+"px",
					});
				}
			}
		}
		if(height<min_height){
			height = min_height;
			cantop = 0;
			p("cantop="+dy);
			if(dy<0 && px){
				if(stag == "rt"){
					top = top-dy*(Math.abs(y)/y);
					$(form_element).css({
						top:top+"px",
					});
				}else if(stag == "lt"){
					top = top-dy*(Math.abs(y)/y);
					$(form_element).css({
						top:top+"px",
					});
				}
			}
		}
		$(form_element).css({
			width:width+"px",
			height:height+"px"
		});
		if(px && detax<0 && canleft){
			left = left+x;
			console.log("left="+left);
			$(form_element).css({
				left:left+"px",
			});
		}
		if(py && detay<0 && cantop){
			top = top+y;
			console.log("top="+top);
			$(form_element).css({
				top:top+"px",
			});
		}
		$(leftElem).css({
			width:drag_size+"px",
			height:height+"px",
			left: "0px",
			top: "0px"
		});
		$(topElem).css({
			width:width+"px",
			height:drag_size+"px",
			left: "0px",
			top: "0px"
		});
		$(rightElem).css({
			width:drag_size+"px",
			height:height+"px",
			left: (width-drag_size) + "px",
			top: "0px"
		});
		$(bottomElem).css({
			width:width+"px",
			height:drag_size+"px",
			left: "0px",
			top: (height - drag_size) + "px"
		});
		$(scalelem_lt).css({
			left:"0px",
			top:"0px"
		});
		$(scalelem_rt).css({
			left:(width-saw)+"px",
			top:"0px"
		});
		$(scalelem_lb).css({
			left:"0px",
			top:(height-sah)+"px"
		});
		$(scalelem_rb).css({
			left:(width-saw)+"px",
			top:(height-sah)+"px"
		});
		move_form();
	}
	this.select_status = function(){
		$(scalelem_lt).show();
		$(scalelem_rt).show();
		$(scalelem_lb).show();
		$(scalelem_rb).show();

		$(leftElem).css("background","#9fc62d");
		$(topElem).css("background","#9fc62d");
		$(rightElem).css("background","#9fc62d");
		$(bottomElem).css("background","#9fc62d");
		selected_form = id;
	}
	this.normal_status = function(){
		$(scalelem_lt).hide();
		$(scalelem_rt).hide();
		$(scalelem_lb).hide();
		$(scalelem_rb).hide();

		$(leftElem).css("background","#FFFFFF");
		$(topElem).css("background","#FFFFFF");
		$(rightElem).css("background","#FFFFFF");
		$(bottomElem).css("background","#FFFFFF");
	}
	this.move_position = function(l,t){
		if(inputflag){
			return;
		}
		left = left+l;
		top = top+t;
		$(form_element).css({
			left: left + "px",
			top: top + "px"
		});
		move_form();
	}
	init_form();
	return this;
}

function arraw_line(i) {
	var sx = 0;
	var sy = 0;
	var ex = 0;
	var ey = 0;
	var id = i;
	var line_element;
	var arraw;
	var start_form;
	var line;

	function init_line() {
		create_element();
	}

	function create_element() {
		line_element = document.createElement("div");
		$(line_element).attr("sx", sx);
		$(line_element).attr("sy", sy);
		$(line_element).attr("ex", ex);
		$(line_element).attr("ey", ey);
		$(line_element).attr("id", id);
		current_line = id;
		line_element.style.zIndex = 100;
		arraw = document.createElement("div");
		arraw.className = "jt";
		$(arraw).transformOrigin = "15px 5px";
		$(arraw).css({
			position: "absolute",
		});
		line = document.createElement("div");
		line.className = "line1";
		$(line).transformOrigin = "0px 0px";
		$(line).css({
			width: "0px",
			height: "1px",
			position: "absolute",
		});
		$(line_element).append(arraw);
		$(line_element).append(line);
	}
	this.set_start_from = function(start){
		start_form = start;
	}
	this.draw = function(sx1, sy1, ex2, ey2, size, end_size, is_current) {
		if(is_current){
			this.draw_svg(sx1, sy1, ex2, ey2, size, end_size, is_current);
			return;
		}
		sx = sx1;
		sy = sy1;
		ex = ex2;
		ey = ey2;
		var mx = ex - sx;
		var my = ey - sy;
		t = 15;
		var l = Math.sqrt(my * my + mx * mx);
		var jd = get_angle(sx, sy, ex, ey) * 1;
		var angle = get_angle_x_y(size[0] / 2, size[1] / 2);
		var end_angle = (90 - angle) * 2 + angle;
		var margin = 0;
		if(Math.abs(jd) > angle && Math.abs(jd) < end_angle) {
			margin = Math.abs((size[1] / 2) / Math.cos((90 - jd) * Math.PI / 180));
		} else if(Math.abs(jd) > 90) {
			margin = Math.abs(size[0] / 2 / Math.cos((180 - jd) * Math.PI / 180));
		} else {
			margin = Math.abs(size[0] / 2 / Math.cos(jd * Math.PI / 180));
		}
		var end_margin = undefined;
		if(end_size){
			var ag = get_angle_x_y(end_size[0] / 2, end_size[1] / 2);
			var end_ag = (90 - ag) * 2 + ag;
			if(Math.abs(jd) > ag && Math.abs(jd) < end_ag) {
				end_margin = Math.abs((end_size[1] / 2) / Math.cos((90 - jd) * Math.PI / 180));
			} else if(Math.abs(jd) > 90) {
				end_margin = Math.abs(end_size[0] / 2 / Math.cos((180 - jd) * Math.PI / 180));
			} else {
				end_margin = Math.abs(end_size[0] / 2 / Math.cos(jd * Math.PI / 180));
			}
		}
        if(is_current){
	    	jt_x = ex*1 - t-margin;
	        jt_y = ey*1 - 5;
            if(end_margin){
            	jt_x = ex*1 - t-end_margin;
            	t = t+end_margin;
            	l = l-margin-end_margin;
            }else{
            	t = t+margin;
            	l = l-margin*2;
            }
        }else{
            jt_x = ex*1 - t;
	        jt_y = ey*1 - 5;
            l = l-margin;
        }
	    var sdiv = '<div class="jt arrow'+id+'" style="-webkit-transform-origin:'+(t)+'px 5px; transform-origin:'+(t)+'px 5px;;transform: rotate('+jd+'deg);-webkit-transform: rotate('+jd+'deg); position: absolute;z-index:100; left:'+jt_x+'px;top:'+jt_y+'px;"></div>';//
		var orx = -margin;
		sx = sx + margin;
		sdiv += '<div class="line1 '+id+'" style="border-radius: 1px;width:' + (l-10) + 'px;height:1px; top:' + (sy) + 'px;left:' + (sx) + 'px;transform-origin:' + orx + 'px 0px;transform: rotate(' + jd + 'deg);-webkit-transform-origin:' + orx + 'px 0px;-webkit-transform: rotate(' + jd + 'deg);z-index:100;"></div>';
		$(line_element).html(sdiv);
		if(is_current){
			$("."+id).each(function(){
				$(this).mousedown(function(){
					del_line = id;
				});
			});
			$(".arrow"+id).each(function(){
				$(this).mousedown(function(e){
					if(e.which == 3){
						del_line = id;
					}else if(e.which == 1 || e.which == 2){
						if(start_form){
							delete_line_by_lineid(id);
							current_from = start_form.get_id();
							draw_line(e.pageX,e.pageY);
						}
					}
				});
			});
		}
	}
	this.draw_svg = function(sx1, sy1, ex2, ey2, size, end_size, is_current) {
		sx = sx1;
		sy = sy1;
		ex = ex2;
		ey = ey2;
		var triangle_w = 5;
		var triangle_h = 10;
		var startx = (sx<ex?sx:ex)-triangle_w;
		var starty = (sy<ey?sy:ey)-triangle_w;
		var mx = Math.abs(ex - sx);
		var my = Math.abs(ey - sy);
		var x1 = 0;
		var y1 = 0;
		var x2 = mx;
		var y2 = my;
		t = 15;
		var l = Math.sqrt(my * my + mx * mx);
		var jd = get_angle(sx, sy, ex, ey) * 1;
		var angle = get_angle_x_y(size[0] / 2, size[1] / 2);
		var end_angle = (90 - angle) * 2 + angle;
		var margin = 0;
		var up_down = false;
		if(Math.abs(jd) > angle && Math.abs(jd) < end_angle) {
			margin = Math.abs((size[1] / 2) / Math.cos((90 - jd) * Math.PI / 180));
			if(jd>0){//down
				if(end_size){
					if(sx-size[0]/2>ex+end_size[0]/2+triangle_w){//left
						mx = mx-size[0]/2;
						if(end_size && end_size.length==2){
							mx -= end_size[0]/2
							startx = startx+end_size[0]/2;
						}
					}else if(sx+size[0]/2<ex-end_size[0]/2-triangle_w){//right
						startx = startx+size[0]/2;
						mx = mx-size[0]/2;
						if(end_size && end_size.length==2){
							mx -= end_size[0]/2
						}
					}else{
						starty = starty+size[1]/2;
						my = my-size[1]/2;
						if(end_size && end_size.length==2){
							my -= end_size[1]/2
						}
						up_down = true;
					}
				}else{
					if(sx-size[0]/2>ex+triangle_w){//left
						mx = mx-size[0]/2;
					}else if(sx+size[0]/2<ex-triangle_w){//right
						startx = startx+size[0]/2;
						mx = mx-size[0]/2;
					}else{
						starty = starty+size[1]/2;
						my = my-size[1]/2;
						up_down = true;
					}
				}
			}else{//up 
				if(end_size){
					if(sx-size[0]/2>ex+end_size[0]/2+triangle_w){//left
						mx = mx-size[0]/2;
						if(end_size && end_size.length==2){
							mx -= end_size[0]/2
							startx = startx+end_size[0]/2;
						}
					}else if(sx+size[0]/2<ex-end_size[0]/2-triangle_w){//right
						startx = startx+size[0]/2;
						mx = mx-size[0]/2;
						if(end_size && end_size.length==2){
							mx -= end_size[0]/2
						}
					}else{
						my = my-size[1]/2;
						if(end_size && end_size.length==2){
							my -= end_size[1]/2
							starty = starty+end_size[1]/2;
						}
						up_down = true;
					}
				}else{
					if(sx-size[0]/2>ex+triangle_w){//left
						mx = mx-size[0]/2;
					}else if(sx+size[0]/2<ex-triangle_w){//right
						startx = startx+size[0]/2;
						mx = mx-size[0]/2;
					}else{
						my = my-size[1]/2;
						up_down = true;
					}
				}
			}
//			up_down = true;
		} else if(Math.abs(jd) > 90) {
			margin = Math.abs(size[0] / 2 / Math.cos((180 - jd) * Math.PI / 180));//left
			mx = mx-size[0]/2;
			if(end_size && end_size.length==2){
				mx -= end_size[0]/2
				startx = startx+end_size[0]/2;
			}
		} else {
			margin = Math.abs(size[0] / 2 / Math.cos(jd * Math.PI / 180));//right
			startx = startx+size[0]/2;
			mx = mx-size[0]/2;
			if(end_size && end_size.length==2){
				mx -= end_size[0]/2
			}
		}
		var end_margin = undefined;
		if(end_size){
			var ag = get_angle_x_y(end_size[0] / 2, end_size[1] / 2);
			var end_ag = (90 - ag) * 2 + ag;
			if(Math.abs(jd) > ag && Math.abs(jd) < end_ag) {
				end_margin = Math.abs((end_size[1] / 2) / Math.cos((90 - jd) * Math.PI / 180));
			} else if(Math.abs(jd) > 90) {
				end_margin = Math.abs(end_size[0] / 2 / Math.cos((180 - jd) * Math.PI / 180));
			} else {
				end_margin = Math.abs(end_size[0] / 2 / Math.cos(jd * Math.PI / 180));
			}
		}
        if(is_current){
	    	jt_x = ex*1 - t-margin;
	        jt_y = ey*1 - 5;
            if(end_margin){
            	jt_x = ex*1 - t-end_margin;
            	t = t+end_margin;
            	l = l-margin-end_margin;
            }else{
            	t = t+margin;
            	l = l-margin*2;
            }
        }else{
            jt_x = ex*1 - t;
	        jt_y = ey*1 - 5;
            l = l-margin;
        }
		if(mx<1){
			mx = 1;
		}
		if(my<1){
			my = 1;
		}
		var hx = [];
		var hy = [];
		var ex = [];
		var ey = [];
		var px = [0,0,0];
		var py = [0,0,0];
		var unitx = mx/8;
		var unity = my/8;
		if(jd>=0 && jd<90){//4
			x1 = triangle_w;
			y1 = triangle_w;
			x2 = mx+triangle_w;
			y2 = my+triangle_w;
			if(up_down){
				hx[0] = x1;
				hy[0] = y1;
				hx[1] = x1;
				hy[1] = y1+unity*3;
				hx[2] = x1+unitx;
				hy[2] = y1+unity*3;
				hx[3] = x1+unitx*4;
				hy[3] = y1+unity*4;
				
				
				ex[0] = hx[3];
				ey[0] = hy[3];
				ex[1] = x1+unitx*7;
				ey[1] = y1+unity*5;
				ex[2] = x1+unitx*8;
				ey[2] = y1+unity*5;
				ex[3] = x2;
				ey[3] = y2;
				
				px[0] = x2-triangle_w;
				px[1] = x2+triangle_w;
				px[2] = x2;
				py[0] = y2-triangle_h;
				py[1] = y2-triangle_h;
				py[2] = y2;
			}else{
				hx[0] = x1;
				hy[0] = y1;
				hx[1] = x1+unitx*3;
				hy[1] = y1;
				hx[2] = x1+unitx*3;
				hy[2] = y1+unity;
				hx[3] = x1+unitx*4;
				hy[3] = y1+unity*4;
				
				
				ex[0] = hx[3];
				ey[0] = hy[3];
				ex[1] = x1+unitx*5;
				ey[1] = y1+unity*7;
				ex[2] = x1+unitx*5;
				ey[2] = y1+unity*8;
				ex[3] = x2;
				ey[3] = y2;
				
				px[0] = x2-triangle_h;
				px[1] = x2-triangle_h;
				px[2] = x2;
				py[0] = y2-triangle_w;
				py[1] = y2+triangle_w;
				py[2] = y2;
			}
		}else if(jd>=90 && jd<=180){//3
			x1 = mx+triangle_w;
			y1 = triangle_w;
			x2 = triangle_w;
			y2 = my+triangle_w;
			if(up_down){
				hx[0] = x1;
				hy[0] = y1;
				hx[1] = x1;
				hy[1] = y1+unity*3;
				hx[2] = x1-unitx;
				hy[2] = y1+unity*3;
				hx[3] = x1-unitx*4;
				hy[3] = y1+unity*4;
				
				
				ex[0] = hx[3];
				ey[0] = hy[3];
				ex[1] = x1-unitx*7;
				ey[1] = y1+unity*5;
				ex[2] = x1-unitx*8;
				ey[2] = y1+unity*5;
				ex[3] = x2;
				ey[3] = y2;
				
				px[0] = x2-triangle_w;
				px[1] = x2+triangle_w;
				px[2] = x2;
				py[0] = y2-triangle_h;
				py[1] = y2-triangle_h;
				py[2] = y2;
			}else{
				hx[0] = x1;
				hy[0] = y1;
				hx[1] = x1-unitx*3;
				hy[1] = y1;
				hx[2] = x1-unitx*3;
				hy[2] = y1+unity;
				hx[3] = x1-unitx*4;
				hy[3] = y1+unity*4;
				
				
				ex[0] = hx[3];
				ey[0] = hy[3];
				ex[1] = x1-unitx*5;
				ey[1] = y1+unity*7;
				ex[2] = x1-unitx*5;
				ey[2] = y1+unity*8;
				ex[3] = x2;
				ey[3] = y2;
				
				px[0] = x2+triangle_h;
				px[1] = x2+triangle_h;
				px[2] = x2;
				py[0] = y2-triangle_w;
				py[1] = y2+triangle_w;
				py[2] = y2;
			}
		}else if(jd<0 && jd>-90){//1
			x1 = triangle_w;
			y1 = my+triangle_w;
			x2 = mx+triangle_w;
			y2 = triangle_w;
			if(up_down){
				hx[0] = x1;
				hy[0] = y1;
				hx[1] = x1;
				hy[1] = y1-unity*3;
				hx[2] = x1+unitx;
				hy[2] = y1-unity*3;
				hx[3] = x1+unitx*4;
				hy[3] = y1-unity*4;
				
				ex[0] = hx[3];
				ey[0] = hy[3];
				ex[1] = x1+unitx*7;
				ey[1] = y1-unity*5;
				ex[2] = x1+unitx*8;
				ey[2] = y1-unity*5;
				ex[3] = x2;
				ey[3] = y2;
				
				px[0] = x2-triangle_w;
				px[1] = x2+triangle_w;
				px[2] = x2;
				py[0] = y2+triangle_h;
				py[1] = y2+triangle_h;
				py[2] = y2;
			}else{
				hx[0] = x1;
				hy[0] = y1;
				hx[1] = x1+unitx*3;
				hy[1] = y1;
				hx[2] = x1+unitx*3;
				hy[2] = y1-unity;
				hx[3] = x1+unitx*4;
				hy[3] = y1-unity*4;
				
				ex[0] = hx[3];
				ey[0] = hy[3];
				ex[1] = x1+unitx*5;
				ey[1] = y1-unity*7;
				ex[2] = x1+unitx*5;
				ey[2] = y1-unity*8;
				ex[3] = x2;
				ey[3] = y2;
				
				px[0] = x2-triangle_h;
				px[1] = x2-triangle_h;
				px[2] = x2;
				py[0] = y2-triangle_w;
				py[1] = y2+triangle_w;
				py[2] = y2;
			}
		}else if(jd<=-90 && jd>=-180){//2
			x1 = mx+triangle_w;
			y1 = my+triangle_w;
			x2 = triangle_w;
			y2 = triangle_w;
			if(up_down){
				hx[0] = x1;
				hy[0] = y1;
				hx[1] = x1;
				hy[1] = y1-unity*3;
				hx[2] = x1-unitx;
				hy[2] = y1-unity*3;
				hx[3] = x1-unitx*4;
				hy[3] = y1-unity*4;
				
				
				ex[0] = hx[3];
				ey[0] = hy[3];
				ex[1] = x1-unitx*7;
				ey[1] = y1-unity*5;
				ex[2] = x1-unitx*8;
				ey[2] = y1-unity*5;
				ex[3] = x2;
				ey[3] = y2;
				
				px[0] = x2-5;
				px[1] = x2+5;
				px[2] = x2;
				py[0] = y2+15;
				py[1] = y2+15;
				py[2] = y2;
			}else{
				hx[0] = x1;
				hy[0] = y1;
				hx[1] = x1-unitx*3;
				hy[1] = y1;
				hx[2] = x1-unitx*3;
				hy[2] = y1-unity;
				hx[3] = x1-unitx*4;
				hy[3] = y1-unity*4;
				
				
				ex[0] = hx[3];
				ey[0] = hy[3];
				ex[1] = x1-unitx*5;
				ey[1] = y1-unity*7;
				ex[2] = x1-unitx*5;
				ey[2] = y1-unity*8;
				ex[3] = x2;
				ey[3] = y2;
				
				px[0] = x2+15;
				px[1] = x2+15;
				px[2] = x2;
				py[0] = y2-5;
				py[1] = y2+5;
				py[2] = y2;
			}
		}
		var sdiv = '';
		sdiv += '<svg xmlns="http://www.w3.org/2000/svg" width="'+(mx+triangle_w*2)+'" height="'+(my+triangle_w*2)+'" version="1.1" style="position: absolute;left: '+(startx)+'px;top: '+(starty)+'px;';
		if(!is_current){
			sdiv +='z-index:1;';
		}
		sdiv +='">';
//		sdiv += '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" style="stroke:#000000;stroke-width:1" />';
		sdiv += '<path d="M'+hx[0]+' '+hy[0]+' C'+hx[1]+' '+hy[1]+' '+hx[2]+' '+hy[2]+' '+hx[3]+' '+hy[3]+'" stroke="#000000" fill="none" style="stroke-width: 1px;"></path>';
		sdiv += '<path d="M'+ex[0]+' '+ey[0]+' C'+ex[1]+' '+ey[1]+' '+ex[2]+' '+ey[2]+' '+ex[3]+' '+ey[3]+'" stroke="#000000" fill="none" style="stroke-width: 1px;"></path>';
		sdiv += '<polygon class="arrow'+id+'" points="'+px[0]+' '+py[0]+' '+px[1]+' '+py[1]+' '+px[2]+' '+py[2]+'" style="fill:#000000;"/>';
		sdiv += '</svg>';
		$(line_element).html(sdiv);
		if(is_current){
			$(".arrow"+id).each(function(){
				$(this).mousedown(function(e){
					if(e.which == 3){
						del_form = undefined;
						del_line = id;
					}else if(e.which == 1 || e.which == 2){
						if(start_form){
							delete_line_by_lineid(id);
							current_from = start_form.get_id();
							draw_line(e.pageX,e.pageY);
						}
//						var triangle = e.target;
//				        triangle.setAttributeNS(null, "fill", "#FF0000");
					}
				});
			});
		}
	}
	this.get_arrow_line = function() {
		return line_element;
	}
	this.id = function() {
		return id;
	}
	this.delete_self = function(){
		$(line_element).remove();
		line_element = null;
	}
	init_line();
	return this;
}