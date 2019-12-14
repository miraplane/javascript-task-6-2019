'use strict';

/**
 * Сделано задание на звездочку.
 * Реализована остановка промиса по таймауту.
 */
const isStar = true;
let result = [];
let notUsed = [];

function goTimeout(cb, interval) {
    return () => new Promise(resolve => setTimeout(() => cb(resolve), interval));
}

function attachNextPromise(promises, timeout, index, output) {
    if (output === 'timeout') {
        output = new Error('Promise timeout');
    }
    result[index] = output;
    if (notUsed.length !== 0) {
        let nextPromise = notUsed.shift();

        return attachPromise(promises, timeout, nextPromise, promises.indexOf(nextPromise));
    }

    return output;
}

function attachPromise(promises, timeout, promise, index) {
    const attachNextAnyway = attachNextPromise.bind(this, promises, timeout, index);

    return Promise.race([
        promise(),
        goTimeout(resolve => resolve('timeout'), timeout)()
    ]).then(attachNextAnyway, attachNextAnyway);
}

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
        result = [];
        notUsed = promises.slice(parallelNum);

        await Promise.all(
            promises.slice(0, parallelNum)
                .map(attachPromise.bind(this, promises, timeout))
        );

        return Promise.resolve(result);
    }(jobs));
}

module.exports = {
    runParallel,
    isStar
};
