/*
	* ----------------------------------------------------------------------------
        _  _        _                 _                                 _
    ___| |(_) ___ _| |_  ____ _____ _| |_  ___   ___  _   _  _____  ___| |  _     _   _     _       _  _   _   _
   / __  || |/ __|__  _|/ _  |  _  |_   _|/ __| / _ \| | | ||  _  |/ __  | |_| | |_  |_  | | |  /|   |  | |_  |_   /|
  | (__| || |\__ \ | |_  (_| | | | | | |_ \__ \| |_| | |_| || | | | (__| |  _  |   |   | | | | |_|  _|  | | | | | |_|
   \_____||_||___/ |___|\____|_| |_| |___||___/ \___/|_____||_| |_|\_____| |_| |  _|  _| | |_|   | |_   | |_| |_|   |

  * CSS Document public js Start
	* Author: DistantSound
	* IDE :
  * ---------------------------------------------------------------------------------------------
*/

setRemSize();
window.addEventListener("resize", setRemSize, false);
function setRemSize() {
	var _clientWidth = document.documentElement.clientWidth;
	document.documentElement.style.fontSize = 100 * (_clientWidth / 750) + "px";
};

$(function() {
    // return-top ------------------------
    $(".return-top").on("click", function() {
        $("body,html").animate({scrollTop: 0}, 600);
    });
 

    // show-hide-read ------------------------
    $(".show-hide-read").on("click", function() {
        let $b = "隐藏已读";
        let $c = "显示已读";
        if (!$(this).is(".current")) {
                $(this).toggleClass("current").find("span").text("显示已读"); 
        } else {
            $(this).removeClass("current");
            $(this).find("span").text("隐藏已读"); 
        }
    });
  /*
    */

    // btn-like ------------------
    $(".btn-like").on("click", function() { 
        let num =  $(this).find(".s-spa").text();
            num++;
            $(this).find(".s-spa").text(num);
    });


    // pop-close, .btn-pop-no  ------------------
  /*
    $(".pop-close, .btn-pop-no").on("click", function() {
        $(".pop-delete,.mask-box").slideUp(); 
    });
    */

   // btn-delete  ------------------
    $(".btn-delete").on("click", function() { 
        $(this).parents(".lis-li").addClass("del-current"); 
        $(".pop-delete,.mask-box").slideDown().find(".btn-pop-ok").on("click",function() {		
            $(".del-current").remove();      
            $(".pop-delete,.mask-box").slideUp(); 
        })
    });
});
 
