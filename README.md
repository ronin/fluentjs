# fluent.js

Simple tool for detecting ugly formatting in user provided input ie. comments, forum posts.

## Why?

Do you have online blog or forum and hate when user posts something like this:

```
LOREM IPSUM dOlOr sIt amEt,consectetur adipisicing elit,SED DO eiusmOd tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam
```

If so this tool might be for you. It scans text and detects some ugly formatting such as missing spaces after punctuation characters, capital letters in the middle of a word and so on. Of course you can create your own rules.

## Usage

First add javascript to your page:

```html
<script type="text/javascript" src="fluent.js"></script>
```

Next you need to configure your rules. This tool uses state machine under the hood, so you need to first defined available states and possible transitions. State represents some kind of character such as small letter or punctuation and is defined with regular expression.

Here are some example states. First argument is state name and second is regular expression.

```javascript
fluent.symbol.add('az', /[a-ząćęłóńśźż\-\(\)0-9]/);
fluent.symbol.add('AZ', /[A-ZĄĆĘŁÓŃŚŹŻ]/);
fluent.symbol.add('space', / /);
fluent.symbol.add('punct', /[\.\,\!\?\;]/);
fluent.symbol.add('break', /[\\\n]/);
```

Next you need to define what formatting error you want to detect:

```javascript
fluent.rule.add('az', 'AZ', 'capital letter in middle of a word');
```

It detects small letter followed by capital letter. Here are some more rules:

```javascript
fluent.rule.add('az', 'AZ', 'capital letter in middle of a word');
fluent.rule.add('AZ', 'punct', 'capital letter in middle of a word');
fluent.rule.add('AZ', 'AZ', 'capital letter in middle of a word');
fluent.rule.add('space', 'int', 'space before punctuation character');
fluent.rule.add('space', 'space', 'double space');
fluent.rule.add('punct', 'az', 'missing space after punctuaction character');
fluent.rule.add('punct', 'AZ', 'missing space after punctuaction character');
fluent.rule.add('punct', 'punct', 'double punctuation character');
fluent.rule.add('break', 'az', 'sentence start with small letter');
```

After defining your rules you need to build state machine:

```javascript

// Build state machine
fluent.symbol.build();
```

And then you can scan text:

```javascript
errors = fluent.parser.parse($('#content-input').val());
```

Errors will be a collection of errors found in provided text. Every error contains character number where it occured and explanation of an error.

See index.html for complete working example.

## Note

This is experimental library without any error handling, tests so it may not work in some browsers.

## Copyright

Copyright (c) 2013 Michał Młoźniak.
