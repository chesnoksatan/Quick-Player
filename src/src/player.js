import * as Signals from 'resource:///org/gnome/shell/misc/signals.js';

import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

import { MPRIS_PLAYER_XML } from './dbus.js';

const MprisPlayerIface = MPRIS_PLAYER_XML;
const MprisPlayerProxy = Gio.DBusProxy.makeProxyWrapper(MprisPlayerIface);

export class Player extends Signals.EventEmitter {
    constructor(address) {
        super();

        this.address = address;
        this._position = 0;

        this._proxy = MprisPlayerProxy(Gio.DBus.session, this.address, "/org/mpris/MediaPlayer2", this._onPlayerProxyReady.bind(this));
    }

    destroy() {}

    _onPlayerProxyReady() {
        this._proxy.connectObject('g-properties-changed', () => this._update(), this);
        this._update();
        this._updatePosition();

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

    _removeTimeout() {
		if(this._timeout) {
			GLib.Source.remove(this._timeout);
			this._timeout = null;
		}
	}

    _updatePosition() {
        if(this._timeout)
            this._removeTimeout();

        try {
            let newPosition = this._proxy.get_connection().call_sync(
                this.address,
                "/org/mpris/MediaPlayer2",
                "org.freedesktop.DBus.Properties",
                "Get",
                new GLib.Variant("(ss)", ["org.mpris.MediaPlayer2.Player", "Position"]),
                null,
                Gio.DBusCallFlags.NONE,
                50,
                null
            ).recursiveUnpack()[0];

            if (newPosition !== this._position) {
                this._position = newPosition;
                this.emit('changed');
            }
        } catch {

        }

        this._timeout = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 500, this._updatePosition.bind(this));
    }

    _close() {
        this._proxy.disconnectObject(this);
        this._proxy = null;

        this.emit('closed');
    }

    _update() {
        this.emit('changed');
    }

    next() {
        if (!this.hasNext)
            return;

        this._proxy.NextRemote();
    }

    previous() {
        if (!this.hasPrevious)
            return;

        this._proxy.PreviousRemote();
    }

    pause() {
        if (!this.canPause)
            return;

        this._proxy.PauseRemote();
    }

    toggleState() {
		if (this.canPlay && this.canPause) {
            this._proxy.PlayPauseRemote();
            return;
        }

        if (this.canPlay && this.status == "Paused") {
			this._proxy.PlayRemote();
			return
		}

		if (this.status == "Playing") {
			this._proxy.PauseRemote();
			return
		}

        this._proxy.StopRemote();
    }

    stop() {
        this._proxy.StopRemote();
    }

    play() {
        if (!this.canPlay)
            return;

        this._proxy.PlayRemote();
    }

    seek(delta) {
        if (!this.canSeek)
            return;

        this._proxy.SeekRemote(delta);
    }

    setPosition(trackId, position) {
        this._proxy.SetPositionRemote(trackId, position);
    }

    toggleLoopStatus() {
        const currentStatus = this._proxy.LoopStatus;

        if (currentStatus === "None") {
            this._proxy.LoopStatus = "Track";
        } else if (currentStatus === "Track") {
            this._proxy.LoopStatus = "Playlist";
        } else {
            this._proxy.LoopStatus = "None";
        }

        this._update();
    }

    toggleShuffle() {
        this._proxy.Shuffle = !this._proxy.Shuffle;
        this._update();
    }

    get status() {
        return this._proxy.PlaybackStatus;
    }

    get loopStatus() {
        return this._proxy.LoopStatus;
    }

    get rate() {
        return this._proxy.Rate;
    }

    get shuffle() {
        return this._proxy.Shuffle;
    }

    get volume() {
        return this._proxy.Volume;
    }

    set volume(value) {
        this._proxy.Volume = value;
    }

    get position() {
        return this._position;
    }

    get hasNext() {
        return this._proxy.CanGoNext;
    }

    get hasPrevious() {
        return this._proxy.CanGoPrevious;
    }

    get canPlay() {
        return this._proxy.CanPlay;
    }

    get canPause() {
        return this._proxy.CanPause;
    }

    get canSeek() {
        return this._proxy.CanSeek;
    }

    get canControl() {
        return this._proxy.CanControl;
    }

    // DBus Path
    get trackId() {
        const metadata = this._proxy.Metadata;

        if (!metadata)
            return undefined;

        if (metadata["mpris:trackid"]) 
            return metadata["mpris:trackid"].unpack();
    }

    get trackLength() {
        const metadata = this._proxy.Metadata;

        if (!metadata)
            return undefined;

        if (metadata["mpris:length"]) 
            return metadata["mpris:length"].unpack();
    }

    get artUrl() {
        const metadata = this._proxy.Metadata;

        if (!metadata)
            return undefined;

        if (metadata["mpris:artUrl"]) 
            return metadata["mpris:artUrl"].unpack();
    }

    get artist() {
        const metadata = this._proxy.Metadata;
        let artist = _("Unknown Artist");

        if (!metadata)
            return artist;

        if (metadata["xesam:artist"]) {
            switch (metadata["xesam:artist"].get_type_string()) {
                case 's':
                    // smplayer sends a string
                    artist = metadata["xesam:artist"].unpack();
                    break;
                case 'as':
                    // others send an array of strings
                    artist = metadata["xesam:artist"].deep_unpack().join(", ");
                    break;
                default:
                    break;
            }
        }

        return artist;
    }

    get title() {
        const metadata = this._proxy.Metadata;
        let title = _("Unknown Title");

        if (!metadata)
            return title;

        if (metadata["xesam:title"])
            title = metadata["xesam:title"].unpack();

        return title;
    }
}

// Huh?
class TrackList {
    constructor() { }

    getTracksMetadata() {}

    get tracks() {}
}