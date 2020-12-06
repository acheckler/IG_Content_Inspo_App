'use strict'

const unsplashID = "RB0c5XN-C4SiX0b5hQwEgq_-FSZ1zi00xCtLXON7UY0"
const unsplashURL = "https://api.unsplash.com/search/photos"
const qgURL = "https://quote-garden.herokuapp.com/api/v2/"


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
    per_page: 3,
    color: picColor
  }
  const queryString = formatQueryParams(params);
  const url = unsplashURL + '?' + queryString;

  
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
  console.log(responseJson);
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
  for(let i = 0; i < responseJson.results.length; i++) {
    $('.photos').append(
      `<li> <img src ='${responseJson.results[i].urls.regular}'>
      <p>${responseJson.results[i].description}</p>
      </li>
      `
    )
  }
}


function render() {
  $(watchForm);
}

$(render);