import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view";
import { Range } from "@codemirror/state";
import { getHash, hashToHex, PILL_DARK, PILL_LIGHT } from "./colour";

class PillWidget extends WidgetType {
	constructor(readonly label: string) {
		super();
	}

	eq(other: PillWidget): boolean {
		return other.label === this.label;
	}

	toDOM(): HTMLElement {
		const hash = getHash(this.label);
		const span = document.createElement("span");
		span.className = "inline-pill";
		span.style.backgroundColor = hashToHex(hash, ...PILL_DARK);
		span.style.color = hashToHex(hash, ...PILL_LIGHT);
		span.textContent = this.label.toUpperCase();
		return span;
	}

	ignoreEvent(): boolean {
		return false;
	}
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
