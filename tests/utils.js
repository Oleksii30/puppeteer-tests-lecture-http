import { SECONDS_TIMER_BEFORE_START_GAME } from '../mocks/config';
import assert from 'assert';
import fs from 'fs';
import path from 'path';

export const startAndLogIn = async (browser, username, beforeSubmit = () => {}) => {
	const page = await browser.newPage();
	await page.goto('http://localhost:3002');
	await page.waitForSelector('#username-input', { visible: true, timeout: 2500 });
	await page.type('#username-input', username);
	await beforeSubmit(page, browser);
	await page.click('#submit-button');
	await sleep(300);

	return page;
};

export const createRoom = async (page, roomName) => {
	try {
		await page.waitForSelector('#add-room-btn', { visible: true, timeout: 1500 });
		await page.click('#add-room-btn');
		await page.type('.modal input.modal-input', roomName, { delay: 30 });
        await page.click('.modal .submit-btn');
		await sleep(200);
	} catch (error) {
		console.error(error);
		assert.fail('Unable to create room');
	}
};

export const checkIsInRoom = async page => {
	try {
		await page.waitForSelector('#game-page', { visible: true, timeout: 2000 });
		await page.waitForTimeout(300);
	} catch (error) {
		console.error(error);
		assert.fail('User is not entered room');
	}
};

export const joinRoom = async page => {
	await page.waitForSelector('.room .join-btn', { visible: true, timeout: 1000 });
	await page.click('.room .join-btn');
	await sleep(300);
};

export const quitRoom = async page => {
	await page.waitForSelector('#quit-room-btn', { visible: true, timeout: 1000 });
	await page.click('#quit-room-btn');
};

export const pressReadyButton = async page => {
	await page.waitForSelector('#ready-btn', { visible: true, timeout: 1000 });
	await page.click('#ready-btn');
	await page.waitForTimeout(300);
};

export const checkIsInRoomSelector = async page => {
	try {
		await page.waitForSelector('#add-room-btn', { visible: true, timeout: 1000 });
	} catch (error) {
		console.error(error);
		assert.fail('Is not on the page with selection rooms');
	}
};

export const createTwoUsersInSameRoom = async ({
	browser1,
	browser2,
	username1 = 'user1',
	username2 = 'user2',
	roomName = 'room1',
}) => {
	const page1 = await startAndLogIn(browser1, username1);
	await createRoom(page1, roomName);

	const page2 = await startAndLogIn(browser2, username2);
	await joinRoom(page2);

	await Promise.all([checkIsInRoom(page1), checkIsInRoom(page2)]);

	await sleep(200);

	return { page1, page2 };
};

export const checkTimerAppeared = page => {
	return page.waitForSelector('#timer', { timeout: 100, visible: true });
};

export const checkTextToAppear = page => {
	try {
		page.waitForSelector('#text-container', { timeout: 100, visible: true });
		assert.fail('Text should not be displayed until the timeout is over')
	} catch(err) {
		const timeout = SECONDS_TIMER_BEFORE_START_GAME * 1000 + 1000;
		return page.waitForSelector('#text-container', { timeout, visible: true });
	}
};

export const checkReadyButtonDoesNotExists = page => {
	return page.waitForSelector('#ready-btn', { timeout: 30, visible: true }).then(
		() => assert.fail('Ready button should not be shown'),
		() => {},
	);
};

export const checkTimerDoesNotExists = page => {
	return page.waitForSelector('#timer', { timeout: 30, visible: true }).then(
		() => assert.fail('Timer should not be shown'),
		() => {},
	);
};

export const checkTextDoesNotExists = page => {
	return page.waitForSelector('#text-container', { timeout: 30, visible: true }).then(
		() => assert.fail('Text should not be shown'),
		() => {},
	);
};

export const getTextToEnter = page => {
	return page.$eval('#text-container', node => node.innerText.replace(/\n/g, ''));
};

export const checkProgress = async (page, username, progress) => {
	const userProgress = await page.$eval(`.user-progress[data-username='${username}']`, node => node.style.width);
	assert.strictEqual(userProgress, `${progress}%`, `Progress should be ${progress}%`);
};

export const checkFinished = async (page, username) => {
	await checkProgress(page, username, 100);
	await page.waitForSelector(`.user-progress.finished[data-username='${username}']`, { visible: true, timeout: 100 });
};

export const checkNoRoomShown = async page => {
	return page.waitForSelector('.room .join-btn', { visible: true, timeout: 100 }).then(
		() => assert.fail('Room should not be displayed when maximum users entered it'),
		() => {},
	);
};

export const enterText = async (page, textNumber) => {
	await page.keyboard.down('Shift');
	await page.keyboard.press(`KeyT`);
	await page.keyboard.up('Shift');
	await page.keyboard.press(`KeyE`);
	await page.keyboard.press(`KeyX`);
	await page.keyboard.press(`KeyT`);
	await page.keyboard.press(`-`);
	await page.keyboard.press(`#`);
	await page.keyboard.press(` `);
	await page.keyboard.press(`=`);
	await page.keyboard.press(`=`);
	await page.keyboard.press(`=`);
	await page.keyboard.press(` `);
	await page.keyboard.press(textNumber);
};

export const sleep = milliseconds => {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
};

export const checkUserPlace = async (page, username, place) => {
	try {
		const resultElementSelector = `.user-result[data-username='${username}']`;
		await page.waitForSelector(resultElementSelector, { visible: true, timeout: 1000 });
		const userPlace = await page.$eval(resultElementSelector, node => node.dataset.place);

		assert.equal(userPlace, place, `Should show valid place of user`);
	} catch (error) {
		console.error(error);
		assert.fail('Result for user not shown');
	}
};

export const checkReadyButtonToAppear = page => {
	return page.waitForSelector('#ready-btn', { timeout: 100, visible: true }).then(
		() => {},
		() => assert.fail('Ready button should be shown'),
	);
};

export const checkQuitRoomToAppear = page => {
	return page.waitForSelector('#quit-room-btn', { timeout: 100, visible: true }).then(
		() => {},
		() => assert.fail('Quit room button should be shown'),
	);
};

export const closeResultsModal = async page => {
	await page.waitForSelector('#quit-results-btn', { visible: true });
	await page.click('#quit-results-btn');
};

export const checkNoReadyUser = async page => {
	const readyUsersNumber = (await page.$$eval('.ready-status-green', nodes => nodes)).length;

	assert.strictEqual(readyUsersNumber, 0, 'Should reset ready status');
};

export const getAppAndServer = () => {
	Object.keys(require.cache).forEach(key => delete require.cache[key]);

	const server = require('../homework/build/server');

	return {
		app: server.default?.app || server.app,
		httpServer: server.default?.httpServer || server.httpServer,
	};
};

export const checkQuitRoomDoesNotExists = page => {
	return page.waitForSelector('#quit-room-btn', { timeout: 30, visible: true }).then(
		() => assert.fail('Quit room should not be shown'),
		() => {},
	);
};

export const checkMessageModalShown = page => {
	return page.waitForSelector('.modal .title', { visible: true }).then(
		() => {},
		() => assert.fail('Warning modal is not shown'),
	);
};

export const getNumberOfUsersInRoom = (page, roomName) => {
	return page.$eval(`.connected-users[data-room-name='${roomName}']`, node => Number(node.dataset.roomNumberOfUsers));
};

export const getRooms = (page) => {
    return page.$$eval(`.room`, nodes => nodes.map(node => node.dataset.roomName));
}

export const getRoomName = async (page) => {
  return page.$eval('#room-name', node => node.innerText)
}
