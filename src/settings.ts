import { App, PluginSettingTab } from "obsidian";
import type InlinePillsPlugin from "./main";

export interface InlinePillsSettings {
	// Settings will be added here
}

export const DEFAULT_SETTINGS: InlinePillsSettings = {
	// Defaults will be added here
};

export class InlinePillsSettingTab extends PluginSettingTab {
	plugin: InlinePillsPlugin;

	constructor(app: App, plugin: InlinePillsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		// Settings controls will be added here
	}
}
