import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import Gio from 'gi://Gio';
import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from 'gi://Clutter';

export const CoverMenuItem = GObject.registerClass(
    class CoverMenuItem extends PopupMenu.PopupBaseMenuItem {
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
                x_align: Clutter.ActorAlign.CENTER,
            })
            this.add_child(this.box);

            this._icon = new St.Icon({
				style_class: 'media-icon',
				icon_size: 192,
                x_expand: true,
                y_expand: true,
			})

            this.box.add_child(this._icon);      

            this._player.connectObject('changed', this._update.bind(this), this);
            this._update();
        }

        _update() {
            let icon;
            if (this._player.artUrl) {
                const file = Gio.File.new_for_uri(this._player.artUrl);
                icon = new Gio.FileIcon({file});
            } else {
                icon = new Gio.ThemedIcon({name: 'audio-x-generic-symbolic'});
            }

            this._icon.gicon = icon;
            this._icon.visible = !!icon;
        }
    }
)