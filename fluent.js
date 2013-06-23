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
      if (symbols[symbol] !== null && symbols[symbol].test(character)) {
        this.value = symbol;
      }
    }

    if (this.value === undefined) {
      this.value = 'unknown';
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

      if (input[index] === '<') {
        index++;

        while (input[index] !== '>' && index < input.length) {
          index++;
        }
      }

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
    var tokenizer = new Tokenizer(input);

    this.parse = function() {
      var currentToken, nextToken, errors = [], rule;

      currentToken = tokenizer.getToken();

      while(true) {
        nextToken = tokenizer.getToken();

        if (nextToken.constructor === Terminal) {
          break;
        }

        if (transitions[currentToken.getValue()][nextToken.getValue()] === false) {
          rule = fluent.rule.get(currentToken.getValue(), nextToken.getValue());
          errors.push([rule, currentToken.getIndex()]);
        }
        currentToken = nextToken;
      }

      return errors;
    }

    return this;
  }

  var rules = {}, symbols = { unknown: null }, transitions = {},

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

  buildTransitions = function() {
    var rule;

    for (key1 in symbols) {
      transitions[key1] = {};

      for (key2 in symbols) {
        transitions[key1][key2] = true;
      }
    }

    for (key in rules) {
      rule = rules[key];
      transitions[rule.symbolA][rule.symbolB] = false;
    }
  },

  parse = function(text) {
    var parser = new Parser(text);

    return parser.parse();
  },

  highlight = function(text, errors) {
    var newText, i, error;

    newText = '';
    error = errors.shift();

    for (i = 0; i < text.length; i++) {
      if (error !== undefined && error[1] === i) {
        newText += '<span class="parser-error">' + text[i] + '</span>';
        error = errors.shift();
      } else {
        newText += text[i];
      }
    }

    return newText;
  };

  return {
    parser: {
      highlight: highlight,
      parse: parse
    },
    rule: {
      add: addRule,
      get: getRule
    },
    symbol: {
      add: addSymbol,
      build: buildTransitions
    }
  };
})();
