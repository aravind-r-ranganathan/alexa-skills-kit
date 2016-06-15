//var request = require('request');
var https = require('https');

exports.invokeApi = function(endpoint, callback) {
    invokeApi(endpoint, callback);
}

function invokeApi(endpoint, callback) {
    var options = {
        url: endpoint,
        headers: {
            'User-Agent': 'request'
        }
    };
    //request(options, callback);
    console.log("API Util called"+endpoint);
    var apiResponse;
    https.get(endpoint, function (res) {
        console.log("Inside get"+endpoint);
        var noaaResponseString = '';
        // console.log('Status Code: ' + res.statusCode);

        // if (res.statusCode != 200) {
        //     tideResponseCallback(new Error("Non 200 Response"));
        // }

        res.on('data', function (data) {
            noaaResponseString += data;
        });

        res.on('end', function () {
            //console.log(noaaResponseString);
            var noaaResponseObject = JSON.parse(noaaResponseString);
            callback(noaaResponseObject);
            //console.log(noaaResponseObject);
        });
    }).on('error', function (e) {
        console.log("Communications error: " + e.message);
    });
    return apiResponse;
}
