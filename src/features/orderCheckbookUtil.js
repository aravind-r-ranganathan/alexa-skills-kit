exports.handleOrderCheckbookIntent = function(intent, session, response){
    handleOrderCheckbookIntent(intent, session, response);
};
var apiUtil = require('./../util/apiUtil.js');


var transactionsApiEndpoint = "https://ofo7sj25ll.execute-api.us-east-1.amazonaws.com/beta/transactions";

//Handles the DepositsIntent
function handleOrderCheckbookIntent(intent, session, response) {
    var accountTypeSlot = intent.slots.Account;
    console.log(accountTypeSlot.value);
    if (!accountTypeSlot || !accountTypeSlot.value) {
        console.log("Inside if");
        accountTypeSlot.value = "checking";
    }
    
    var startingCheckNumber = intent.slots.StaringCheckNumber;
    if(!startingCheckNumber || !startingCheckNumber.value) {
        response.ask("What is the starting check number");
    } else {
        if(!validateStartingCheckNumber(startingCheckNumber.value)) {
            response.ask("The starting check number should start from 301. " +
                "Your last check book order started with 501. Please try again");
        }
        response.tell("Check order successfully placed with starting check number,"+startingCheckNumber.value);
    }

}

//Gets the summary of all deposit transactions.
function getDebitCardTxns() {
    var txnResponse;
    console.log("Calling api");
    apiUtil.invokeApi(transactionsApiEndpoint, function callback(apiResponse){
        //console.log(apiResponse);
        txnResponse = apiResponse;
        var counter = 0;
        var postedDate;
        var debitCardTxns = [];
        var spendingAmount = 0;
        var transactions = txnResponse.entries;
        for(var i in transactions) {
            var transaction = transactions[i];
            if((transaction.transactionType == 'Debit card purchase') &&
                (transaction.transactionDescriptionDetail.activityDescription == 'Debit Card Purchase')) {
                // if(transaction.transactionStatus == 'posted') {
                //     var date = new Date(transaction.depositDate);
                //     postedDate = date.getMonth()+1+"/"+date.getDate()+"/"+date.getFullYear();
                //     if (transaction.transactionType == "Deposit on hold") {
                //         speechOutput += "Your deposit for $" + transaction.depositAmount + " has been posted on "
                //             +postedDate+" .";
                //     } else {
                //         speechOutput += "Your "+transaction.transactionType+
                //             " for $" + transaction.depositAmount + " has been posted on "
                //             +postedDate+" .";
                //     }
                //
                // }
                // else if(transaction.transactionStatus == 'pending') {
                //     isPendingAvailable = true;
                //     speechOutput += "Your deposit "+transaction.statementDescription+" is pending. ";
                // }
                // else {
                //     speechOutput += "You don't have any recent posted deposit transactions. "
                // }
                debitCardTxns[counter++] = transaction;
                console.log("Amount"+transaction.transactionDate);
                spendingAmount += transaction.transactionAmount;
                if(transaction.merchant)
                    console.log(transaction.merchant.merchantType);
            }
        }
        console.log("spendingAmount"+spendingAmount);
    });

}

function buildResponseWithVendor(response, vendor, startDate, endDate) {
    var txns = getDebitCardTxns();
}

function buildGenericResponse(response) {
    var txns = getDebitCardTxns();
    console.log("Aravind"+txns);
    for(var i in txns) {
        var transaction = txns[i];
        console.log(transaction.merchantType);
    }
}


function validateStartingCheckNumber(startingCheckNumber) {
    if((startingCheckNumber >= 3) &&
        ((startingCheckNumber%100 == 1 || startingCheckNumber%50 == 1))
        && (startingCheckNumber < 9950)) {
        return true;
    }
    return false;
}