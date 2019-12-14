'use strict';

/**
 * Сделано задание на звездочку.
 * Реализована остановка промиса по таймауту.
 */
const isStar = true;

function goTimeout(cb, interval) {
    return () => new Promise(resolve => setTimeout(() => cb(resolve), interval));
}

function attachNextPromise(args, index, output) {
    if (output === 'timeout') {
        output = new Error('Promise timeout');
    }
    args.result[index] = output;
    if (args.notUsed.length !== 0) {
        let nextPromise = args.notUsed.shift();

        return attachPromise(args, nextPromise, args.promises.indexOf(nextPromise));
    }

    return output;
}

function attachPromise(args, promise, index) {
    const attachNextAnyway = attachNextPromise.bind(null, args, index);

    return Promise.race([
        promise(),
        goTimeout(resolve => resolve('timeout'), args.timeout)()
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
        const args = {
            result: [],
            notUsed: promises.slice(parallelNum),
            promises: promises,
            timeout: timeout
        };

        await Promise.all(
            promises.slice(0, parallelNum)
                .map(attachPromise.bind(null, args))
        );

        return Promise.resolve(args.result);
    }(jobs));
}

module.exports = {
    runParallel,
    isStar
};
