'use strict';

/**
 * Сделано задание на звездочку.
 * Реализована остановка промиса по таймауту.
 */
const isStar = false;

/**
 * Функция паралелльно запускает указанное число промисов
 *
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промис
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum) {
    if (jobs.length === 0) {
        return Promise.resolve([]);
    }

    return (async function (promises) {
        let result = [];
        let notUsed = promises.slice(parallelNum);

        let attachNextPromise = (promise, index) => {
            let anyway = (output) => {
                result[index] = output;
                if (notUsed.length !== 0) {
                    let nextPromise = notUsed.shift();

                    return attachNextPromise(nextPromise, promises.indexOf(nextPromise));
                }

                return output;
            };

            return promise()
                .then(anyway, anyway);
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
