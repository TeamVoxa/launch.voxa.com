(function(){
  jQuery.fn.exists = function(){return this.length>0;}

  $(document).ready(function(){

    var alertTimeout;

    $('body,html').bind('scroll mousedown wheel DOMMouseScroll mousewheel keyup', function(e){
      if ( e.which > 0 || e.type == "mousedown" || e.type == "mousewheel"){
        $("html,body").stop();
      }
    });

    function isSingleColumnView(){
      return $(window).width() <= 480;
    }

    function isTouch(){
      //return true;
      return Modernizr.touch;
    }

    function scrollTo(target, center){
      var pos = target.position().top;
      if(center){
        pos -= Math.max(0, ($(window).height() - target.outerHeight())/2);
      }
      $.scrollTo(pos, {
        duration: 2000,
        easing: "easeOutExpo",
        axis: "y"
      });    
    }



    function initSplashCentering(){
      var updatePos = function () {
        var el = $(".splash-wrap");
        var width = $(window).width();
        var height = $(window).height();
        var left = Math.max(0, (width / 2) - (el.width() / 2)) + "px";
        var top = Math.max(0, (height / 2) - (el.outerHeight() / 2)) + "px";
        var position = isTouch()? "relative" : "fixed"

        el.css("position",position).css("left", left).css("top", top);
        el.attr("data-top", top);
      }; 

      $(window).resize(updatePos);
      updatePos();
    }
    



    function initAnalytics(){
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-42462226-1', 'chrishalaschek.com');
      ga('send', 'pageview');
    }

    function removeAlert(ingoreFade){
      if(alertTimeout != null){
        clearTimeout(alertTimeout);
      }

      if(ingoreFade){
        return $(".alert").remove();
      }

      $(".alert").fadeOut(function(){
        this.remove();
      })
    }


    function showAlert(message){
      var alert = $('<div class="alert alert-danger">' + message + '</div>').hide();
      removeAlert(true);
      alert.insertAfter(".beta button");
      alert.fadeIn();

      alertTimeout = setTimeout(function(){
        removeAlert();
      }, 5000);
    }

    function validateEmail(email) { 
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    } 


    function initForm(){
      $("select").customSelect();

      $(".beta button").tap(function(){
        removeAlert(true);

        var email = $("#email").val();
        var crm = $("#crm").val();

        if(email == undefined || email == ""){
          return showAlert("Please enter email address");
        }

        if(!validateEmail(email)){
          return showAlert("Please enter a valid email address");
        }

        if(crm == undefined || crm == ""){
          return showAlert("Please select the CRM that you currently use");
        }

        //alert(email + " " + crm);
      });
    }

    function showSplash(){
      setTimeout(function(){
        var splash = $(".splash-wrap");
        splash.hide();
        splash.css("visibility", "visible");
        $(".splash-wrap").fadeIn();
      }, 400);
    }


    initSplashCentering();
    initForm();
    initAnalytics();
    showSplash();
  });
})();

