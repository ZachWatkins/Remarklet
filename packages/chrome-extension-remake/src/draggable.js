/**
 * Remarklet - A visual editor application that makes modifying and commenting on web pages remarkably easy!
 *
 * @package     ZachWatkins\Remarklet
 * @description A visual editor application that makes modifying and commenting on web pages remarkably easy!
 * @author      Zachary Kendall Watkins <zwatkins.it@gmail.com> (https://github.com/zachwatkins)
 * @copyright   Zachary Kendall Watkins all versions Copyright (c) 2024 All Rights Reserved.
 * @link        https://github.com/zachwatkins/remarklet
 * @license     https://spdx.org/licenses/MIT.html MIT License
 */
import * as $jq from './jquery-ui-1.13.2.custom/external/jquery/jquery.js';
import * as $ui from './jquery-ui-1.13.2.custom/jquery-ui.js';

export function createRemarklet() {
    var $ = window.jQuery;
    var stylesheet, duplicate, prompt, storedobject;
    var remarklet = {};
    var _getBlobURL =
        (window.URL && URL.createObjectURL.bind(URL)) ||
        (window.webkitURL && webkitURL.createObjectURL.bind(webkitURL)) ||
        window.createObjectURL;
    var $w = $(window);
    var $b = $('body');
    var _target;
    var _texttarget = false;
    var _mode = 'drag';
    var _dragging = false;
    var _typingTimer = false;
    var _stored = {
        clipboard: null,
        pageSavedState: '',
        fileRead: false,
        editcounter: 0,
        userid: 1,
    };
    var controllers = {
        bodyElements: {
            /* Event delegation for visible, non-app elements. */
            mouseover: function (e) {
                if (_dragging) return;
                var $this = $(this).addClass('remarklet-target');
                _target = $this;
                switch (_mode) {
                    case 'drag':
                        if (
                            this.className.search(/ui-(resizable|wrapper)/) < 0
                        ) {
                            $this.draggable(dragOps);
                        }
                        break;
                    case 'text':
                        $this.attr('contenteditable', 'true');
                        break;
                    default:
                        break;
                }
                /* Provide the target's CSS selector in the User CSS window. */
                var selector = this.tagName.toLowerCase();
                if ($this.attr('id') !== undefined) {
                    selector += '#';
                    selector += this.id;
                }
                selector += '.';
                selector += $this
                    .attr('class')
                    .replace(
                        /\s?\b(remarklet\s|ui-draggable(-handle)?|remarklet-target)\b\s?/g,
                        ' ',
                    )
                    .trim()
                    .replace(/\s+/g, '.');
                views.csswindow.attr('data-remarklet-selector', selector);
                e.stopPropagation();
            },
            mouseout: function (e) {
                if (_dragging) return;
                var $this = $(this).removeClass('remarklet-target');
                $('.ui-draggable').draggable('destroy');
                if (_mode == 'text') {
                    $this.removeAttr('contenteditable');
                }
                e.stopPropagation();
            },
            mousedown: function (e) {
                if (e.which != 1) return;
                _target = $(this);
                if (_mode == 'text') _texttarget = $(this);
                e.stopPropagation();
            },
            click: function (e) {
                if (this.tagName == 'A') {
                    e.preventDefault();
                }
            },
            mousemove: function (e) {
                _mouse.update(e);
            },
            toggle: function (state) {
                var name;
                if (state == 'on') {
                    for (name in controllers.bodyElements) {
                        if (name != 'toggle') {
                            $b.on(
                                name,
                                '.remarklet',
                                controllers.bodyElements[name],
                            );
                        }
                    }
                } else {
                    for (name in controllers.bodyElements) {
                        if (name != 'toggle') {
                            $b.off(
                                name,
                                '.remarklet',
                                controllers.bodyElements[name],
                            );
                        }
                    }
                }
            },
        },
        window: function (e) {
            /* Window keyboard shortcuts */
            if (e.target.id.indexOf('remarklet') >= 0) return;
            if (_mode == 'drag') {
                switch (e.keyCode) {
                    case 86 /*V*/:
                        if (e.ctrlKey) {
                            _stored.editcounter++;
                            if (_stored.clipboard.draggable('instance')) {
                                _stored.clipboard.draggable('destroy');
                            }
                            var original = _stored.clipboard
                                .removeClass('remarklet-target')
                                .get(0);
                            var dupe = duplicate.create(original, original, {
                                id: '',
                                class:
                                    'remarklet remarklet-' +
                                    _stored.editcounter,
                            });
                            var offset = findElementOffset(original);
                            $(dupe).css({
                                position: 'absolute',
                                left: offset.left + 10,
                                top: offset.top + 10,
                            });
                            views.csstextarea.val(stylesheet.getString());
                        }
                        break;
                    case 13 /*Enter*/:
                        if (
                            e.ctrlKey &&
                            $('.remarklet.ui-resizable').length > 0
                        ) {
                            var $target = $('.remarklet.ui-resizable');
                            $target.resizable('destroy');
                            if ($target.attr('style')) {
                                var style = $target
                                    .attr('style')
                                    .replace(
                                        /(resize|position|right|bottom): (auto|none|static);\s?/g,
                                        '',
                                    )
                                    .replace(/(-?\d+)\.\d+px/g, '$1px');
                                controllers.finishChangingElement(
                                    $target,
                                    style,
                                    true,
                                );
                            }
                            controllers.switchmode('drag');
                        }
                        break;
                    case 46 /*Del*/:
                        _target.remove();
                        break;
                    case 37 /* Left Arrow */:
                        if (!e.ctrlKey) {
                            _target.css('left', '-=1');
                        } else {
                            _target.css('left', '-=10');
                        }
                        e.preventDefault();
                        break;
                    case 38 /* Up Arrow */:
                        if (!e.ctrlKey) {
                            _target.css('top', '-=1');
                        } else {
                            _target.css('top', '-=10');
                        }
                        e.preventDefault();
                        break;
                    case 39 /* Right Arrow */:
                        if (!e.ctrlKey) {
                            _target.css('left', '+=1');
                        } else {
                            _target.css('left', '+=10');
                        }
                        e.preventDefault();
                        break;
                    case 40 /* Down Arrow */:
                        if (!e.ctrlKey) {
                            _target.css('top', '+=1');
                        } else {
                            _target.css('top', '+=10');
                        }
                        e.preventDefault();
                        break;
                    default:
                        break;
                }
            } else {
                switch (e.keyCode) {
                    case 86 /*V*/:
                        if (!_texttarget) {
                            controllers.switchmode('drag');
                            e.preventDefault();
                        }
                        break;
                    case 13 /*Enter*/:
                        if (e.ctrlKey) {
                            controllers.switchmode('drag');
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        break;
                    default:
                        break;
                }
            }
        },
        updateUserCSS: function () {
            stylesheet.setString(views.csstextarea.val());
        },
        updateUserCSSUI: function () {
            views.csstextarea.val(stylesheet.getString());
        },
        switchmode: function () {
                _target.draggable(dragOps);
        },
        finishChangingElement: function ($el, style, remove) {
            // Remove fractional pixel values.
            style = style.replace(/(-?\d+)\.\d+px/g, '$1px');
            stylesheet.setRule(
                '.' + $el.attr('class').match(/remarklet-[0-9]+/),
                style,
            );
            controllers.updateUserCSSUI();
            if (remove) {
                $el.removeAttr('style');
            }
        },
    };
    var dragOps = {
        start: function (event, ui) {
            _dragging = true;
            _target = $(event.target);
            $b.off('mousemove', _mouse.update);
        },
        stop: function (event, ui) {
            var $target = $(event.target),
                style = $target
                    .attr('style')
                    .replace(/(right|bottom): auto;\s?/g, ''),
                removeStyle = false;
            _dragging = false;
            _mouse.update(event);
            $b.on('mousemove', _mouse.update);
            if ($target.resizable('instance') !== undefined) {
                style = style.replace(/\s?overflow: hidden;\s?/, ' ');
            } else {
                removeStyle = true;
            }
            controllers.finishChangingElement($target, style, true);
        },
    };
    var resizeOps = {
        start: function (event, ui) {
            _target = $(event.target);
            $b.off('mousemove', _mouse.update);
            $('.ui-wrapper').each(function () {
                if (this != event.target) {
                    var style = this.style.cssText.replace(
                            /\s?overflow: hidden;\s?/,
                            ' ',
                        ),
                        $target = $(this);
                    controllers.finishChangingElement($target, style, false);
                    $target.resizable('destroy');
                }
            });
        },
        stop: function (event, ui) {
            var $target = $(event.target),
                style = $target
                    .attr('style')
                    .replace(/(right|bottom): auto;\s?/g, ''),
                removeStyle = false;
            _dragging = false;
            _mouse.update(event);
            $b.on('mousemove', _mouse.update);
            if ($target.resizable('instance') !== undefined) {
                style = style.replace(/\s?overflow: hidden;\s?/, ' ');
            } else {
                removeStyle = true;
            }
            controllers.finishChangingElement($target, style, true);
        },
    };
    var _mouse = {
        x: null,
        y: null,
        update: function (e) {
            _mouse.x = e.pageX - views.box.offset().left;
            _mouse.y = e.pageY;
        },
    };
    remarklet.init = function () {
        /* Tag all non-app page elements we may want to interact with. */
        var last = 0;
        $('.remarklet').each(function () {
            var num = parseInt(this.className.match(/remarklet-([0-9]+)/)[1]);
            if (num > last) {
                last = num;
            }
        });
        $b.find('*')
            .not(':hidden')
            .not('.remarklet')
            .each(function (index, item) {
                last++;
                var num = last;
                item.classList.add('remarklet');
                item.classList.add('remarklet-' + num);
            });
        _stored.editcounter = last;

        /* Initialize modules. */
        var cssOptions = {
            element: views.usercss.get(0),
            indent: _stored.preferences.CSS_Editor.Indentation,
        };
        stylesheet = createStylesheet(cssOptions);
        duplicate = createDuplicate(stylesheet, cssOptions, {
            tag: false,
            id: false,
            classname: '.remarklet-[0-9]+',
        });

        /* Event delegation for non-app elements. */
        controllers.bodyElements.toggle('on');
    };
    remarklet.init();
    return remarklet;
}

export default { createRemarklet };
