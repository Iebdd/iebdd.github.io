$(document).ready(function(){
    localStorage.setItem('darkMode', 0);/* Set the Dark Mode variable on load to false */
    load_data();                        /* Load data.json and write it to localStorage on load */
    set_alphabetical();                 /* Set the list to alpahebtical by default */
    if(is_mobile() == true) {           /* Load mobile css if the device is in portrait mode */
        $("body").addClass('mobile');
    }  
});

function is_mobile() {
    var width = window.screen.width;
    var height = window.screen.height;
    var ratio = width / height;          
    if (ratio < 1) {                    /* Assume a mobile browser when the screen is higher than it is wide */
        return true;
    }
    else {
        return false;
    }
};

function load_data() {
    $.ajax('js/data.json', {            /* Load data from data.json file on load */
        dataType: 'json',
        timeout: 500,
        success: function (data, status, xhr) {
            localStorage.setItem('variations', JSON.stringify(data.data.variations));   /* Stringify JSON dict before storage as it cannot be loaded correctly otherwise */
            localStorage.setItem('spells', data.data.spells);
            localStorage.setItem('spell_level', data.data.spell_level);
        },
        error: function (jqXhr, textStatus, errorMessage) {
            $('#Sorting').append('Error: ' + errorMessage);
        }
    }); 
}

function set_alphabetical() {
    var string = ['<option value="', '">', '</option>'];
    data = localStorage.getItem('spells').split(',');
    level = localStorage.getItem('spell_level').split(',');
    for (var i = 0; i < level.length; i++) {
        console.log('Spell:' + data[i] + '\nLevel:' + level[i]);
    }
    var list = '';
    for (let i = 0; i < data.length; i++) {
        data[i].replace(/'/, "\\'");            /* Sanitise strings before formatting to option menu */
        list += string[0] + data[i] + string[1] + data[i] + string[2]; /* Assemble menu from strings and data */
    }
    $("#Spell").html(list);
    localStorage.setItem('Sorting', 1);
}

function build_menu(array, components) {
    var string = '';
    for (let i = 0; i < array.length; i++) {
        console.log(string);
        string += components[0] + array[i] + components[1] + array[i] + components[2];
    }
    return string;
 }

function set_spell_level() {
    if (localStorage.getItem('Sorting') == 0) {     /* Abort if menu is already sorted by spell level */
        return;
    }
    else {
        var components = ['<option value="', '">', '</option>', '" disabled style="font-weight:bold;color:black',' Level:'];
        var ordinal = ['<sup>st</sup>', '<sup>nd</sup>', '<sup>rd</sup>', '<sup>th</sup>', '<sup>th</sup>', '<sup>th</sup>', '<sup>th</sup>', '<sup>th</sup>', '<sup>th</sup>'];
        var list = '';
        var spells = localStorage.getItem('spells').split(',');
        var level = localStorage.getItem('spell_level').split(',');
        var length = spells.length;
        var cur_level = 1;
        list = components[0] + 'Cantrips:' + components[3] + components[1] + 'Cantrips:' + components[2];      /* Append Cantrip menu */
        list += build_menu(spells.filter((element, index) => {return level[index] == 0}), components);    /*  and Cantrip spells */
        for (let x = 1; x < 10; x++) {
            list += components[0] + x + ordinal[x] + components[4] + components[3] + components[1] + x + ordinal[x] + components[4] + components[2];    /* First add the disabled menu point */
            list += build_menu(spells.filter((element, index) => {return level[index] == x}), components);                        /* then the spells within them       */
            spells[x].replace(/'/, "\\'");
        }
        $("#Spell").html(list);         /* Push list to html object */
        localStorage.setItem('Sorting', 0);
    }
}

$(function() {

    $("#btn").click(function() {                                /* Act if the 'Confirm' button is pressed */
        var spell = $('#Spell').val().toLowerCase().split(' '); /* Get the value of the option when the button is pressed */
        var total_rows = 0;
        var cur_row = 0;
        var keywords = new Array;
        var new_spells = new Array;
        var buffer = new Array;
        var list = '<ul>\n   '
        var variations = JSON.parse(localStorage.getItem('variations'));    /* Extract dict from localStorage and parse to JSON */
        for (let i = 0; i < spell.length; i++) {                /* Iterate over the amount of words in the chosen spell */
            keywords.push(variations[spell[i]]);                /* Construct an array consisting of available variations of the spell components */
            total_rows += keywords[i].length;                   /* and enumerate the amount of rows needed for the final spell variations */
        }
        for (let i = 0; i < keywords.length; i++) {             /* Iterate over the amount of words in the spell */
            for (let z = 0; z < cur_row; z++) buffer.push(spell[i]);    /* Add unchanged spell components to the buffer array if earlier parts of the spell have already been changed */
            for (let x = 0; x < keywords[i].length; x++) {      /* Iterate over the amount of keyword variations per spell component */
                buffer.push(keywords[i][x]);                    /* Push the [x]th variation of the [i]th keyword to the buffer array */
                cur_row++;                                      /* Increment the amount of rows that have already been filled */
            }
            for (let y = cur_row; y < total_rows; y++) buffer.push(spell[i]);   /* Top up the buffer array for the next variations */
            new_spells.push(buffer);                            /* Push the buffer to the final array */
            buffer = [];                                        /* Empty the buffer by assigning it to a new dynamic space without deleting the previous ones */
        }
        for (let i = 0; i < new_spells[0].length; i++) {        /* Iterate over the amount of available variations. Since all array arrays should be the same length any of the elements can be chosen */
            list += '<li>';
            for (let x = 0; x < new_spells.length; x++) {       /* Iterate over the amount of keywords */
            if (spell.includes(new_spells[x][i])) {             /* If the current variation element is an original spell component, print in black */
                list += new_spells[x][i] + ' ';
            }
            else {
                list += '<span style="color: red">' + new_spells[x][i] + '</span>' + ' ';   /* Else print in red */
            }
            }
            list = list.slice(0, -1) + '</li>';                 /* Copy the list to itself without the last element and the list item end tag */
        }
        list += '</ul>';
        $("#New_Spells").html(list);
    })
    
    $("#Alphabetical").click(function() {
        if (localStorage.getItem('Sorting') == 1) {             /* If the menu is already alphabetical, return */
            return;
    }
        set_alphabetical();
    });

    $("#Spell_Level").click(function() {
        set_spell_level();
    });

    $(".slider").click(function() {                             /* If the darkMode variable exists and is 0, enter dark mode */
        if(!localStorage.getItem('darkMode') || (localStorage.getItem('darkMode') && localStorage.getItem('darkMode') == 0)) {
            localStorage.setItem('darkMode', 1);
            $("body").addClass('dark');
            $('#mode-text').html('Dark mode');  
        }                                                       /* Else exit dark mode (Or whatever unintended state) */
        else if(localStorage.getItem('darkMode') && localStorage.getItem('darkMode') == 1) {
            localStorage.setItem('darkMode', 0);
            $("body").removeClass('dark');
            $('#mode-text').html('Light mode');

        }
    });
});

