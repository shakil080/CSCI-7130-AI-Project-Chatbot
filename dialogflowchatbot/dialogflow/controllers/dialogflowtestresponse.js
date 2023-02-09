const apiAiClient = require('apiai')(global.gConfig.API_AI_TOKEN);
const {logger} = require('../../logger/logger');

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

module.exports = async (req, res) => {
    const message = 'How are you';
    
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
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
    } else {
        console.log(`  No intent matched.`);
    }
    res.status(200).send(responses);
};
