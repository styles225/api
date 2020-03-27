// // var xhr = (function() {
// //   // 

// // })();
// // // UI
// // var ui = (function() {
// //   // 
// // })();
// // // controller
// // var ctrl = (function(v,x) {
// //   // 

// // })(ui,x);

// var article, description, keywords, y;
// y = [];

// var getNews = new XMLHttpRequest();
// // getNews.open('GET','https://newsapi.org/v2/top-headlines?country=us&apiKey=05e05ba64a204a7987de44da87b49ac9');
// getNews.open('GET','https://newsapi.org/v2/top-headlines?country=us');
// // getNews.setRequestHeader('X-Api-Key', '05e05ba64a204a7987de44da87b49ac9');
// getNews.setRequestHeader('X-Api-Key', '05e05ba64a204a7987de44da87b49ac9');

// getNews.onload = () => {
//   var rawNews = JSON.parse(getNews.responseText);
//   article = rawNews.articles;

//   console.log(article);


//   // Grab the template script
//   var newsTemplate = document.querySelector('#news-card-template').innerHTML;

//   // Compile the template
//   var compileNewsTemplate = Handlebars.compile(newsTemplate);

//   // str.replace(/<\/?[^>]+>/gi, '')

//   for (var i = 0; i < 40; i++) {

//     if ((article[i].description !== null) && (article[i].description !== '')) {
//       desc = article[i].description.replace(/<\/?[^>]+>/gi, '');
//     } else {
//       desc = 'Visit this site to read more.';
//     }

//     // Define our data object
//     var context = {
//       // 'newsImg': article[i].urlToImage,
//       'altDesc': article[i].title.replace(/<\/?[^>]+>/gi, ''),
//       'title': article[i].title.replace(/<\/?[^>]+>/gi, ''),
//       'description': desc,
//       'articleURL': article[i].url,
//       'i': i
//     };


//     // Pass our data to the template
//     var compiledNews = compileNewsTemplate(context);

//     // Add the compiled html to the page
//     document.querySelector('#main').innerHTML += compiledNews;

//     document.querySelector(`.bgimg-${i}`).style.backgroundImage = `url('${article[i].urlToImage}')`;






//   }
// }
// getNews.send();



// // $(function () {
// //   // Grab the template script
// //   var newsTemplate = $("#news-card-template").html();

// //   // Compile the template
// //   var compileNewsTemplate = Handlebars.compile(newsTemplate);

// //   // Define our data object
// //   var context = {
// //     "newsImg": "London",
// //   };



// //     <img src="{{newsImg}}" alt="{{altDesc}}">
// //       <h4><b>{{author}}</b></h4>
// //       <p>{{description}}</p>

// //   // Pass our data to the template
// //   var compiledNews = compileNewsTemplate(context);

// //   // Add the compiled html to the page
// //   $('.content-placeholder').html(compiledNews);
// // });

// // HttpClient httpclient = new DefaultHttpClient();
// // HttpGet request = new HttpGet(theUrl);
// // request.addHeader("x-api-key", apiKey);
// // HttpResponse response = httpclient.execute(request);


function getKeywords(articles) {
  let x, y;
  x = '';
  for (i = 0; i < articles.length; i++) {
    x +=  articles[i].title.split('-')[0];
  }
  y = x.split(' ');
  return y;
}


function without(array, what) {
  return array.filter(function(element){ 
      return element !== what;
  });
}

function updateDOM(newsResponse) {

  let rawNews, article, newsTemplate, compileNewsTemplate, i, context, compiledNews;

  rawNews = JSON.parse(newsResponse.responseText);
  article = rawNews.articles;

  // console.log(article);

  // Grab the template script
  newsTemplate = document.querySelector('#news-card-template').innerHTML;

  // Compile the template
  compileNewsTemplate = Handlebars.compile(newsTemplate);

  // str.replace(/<\/?[^>]+>/gi, '')

  for (i = 0; i < article.length; i++) {

    if ((article[i].description !== null) && (article[i].description !== '') && (article[i].description !== undefined)) {
      desc = article[i].description.replace(/<\/?[^>]+>/gi, '');
    } else {
      desc = 'Visit this site to read more.';
    }

    // Define our data object
    context = {
      // 'newsImg': article[i].urlToImage,
      'altDesc': article[i].title.replace(/<\/?[^>]+>/gi, ''),
      'title': article[i].title.replace(/<\/?[^>]+>/gi, ''),
      'description': desc,
      'articleURL': article[i].url,
      'i': i
    };


    // Pass our data to the template
    compiledNews = compileNewsTemplate(context);

    // Add the compiled html to the page
    document.querySelector('#main').innerHTML += compiledNews;

    document.querySelector(`.bgimg-${i}`).style.backgroundImage = `url('${article[i].urlToImage}')`;
  }
  return article
}


function getNews(url, headers = null, method) {

  let request;

  // Create XHR request object
  request = new XMLHttpRequest();

  // Return it as a Promise
  return new Promise(function (resolve, reject) {

    // Setup our listener to process compeleted requests
    request.onreadystatechange = function () {

      // Only run if the request is complete
      if (request.readyState !== 4) return;

      // Process the response
      if (request.status >= 200 && request.status < 400) {
        
        // If successful
        resolve(request);
      } else {

        // If failed
        reject({
          status: request.status,
          statusText: request.statusText,
          response: request.response,
          responseText: request.responseText
        });
      }
    };

    // Setup our HTTP request
    request.open(method || 'GET', url, true);

    // set headers if they exist
    if (headers !== null) {
      for (let i = 0; i < headers.length; i++) {
        request.setRequestHeader(headers[i].key, headers[i].value);
      }
    }

    // Send the request
    request.send();
  });
};

getNews('https://newsapi.org/v2/top-headlines?country=us', [{key: 'X-Api-Key', value: '05e05ba64a204a7987de44da87b49ac9'}])
  // .then( (posts) => console.log( JSON.parse(posts.responseText) ) )
  .then( (posts) => updateDOM(posts) )
  .then( (arts) => getKeywords(arts) )
  .then( (arry) => arry.filter(removeStopWords) )
  .then( (lower) => toLowercase(lower) )
  .then( (jay) => countKeywords(jay) )
  .then( (run) => trendingKeywords(run) )
  .then( (test) => console.log(test) )
  .catch( (error) => {
    console.log('Something went wrong', error);
  })
;

function countKeywords(consolidatedArry) {
  const counts = {};
  consolidatedArry.forEach(function(x) {
    counts[x] = (counts[x] || 0) + 1;
  });
  return counts
}


function toLowercase(unformattedArry) {
  const lowerArry = [];
  unformattedArry.forEach(function(x) {
    lowerArry.push( x.toLowerCase() );
  });
  return lowerArry
}


function removeStopWords(newArry) {
  return newArry !== `a`
      && newArry !== `about`
      && newArry !== `above`
      && newArry !== `after`
      && newArry !== `again`
      && newArry !== `against`
      && newArry !== `all`
      && newArry !== `am`
      && newArry !== `an`
      && newArry !== `and`
      && newArry !== `any`
      && newArry !== `are`
      && newArry !== `aren't`
      && newArry !== `as`
      && newArry !== `at`
      && newArry !== `be`
      && newArry !== `because`
      && newArry !== `been`
      && newArry !== `before`
      && newArry !== `being`
      && newArry !== `below`
      && newArry !== `between`
      && newArry !== `both`
      && newArry !== `but`
      && newArry !== `by`
      && newArry !== `can't`
      && newArry !== `cannot`
      && newArry !== `could`
      && newArry !== `couldn't`
      && newArry !== `did`
      && newArry !== `didn't`
      && newArry !== `do`
      && newArry !== `does`
      && newArry !== `doesn't`
      && newArry !== `doing`
      && newArry !== `don't`
      && newArry !== `down`
      && newArry !== `during`
      && newArry !== `each`
      && newArry !== `few`
      && newArry !== `for`
      && newArry !== `from`
      && newArry !== `further`
      && newArry !== `had`
      && newArry !== `hadn't`
      && newArry !== `has`
      && newArry !== `hasn't`
      && newArry !== `have`
      && newArry !== `haven't`
      && newArry !== `having`
      && newArry !== `he`
      && newArry !== `he'd`
      && newArry !== `he'll`
      && newArry !== `he's`
      && newArry !== `her`
      && newArry !== `here`
      && newArry !== `here's`
      && newArry !== `hers`
      && newArry !== `herself`
      && newArry !== `him`
      && newArry !== `himself`
      && newArry !== `his`
      && newArry !== `how`
      && newArry !== `how's`
      && newArry !== `i`
      && newArry !== `i'd`
      && newArry !== `i'll`
      && newArry !== `i'm`
      && newArry !== `i've`
      && newArry !== `if`
      && newArry !== `in`
      && newArry !== `into`
      && newArry !== `is`
      && newArry !== `isn't`
      && newArry !== `it`
      && newArry !== `it's`
      && newArry !== `its`
      && newArry !== `itself`
      && newArry !== `let's`
      && newArry !== `me`
      && newArry !== `more`
      && newArry !== `most`
      && newArry !== `mustn't`
      && newArry !== `my`
      && newArry !== `myself`
      && newArry !== `no`
      && newArry !== `nor`
      && newArry !== `not`
      && newArry !== `of`
      && newArry !== `off`
      && newArry !== `on`
      && newArry !== `once`
      && newArry !== `only`
      && newArry !== `or`
      && newArry !== `other`
      && newArry !== `ought`
      && newArry !== `our`
      && newArry !== `ours  ourselves`
      && newArry !== `out`
      && newArry !== `over`
      && newArry !== `own`
      && newArry !== `same`
      && newArry !== `shan't`
      && newArry !== `she`
      && newArry !== `she'd`
      && newArry !== `she'll`
      && newArry !== `she's`
      && newArry !== `should`
      && newArry !== `shouldn't`
      && newArry !== `so`
      && newArry !== `some`
      && newArry !== `such`
      && newArry !== `than`
      && newArry !== `that`
      && newArry !== `that's`
      && newArry !== `the`
      && newArry !== `their`
      && newArry !== `theirs`
      && newArry !== `them`
      && newArry !== `themselves`
      && newArry !== `then`
      && newArry !== `there`
      && newArry !== `there's`
      && newArry !== `these`
      && newArry !== `they`
      && newArry !== `they'd`
      && newArry !== `they'll`
      && newArry !== `they're`
      && newArry !== `they've`
      && newArry !== `this`
      && newArry !== `those`
      && newArry !== `through`
      && newArry !== `to`
      && newArry !== `too`
      && newArry !== `under`
      && newArry !== `until`
      && newArry !== `up`
      && newArry !== `very`
      && newArry !== `was`
      && newArry !== `wasn't`
      && newArry !== `we`
      && newArry !== `we'd`
      && newArry !== `we'll`
      && newArry !== `we're`
      && newArry !== `we've`
      && newArry !== `were`
      && newArry !== `weren't`
      && newArry !== `what`
      && newArry !== `what's`
      && newArry !== `when`
      && newArry !== `when's`
      && newArry !== `where`
      && newArry !== `where's`
      && newArry !== `which`
      && newArry !== `while`
      && newArry !== `who`
      && newArry !== `who's`
      && newArry !== `whom`
      && newArry !== `why`
      && newArry !== `why's`
      && newArry !== `with`
      && newArry !== `won't`
      && newArry !== `would`
      && newArry !== `wouldn't`
      && newArry !== `you`
      && newArry !== `you'd`
      && newArry !== `you'll`
      && newArry !== `you're`
      && newArry !== `you've`
      && newArry !== `your`
      && newArry !== `yours`
      && newArry !== `yourself`
      && newArry !== `yourselves`
      && newArry !== `is`
      && newArry !== `some`
      && newArry !== `now`
      && newArry !== `of`
      && newArry !== `or`
    ;
}

// put wordcount of keywords/values in array, find index of highest val
// then return the object key w/ highest value
function trendingKeywords(obj) {
  let arr = Object.values(obj);

  const correctVal = (el) => el === Math.max(...arr);

  let b = arr.findIndex( correctVal );

  let keyArr = Object.keys(obj);

  return keyArr[b]
}
