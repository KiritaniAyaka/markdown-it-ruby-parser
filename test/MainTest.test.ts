import { describe, expect, it } from 'vitest'

import MarkdownIt from 'markdown-it'

import { rubyParser } from '../src/index.js'

describe('Test Ruby', () => {
	describe('Style 1', () => {
		it('Default options', () => {
			const md = new MarkdownIt()
			md.use(rubyParser)
			const origin = '[砂]^(すな)の[惑星]^(わくせい)'
			const result = md.render(origin).trim()

			expect(result).toBe(
				'<p><ruby><rb>砂</rb><rp>(</rp><rt>すな</rt><rp>)</rp></ruby>の<ruby><rb>惑星</rb><rp>(</rp><rt>わくせい</rt><rp>)</rp></ruby></p>',
			)
		})

		it('Enable rb, enable rp', () => {
			const md = new MarkdownIt()
			md.use(rubyParser)
			const origin = '[砂]^(すな)の[惑星]^(わくせい)'
			const result = md.render(origin).trim()

			expect(result).toBe(
				'<p><ruby><rb>砂</rb><rp>(</rp><rt>すな</rt><rp>)</rp></ruby>の<ruby><rb>惑星</rb><rp>(</rp><rt>わくせい</rt><rp>)</rp></ruby></p>',
			)
		})

		it('Enable rb, disable rp', () => {
			const md = new MarkdownIt()
			md.use(rubyParser, {
				rb: true,
				rp: false,
			})
			const origin = '[砂]^(すな)の[惑星]^(わくせい)'
			const result = md.render(origin).trim()

			expect(result).toBe(
				'<p><ruby><rb>砂</rb><rt>すな</rt></ruby>の<ruby><rb>惑星</rb><rt>わくせい</rt></ruby></p>',
			)
		})

		it('Disable rb, enable rp', () => {
			const md = new MarkdownIt()
			md.use(rubyParser, {
				rb: false,
				rp: true,
			})
			const origin = '[砂]^(すな)の[惑星]^(わくせい)'
			const result = md.render(origin).trim()

			expect(result).toBe(
				'<p><ruby>砂<rp>(</rp><rt>すな</rt><rp>)</rp></ruby>の<ruby>惑星<rp>(</rp><rt>わくせい</rt><rp>)</rp></ruby></p>',
			)
		})

		it('Disable rb, disable rp', () => {
			const md = new MarkdownIt()
			md.use(rubyParser, {
				rb: false,
				rp: false,
			})
			const origin = '[砂]^(すな)の[惑星]^(わくせい)'
			const result = md.render(origin).trim()

			expect(result).toBe(
				'<p><ruby>砂<rt>すな</rt></ruby>の<ruby>惑星<rt>わくせい</rt></ruby></p>',
			)
		})
	})

	describe('Style 2', () => {
		it('Default options', () => {
			const md = new MarkdownIt()
			md.use(rubyParser, {
				bracket: '{',
			})
			const origin = '[砂]^{すな}の[惑星]^{わくせい}'
			const result = md.render(origin).trim()

			expect(result).toBe(
				'<p><ruby><rb>砂</rb><rp>(</rp><rt>すな</rt><rp>)</rp></ruby>の<ruby><rb>惑星</rb><rp>(</rp><rt>わくせい</rt><rp>)</rp></ruby></p>',
			)
		})

		it('Enable rb, enable rp', () => {
			const md = new MarkdownIt()
			md.use(rubyParser, {
				rb: true,
				rp: true,
				bracket: '{',
			})
			const origin = '[砂]^{すな}の[惑星]^{わくせい}'
			const result = md.render(origin).trim()

			expect(result).toBe(
				'<p><ruby><rb>砂</rb><rp>(</rp><rt>すな</rt><rp>)</rp></ruby>の<ruby><rb>惑星</rb><rp>(</rp><rt>わくせい</rt><rp>)</rp></ruby></p>',
			)
		})

		it('Enable rb, disable rp', () => {
			const md = new MarkdownIt()
			md.use(rubyParser, {
				rb: true,
				rp: false,
				bracket: '{',
			})
			const origin = '[砂]^{すな}の[惑星]^{わくせい}'
			const result = md.render(origin).trim()

			expect(result).toBe(
				'<p><ruby><rb>砂</rb><rt>すな</rt></ruby>の<ruby><rb>惑星</rb><rt>わくせい</rt></ruby></p>',
			)
		})

		it('Disable rb, enable rp', () => {
			const md = new MarkdownIt()
			md.use(rubyParser, {
				rb: false,
				rp: true,
				bracket: '{',
			})
			const origin = '[砂]^{すな}の[惑星]^{わくせい}'
			const result = md.render(origin).trim()

			expect(result).toBe(
				'<p><ruby>砂<rp>(</rp><rt>すな</rt><rp>)</rp></ruby>の<ruby>惑星<rp>(</rp><rt>わくせい</rt><rp>)</rp></ruby></p>',
			)
		})

		it('Disable rb, disable rp', () => {
			const md = new MarkdownIt()
			md.use(rubyParser, {
				rb: false,
				rp: false,
				bracket: '{',
			})
			const origin = '[砂]^{すな}の[惑星]^{わくせい}'
			const result = md.render(origin).trim()

			expect(result).toBe(
				'<p><ruby>砂<rt>すな</rt></ruby>の<ruby>惑星<rt>わくせい</rt></ruby></p>',
			)
		})
	})
})

describe('Test for mixing with other tags', () => {
	it('Mixing with links', () => {
		const md = new MarkdownIt()
		md.use(rubyParser)
		const origin = '[link](http:link) [ruby]^(rubytop)'
		const result = md.render(origin).trim()

		expect(result).toBe(
			'<p><a href="http:link">link</a> <ruby><rb>ruby</rb><rp>(</rp><rt>rubytop</rt><rp>)</rp></ruby></p>',
		)
	})
})

describe('Test for abnormal situation', () => {
	describe('Abnormal ends', () => {
		it('Ends of rt not found', () => {
			const md = new MarkdownIt()
			md.use(rubyParser)
			const origin = '[砂]^(すな'
			const result = md.render(origin).trim()

			expect(result).toBe(`<p>${origin}</p>`)
		})

		it('Left length of text cannot ', () => {
			const md = new MarkdownIt()
			md.use(rubyParser)
			const origin = '砂す[な'
			const result = md.render(origin).trim()

			expect(result).toBe(`<p>${origin}</p>`)
		})
	})
})
