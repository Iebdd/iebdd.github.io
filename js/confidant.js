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
  $("#open-button").click(function() {  /* Add or remove */
    if ( isOpen ) {
      $("body").removeClass('show-menu');
    }
    else {
      $("body").addClass('show-menu');
    }
    isOpen = !isOpen;                   /* Negates variable after opening/closing menu */
  });

  $("#confidants").click(function() {
    var comp = ["<button class=\"sidebar ", "bot\"", "top\"", " id=\"", "\">", "</button>", " <br>"];
    var names = localStorage.getItem('names').split(',');
    let menu_top_arr = [];
    let menu_bot_str = "";
    if ( !nav ) {
      for (let x = 0; x < 19; x++) {
        menu_bot_str += comp[0] + comp[1] + comp[3] + names[x + 3].toLowerCase() + comp[4] + names[x + 3] + comp[5] + comp[6];
      }
      $("#confidants-list").addClass('overflow');
    }
    else {
      $("#confidants-list").removeClass('overflow');
    }
    $("#confidants-list").html(menu_bot_str);
    nav = !nav;
  })

  $("#confidants-list").on("click", '.sidebar', function() {
    var id = $(this).attr('id');
    console.log(id);
  });
});

