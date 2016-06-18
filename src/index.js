/**
 * App ID for the skill
 */
var APP_ID = 'amzn1.echo-sdk-ams.app.2be9da98-88ef-4f20-9699-1ab43665e5be';


var http = require('http');
var depositUtil = require('./features/depositUtil');
var accountSummaryUtil = require('./features/accountSummaryUtil');
var debitCardPurchaseUtil = require('./features/debitCardPurchaseUtil');
var orderCheckbookUtil = require('./features/orderCheckbookUtil');
var referralStatusUtil = require('./features/referralStatusUtil');
var atmBankLocator = require('./features/atmBankLocator');


/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./lib/AlexaSkill');

/**
 * TrendReporter is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var TrendReporter = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
TrendReporter.prototype = Object.create(AlexaSkill.prototype);
TrendReporter.prototype.constructor = TrendReporter;

// ----------------------- Override AlexaSkill request and intent handlers -----------------------

TrendReporter.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

TrendReporter.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleWelcomeRequest(response);
};

TrendReporter.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

/**
 * override intentHandlers to map intent handling functions.
 */
TrendReporter.prototype.intentHandlers = {
    "DebitCardPurchaseIntent": function (intent, session, response) {
        debitCardPurchaseUtil.handleDebitCardPurchaseIntent(intent, session, response);
    },

    "TransactionsIntent": function (intent, session, response) {
    },

    "DepositsIntent": function (intent, session, response) {
        depositUtil.handleDepositsIntent(intent, session, response);
    },

    "OrderCheckbookIntent": function (intent, session, response) {
        orderCheckbookUtil.handleOrderCheckbookIntent(intent, session, response);
    },

    "BankATMLocationsIntent": function (intent, session, response) {
        console.log("method called");
        atmBankLocator.handleBankATMLocationsIntent(intent, session, response);
    },

    "ReferralStatusIntent": function (intent, session, response) {
        referralStatusUtil.handleReferralStatusIntent(intent, session, response);
    },

    "TextAccountSummaryIntent": function (intent, session, response) {
        accountSummaryUtil.textAccountSummary(intent, session, response);
    },

    "TellAccountSummaryIntent": function (intent, session, response) {
        accountSummaryUtil.handleAccountSummaryIntent(intent, session, response);
    },

    "SupportedFunctionsIntent": function (intent, session, response) {
    },


    "AMAZON.HelpIntent": function (intent, session, response) {
        handleHelpRequest(response);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};


function handleWelcomeRequest(response) {
    //TODO add welcome prompt
    var welcomePrompt = "How can I help you with your bank account?",
        speechOutput = {
            speech: "<speak>Heeeeeeyyyyyyyy look who it is....Welcome back to Capital One"
            + "</speak>",
            type: AlexaSkill.speechOutputType.SSML
        },
        repromptOutput = {
            //TODO add welcome reprompt
            speech: "I can give you information about your debit card purchases" +
            " or summary of your bank accounts,"
            + "or you can simply open Capital One and ask a question like, "
            + "what is the status of my deposits. "
            + "For a list of supported functions, ask what functions are supported. "
            + welcomePrompt,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };

    response.ask(speechOutput, repromptOutput);
}

function handleHelpRequest(response) {
    var repromptText = "How can I help you with your bank account?";
    var speechOutput = "I can give you information about your debit card purchases" +
        " or summary of your bank accounts,"
        + "list down your various transactions - withdrawals, deposits etc., "
        + "or you can simply open Capital One and ask a question like, "
        + "what is the status of my deposits. "
        + "For a list of supported functions, ask what functions are supported. "
        + "Or you can say exit. "
        + repromptText;

    response.ask(speechOutput, repromptText);
}

/**
 * This handles the SMS account summary interaction, where the user utters a phrase like:
 * 'Alexa, ask Capital One to send my checking account summary'.
 * If there is an error in a slot, this will guide the user to the dialog approach.
 */
function handleTextAccountSummaryIntent(intent, session, response) {

    
}


// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {

    var trendReporter = new TrendReporter();
    trendReporter.execute(event, context);

};

