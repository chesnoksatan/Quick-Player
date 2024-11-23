import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import { Slider } from 'resource:///org/gnome/shell/ui/slider.js';

import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from 'gi://Clutter';

export const ProgressMenuItem = GObject.registerClass(
    class ProgressMenuItem extends PopupMenu.PopupBaseMenuItem {
        _init(player) {
            super._init({
                activate: false,
                reactive: false,
                can_focus: false,
            });
            this.set_vertical(true);

            this._player = player;

            this.slider = new Slider(0);
            this.add_child(this.slider);

            let infoBox = new St.BoxLayout({
                y_align: Clutter.ActorAlign.CENTER,
                x_expand: true,
            });
            this.add_child(infoBox);

            this.positionLabel = new St.Label({
                y_align: Clutter.ActorAlign.CENTER,
                x_expand: true,
                text: this._formatTime(0),
            });
            infoBox.add_child(this.positionLabel)
            infoBox.add_child(new Clutter.Actor({x_expand: true}))

            this.lengthLabel = new St.Label({
                y_align: Clutter.ActorAlign.CENTER,
                text: this._formatTime(0),
            });
            infoBox.add_child(this.lengthLabel)

            this._sliderChangedId = this.slider.connect('notify::value', this._sliderChanged.bind(this));
            this._player.connectObject('changed', this._update.bind(this), this);
            this._update();
        }

        _sliderChanged() {
            this._player.setPosition(this._player.trackId, (this.slider.value * 100 * this._player.trackLength) / 100);
        }

        _changeSlider(value) {
            this.slider.block_signal_handler(this._sliderChangedId);
            this.slider.value = value;
            this.slider.unblock_signal_handler(this._sliderChangedId);
        }
    
        _update() {
            const trackLength = this._player.trackLength;
            const position = this._player.position;

            if (position && trackLength) {
                this._changeSlider(((position * 100.0) / trackLength) / 100);
                this.show();

                this.positionLabel.clutter_text.set_markup(this._formatTime(position));
                this.lengthLabel.clutter_text.set_markup(this._formatTime(trackLength));
            } else {
                this.hide();
            }
        }

        _formatTime(value) {
            let text = new Date(0);
            text.setUTCSeconds(value / 1000000);
            return text.toISOString().substring(11,19).replace(/^0(?:0:0?)?/, '');
        }
    }
)