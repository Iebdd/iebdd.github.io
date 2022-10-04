$(document).ready(function(){
    localStorage.setItem('darkMode', 0); 
    set_alphabetical();
});

function set_alphabetical() {
    $.ajax('js/data.json', 
    {
        dataType: 'json',
        timeout: 500,
        success: function (data, status, xhr) {
            var string = ['<option value="', '">', '</option>'];
            var filtered = data["data"]["spells"].filter(function (el) {
                return el != '';
            });
            filtered.sort((a, b) => a.localeCompare(b));
            var list = '';
            for (var i = 0; i < filtered.length; i++) {
                filtered[i].replace(/'/, "\\'");
                list += string[0] + filtered[i] + string[1] + filtered[i] + string[2];
            }
            $("#Spell").html(list);
            localStorage.setItem('Sorting', 1);
        },
        error: function (jqXhr, textStatus, errorMessage) {
            $('#Sorting').append('Error: ' + errorMessage);
        }
    });
};

function set_spell_level() {
    if (localStorage.getItem('Sorting') == 0) {
        return;
    }
    else {
        $.ajax('js/data.json', 
        {
            dataType: 'json',
            timeout: 500,
            success: function (data, status, xhr) {
                var string = ['<option value="', '">', '</option>', '" disabled style="font-weight:bold;color:black',' Level:'];
                var ordinal = ['<sup>st</sup>', '<sup>nd</sup>', '<sup>rd</sup>', '<sup>th</sup>'];
                var list = '';
                var spells = data["data"]["spells"];
                var length = spells.length;
                var level = 1;
                list += string[0] + 'Cantrips:' + '" disabled selected style="font-weight:bold;color:black' + string[1] + 'Cantrips:' + string[2];
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
                    spells[i].replace(/'/, "\\'");
                    list += string[0] + spells[i] + string[1] + spells[i] + string[2];
                }
                $("#Spell").html(list);
                localStorage.setItem('Sorting', 0);
            },
            error: function (jqXhr, textStatus, errorMessage) {
                $('#Sorting').append('Error: ' + errorMessage);
            }
        });
    }
}

$(function() {

    $("#btn").click(function() {
        var spell = $('#Spell').val().toLowerCase().split(' ');
        var variations = get_variations(spell);
        console.log(variations);
        var total_rows = 0;
        for (var i = 0; i < variations.length; i++) {
            total_rows += variations[i].length;
        }
        console.log(total_rows);
    })
    
    $("#Alphabetical").click(function() {
        if (localStorage.getItem('Sorting') == 1) {
            return;
    }
        set_alphabetical();
    });

    $("#Spell_Level").click(function() {
        set_spell_level();
    });

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

function get_variations(spell) {
    $.ajax('js/data.json', {
        dataType: 'json',
        timeout: 500,
        success: function (data, status, xhr) {
            var components = [];
            for (var i = 0; i < spell.length; i++) {
                components.push(data["data"]["variations"][spell[i]]);
            }
            return components;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            $('#Sorting').append('Error: ' + errorMessage);
        }
    });
}

