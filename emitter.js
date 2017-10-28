'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let events = {};

    function commandsMaker(command) {
        let splits = command.split('.');
        let commands = [splits[0] + '.'];
        splits.forEach(function (el) {
            if (splits.indexOf(el) !== 0) {
                commands.push(commands[commands.length - 1] + el + '.');
            }
        });
        commands.reverse();

        return commands;
    }

    function commandsFinder(command) {
        let keys = Object.keys(events);
        let commands = keys.filter(key => key.startsWith(command + '.'));

        return commands;
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Params}
         */
        on: function (event, context, handler) {
            event = event + '.';
            if (!events[event]) {
                events[event] = [];
            }
            events[event].push({ context, handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Params}
         */
        off: function (event, context) {
            let commands = commandsFinder(event);
            commands.forEach(command => {
                events[command].forEach(action => {
                    if (action.context === context) {
                        let index = events[command].indexOf(action);
                        events[command].splice(index, 1);
                    }
                });
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Params}
         */
        emit: function (event) {
            let fullEvent = commandsMaker(event);
            fullEvent.forEach(command => {
                if (events[command]) {
                    events[command].forEach(action => {
                        action.handler.call(action.context);
                    });
                }
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}
