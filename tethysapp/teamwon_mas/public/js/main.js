$(window).load(function(){
   $('#help-modal').modal('show');
   console.log ("nates pets")

    var slideIndex = 1;
    showDivs(slideIndex);

    $("#left-click").click(function(){
        var n = -1;
        showDivs(slideIndex += n);
    });

    $("#right-click").click(function(){
        var n = 1;
        showDivs(slideIndex += n);
    });

    function showDivs(n) {
      console.log("11111111111111111111111111")
      var i;
      var x = document.getElementsByClassName("mySlides");
      if (n > x.length) {slideIndex = 1}
      if (n < 1) {slideIndex = x.length}
      for (i = 0; i < x.length; i++) {
         x[i].style.display = "none";
      }
      x[slideIndex-1].style.display = "block";
    }
  })



