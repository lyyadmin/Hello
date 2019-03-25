/**
 * Created by admin on 2017/11/16.
 */
$(function(){
    $(".menulist").prev().each(function(){
        $(this).click(function(){
            var d = $(this).next().css("display");
            if(d == "none"){
                $(this).next().css("display","block");
                $(this).find("span").removeClass().addClass("icon-caret-up");
            }else{
                $(this).next().css("display","none");
                $(this).find("span").removeClass().addClass("icon-caret-down");
            }
        });
    })

	$(".menutwo").each(function(){
		$(this).click(function(){
			click_manutwo(this);
		});
    });
})