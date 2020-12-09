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
    $('.photos').empty();
    $('.quotes').empty();
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
    per_page: 50,
    color: picColor
  }
  const queryString = formatQueryParams(params);
  const url = unsplashURL + '?' + queryString;
const getRandom = max => {
  return Math.ceil(Math.random() * max)
}
  fetch(url)
  .then(response => {
    if (response.ok) {
     return response.json();
    }
     throw new Error(response.statusText);
    })
    .then(responseJson => {
      let total = responseJson.results.length
      let random = getRandom(total)
      // console.log(responseJson, 'blehhh')
      //console.log(total, 'total')
      displayPictures(responseJson.results[random]);
    })
    .catch(err => {
        $('#error-message').text(`Could not find a photo with given keyword(s). Please try using another search term.`);
    });  
}
function getQuotes(quoteSearchTerm, quoteSearchType) {
  const params = {
    page: 1,
    limit: 3
  }
    const queryString = formatQueryParams(params);
  const url = qgURL + quoteSearchType + '/' + quoteSearchTerm + '?' + queryString;
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
        $('#error-message').text(`Could not find a quote with given keyword(s). Please try using another search term.`);    
});
}
function displayQuotes(responseJson) {
  console.log(responseJson, 'hello')
  for(let i = 0; i < responseJson.quotes.length; i++){
    $('.quotes').append(
      `<li> <p> '${responseJson.quotes[i].quoteText}' </p>
      <p> '${responseJson.quotes[i].quoteAuthor}' </p>
      </li>
      `
    )
  }
}
function displayPictures(responseJson) {
  console.log(responseJson, 'hiii')
    $('.photos').append(
      `<li> <img src ='${responseJson.urls.regular}'>
      <a href = ${responseJson.urls.regular}> Unsplash Link </a>
      </li>
      `
    )
}
function render() {
  $(watchForm);
}
$(render);