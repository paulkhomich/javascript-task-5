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

    // Создаю список всех РЕАЛИЗУЕМЫХ команд из длинной
    // Пример: hello.world.now -> [hello, hello.world, hello.world.now]
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

    // Создаю список всех команд от которых ОТПИСАТЬСЯ из головной
    // Пример: hello -> [hello, hello.world, hello.*** и т.д.]
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
            // Добавляю точку для удобной индексации в будущем
            event = event + '.';
            // Если нет коллекции - создаю
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
            // Пробегаюсь по списку всех комманд для отписки
            commands.forEach(command => {
                // Ищу в каждой коллекции нужного мне человека
                // И ремувлю их
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
            // Получаю все комманды для реализации
            let fullEvent = commandsMaker(event);
            // Для каждой из них
            fullEvent.forEach(command => {
                // Ищу коллекцию
                if (events[command]) {
                    events[command].forEach(action => {
                        // Для каждого человека внутри колю резолв-функцию
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
