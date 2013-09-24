package adl;

class Events implements Listenable {

    private var routes:Map<String, Array<Dynamic>>;

    public function new() {
        routes = new Map();
    }

    public function on(name:String, callback:Dynamic) {
        var callbacks:Array<Dynamic> = routes.get(name);

        if (callbacks == null) {
            callbacks = new Array();
            routes.set(name, callbacks);
        }

        callbacks.push(callback);
    }

    public function trigger(name:String, data:Dynamic) {
        var callbacks:Array<Dynamic> = routes.get(name);

        if (callbacks != null) {
            for (callback in callbacks) {
                callback(data);
            }
        }
    }
}