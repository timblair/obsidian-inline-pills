import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view";
import { Range, StateEffect } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { createPillElement } from "./colour";
import type { InlinePillsSettings } from "./settings";

export const settingsChangedEffect = StateEffect.define<void>();

class PillWidget extends WidgetType {
	constructor(readonly label: string, readonly caseInsensitive: boolean) {
		super();
	}

	eq(other: PillWidget): boolean {
		return other.label === this.label && other.caseInsensitive === this.caseInsensitive;
	}

	toDOM(): HTMLElement {
		return createPillElement(this.label, this.caseInsensitive);
	}

	ignoreEvent(): boolean {
		return false;
	}
}

function isInsideCode(view: EditorView, pos: number): boolean {
	let node = syntaxTree(view.state).resolve(pos, 1);
	while (node) {
		if (node.type.name.toLowerCase().includes("code")) return true;
		if (!node.parent) break;
		node = node.parent;
	}
	return false;
}

function buildDecorations(view: EditorView, getSettings: () => InlinePillsSettings): DecorationSet {
	const decorations: Range<Decoration>[] = [];
	const pattern = /\{\{([^}]+)\}\}/g;
	const { caseInsensitive } = getSettings();

	for (const { from, to } of view.visibleRanges) {
		const text = view.state.doc.sliceString(from, to);
		let match;
		while ((match = pattern.exec(text)) !== null) {
			const start = from + match.index;
			const end = start + match[0].length;

			const cursorInside = view.state.selection.ranges.some(
				r => r.from <= end && r.to >= start
			);
			if (cursorInside) continue;

			if (isInsideCode(view, start)) continue;

			decorations.push(
				Decoration.replace({ widget: new PillWidget(match[1] ?? "", caseInsensitive) }).range(start, end)
			);
		}
	}

	return Decoration.set(decorations);
}

export function createPillViewPlugin(getSettings: () => InlinePillsSettings) {
	return ViewPlugin.fromClass(
		class {
			decorations: DecorationSet;

			constructor(view: EditorView) {
				this.decorations = buildDecorations(view, getSettings);
			}

			update(update: ViewUpdate) {
				const settingsChanged = update.transactions.some(t =>
					t.effects.some(e => e.is(settingsChangedEffect))
				);
				if (update.docChanged || update.selectionSet || update.viewportChanged || settingsChanged) {
					this.decorations = buildDecorations(update.view, getSettings);
				}
			}
		},
		{ decorations: v => v.decorations }
	);
}
