/**
 * Created by jjt129 on 6/14/2016.
 */
exports.getDepositSummary = function(transactions){
    getDepositSummary(transactions);
};

function getDepositSummary(transactions) {
    var counter = 0;
    var isPendingAvailable = false;
    for(var i in transactions) {
        var transaction = transactions[i];
        if(transaction.transactionParentCategory == 'Deposit') {
            if(transaction.transactionStatus == 'posted') {
                console.log("Your deposit for $" + transaction.depositAmount + " has been posted.");
            }
            else if(transaction.transactionStatus == 'pending') {
                //isPendingAvailable = true;
                //console.log("Your deposit "+transaction.statementDescription+" is pending.");
            }
            if(counter++ >= 9)
                break;
        }
    }
    if(!isPendingAvailable)
        console.log("You don't have any pending deposits.");
}
