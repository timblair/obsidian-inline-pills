import { MarkdownView, Plugin, MarkdownPostProcessorContext } from "obsidian";
import { createPillElement } from "./colour";
import { createPillViewPlugin, settingsChangedEffect } from "./editor-extension";
import { InlinePillsSettings, DEFAULT_SETTINGS, InlinePillsSettingTab } from "./settings";

export default class InlinePillsPlugin extends Plugin {
	settings: InlinePillsSettings;

	async onload() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		this.addSettingTab(new InlinePillsSettingTab(this.app, this));

		this.registerEditorExtension(createPillViewPlugin(() => this.settings));

		this.registerMarkdownPostProcessor(
			(el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
				if (el.innerText.includes("{{")) {
					const nodeList = this.findTextNode(el, "{{");

					nodeList.forEach(node => {
						if (!node.parentElement) return;
						const text = node.textContent ?? "";
						const pattern = /\{\{([^}]+)\}\}/g;
						const fragment = document.createDocumentFragment();
						let lastIndex = 0;
						let match;
						while ((match = pattern.exec(text)) !== null) {
							if (match.index > lastIndex) {
								fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
							}
							fragment.appendChild(createPillElement(match[1] ?? "", this.settings.caseInsensitive));
							lastIndex = match.index + match[0].length;
						}
						if (lastIndex < text.length) {
							fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
						}
						node.parentElement.replaceChild(fragment, node);
					});
				}
			}
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.refreshAllViews();
	}

	refreshAllViews() {
		this.app.workspace.iterateAllLeaves(leaf => {
			if (!(leaf.view instanceof MarkdownView)) return;
			// Re-render Reading view
			leaf.view.previewMode?.rerender(true);
			// Trigger Live Preview rebuild via StateEffect
			const cm = (leaf.view.editor as any).cm;
			if (cm) cm.dispatch({ effects: settingsChangedEffect.of(undefined) });
		});
	}

	findTextNode(el: Node, search?: string): Node[] {
		const list: Node[] = [];

		if (el.nodeType === Node.ELEMENT_NODE) {
			const tag = (el as Element).tagName;
			if (tag === "CODE" || tag === "PRE") return list;
		}

		if (
			el.nodeType == 3 &&
			el.textContent !== null &&
			el.textContent !== "\n" &&
			el.textContent.includes(search ?? "")
		) {
			list.push(el);
		}

		if (el.hasChildNodes()) {
			el.childNodes.forEach(node => {
				list.push(...this.findTextNode(node, search));
			});
		}

		return list;
	}
}
