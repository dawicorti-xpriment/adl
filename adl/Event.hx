package adl;

class Event implements Listenable {

    public function new() {}

    public function on(name:String, callback:Dynamic) {}

    public function trigger(name:String, data:Dynamic) {}
}