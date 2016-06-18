exports.handleReferralStatusIntent = function(intent, session, response){
    handleReferralStatusIntent(response);
};
var apiUtil = require('./../util/apiUtil.js');


var referralsApiEndpoint = "https://ofo7sj25ll.execute-api.us-east-1.amazonaws.com/beta/referrals";

//Handles the DepositsIntent
function handleReferralStatusIntent(response) {
    getReferralStatus(response);
}

//Gets the summary of all deposit transactions.
function getReferralStatus(response) {
    var speechOutput;
    console.log("Calling api");
    apiUtil.invokeApi(referralsApiEndpoint, function callback(apiResponse){
        var referralStatus = false;
        var referralsResponse = apiResponse;
        var referrals = referralsResponse.entries;
        for(var i in referrals) {
            var referral = referrals[i];
            if(referral.referralStatus == 'PENDING') {
                    speechOutput = "Your "+referral.referralChannel+" referral is pending.";
                referralStatus = true;
                }
                else if(referral.referralStatus == 'COMPLETED') {
                speechOutput = "Your "+referral.referralChannel+" referral to "+referral.firstName+
                    " , "+referral.lastName+" has been completed on "+referral.accountCreationDate+" .";
                referralStatus = true;
                }
            }
        if(!referralStatus) {
            speechOutput = "You don't have any pending or completed referrals. " +
                "You can earn easily refer your friends and family to capital one and earn" +
                "$20 for each completed application."
        }
        response.tell(speechOutput);
    });

}
