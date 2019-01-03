function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getYouTubeVideos(query, maxResults=3) {
  const searchURL = 'https://www.googleapis.com/youtube/v3/search';

  const params = {
    key: KEY,
    q: query+" news",
    part: 'snippet',
    maxResults,
    type: 'video',
    order: 'date'
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayYouTubeResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayYouTubeResults(responseJson) {
  if(responseJson.items.length==0){
    $('.selected').append(`
      <p class="no-videos-found"><em>Sorry, no news videos found for this elected official.</em></p>
    `);
  }
  responseJson.items.forEach(function(item){
    $('.selected').append(
      `<li><a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank">${item.snippet.title}</a></li>`
    );
  });
};

function watchCaret(){
  $('.caret').unbind().click(function(e){
    
    $('ul').removeClass('selected');
    $(this).parent('h3').next().show().addClass('selected');

    var official = $(this).parent('h3').parent().find('h1').text();
    official = official.slice(0, official.length-10);
    getYouTubeVideos(official);
    $(this).remove();
  });
}