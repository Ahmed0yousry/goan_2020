module.exports.arr_diff = (a1, a2) => {

    var a = [],
        diff = [],
        tempOfStrings = [],
        totalDBTimes = [];

    var tempString;

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a2[i].time.length > 5) {
            tempOfStrings = a2[i].time.split(',');
            totalDBTimes = totalDBTimes.concat(tempOfStrings);

        } else {
            totalDBTimes.push(a2[i].time);
        }
    }
    for (var i = 0; i < totalDBTimes.length; i++) {
        if (a[totalDBTimes[i]]) {
            delete a[totalDBTimes[i]];
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
}