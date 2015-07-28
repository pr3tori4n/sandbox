;(function(undefined){ //no argument is passed in. Therefore, undefined works for undefined comparisons even if outside the scope undefined has been defined with a different value
	//create local variables that reference the window and the document. Protect against global renaming of these objects.
	var window = (function() {return this;})();
	var document = window.document;
	var oldBones = window.barebones; //TODO: new name needed
	var library = {}; //generic master object for the library
	library.number = {};
	library.string = {};
	library.array = {};
	library.object = {};
	library.ajax = {};
	library.events = {};

	/*Array Helpers*/
	library.array.pushUnique = function(array, item) {
        if (array.indexOf(item) === -1) {
            array.push(item);
        }
    };
    /*String Helpers*/
    library.string.capitalize = function(word) {
    	return word.charAt(0).toUpperCase() + word.slice(1);
    };
    library.string.capitalizePhrase = function(string, delimiter) {
    	if(!delimiter) { delimiter = " ";}
    	var words = string.split(delimiter), phrase='', i=0, len=words.length;
    	for(/**/;i<len;i++) {
    		phrase += delimiter + this.capitalize(words[i]);
    	}
        return phrase.slice(1); //remove the space at the very beginning
    };
    /*
	* desination == object receiving properties. This will be returned at the end.
	* origin == object whose properties to copy into destination.
	* coerce == boolean. Optional argument. Default false. I
    */
    library.object.merge = function(destination, origin, coerce) { //desination == object receiving properties. origin == object where properties are copied from.
    	var i;
    	coerce = !!coerce; //convert any falsy type value (i.e. undefined) into a boolean
		for (i in origin) {
			if(origin.hasOwnProperty[i]) {
				if(coerce) {
					destination[i] = origin[i];
				} else if(typeof destination[i] === "undefined") {
					destination[i] = origin[i];
				}
			}
		}
    };
    //Because you can't set the prototype of an existing object to another object easily, 
    //we have to create a new object using object.create, then copy over the properties of the object to that newObject
    //the new object is what is returned, the original object is not modified. 
    //You will have to replace your original object with the new object created by this method: var myObject = library.object.setPrototype(myObject, someOtherObject);
    //This is possible but not recommended. It's best to set an object's prototype when it's first created. You can still use the object literal pattern like so:
    /*	var myObject = Object.create(someOtherObject);
    	library.object.merge(myObject, {
			someProperty:'someValue'
    	});
	*/
    library.object.setPrototype = function(anObject, itsPrototype) {
    	var newObject = Object.create(itsPrototype);
    	this.merge(newObject, anObject);
    };

    library.object.merge = function(a, c) {
	    /*var newObject = null, that = this;

	    function constructor(k) {
	        for (var h in k) {
	            try {
	                if (k[h].constructor == Object) {
	                    this[h] = k[h];
	                    if (h in c) {
	                        this[h] = that.merge(this[h], c[h])
	                    }
	                } else {
	                    if (k[h].constructor == Function) {
	                        if ((h in c) && c[h].constructor == Function) {
	                            var f = this;
	                            (function(n, m) {
	                                f[h] = function() {
	                                    this._super = m;
	                                    return n.apply(this,
	                                        arguments)
	                                };
	                                f[h].sourceConewObjecte = n.toString()
	                            })(k[h], c[h])
	                        } else {
	                            this[h] = k[h]
	                        }
	                    } else {
	                        this[h] = k[h]
	                    }
	                }
	            } catch (g) {
	                this[h] = k[h]
	            }
	        }
	    }
	    constructor.prototype = c;
	    newObject = new b(a);
	    return newObject;*/
	};

	library.ajax.getJSON = function(url, callback) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);

		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		    // Success!
		    var data = JSON.parse(request.responseText);
		    callback(data);
		  } else {
		    // We reached our target server, but it returned an error
		    console.error("the JSON at URL " + url + " couldn't be found");
		  }
		};

		request.onerror = function() {
		  // There was a connection error of some sort
		   console.error("the server is not responding.");
		};

		request.send();
	};
	library.ajax.post = function(url, data) {
		var request = new XMLHttpRequest();
		request.open('POST', url, true);
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send(data);
	};

	/* Pub/Sub Observer/Mediator pattern. This object acts as the mediator
		Each publisher will need to identify itself using the data object.
		That way, each subscriber can act accordingly by inspecting the data object and validating if the exact item it's listening for is publishing the event.
	*/
	library.observer = {
		subscribers:{},
		key:-1,
		subscribe:function(eventName,scope,callback){
			//Error Handling
			if(typeof eventName !== "string") {
				throw "observer.subscribe failed. the eventName must be a string (param 1)"
			}
			if(!callback && typeof scope === "function") {
				callback = scope;
				scope = null;
			}
			if((!scope && !callback) || (typeof callback !== "function")) {
				throw "observer.subscribe failed. a callback function is required"
			}
			//Subscribe logic
			var key = (++this.key).toString();
			if(!this.subscribers.hasOwnProperty(eventName)) {
				this.subscribers[eventName] = [];
			}
			this.subscribers[eventName].push({key:key,callback:callback,scope:scope});
			return key;
		},
		unsubscribe:function(eventName, key) {
			if(!eventName || !this.subscribers.hasOwnProperty(eventName)) {
				return false;
			} else {
				var i=0, len=0, subscribers = this.subscribers[eventName];
				if(!key) {
					delete this.subscribers[eventName]; //remove all subscribers to this event
					return true;
				} else {
					for (len=subscribers.length;i<len;i++) {
						if(subscribers[i].key === key) {
							subscribers.splice(i,1); //remove this callback subscribed to this eventName
							if(subscribers.length === 0) {
								delete this.subscribers[eventName];
							}
							return true;
						}
					}
					return false;
				}
			}
		},
		publish:function(eventName, data) {
			var subscribers, scope;
			if(this.subscribers.hasOwnProperty(eventName)) {
				subscribers = this.subscribers[eventName];
				for(i in subscribers) {
					if(subscribers.hasOwnProperty(i)) {
						//if no scope is provided, fire the function in the global scope, rather than the scope of the mediator object, which will almost never be helpful.
						scope = (!subscribers[i].scope) ? window : subscribers[i].scope;
						subscribers[i].callback.call(scope, data);
					}
				}
			}
		}
	};
	library.obs = library.observer; //provided for brevity

	/*Shortcuts - these commonly used methods can be accessed directly off the base object using the same method name, to assist with brevity. The object taxonomy exists for clarification in these cases.*/
	library.pushUnique = library.array.pushUnique;

	//Add the library object onto the global object.
	window.barebones = library; //TODO: need new name
	window._bb = library; //provided for brevity
})();