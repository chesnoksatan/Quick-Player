import * as Main from "resource:///org/gnome/shell/ui/main.js"

import { QuickSettingsItem, SystemIndicator } from 'resource:///org/gnome/shell/ui/quickSettings.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import Gio from 'gi://Gio';
import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from 'gi://Clutter';
import Pango from 'gi://Pango';

import { CoverMenuItem  } from "./menu/cover.js";
import { VolumeMenuItem } from "./menu/volume.js";
import { ProgressMenuItem } from "./menu/progress.js";
import { ControlMenuItem } from "./menu/conrols.js"; 

export const Indicator = GObject.registerClass(
    class Indicator extends SystemIndicator {
        _init(mpris, player) {
            super._init();

            this.player = player;
            this.mpris = mpris;

            this._indicator = this._addIndicator();
            this._indicator.icon_name = 'audio-x-generic-symbolic';

            this._toggle = new MediaControls(this.mpris, this.player);
            this._toggle.connect("clicked", () => this.mpris.raise());

            this.quickSettingsItems.push(this._toggle);
        }

        destroy() {
            this.quickSettingsItems.forEach(item => item.destroy());
            this._indicator.destroy();
            super.destroy();
        }

        addControls(mpris, player) {

        }
    }
)

const MediaControls = GObject.registerClass(
    class MediaControls extends QuickSettingsItem {
        _init(mpris, player) {
            super._init({
                hasMenu: true,
                style_class: 'message media',
            });

            this._player = player;
            this._mpris = mpris;

            this.set_child(new St.BoxLayout({
                style_class: 'media-controls-box',
                y_expand: true,
            }));

            this._icon = new St.Icon({
                style_class: 'media-icon-small',
                y_expand: true,
                visible: true,
                icon_size: 72,
            });
            this.child.add_child(this._icon);

            const contentBox = new St.BoxLayout({
                vertical: true,
                x_expand: true,
            });
            this.child.add_child(contentBox);

            const baseBox = new St.BoxLayout();
            contentBox.add_child(baseBox);

            let messageBox = new St.BoxLayout({
                x_align: Clutter.ActorAlign.START,
                vertical: true,
            });
            baseBox.add_child(messageBox);
            baseBox.add_child(new Clutter.Actor({x_expand: true}))

            this.titleLabel = new St.Label({
                style_class: 'media-message-title',
                x_align: Clutter.ActorAlign.START,
            });
            this.titleLabel.clutter_text.set_line_wrap(true);
            this.titleLabel.clutter_text.ellipsize = Pango.EllipsizeMode.END;

            this.artistLabel = new St.Label({
                style_class: 'media-message-artist',
                x_align: Clutter.ActorAlign.START,
            });
            this.artistLabel.clutter_text.ellipsize = Pango.EllipsizeMode.END;

            messageBox.add_child(this.titleLabel);
            messageBox.add_child(this.artistLabel);

            this._menuButton = new St.Button({
                iconName: 'pan-down-symbolic',
                style_class: 'icon-button media-menu-button',
                y_align: Clutter.ActorAlign.START,
            });
            this._menuButton.connect("clicked", () => this.menu.open())
            baseBox.add_child(this._menuButton);

            let controlBox = new St.BoxLayout({
                style_class: 'media-control-box',
                x_expand: true,
                y_expand: true,
                x_align: Clutter.ActorAlign.CENTER,
            })

            this._prevButton = new St.Button({
                iconName: 'media-skip-backward-symbolic',
                style_class: 'icon-button media-control-button',
                y_expand: true,
            });
            this._prevButton.connect('clicked', () => this._player.previous());
            controlBox.add_child(this._prevButton);

            this._playPauseButton = new St.Button({
                iconName: 'media-playback-pause-symbolic',
                style_class: 'icon-button media-control-button',
                y_expand: true,
            });
            this._playPauseButton.connect('clicked', () => this._player.toggleState());
            controlBox.add_child(this._playPauseButton);

            this._nextButton = new St.Button({
                iconName: 'media-skip-forward-symbolic',
                style_class: 'icon-button media-control-button',
                y_expand: true,
            });
            this._nextButton.connect('clicked', () => this._player.next());
            controlBox.add_child(this._nextButton);

            contentBox.add_child(controlBox)

            this.menu.addMenuItem(new PopupMenu.PopupMenuSection());
            this.menu.setHeader("music-note-single-symbolic", "", "");

            const sourceIconEffect = new Clutter.DesaturateEffect();
            this.sourceIcon = new St.Icon({
                style_class: 'message-source-icon',
                y_align: Clutter.ActorAlign.CENTER,
                fallback_icon_name: 'application-x-executable-symbolic',
            });
            this.sourceIcon.add_effect(sourceIconEffect);
    
            this.sourceIcon.connect('style-changed', () => {
                const themeNode = this.sourceIcon.get_theme_node();
                sourceIconEffect.enabled = themeNode.get_icon_style() === St.IconStyle.SYMBOLIC;
            });

            this._appButton = new St.Button({
                style_class: 'icon-button media-menu-button',
                x_align: Clutter.ActorAlign.END,
                child: this.sourceIcon
            })
            this._appendSuffix(this._appButton);

            this.menu.addMenuItem(new CoverMenuItem(this._player));
            this.menu.addMenuItem(new ProgressMenuItem(this._player));
            this.menu.addMenuItem(new ControlMenuItem(this._player));
            this.menu.addMenuItem(new VolumeMenuItem(this._player));

            this.connect("clicked", this._clicked.bind(this));
            this._appButton.connect("clicked", this._clicked.bind(this));
            this._mpris.connectObject('changed', this._updateMpris.bind(this), this);
            this._player.connectObject('changed', this._updatePlayer.bind(this), this);
            this._updateMpris();
            this._updatePlayer();
        }

        // HACK: addHeaderSuffix function insert spacer after suffix, so we need manually place suffix after spacer
        _appendSuffix(actor) {
            const {layoutManager: headerLayout} = this.menu._header;
            const side = this.menu.actor.text_direction === Clutter.TextDirection.RTL
                ? Clutter.GridPosition.LEFT
                : Clutter.GridPosition.RIGHT;
            headerLayout.attach_next_to(actor, this.menu._headerSpacer, side, 1, 1);
        }

        _clicked() {
            if (this._mpris.canRaise) {
                Main.panel.closeQuickSettings();
                this._mpris.raise();
            }
        }
    
        _updateNavButton(button, sensitive) {
            button.reactive = sensitive;
        }

        _updateMpris() {}

        _updatePlayer() {
            if (!this._player || !this._mpris)
                return;

            let icon;
            if (this._player.artUrl) {
                const file = Gio.File.new_for_uri(this._player.artUrl);
                icon = new Gio.FileIcon({file});
            } else {
                icon = new Gio.ThemedIcon({name: 'audio-x-generic-symbolic'});
            }

            let title = this._player.title;
            let artist = this._player.artist;

            this.titleLabel.clutter_text.set_markup(title);
            this.artistLabel.clutter_text.set_markup(artist);
            this.menu.setHeader("audio-x-generic-symbolic", title, artist);

            this.sourceIcon.gicon = this._mpris.app?.get_icon() ?? null

            this._icon.gicon = icon;
            this._icon.visible = !!icon;
    
            let isPlaying = this._player.status === 'Playing';
            let iconName = isPlaying
                ? 'media-playback-pause-symbolic'
                : 'media-playback-start-symbolic';
            this._playPauseButton.child.icon_name = iconName;
    
            this._updateNavButton(this._prevButton, this._player.hasPrevious);
            this._updateNavButton(this._playPauseButton, this._player.canPlay || this._player.canPause);
            this._updateNavButton(this._nextButton, this._player.hasNext);
            this._updateNavButton(this._appButton, this._mpris.canRaise);
        }
    }
)