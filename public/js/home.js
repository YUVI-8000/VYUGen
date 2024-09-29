$('.navTrigger').click(function () {
    $(this).toggleClass('active');
    console.log("Clicked menu");
    $("#mainListDiv").toggleClass("show_list");
    $("#mainListDiv").fadeIn();

});

$(window).scroll(function() {
    if ($(document).scrollTop() > 50) {
        $('.nav').addClass('affix');
    } else {
        $('.nav').removeClass('affix');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const navTrigger = document.querySelector('.navTrigger');
    const mainListDiv = document.querySelector('.nav div.main_list');

    navTrigger.addEventListener('click', function () {
        navTrigger.classList.toggle('active');
        mainListDiv.classList.toggle('expanded');
    });
});
