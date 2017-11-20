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