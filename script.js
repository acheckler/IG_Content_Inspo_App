'use strict'

const unsplashID = "RB0c5XN-C4SiX0b5hQwEgq_-FSZ1zi00xCtLXON7UY0"
const unsplashURL = "https://api.unsplash.com/photos/random"
const qgURL = "https://quote-garden.herokuapp.com/api/v2/"

function generateWelcomePage() {

  return `
    <div class = "welcome-page">
      <h2> Hello! <h2>
        <p> This app is for those whom have an idea, or topic, they'd like to post about, but they need the content for it! <p>
        <p> Simply fill out the search form using your topic as a keyword (e.g. reading, yoga, coffee, etc) and you'll recieve pictures and quotes related to your topic! <p>
        <p> Take the content from this app, edit it to your asthetic desires, and now you've got an Instagram post or story! <p>
        <button type = "button" id = "start"> Let's go! </button>
    </div>
  `
}

function watchStartButton() {
  $('.welcome-page').on('click', '#start', function(event) {
    event.preventDefault();
    render();
  });
}
function watchForm() {
  
  $('#js-form').submit(event => {
    event.preventDefault();
    var picSearchTerm = $('#photo-search-term').val();
    var quoteSearchType = $('#quote-search-type').val();
    var quoteSearchTerm = $('#quote-search-term').val();
    var picColor = $('#photo-seach-color').val();
    console.log(quoteSearchType);
    getPictures(picSearchTerm, picColor);
    getQuotes(quoteSearchTerm, quoteSearchType);
  });
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            return queryItems.join('&');
}

function getPictures(picSearchTerm, picColor) {
  const params = {
    client_id: unsplashID,
    query: picSearchTerm,
    count: 3,
  }
  if (picColor != "none") {
    params.color = picColor
  }
  const queryString = formatQueryParams(params);
  const url = unsplashURL + '?' + queryString;
  console.log(url);

  
  fetch(url)
  .then(response => {
    if (response.ok) {
     return response.json();
    }
     throw new Error(response.statusText);
    })
    .then(responseJson => {
      displayPictures(responseJson);
    })
    .catch(err => {
        $('#error-message').text(`Could not find city/location. Please enter a different city/location.`);
    });  
}

function getQuotes(quoteSearchTerm, quoteSearchType) {
  const params = {
    page: 1,
    limit: 3
  }
    const queryString = formatQueryParams(params);
  const url = qgURL + quoteSearchType + '/' + quoteSearchTerm + '?' + queryString;
  console.log(url);

fetch(url)
  .then(response => {
    if (response.ok) {
     return response.json();
    }
     throw new Error(response.statusText);
    })
    .then(responseJson => {
      displayQuotes(responseJson);
    })
    .catch(err => {
        $('#error-message').text(`Could not find city/location. Please enter a different city/location.`);    
});
}

function displayQuotes(responseJson) {
  $('.quote-list').empty();
  for(let i = 0; i < responseJson.quotes.length; i++){
    $('.quote-list').append(
      `<li> <p> '${responseJson.quotes[i].quoteText}' </p>
      <p> '${responseJson.quotes[i].quoteAuthor}' </p>
      </li>
      `
    )

  }

}

function displayPictures(responseJson) {
  $('.photos').empty();
  for(let i = 0; i < responseJson.length; i++) {
    $('.photos').append(
      `<li> <img src ='${responseJson[i].urls.regular}'>
      <p>${responseJson[i].description}</p>
      </li>
      `
    )
  }
}


function render() {
  $(generateWelcomePage)
  $(watchForm);
}

$(render);