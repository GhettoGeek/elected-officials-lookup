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
  // remove <br> from last phone# and close <p>.
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

let official=result=>{
  const heading = `<h1 class="official-name" >${result.name} (${result.party})</h1>`;
  
   result.officials.forEach((official, i)=>{        
    result.offices.forEach(office=>{
      if(office.officialIndices.includes(i)){
        heading += `<p class="official-title">${office.name}</p>`;
      }
    });
  }); 
  
  return heading;
}

let generateResultHtml=result=>{
  var official = official(result);
  var address = generateAddressHtml(result.address[0]);
  var phoneNumbers = generatePhoneNumHtml(result.phones);
  var emails = generateEmailHtml(result.emails);
  return `
      <section role="region" tabindex="0">
        ${official}
        ${address}
        ${phoneNumbers}
        ${emails}
      </section>
    `;
}

let addVideoClipsUl=()=>{
  $('section').append(`
    <h3>Video clips of this official 
      <span class="caret" role="link">▼</span>
    </h3>
    <ul aria-live="assertive"></ul>
  `);
}

let displayCivicInfoResults=results=>{
  results.officials.forEach(result=>{
    var html = generateResultHtml(result);
    $('#results').append(html);
  });
  addVideoClipsUl();
  watchVideoClipsLink();
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
