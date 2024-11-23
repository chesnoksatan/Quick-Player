import Adw from "gi://Adw"
import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
import Gdk from "gi://Gdk"

import { gettext as _ } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js"

import contributors from "../data/contributors/contributors.js"

export const AboutPage = GObject.registerClass({
    GTypeName: 'QuickPlayer.AboutPage',
}, class AboutPage extends Adw.PreferencesPage {
    constructor(metadata) {
        super({
            name: 'about',
            title: _('About'),
            iconName: 'info-symbolic'
        })

        this.metadata = metadata;

        this.add(this._getTitleGroup());
        this.add(this._getLinksGroup());
        this.add(this._getContributorsGroup());
        this.add(this._getExtensionsGroup());
        this.add(this._getLicenceGroup());
    }

    _getExtensionsGroup() {
        const group = new Adw.PreferencesGroup({
            title: 'Other Extensions',
        });

        const row = new Adw.PreferencesRow({
            activatable: false,
            selectable: false
        });
        group.add(row);

        const box = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
        });
        row.set_child(box);

        const carousel = new Adw.Carousel({
            hexpand: true,
            halign: Gtk.Align.FILL,
            margin_bottom: 16,
            spacing: 128
        });
        box.append(carousel);

        const carouselDots = new Adw.CarouselIndicatorDots({
            carousel: carousel,
        });
        box.append(carouselDots);

        carousel.append(this._buildExtensionBox(
            _('Quick Accessibility'), 
            _('Move a11y indicator from panel to quick settings menu'),
            'https://github.com/chesnoksatan/Quick-Accessibility',
            'player'
        ));

        carousel.append(this._buildExtensionBox(
            _('Quick Applications'), 
            _('Add any application toggle to quick settings menu'),
            'https://github.com/chesnoksatan/Quick-Applications',
            'player'
        ));

        return group;
    }

    _buildExtensionBox(title, subtitle, url, image) {
        const clamp = new Adw.Clamp();

        const box = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 8,
        });
        clamp.set_child(box);

        box.append(new Gtk.Image({
            icon_name: image,
            pixel_size: 128,
            css_classes: ['icon-dropshadow'],
        }));

        box.append(new Gtk.Label({
            label: title,
            css_classes: ['title-1'],
            wrap: true,
            justify: Gtk.Justification.CENTER
        }));

        box.append(new Gtk.Label({
            label: subtitle,
            css_classes: ["dim-label"],
            wrap: true,
            justify: Gtk.Justification.CENTER
        }));

        const viewButton = new Gtk.Button({
            label: _('View'),
            css_classes: ["suggested-action"],
            halign: Gtk.Align.CENTER,
        });
        box.append(viewButton);

        viewButton.connect('clicked', () => {
            Gtk.show_uri(null, url, Gdk.CURRENT_TIME);
        });

        return clamp;
    }

    _getLinksGroup() {
        const group = new Adw.PreferencesGroup({
            title: 'Links'
        });

        group.add(new LinkRow(
            'undefined', {
            title: _('Gnome Extensons'),
        }));

        group.add(new LinkRow(
            'https://github.com/chesnoksatan/Quick-Player', {
            title: _('Homepage'),
            subtitle: _('GitHub repository'),
        }));

        group.add(new LinkRow(
            'https://github.com/chesnoksatan/Quick-Player/issues', {
            title: _('Issues'),
            subtitle: _('If you find any problem, please let us know'),
        }));

        return group;
    }

    _getContributorsGroup() {
        const group = new Adw.PreferencesGroup({
            title: 'Contributors'
        });

        for (const item of contributors) {
            group.add(new Contributor(
                item.image,
                item.link, {
                title: item.name,
                subtitle: item.label,
            }));
        }

        return group;
    }

    _getLicenceGroup() {
        const group = new Adw.PreferencesGroup({
            title: 'Licence'
        });

        group.add(new LinkRow(
            'https://www.gnu.org/licenses/gpl-3.0.html', {
            title: _('GNU General Public License v3'),
        }));

        return group;
    }

    _getTitleGroup() {
        const group = new Adw.PreferencesGroup({
            title: ''
        });

        const clamp = new Adw.Clamp();
        group.add(clamp);

        const box = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            valign: Gtk.Align.START,
            spacing: 16
        });
        clamp.set_child(box);

        const logoImage = new Gtk.Image({
            icon_name: "player",
            pixel_size: 256,
            css_classes: ['icon-dropshadow'],
        });
        box.append(logoImage);

        const titleText = new Gtk.Label({
            label: _("Quick Player Extension"),
            css_classes: ['title-1'],
            vexpand: true,
            justify: Gtk.Justification.CENTER
        })
        box.append(titleText);

        const descriptionText = new Gtk.Label({
            label: _("This is a Gnome extension that allows you to add player to the quick settings menu"),
            css_classes: ["dim-label"],
            vexpand: true,
            valign: Gtk.Align.FILL,
            wrap: true,
            justify: Gtk.Justification.CENTER
        })
        box.append(descriptionText);

        const versionButton = new Gtk.Button({
            label: this.metadata.version?.toString() || _("Unknown"),
            css_classes: ["pill", "small", "success"],
            halign: Gtk.Align.CENTER,
        });
        box.append(versionButton);


        return group;
    }
})

const LinkRow = GObject.registerClass({
    GTypeName: 'QuickPlayer.LinkRow',
}, class LinkRow extends Adw.ActionRow {
    _init(url, params) {
        this.url = url;

        super._init({
            activatable: true,
            tooltip_text: this.url, 
            ...params
        });

        this.add_suffix(new Gtk.Image({
            icon_name: "adw-external-link-symbolic",
            valign: Gtk.Align.CENTER,
        }));

        this.connect('activated', () => {
            Gtk.show_uri(null, this.url, Gdk.CURRENT_TIME);
        });
    }
})

const Contributor = GObject.registerClass({
    GTypeName: 'QuickPlayer.Contributor',
}, class Contributor extends Adw.ActionRow {
    _init(avatar, url, params) {
        this.avatar = avatar;
        this.url = url;

        super._init({
            activatable: true,
            tooltip_text: this.url, 
            ...params
        });

        this.add_prefix(new Gtk.Frame({
            child: new Gtk.Image({
                icon_name: this.avatar,
                pixel_size: 42,
            }),
            valign: Gtk.Align.CENTER,
        }));

        this.add_suffix(new Gtk.Image({
            icon_name: "adw-external-link-symbolic",
            valign: Gtk.Align.CENTER,
        }));

        this.connect('activated', () => {
            Gtk.show_uri(null, this.url, Gdk.CURRENT_TIME);
        });
    }
})
