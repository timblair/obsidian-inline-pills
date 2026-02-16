import { Plugin, MarkdownPostProcessorContext } from "obsidian";
import { createPillElement } from "./colour";
import { pillViewPlugin } from "./editor-extension";

export default class InlinePillsPlugin extends Plugin {
	async onload() {
		this.registerEditorExtension(pillViewPlugin);

		this.registerMarkdownPostProcessor(
			(el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
				if (el.innerText.includes("{{")) {
					const nodeList = this.findTextNode(el, "{{");

					nodeList.forEach(node => {
						if (!node.parentElement) return;
						node.parentElement.innerHTML = node.parentElement.innerHTML.replace(
							/\{\{([^}]+)\}\}/g,
							(match, label): string => createPillElement(label).outerHTML
						);
					});
				}
			}
		);
	}

	findTextNode(el: Node, search?: string): Node[] {
		const list: Node[] = [];
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
