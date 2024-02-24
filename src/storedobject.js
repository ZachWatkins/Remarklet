/**
 * Remarklet - Stored Object module using RequireJS pattern.
 *
 * @package     ZachWatkins\Remarklet
 * @subpackage  storedobject
 * @description Store object within module and localStorage, sync changes to both.
 * @author      Zachary Kendall Watkins <zwatkins.it@gmail.com> (https://github.com/zachwatkins)
 * @copyright   Zachary Kendall Watkins all versions Copyright (c) 2021 All Rights Reserved.
 * @link        https://github.com/zachwatkins/remarklet
 * @license     https://spdx.org/licenses/MIT.html MIT License
 */
export function createStoredObject(uniquename, defaultvalues) {
    var dbname, // Name of database in localStorage.
        defaults, // Default values of "dataset".
        dataset = {},
        topics = {},
        hOP = topics.hasOwnProperty;
    var set = function (propname, data) {
        // Send variable "data" to property "propname" of "dataset",
        // or replace value of "dataset" with "propname" because "data" is undefined.
        if (data) {
            dataset[propname] = data;
        } else {
            dataset = propname;
        }
        // Store JSON representation of "dataset" in localStorage.
        localStorage[dbname] = JSON.stringify(dataset);
        return this;
    };
    return {
        init: function () {
            var name, storage;
            dbname = uniquename;
            dataset = defaults = defaultvalues;
            // If localStorage has named data, it should extend "defaultvalues" (opinion)
            // and merge with "dataset".
            // If not, fill localStorage with defaultvalues.
            if (localStorage[uniquename] !== undefined) {
                storage = JSON.parse(localStorage[uniquename]);
                for (name in storage) {
                    dataset[name] = storage[name];
                }
            } else {
                localStorage[uniquename] = JSON.stringify(defaultvalues);
            }
            return this;
        },
        get: function (propname) {
            if (propname) {
                return dataset[propname];
            } else {
                return dataset;
            }
        },
        set: set,
        reset: function () {
            set(defaults);
            localStorage.removeItem(dbname);
            return this;
        },
        subscribe: function (topic, listener) {
            // Create the topic's object if not yet created
            if (!hOP.call(topics, topic)) topics[topic] = [];

            // Add the listener to queue
            var index = topics[topic].push(listener) - 1;

            // Provide handle back for removal of topic
            return {
                remove: function () {
                    delete topics[topic][index];
                },
            };
        },
        publish: function (topic, info) {
            // If the topic doesn't exist, or there's no listeners in queue, just leave
            if (!hOP.call(topics, topic)) return;

            // Cycle through topics queue, fire!
            topics[topic].forEach(function (item) {
                item(info !== undefined ? info : {});
            });
        },
    };
}

export default { createStoredObject };
