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
        error => new Error(error)
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
    let promiseSet = splitOnSections(jobs, parallelNum);

    return (async function () {
        let result = [];
        for (let i = 0; i < promiseSet.length; i++) {
            let pr = await Promise.all(
                promiseSet[i]
                    .map(promise => promise())
                    .map(reflect)
            );
            result = result.concat(pr);
        }

        return result;
    }());
}

module.exports = {
    runParallel,
    isStar
};
