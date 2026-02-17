import { App, PluginSettingTab, Setting } from "obsidian";
import type InlinePillsPlugin from "./main";

export interface InlinePillsSettings {
	caseInsensitive: boolean;
}

export const DEFAULT_SETTINGS: InlinePillsSettings = {
	caseInsensitive: false,
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

		new Setting(containerEl)
			.setName("Case-insensitive colours")
			.setDesc("Assign the same colour to labels that differ only in case (e.g. \"todo\" and \"TODO\" will share a colour).")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.caseInsensitive)
				.onChange(async (value) => {
					this.plugin.settings.caseInsensitive = value;
					await this.plugin.saveSettings();
				})
			);
	}
}
