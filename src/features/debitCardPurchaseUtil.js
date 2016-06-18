exports.handleDebitCardPurchaseIntent = function(intent, session, response){
    handleDebitCardPurchaseIntent(intent, session, response);
};
var apiUtil = require('./../util/apiUtil.js');


var transactionsApiEndpoint = "https://ofo7sj25ll.execute-api.us-east-1.amazonaws.com/beta/transactions";

//Handles the DepositsIntent
function handleDebitCardPurchaseIntent(intent, session, response) {
    var vendorTypeSlot = intent.slots.Vendor;
    var startDateSlot = intent.slots.StartDate;
    var endDateSlot = intent.slots.EndDate;
    if (vendorTypeSlot && vendorTypeSlot.value) {
        console.log("Inside vendor");
        buildResponseWithVendor(vendorTypeSlot.value, response);
    }else {
        buildGenericResponse(response);
    }
}

//Gets the summary of all deposit transactions.
function getDebitCardTxns(vendor,response) {
    //response.tell("Hello");
    var speechOutput="";
    var txnResponse;
    console.log("VEndor"+vendor);
    console.log("Calling api");
    apiUtil.invokeApi(transactionsApiEndpoint, function callback(apiResponse){
        console.log("VEndor"+vendor);
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
                if(vendor) {
                    if(transaction.merchant && transaction.merchant.merchantType.toLowerCase() == "dining"){
                        spendingAmount += transaction.transactionAmount;
                    }
                }
                else {
                    spendingAmount += transaction.transactionAmount;
                }
                console.log("Amount"+transaction.transactionDate);

                if(transaction.merchant)
                console.log(transaction.merchant.merchantType);
            }
        }
        if(vendor) {
            speechOutput = "You spent $"+spendingAmount.toFixed(2)+" on "+vendor+" . Eat out much?";
            response.tell(speechOutput);
        }else {
            console.log("spendingAmount" + spendingAmount);
            speechOutput = ("You spent $" + spendingAmount);
            response.tell(speechOutput);
        }
    });


}

function buildResponseWithVendor(vendor, response) {
    console.log("Vendor value"+vendor);
    var txns = getDebitCardTxns(vendor, response);
}

function buildGenericResponse(response) {
    var txns = getDebitCardTxns(null,response);
    console.log("Aravind"+txns);
    for(var i in txns) {
        var transaction = txns[i];
        console.log(transaction.merchantType);
    }
}
