package adl;

class Context {

    private var data:Dynamic;

    public function new() {
        data = {};
    }

    public function getValue(name:String, defaultV:Dynamic=null):Dynamic {
        var result = defaultV;

        if (Reflect.hasField(data, name)) {
            result = Reflect.getProperty(data, name);
        }

        return result;
    }
}