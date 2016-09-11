
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

    //######## Step 1 = Google API ###########
    // Send request to google API

    var streetViewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';

    // add requested picture to body

    $body.append('<img class="bgimg" src="' + streetViewUrl + '">');


    var nytUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + cityStr + 
                 "&sort=newest&api-key=3ff2a708afd14709b8c4d4e6b817ac06"

    $.getJSON( nytUrl, function( data ) {

        $nytHeaderElem.text("New York Times Articles about " + cityStr);

        articles = data.response.docs;

        for(var i=0;articles.length;i++){
            var article = articles[i];
            $nytElem.append( '<li class="article">' + 
                            '<a href="' + article.web_url +'" target="_blank" >' + 
                             article.headline.main + ' - '+article.pub_date + '</a>' +
                            '<p>' + article.snippet+ '</p>' + '</li>')
        };

    }).error(function(e){
        $nytHeaderElem.text("New York Times Articles could not be loaded ");
    });

    
    return false;
};

$('#form-container').submit(loadData);
