//todos
//1. DONE When the user clicks on a button, the page should grab 10 static, non-animated gif images from the GIPHY API and place them on the page.
//2. DONE Above every gif, display its rating 
//3. add style and formatting (BOOTSTRAP)
//4. Last button hit is highlighted  (PROBABLY BOOTSTRAP)
//5. Theme??? Sci Fi tv shows? 




    //when something with the ID cat Button is clicked, the funciton happens
var buttonArr = ["Doctor Who", "Daleks", "Cybermen", "Weeping Angels", "Davros", "TARDIS", "Gallifrey", "Rose Tyler", "River Song", "Clara Oswald"];


 function renderButtons() {
        // Deletes the movies prior to adding new movies
        // (this is necessary otherwise you will have repeat buttons)
        $("#buttons-view").empty();
        // Loops through the array of movies
        for (var i = 0; i < buttonArr.length; i++) {
          // Then dynamicaly generates buttons for each movie in the array
          // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
          var a = $("<button>");
          // Adds a class of movie to our button
          a.addClass("getGif btn btn-info");
          // Added a data-attribute
          a.attr("data-name", buttonArr[i]);
          // Provided the initial button text
          a.text(buttonArr[i]);
          // Added the button to the buttons-view div
          $("#buttons-view").append(a);
        }
      }
renderButtons()
 
$(document).ready(function() {
	//make it listen for objects that have the class gifImage, without this weird format, it would only see those that were created at first render
     $('body').on('click', '.gifImage', function () {
		
			//assigns the state of the image
		  var state = $(this).attr("data-state")
		  //handles the switching
		  if (state==="still") {
			$(this).attr("src", $(this).attr("data-animate"))
			$(this).attr("data-state", "animate")
		  }
		  //switches back if first criteria is not hit
		  else {
			$(this).attr("src", $(this).attr("data-still"))
			$(this).attr("data-state", "still")
		  }
	 
		});
		
    $('body').on('click', ".getGif", function () {
  

		//base URL 
	  var baseURL = "https://api.giphy.com/v1/gifs/search?"
	  //var baseURL = "https://api.giphy.com/v1/gifs/random?"
	  //my API key
	  var apiKey = "api_key=S1J3JVgAulmKTTWZ7ZBEKI7BK1MNDa0v"
	  
	  var limit = "&limit=10"
	  
	  var query = "&q=";
	  
	  var buttonName = $(this).attr("data-name")
	  
		var ajaxURL = baseURL + apiKey + query + buttonName + limit
		
		console.log(ajaxURL)
		//clears the gifs if there are some there
	  $("#images").empty()
		
	  //this is the jquery ajax call
	  $.ajax({
		//takes the URL which is our queryURL
		url: ajaxURL,
		//magic method of GET (something something SERVER HTTP STUFF something something)
		method: "GET"
	  })
	  //happens after the promise above is fullfilled
		.then(function(response) {
			console.log(response)
			
		//grabs the image URL from the response fullfilled in the promise, this format is dictated by the API
		  for (i = 0; i < response.data.length; i++ ) {
			  
		  var newDiv = $("<div>")
		  newDiv.addClass("gifDisplay")
		  //var imageStill =  response.data[i].images.fixed_height_still.url
		  //var imageAnimate = response.data[i].images.fixed_height.url
			var imageStill =  response.data[i].images.fixed_height_still.url
		  var imageAnimate = response.data[i].images.fixed_height.url
		  //creates an image jquery object
		  var image = $("<img>");
		  var rating = response.data[i].rating;
			var p = $("<p>").text("Rating: " + rating);
			p.addClass("rating")
		  image.addClass("gifImage");
		  //assigns the intial data-state to still
		  image.attr("data-state", "still");
		  //creates the data-animate link to be equal to the animated gif
		  image.attr("data-animate", imageAnimate);
		  
		  //creates the data-still attr to be equal to the imageStill 
		  image.attr("data-still", imageStill);
		  
		  //sets the source of the image object to be the data from the API
		  image.attr("src", imageStill);
		  //sets the alt to be " image"
		  image.attr("alt", "image");
		  //adds the cat image to ID on the page #images
		  newDiv.prepend(image);
		  newDiv.append(p)
		 
		 
		  
		  $("#images").prepend(newDiv)
		  
		  }
		});
	// closes $("#cat-button").on("click", function() {
	});
	
	$("#submitButton").on("click", function(event) {
				event.preventDefault();
				
        // This line of code will grab the input from the textbox
				var newButton = $("#buttonInput").val().trim();
				$('#buttonInput').val('');
        // The movie from the textbox is then added to our array
        buttonArr.push(newButton);
        // Calling renderButtons which handles the processing of our movie array
        renderButtons();
      });
	
	
	
	
	
//closes the $(document).ready(function() {
});



//https://api.giphy.com/v1/gifs/random?api_key=S1J3JVgAulmKTTWZ7ZBEKI7BK1MNDa0v&tag=cats