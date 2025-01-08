import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import {Feature} from './src/feature.js';

export default class QuickPlayerExtension extends Extension {
    enable() {
        console.log("[QuickPlayerExtension]", "Extension enabled");
        console.log("[QuickPlayerExtension]", "Start loading");

        this._feature = new Feature();
        this._feature.enable();

        console.log("[QuickPlayerExtension]", "Loaded");
    }

    disable() {
        console.log("[QuickPlayerExtension]", "Extension disabled");

        this._feature.disable();

        console.log("[QuickPlayerExtension]", "Complete disabling");
    }
}
