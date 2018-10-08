const path = require('path');
const fs = require('fs');
const util = require('util');
const TOML = require('toml');

const DEFAULT_FILE = 'netlify.toml';
const DEFAULT_CONTEXT = process.env.CONTEXT || 'development';

const {promisify} = util;
const {stat} = fs;
const read = promisify(fs.readFile);
const exists = c => new Promise(resolve => stat(c, err => resolve(!err)));
const getValue = (obj, path) => path.split('.').reduce((p, c) => p && p[c], obj);

async function configLookup(file, cwd) {
	const src = path.join(cwd, file);
	const found = await exists(src);
	if (found) {
		return src;
	}
	if (cwd === '/') {
		return '';
	}
	const parentDir = path.resolve(cwd, '..');
	return configLookup(file, parentDir);
}

module.exports = async function (cwd, config = {}) {
	const configPath = await configLookup(config.file || DEFAULT_FILE, cwd);
	const context = config.context || DEFAULT_CONTEXT;
	if (configPath) {
		const toml = TOML.parse(await read(configPath));
		return {
			...getValue(toml, 'build.environment'),
			...getValue(toml, `context.${context}.environment`)
		};
	}
	return {};
};
