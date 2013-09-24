package adl;

class Animation implements Listenable {

    private var params:Map<String, Parameter>;
    private var events:Events; 

    private function new() {
        params = new Map();
        events = new Events();

        on('setdelay', setDelay);
    }

    public function setDelay(param:Parameter) {
        trace('set delay');
    }

    public function read(description:Dynamic):Animation {
        for (name in Reflect.fields(description)) {
            var param = new Parameter();

            param.set(Reflect.getProperty(description, name));
            params.set(name, param);
            trigger('set' + name, param);
        }
        return this;
    }

    public function on(name:String, callback:Dynamic) {
        events.on(name, callback);
    }

    public function trigger(name:String, data:Dynamic) {
        events.trigger(name, data);
    }


}