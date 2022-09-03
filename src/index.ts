import type MarkdownIt from 'markdown-it'
import type StateInline from 'markdown-it/lib/rules_inline/state_inline'

// [  ]  ^  {   }
const symbols1: KeySymbols = ['['.charCodeAt(0), ']'.charCodeAt(0), '^'.charCodeAt(0), '{'.charCodeAt(0), '}'.charCodeAt(0)]

// [  ]  ^  (   )
const symbols2: KeySymbols = ['['.charCodeAt(0), ']'.charCodeAt(0), '^'.charCodeAt(0), '('.charCodeAt(0), ')'.charCodeAt(0)]

type KeySymbols = [number, number, number, number, number]
export type BracketStyle = '(' | '{'

export interface RubyParserOptions {
	bracket?: BracketStyle
	rb?: boolean
	rp?: boolean
}

export function rubyParser(md: MarkdownIt, options?: RubyParserOptions) {
	if (!options) {
		options = {
			bracket: '(',
			rb: true,
			rp: true,
		}
	}
	options.bracket = options.bracket || '('
	parser(md, options.bracket === '{' ? symbols1 : symbols2, options)
}

function parser(md: MarkdownIt, symbols: KeySymbols, options: RubyParserOptions) {
	md.inline.ruler.before('text', 'ruby', (state, slient) => {
		if (slient) {
			return false // validation mode
		}

		const start = state.pos

		if (state.src.charCodeAt(start) !== symbols[0]) {
			return false
		}

		const max = state.posMax

		if (max <= start + 2) {
			return false
		}

		let found = false

		while (state.pos < max) {
			if (
				state.src.charCodeAt(state.pos) === symbols[3] &&
				state.src.charCodeAt(state.pos - 1) === symbols[2] &&
				state.src.charCodeAt(state.pos - 2) === symbols[1]
			) {
				found = true
				break
			}

			state.md.inline.skipToken(state)
		}

		// part of rt not found
		if (!found || start + 1 === state.pos) { // reset state if not found
			state.pos = start
			return false
		}

		const contentPos = state.pos
		const content = state.src.slice(start + 1, contentPos - 2)

		found = false
		state.pos++

		while (state.pos < max) {
			if (state.src.charCodeAt(state.pos) === symbols[4]) {
				found = true
				break
			}

			if (options.bracket === '(') {
				state.pos++
			} else {
				state.md.inline.skipToken(state)
			}
		}

		if (!found || start + 1 === state.pos) { // reset state if not found
			state.pos = start
			return false
		}

		const ruby = state.src.slice(contentPos + 1, state.pos)

		const { rb = true, rp = true } = options

		gen(state, 'ruby', (state) => {
			if (rb) {
				gen(state, 'rb', content)
			} else {
				gen(state, content)
			}

			if (rp) {
				gen(state, 'rp', '(')
			}

			gen(state, 'rt', ruby)

			if (rp) {
				gen(state, 'rp', ')')
			}
		})

		state.pos++

		return true
	})

	/* c8 ignore next */
}

function gen(state: StateInline, name: string, content?: string | ((state: StateInline) => void)) {
	if (!content) {
		return state.push('text', '', 0).content = name
	}

	state.push(`${name}_open`, name, 1)

	if (typeof content === 'string') {
		const token = state.push('text', '', 0)
		token.content = content
	} else {
		content(state)
	}

	state.push(`${name}_close`, name, -1)
}
