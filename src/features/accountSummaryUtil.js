exports.handleAccountSummaryIntent = function(intent, session, response){
    handleAccountSummaryIntent(intent, session, response);
};

exports.textAccountSummary = function(intent, session, response){
    textAccountSummary(intent, response);
};


var apiUtil = require('./../util/apiUtil.js');


var transactionsApiEndpoint = "https://ofo7sj25ll.execute-api.us-east-1.amazonaws.com/beta/accounts";

/**
 * This handles the account summary interaction, where the user utters a phrase like:
 * 'Alexa, ask  Capital One for my checking account summary'.
 * If there is an error in a slot, this will guide the user to the dialog approach.
 */
function handleAccountSummaryIntent(intent, session, response) {
    var speechOutput;
    var accountTypeSlot = intent.slots.Account;
    console.log(accountTypeSlot.value);
    if (!accountTypeSlot || !accountTypeSlot.value) {
        console.log("Inside if");
        accountTypeSlot.value = "checking";
    }
    console.log(accountTypeSlot.value);
    speechOutput = "This is the summary for your "+accountTypeSlot.value
        +" account. ";
    console.log(accountTypeSlot.value);
    getAccountSummary(speechOutput, response, accountTypeSlot.value)
}

//Gets the summary of all deposit transactions.
function getAccountSummary(speechOutput, response, accountType) {
    var account;
    console.log("Calling api");
    apiUtil.invokeApi(transactionsApiEndpoint, function callback(apiResponse){
        account = JSON.stringify(apiResponse.account);
        console.log("Aravind"+JSON.stringify(apiResponse.account.product.productTypeDescription));
        if(JSON.stringify(apiResponse.account.product.productTypeDescription).toLowerCase().includes(
            accountType.toLowerCase())) {
            speechOutput += "Your checking account has an available balance of $" +
                JSON.stringify(apiResponse.account.availableBalance)+
                ", and a current balance of $"+ JSON.stringify(apiResponse.account.currentBalance)+" . "
               // "The interest accrued this month is $"+JSON.stringify(apiResponse.account.interestAccruedAmount) +
                //", and the interest accrued this year till date is $"+
                //JSON.stringify(apiResponse.account.interestEarnedYTD)+
                //" . The interest earned last year " +
                //"was $"+JSON.stringify(apiResponse.account.interestEarnedLastYear)+" .";
        }
        response.tell(speechOutput);
    });

}

//Gets the summary of all deposit transactions.
function textAccountSummary(intent, response) {
    var accountTypeSlot = intent.slots.Account;
    console.log(accountTypeSlot.value);
    if (!accountTypeSlot || !accountTypeSlot.value) {
        console.log("Inside if");
        accountTypeSlot.value = "checking";
    }
    var account;
    console.log("Calling api");
    apiUtil.invokeApi(transactionsApiEndpoint, function callback(apiResponse){
        var textOutput="";
        account = JSON.stringify(apiResponse.account);
        console.log("Aravind"+JSON.stringify(apiResponse.account.product.productTypeDescription));
        if(JSON.stringify(apiResponse.account.product.productTypeDescription).toLowerCase().includes(
                accountTypeSlot.value.toLowerCase())) {
            textOutput = "Capital One "+accountTypeSlot.value+" account: Available balance:$" +
                JSON.stringify(apiResponse.account.availableBalance)+
                ". Current balance:$"+ JSON.stringify(apiResponse.account.currentBalance)+".";

            //Send SNS notification.
            var AWS = require('aws-sdk');
            // configure AWS
            AWS.config.update({
                'region': 'us-east-1'
            });

            var sns = new AWS.SNS();
            var currentDate = new Date();

            var params = {
                Message:"Alexa",
                Subject: textOutput,
                TopicArn: "arn:aws:sns:us-east-1:673760866951:AlexaTopic"
            };
            sns.publish(params, function (err, data) {
                if (err) {
                    console.log('error publishing to SNS');
                    console.log(err);
                } else {
                    console.log('message published to SNS');
                    response.tell("The text message has been sent.")
                }
                console.log(data);
            });
        }
    });



}