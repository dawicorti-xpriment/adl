package adl;

class Animation implements Listenable {

    private var params:Map<String, Parameter>;
    private var event:Event; 

    private function new() {
        params = new Map();
        event = new Event();
    }

    public function read(description:Dynamic):Animation {
        for (name in Reflect.fields(description)) {
            var param = new Parameter();

            param.set(Reflect.getProperty(description, name));
            params.set(name, param);
        }
        return this;
    }

    public function on(name:String, callback:Dynamic) {
        event.on(name, callback);
    }

    public function trigger(name:String, data:Dynamic) {
        event.trigger(name, data);
    }


}