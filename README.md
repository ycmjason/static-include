# static-include
Allow a programmatic way to statically add `<script>`/`<link>`/`<whatever>` to your files. Or more generally, static-include compiles files based on given rules.

## Preface
Ever feel irritated when you have to add `<script>`/`<link>` to your html files manually?  Even copy and paste is annoying, isn't it? YOU LAZY PROGRAMMER! HAHA!

We all want some programmatic way to add those tags. You might instantly think of RequireJS/WebPack... However, sometimes your projects are so tiny that RequireJS/WebPack might be too heavy. static-include might help you if this is your case.

## Table of content
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Templates](#templates)
- [Contributing](#contributing)
- [License](#license)

## Installation
You can install static-include globally:
```
> npm install -g static-include
```
Or just in devDependencies:
```
> npm install --save-dev static-include
```
Note that you might need to add an npm script in order to compile files.

## Usage
```
> static-include [options] <dirs ...>
```
The above command will look into all `dirs` recursively and compile files with `.si.` in their names. 
### Options
- `-h, --help` - show usage information
- `-w, --watch` - keeps the program running and watch for further changes to compile
- `-c, --config <file>` - specify the config file, default: `./siconfig.js`


## `siconfig.js` 
This file exports an object containing these properties:
- `rules`
	- An array containing all rules. Each rule is defined as mentioned [below](#rule).
- `si_identifier` (optional), default: `/\.si\./`
	- Specify a regular expression that will match with the filenames that you wish to compile. 
	- By default, any file containing `.si.` will match.
- `si_identifier_replacement` (optional), default: `'.'`
	- Specify what to replace the `si_identifier` after compiling.
	- By default, `'.'` will be used. Example:
		- `index.si.html` compiles to `index.html`
		- `homepage.si.htm` compiles to `hompage.htm`

### `Rule`
A rule has 3 properties:
- `placeholder`
- `replacement`
- `values`

`placeholder` will be replaced by `replacement` with different `values` plugged in. In order to illustrate this better, here is an example:
```javascript
javascript_rule = {
	placeholder: '{[javascript]}',
	replacement: '<script src="{}"></script>',
	values: ['lib/jquery.min.js', 'main.js']
}
```

If this rule is applied to the following text
```
abcde {[javascript]} haha
```
The output would be
```
abcde <script src="lib/jquery.min.js"></script><script src="main.js"></script> haha
```


## Examples
### Adding `<script>` and `<link>`
- index.si.html
```html
<html>
	<head>
		{[css]}
	</head>
	<body>
		Welcome to my homepage.
		{[javascript]}
	</body>
</html>
```
- siconfig.js
```javascript
var Rule = require('static-include').Rule;

var jsfiles = [
	'lib/jquery.js',
	'bootstrap.js'
];

var cssfiles = [
	'css/main.css',
	'css/second.css'
];

var jsrule = Rule.useTemplate('js').withValues(jsfiles);
var cssrule = Rule.useTemplate('css').withValues(cssfiles);
/* equivalent version without using template:
var jsrule = {
	placeholder: '{[javascript]}',
	replacement: '<script src="{}"></script>',
	values: jsfiles
};
var cssrule = {
	placeholder: '{[css]}',
	replacement: '<link rel="stylesheet" href="{}"></link>',
	values: cssfiles
};
*/
module.exports = {
	rules: [jsrule, cssrule]
};
```
Here I used some predefined [templates](#templates) that comes with static-include.

Now we are ready to compile! 
```
> static-include .
Compiled `index.si.html` > `index.html`
```
A new file `index.html` is created as expected:
```html
<html>
	<head>
		<link rel="stylesheet" href="css/main.css"></link><link rel="stylesheet" href="css/second.css"></link>
	</head>
	<body>
		Welcome to my homepage.
		
	<script src "lib/jquery.js"></script><script src "bootstrap.js"></script>
	</body>
</html>
```
See how handy this is? Later on if you were to add new javascript/css, you simply add them to the `jsfiles`/`cssfiles` array!

### Generate table
We can also use static-include to generate table! Here we illustrate that `rule.values` could be an array of array of values.
- members.template.html
```html
Members:
<table>
  <tr>
    <td>name</td>
    <td>age</td>
  </tr>
  {[members]}
</table>
```
- siconfig.js
```javascript
/* Notice that here each element has 2 values */
var members = [
	['Jason', 21],
	['Margaret', 40],
	['Tiny', 10]
];
var membersrule = {
	placeholder: '{[members]}',
	replacement: '<tr><td>{}</td><td>{}</td></tr>',
	values: members
};

module.exports = {
	rules: [membersrule],
	// notice that our html file is named "members.template.html"
	si_identifier: /\.template\./
};
```
To compile, simply run:
```
> static-include .
Compiled `members.template.html` > `members.html`
```

`members.html` should look like this:
```html
Members:
<table>
  <tr>
    <td>name</td>
    <td>age</td>
  </tr>
  <tr><td>Jason</td><td>21</td></tr><tr><td>Margaret</td><td>40</td></tr><tr><td>Tiny</td><td>10</td></tr>
</table>
```
Very easily we have created a table with data in it.

## Templates
There are some common rules that most of us might want to use. To avoid typing, as demonstrated in the [example](#adding-script-and-link), we have pre-defined some templates for you. 

### How to?
You can use a template with `Rule.useTemplate([name of template]).withValues([values])`. See [example](#adding-script-and-link). 

`Rule.use([name of template])` is an alias for `Rule.useTemplate([name of template])`. So you can simply call `Rule.use('js')` for the [Javascript template](#javascript-template).

### Javascript template
- Name: `javascript`, alias: `js`
- Default properties:
```javascript
{
	 placeholder: '{[javascript]}',
	 replacement: '<script src="{}"></script>'
}
```
- Definition: `rule_templates/javascript.js`

### CSS template
- Name: `css`, alias: `stylesheet`
- Default properties:
```javascript
{
	 placeholder: '{[css]}',
	 replacement: '<link rel="stylesheet" href="{}">'
}
```
- Definition: `rule_templates/javascript.js`

## Contributing
Feel free to contribute to this project. You can add more templates/boilerplates in `rule_templates/` directory. 

### Tests
You can run the test with `npm test`.

## License
ISC

