var http = require('http');
var querystring = require('querystring');
var Twit = require('Twit');
var interpolate = require('interpolate');

var options = {
    hostname: 'api.wordnik.com',
    port: 80,
    headers: {
        'Accept': 'application/json'
    }
};

var worknikconfig = require('./worknikconfig.js')
var rwQuery = {
    'hasDictionaryDef': 'true',
    'includePartOfSpeech': 'noun,verb',
    'minCorpusCount': '7500',
    'maxCorpusCount': '-1',
    'minDictionaryCount': '1',
    'maxDictionaryCount': '-1',
    'minLength': '4',
    'maxLength': '-1',
    'api_key': worknikconfig.WORDNIK_APIKEY
};

function getRandomWord(next) {
    options.path = '/v4/words.json/randomWord?' + querystring.stringify(rwQuery);
    return http.get(options, function (res) {
        if (res.statusCode == 200) {
            res.on('data', function (chunk) {
                next(JSON.parse(chunk).word);
            })
        }
    });
}
var output = [];
function logic() {
    getRandomWord(function (result) {
        output.push(result);
        return getRandomWord(function (result) {
            output.push(result);
            return tweet();
        })
    });
}

var T = new Twit(require('./twitconfig.js'));
function tweet() {
    var result = interpolate('{x} in the streets, {y} in the sheets!', {
        x: output.pop(),
        y: output.pop() //boom
    });
    
    console.log(result);
    
    //T.post('statuses/update', { status: result }, function (err, data, response) {
    //    console.log(data)
    //})
}

//setInterval(logic, 60*60*1000);
setInterval(logic, 2000);



