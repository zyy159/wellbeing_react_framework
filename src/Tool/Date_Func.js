export const date_Func = (startTime, endTime) => {
    let all_date_list = [];
    let currentDate = startTime;

    // 使用 dayjs 的 diff 函数来计算时间差并遍历每一天
    while (endTime.diff(currentDate, 'minute') >= 0) {
        all_date_list.push(currentDate.format('YYYY-MM-DD HH:mm:ss'));
        currentDate = currentDate.add(1, 'day');
    }

    return all_date_list;
};


export const getDateIndex=(startTime, editTime) =>{
    var year = startTime.getFullYear()
    var month = startTime.getMonth() + 1
    var day = startTime.getDate()
    var year_Edit = editTime.getFullYear()
    var month_Edit = editTime.getMonth() + 1
    var day_Edit = editTime.getDate()

    var startDate = new Date(year + '-' + month + '-' + day)
    var editDate = new Date(year_Edit + '-' + month_Edit + '-' + day_Edit)
    var diff = (editDate-startDate)/(1000 * 60 * 60 * 24)
    return diff
};

export const getDateElement=(Datetime) =>{
    var year = Datetime.getFullYear()
    var month = Datetime.getMonth() + 1
    var day = Datetime.getDate()
    var hour = Datetime.getHours()
    var minute = Datetime.getMinutes()

    var DateElement = year + '-' + month + '-' + day + ' ' + hour + ":" + minute + ":00"
    return DateElement
};

export const getEndDatetime=(StartDatetime, duration) =>{
    var year = StartDatetime.getFullYear()
    var month = StartDatetime.getMonth() + 1
    var day = StartDatetime.getDate()
    var hour = StartDatetime.getHours()
    var minute = StartDatetime.getMinutes() + duration
    var EndDatetime = year + '-' + month + '-' + day + ' ' + hour + ":" + minute
    return EndDatetime
}
