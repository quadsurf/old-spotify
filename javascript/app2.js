// Self envoking function! once the document is ready, bootstrap our application.
// We do this to make sure that all the HTML is rendered before we do things
// like attach event listeners and any dom manipulation.
(function(){
  $(document).ready(function(){
    bootstrapSpotifySearch();
  })
})();

/**
  This function bootstraps the spotify request functionality.
*/
function bootstrapSpotifySearch(){

  var userInput, searchUrl, results;
  var outputArea = $("#q-results");

  $('#spotify-q-button').on("click", function(){
      var spotifyQueryRequest;
      spotifyQueryString = $('#spotify-q').val();
      searchUrl = "https://api.spotify.com/v1/search?type=artist&q=" + spotifyQueryString;

      // Generate the request object
      spotifyQueryRequest = $.ajax({
          type: "GET",
          dataType: 'json',
          url: searchUrl
      });

      // Attach the callback for success
      // (We could have used the success callback directly)
      spotifyQueryRequest.done(function (data) {
        var artists = data.artists;

        // Clear the output area
        outputArea.html('');

        // The spotify API sends back an arrat 'items'
        // Which contains the first 20 matching elements.
        // In our case they are artists.
        artists.items.forEach(function(artist){
          var artistLi = $("<li>" + artist.name + " - " + artist.id + "</li>")
          artistLi.attr('data-spotify-id', artist.id);
          outputArea.append(artistLi);

          artistLi.click(displayAlbumsAndTracks);
        })
      });

      // Attach the callback for failure
      // (Again, we could have used the error callback direcetly)
      spotifyQueryRequest.fail(function (error) {
        console.log("Something Failed During Spotify Q Request:")
        console.log(error);
      });
  });
}
var albumIDs = [];
var albumData = [];

// var liWriter = function(albumID, albumData) {
//   var li = document.createElement('li');
//   li.id = albumID;
//   $('albums-and-tracks').append(li);
//   $(albumID).html(albumData);
// }

/* COMPLETE THIS FUNCTION! */
function displayAlbumsAndTracks(event) {
  var appendToMe = $('#albums-and-tracks');

  // These two lines can be deleted. They're mostly for show.
  console.log("you clicked on:");
  console.log($(event.target).attr('data-spotify-id'));
  var artistID = $(event.target).attr('data-spotify-id');






  var getAlbums = $.getJSON('https://api.spotify.com/v1/artists/' + artistID + '/albums').then(function(data) {
    // console.log('Grabbed Data: ' + data.items[0].id);
    //get every album
    for(var i = 0; i < data.items.length; i++) {
      albumIDs.push(data.items[i].id);
    }//end for loop
    console.log("Array of Album IDs: " + albumIDs);
  }).then(function(data) {
    for (var i = 0; i < albumIDs.length; i++) {
      $.getJSON('https://api.spotify.com/v1/albums/' + albumIDs[i]).then(function(data) {
        albumData.push({
        albumID:data.id,
        albumName:data.name,
        relDate:data.release_date,
        pop:data.popularity,
        img:data.images[2].url
        })//end object push
      })//end then function
    }//end for loop

  }).then(function() {
    for (var i = 0; i < albumData.length; i++) {
      $('#albums-and-tracks').append(albumData[i]);      
    }
    // console.log("Album ID: " + albumData);
    // for(key in albumData) {
    //   console.log(key, value);
    // }
    // $.each(albumData, function(key, value) {
    //   console.log(key, value);
    // })
    // for (var i = 0; i < albumData.length; i++) {
    //     liWriter(albumData.id, albumData);
    // }

  })//end 3rd then function

  // Promise.all(results).then(function F1(users) {
  //   //arr of user objects
  //   console.log(users);
  //   return users;
  //   });


}//end displayAlbumsAndTracks function

/* YOU MAY WANT TO CREATE HELPER FUNCTIONS OF YOUR OWN */
/* THEN CALL THEM OR REFERENCE THEM FROM displayAlbumsAndTracks */
/* THATS PERFECTLY FINE, CREATE AS MANY AS YOU'D LIKE */
