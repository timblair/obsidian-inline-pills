export const PILL_DARK: [number, number] = [0.5, 0.35];
export const PILL_LIGHT: [number, number] = [0.9, 0.9];
export const PILL_PATTERN = /\{\{([^}]+)\}\}/g;

export function mod(n: number, m: number): number {
	return ((n % m) + m) % m;
}

export function hashToHsl(hash: number, saturation: number, lightness: number): [number, number, number] {
	return [mod(hash * 137, 360), saturation, lightness];
}

export function getHash(str: string): number {
	let hash = 0;
	if (!str) return Math.random();
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return hash;
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h is contained in the set [0, 360], while s and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 */
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
	h = h / 360;

	if (s === 0) {
		const v = Math.round(l * 255);
		return [v, v, v];
	}

	const hue2rgb = (p: number, q: number, t: number): number => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};

	const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;

	return [
		Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
		Math.round(hue2rgb(p, q, h) * 255),
		Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
	];
}

export function componentToHex(c: number): string {
	const hex = c.toString(16);
	return hex.length === 1 ? "0" + hex : hex;
}

export function rgbToHex(r: number, g: number, b: number): string {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hashToHex(hash: number, saturation: number, lightness: number): string {
	const hsl = hashToHsl(hash, saturation, lightness);
	const rgb = hslToRgb(...hsl);
	return rgbToHex(...rgb);
}

export function createPillElement(label: string, caseInsensitive: boolean): HTMLElement {
	const hashKey = caseInsensitive ? label.toUpperCase() : label;
	const hash = getHash(hashKey);
	const span = document.createElement("span");
	span.className = "inline-pill";
	span.style.backgroundColor = hashToHex(hash, ...PILL_DARK);
	span.style.color = hashToHex(hash, ...PILL_LIGHT);
	span.textContent = label.toUpperCase();
	return span;
}
