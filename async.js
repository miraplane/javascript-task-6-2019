'use strict';

/**
 * Сделано задание на звездочку.
 * Реализована остановка промиса по таймауту.
 */
const isStar = true;

const goTimeout = (cb, interval) => () =>
    new Promise(resolve => setTimeout(() => cb(resolve), interval));

function attachNextPromise(args, index, output) {
    if (output === 'timeout') {
        output = new Error('Promise timeout');
    }

    args.result[index] = output;

    if (args.notUsed.length !== 0) {
        const nextPromise = args.notUsed.shift();
        const nextIndex = args.promises.indexOf(nextPromise);

        return attachPromise(args, nextPromise, nextIndex);
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

async function doJobs(promises, parallelNum, timeout) {
    const args = {
        result: [],
        notUsed: promises.slice(parallelNum),
        promises: promises,
        timeout: timeout
    };

    const attach = attachPromise.bind(null, args);
    await Promise.all(
        promises.slice(0, parallelNum)
            .map(attach)
    );

    return Promise.resolve(args.result);
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

    return doJobs(jobs, parallelNum, timeout);
}

module.exports = {
    runParallel,
    isStar
};
