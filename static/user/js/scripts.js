(function($) {

    "use strict";


    $(document).ready(function() {
        /*$(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $('.topbar').addClass("animated slideInDown is-fixed"), 3000;
            } else {
                $('.tobar').removeClass("animated slideInDown is-fixed"), 3000;
            }
        });*/
        var navsite = $(".topbar");
        if (navsite.length) {
            var offset = $(".topbar").offset().top;
        }
        $(document).scroll(function() {
            var scrollTop = $(document).scrollTop();
            if (scrollTop > offset) {
                $(".topbar").addClass("animated slideInDown is-fixed");

            } else {
                $(".topbar").removeClass("animated slideInDown is-fixed");
            }
        });


        $('#sidebarToggleTop').on('click', function(e) {
            $(this).toggle()
            $('#sidebarToggleclose').toggle()
            $('.sidebar').addClass('active');
            $('#content-wrapper').addClass('collapesed');
        });

        $('#sidebarToggleclose').on('click', function(e) {
            $(this).toggle()
            $('#sidebarToggleTop').toggle()
            $('.sidebar').removeClass('active');
            $('#content-wrapper').removeClass('collapesed');
        });



    });
})(jQuery);