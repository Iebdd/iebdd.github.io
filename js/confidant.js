$(document).ready(function(){
  isOpen = false;
  nav_menu = false;
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
  $("#open-button").click(function() {
    if ( isOpen ) {
      $("body").removeClass('show-menu');
    }
    else {
      $("body").addClass('show-menu');
    }
    isOpen = !isOpen;
  });

  $("#navbar").click(function() {
    console.log(nav_menu);
    if ( nav_menu ) {
      let menu = '<button class="sidebar top" id="confidants">Confidants</button> <br> <button class="sidebar top" id="crosswords" disabled>Crossword</button> <br> <button class="sidebar top" id="exams" disabled>Exams</button>'
      $("#navbar").html(menu);
      nav_menu = false;
      console.log("nav = false");
    }
    else {
      nav_menu = true;
      var comp = ["<button class=\"sidebar ", "bot\"", "top\"", " id=\"", "\">", "</button>", " <br>"];
      var names = localStorage.getItem('names').split(',');
      let menu_top_arr = [];
      let menu_bot_str = "";
      for (let x = 0; x < 19; x++) {
        if (x < 4) {
          var menu_top = comp[0] + comp[2] + comp[3] + names[x].toLowerCase() + comp[4] + names[x] + comp[5];
          if (x < 3) {
            menu_top += comp[6]
          }
        }
        var menu_bot = comp[0] + comp[1] + comp[3] + names[x + 3].toLowerCase() + comp[4] + names[x + 3] + comp[5] + comp[6]
        menu_top_arr.push(menu_top);
        menu_bot_str += menu_bot;
      }
      let menu = menu_top_arr[0] + menu_bot_str + menu_top_arr[1] + menu_top_arr[2];
      console.log(menu);
      $("#navbar").html(menu);
    }
  });
});
