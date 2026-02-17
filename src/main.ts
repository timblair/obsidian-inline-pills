import { Plugin, MarkdownPostProcessorContext } from "obsidian";
import { createPillElement } from "./colour";
import { pillViewPlugin } from "./editor-extension";
import { InlinePillsSettings, DEFAULT_SETTINGS, InlinePillsSettingTab } from "./settings";

export default class InlinePillsPlugin extends Plugin {
	settings: InlinePillsSettings;

	async onload() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		this.addSettingTab(new InlinePillsSettingTab(this.app, this));

		this.registerEditorExtension(pillViewPlugin);

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
							fragment.appendChild(createPillElement(match[1] ?? ""));
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
