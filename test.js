import {test} from 'ava';
import env from '.';

const CWD = './fixtures';

async function context(t, input, expected) {
	const context = this.title === 'default' ? undefined : this.title;
	t.is((await env(CWD, {context}))[input], expected);
}
context.title = title => title.split(':').pop();

test('context:production', context, 'NODE_ENV', 'production');
test('context:deploy-preview', context, 'NODE_ENV', 'staging');
test('context:branch-deploy', context, 'NODE_ENV', 'staging');
test('context:development', context, 'NODE_ENV', 'development');
test('context:default', context, 'NODE_ENV', 'development');

test('context:production', context, 'PRODUCTION_ENV', 'production');
test('context:deploy-preview', context, 'DEPLOY_PREVIEW_ENV', 'deploy-preview');
test('context:branch-deploy', context, 'BRANCH_DEPLOY_ENV', 'branch-deploy');
test('context:development', context, 'DEVELOPMENT_ENV', 'development');
test('context:default', context, 'DEVELOPMENT_ENV', 'development');

test('context:production', context, 'BUILD_ENV', 'build');
test('context:deploy-preview', context, 'BUILD_ENV', 'build');
test('context:branch-deploy', context, 'BUILD_ENV', 'build');
test('context:development', context, 'BUILD_ENV', 'build');
test('context:default', context, 'BUILD_ENV', 'build');

test('config:null', async t => {
	t.deepEqual((await env('./')), {});
});
test('config:empty', async t => {
	const file = 'empty.toml';
	t.deepEqual((await env(CWD, {file})), {});
});
test('config:file', async t => {
	const file = 'config.toml';
	t.is((await env(CWD, {file})).CONFIG_ENV, 'config');
});
test('config:cwd', async t => {
	t.is((await env('./fixtures/subdirectory')).BUILD_ENV, 'build');
});
