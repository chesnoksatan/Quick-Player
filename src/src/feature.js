import * as Main from "resource:///org/gnome/shell/ui/main.js"

import { loadInterfaceXML } from 'resource:///org/gnome/shell/misc/fileUtils.js';

import Gio from 'gi://Gio';

const DBusIface = loadInterfaceXML('org.freedesktop.DBus');
const DBusProxy = Gio.DBusProxy.makeProxyWrapper(DBusIface);

const MPRIS_PLAYER_PREFIX = 'org.mpris.MediaPlayer2.';

import { Indicator } from './indicator.js';

export class Feature {
    constructor() {
        this._indicator = new Indicator();
    }

    enable() {
        console.log("[QuickPlayerExtension]", "Enable feature");

        this.dBusProxy = DBusProxy(Gio.DBus.session, "org.freedesktop.DBus", "/org/freedesktop/DBus", this._onProxyReady.bind(this));

        let sibling = Main.panel.statusArea.quickSettings._brightness ?? null;
        Main.panel.statusArea.quickSettings._indicators.insert_child_below(this._indicator, sibling);
    }

    disable() {
        this._indicator.destroy();
    }

    _onProxyReady() {
        console.log("[QuickPlayerExtension]", "DBus Proxy is ready");

        const [names] = this.dBusProxy.ListNamesSync();

        names.forEach((busAddress) => {
            if (!busAddress.startsWith(MPRIS_PLAYER_PREFIX))
                return;

            this._add(busAddress);
        });

        this.dBusProxy.connectSignal('NameOwnerChanged', this._onNameOwnerChanged.bind(this));
    }

    _onNameOwnerChanged(proxy, sender, [name, oldOwner, newOwner]) {
        if (!name.startsWith(MPRIS_PLAYER_PREFIX))
            return;

        console.log("[QuickPlayerExtension]", "Name Owner Changed");
        console.log("[QuickPlayerExtension]", "From:", oldOwner, "To:", newOwner)

        if (newOwner && !oldOwner)
            this._add(name);
    }

    _add(busName) {
        this._indicator.addControls(busName);
    }
}
