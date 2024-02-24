/**
 * Remarklet - Prompt Window Module using RequireJS pattern.
 *
 * @package     ZachWatkins\Remarklet
 * @subpackage  Prompt Window
 * @description Prompt Window Module using RequireJS pattern.
 * @author      Zachary Kendall Watkins <zwatkins.it@gmail.com> (https://github.com/zachwatkins)
 * @copyright   Zachary Kendall Watkins all versions Copyright (c) 2021 All Rights Reserved.
 * @link        https://github.com/zachwatkins/remarklet
 * @license     https://spdx.org/licenses/MIT.html MIT License
 */
export function createPrompt(prefix) {
    var $ = window.jQuery;
    var callback, formobj;
    var open = function (args) {
        if (typeof args.form == 'string') {
            ui.form.html(args.form);
        } else {
            formobj = args.form;
            ui.form.append(args.form);
        }
        args.init();
        ui.window.show();
        ui.content.css({
            'margin-top': function () {
                return -1 * (ui.content.innerHeight() / 2);
            },
        });
        ui.form.find('input,textarea').first().focus();
        callback = args.callback;
    };
    var submit = function () {
        var data = {};
        ui.form.find('*[name]').each(function () {
            data[this.name] = this.value;
        });
        callback(data);
        close();
    };
    var close = function () {
        ui.window.focus().blur().hide();
        if (formobj) {
            formobj.remove();
        }
        ui.form.html('');
    };
    var ui = {
        window: $('<div id="remarklet-prompt-window"></div>').on('keydown', keydown),
        form: $('<form></form>'),
        content: $('<div id="remarklet-prompt-content"></div>'),
        submit: $('<button id="remarklet-prompt-submit" type="button">Submit</button>').on('click', submit),
        cancel: $('<button id="remarklet-prompt-cancel" type="button">Cancel</button>').on('click', close),
    };
    var keydown = function (e) {
        e.stopPropagation();
        if (e.keyCode == 27) {
            /* Escape => Cancel form */
            e.preventDefault();
            close();
        }
    };

    ui.content
        .append(ui.form)
        .append(ui.submit)
        .append(ui.cancel)
        .appendTo(ui.window);
    ui.window.appendTo('body');

    return {
        get: {
            window: function () {
                return ui.window;
            },
            form: function () {
                return ui.form;
            },
            submit: function () {
                return ui.submit;
            },
        },
        open: open,
    };
}

export default { createPrompt };
