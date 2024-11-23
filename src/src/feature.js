import * as Main from "resource:///org/gnome/shell/ui/main.js"

import { loadInterfaceXML } from 'resource:///org/gnome/shell/misc/fileUtils.js';

import Gio from 'gi://Gio';

const DBusIface = loadInterfaceXML('org.freedesktop.DBus');
const DBusProxy = Gio.DBusProxy.makeProxyWrapper(DBusIface);

const MPRIS_PLAYER_PREFIX = 'org.mpris.MediaPlayer2.';

import { Mpris } from './mpris.js';
import { Player } from './player.js';
import { Indicator } from './indicator.js';

export class Feature {
    constructor() {
        this.mprisList = [];
        this.playerList = [];
        this.indicatorList = [];
    }

    enable() {
        this.dBusProxy = DBusProxy(Gio.DBus.session, "org.freedesktop.DBus", "/org/freedesktop/DBus", this._onProxyReady.bind(this));
    }

    disable() {
        while(this.indicatorList.length > 0) {
            const indicator = this.indicatorList.pop();
            indicator.destroy();
        }

        while(this.mprisList.length > 0) {
            const mpris = this.mprisList.pop();
            mpris.destroy();
        }

        while(this.playerList.length > 0) {
            const player = this.playerList.pop();
            player.destroy();
        }
    }

    _onProxyReady() {
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

        if (newOwner && !oldOwner)
            this._add(name);
    }

    _add(busName) {
        const mpris = new Mpris(busName);
        const player = new Player(busName);
        const indicator = new Indicator(mpris, player);

        Main.panel.statusArea.quickSettings.addExternalIndicator(indicator, 2);

        this.mprisList.push(mpris);
        this.playerList.push(player);
        this.indicatorList.push(indicator);

        player.connectObject('closed', () => this._remove(busName));
        mpris.connectObject('closed', () => this._remove(busName));
    }

    _remove(busName) {
        for (const indicator of this.indicatorList) {
            if (indicator.mpris.address === busName) {
                indicator.destroy();
            }
        }

        for (const player of this.playerList) {
            if (player.address === busName) {
                player.destroy();
            }
        }

        for (const mpris of this.mprisList) {
            if (mpris.address === busName) {
                mpris.destroy();
            }
        }
    }
}