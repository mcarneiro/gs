var mustache = require("mustache"),
	deepMixIn = require("mout/object/deepMixIn"),
	forOwn = require("mout/object/forOwn"),
	forEach = require("mout/array/forEach");

function r(obj,src){

	if (!obj) {
		console.error("render got invalid argument!");
		return;
	}

	if (obj.constructor.name === "String"){
		return mustache.render(obj,src||obj);
	}

	var	rendered = deepMixIn(obj);
	forOwn(obj,function(propValue, prop){
		if (!!propValue) {
			switch(propValue.constructor.name) {
				case "String":
					try{
						rendered[prop] = mustache.render(propValue,src||rendered);
					} catch (err){
						console.warn("mustache failed to render ", propValue);
					}
					break;
				case "Array":
					forEach( propValue, function(value, index){
						if (!!value){
							if (value.constructor.name === "String"){
								propValue[index] = mustache.render(value,src||rendered);
							} else if (value.constructor.name === "Array"){
								// console.log("inner array are not supported yet");
							} else if (value.constructor.name === "Object"){
								propValue[index] = r(value,src||rendered);
							}
						}
					});
					break;
				case "Object":
					rendered[prop] = r(propValue, src||rendered);
					break;
			}
		}
	});
	return rendered;
}
exports.render = function (obj, src) {
	return r(obj,src);
};