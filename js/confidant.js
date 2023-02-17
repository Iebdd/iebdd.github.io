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
        menu_bot_str += comp[0] + comp[1] + comp[3] + names[x].toLowerCase() + comp[4] + names[x] + comp[5] + comp[6];
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
    console.log(text[0]);
    console.log(stats[0]);
    console.log(ranks[0]);
  });
});

