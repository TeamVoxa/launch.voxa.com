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


    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search.toLowerCase());
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }


    function initSplashCentering(){
      var updatePos = function () {
        var el = $(".splash-wrap");
        var width = $(window).width();
        var height = $(window).height();
        var left = Math.max(0, (width / 2) - (el.width() / 2)) + "px";
        var top = Math.max(0, (height / 2) - (el.outerHeight() / 2)) + "px";
        //var position = isTouch()? "relative" : "fixed"
        var position = "relative";

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
        // check if button is locked
        if($(this).hasClass("locked")){
          return;
        }

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

        //return showAlert("Slow down, this is still under construction.");
        submitForm();
      });
    }


    function showSuccess(data){
      console.log(data);

      var success = $(".success");
      
      var shareUrl = window.location.protocol + "//" + window.location.hostname + "/?kid=" + data.social_id;

      // update url
      var url = success.find(".share-url");
      url.attr("href", shareUrl);
      url.text(shareUrl);

      //update facebook
      $("#share_facebook").attr("onclick", "window.open('https://www.facebook.com/sharer.php?u=" + shareUrl + "', '_blank', 'width=800,height=400')");

      //update twitter
      $("#share_twitter").attr("onclick", "window.open('https://twitter.com/share?url=" + encodeURIComponent(shareUrl) + "&text=Check+out+Voxa!', '_blank', 'width=800,height=300')");

      //update linkedin
      $("#share_linkedin").attr("onclick", "window.open('http://www.linkedin.com/shareArticle?mini=true&url=" + shareUrl + "&title=Voxa', '_blank', 'width=800,height=400')");

      //update g+
      $("#share_googleplus").attr("href", "https://plus.google.com/share?url=" + shareUrl);
      $("#share_googleplus").attr("onclick", "javascript:window.open(this.href,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;");

      //update email
      $("#share_email").attr("href", "mailto:?subject=Voxa&body=Check out Voxa! " + shareUrl);


      success.fadeIn();

      $(".info").remove()
    }

    function submitForm(){
      var button = $("button");
      var buttonText = button.text();



      var data = {
        email: $("#email").val(),
        crm: $("#crm").val(),
        social_id: getParameterByName("kid")
      };

      function toggleSubmit(locked){
        if(locked){
          button.addClass("locked");
          button.text("Submitting...");
        }else{
          button.removeClass("locked");
          button.text(buttonText);
        }
      }

      toggleSubmit(true);

      $.ajax({
        url: 'https://api.kickofflabs.com/v1/23560/subscribe',
        data: data,
        dataType: 'jsonp',
        jsonp: 'jsonp',
        success: function(data){
          toggleSubmit();
          showSuccess(data);
        },
        error: function(){
          toggleSubmit();
          showAlert("Error requesting invite. Please try again.");
        },
        timeout: 2000,
        context: this
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
