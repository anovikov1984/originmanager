var http = require('http'),
    prompt = require('prompt'),
    enabledOrigins;

var DEFAULT_ORIGINS = ['ps1', 'ps2', 'ps3', 'ps4', 'ps5', 'ps6', 'ps7', 'ps8'];

Set.prototype.getArray = function () {
    var resultArray = [];


    this.forEach(function (val) {
        resultArray.push(val);
    });

    return resultArray;
}

enabledOrigins = new Set(DEFAULT_ORIGINS);

console.log("Initialized with origins: " + enabledOrigins.getArray().join(", "));

http.createServer(function (req, res) {
    if (req.url == '/favicon.ico') return;

    var currentOrigin = req.headers.host.split('.')[0];

    if (enabledOrigins.has(currentOrigin)) {
        console.log(currentOrigin);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World\n');
    } else {
        console.error("Enabled origins set doesn't contains origin '" +
        currentOrigin + "'");
        res.statusCode = 403;
        res.end();
    }

}).listen(80, '0.0.0.0');

prompt.start();
getInput();

function getInput() {
    prompt.get(['command'], function (err, result) {
        var argsArray = result.command.split(" "),
            action = argsArray[0];

        switch(action) {
            case "help":
                showHelp();
                break;
            case "enable":
                var origin = argsArray[1];

                if (origin) {
                    enabledOrigins.add(origin);
                    console.log("Origin '" + origin + "' added successfully");
                    showCurrentOrigins();
                } else {
                    console.log("You need to specify origin as second word");
                }

                break;
            case "disable":
                var origin = argsArray[1];

                if (origin) {
                    enabledOrigins.delete(origin);
                    console.log("Origin '" + origin + "' removed successfully");
                    showCurrentOrigins();
                } else {
                    console.log("You need to specify origin as second word");
                }

                break;
            default:
                showHelp();
                break;
        }

        getInput();
    });
}

function showHelp() {
    console.log("=======================");
    console.log("Examples of usage:\n");
    console.log("enable ps4");
    console.log("disable ps1");
    console.log("help");
    console.log("=======================");
}

function showCurrentOrigins() {
    console.log("Current origins: " + enabledOrigins.getArray().join(", "));
}

