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
        <h3>Video clips of this official:</h3>
        <ul><li>Clip</li><li>Clip</li><li>Clip</li></ul>
        <hr>
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

let displayResults=results=>{
  results.officials.forEach(result=>{
    var html = generateResultHtml(result);
    $('#results').append(html);
  });

  var titles = formatOfficialTitles(results.offices);
  $('section').each(function(i, section){
      $(this).find('h1').after(`<p class="official-title">${titles[i]}</p>`);    
  });
}

let getData=url=>{
  fetch(url)
    .then(res=>{
      if (res.ok) {
        return res.json();
      }
      throw new Error(res.statusText);
    })
    .then(resJson=>displayResults(resJson))
    .catch(err=> {
      alert(`Something went wrong: ${err.message}`);
    });
}

let generateUrl = searchTerm=>{
  var address = searchTerm.split(' ').join('%20');
  return `https://www.googleapis.com/civicinfo/v2/representatives?key=${KEY}&address=${address}`;
}

let watchForm=()=>{
  $('form').submit(e=>{
    e.preventDefault();
    $('#results').empty();

    var searchTerm = $('#address-input').val();
    var url = generateUrl(searchTerm);
    getData(url);
  })
}

$(watchForm);