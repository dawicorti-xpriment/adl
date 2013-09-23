package adl;

interface Listenable {

    public function on(name:String, callback:Dynamic):Void;
    public function trigger(name:String, data:Dynamic):Void;

}