$(document).ready(function(){
    localStorage.setItem('darkMode', 0);
    var json = JSON.parse('data/data.json')
    
})

$(function() {

    $('#Datacenter').on('change', function() {
        $('#btn').show();
    });
    $('#btn').on('click', function() {
        var select_value = []
        select_value[0] = $('#Datacenter').val();
        select_value[1] = $('#World').val();

        get_values(select_value)
    });
});
$(function() {
    $("#Alphabetical").click(function() {

    });
});

$(function() {
    $(".slider").click(function() {
        if(!localStorage.getItem('darkMode') || (localStorage.getItem('darkMode') && localStorage.getItem('darkMode') == 0)) {
            localStorage.setItem('darkMode', 1);
            $("body").addClass('dark');
            $('#mode-text').html('Dark mode');
            $("#mode-text").addClass('light');
        }
        else if(localStorage.getItem('darkMode') && localStorage.getItem('darkMode') == 1) {
            localStorage.setItem('darkMode', 0);
            $("body").removeClass('dark');
            $('#mode-text').html('Light mode');
            $("#mode-text").removeClass('light');

        }
    });
});

