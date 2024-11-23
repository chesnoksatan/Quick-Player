import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import {Feature} from './src/feature.js';

export default class QuickPlayerExtension extends Extension {
    enable() {
        console.debug("[QuickPlayerExtension]", "Extension enabled");
        console.debug("[QuickPlayerExtension]", "Start loading");

        this._feature = new Feature();
        this._feature.enable();

        console.debug("[QuickPlayerExtension]", "Loaded");
    }

    disable() {
        console.debug("[QuickPlayerExtension]", "Extension disabled");

        this._feature.disable();

        console.debug("[QuickPlayerExtension]", "Complete disabling");
    }
}
