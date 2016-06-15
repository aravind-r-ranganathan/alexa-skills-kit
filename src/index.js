/**
 * App ID for the skill
 */
var APP_ID = 'amzn1.echo-sdk-ams.app.2be9da98-88ef-4f20-9699-1ab43665e5be';


var http = require('http'),
    alexaDateUtil = require('./alexaDateUtil');
var depositUtil = require('./depositUtil');
var accountSummaryUtil = require('./accountSummaryUtil');


/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

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
        handleDebitCardPurchaseIntent(intent, session, response);
    },

    "TransactionsIntent": function (intent, session, response) {
    },

    "DepositsIntent": function (intent, session, response) {
        depositUtil.handleDepositsIntent(intent, session, response);
    },

    "OrderCheckbookIntent": function (intent, session, response) {
    },

    "BankATMLocationsIntent": function (intent, session, response) {
    },

    "ReferralStatusIntent": function (intent, session, response) {
    },

    "TextAccountSummaryIntent": function (intent, session, response) {
        handleTextAccountSummaryIntent(intent, session, response);
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
            speech: "<speak>Welcome to Capital One. Your voice enabled banking assistance is ready."
            + "</speak>",
            type: AlexaSkill.speechOutputType.SSML
        },
        repromptOutput = {
            //TODO add welcome reprompt
            speech: "I can give you information about your debit card purchases" +
            " or summary of your bank accounts,"
            + "list down your various transactions - withdrawals, deposits etc., "
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
 * This handles the one-shot interaction, where the user utters a phrase like:
 * 'Alexa, open Capital One and ask the trend of my account'.
 * If there is an error in a slot, this will guide the user to the dialog approach.
 */
function handleDebitCardPurchaseIntent(intent, session, response) {
    var speechOutput = "You spent a total of $473.45 this month, highest on " +
        "dining where you spent $131.67. Last month you spent $125.21 on dining.";
    response.tell(speechOutput);


}


/**
 * This handles the SMS account summary interaction, where the user utters a phrase like:
 * 'Alexa, ask Capital One to send my checking account summary'.
 * If there is an error in a slot, this will guide the user to the dialog approach.
 */
function handleTextAccountSummaryIntent(intent, session, response) {

    var AWS = require('aws-sdk');
    // configure AWS
    AWS.config.update({
        'region': 'us-east-1'
    });

    var eventText = "Hello world eight";
    console.log("Received event:", eventText);
    var sns = new AWS.SNS();
    var currentDate = new Date();

    var params = {
        Message:"Alexa",
        Subject: "Capital One Checking Account - 36000136597. Available balance is " +
        "$3557.6 as of " + currentDate.getMonth()+1+"/"+currentDate.getDate()+
        "/"+currentDate.getFullYear(),
        TopicArn: "arn:aws:sns:us-east-1:673760866951:AlexaTopic"
    };
    sns.publish(params, function (err, data) {
        if (err) {
            console.log('error publishing to SNS');
            console.log(err);
        } else {
            console.log('message published to SNS');
            response.tell("SMS has been sent.")
        }
        console.log(data);
    });
}


// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {

    var trendReporter = new TrendReporter();
    trendReporter.execute(event, context);

};

