/* eslint max-nested-callbacks: 0 */

'use strict';

const assert = require('assert');
const Duplexer = require('../src');
const Stream = require('readable-stream');
const streamtest = require('streamtest');

describe('Duplexer', () => {
  streamtest.versions.forEach(version => {
    describe('for ' + version + ' streams', () => {
      describe('in binary mode', () => {
        describe('and with async streams', () => {
          it('should work with functionnal API', done => {
            const createDuplexStream = Duplexer;
            const readable = streamtest[version].fromChunks([
              'biba',
              'beloola',
            ]);
            const writable = new Stream.PassThrough();
            const duplex = createDuplexStream({}, writable, readable);

            assert(duplex instanceof Duplexer);

            // Checking writable content
            writable.pipe(
              streamtest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'oudelali');
              })
            );

            // Checking duplex output
            duplex.pipe(
              streamtest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'bibabeloola');
                done();
              })
            );

            streamtest[version].fromChunks(['oude', 'lali']).pipe(duplex);
          });

          it('should work with POO API', done => {
            const readable = streamtest[version].fromChunks([
              'biba',
              'beloola',
            ]);
            const writable = new Stream.PassThrough();
            const duplex = new Duplexer({}, writable, readable);

            // Checking writable content
            writable.pipe(
              streamtest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'oudelali');
              })
            );

            // Checking duplex output
            duplex.pipe(
              streamtest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'bibabeloola');
                done();
              })
            );

            streamtest[version].fromChunks(['oude', 'lali']).pipe(duplex);
          });

          it('should reemit errors', done => {
            const readable = new Stream.PassThrough();
            const writable = new Stream.PassThrough();
            const duplex = new Duplexer(writable, readable);
            let errorsCount = 0;

            // Checking writable content
            writable.pipe(
              streamtest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'oudelali');
              })
            );

            // Checking duplex output
            duplex.pipe(
              streamtest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'bibabeloola');
                assert.equal(errorsCount, 2);
                done();
              })
            );

            duplex.on('error', () => {
              errorsCount++;
            });

            setImmediate(() => {
              // Writing content to duplex
              duplex.write('oude');
              writable.emit('error', new Error('hip'));
              duplex.write('lali');
              duplex.end();

              // Writing content to readable
              readable.write('biba');
              readable.emit('error', new Error('hip'));
              readable.write('beloola');
              readable.end();
            });
          });

          it('should not reemit errors when option is set', done => {
            const readable = new Stream.PassThrough();
            const writable = new Stream.PassThrough();
            const duplex = new Duplexer(
              { reemitErrors: false },
              writable,
              readable
            );
            let errorsCount = 0;

            // Checking writable content
            writable.pipe(
              streamtest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'oudelali');
              })
            );

            // Checking duplex output
            duplex.pipe(
              streamtest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'bibabeloola');
                assert.equal(errorsCount, 0);
                done();
              })
            );

            duplex.on('error', () => {
              errorsCount++;
            });

            // Catch error events
            readable.on('error', () => {});
            writable.on('error', () => {});

            setImmediate(() => {
              // Writing content to duplex
              duplex.write('oude');
              writable.emit('error', new Error('hip'));
              duplex.write('lali');
              duplex.end();

              // Writing content to readable
              readable.write('biba');
              readable.emit('error', new Error('hip'));
              readable.write('beloola');
              readable.end();
            });
          });
        });

        describe('and with sync streams', () => {
          it('should work with functionnal API', done => {
            const createDuplexStream = Duplexer;
            const readable = new Stream.PassThrough();
            const writable = new Stream.PassThrough();
            const duplex = createDuplexStream({}, writable, readable);

            assert(duplex instanceof Duplexer);

            // Checking writable content
            writable.pipe(
              streamtest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'oudelali');
              })
            );

            // Checking duplex output
            duplex.pipe(
              streamtest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'bibabeloola');
                done();
              })
            );

            // Writing content to duplex
            duplex.write('oude');
            duplex.write('lali');
            duplex.end();

            // Writing content to readable
            readable.write('biba');
            readable.write('beloola');
            readable.end();
          });

          it('should work with POO API', done => {
            const readable = new Stream.PassThrough();
            const writable = new Stream.PassThrough();
            const duplex = new Duplexer(writable, readable);

            // Checking writable content
            writable.pipe(
              streamtest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'oudelali');
              })
            );

            // Checking duplex output
            duplex.pipe(
              streamtest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'bibabeloola');
                done();
              })
            );

            // Writing content to duplex
            duplex.write('oude');
            duplex.write('lali');
            duplex.end();

            // Writing content to readable
            readable.write('biba');
            readable.write('beloola');
            readable.end();
          });

          it('should reemit errors', done => {
            const readable = new Stream.PassThrough();
            const writable = new Stream.PassThrough();
            const duplex = new Duplexer(null, writable, readable);
            let errorsCount = 0;

            // Checking writable content
            writable.pipe(
              streamtest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'oudelali');
              })
            );

            // Checking duplex output
            duplex.pipe(
              streamtest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'bibabeloola');
                assert.equal(errorsCount, 2);
                done();
              })
            );

            duplex.on('error', () => {
              errorsCount++;
            });

            // Writing content to duplex
            duplex.write('oude');
            writable.emit('error', new Error('hip'));
            duplex.write('lali');
            duplex.end();

            // Writing content to readable
            readable.write('biba');
            readable.emit('error', new Error('hip'));
            readable.write('beloola');
            readable.end();
          });

          it('should not reemit errors when option is set', done => {
            const readable = new Stream.PassThrough();
            const writable = new Stream.PassThrough();
            const duplex = new Duplexer(
              { reemitErrors: false },
              writable,
              readable
            );
            let errorsCount = 0;

            // Checking writable content
            writable.pipe(
              streamtest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'oudelali');
              })
            );

            // Checking duplex output
            duplex.pipe(
              streamtest[version].toText((err, text) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.equal(text, 'bibabeloola');
                assert.equal(errorsCount, 0);
                done();
              })
            );

            duplex.on('error', () => {
              errorsCount++;
            });

            // Catch error events
            readable.on('error', () => {});
            writable.on('error', () => {});

            // Writing content to duplex
            duplex.write('oude');
            writable.emit('error', new Error('hip'));
            duplex.write('lali');
            duplex.end();

            // Writing content to readable
            readable.write('biba');
            readable.emit('error', new Error('hip'));
            readable.write('beloola');
            readable.end();
          });
        });
      });

      describe('in object mode', () => {
        const obj1 = { cnt: 'oude' };
        const obj2 = { cnt: 'lali' };
        const obj3 = { cnt: 'biba' };
        const obj4 = { cnt: 'beloola' };

        describe('and with async streams', () => {
          it('should work with functionnal API', done => {
            const createDuplexStream = Duplexer;
            const readable = streamtest[version].fromObjects([obj1, obj2]);
            const writable = new Stream.PassThrough({ objectMode: true });
            const duplex = createDuplexStream(
              { objectMode: true },
              writable,
              readable
            );

            assert(duplex instanceof Duplexer);

            // Checking writable content
            writable.pipe(
              streamtest[version].toObjects((err, objs) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.deepEqual(objs, [obj3, obj4]);
              })
            );

            // Checking duplex output
            duplex.pipe(
              streamtest[version].toObjects((err, objs) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.deepEqual(objs, [obj1, obj2]);
                done();
              })
            );

            streamtest[version].fromObjects([obj3, obj4]).pipe(duplex);
          });

          it('should work with functionnal API', done => {
            const readable = streamtest[version].fromObjects([obj1, obj2]);
            const writable = new Stream.PassThrough({ objectMode: true });
            const duplex = Duplexer.obj(writable, readable);

            assert(duplex instanceof Duplexer);

            // Checking writable content
            writable.pipe(
              streamtest[version].toObjects((err, objs) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.deepEqual(objs, [obj3, obj4]);
              })
            );

            // Checking duplex output
            duplex.pipe(
              streamtest[version].toObjects((err, objs) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.deepEqual(objs, [obj1, obj2]);
                done();
              })
            );

            streamtest[version].fromObjects([obj3, obj4]).pipe(duplex);
          });

          it('should work with POO API', done => {
            const readable = streamtest[version].fromObjects([obj1, obj2]);
            const writable = new Stream.PassThrough({ objectMode: true });
            const duplex = new Duplexer(
              { objectMode: true },
              writable,
              readable
            );

            // Checking writable content
            writable.pipe(
              streamtest[version].toObjects((err, objs) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.deepEqual(objs, [obj3, obj4]);
              })
            );

            // Checking duplex output
            duplex.pipe(
              streamtest[version].toObjects((err, objs) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.deepEqual(objs, [obj1, obj2]);
                done();
              })
            );

            streamtest[version].fromObjects([obj3, obj4]).pipe(duplex);
          });

          it('should reemit errors', done => {
            const readable = new Stream.PassThrough({ objectMode: true });
            const writable = new Stream.PassThrough({ objectMode: true });
            const duplex = new Duplexer(
              { objectMode: true },
              writable,
              readable
            );
            let errorsCount = 0;

            // Checking writable content
            writable.pipe(
              streamtest[version].toObjects((err, objs) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.deepEqual(objs, [obj1, obj2]);
              })
            );

            // Checking duplex output
            duplex.pipe(
              streamtest[version].toObjects((err, objs) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.deepEqual(objs, [obj3, obj4]);
                assert.equal(errorsCount, 2);
                done();
              })
            );

            duplex.on('error', () => {
              errorsCount++;
            });

            setImmediate(() => {
              // Writing content to duplex
              duplex.write(obj1);
              writable.emit('error', new Error('hip'));
              duplex.write(obj2);
              duplex.end();

              // Writing content to readable
              readable.write(obj3);
              readable.emit('error', new Error('hip'));
              readable.write(obj4);
              readable.end();
            });
          });

          it('should not reemit errors when option is set', done => {
            const readable = new Stream.PassThrough({ objectMode: true });
            const writable = new Stream.PassThrough({ objectMode: true });
            const duplex = Duplexer.obj(
              { reemitErrors: false },
              writable,
              readable
            );
            let errorsCount = 0;

            // Checking writable content
            writable.pipe(
              streamtest[version].toObjects((err, objs) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.deepEqual(objs, [obj1, obj2]);
              })
            );

            // Checking duplex output
            duplex.pipe(
              streamtest[version].toObjects((err, objs) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.deepEqual(objs, [obj3, obj4]);
                assert.equal(errorsCount, 0);
                done();
              })
            );

            duplex.on('error', () => {
              errorsCount++;
            });

            // Catch error events
            readable.on('error', () => {});
            writable.on('error', () => {});

            setImmediate(() => {
              // Writing content to duplex
              duplex.write(obj1);
              writable.emit('error', new Error('hip'));
              duplex.write(obj2);
              duplex.end();

              // Writing content to readable
              readable.write(obj3);
              readable.emit('error', new Error('hip'));
              readable.write(obj4);
              readable.end();
            });
          });
        });

        describe('and with sync streams', () => {
          it('should work with functionnal API', done => {
            const createDuplexStream = Duplexer;
            const readable = new Stream.PassThrough({ objectMode: true });
            const writable = new Stream.PassThrough({ objectMode: true });
            const duplex = createDuplexStream(
              { objectMode: true },
              writable,
              readable
            );

            assert(duplex instanceof Duplexer);

            // Checking writable content
            writable.pipe(
              streamtest[version].toObjects((err, objs) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.deepEqual(objs, [obj1, obj2]);
              })
            );

            // Checking duplex output
            duplex.pipe(
              streamtest[version].toObjects((err, objs) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.deepEqual(objs, [obj3, obj4]);
                done();
              })
            );

            // Writing content to duplex
            duplex.write(obj1);
            duplex.write(obj2);
            duplex.end();

            // Writing content to readable
            readable.write(obj3);
            readable.write(obj4);
            readable.end();
          });

          it('should work with POO API', done => {
            const readable = new Stream.PassThrough({ objectMode: true });
            const writable = new Stream.PassThrough({ objectMode: true });
            const duplex = new Duplexer(
              { objectMode: true },
              writable,
              readable
            );

            // Checking writable content
            writable.pipe(
              streamtest[version].toObjects((err, objs) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.deepEqual(objs, [obj1, obj2]);
              })
            );

            // Checking duplex output
            duplex.pipe(
              streamtest[version].toObjects((err, objs) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.deepEqual(objs, [obj3, obj4]);
                done();
              })
            );

            // Writing content to duplex
            duplex.write(obj1);
            duplex.write(obj2);
            duplex.end();

            // Writing content to readable
            readable.write(obj3);
            readable.write(obj4);
            readable.end();
          });

          it('should reemit errors', done => {
            const readable = new Stream.PassThrough({ objectMode: true });
            const writable = new Stream.PassThrough({ objectMode: true });
            const duplex = new Duplexer(
              { objectMode: true },
              writable,
              readable
            );
            let errorsCount = 0;

            // Checking writable content
            writable.pipe(
              streamtest[version].toObjects((err, objs) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.deepEqual(objs, [obj1, obj2]);
              })
            );

            // Checking duplex output
            duplex.pipe(
              streamtest[version].toObjects((err, objs) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.deepEqual(objs, [obj3, obj4]);
                assert.equal(errorsCount, 2);
                done();
              })
            );

            duplex.on('error', () => {
              errorsCount++;
            });

            // Writing content to duplex
            duplex.write(obj1);
            writable.emit('error', new Error('hip'));
            duplex.write(obj2);
            duplex.end();

            // Writing content to readable
            readable.write(obj3);
            readable.emit('error', new Error('hip'));
            readable.write(obj4);
            readable.end();
          });

          it('should not reemit errors when option is set', done => {
            const readable = new Stream.PassThrough({ objectMode: true });
            const writable = new Stream.PassThrough({ objectMode: true });
            const duplex = new Duplexer(
              {
                objectMode: true,
                reemitErrors: false,
              },
              writable,
              readable
            );
            let errorsCount = 0;

            // Checking writable content
            writable.pipe(
              streamtest[version].toObjects((err, objs) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.deepEqual(objs, [obj1, obj2]);
              })
            );

            // Checking duplex output
            duplex.pipe(
              streamtest[version].toObjects((err, objs) => {
                if (err) {
                  done(err);
                  return;
                }
                assert.deepEqual(objs, [obj3, obj4]);
                assert.equal(errorsCount, 0);
                done();
              })
            );

            duplex.on('error', () => {
              errorsCount++;
            });

            // Catch error events
            readable.on('error', () => {});
            writable.on('error', () => {});

            // Writing content to duplex
            duplex.write(obj1);
            writable.emit('error', new Error('hip'));
            duplex.write(obj2);
            duplex.end();

            // Writing content to readable
            readable.write(obj3);
            readable.emit('error', new Error('hip'));
            readable.write(obj4);
            readable.end();
          });
        });
      });
    });
  });
});
