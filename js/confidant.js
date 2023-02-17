$(document).ready(function(){
  isOpen = false;
  nav = false;
  load_data();
})


function load_data() {
  $.ajax('js/confidant.json', { /* Load data from confidant.json file on load */
    dataType: 'json',
    timeout: 2000,
    success: function (data, status, xhr) {
      localStorage.setItem('data', JSON.stringify(data.data.confidants)); /* Stringify JSON dict before storage as it cannot be loaded correctly otherwise */
      localStorage.setItem('stats', JSON.stringify(data.data.stats));
      localStorage.setItem('ranks', JSON.stringify(data.data.ranks)); 
      localStorage.setItem('requirements', JSON.stringify(data.data.requirements));
      localStorage.setItem('names', data["data"]["names"]);                       /* No need to stringify arrays but it is necessary to split them */
    },
    error: function (jqXhr, textStatus, errorMessage) {
      console.log('Error:' + errorMessage + ' in load_data');
      window.location.reload();
    }
  });
}

$(function() {
  $("#open-button").click(function() {  /* Add or remove the class showing the menu */
    if ( isOpen ) {
      $("body").removeClass('show-menu');
    }
    else {
      $("body").addClass('show-menu');
    }
    isOpen = !isOpen;                   /* Negates variable after opening/closing menu */
  });

  $("#confidants").click(function() {
    var comp = ["<button class=\"sidebar ", "bot\"", "top\"", " id=\"", "\">", "</button>", " <br>"]; /* Array menu components */
    var names = localStorage.getItem('names').split(',');                                             /* Load the relevant names */
    let menu_top_arr = [];
    let menu_bot_str = "";
    if ( !nav ) {                                               /* Only fill the string if the global nav variable is false */
      for (let x = 0; x < 19; x++) {                            /* Use names list to construct a total of 19 buttons */
        menu_bot_str += `${comp[0]}${comp[1]}${comp[3]}${names[x].toLowerCase()}${comp[4]}${names[x]}${comp[5]}${comp[6]}`;
      }
      $("#confidants-list").addClass('overflow');               /* Append the overflow class list to expand the nav */
    }
    else {
      $("#confidants-list").removeClass('overflow');
    }
    $("#confidants-list").html(menu_bot_str);                   /* Depending on nav, fill the confidants-list div with */
    nav = !nav;                                                           /* an empty string or the submenu */
  })

  $("#confidants-list").on("click", '.sidebar', function() {    /* On click listener for the confidants-list div */
    var id = $(this).attr('id');                                /* Get id of the button to figure out which one was pressed */
    var text = JSON.parse(localStorage.getItem('data'))[id];    /* Load the relevant items from storage based on the id */
    var stats = JSON.parse(localStorage.getItem('stats'))[id];
    var ranks = JSON.parse(localStorage.getItem('ranks'))[id];
    var max = 0;
    var requirements = JSON.parse(localStorage.getItem('requirements'))[id];      /* Components for constructing the table */
    var table_str = `<h2>${id}</h2>`;                                 /* String to be written to with added preamble*/ 
     for (var table = 0; table < text.length; table++) {          /* Iterate through all of the available Ranks for a specific confidant */
      table_str += '<table class="table"><caption';
      if (requirements[table] === 0) {                            /* Append requirements in a tooltip if there are any */
        table_str += `>Rank ${ranks[table]}</caption>`;
      }
      else {
        table_str += ` class="tooltip">Rank ${ranks[table]}<sup>*</sup><span class="tooltiptext">Requires ${requirements[table]}</span></caption>`;
      }
      for (var column = 0; column < text[table].length; column++) {    /* Iterate through all of the different prompts per rank per confidant */
        max = Math.max( ...stats[table][column]);
        if (column === text[table].length - 1) {
          table_str += `<tr><th>Followup</th>`;                /* Add the table head which can be Response + (column + 1) or Followup for the last one */
        }
        else {
          table_str += `<tr><th>Response ${column + 1}</th>`; 
        }
        for (var row = 0; row < text[table][column].length; row++) {    /* Iterate through all possible responses per prompt per rank per confidant */
          table_str += `<td>${text[table][column][row]}`;
          if (max === stats[table][column][row] && max != 0) {
            table_str += ` <span style="color: red">+${stats[table][column][row]}</span></td>`; /* Colour confidant gain red if it is the highest */
          }                                                                                     /* possible on for this response as well as not 0 */
          else {
            table_str += ` +${stats[table][column][row]}`;
          }
        }
        table_str += `</tr>`;
      }
      table_str += `</table>`;
    }
    $('#table-wrapper').html(table_str);
    $('#footer-wrap').removeClass('inv');
  });
});

