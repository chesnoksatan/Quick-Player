import * as Signals from 'resource:///org/gnome/shell/misc/signals.js';

import Gio from 'gi://Gio';
import Shell from 'gi://Shell';

import { MPRIS_XML } from './dbus.js';

const MprisIface = MPRIS_XML;
const MprisProxy = Gio.DBusProxy.makeProxyWrapper(MprisIface);

export class Mpris extends Signals.EventEmitter {
    constructor(address) {
        super();

        this.address = address;

        this._proxy = MprisProxy(Gio.DBus.session, this.address, "/org/mpris/MediaPlayer2", this._onProxyReady.bind(this));

        this._app = null;
    }

    _onProxyReady() {
        this._proxy.connectObject('g-properties-changed', () => this._update(), this);
        this._update();

        this._proxy.connectObject('notify::g-name-owner',
            () => {
                if (!this._proxy.g_name_owner)
                    this._close();
            }, this);

        // It is possible for the bus to disappear before the previous signal
        // is connected, so we must ensure that the bus still exists at this
        // point.
        if (!this._proxy.g_name_owner)
            this._close();
    }

    _update() {
        this.emit('changed');

        if (this.desktopEntry) {
            const desktopId = `${this.desktopEntry}.desktop`;
            this._app = Shell.AppSystem.get_default().lookup_app(desktopId);
        } else {
            this._app = null;
        }
    }

    _close() {
        this._proxy.disconnectObject(this);
        this._proxy = null;
        
        this.emit('closed');
    }

    raise() {
        if (!this.canRaise)
            return;

        this._proxy.RaiseRemote();
    }

    quit() {
        if (!this.canQuit)
            return;

        this._proxy.QuitRemote();
    }

    get app() {
        return this._app;
    }

    get canRaise() {
        return this._proxy.CanRaise;
    }

    get canQuit() {
        return this._proxy.CanQuit;
    }

    get fullscreen() {
        return this._proxy.Fullscreen;
    }

    set fullscreen(flag) {
        if (!this.canSetFullscreen)
            return;

        this._proxy.Fullscreen = flag;
    }

    get canSetFullscreen() {
        return this._proxy.CanSetFullscreen;
    }

    get hasTrackList() {
        return this._proxy.HasTrackList;
    }

    get identity() {
        return this._proxy.Identity;
    }

    get desktopEntry() {
        return this._proxy.DesktopEntry;
    }
}