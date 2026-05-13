# Inline Pills Plugin - Test Cases

Copy this file into an Obsidian vault with the Inline Pills plugin enabled.
Test each case in both **Reading view** and **Live Preview**.

---

## Basic Pills

A simple pill: {{todo}}

Multiple pills on one line: {{todo}} {{done}} {{in-progress}}

Pill with spaces: {{my label}}

Empty pill: {{}}

## Colour Consistency

These should always have the same colour as each other: {{consistent}} and {{consistent}}

These should have different colours: {{alpha}} {{beta}} {{gamma}}

## Case Sensitivity

With "Case-insensitive colours" **disabled**, these should be different colours:
{{todo}} {{Todo}} {{TODO}}

With "Case-insensitive colours" **enabled**, these should be the same colour:
{{todo}} {{Todo}} {{TODO}}

## Strikethrough

Plain strikethrough text for reference: ~~struck through~~

Strikethrough pill: ~~{{todo}}~~

Strikethrough with surrounding text: ~~some text {{todo}} more text~~

Multiple strikethrough pills: ~~{{todo}} and {{done}}~~

Non-strikethrough pill for comparison: {{todo}}

## Strikethrough with Other Formatting

Bold strikethrough pill: **~~{{todo}}~~**

Italic strikethrough pill: *~~{{todo}}~~*

Bold italic strikethrough pill: ***~~{{todo}}~~***

Strikethrough inside bold: **~~{{todo}}~~ and {{done}}**

## Pills Inside Code (Should NOT Render)

Inline code: `{{todo}}`

Code block:

```
{{todo}}
```

## Cursor Behaviour (Live Preview Only)

Place your cursor inside this pill and verify the raw syntax is revealed:
{{click-me}}

Move the cursor away and verify it renders as a pill again.

## Edge Cases

Adjacent pills: {{one}}{{two}}

Pill at start of line:
{{start}}

Pill at end of line: {{end}}

Unclosed syntax (should not render): {{unclosed

Nested braces: {{outer {{inner}}}}

Pill inside a blockquote:
> {{quoted}}

Pill inside a list:
- {{listed}}
- item with {{inline}} pill

Pill inside a heading:

### {{heading-pill}} Test
