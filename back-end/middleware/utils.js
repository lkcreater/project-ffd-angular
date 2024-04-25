function generateLogMeta(sessionId,type, serviceName, status, ipAddress) {
    logMeta = {
        sessionId: sessionId,
        type: type,
        name: serviceName,
        status: status,
        ipAddress: ipAddress
    };
    return logMeta
}

function convertDateTypeRequestQuery(query, excludedProperties) {
    for(const property in query){
        if(!(excludedProperties || []).includes(property)){
            if(['true', 'false'].includes(query[property])){
                query[property] = query[property] == 'true';
            }
            else if(/^\d+$/.test(query[property])){
                query[property] = +query[property];
            }
        }
    }
    return query;
};

function getRangeDatetime(date_type, { date, start_date, end_date } = {}) {
    let startDatetime = null;
    let endDatetime = null;

    if (date && ["day", "month", "year"].includes(date_type)) {
        const datetime = new Date(date);
        startDatetime = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate());
        endDatetime = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate(), 23, 59, 59);

        if (["month", "year"].includes(date_type)) {
            const startMonth = date_type == 'year' ? 0 : datetime.getMonth();
            const endMonth = date_type == 'year' ? 11 : datetime.getMonth();

            startDatetime.setMonth(startMonth, 1);
            endDatetime.setMonth(endMonth + 1, 0);
        }
    }
    else if (start_date && end_date && ["custom"].includes(date_type)) {
        startDatetime = new Date(start_date);
        endDatetime = new Date(end_date);
    }

    return { startDatetime, endDatetime };
};

module.exports ={
    generateLogMeta, convertDateTypeRequestQuery, getRangeDatetime
}