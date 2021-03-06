'use strict';

/**
 *  ArnoldAlexa - Lambda Code - Copyright © 2016 Jason Choe
 *
 *  Version 1.0.2 - 11/14/16 Edits made to be published
 * 
 *  Version 1.0.1 - 9/17/16 Initial submission for Alexa published skill
 *  Version 1.0.0 - Initial release
 *  Version 1.0.1 - New quotes added
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License. You may obtain a copy of the License at:
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License
 *  for the specific language governing permissions and limitations under the License.
 *
 */

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `Unofficial Arnold Quotes - ${title}`,
            content: `Unofficial Arnold Quotes - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
            },
        },
        shouldEndSession,
    };
}
function buildSpeechletResponseAudio(title, output, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'SSML',
            ssml: output,
        },
        card: {
            type: 'Simple',
            title: `Unofficial Arnold Quotes - incoming`,
            content: `Unofficial Arnold Quotes - incoming`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
            },
        },
        shouldEndSession,
    };
}
function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'You can say ask arnold fan for a quote';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thank you for trying the Alexa Arnold Skills Kit. Stop whining!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function getArnoldQuote(intent, session, callback) {
    const repromptText = null;
    const sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';
    let temp = '';
    
    // define list of arnold sources
    var audiosrc = [
        "https://www.choad.org/audio/cop-alexa.mp3",
        "https://www.choad.org/audio/deep_trouble-alexa.mp3",
        "https://www.choad.org/audio/fist-alexa.mp3",
        "https://www.choad.org/audio/good_morning-alexa.mp3",
        "https://www.choad.org/audio/hello_cutie-alexa.mp3",
        "https://www.choad.org/audio/how_are_you-alexa.mp3",
        "https://www.choad.org/audio/lack_discipline-alexa.mp3",
        "https://www.choad.org/audio/mother_talk-alexa.mp3",
        "https://www.choad.org/audio/nodeal-alexa.mp3",
        "https://www.choad.org/audio/questions-alexa.mp3",
        "https://www.choad.org/audio/running_rerun-alexa.mp3",
        "https://www.choad.org/audio/sob-alexa.mp3",
        "https://www.choad.org/audio/stop_it-alexa.mp3",
        "https://www.choad.org/audio/stop_whining_x-alexa.mp3",
        "https://www.choad.org/audio/whats_the_matter-alexa.mp3",
        "https://www.choad.org/audio/whoisyourdaddy-alexa.mp3",
        "https://www.choad.org/audio/you_are_mine-alexa.mp3"
        ];
    for (var i=0, t=16; i<t; i++) {
    temp=Math.round(Math.random() * t);
    }

    speechOutput = "<speak>"
                + "<audio src='" + audiosrc[temp] + "' />"
                + "</speak>";
    callback(sessionAttributes,
         buildSpeechletResponseAudio(intent.name, speechOutput, shouldEndSession));
}


// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'ArnoldQuote') {
        getArnoldQuote(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
