# Lesgo!

[![Build Status](https://travis-ci.org/reflex-media/lesgo-framework.svg?branch=master)](https://travis-ci.org/reflex-media/lesgo-framework)
[![Coverage Status](https://coveralls.io/repos/github/reflex-media/lesgo-framework/badge.svg?branch=master)](https://coveralls.io/github/reflex-media/lesgo-framework?branch=master)

Bootstrap your next microservice with a lightweight node.js serverless framework.

> Note: This repository contains the core code of the Lesgo! framework. If you want to build an application using Lesgo!, visit the main Lesgo! repository.

## Unit Test

This framework uses Jest test framework for unit testing.

All test files exist in the respective `src/__tests__/` directory.

**Run test**

```bash
$ yarn test
```

**Run code coverage report**

```bash
$ yarn coverage
```

View the generated html report in `coverage/index.html`.

### Test environment

Declare test environment configurations as NODE variables in `setupTest.js`.

## Contributing

You may contribute to the core framework by submitting a PR to the `develop` branch.

The codebase is written in ES6 (ES2015) syntax and compiled and minified to ES5 in the `build` directory. This `build` directory will be used by Lesgo!

**To compile**

```
$ yarn build
```
