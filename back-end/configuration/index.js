
let finalConfig = { ...process.env };

finalConfig.LOG_TO_CONSOLE = (finalConfig.LOG_TO_CONSOLE && finalConfig.LOG_TO_CONSOLE.toString().toLowerCase() == 'true');
finalConfig.LOG_PM2 = (finalConfig.LOG_PM2 && finalConfig.LOG_PM2.toString().toLowerCase() == 'true');
finalConfig.LOG_DISABLED_CLUSTERING = (finalConfig.LOG_DISABLED_CLUSTERING && finalConfig.LOG_DISABLED_CLUSTERING.toString().toLowerCase() == 'true');

finalConfig = deepen(finalConfig);

function deepen(o) {
    var oo = {}, t, parts, part;
    for (var k in o) {
        t = oo;
        parts = k.split('.');
        var key = parts.pop();
        while (parts.length) {
            part = parts.shift();
            t = t[part] = t[part] || {};
        }
        t[key] = o[k]
    }
    return oo;
}

module.exports = finalConfig