import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from 'gi://Clutter';

export const ControlMenuItem = GObject.registerClass(
    class ControlMenuItem extends PopupMenu.PopupBaseMenuItem {
        _init(player) {
            super._init({
                activate: false,
                reactive: false,
                can_focus: false,
            });

            this._player = player;

            this.box = new St.BoxLayout({
                x_expand: true,
                y_expand: true,
            })
            this.add_child(this.box);

            this._loopButton = new St.Button({
                style_class: 'icon-button media-control-button',
                iconName: 'media-playlist-repeat-song-symbolic',
                y_expand: true,
            });
            this._loopButton.connect('clicked', () => this._player.toggleLoopStatus());
            this.box.add_child(this._loopButton);
            this.box.add_child(new Clutter.Actor({x_expand: true}));

            this._prevButton = new St.Button({
                style_class: 'icon-button media-control-button',
                iconName: 'media-skip-backward-symbolic',
                y_expand: true,
            });
            this._prevButton.connect('clicked', () => this._player.previous());
            this.box.add_child(this._prevButton);

            this._seekBackwardButton = new St.Button({
                style_class: 'icon-button media-control-button',
                iconName: 'skip-backwards-10-symbolic',
                y_expand: true,
            });
            this._seekBackwardButton.connect('clicked', () => this._seek(-10));
            this.box.add_child(this._seekBackwardButton);

            this._playPauseButton = new St.Button({
                style_class: 'icon-button media-control-button',
                iconName: 'media-playback-pause-symbolic',
                y_expand: true,
            });
            this._playPauseButton.connect('clicked', () => this._player.toggleState());
            this.box.add_child(this._playPauseButton);

            this._seekForwardButton = new St.Button({
                style_class: 'icon-button media-control-button',
                iconName: 'skip-forward-10-symbolic',
                y_expand: true,
            });
            this._seekForwardButton.connect('clicked', () => this._seek(10));
            this.box.add_child(this._seekForwardButton);

            this._nextButton = new St.Button({
                style_class: 'icon-button media-control-button',
                iconName: 'media-skip-forward-symbolic',
                y_expand: true,
            });
            this._nextButton.connect('clicked', () => this._player.next());
            this.box.add_child(this._nextButton);

            this._shuffleButton = new St.Button({
                style_class: 'icon-button media-control-button',
                iconName: 'media-playlist-shuffle-symbolic',
                y_expand: true,
            });
            this._shuffleButton.connect('clicked', () => this._player.toggleShuffle());
            this.box.add_child(new Clutter.Actor({x_expand: true}));
            this.box.add_child(this._shuffleButton);

            this._player.connectObject('changed', this._update.bind(this), this);
            this._update();
        }

        _updateNavButton(button, sensitive) {
            button.reactive = sensitive;
        }

        _seek(offset) {
            this._player.seek(offset * 1000000);
        }

        _update() {
            const isPlaying = this._player.status === 'Playing';
            const iconName = isPlaying
                ? 'media-playback-pause-symbolic'
                : 'media-playback-start-symbolic';
            this._playPauseButton.child.icon_name = iconName;
    
            this._updateNavButton(this._prevButton, this._player.hasPrevious);
            this._updateNavButton(this._seekBackwardButton, this._player.canSeek);
            this._updateNavButton(this._playPauseButton, this._player.canPlay || this._player.canPause);
            this._updateNavButton(this._seekForwardButton, this._player.canSeek);
            this._updateNavButton(this._nextButton, this._player.hasNext);

            if (this._player.loopStatus) {
                this._updateNavButton(this._loopButton, this._player.canControl);
                switch (this._player.loopStatus) {
                    case "None":
                        this._loopButton.set_checked(false);
                        this._loopButton.child.icon_name = "media-playlist-repeat-symbolic";
                        break;
                    case "Track":
                        this._loopButton.set_checked(true);
                        this._loopButton.child.icon_name = "media-playlist-repeat-song-symbolic";
                        break;
                    case "Playlist":
                        this._loopButton.set_checked(true);
                        this._loopButton.child.icon_name = "media-playlist-repeat-symbolic";
                        break;
                    default:
                        break;
                }
            } else {
                this._loopButton.hide();
            }

            this._updateNavButton(this._shuffleButton, this._player.canControl);
            const shuffle = this._player.shuffle
            this._shuffleButton.set_checked(shuffle);
            if (shuffle) {
                this._shuffleButton.child.icon_name = "media-playlist-shuffle-symbolic";
            } else {
                this._shuffleButton.child.icon_name = "media-playlist-no-shuffle-symbolic";
            }
        }
    }
)