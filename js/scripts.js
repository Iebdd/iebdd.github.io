$(document).ready(function(){
    localStorage.setItem('darkMode', 0); 
});

/*function get_data(url) {

    var data = fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            response.json();
        })
        .then((success) => {    return success.data;
        })
        .catch((error) => console.log(`Could not fetch: ${error}`));
    return data;
};*/

function adjust_listing(string) {

    $('#Datacenter').on('change', function() {
        $('#btn').show();
    });
    $('#btn').on('click', function() {
        var select_value = [];
        select_value[0] = $('#Datacenter').val();
        select_value[1] = $('#World').val();
    });
};

$(function() {
    $("#Alphabetical").click(function() {
        $.ajax('js/data.json', 
        {
            dataType: 'json',
            timeout: 500,
            success: function (data, status, xhr) {
                var string = ['<option value=\'', '\'>', '</option>'];
                var filtered = data["data"]["spells"].filter(function (el) {
                    return el != '';
                });
                filtered.sort((a, b) => a.localeCompare(b));
                var list = '';
                for (var i = 0; i < filtered.length; i++) {
                    list += string[0] + filtered[i] + string[1] + filtered[i] + string[2];
                }
                $("#Spells").html(list);

            },
            error: function (jqXhr, textStatus, errorMessage) {
                $('#Sorting').append('Error: ' + errorMessage);
            }
        })
    });
    $("#Spell_Level").click(function() {
        $.ajax('js/data.json', 
        {
            dataType: 'json',
            timeout: 500,
            success: function (data, status, xhr) {
                var string = ['<option value=\'', '\'>', '</option>', '\' disabled=\'disabled',' Level:'];
                var ordinal = ['<sup>st</sup>', '<sup>nd</sup>', '<sup>rd</sup>', '<sup>th</sup>']
                var list = '';
                var spells = data["data"]["spells"];
                var length = spells.length;
                var level = 1;
                list += string[0] + 'Cantrips:' + string[3] + string[1] + 'Cantrips:' + string[2];
                for (var i = 0; i < length; i++) {
                    if (spells[i] === '') {
                        if (level > 3) {
                            list += string[0] + level + ordinal[3] + string[4] + string[3] + string[1] + level + ordinal[3] + string[4] + string[2];
                            level++;
                            continue;
                        }
                        else {
                            list += string[0] + level + ordinal[level - 1] + string[4] + string[3] + string[1] + level + ordinal[level - 1] + string[4] + string[2];
                            level++;
                            continue;
                        }
                    }
                    list += string[0] + spells[i] + string[1] + spells[i] + string[2];
                }
                $("#Spells").html(list);
            },

            error: function (jqXhr, textStatus, errorMessage) {
                $('#Sorting').append('Error: ' + errorMessage);
            }
        });
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

