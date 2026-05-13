# Inline Pills Plugin - Test Cases

Copy this file into an Obsidian vault with the Inline Pills plugin enabled.
Test each case in both **Reading view** and **Live Preview**.

---

## Basic Pills

A simple pill: {{todo}}

Multiple pills on one line: {{todo}} {{done}} {{in-progress}}

Pill with spaces: {{my label}}

Empty pill (should not render): {{}}

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

## Formatting Isolation (Pills Should NOT Inherit)

Bold pill (should not be bold): **{{todo}}**

Italic pill (should not be italic): *{{todo}}*

Bold italic pill (should not be bold or italic): ***{{todo}}***

Bold with surrounding text: **some bold {{todo}} text**

Italic with surrounding text: *some italic {{todo}} text*

## Strikethrough with Other Formatting

Bold strikethrough pill (strikethrough only, not bold): **~~{{todo}}~~**

Italic strikethrough pill (strikethrough only, not italic): *~~{{todo}}~~*

Bold italic strikethrough pill (strikethrough only): ***~~{{todo}}~~***

Strikethrough inside bold (first pill strikethrough only, second pill plain): **~~{{todo}}~~ and {{done}}**

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

Nested braces (should render outer pill containing literal inner braces): {{outer {{inner}}}}

Pill inside a blockquote:
> {{quoted}}

Pill inside a list:
- {{listed}}
- item with {{inline}} pill

Pill inside a heading:

### {{heading-pill}} Test
