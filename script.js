const KEY = "AIzaSyDDDElzfQpUogHXhouEu1NWH4CPRPeOPTg";

let generateEmailHtml=emails=>{
  var emailsHtml = "";
  if(emails){
    emails.forEach(email=>{
      emailsHtml += `<p><a href="mailto: ${email}">${email}</a></p>`
    });
  }
  return emailsHtml.toLowerCase();
}

let generatePhoneNumHtml=phones=>{
  var phonesHtml = "<p>";
  phones.forEach(phone=>{
    phonesHtml += phone + "<br>";
  });
  return phonesHtml.slice(0, phonesHtml.length-4)+"</p>";
}

let generateAddressHtml=address=>{
  return `
    <p>${address.line1}<br>
      ${address.line2 ? address.line2+"<br>" : ""}
      ${address.line3 ? address.line3+"<br>" : ""}
      ${address.city}, ${address.state} ${address.zip}
    </p>`;
}

let generateResultHtml=result=>{
  var address = generateAddressHtml(result.address[0]);
  var phoneNumbers = generatePhoneNumHtml(result.phones);
  var emails = generateEmailHtml(result.emails);
  return `
      <section>
        <h1 class="official-name">${result.name} (${result.party})</h1>
        ${address}
        ${phoneNumbers}
        ${emails}
      </section>
    `;
}

let formatOfficialTitles=offices=>{
  var indexedOffices = [];
  offices.forEach(function(office){
    office.officialIndices.forEach(i=>{
      indexedOffices[i] = office.name;
    });
  });
 return indexedOffices;
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getYouTubeVideos(query, maxResults=3) {
  const searchURL = 'https://www.googleapis.com/youtube/v3/search';

  const params = {
    key: KEY,
    q: query,
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

function addVideoClips(){
  $('section').slice(0, 8).append(`
    <h3>Video clips of this official <span class="caret">▼</span></h3>
    <ul></ul>
  `);
  $('section').append('<hr>');
}

let displayCivicInfoResults=results=>{
  results.officials.forEach(result=>{
    var html = generateResultHtml(result);
    $('#results').append(html);
  });

  var titles = formatOfficialTitles(results.offices);
  $('section').each(function(i, section){
      $(this).find('h1').after(`<p class="official-title">${titles[i]}</p>`);    
  });
  addVideoClips();
  watchCaret();
}

let getCivicInfoData=url=>{
  fetch(url)
    .then(res=>{
      if (res.ok) {
        return res.json();
      }
      throw new Error(res.statusText);
    })
    .then(resJson=>displayCivicInfoResults(resJson))
    .catch(err=> {
      alert(`Something went wrong: ${err.message}`);
    });
}

let generateCivicInfoUrl =searchTerm=>{
  var address = searchTerm.split(' ').join('%20');
  return `https://www.googleapis.com/civicinfo/v2/representatives?key=${KEY}&address=${address}`;
}

let watchForm=()=>{
  $('form').submit(e=>{
    e.preventDefault();
    $('#results').empty();

    var searchTerm = $('#address-input').val();
    var url = generateCivicInfoUrl(searchTerm);
    getCivicInfoData(url);
  })
}

$(watchForm);