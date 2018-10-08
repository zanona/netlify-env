# netlify-env
[![Build Status](https://travis-ci.org/zanona/netlify-env.svg?branch=master)](https://travis-ci.org/zanona/netlify-env)
[![Maintainability](https://api.codeclimate.com/v1/badges/59989c272db531c46b37/maintainability)](https://codeclimate.com/repos/5bbc57bc5ecec92c460008fe/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/59989c272db531c46b37/test_coverage)](https://codeclimate.com/repos/5bbc57bc5ecec92c460008fe/test_coverage)

> Resolve environment variables from `netlify.toml`, locally.

Netlify uses [`netlify.toml`](https://www.netlify.com/docs/netlify-toml-reference/)
file allowing developers to set env variables dependant on context.
However, when developing locally we would like to make sure to use the same
variable set available from that file.
For this reason, this package was created to help maintain the same workflow as
we would expect when running from Netlify.
The package will look for the closest `netlify.toml` file related to the
current process directory and expand those variables so it can be sent to the
running script


## Install

```
$ npm install --save netlify-env
$ yarn add --save netlify-env
```

## Usage

```js
const env = require('netlify-env');

env({context: 'staging', file: 'config.toml'}).then(vars => {
  console.log(vars); // object containing all available env vars
});

```

## API

**`env({context, file});`**

**`context`**

Type: `String`

Override current server or local context variables with the ones defined under
a specific context.
Accepted values are: `production`, `deploy-preview`, `branch-deploy`, or `development`
which is a custom context created for developing locally.

*Defaults to* `development`.

**`file`**

Type: `String`

Use a specific TOML file to parse environment variables from.
The program will look for the closest top file available, so you can run
anywhere in your project, even if the file is on the root directory.

*Defaults to* `netlify.toml`.


## CLI


```bash
  $ netlify-env --context deploy-preview --file config.toml
```

https://github.com/zanona/netlify-env/blob/master/cli.js#L21-L41

Example response:
```bash
NODE_ENV=staging
LOG_LEVEL=2
API_ENDPOINT=https://api.example.com/staging/get-keys
```

## Application on package.json

```json
{
  "name": "my-website",
  "version": "0.0.0",
  "scripts": {
    "build": "export $(netlify-env) && build-my-website",
    "test": "export $(netlify-env -c development) && ava"
  }
}
```

## License

MIT © [Marcus Zanona](https://zanona.co)
