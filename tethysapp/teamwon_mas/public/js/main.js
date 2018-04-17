$(window).load(function(){
   $('#help-modal').modal('show');

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



