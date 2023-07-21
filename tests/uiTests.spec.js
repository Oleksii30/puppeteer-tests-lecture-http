import { SECONDS_FOR_GAME } from '../mocks/config';
import {
	startAndLogIn,
	createRoom,
	checkIsInRoom,
	joinRoom,
	quitRoom,
	pressReadyButton,
	checkIsInRoomSelector,
	createTwoUsersInSameRoom,
	checkTimerAppeared,
	checkTextToAppear,
	checkReadyButtonDoesNotExists,
	checkTimerDoesNotExists,
	checkTextDoesNotExists,
	getTextToEnter,
	checkProgress,
	checkFinished,
	checkNoRoomShown,
	enterText,
	sleep,
	checkUserPlace,
	closeResultsModal,
	checkReadyButtonToAppear,
	checkQuitRoomToAppear,
	checkNoReadyUser,
	getAppAndServer,
	checkQuitRoomDoesNotExists,
	checkMessageModalShown,
	getNumberOfUsersInRoom,
	getRooms,
	getRoomName,
} from './utils';

const puppeteer = require('puppeteer');
const assert = require('assert');

describe('Test UI', () => {
	console.log = () => {};
	console.warn = () => {};
	console.info = () => {};
	let browsers = [];
	let app = null;
	let server = null;

	const initBrowsers = async numberOfBrowsers => {
		browsers = await Promise.all(
			Array(numberOfBrowsers)
				.fill(null)
				.map(() =>
					puppeteer.launch({
						headless: true,
						args: [
							'--no-sandbox',
							'--disable-setuid-sandbox',
							'--disable-dev-shm-usage',
							`--window-size=1920,1080`,
						],
					}),
				),
		);
	};

	beforeEach(function () {
		this.timeout(5000);
		const { app: serverApp, httpServer } = getAppAndServer();
		app = serverApp;
		server = httpServer;
	});

	afterEach(async function () {
		this.timeout(5000);
		await Promise.all(browsers.map(browser => browser?.close()));

		browsers = [];
		server?.close();
	});

	it('SHOULD_SHOW_WARNING_WHEN_USERNAME_IS_EXISTS', async function () {
		this.timeout(11000);
		await initBrowsers(2);
		const username = 'username-test';

		const page1 = await startAndLogIn(browsers[0], username);
		const page2 = await startAndLogIn(browsers[1], username);

		await sleep(200);

		await checkMessageModalShown(page2);
	});

	it('SHOULD__NOT_SAVE_USERNAME_WHEN_IT_IS_EXISTS', async function () {
		this.timeout(11000);
		await initBrowsers(2);
		const username = 'username-test';

		const page1 = await startAndLogIn(browsers[0], username);
		const page2 = await startAndLogIn(browsers[1], username);

		await sleep(800);

		const usernameFromSessionStorage = await page1.evaluate(() => window.sessionStorage.username);
		const usernameFromSessionStorage1 = await page2.evaluate(() => window.sessionStorage.username);

		assert(
			usernameFromSessionStorage !== usernameFromSessionStorage1,
			'Should not save username in sessionStorage when user with the same username already exists',
		);
	});

	it('SHOULD_CREATE_ROOM_AND_BE_REDIRECTED_TO_IT', async function () {
		this.timeout(13000);
		const username = 'username-test';
		await initBrowsers(1);

		const page = await startAndLogIn(browsers[0], username);

		await createRoom(page, 'room1');
		await checkIsInRoom(page);
	});

	it('SHOULD_SHOW_CREATED_ROOMS', async function () {
		this.timeout(13000);
		await initBrowsers(3);

		const username1 = 'user1';
		const username2 = 'user2';
		const username3 = 'user3';
		const roomName1 = 'room-1';
		const roomName2 = 'room-2';

		const [page1, page2, page3] = await Promise.all([
			startAndLogIn(browsers[0], username1),
			startAndLogIn(browsers[1], username2),
			startAndLogIn(browsers[2], username3),
		]);
		await createRoom(page1, roomName1);

		let rooms = await getRooms(page2);

		assert.equal(rooms.length, 1, 'Should show one created room');
		assert.equal(rooms[0], roomName1, 'Should gave data-room-name === room-1');

		await createRoom(page2, roomName2);

		rooms = await getRooms(page3);

		assert.equal(rooms.length, 2, 'Should show two created room');
		assert.equal(rooms[0], roomName1, 'Should gave data-room-name === ' + roomName1);
		assert.equal(rooms[1], roomName2, 'Should gave data-room-name === ' + roomName2);
	});

	it('SHOULD_SHOW_NUMBER_OF_USERS_IN_ROOM', async function () {
		this.timeout(13000);
		await initBrowsers(3);

		const username1 = 'user1';
		const username2 = 'user2';
		const username3 = 'user3';
		const roomName = 'room-1';

		const page1 = await startAndLogIn(browsers[0], username1);
		await createRoom(page1, roomName);

		const page2 = await startAndLogIn(browsers[1], username2);
		const page3 = await startAndLogIn(browsers[2], username3);
		await sleep(700);

		assert.equal(await getNumberOfUsersInRoom(page2, roomName), 1, 'Should show number of connected users');
		assert.equal(await getNumberOfUsersInRoom(page3, roomName), 1, 'Should show number of connected users');

		await joinRoom(page2);
		await sleep(1000);

		assert.equal(await getNumberOfUsersInRoom(page3, roomName), 2, 'Should show number of connected users');
	});

	it('SHOULD_CONNECT_TO_ROOM', async function () {
		this.timeout(11000);
		await initBrowsers(3);

		const username1 = 'user1';
		const username2 = 'user2';
		const username3 = 'user3';
		const roomName = 'room-1';

		const page1 = await startAndLogIn(browsers[0], username1);

		await createRoom(page1, roomName);
		await checkIsInRoom(page1);

		const page2 = await startAndLogIn(browsers[1], username2);
		const page3 = await startAndLogIn(browsers[2], username3);

		await joinRoom(page2);
		await checkIsInRoom(page2);

		await joinRoom(page3);
		await checkIsInRoom(page3);
	});

	it('SHOULD_SHOW_WARNING_WHEN_ROOM_WITH_NAME_ALREADY_EXISTS', async function () {
		this.timeout(11000);
		await initBrowsers(2);
		const username1 = 'user1';
		const username2 = 'user2';
		const roomName = 'room-1';

		const page1 = await startAndLogIn(browsers[0], username1);
		const page2 = await startAndLogIn(browsers[1], username2);

		await sleep(200);

		await createRoom(page1, roomName);
		await checkIsInRoom(page1);

		await sleep(200);

		await createRoom(page2, roomName);
		await checkMessageModalShown(page2);
	});

	it('ROOM_SHOULD_BE_DELETED_WHEN_THERE_IS_NO_USER', async function () {
		this.timeout(13000);
		await initBrowsers(1);

		const username = 'username-test';

		const page = await startAndLogIn(browsers[0], username);

		await createRoom(page, 'test-room');
		await checkIsInRoom(page);
		await quitRoom(page);
		await sleep(200);
		await checkIsInRoomSelector(page);

		const numberOfRooms = (await page.$$eval('.room .join-btn', nodes => nodes)).length;

		assert(numberOfRooms === 0, 'room should be deleted when user quit it');
	});

	it('ROOM_SHOULD_BE_DELETED_WHEN_SINGLE_USERS_DISCONNECTS', async function () {
		this.timeout(13000);
		await initBrowsers(2);

		const username1 = 'username-test';
		const username2 = 'username-test-1';

		const page1 = await startAndLogIn(browsers[0], username1);

		await createRoom(page1, 'test-room');
		await checkIsInRoom(page1);
		page1.close();

		const page2 = await startAndLogIn(browsers[1], username2);
		await checkIsInRoomSelector(page2);
		const numberOfRooms = (await page2.$$eval('.room .join-btn', nodes => nodes)).length;

		assert(numberOfRooms === 0, 'room should be deleted when user disconnects it');
	});

	it('SHOULD_NOT_SHOW_ROOMS_WITH_MAXIMUM_NUMBER_OF_USERS', async function () {
		this.timeout(16000);
		await initBrowsers(4);

		const username1 = 'user1';
		const username2 = 'user2';
		const username3 = 'user3';
		const username4 = 'user4';
		const roomName = 'room-1';

		const page1 = await startAndLogIn(browsers[0], username1);
		await createRoom(page1, roomName);
		await checkIsInRoom(page1);

		await startAndLogIn(browsers[1], username2);
		await startAndLogIn(browsers[2], username3);
		await startAndLogIn(browsers[3], username4);

		await joinRoom(page2);
		await joinRoom(page3);
		await checkIsInRoom(page2);
		await checkIsInRoom(page3)

		await checkNoRoomShown(page4);
	});

	it('SHOULD_DELETE_ROOM_FROM_LIST_WHEN_TIMER_STARTED_OR_GAME_IN_PROGRESS', async function () {
		this.timeout(13000);
		await initBrowsers(3);

		const { page1, page2 } = await createTwoUsersInSameRoom({ browser1: browsers[0], browser2: browsers[1] });
		const page3 = await startAndLogIn(browsers[2], 'user3');

		await pressReadyButton(page1);
		await pressReadyButton(page2);

		await checkNoRoomShown(page3);
		await page3.waitForTimeout(500);
		await page3.reload();

		await checkNoRoomShown(page3);
	});

	it('SHOULD_SHOW_ROOM_NAME_INSIDE_ROOM', async function () {
		this.timeout(13000);
		const username = 'username-test';
		await initBrowsers(1);

		const page = await startAndLogIn(browsers[0], username);

		await createRoom(page, 'room1');
		await checkIsInRoom(page);
		const roomName = await getRoomName(page);
		assert.equal(roomName, 'room1', 'Should show room name in #room-name');
	});

	it('SHOULD_WORK_BACK_TO_ROOMS_BUTTON', async function () {
		this.timeout(13000);
		await initBrowsers(1);

		const username = 'username-test';

		const page = await startAndLogIn(browsers[0], username);

		await createRoom(page, 'test-room');
		await checkIsInRoom(page);
		await quitRoom(page);
		await checkIsInRoomSelector(page);
	});

	it('SHOULD_SHOW_READY_STATUS_OF_USERS_IN_ROOM', async function () {
		this.timeout(13000);
		await initBrowsers(2);

		const username1 = 'user1';
		const username2 = 'user2';

		const { page1, page2 } = await createTwoUsersInSameRoom({
			browser1: browsers[0],
			browser2: browsers[1],
			username1,
			username2,
		});

		await pressReadyButton(page1);

		const isUser1ReadyOnPage1 = await page1.$eval(
			`.ready-status[data-username='${username1}']`,
			node => String(node.dataset.ready) === 'true',
		);
		const isUser1ReadyOnPage2 = await page2.$eval(
			`.ready-status[data-username='${username1}']`,
			node => String(node.dataset.ready) === 'true',
		);
		const isUser2NotReadyOnPage1 = await page1.$eval(
			`.ready-status[data-username='${username2}']`,
			node => String(node.dataset.ready) === 'false',
		);
		const isUser2NotReadyOnPage2 = await page2.$eval(
			`.ready-status[data-username='${username2}']`,
			node => String(node.dataset.ready) === 'false',
		);

		assert.equal(isUser1ReadyOnPage1, true, 'User1 should be shown with ready status for User1');
		assert.equal(isUser1ReadyOnPage2, true, 'User1 should be shown with ready status for User2');
		assert.equal(isUser2NotReadyOnPage1, true, 'User2 should be shown with not ready status for User1');
		assert.equal(isUser2NotReadyOnPage2, true, 'User2 should be shown with not ready status for User2');

		await pressReadyButton(page1);

		[
			await page1.$eval(
				`.ready-status[data-username='${username1}']`,
				node => String(node.dataset.ready) === 'false',
			),
			await page2.$eval(
				`.ready-status[data-username='${username1}']`,
				node => String(node.dataset.ready) === 'false',
			),
			await page1.$eval(
				`.ready-status[data-username='${username2}']`,
				node => String(node.dataset.ready) === 'false',
			),
			await page2.$eval(
				`.ready-status[data-username='${username2}']`,
				node => String(node.dataset.ready) === 'false',
			),
		].forEach(value => assert(value, 'All users should show not ready status'));
	});

	it('SHOULD_SHOW_OTHER_USERS_IN_ROOM', async function () {
		this.timeout(13000);
		await initBrowsers(2);

		const username1 = 'user1';
		const username2 = 'user2';

		const { page1, page2 } = await createTwoUsersInSameRoom({
			browser1: browsers[0],
			browser2: browsers[1],
			username1,
			username2,
		});

		const page1User1 = await page1.$eval(`.username[data-username='${username1}']`, node => node.innerText);
		const page2User1 = await page2.$eval(`.username[data-username='${username1}']`, node => node.innerText);
		const page1User2 = await page1.$eval(`.username[data-username='${username2}']`, node => node.innerText);
		const page2User2 = await page2.$eval(`.username[data-username='${username2}']`, node => node.innerText);

		assert(page1User1.includes('(you)'), 'Should show current user on page 1');
		assert(page2User1 === username1, 'Should show another user on page 2');
		assert(page1User2 === username2, 'Should show another user on page 1');
		assert(page2User2.includes('(you)'), 'Should show current user on page 2');
	});

	it('SHOULD_START_GAME_WHEN_ALL_USERS_READY_SHOULD_WORK_SECONDS_TIMER_BEFORE_START_GAME', async function () {
		this.timeout(32000);
		await initBrowsers(2);

		const { page1, page2 } = await createTwoUsersInSameRoom({ browser1: browsers[0], browser2: browsers[1] });

		await pressReadyButton(page1);
		await pressReadyButton(page2);

		await checkTimerAppeared(page1);
		await checkTimerAppeared(page2);
		await checkTextDoesNotExists(page1);
		await checkTextDoesNotExists(page2);
		await checkReadyButtonDoesNotExists(page1);
		await checkReadyButtonDoesNotExists(page2);
		await checkTextToAppear(page1);
		await checkTextToAppear(page2);
		await checkTimerDoesNotExists(page1);
		await checkTimerDoesNotExists(page2);
		await checkQuitRoomDoesNotExists(page1);
		await checkQuitRoomDoesNotExists(page2);

	});

	it('SHOULD_START_GAME_WHEN_ALL_USERS_READY_AND_ONE_LEFT_GAME', async function () {
		this.timeout(28000);
		await initBrowsers(3);

		const page1 = await startAndLogIn(browsers[0], 'user1');
		const page2 = await startAndLogIn(browsers[1], 'user2');
		const page3 = await startAndLogIn(browsers[2], 'user3');

		await createRoom(page1, 'room1');
		await joinRoom(page2);
		await joinRoom(page3);

		await pressReadyButton(page1);
		await pressReadyButton(page2);

		await quitRoom(page3);

		await checkTimerAppeared(page1);
		await checkTimerAppeared(page2);
		await checkTextDoesNotExists(page1);
		await checkTextDoesNotExists(page2);
		await checkReadyButtonDoesNotExists(page1);
		await checkReadyButtonDoesNotExists(page2);
		await checkTextToAppear(page1);
		await checkTextToAppear(page2);
		await checkTimerDoesNotExists(page1);
		await checkTimerDoesNotExists(page2);
		await checkQuitRoomDoesNotExists(page1);
		await checkQuitRoomDoesNotExists(page2);

	});

	it('SHOULD_SHOW_PROGRESS', async function () {
		this.timeout(22000);
		await initBrowsers(2);

		const { page1, page2 } = await createTwoUsersInSameRoom({ browser1: browsers[0], browser2: browsers[1] });

		await pressReadyButton(page1);
		await pressReadyButton(page2);
		await checkTextToAppear(page1);
		await checkTextToAppear(page2);

		const page1Text = await getTextToEnter(page1);

		await page1.keyboard.down('Shift');
		await page1.keyboard.press(`KeyT`);
		await page1.keyboard.up('Shift');
		await page1.keyboard.press(`KeyE`);
		await page1.keyboard.press(`KeyX`);
		await page1.keyboard.press(`KeyT`);
		await page1.keyboard.press(`-`);
		await page1.keyboard.press(`#`);
		await checkProgress(page1, 'user1', 50);
		await checkProgress(page2, 'user1', 50);
	});

	it('SHOULD_HIGHLIGHT_USER_THAT_ENDED_RACE', async function () {
		this.timeout(13000);
		await initBrowsers(2);

		const { page1, page2 } = await createTwoUsersInSameRoom({ browser1: browsers[0], browser2: browsers[1] });

		await pressReadyButton(page1);
		await pressReadyButton(page2);
		await checkTextToAppear(page1);
		await checkTextToAppear(page2);

		const page1Text = await getTextToEnter(page1);
		const page2Text = await getTextToEnter(page2);

		assert.strictEqual(page1Text, page2Text, 'Text should be the same on both pages');

		await enterText(page1, page1Text[page1Text.length - 1]);
		await sleep(200);
		await checkFinished(page1, 'user1');
		await checkFinished(page2, 'user1');
	});

	it('SHOULD_SHOW_RESULTS_AFTER_ALL_USERS_ENTERED_TEXT', async function () {
		this.timeout(15000);
		await initBrowsers(2);

		const { page1, page2 } = await createTwoUsersInSameRoom({ browser1: browsers[0], browser2: browsers[1] });

		await pressReadyButton(page1);
		await pressReadyButton(page2);
		await checkTextToAppear(page1);
		await checkTextToAppear(page2);

		const text = await getTextToEnter(page1);
		await enterText(page1, text[text.length - 1]);
		await sleep(200);
		await enterText(page2, text[text.length - 1]);

		await sleep(200);
		await checkTextDoesNotExists(page1);
		await checkTextDoesNotExists(page2);

		await checkUserPlace(page1, 'user1', 1);
		await checkUserPlace(page1, 'user2', 2);
		await checkUserPlace(page2, 'user1', 1);
		await checkUserPlace(page2, 'user2', 2);
	});

	it('SHOULD_END_GAME_WHEN_ONE_USER_DISCONNECTS_AND_OTHER_ENTERED_TEXT', async function () {
		this.timeout(17000);
		await initBrowsers(3);

		const { page1, page2 } = await createTwoUsersInSameRoom({ browser1: browsers[0], browser2: browsers[1] });
		const page3 = await startAndLogIn(browsers[2], 'user3');
		await joinRoom(page3);
		await sleep(300);

		await pressReadyButton(page1);
		await pressReadyButton(page2);
		await pressReadyButton(page3);
		await checkTextToAppear(page1);
		await checkTextToAppear(page2);
		await checkTextToAppear(page3);

		const text = await getTextToEnter(page1);
		await enterText(page1, text[text.length - 1]);
		await sleep(200);
		await enterText(page2, text[text.length - 1]);

		await page3.close();

		await sleep(200);

		await checkUserPlace(page1, 'user1', 1);
		await checkUserPlace(page1, 'user2', 2);
		await checkUserPlace(page2, 'user1', 1);
		await checkUserPlace(page2, 'user2', 2);
	});

	it('SHOULD_END_GAME_WHEN_TIMER_ENDED_SECONDS_FOR_GAME', async function () {
		this.timeout(33000);
		await initBrowsers(2);

		const { page1, page2 } = await createTwoUsersInSameRoom({ browser1: browsers[0], browser2: browsers[1] });

		await pressReadyButton(page1);
		await pressReadyButton(page2);
		await checkTextToAppear(page1);
		await checkTextToAppear(page2);

		const text = await getTextToEnter(page1);
		await enterText(page1, text[text.length - 1]);
		await sleep(200);

		await sleep(SECONDS_FOR_GAME * 1000);

		await checkUserPlace(page1, 'user1', 1);
		await checkUserPlace(page1, 'user2', 2);
		await checkUserPlace(page2, 'user1', 1);
		await checkUserPlace(page2, 'user2', 2);
	});

	it('SHOULD_CLEAR_AFTER_END_GAME', async function () {
		this.timeout(13000);
		await initBrowsers(2);

		const { page1, page2 } = await createTwoUsersInSameRoom({ browser1: browsers[0], browser2: browsers[1] });

		await pressReadyButton(page1);
		await pressReadyButton(page2);
		await checkTextToAppear(page1);
		await checkTextToAppear(page2);

		const text = await getTextToEnter(page1);
		await enterText(page1, text[text.length - 1]);
		await sleep(200);
		await enterText(page2, text[text.length - 1]);

		await closeResultsModal(page1);
		await closeResultsModal(page2);

		await sleep(200);
		await checkReadyButtonToAppear(page1);
		await checkReadyButtonToAppear(page2);
		await checkQuitRoomToAppear(page1);
		await checkQuitRoomToAppear(page2);
		await checkNoReadyUser(page1);
		await checkNoReadyUser(page2);
	});

	it('SHOULD_MAKE_HTTP_REQUEST_TO_GET_TEXT', function (done) {
		this.timeout(13000);
		initBrowsers(2)
			.then(() => createTwoUsersInSameRoom({ browser1: browsers[0], browser2: browsers[1] }))
			.then(async ({ page1, page2 }) => {
				await page1.setRequestInterception(true);
				page1.on('request', request => {
					try {
						assert(
							request.url().startsWith('http://localhost:3002/game/texts/'),
							'Should get text by http request to http://localhost:3002/game/texts/',
						);
						request.continue();
						done();
					} catch (error) {
						done(error);
					}
				});
				await pressReadyButton(page1);
				await pressReadyButton(page2);
			})
			.catch(error => done(error));
	});
 });
