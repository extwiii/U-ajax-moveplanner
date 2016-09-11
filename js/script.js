
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");


    //Getting value from form

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text(' So, You want to live at ' + address +'?' ); 

    //######## Step 1 = Google API ##################################################################
    // Send request to google API

    var streetViewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';

    // add requested picture to body

    $body.append('<img class="bgimg" src="' + streetViewUrl + '">');

    //######## Step 2 = NYT API ##################################################################

    var nytUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + cityStr + 
                 "&sort=newest&api-key=3ff2a708afd14709b8c4d4e6b817ac06"

    // Send JSON request to NYT API

    $.getJSON( nytUrl, function( data ) {

        $nytHeaderElem.text("New York Times Articles about " + cityStr);

        articles = data.response.docs;

        // Iterate through specifics fields and get info that we need to show clients

        for(var i=0;articles.length;i++){
            var article = articles[i];
            $nytElem.append( '<li class="article">' + 
                            '<a href="' + article.web_url +'" target="_blank" >' + 
                             article.headline.main + ' - '+article.pub_date + '</a>' +
                            '<p>' + article.snippet+ '</p>' + '</li>')
        };

        // Handle errors

    }).error(function(e){
        $nytHeaderElem.text("New York Times Articles could not be loaded ");
    });

    //######## Step 3 = Wikipedia API ##################################################################

    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + 
                  '&format=json&callback=wikiCallback';

    // Send JSONP request to wikipedia API beacuse of CORS

    $.ajax({
        url : wikiUrl,
        dataType : "jsonp",
        // jsonp : "callback",
        success : function(response){
            var articleList = response[1];

            for(var i=0; i< articleList.length;i++){
                var articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '" target="_blank" >' + articleStr + '</a></li>');
            };

            clearTimeout(wikiTimeout);
        }

    });

    // Handle errors

    var wikiTimeout = setTimeout(function(){
        $wikiElem.text('Failed to get wikipedia resources');
    }, 8000);
    

    
    return false;
};

$('#form-container').submit(loadData);
