$(document).ready(function(){
    localStorage.setItem('darkMode', 0);
    let url = 'js/data.json';
    var data;
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.text();
        })
        .then((text) => data = text)
        .catch((error) => console.log(`Could not fetch: ${error}`));
    console.log("I am doing things!");
    
});

$(function() {

    $('#Datacenter').on('change', function() {
        $('#btn').show();
    });
    $('#btn').on('click', function() {
        var select_value = [];
        select_value[0] = $('#Datacenter').val();
        select_value[1] = $('#World').val();
    });
});
$(function() {
    $("#Alphabetical").click(function() {
        console.log("Things happen");
    });
});

$(function() {
    $(".slider").click(function() {
        if(!localStorage.getItem('darkMode') || (localStorage.getItem('darkMode') && localStorage.getItem('darkMode') == 0)) {
            localStorage.setItem('darkMode', 1);
            $("body").addClass('dark');
            $('#mode-text').html('Dark mode');
        }
        else if(localStorage.getItem('darkMode') && localStorage.getItem('darkMode') == 1) {
            localStorage.setItem('darkMode', 0);
            $("body").removeClass('dark');
            $('#mode-text').html('Light mode');

        }
    });
});

