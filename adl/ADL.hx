package adl;

import haxe.Json;

@:expose class ADL {

    static private var registries:Array<Registry> = new Array();
    static public var version:String = '0.0.1';

    static public function read (data:String):Registry {
        var description = Json.parse(data);
        var reg = new Registry();
        
        return reg.read(description);
    }

    static public function update (delta:Int) {
        for (reg in registries) {
            reg.update(delta);
        }
    }

    static public function main () {}

}