exports.handleDepositsIntent = function(intent, session, response){
    handleDepositsIntent(intent, session, response);
};
var apiUtil = require('./apiUtil.js');


var transactionsApiEndpoint = "https://ofo7sj25ll.execute-api.us-east-1.amazonaws.com/beta/transactions";

//Handles the DepositsIntent
function handleDepositsIntent(intent, session, response) {
    var speechOutput = "";
    var accountTypeSlot = intent.slots.Account;
    if (!accountTypeSlot || !accountTypeSlot.value) {
        accountTypeSlot.value = "checking";
    }
    speechOutput = "This is the status of the deposits for your "+accountTypeSlot.value
        +" account. "
    getDepositSummary(speechOutput, response)
}

//Gets the summary of all deposit transactions.
function getDepositSummary(speechOutput, response) {
    var txnResponse;
    console.log("Calling api");
    apiUtil.invokeApi(transactionsApiEndpoint, function callback(apiResponse){
        console.log(apiResponse);
        txnResponse = apiResponse;
        var counter = 0;
        var isPendingAvailable = false;
        var postedDate;
        var transactions = txnResponse.entries;
        for(var i in transactions) {
            var transaction = transactions[i];
            if(transaction.transactionParentCategory == 'Deposit') {
                if(transaction.transactionStatus == 'posted') {
                    var date = new Date(transaction.depositDate);
                    postedDate = date.getMonth()+1+"/"+date.getDate()+"/"+date.getFullYear();
                    if (transaction.transactionType == "Deposit on hold") {
                        speechOutput += "Your deposit for $" + transaction.depositAmount + " has been posted on "
                            +postedDate+" .";
                    } else {
                        speechOutput += "Your "+transaction.transactionType+
                            " for $" + transaction.depositAmount + " has been posted on "
                            +postedDate+" .";
                    }

                }
                else if(transaction.transactionStatus == 'pending') {
                    isPendingAvailable = true;
                    speechOutput += "Your deposit "+transaction.statementDescription+" is pending. ";
                }
                if(counter++ >= 9)
                    break;
            }
        }
        if(!isPendingAvailable)
            speechOutput += " You don't have any pending deposits.";
        response.tell(speechOutput);
    });

}
