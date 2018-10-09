/**
* 获取上一个月
* @date 格式为yyyy-mm-dd的日期，如：2018-01-25
*/
export const getPreMonth = date =>  {
    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份
    var month = arr[1]; //获取当前日期的月份
    var day = arr[2]; //获取当前日期的日

    // var days = new Date(year, month, 0);
    // days = days.getDate(); //获取当前日期中月的天数

    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }

    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }

    if (month2 < 10) {
        month2 = '0' + month2;
    }

    var t2 = year2 + '-' + month2 + '-' + day2;
    return t2;
}

/**
 * 格式化时间
 * @param  {Date} date 需要格式化的时间
 * @return {string}    格式化后的时间（2017-10-08）
 */
export const formatDate = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formatNumber = n => {
        n = n.toString();
        return n[1] ? n : '0' + n;
    }

    return [year, month, day].map(formatNumber).join('-');
}