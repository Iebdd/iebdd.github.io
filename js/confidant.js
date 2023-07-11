$(document).ready(function(){
  isOpen = false;
  nav = false;
  langs = ['en'];
  if (window.localStorage.getItem('lang') === null) {
    window.localStorage.setItem('lang', 0);
  }
  load_data();
})


function load_data() {
  $.ajax('js/confidant.json', { /* Load data from confidant.json file on load */
    dataType: 'json',
    timeout: 2000,
    success: function (data, status, xhr) {
      if (window.localStorage.getItem('data') != JSON.stringify(data.confidants.lines)) {
        window.localStorage.setItem('data', JSON.stringify(data.confidants.lines)); /* Stringify JSON dict before storage as it cannot be loaded correctly otherwise */
      }
      if (window.localStorage.getItem('stats') != JSON.stringify(data.confidants.stats)) {
        window.localStorage.setItem('stats', JSON.stringify(data.confidants.stats));
      }
      if (window.localStorage.getItem('ranks') != JSON.stringify(data.confidants.ranks)) {
        window.localStorage.setItem('ranks', JSON.stringify(data.confidants.ranks)); 
      }
      if (window.localStorage.getItem('requirements') != JSON.stringify(data.confidants.requirements)) {
        window.localStorage.setItem('requirements', JSON.stringify(data.confidants.requirements));
      }
      if (window.localStorage.getItem('cells') != JSON.stringify(data.crossword.cross_cells)) {
        window.localStorage.setItem('cells', JSON.stringify(data.crossword.cross_cells)); 
      }
      if (window.localStorage.getItem('images') != JSON.stringify(data.images)) {
        window.localStorage.setItem('images', JSON.stringify(data.images));
      }
      if (window.localStorage.getItem('quest') != JSON.stringify(data.crossword.cross_quest)) {
        window.localStorage.setItem('quest', JSON.stringify(data.crossword.cross_quest)); 
      }
      if (window.localStorage.getItem('names') != JSON.stringify(data.names)) {
        window.localStorage.setItem('names', JSON.stringify(data.names));
      }
      if (window.localStorage.getItem('exams') != JSON.stringify(data.exams)) {
        window.localStorage.setItem('exams', JSON.stringify(data.exams));
      }
      (window.location.hash) ? read_fragment(window.location.hash.substring(1).toLowerCase(), data.names) : fill_main();
    },
    error: function (jqXhr, textStatus, errorMessage) {
      console.log('Error:' + errorMessage + ' in load_data');
      window.location.reload();
    }
  });
}

function read_fragment(fragment, names) {
  for (let x = 1; x <= langs.length; x++) {
    if (names[x - 1].includes(fragment)) {
      push_confidant(fragment);
      return;
    }
  }
  console.log(fragment);
  switch(fragment) {
    case 'crosswords': push_crosswords(); break;
    case 'exams': push_exams(); break;
    default: fill_main(); break;
  }
}

function fill_main() {
    if ( window.sessionStorage.getItem('main') ) {                  /* Only construct the table anew if it has not been saved this session */
      $('#table-wrapper').html(window.sessionStorage.getItem('main'));
      window.location.hash = '';
      return;
    }
  var names = JSON.parse(window.localStorage.getItem('names'));
  if (names === null) {
    location.reload();
  }
  names = names[window.localStorage.getItem('lang')];
  var img = JSON.parse(window.localStorage.getItem('images'));
  var flex_str = `<ul class="flex-container" id="main-list">`;
  for (let x = 0; x < names.length; x++) {
    flex_str += `<li class="flex-item" id="${names[x]}"><p class="main-text">${names[x]}<p/>${img[names[x]]}</li>`;
    if (x === 0) {
    }
  }
  flex_str += `</ul>`;
  $('#table-wrapper').html(flex_str);
  window.location.hash = '';
  window.sessionStorage.setItem('main', flex_str);
  return;
}

function get_cell(cell) {
  /* The dict call passed to the function will return undefined if the object does not exist and the object if it does */
  return (cell === undefined) ? `<td class="cross_cell">&nbsp</td>` : `<td class="cross_cell">${cell}</td>`;
}

function push_confidant(id) {
    let lang = window.localStorage.getItem('lang');
    if ( window.sessionStorage.getItem(id) ) {                  /* Only construct the table anew if it has not been saved this session */
      $('#table-wrapper').html(window.sessionStorage.getItem(id));
      window.location.hash = id;
      return;
    }
    var text = JSON.parse(window.localStorage.getItem('data'))[lang][0][id];    /* Load the relevant items from storage based on the id */
    var stats = JSON.parse(window.localStorage.getItem('stats'))[id];
    var ranks = JSON.parse(window.localStorage.getItem('ranks'))[id];
    var requirements = JSON.parse(window.localStorage.getItem('requirements'))[id];      /* Components for constructing the table */
    var max = 0;
    var table_str = `<h2>${id}</h2>`;                           /* String to be written to with added preamble*/ 
    for (var table = 0; table < text.length; table++) {        /* Iterate through all of the available Ranks for a specific confidant */
      table_str += '<table class="table con"><caption';
      if (requirements[table] === 0) {                          /* Append requirements in a tooltip if there are any */
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
          }                                                                                     /* possible one for this response as well as not 0 */
          else if (stats[table][column][row] != -1){
            table_str += ` +${stats[table][column][row]}`;
          }
        }
        table_str += `</tr>`;
      }
      table_str += `</table>`;
    }
    $('#table-wrapper').html(table_str);
    window.location.hash = id;
    window.sessionStorage.setItem(id, table_str);
}

function get_date(date, exams) {
  return (date === undefined) ? [exams, true] : [date, false];
}

function get_rows(answers) {
  return (Array.isArray(answers[0])) ? Math.max(...answers.map(element => element.length)) : answers.length;
}

function collapse_overflow() {
  $("#confidants-list").removeClass('overflow');            /* Collapse the confidant submenu if it is open */
  $("#confidants-list").html('');
  nav = false;
  return;
}

function push_crosswords() {
  let lang = window.localStorage.getItem('lang');
  var cells = JSON.parse(window.localStorage.getItem('cells'))[lang];   /* Get the value of all crossword cells */
  var quests = JSON.parse(window.localStorage.getItem('quest'))[lang];   /* Get the value of all crossword hints */
  var cells_str = "<h2>Crossword Puzzles</h2>";
  for (var table = 0; table < cells.length; table++) {               /* Construct as many tables as the cells array has elements */
    cells_str += `<table class="table"><caption>Q${table + 1}: ${quests[table]}</caption><tr>`;
    for (var cell = 1; cell < 101; cell++) {                         /* Iterate through all 100 cells of a table per table */
      do {
        cells_str += get_cell(cells[table][cell]);                  /* Fill the cell if that cell number has content */
        cell++;                                                       /* or add a non-breaking space if it does not */
      } while ((cell % 10) != 0)                                     /* Break the 2nd iterating loop if the elements */
      cells_str += `${get_cell(cells[table][cell])}</tr>`;           /* reach a number divisible by 10 (10/20 etc.) */
    }
    cells_str += '</table>';
  }
  $('#table-wrapper').html(cells_str);
  window.location.hash = 'crosswords';
  window.sessionStorage.setItem('crossword', cells_str);
}

function push_exams() {
  let lang = window.localStorage.getItem('lang');
  var response = [];
  var answers = [];
  var rows = 0;
  var correct = ['', ''];
  var exams = JSON.parse(window.localStorage.getItem('exams'));    /* Load the relevant items from storage based on the id */
  var dates = exams.dates;
  var exam_str = `<h2>Class and Exam Questions</h2>`;                           /* String to be written to with added preamble*/ 
  for (let x = 0; x < dates.length; x++) {
    response = get_date(exams.class_questions[lang][0][dates[x]], exams.exam_questions[lang][0][dates[x]]);
    answers = get_date(exams.class_answers[lang][0][dates[x]], exams.exam_answers[lang][0][dates[x]])[0];
    rows = get_rows(answers);
    exam_str += `<table class="table con"><caption>${dates[x]}`;
    if (response[1] && exams.exam_names[dates[x]] !== undefined) { 
      exam_str += `<br /> ` + exams.exam_names[dates[x]] + '</caption>';
    }
    for (let y = 0; y < response[0].length; y++) {
      exam_str += `<tr><th class="exam" colspan="${rows}">${response[0][y]}</th></tr><tbody><tr>`;
        if (!Array.isArray(answers[0])) {
          for (let z = 0; z < answers.length; z++) {
            correct = (exams.key[0][x] == z) ? ['<span style="color: red">', '</span>'] : ['', ''];
            exam_str += `<td class="exam">${correct[0]}${answers[z]}${correct[1]}</td>`;
          }
        }
        else {
          for (let z = 0; z < answers[y].length; z++) {
            correct = (exams.key[0][x][y] == z) ? ['<span style="color: red">', '</span>'] : ['', ''];
            exam_str += `<td class="exam">${correct[0]}${answers[y][z]}${correct[1]}</td>`
          }
        }
      exam_str += `</tr></tbody>`;
    }
  }
  console.log('Exams!');
  $('#table-wrapper').html(exam_str);
  window.location.hash = 'exams';
  window.sessionStorage.setItem('questions', exam_str);
}

$(function() {
  $("#open-button").click(function() {  /* Add or remove the class showing the menu */
    if ( isOpen ) {
      $("body").addClass("hide-menu");
      $("body").removeClass('show-menu');
    }
    else {
      $("body").addClass('show-menu');
      $("body").removeClass("hide-menu");
    }
    isOpen = !isOpen;                   /* Negates variable after opening/closing menu */
  });

  $("#confidants").click(function() {                                 /* Open and close the sub-menu showing confidant names */
    var names = JSON.parse(window.localStorage.getItem('names'));         /* Load the relevant names */
    names = names[window.localStorage.getItem('lang')];
    let menu_top_arr = [];
    let menu_bot_str = "";
    if ( !nav ) {                                               /* Only fill the string if the global nav variable is false */
      for (let x = 0; x < 19; x++) {                            /* Use names list to construct a total of 19 buttons */
        menu_bot_str += `<button class="sidebar bot" id="${names[x]}">${names[x]}</button> <br>`;
      }
      $("#confidants-list").addClass('overflow');               /* Append the overflow class list to expand the nav */
    }
    else {
      $("#confidants-list").removeClass('overflow');
    }
    $("#confidants-list").html(menu_bot_str);                   /* Depending on nav, fill the confidants-list div with */
    nav = !nav;                                                           /* an empty string or the submenu */
  })

  $("#questions").click(function() {
    collapse_overflow();
    if ( window.sessionStorage.getItem('questions') ) {         /* Only construct the table anew if it has not been saved this session */
      $('#table-wrapper').html(window.sessionStorage.getItem('questions'));
      window.location.hash = 'exams';
      return;
    }
    push_exams();
  });

  $("#crosswords").click(function() {                           /* Change main view to crosswords */
    collapse_overflow();
    if ( window.sessionStorage.getItem('crossword') ) {         /* Only construct the table anew if it has not been saved this session */
      $('#table-wrapper').html(window.sessionStorage.getItem('crossword'));
      window.location.hash = 'crosswords';
      return;
    }
    push_crosswords();
  });

  $("#confidants-list").on("click", '.sidebar', function() {    /* On click listener for the confidants-list div */
    collapse_overflow();
    var id = $(this).attr('id');                                /* Get id of the button to figure out which one was pressed */
    push_confidant(id);
  });

  $("#table-wrapper").on("click", '.flex-item', function() {    /* On click listener for the confidants-list div */
    var id = $(this).attr('id');                                /* Get id of the button to figure out which one was pressed */
    push_confidant(id);
  });

  $("#title").click(function() {
    fill_main();
  })


});

