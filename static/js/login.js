/**
 * Created by admin on 2017/11/16.
 */
$(function(){
    $("#user_login").click(function(){
        var user = $("#user").val();
        var pwd = $("#pwd").val();
    	$.ajax({
			type: 'POST',
			url: "user/verification",
			data:{"username":user,"password":pwd},
			dataType: 'json',
			success: function(data) {
            	var status = data.status;
            	if(status=='0'){
					layer.msg(data.message,{icon:1,time:2000});
            	}else{
            		window.location = "/main.html";
            	}
			},
			error: function(data) {
				console.log(data.msg);
			},
		});
    });
})