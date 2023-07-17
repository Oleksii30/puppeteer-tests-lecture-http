const fs = require('fs');
const render = require('./render');
const calculateScores = require('./calculateScores');
let testResultJSON = Buffer.alloc(0);

const scores = {
    SHOULD_SHOW_WARNING_AND_NOT_SAVE_USERNAME_WHEN_IT_IS_EXISTS: 0.5,
    SHOULD_CREATE_ROOM_AND_BE_REDIRECTED_TO_IT: 0.5,
    SHOULD_SHOW_CREATED_ROOMS: 0.1, // SHOULD_SHOW_CREATED_ROOMS with SHOULD_SHOW_NUMBER_OF_USERS_IN_ROOM total is 0.3
    SHOULD_SHOW_NUMBER_OF_USERS_IN_ROOM: 0.2,
    SHOULD_CONNECT_TO_ROOM: 0.3,
    SHOULD_SHOW_WARNING_WHEN_ROOM_WITH_NAME_ALREADY_EXISTS: 0.3,
    ROOM_SHOULD_BE_DELETED_WHEN_THERE_IS_NO_USER: 0.25,
    ROOM_SHOULD_BE_DELETED_WHEN_SINGLE_USERS_DISCONNECTS: 0.25, // criteria splitted into two tests (ROOM_SHOULD_BE_DELETED_WHEN_SINGLE_USERS_DISCONNECTS, ROOM_SHOULD_BE_DELETED_WHEN_THERE_IS_NO_USER) with total score 0.5
    SHOULD_NOT_SHOW_ROOMS_WITH_MAXIMUM_NUMBER_OF_USERS: 0.5,
    SHOULD_DELETE_ROOM_FROM_LIST_WHEN_TIMER_STARTED_OR_GAME_IN_PROGRESS: 0.5,
    SHOULD_SHOW_ROOM_NAME_INSIDE_ROOM: 0.1,
    SHOULD_WORK_BACK_TO_ROOMS_BUTTON: 0.4,
    SHOULD_SHOW_READY_STATUS_OF_USERS_IN_ROOM: 1.2,
    SHOULD_SHOW_OTHER_USERS_IN_ROOM: 0.7,
    SHOULD_START_GAME_WHEN_ALL_USERS_READY_SHOULD_WORK_SECONDS_TIMER_BEFORE_START_GAME: 0.7, // criteria splitted in two tests (SHOULD_START_GAME_WHEN_ALL_USERS_READY_SHOULD_WORK_SECONDS_TIMER_BEFORE_START_GAME, SHOULD_START_GAME_WHEN_ALL_USERS_READY_AND_ONE_LEFT_GAME)
    SHOULD_START_GAME_WHEN_ALL_USERS_READY_AND_ONE_LEFT_GAME: 0.2,
    SHOULD_SHOW_PROGRESS: 1.1,
    SHOULD_HIGHLIGHT_USER_THAT_ENDED_RACE: 0.3,
    SHOULD_SHOW_RESULTS_AFTER_ALL_USERS_ENTERED_TEXT: 0.5, // end game splitted into two tests with total score 0.3 Show results is added to this test (score 0.3) so the score of this test is 0.2 + 0.5 
    SHOULD_END_GAME_WHEN_ONE_USER_DISCONNECTS_AND_OTHER_ENTERED_TEXT: 0.1,
    SHOULD_CLEAR_AFTER_END_GAME: 0.3,
    SHOULD_MAKE_HTTP_REQUEST_TO_GET_TEXT: 0.2,
    SHOULD_END_GAME_WHEN_TIMER_ENDED_SECONDS_FOR_GAME: 0.4,
};

const TOKEN = process.argv[2];
const LANGUAGE_VAR = process.argv[3] ? process.argv[3].toLowerCase() : 'ua';

let language = 'ua';
if (LANGUAGE_VAR === 'ru') {
    language = 'ru';
} else if (LANGUAGE_VAR === 'en') {
    language = 'en';
}

process.stdin.setEncoding('utf8');
process.stdin.on('data', data => {
    testResultJSON = Buffer.concat([testResultJSON, Buffer.from(data)]);
});

process.stdin.on('end', () => {
    try {
        const maxScore = 8;
        const mochaCliCommand = 'mocha --reporter json --require @babel/register --exit tests/*.spec.js || :';
        const bufferData = testResultJSON.toString('utf8').replace(/Listen server on port 3002/g, '');
        const testResultStart = bufferData.indexOf(mochaCliCommand) + mochaCliCommand.length;
        const testResult = JSON.parse(bufferData.substring(testResultStart || 0).trim());
        const localization = require('./localization/' + language);
        const mark = calculateScores(testResult, scores, maxScore);
        const trace = render.trace(localization, testResult, mark, maxScore) + getFails(testResult.failures, localization);
        const generatedFeedback = render.feedback(localization, maxScore);

        fs.writeFileSync(__dirname + '/../rawTestResult.json', JSON.stringify(testResult, null, 4));
        console.log(trace);
        // writeFails(testResult.failures, localization);

        writeResult({
            mark,
            generatedFeedback,
            trace,
        });
    } catch (error) {
        console.error(error);
        writeResult({
            errorCode: 1001,
            errorDescription: error.message,
        });
    }
});

const getFails = (failedTests, localization) => {
	return (
		'\n---------------------------------\n' +
		failedTests.map((test, i) => `${i + 1}) ${localization[test.title]}: ${test.err.message}`).join('\n') +
		'\n---------------------------------'
	);
};

const writeFails = (failedTests, localization) => {
    console.log('\n---------------------------------');
    failedTests.forEach((test, i) => console.log(`${i+1}) ${localization[test.title]}: ${test.err.message}`));
    console.log('\n---------------------------------');
};

const writeResult = result => {
    fs.writeFileSync(
        __dirname + '/../result.json',
        JSON.stringify(
            {
                token: TOKEN,
                buildNumber: String(process.env.BUILD_NUMBER || ''),
                ...result,
            },
            null,
            4
        ),
        { flag: 'w+' }
    );
};
