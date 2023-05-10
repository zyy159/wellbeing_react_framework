export const date_Func=(startTime, endTime) =>{
    var all_date_list = []
    var i = 0
    while ((endTime.getTime() - startTime.getTime()) >= 0) {
        var year = startTime.getFullYear()
        var month = startTime.getMonth() + 1
        var day = startTime.getDate()
        var hour = startTime.getHours()
        var minute = startTime.getMinutes()
        all_date_list[i] = year + '-' + month + '-' + day + ' ' + hour + ":" + minute
        startTime.setDate(startTime.getDate() + 1)
        i += 1
    }
    return all_date_list
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

    var DateElement = year + '-' + month + '-' + day + ' ' + hour + ":" + minute
    return DateElement
};
