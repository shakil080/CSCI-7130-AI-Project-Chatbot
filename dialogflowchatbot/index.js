const _ = require('lodash');

const fs = require('fs')
var configPath = "./config.json";

// module variables
const config = require(configPath);
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);

global.gConfig = finalConfig;

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.listen(4989, () => logger.info('DialogflowBot listening on port 4989!'));
app.get('/check_dialogflow_nlp_adapter_service', (req, res) => res.send('Hello World from DialogflowBot.'));

//For testing using the querystring
// const dialogflowTestResponseController = require('./dialogflow/controllers/dialogflowtestresponse');
// app.get('/check_dialogflow', dialogflowTestResponseController);

const apiAiClient = require('apiai')(global.gConfig.API_AI_TOKEN);

const dialogflow = require('@google-cloud/dialogflow');

const PROJECT_ID = global.gConfig.DIALOGFLOW_PROJECT_ID;
const CLIENT_EMAIL = global.gConfig.DIALOGFLOW_CLIENT_EMAIL;
const PRIVATE_KEY = global.gConfig.DIALOGFLOW_PRIVATE_KEY;

const sessionClient = new dialogflow.SessionsClient({
    credentials: {
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
    }
});
const sessionPath = sessionClient.projectAgentSessionPath(PROJECT_ID, 'test_session');

var rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

async function waitForUserInput() {
    rl.question("You: ", async function(answer) {
    if (answer == "exit"){
        rl.close();
    } else {
        await getResponseFromDialogflow(answer);
        waitForUserInput();
    }
    });
}

waitForUserInput()

//getResponseFromDialogflow();

async function getResponseFromDialogflow(message){

    //const message = 'How are you';//req.query.message;//'Hello';//event.message.text;
    
    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: message,
                // The language used by the client (en-US)
                languageCode: 'en-US',
            },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    //console.log('Detected intent');
    const result = responses[0].queryResult;
    //console.log(`  Query: ${result.queryText}`);
    console.log(`Dialogflow Response: ${result.fulfillmentText}`);
    if (result.intent) {
        console.log(`Detected Intent: ${result.intent.displayName}`);
    } else {
        console.log(`No intent matched.`);
    }
    console.log();
}

