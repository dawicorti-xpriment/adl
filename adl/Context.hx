package adl;

class Context {

    private var data:Dynamic;

    public function new(data:Dynamic) {
        this.data = data;
    }

    public function getValue(name:String, defaultV:Dynamic=null):Dynamic {
        var result = defaultV;

        if (Reflect.hasField(data, name)) {
            result = Reflect.getProperty(data, name);
        }

        return result;
    }
}