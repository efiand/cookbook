#!/usr/bin/env node

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const serenaBin = resolveSerenaBin();

spawnSerena();

/**
 * @param {Error} childError
 * @returns {never}
 */
function onChildError(childError) {
	console.error(`[serena-mcp] ${childError}`);
	process.exit(1);
}

/**
 * @param {number | null} code
 * @returns {never}
 */
function onChildExit(code) {
	process.exit(code ?? 1);
}

/**
 * @returns {string}
 */
function resolveSerenaBin() {
	const localBin = path.join(os.homedir(),
		'.local',
		'bin',
		process.platform === 'win32'
			? 'serena.exe'
			: 'serena');

	if (fs.existsSync(localBin)) {
		return localBin;
	}

	return 'serena';
}

/** @returns {void} */
function spawnSerena() {
	const isWindows = process.platform === 'win32';

	// Cursor on Windows spawns Python MCP servers unreliably — use cmd /c.
	const command = isWindows ? 'cmd.exe' : serenaBin;
	const commandArgs = isWindows
		? [
			'/d',
			'/s',
			'/c',
			serenaBin,
			...args,
		]
		: args;
	const child = spawn(command, commandArgs, { stdio: 'inherit' });

	child.on('error', onChildError);
	child.on('exit', onChildExit);
}
