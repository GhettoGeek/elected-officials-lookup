function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

let generateYoutubeSearchUrl=(query, maxResults=3)=>{
  const params = {
    key: KEY,
    q: query+" news",
    part: 'snippet',
    maxResults,
    type: 'video',
    order: 'viewCount'
  };
  const queryString = formatQueryParams(params)

  return 'https://www.googleapis.com/youtube/v3/search?'+queryString;
}

let displayYouTubeResults=responseJson=>{
  if(responseJson.items.length==0){
    $('.selected').append(`
      <p class="no-videos-found"><em>Sorry, no news videos found for this elected official.</em></p>
    `);
  }
  responseJson.items.forEach(item=>{
    $('.selected').append(
      `<li><a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank">${item.snippet.title}</a></li>`
    );
  });
};

let getYoutubeVideos=url=>{
  fetch(url)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(res.statusText);
    })
    .then(resJson => displayYouTubeResults(resJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

let watchVideoClipsLink=()=>{
  $('.caret').unbind().click(function(e){
    
    $('ul').removeClass('selected');
    $(this).parent('h3').next().show().addClass('selected');

    var official = $(this).parent('h3').parent().find('h1').text();
    // remove political party to get name of the elected official.
    official = official.slice(0, official.length-10);
    var url = generateYoutubeSearchUrl(official);
    getYoutubeVideos(url);
    // remove caret/link to limit number of requests for youtube links.
    $(this).remove();
  });
}