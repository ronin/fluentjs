var fluent = (function() {
  function Rule(symbolA, symbolB, name) {
    this.symbolA = symbolA;
    this.symbolB = symbolB;
    this.name = name;

    this.getKey = function() {
      return symbolA + ',' + symbolB;
    }

    return this;
  }

  function Token(character, index) {
    for (symbol in symbols) {
      if (symbols[symbol].test(character)) {
        this.value = symbol;
      }
    }

    this.getValue = function() { return this.value; }
    this.getIndex = function() { return index; }

    return this;
  }

  function Terminal() {
    return this;
  }

  function Tokenizer(input) {
    var index = 0;

    this.getToken = function() {
      var token;

      if (index >= input.length) {
        return new Terminal();
      } else {
        token = new Token(input[index], index);
        index++;

        return token;
      }
    }

    return this;
  }

  function Parser(input) {
    var tokenizer = new Tokenizer(input),

    transitions = {
      'az': ['az', 'int', 'space', 'break'],
      'AZ': ['az', 'break', 'space'],
      'int': ['space', 'break'],
      'space': ['az', 'AZ', 'dash', 'break'],
      'break': ['AZ', 'break']
    };

    this.parse = function() {
      var currentToken, nextToken, mistakes = [], rule;

      currentToken = tokenizer.getToken();

      while(true) {
        nextToken = tokenizer.getToken();

        if (nextToken.constructor === Terminal) {
          break;
        }

        if (transitions[currentToken.getValue()].indexOf(nextToken.getValue()) == -1) {
          rule = fluent.rule.get(currentToken.getValue(), nextToken.getValue());
          mistakes.push([rule, currentToken.getIndex()]);
        }
        currentToken = nextToken;
      }

      return mistakes;
    }

    return this;
  }

  var rules = {}, symbols = {},

  addRule = function(symbolA, symbolB, name) {
    var rule, key;

    rule = new Rule(symbolA, symbolB, name);
    key = rule.getKey();

    rules[key] = rule;
  },

  getRule = function(symbolA, symbolB) {
    var key = symbolA + ',' + symbolB;

    return rules[key];
  },

  addSymbol = function(name, regexp) {
    symbols[name] = regexp;
  },

  parse = function(text) {
    var parser = new Parser(text);

    return parser.parse();
  };

  return {
    parser: {
      parse: parse
    },
    rule: {
      add: addRule,
      get: getRule
    },
    symbol: {
      add: addSymbol
    }
  };
})();

fluent.symbol.add('az', /[a-ząćęłóńśźż\-\(\)0-9]/);
fluent.symbol.add('AZ', /[A-ZĄĆĘŁÓŃŚŹŻ\-]/);
fluent.symbol.add('space', / /);
fluent.symbol.add('int', /[\.\,\!\?]/);
fluent.symbol.add('break', /[\\\n]/);

fluent.rule.add('az', 'AZ', 'duża litera w środku wyrazu');
fluent.rule.add('AZ', 'int', 'duża litera w środku wyrazu');
fluent.rule.add('AZ', 'AZ', 'duża litera w środku wyrazu');
fluent.rule.add('space', 'int', 'spacja przed znakiem interpunkcyjnym');
fluent.rule.add('space', 'space', 'podwójna spacja');
fluent.rule.add('int', 'az', 'brak spacji po znaku interpunkcyjnym');
fluent.rule.add('int', 'AZ', 'brak spacji po znaku interpunkcyjnym');
fluent.rule.add('int', 'int', 'podwójny znak interpunkcyjny');
fluent.rule.add('break', 'az', 'nowe zdanie zaczęte z małej litery');
