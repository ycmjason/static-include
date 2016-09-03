assert = require('assert');

Rule = require('../lib/Rule');

describe('Rule', function(){
  var ruleJSON = {
    placeholder: '{[javascript]}',
    replacement: '<script src="{}"></script>',
    values: ['1', '2.jiji']
  };

  describe('constructor', function(){
    var rule = new Rule(ruleJSON);

    it('should create instance', function(){
      assert(rule instanceof Rule);
    });
    
    it('should has the right properties and methods', function(){
      properties = ['placeholder', 'replacement', 'values']
      properties.forEach((prop) => assert(rule[prop]));

      methods = ['apply', 'applicable']
      methods.forEach((f) => assert(rule[f] instanceof Function));
    });

    it('should throw when shape of values doesn\'t match', function(){
      assert.throws(() => {
        var rule = new Rule({
          placeholder: 'la',
          replacement: '{} j{} jekfj{}',
          values: [[1,2], [3,4,5]]
        });
      }, /number of value placeholders.*doesn't match/i);
    });
  });

  describe('.applicable()', function(){
    var rule = new Rule(ruleJSON);

    it('should return true when applicable', function(){
      assert(rule.applicable('eflkejflek {[javascript]}'));
      assert(rule.applicable('eflkejflek {[javascript]} {[eee]}'));
    });

    it('should return false when not applicable', function(){
      assert(!rule.applicable('eflkejflek {[javascrip]}'));
      assert(!rule.applicable('eflkejflek'));
    });
  });

  describe('.apply()', function(){
    var rule = new Rule(ruleJSON);
    it('should replace placeholder with replacements and values', function(){
      template = 'eflkejflek {[javascript]}   ';
      assert.equal(rule.apply(template),
                   'eflkejflek <script src="1"></script><script src="2.jiji"></script>');
    });

    it('should replace only one placeholder', function(){
      template = 'eflkejflek {[javascript]}   {[javascript]}';
      assert.equal(rule.apply(template),
                   'eflkejflek <script src="1"></script><script src="2.jiji"></script>   {[javascript]}');
    });

    it('should replace nothing when no placeholder found', function(){
      template = 'eflkejflek';
      assert.equal(rule.apply(template),
                   'eflkejflek');
    });

    it('should replace multiple values', function(){
      var rule = new Rule({
        placeholder: '{[javascript]}',
        replacement: '<div class="{}">{}</div>',
        values: [['a', 'this is h'], ['c', 'this is b']]
      });
      assert.equal(rule.apply('efg {[javascript]} abc'),
                   'efg <div class="a">this is h</div><div class="c">this is b</div> abc');
    });

    it('should replace with nothing if there is not value', function(){
      var rule = new Rule({
        placeholder: '{[javascript]}',
        replacement: '<div class="{}">{}</div>',
        values: []
      });
      assert.equal(rule.apply('efg {[javascript]} abc'),
                   'efg  abc');
    });
  });

  describe('.useTemplate()', function(){
    it('should create a Rule with template', function(){
      rule = Rule.useTemplate('js', ['a.js', 'b.js']);
      assert(rule instanceof Rule);
      assert.equal(rule.apply('def{[javascript]}abc  '),
                   'def<script src="a.js"></script><script src="b.js"></script>abc');
    });
    
    it('should have .use() as alias', function(){
      assert.equal(Rule.use, Rule.useTemplate);
    });
  });
});
