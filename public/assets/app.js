$(function(){

  $("#scrapeArticlesButton").on("click", function(event) {
    event.preventDefault();

    $(".articlesScrapedBody").empty();

    $.ajax("/api/all", {
      type: "GET"
    }).then(function(response) {

      var oldLength = response;

      $.ajax("/api/scrape", {
        type: "POST"
      }).then(function(response) {

        $.ajax("/api/reduce", {
          type: "DELETE"
        }).then(function(response) {

          var newText = $("<div>");
          var newLength = response.length;

          var numberChanged = parseInt(newLength) - parseInt(oldLength);

          if(numberChanged == 0) {
            newText.tex("Scraper is updated")
            $(".articlesScrapedBody").append(newText)
            $("#scrapeArticlesModal").modal("show");
          }
          else {
            newText.text(numberChanged + "new articles added!")
            $(".articlesScrapedBody").append(newText)
            $("#scrapeArticlesModal").modal("show");
          }
        })
      })
    })
  });

  $("#closeScrapeButton").on("click", function(event) {
    event.preventDefault();

    $.ajax("/", {
      type: "GET"
    }).then(function() {
      location.reload();
    })
  });

  $(".saveArticleButton").on("click", function(event) {
    event.preventDefault();

    $(".articleSavedBody").empty();

    var articleId= $(this).data("id");

    $.ajax("/api/save/article/" + articleId, {
      type: "PUT"
    }).then(function() {
      var newText = $("<div>");
      newText.text("View article in your saved articles.");
      $(".articleSavedBody").append(newText);
      $("#articleSavedModal").modal("show");
    })
  });

  $("#closeArticleButton").on("click", function(event) {
    event.preventDefault();

    $.ajax("/", {
      type: "GET"
    }).then(function() {
      location.reload();
    })
  });
})




$('.deleteSavedArticleButton').on("click", function(event) {
  event.preventDefault();

  $('.articleDeleteBody').empty();

  let articleId = $(this).data("id");

  $.ajax("/api/delete/article/" + articleId, {
      type: "PUT"
  }).then(function() {
      let newText = $('<div>');
      newText.text("Article deleted from your Saved Articles");
      $('.articleDeleteBody').append(newText);
      $('#articleDeleteModal').modal('show');
  })

});

$('.deleteSavedArticleModalButton').on('click', function(event) {

  event.preventDefault();

  $.ajax("/saved", {
      type: "GET"
  }).then(function() {
      location.reload();
      console.log("saved site updated")
  })

});

$('.addNoteButton').on("click", function(event) {

  event.preventDefault();

  let articleId = $(this).data("id");
  $('.noteModalBody').empty();
  $('.noteAlert').remove();

  $.ajax("/api/notes/" + articleId, {
      type: "GET"
  }).then(function(result) {

      $('.noteModalBody').append("<h2>" + result.headline + "</h2>");
      $('.noteModalBody').append("<ul id='noteList'>")

      let newForm = $('<form>');
      
      let newFormGroup1 = $('<div>');
      newFormGroup1.addClass("form-group");
      let newFormGroupLabel1 = $('<label for="titleinput">');
      newFormGroupLabel1.text("New Note Title");
      newFormGroup1.append(newFormGroupLabel1);
      newFormGroup1.append("<input id='titleinput' name='title' >");

      let newFormGroup2 = $('<div>');
      newFormGroup2.addClass("form-group");
      let newFormGroupLabel2 = $('<label for=bodyinput">');
      newFormGroupLabel2.text("New Note Text");
      newFormGroup2.append(newFormGroupLabel2);
      newFormGroup2.append("<textarea id='bodyinput' name='body'></textarea>");


      // let newButton = $("<button data-id='" + result._id + "' class='saveNoteButton'>Save Note</button>");

      $('.saveNoteButton').attr("data-id", result._id)
      newForm.append(newFormGroup1);
      newForm.append(newFormGroup2);
      // newForm.append(newButton);

      $('.noteModalBody').append(newForm)

      for (let i = 0; i < result.note.length; i ++) {
          let newCard = $('<div class=card>');
          newCard.addClass("noteCard")
          let newCardHeader = $('<div class=card-header>' + result.note[i].title + '</div>');
          let newCardBody = $('<div class=card-body>');
          newCardBody.addClass("noteCardBody")
          newCardBody.text(result.note[i].body)
          newCard.append(newCardHeader);
          newCard.append(newCardBody);
          newCard.append("<button class=deleteNoteButton data-id=" + i + ">Delete</button>");

          $('.noteModalHeader').append(newCard);
          
      }
  }).then(
      $('#noteModal').modal('show')
  )

});

$('.saveNoteButton').on("click", function(event) {

  let articleId = $(this).attr("data-id");

  $.ajax("/api/create/notes/" + articleId, {
      type: "POST",
      data: {
          title: $("#titleinput").val(),
          body: $("#bodyinput").val()
      }
  }).then(function(result) {
      console.log(result);
      let noteAdded = $('<p>');
      noteAdded.addClass('noteAlert');
      noteAdded.text("Note successfully added")
      $('.alertDiv').append(noteAdded);
      $("#titleinput").val("");
      $("#bodyinput").val("");
  })

});

$('.deleteNoteButton').on("click", function(event) {

  event.preventDefault();

  console.log("clicked");


});


$(window).scroll(function() {scrollFunction()} );
// Get the navbar
var navbar = document.getElementById("navbar");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function scrollFunction() {

  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } 
  else {
    navbar.classList.remove("sticky");
  }

}