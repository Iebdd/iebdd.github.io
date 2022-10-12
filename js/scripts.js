$(document).ready(function(){
    localStorage.setItem('darkMode', 0);
    load_data();
    set_alphabetical();
    if(is_mobile() == true) {
        $("body").addClass('mobile');
        document.getElementById(".switch").style.display = "none";
    }  
});

function is_mobile() {
    var width = window.screen.width;
    var height = window.screen.height;
    var ratio = width / height;
    if (ratio < 1) {
        return true;
    }
    else {
        return false;
    }
};

function load_data() {
    $.ajax('js/data.json', {
        dataType: 'json',
        timeout: 500,
        success: function (data, status, xhr) {
            localStorage.setItem('variations', JSON.stringify(data.data.variations));
            localStorage.setItem('spells', data.data.spells);
        },
        error: function (jqXhr, textStatus, errorMessage) {
            $('#Sorting').append('Error: ' + errorMessage);
        }
    }); 
}

function set_alphabetical() {
    var string = ['<option value="', '">', '</option>'];
    data = localStorage.getItem('spells');
    data = data.split(',');
    filtered = data.filter(function (el) {return el != '';});
    filtered.sort((a, b) => a.localeCompare(b));
    var list = '';
    for (var i = 0; i < filtered.length; i++) {
        filtered[i].replace(/'/, "\\'");
        list += string[0] + filtered[i] + string[1] + filtered[i] + string[2];
    }
    $("#Spell").html(list);
    localStorage.setItem('Sorting', 1);
}

function set_spell_level() {
    if (localStorage.getItem('Sorting') == 0) {
        return;
    }
    else {
        var string = ['<option value="', '">', '</option>', '" disabled style="font-weight:bold;color:black',' Level:'];
        var ordinal = ['<sup>st</sup>', '<sup>nd</sup>', '<sup>rd</sup>', '<sup>th</sup>'];
        var list = '';
        var spells = localStorage.getItem('spells').split(',');
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
    }
}

$(function() {

    $("#btn").click(function() {
        var spell = $('#Spell').val().toLowerCase().split(' ');
        var total_rows = 0;
        var cur_row = 0;
        var keywords = new Array;
        var new_spells = new Array;
        var buffer = new Array;
        var list = '<ul>\n   '
        var variations = JSON.parse(localStorage.getItem('variations'));
        for (var i = 0; i < spell.length; i++) {
            keywords.push(variations[spell[i]]);
            total_rows += keywords[i].length;
        }
        for (var i = 0; i < keywords.length; i++) {
            for (var z = 0; z < cur_row; z++) buffer.push(spell[i]);
            for (var x = 0; x < keywords[i].length; x++) {
                buffer.push(keywords[i][x]);
                cur_row++;
            }
            for (var y = cur_row; y < total_rows; y++) buffer.push(spell[i]);
            new_spells.push(buffer);
            buffer = [];
        }
        for (var i = 0; i < new_spells[0].length; i++) {
            list += '<li>';
            for (var x = 0; x < new_spells.length; x++) {
            if (spell.includes(new_spells[x][i])) {
                list += new_spells[x][i] + ' ';
            }
            else {
                list += '<span style="color: red">' + new_spells[x][i] + '</span>' + ' ';
            }
            }
            list = list.slice(0, -1) + '</li>';
        }
        list += '</ul>';
        $("#New_Spells").html(list);
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

