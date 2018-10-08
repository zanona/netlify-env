#!/usr/bin/env node

const library = require('./package.json');
const env = require('.');

const args = process.argv.splice(2);
const opts = args.reduce((p, c, i, a) => {
	if (c.startsWith('-')) {
		let value = a[i + 1];
		if (!value || value.startsWith('-')) {
			value = true;
		}
		const key = c.replace(/^-+/, '');
		p[key] = value;
	}
	return p;
}, {});

function getHelpInfo() {
	return `
  Usage: ${library.name} [flags]

  Options:

    -v, --version             output version number (current: ${library.version})

    -c, --context <context>   use specific context from TOML file
                              accepts: production, deploy-preview, branch-deploy
                              and development, which is a custom context
                              (default: $CONTEXT || development)

    -f, --file <path>         path to a specific TOML file to parse configuration
                              from (default: netlify.toml)

  Examples:

    netlify-env
    netlify-env --context deploy-preview
    netlify-env --context branch-deploy --file config.toml

  Visit ${library.repository} for more information
`;
}

if (opts.version || opts.v) {
	console.info(library.version);
	process.exit(0);
}

if (opts.help || opts.h) {
	console.info(getHelpInfo());
	process.exit(0);
}

async function main() {
	const options = {
		context: opts.c || opts.context,
		file: opts.f || opts.file
	};
	const v = await env(process.cwd(), options);
	const output = Object.entries(v).map(kv => kv.join('=')).join('\n');
	process.stdout.write(output + '\n');
}

main().catch(console.log);
