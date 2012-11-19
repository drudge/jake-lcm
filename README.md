Locomotive Utilities for Jake
=============================

A collection of useful functions for using [Jake](http://github.com/mde/jake) 
and [Locomotive](http://locomotivejs.org) together.


## Installation

`npm install jake-lcm`

## Usage

```javascript
var lcm = require('jake-lcm');

task('smth', function () {
  lcm.exec(function () {
    // the context of `this` is your locomotive app environment
    // your environment and initializers have all been ran.
    // this.set('some setting') this.disabled('foo') all work
  });
});
```

You can also choose which initializers to load, if you only need certain ones:

```javascript
var lcm = require('jake-lcm');

task('smth', function () {
  lcm.exec({
    initializers: [ '00_generic', '02_mongoose' ]
  }, function () {
    // the context of `this` is your locomotive app environment
    // your environment and initializers have all been ran.
    // this.set('some setting') this.disabled('foo') all work
  });
});
```

## License 

(The MIT License)

Copyright (c) 2012 Nicholas Penree &lt;nick@penree.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.