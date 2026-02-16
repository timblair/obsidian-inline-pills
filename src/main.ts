import { Plugin, MarkdownPostProcessorContext } from "obsidian";

export function mod(n, m) { return ((n % m) + m) % m; }

export function hashToHsl(hash, saturation, lightness) {
	if (!saturation) saturation = Math.random();
	if (!lightness) lightness = Math.random();
	return [mod(~~(360 * hash), 360), saturation, lightness];
}

export function getHash(str) {
	let hash = 0;
	if (!str) hash = Math.random();
	else
		for (var i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
	return hash;
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h is contained in the set  [0, 360], while s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
export function hslToRgb(h, s, l) {
	h = h / 360;
	var r, g, b;

	if (s == 0) {
		r = g = b = l; // achromatic
	} else {
		var hue2rgb = (p, q, t) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
};

export function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export function hashToHex(hash, saturation, lightness) {
	var hsl = hashToHsl(hash, saturation, lightness);
	var rgb = hslToRgb(...hsl);
	var hex = rgbToHex(...rgb);
	return hex;
}

export default class InlinePillsPlugin extends Plugin {
	async onload() {

		console.log("InlinePills plugin loaded!");

		this.registerMarkdownPostProcessor(
			(el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
				if (el.innerText.includes("{{")) {

					let light = [0.9, 0.9];
					let dark = [0.5, 0.35];

					let nodeList = this.findTextNode(el, "{{");
					console.log(nodeList);

					nodeList.forEach(node => {
						node.parentElement.innerHTML = node.parentElement.innerHTML.replace(
							/{{([^}]+)}}/g,
							(match, label): string => {

								let hash = getHash(label);
								let bg = hashToHex(hash, ...dark);
								let fg = hashToHex(hash, ...light);

								let container = createDiv();
								let span = container.createSpan({
									cls: "inline-pill",
								});
								span.style = `background-color: ${bg}; color: ${fg}`;
								span.innerText = label.toUpperCase();
								console.log(`Replacing ${label} ...`);
								console.log(span);

								return span.parentElement.innerHTML;
							}
						);

					});
				}
			}
		);
	}

	findTextNode(el: Node, search?: string): Node[] {
		let list: Node[] = [];
		if (
			el.nodeType == 3 &&
			el.textContent != "\n" &&
			el.textContent.includes(search)
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
