var assert = require('assert');

var Compiler = require('../lib/Compiler');
var Rule = require('../lib/Rule');

describe('Compiler', function(){
  describe('constructor', function(){
    it('should create instance', function(){
      var compiler = new Compiler();
      assert(compiler instanceof Compiler);
    });
    
    it('should has the right properties and methods', function(){
      var compiler = new Compiler();
      properties = ['defaultRule', 'rules']
      properties.forEach((prop) => assert(compiler[prop]));

      methods = ['rule', 'compile']
      methods.forEach((f) => assert(compiler[f] instanceof Function));
    });
  });

  describe('.rule()', function(){
    it('should add to `rules`', function(){
      var compiler = new Compiler();
      compiler.rule(new Rule({
        placeholder: '{}',
        replacement: '{}',
        values: ['hello world']
      }));
      
      compiler.rule(new Rule({
        placeholder: ':css:',
        replacement: 'some css {} here.',
        values: ['lekjfl']
      }));
      assert.equal(compiler.rules.length, 2);
    });

    it('should only accept Rule', function(){
      var compiler = new Compiler();
      assert.throws(() => {
        compiler.rule('this is not a rule, duh.');
      }, /instance of Rule/);
    });
  });

  describe('.compile', function(){
    it('should compile the given text using the rules', function(){
      var compiler = new Compiler();
      compiler.rule(new Rule({
        placeholder: ':css:',
        replacement: 'some css {} here.',
        values: ['a.css', 'b.css']
      }));
      compiler.rule(new Rule({
        placeholder: ':js:',
        replacement: 'some js {} here.',
        values: ['a.js', 'b.js']
      }));
      
      compiled_text = compiler.compile(':css: hello there \n:js:');
      assert.equal(compiled_text,
                   'some css a.css here.some css b.css here. hello there \nsome js a.js here.some js b.js here.');
    });
  });
});
