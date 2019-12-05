'use strict';

/**
 * Сделано задание на звездочку.
 * Реализована остановка промиса по таймауту.
 */
const isStar = true;

/**
 * Функция паралелльно запускает указанное число промисов
 *
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    if (jobs.length === 0) {
        return Promise.resolve([]);
    }

    return (async function (promises) {
        let result = [];
        let notUsed = promises.slice(parallelNum);

        let attachNextPromise = (promise, index) => {
            let anyway = (output) => {
                if (output === 'timeout') {
                    output = new Error('Promise timeout');
                }
                result[index] = output;
                if (notUsed.length !== 0) {
                    let nextPromise = notUsed.shift();

                    return attachNextPromise(nextPromise, promises.indexOf(nextPromise));
                }

                return output;
            };

            let goTimeout = (cb, interval) => () =>
                new Promise(resolve => setTimeout(() => cb(resolve), interval));

            return Promise.race([
                promise(),
                goTimeout(resolve => resolve('timeout'), timeout)()
            ]).then(anyway, anyway);
        };

        await Promise.all(
            promises.slice(0, parallelNum)
                .map(attachNextPromise)
        );

        return Promise.resolve(result);
    }(jobs));
}

module.exports = {
    runParallel,
    isStar
};
