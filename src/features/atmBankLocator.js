exports.handleBankATMLocationsIntent = function(intent, session, response){
    handleBankATMLocationsIntent(intent, response);
};
var apiUtil = require('./../util/apiUtil.js');


var locationsApiEndpoint = "https://ofo7sj25ll.execute-api.us-east-1.amazonaws.com/beta/locations";

//Handles the DepositsIntent
function handleBankATMLocationsIntent(intent, response) {
    var location;
    var locationType = intent.slots.Location;
    console.log(locationType.value);
    if (!locationType || !locationType.value) {
        response.ask("Could you get the location type. You could ask for nearest " +
            "ATM, bank or branch.")
    }else {
        location = locationType.value;
    }
    getBankATMLocations(response, location);
}

//Gets the summary of all deposit transactions.
function getBankATMLocations(response, locationType) {
    var speechOutput;
    console.log("Calling api");
    apiUtil.invokeApi(locationsApiEndpoint, function callback(apiResponse){
        var locationStatus = false;
        var locationsResponse = apiResponse;
        var locations = locationsResponse.entries;
        for(var i in locations) {
            var location = locations[i];
            console.log(location.locationType.toLowerCase());
            if(location.locationType.toLowerCase() == locationType.toLowerCase()) {
                speechOutput = "The nearest Capital One "+location.locationType+" is " +
                    location.distance+" miles from your place. The address is, " +
                    location.address.addressLine1+" , "+ location.address.city+ " , "+
                    location.address.stateCode+" .";
                locationStatus = true;
            }
        }
        if(!locationStatus) {
            speechOutput = "Sorry no results found."
        }
        response.tell(speechOutput);
    });

}
