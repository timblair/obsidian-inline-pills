import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view";
import { Range } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { createPillElement } from "./colour";

class PillWidget extends WidgetType {
	constructor(readonly label: string) {
		super();
	}

	eq(other: PillWidget): boolean {
		return other.label === this.label;
	}

	toDOM(): HTMLElement {
		return createPillElement(this.label);
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

function buildDecorations(view: EditorView): DecorationSet {
	const decorations: Range<Decoration>[] = [];
	const pattern = /\{\{([^}]+)\}\}/g;

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
				Decoration.replace({ widget: new PillWidget(match[1] ?? "") }).range(start, end)
			);
		}
	}

	return Decoration.set(decorations);
}

export const pillViewPlugin = ViewPlugin.fromClass(
	class {
		decorations: DecorationSet;

		constructor(view: EditorView) {
			this.decorations = buildDecorations(view);
		}

		update(update: ViewUpdate) {
			if (update.docChanged || update.selectionSet || update.viewportChanged) {
				this.decorations = buildDecorations(update.view);
			}
		}
	},
	{ decorations: v => v.decorations }
);
