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
            try {
                let pr = await Promise.all(promiseSet[i].map(promise => promise()));
                result = result.concat(pr);
            } catch (e) {
                result.push(new Error(e));
            }
        }

        return result;
    }());
}

module.exports = {
    runParallel,
    isStar
};
