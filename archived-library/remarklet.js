/**
 * Remarklet - A visual editor application that makes modifying and commenting on web pages remarkably easy!
 *
 * @package     ZachWatkins\Remarklet
 * @description A visual editor application that makes modifying and commenting on web pages remarkably easy!
 * @author      Zachary Kendall Watkins <zwatkins.it@gmail.com> (https://github.com/zachwatkins)
 * @copyright   Zachary Kendall Watkins all versions Copyright (c) 2021 All Rights Reserved.
 * @link        https://github.com/zachwatkins/remarklet
 * @license     https://spdx.org/licenses/MIT.html MIT License
 */
import './remarklet.scss';
import * as $jq from './jquery-ui-1.13.2.custom/external/jquery/jquery.js';
import * as $ui from './jquery-ui-1.13.2.custom/jquery-ui.js';
import * as $ri from './rangyinputs.js';
import { findElementOffset } from './utils.js';
import { createStylesheet } from './stylesheet.js';
import { createDuplicate } from './duplicate.js';
import { createPrompt } from './prompt.js';
import { createStoredObject } from './storedobject.js';

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
        preferences: {
            'Grid': {
                'Size': '100px',
                'Division': '5',
                'Background': 'transparent',
                'Lines': '#fff',
            },
            'CSS_Editor': {
                'Indentation': '    ',
                'Font Size': '12pt',
            },
            'Export': {
                'Disable Javascript': '1',
                'Show Browser Info': '0',
                'Require Absolute URLs': '0',
            },
            'Extra_Features': '0',
        },
    };
    var menu = {
        File: { Export: 1, Save: 1, Restore: 1 },
        View: { Grid: 1, Outlines: 1, CSS: 1 },
        Insert: { Image: 1, Note: 1, HTML: 1 },
        Help: 1,
        /* Edit */
    };
    var views = {
        menuwrapper: $('<div id="remarklet-menu"></div>'),
        csswindow: $(
            '<div id="remarklet-ui-usercss" class="remarklet-dont-edit"></div>',
        ),
        csstextarea: $(
            '<textarea name="remarklet-usercss-editor" id="remarklet-usercss-editor" class="emmet emmet-syntax-css"></textarea>',
        ),
        newimageform: $(
            '<label>Make a placeholder</label><input type="text" value="300x200" id="remarklet-imgdimensions" name="imgdimensions" autofocus="autofocus"> <input type="text" value="#cccccc" id="remarklet-bgcolor" name="bgcolor"> <input type="text" value="#000000" id="remarklet-textcolor" name="textcolor"> <input type="text" value="Image (300x200)" id="remarklet-text" name="imgtext"><br /><label>Enter image url</label><input name="imgurl" id="remarklet-url" type="text" value="http://placehold.it/"><br><label>Add local image <span title="This image will be converted to a Data URI." class="remarklet-hovernote">?</span></label><input name="file" id="remarklet-file" type="file"/>',
        ),
        newnoteform: $(
            '<label>Enter note text</label><textarea name="notetext" id="remarklet-text" type="text" autofocus="autofocus" cols="48" rows="13">Enter your note\'s text here.</textarea>',
        ),
        newhtmlform: $(
            '<label>Enter HTML</label><textarea name="remarkletinserthtml" id="remarklet-text" class="emmet emmet-syntax-html" type="text" autofocus="autofocus" cols="48" rows="13">Enter your code here.</textarea>',
        ),
        /*preferences: $('<div id="remarklet-ui-preferences" class="remarklet-dont-resize remarklet-dont-edit"></div>'),*/
        help: $(
            '<div id="remarklet-ui-help"><div>Helpful Hints For Using <a target="_blank" onclick="event.stopPropagation();" href="https://remarklet.com">Remarklet</a><div><p>Thanks for using this bookmarklet! Here are some tips to help you get the most out of it:</p><p>Drag elements around with your mouse by holding down the left mouse button while your cursor is hovered over an element and then moving it around. The new position of the element is added to the User CSS stylesheet, which you can access directly from the menu under View => CSS. This CSS editor is equipped with some shortcuts of its own, similar to Emmet. Hold the ctrl key and press the up or down arrows while your cursor is near a number to increase or decrease that number by 1. Press the tab key immediately after writing a CSS property to insert ": " and get to writing the value a little quicker.</p><div>Drag Mode Shortcuts<ol><li>Text Mode: <span title="T key" class="key">T</span></li><li>Drag Mode: <span title="V key" class="key">V</span></li><li>Resize Element: <span title="Ctrl key" class="key">Ctrl</span> + <span title="Alt key" class="key">Alt</span> + <span title="T key" class="key">T</span></li><li>Finish Resizing Element: <span class="key" title="Ctrl key">Ctrl</span> + <span title="Enter key" class="key">Enter</span></li><li>Nudge Element: (<span title="Control key" class="key">Ctrl</span>) <span title="Arrow keys" class="key">&larr;</span>,<span title="Arrow keys" class="key">&uarr;</span>,<span title="Arrow keys" class="key">&rarr;</span>,<span title="Arrow keys" class="key">&darr;</span></li><li>Delete Element: <span title="Delete key" class="key">Delete</span></li></ol></div><div>Text Mode Shortcuts<ol><li>Return to Drag Mode: <span title="Ctrl key" class="key">Ctrl</span> + <span title="Enter key" class="key">Enter</span></li></ol></div></div></div></div>',
        ),
        gridoverlay: $('<div id="remarklet-grid"></div>'),
        usercss:
            $('#remarklet-usercss').length === 0
                ? $('<style id="remarklet-usercss" type="text/css"></style>')
                : $('#remarklet-usercss'),
        box:
            $('#remarklet-box').length === 0
                ? $('<div id="remarklet-box"></div>')
                : $('#remarklet-box'),
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
                    case 67 /*C*/:
                        if (e.ctrlKey) {
                            _stored.clipboard = _target;
                        }
                        break;
                    case 84 /*T*/:
                        if (!e.ctrlKey) {
                            controllers.switchmode('text');
                            e.preventDefault();
                        } else if (e.altKey) {
                            $('.ui-resizable,.ui-wrapper').each(function () {
                                var $this = $(this);
                                if ($this.resizable('instance') !== undefined) {
                                    $this
                                        .trigger('resizestop')
                                        .resizable('destroy');
                                }
                            });
                            _target.resizable(resizeOps);
                        }
                        break;
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
        userCSSEditorKeyHandler: function (e) {
            e.stopPropagation();
            var keys = { 9: 1, 13: 1, 38: 1, 40: 1, 219: 1, 222: 1 };
            if (keys[e.keyCode]) {
                var $t = views.csstextarea,
                    selection = $t.getSelection(),
                    lastchar = $t.val().charAt(selection.start - 1),
                    val = $t.val(),
                    nextchar = val.charAt(selection.start),
                    num,
                    index,
                    min,
                    max,
                    addtext;
                switch (e.keyCode) {
                    case 9 /* Tab, insert indentation or css property */:
                        if (selection.length === 0) {
                            e.preventDefault();
                            if (lastchar.match(/\w/)) {
                                $t.insertText(
                                    ': ',
                                    selection.start,
                                    'collapseToEnd',
                                );
                            } else {
                                $t.insertText(
                                    _stored.preferences.CSS_Editor.Indentation,
                                    selection.start,
                                    'collapseToEnd',
                                );
                            }
                        }
                        break;
                    case 13 /* Enter, Insert indentation when pressing Enter after ; or { */:
                        if (selection.length === 0 && lastchar.match(/;|{/)) {
                            e.preventDefault();
                            addtext =
                                '\n' +
                                _stored.preferences.CSS_Editor.Indentation;
                            $t.insertText(
                                addtext,
                                selection.start,
                                'collapseToEnd',
                            );
                            if (lastchar == '{' && nextchar == '}') {
                                addtext = '\n';
                                $t.insertText(
                                    addtext,
                                    selection.start +
                                        _stored.preferences.CSS_Editor
                                            .Indentation.length +
                                        1,
                                    'collapseToStart',
                                );
                            }
                        }
                        break;
                    case 38 /* Up arrow key to increment numbers */:
                        if (e.ctrlKey) {
                            num = [];
                            index = selection.start;
                            if (
                                val.charAt(selection.start - 1).match(/\d/) ||
                                val.charAt(selection.start).match(/\d/)
                            ) {
                                while (val.charAt(index - 1).match(/\d/)) {
                                    index--;
                                }
                                min = index;
                                while (val.charAt(index).match(/\d/)) {
                                    num.push(val.charAt(index));
                                    index++;
                                }
                                max = index - 1;
                                num = parseInt(num.join('')) + 1;
                                $t.setSelection(min, max + 1)
                                    .replaceSelectedText(num, 'select')
                                    .setSelection(min, max + 1);
                                e.preventDefault();
                            }
                        }
                        break;
                    case 40 /* Down arrow key to decrement numbers */:
                        if (e.ctrlKey) {
                            num = [];
                            index = selection.start;
                            if (
                                val.charAt(selection.start - 1).match(/\d/) ||
                                val.charAt(selection.start).match(/\d/)
                            ) {
                                while (val.charAt(index - 1).match(/\d/)) {
                                    index--;
                                }
                                min = index;
                                while (val.charAt(index).match(/\d/)) {
                                    num.push(val.charAt(index));
                                    index++;
                                }
                                max = index - 1;
                                num = parseInt(num.join('')) - 1;
                                $t.setSelection(min, max + 1)
                                    .replaceSelectedText(num, 'select')
                                    .setSelection(min, max + 1);
                                e.preventDefault();
                            }
                        }
                        break;
                    case 219 /* {, Finish rule */:
                        if (
                            e.shiftKey &&
                            (nextchar === '' || nextchar.match(/\n/))
                        ) {
                            $t.insertText(
                                '}',
                                selection.start,
                                'collapseToStart',
                            );
                        }
                        break;
                    default:
                        break;
                }
            }
            if (_typingTimer !== false) {
                window.clearTimeout(_typingTimer);
            }
            _typingTimer = window.setTimeout(function () {
                views.csstextarea.trigger('stoptyping');
                _typingTimer = false;
            }, 500);
        },
        updateUserCSS: function () {
            stylesheet.setString(views.csstextarea.val());
        },
        updateUserCSSUI: function () {
            views.csstextarea.val(stylesheet.getString());
        },
        switchmode: function (newmode) {
            $b.removeClass('remarklet-' + _mode + 'mode').addClass(
                'remarklet-' + newmode + 'mode',
            );
            _mode = newmode;
            if (newmode == 'drag') {
                $b.find('*[contenteditable]').removeAttr('contenteditable');
                _texttarget = false;
                _target.draggable(dragOps);
                /* HACK: Disabling content edit-ability on an element does not remove the cursor from that element in all browsers, so we create a temporary element to focus on and then remove it. */
                $(
                    '<input type="text" style="width:1px;height:1px;background-color:transparent;border:0 none;opacity:0;position:fixed;top:0;left:0;" />',
                )
                    .appendTo($b)
                    .focus()
                    .blur()
                    .remove();
            } else if (newmode == 'text') {
                if (_target !== undefined) {
                    _target.attr('contenteditable', 'true');
                }
                $('.ui-draggable').draggable('destroy');
            }
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
    /* Get remarklet
	/* Define commands that the user can execute */
    var command = {
        File: {
            Export: function () {
                var data = 'data:text/html;charset=UTF-8,',
                    pathpart = location.pathname.split('/'),
                    html;
                views.usercss.html(stylesheet.getString());
                pathpart.pop();
                pathpart = pathpart.join('/');
                if (document.doctype && document.doctype.publicId === '') {
                    html = '<!DOCTYPE html>';
                } else {
                    if (document.doctype) {
                        html = '<!DOCTYPE ';
                        html += document.doctype.name.toUpperCase();
                        html += ' PUBLIC "';
                        html += document.doctype.publicId;
                        html += '" "';
                        html += document.doctype.systemId;
                        html += '">';
                    } else {
                        html = document.all[0].text;
                    }
                }
                html += document.documentElement.outerHTML;
                $(
                    'script[src*="remarklet.com/rm/scripts"],link[href*="remarklet.com/rm/scripts"]',
                )
                    .add(views.retained)
                    .each(function () {
                        html = html.replace(this.outerHTML, '');
                    });
                html = html
                    .replace(
                        /.overflowRulerX > .firebug[^{]+{[^}]+}|.overflowRulerY\s>\s.firebug[^{]+{[^}]+}/gi,
                        '',
                    )
                    .replace(
                        /(src|href)=("|')\/\//g,
                        '$1=$2' + location.protocol,
                    )
                    .replace(
                        /(src|href)=("|')(\/|(?=[^:]{6}))/gi,
                        '$1=$2' +
                            location.protocol +
                            '//' +
                            location.hostname +
                            pathpart +
                            '/',
                    )
                    .replace(/<script/gi, '<!-- script')
                    .replace(/<\/script>/gi, '</script -->')
                    .replace(/url\(&quot;/gi, 'url(')
                    .replace(/.(a-z){3}&quot;\)/gi, '$1)')
                    .replace(
                        /url\(\//gi,
                        'url(' +
                            location.protocol +
                            '//' +
                            location.hostname +
                            pathpart +
                            '/',
                    )
                    .replace(/\sremarklet-show-(grid|outlines|usercss)\s/g, ' ')
                    .replace(
                        /\s?remarklet-show-(grid|outlines|usercss)\s?|\s/g,
                        ' ',
                    );
                data += encodeURIComponent(html);
                window.open(data, 'Exported From Remarklet', '');
            },
            Save: function () {
                _stored.pageSavedState = '';
                $b.children()
                    .not(views.retained)
                    .each(function () {
                        _stored.pageSavedState += this.outerHTML
                            .replace(/<script/gi, '<!-- script')
                            .replace(/<\/script>/gi, '</script -->');
                    });
            },
            Restore: function () {
                if (_stored.pageSavedState !== '') {
                    $b.children().not(views.retained).remove();
                    // Prepend page state to body as string.
                    $b.prepend(_stored.pageSavedState);
                    // Rebind views that were in saved state string.
                    views.box = $('#remarklet-box');
                    views.usercss = $('#remarklet-usercss');
                    // Relink stylesheet element to views and modules.
                    stylesheet.setSheet(views.usercss.get(0));
                    duplicate.setSheet(views.usercss.get(0));
                    views.csstextarea.val(stylesheet.getString());
                }
            },
        },
        View: {
            Grid: function () {
                $b.toggleClass('remarklet-show-grid');
            },
            Outlines: function () {
                $b.toggleClass('remarklet-show-outlines');
            },
            CSS: function () {
                $b.toggleClass('remarklet-show-usercss');
                if ($b.hasClass('remarklet-show-usercss')) {
                    views.csstextarea.focus();
                } else {
                    views.csstextarea.blur();
                }
            },
            Preferences: function () {
                // Use a prompt window to visualize the remarklet.preferences object, and customizations are saved in localStorage using the localSettings module.
                // The only element in the Preferences window that should have an event is the "Save" button.
                $b.toggleClass('remarklet-show-preferences');
            },
        },
        Insert: {
            Image: function () {
                prompt.open({
                    form: views.newimageform,
                    init: function () {
                        /* File browse button data handler */
                        prompt.get
                            .window()
                            .find('#remarklet-file')
                            .on('change', function () {
                                prompt.get.submit().attr('disabled', true);
                                var reader = new FileReader();
                                reader.onloadend = function () {
                                    prompt.get.submit().removeAttr('disabled');
                                    _stored.fileRead = reader.result;
                                };
                                reader.readAsDataURL(this.files[0]);
                            });
                        $b.off('mousemove', _mouse.update);
                    },
                    callback: function (data) {
                        prompt.get
                            .window()
                            .find('#remarklet-file')
                            .off('change');
                        _stored.editcounter++;
                        var str,
                            ednum = _stored.editcounter,
                            defaultstyles = [
                                'position:absolute;left:',
                                _mouse.x,
                                'px;top:',
                                _mouse.y,
                                'px;z-index:2147483647;',
                            ].join('');
                        if (
                            data.imgurl.length > 1 &&
                            data.imgurl != 'http://placehold.it/'
                        ) {
                            str = [
                                '<img src="',
                                data.imgurl,
                                '" class="remarklet-newimg" style="',
                                defaultstyles,
                                '" />',
                            ];
                        } else if (_stored.fileRead !== false) {
                            str = [
                                '<img class="remarklet-newimg" src="',
                                _stored.fileRead,
                                '" style="',
                                defaultstyles,
                                '" />',
                            ];
                            _stored.fileRead = false;
                        } else {
                            str = [
                                '<div class="remarklet-newimg" style="',
                                defaultstyles,
                                'font:normal 16px Arial,Helvetica,sans-serif;color:',
                                data.textcolor,
                                ';background-color:',
                                data.bgcolor,
                                ';width:',
                                data.imgdimensions.toLowerCase().split('x')[0],
                                'px;height:',
                                data.imgdimensions.toLowerCase().split('x')[1],
                                'px;">',
                                data.imgtext,
                                '</div>',
                            ];
                        }
                        str = str.join('');
                        $(str)
                            .addClass('remarklet remarklet-' + ednum)
                            .appendTo(views.box);
                        $b.on('mousemove', _mouse.update);
                    },
                });
            },
            Note: function () {
                prompt.open({
                    form: views.newnoteform,
                    init: function () {
                        $b.off('mousemove', _mouse.update);
                    },
                    callback: function (data) {
                        _stored.editcounter++;
                        /* Characters seem to be 8px wide */
                        var width = data.notetext.length * 8,
                            ednum = _stored.editcounter,
                            str;
                        if (width > 500) {
                            width = 500;
                        }
                        str = [
                            '<div class="remarklet-note" style="position: absolute; z-index: 2147483647; background-color: #feff81; color: #000; padding: 10px; font-family: monospace; box-shadow: 0 3px 5px #000; word-wrap: break-word; left:',
                            _mouse.x,
                            'px;top:',
                            _mouse.y,
                            'px;width:',
                            width,
                            'px">',
                            data.notetext,
                            '</div>',
                        ].join('');
                        $(str)
                            .addClass('remarklet remarklet-' + ednum)
                            .appendTo(views.box);
                        $b.on('mousemove', _mouse.update);
                    },
                });
            },
            HTML: function () {
                prompt.open({
                    form: views.newhtmlform,
                    init: function () {
                        $b.off('mousemove', _mouse.update);
                    },
                    callback: function (data) {
                        _stored.editcounter++;
                        var str,
                            ednum = _stored.editcounter;
                        str = [
                            '<div class="remarklet-usercode" style="position:absolute;left:',
                            _mouse.x,
                            'px;top:',
                            _mouse.y,
                            'px;">',
                            data.remarkletinserthtml,
                            '</div>',
                        ].join('');
                        $(str)
                            .addClass('remarklet remarklet-' + ednum)
                            .appendTo(views.box)
                            .css({
                                width: function () {
                                    return this.clientWidth + 1;
                                },
                                height: function () {
                                    return this.clientHeight + 1;
                                },
                            });
                        $b.on('mousemove', _mouse.update);
                    },
                });
            },
        },
        Help: function () {
            // Show keyboard shortcuts and explain some processes in a prompt window with only a close button.
            $b.toggleClass('remarklet-show-help');
        },
    };
    views.build = function () {
        var name,
            subname,
            prop,
            $menu,
            $submenu,
            m = menu,
            c = command;
        for (name in m) {
            $menu = $('<li>' + name + '</li>');
            prop = m[name];
            if (typeof prop == 'object') {
                $submenu = $('<ol class="remarklet-submenu"></ol>');
                for (subname in prop) {
                    $(
                        '<li class="remarklet-menu-' +
                            subname.toLowerCase() +
                            '">' +
                            subname +
                            '</li>',
                    )
                        .on('click', c[name][subname])
                        .appendTo($submenu);
                }
                $menu.append($submenu);
            } else {
                $menu.on('click', c[name]);
            }
            $menu
                .appendTo(views.menuwrapper)
                .wrap('<ol class="remarklet-menuitem"></ol>');
        }

        /* Add remaining app UI events */
        views.csstextarea.on('keydown', controllers.userCSSEditorKeyHandler);
        views.help.on('click', command.Help);
        views.csstextarea.on('stoptyping', controllers.updateUserCSS);
        $w.on('keydown', controllers.window);

        /* Insert app elements into page. */
        views.box.add(views.usercss).appendTo($b);
        views.retained = views.gridoverlay
            .add(views.csswindow.append(views.csstextarea))
            .add(views.help)
            .add(prompt.get.window())
            .add(views.preferences)
            .add(views.menuwrapper)
            .appendTo($b);
        views.retained = views.retained.add('link[rel*="//remarklet"]');
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
        prompt = createPrompt('remarklet');
        // TODO: Preference storage and update functionality.
        // For now, all we are doing is pulling them from the server
        // to localStorage if they are not in localStorage already.
        storedobject = createStoredObject(
            'remarklet-preferences',
            _stored.preferences,
        );
        if (_stored.userid) {
            _stored.userid = _stored.userid[1];
            var data = {};
            storedobject.set(data);
            storedobject.publish('/update/', data);
            _stored.preferences = data;
        }

        /* Add UI Elements to page. */
        views.build();

        /* Event delegation for non-app elements. */
        controllers.bodyElements.toggle('on');
    };
    remarklet.init();
    return remarklet;
}

export default { createRemarklet };
