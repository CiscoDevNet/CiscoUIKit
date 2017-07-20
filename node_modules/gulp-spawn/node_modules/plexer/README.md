# Plexer
> A stream duplexer embracing Streams 2.0 (for real).

[![NPM version](https://badge.fury.io/js/plexer.png)](https://npmjs.org/package/plexer) [![Build Status](https://travis-ci.org/nfroidure/plexer.png?branch=master)](https://travis-ci.org/nfroidure/plexer) [![Dependency Status](https://david-dm.org/nfroidure/plexer.png)](https://david-dm.org/nfroidure/plexer) [![devDependency Status](https://david-dm.org/nfroidure/plexer/dev-status.png)](https://david-dm.org/nfroidure/plexer#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/nfroidure/plexer/badge.png?branch=master)](https://coveralls.io/r/nfroidure/plexer?branch=master)

## Usage

### plexer([options,] writable, readable)

#### options.reemitErrors
Type: `Boolean`
Default value: `true`

Tells the duplexer to reemit given streams errors.

#### writable
Type: `Stream`

Required. Any writable stream.

### readable
Type: `Stream`

Required. Any readable stream.


## Contributing
Feel free to pull your code if you agree with publishing it under the MIT license.

