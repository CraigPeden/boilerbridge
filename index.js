var request = require("request");
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-boilerbridge", "BoilerBridge", LedAccessory);
}

function LedAccessory(log, config) {
    this.log = log;
    this.config = config;
    this.name = config["name"];

    this.service = new Service.Lightbulb(this.name);
    this.service
        .getCharacteristic(Characteristic.On)
        .on('get', this.getOn.bind(this))
        .on('set', this.setOn.bind(this));
}

LedAccessory.prototype.getOn = function(callback) {
    request.get({
        url: 'http://192.168.0.210/heating'
    }, function(err, response, body) {
        this.log.info(body);
        var status = body == '{"heating_on": true}' ? true : false;
        callback(null, status);
    }.bind(this));
}

LedAccessory.prototype.setOn = function(on, callback) {
    var url = on ? "on": "off";
    this.log.info('http://192.168.0.210/heating/' + url);
    request.post({
        url: 'http://192.168.0.210/heating/' + url
    }, function(err, response, body) {
        this.log.info(url);
        this.log(err);
        this.log(response);
        this.log(body);
        callback(null, on);
    }.bind(this));
}

LedAccessory.prototype.getServices = function() {
    return [this.service];
}