'use strict';

/**
 * Сделано задание на звездочку.
 * Реализована остановка промиса по таймауту.
 */
const isStar = false;

function splitOnSections(array, size) {
    let subArrays = [];
    let lengthSubSet = Math.ceil(array.length / size);
    for (let i = 0; i < lengthSubSet; i++) {
        let startIndex = i * size;
        subArrays.push(array.slice(startIndex, startIndex + size));
    }

    return subArrays;
}

function reflect(promise) {
    return promise.then(
        value => value,
        error => error
    );
}

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
    let promiseSet = splitOnSections(jobs, parallelNum);

    return (async function (promises) {
        let result = [];
        for (let i = 0; i < promises.length; i++) {
            let pr = await Promise.all(
                promises[i]
                    .map(promise => promise())
                    .map(reflect)
            );
            result = result.concat(pr);
        }

        return result;
    }(promiseSet));
}

module.exports = {
    runParallel,
    isStar
};
