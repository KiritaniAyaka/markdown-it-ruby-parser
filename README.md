# markdown-it-ruby-parser

![npm Version Badge](https://img.shields.io/npm/v/markdown-it-ruby-parser.svg)
![GitHub CI Status Badge](https://github.com/KiritaniAyaka/markdown-it-ruby-parser/workflows/CI/badge.svg)

Ruby tag plugin for `markdown-it`

# Usage

## Install

```shell
npm install markdown-it-ruby-parser
# or
yarn add markdown-it-ruby-parser
# or
pnpm add markdown-it-ruby-parser
```

## Syntax

### Input

```markdown
[砂]^(すな)の[惑星]^(わくせい)
```

### Output

```html
<p><ruby>砂<rt>すな</rt></ruby>の<ruby>惑星<rt>わくせい</rt></ruby></p>
```

## Render

```javascript
const md = require('markdown-it')()
const rubyParser = require('markdown-it-ruby-parser')

// using this plugin
md.use(rubyParser)

md.render('What you want to render')
```

## Config

Config definition:

```typescript
interface RubyParserOptions {
	bracket?: BracketStyle
	rb?: boolean
	rp?: boolean
}

type BracketStyle = '(' | '{'
```

### BracketStyle

You can use `(` or `{` style:

`[砂]^(すな)の[惑星]^(わくせい)` or `[砂]^{すな}の[惑星]^{わくせい}`

Default: `(`

### rb

Enable `rb` tag

This configuration decide whether the content of rendering has `rb` tag.

### rp

Enable `rp` tag

This configuration decide whether the content of rendering has `rp` tag.

---

The configurations above has covered in test case, you can view in `/test/MainTest.test.ts`.
