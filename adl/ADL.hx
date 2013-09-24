package adl;

import haxe.Json;

@:expose class ADL  {

    static public var version:String = '0.0.1';

    static public function read (data:String):Registry {
        var description = Json.parse(data);
        var reg = new Registry();
        
        return reg.read(description);
    }

    static public function main () {}

}