package adl;

class Parameter {

    private var ctx:Context;

    public function new () {
        ctx = new Context();
    }

    public function set (value:Dynamic):Parameter {
        return this;
    }

    public function getValue (name:String):Dynamic {
        return ctx.getValue(name);
    }

}