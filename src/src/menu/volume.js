import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import { Slider } from 'resource:///org/gnome/shell/ui/slider.js';

import GObject from "gi://GObject";
import St from "gi://St";

export const VolumeMenuItem = GObject.registerClass(
    class VolumeMenuItem extends PopupMenu.PopupBaseMenuItem {
        _init(player) {
            super._init({
                activate: false,
                reactive: false,
                can_focus: false,
            });

            this._player = player;
            this._previousVolume = 0;

            this._volumeButton = new St.Button({
                child: new St.Icon({icon_name: ''}),
                style_class: 'icon-button media-control-button volume',
                can_focus: true,
                x_expand: false,
                y_expand: true,
            });

            this.slider = new Slider(0);

            this.add_child(this._volumeButton);
            this.add_child(this.slider);

            this._volumeButton.connect('clicked', this._onVolumeClicked.bind(this));
            this._sliderChangedId = this.slider.connect('notify::value', this._sliderChanged.bind(this));
            this._player.connectObject('changed', this._update.bind(this), this);
            this._update();
        }

        _onVolumeClicked() {
            if (this._player.volume <= 0) {
                if (this._previousVolume) {
                    this._changeSlider(this._previousVolume);
                } else {
                    this._changeSlider(0.5);
                }
            } else {
                this._previousVolume = this.slider.value;
                this._changeSlider(0);
            }

            this._sliderChanged()
        }

        _sliderChanged() {
            this._player.volume = this.slider.value;
        }

        _changeSlider(value) {
            this.slider.block_signal_handler(this._sliderChangedId);
            this.slider.value = value;
            this.slider.unblock_signal_handler(this._sliderChangedId);
        }
    
        _update() {
            if (!this._player.canControl) {
                this.hide();
                return;
            }

            this.show();
            this._previousVolume = this._player.value;
            this._changeSlider(this._player.volume);
            this._volumeButton.set_checked(this._player.volume <= 0);
            this._updateIcon();
        }

        _updateIcon() {
            this._volumeButton.child.icon_name = this.getIcon();
        }
    
        getIcon() {
            const volume = this._player.volume;
            
            if (volume <= 0)
                return 'audio-volume-muted-symbolic';

            if (volume > 0 && volume <= 0.33)
                return 'audio-volume-low-symbolic';

            if (volume > 0.33 && volume < 0.66)
                return 'audio-volume-medium-symbolic';

            if (volume > 0.66)
                return 'audio-volume-high-symbolic';
            
            return 'audio-volume-muted-symbolic'
        }
    }
)