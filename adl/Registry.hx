package adl;

class Registry {

    private var animations:Map<String, Animation>;

    public function new() {
        animations = new Map();
    }

    public function read(description:Dynamic):Registry {
        for (field in Reflect.fields(description)) {
            var animationDescription = Reflect.getProperty(description, field);

            animations.set(field, AnimationFactory.create(animationDescription));
        }

        return this;
    }

}