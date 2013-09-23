package adl;

class Sequence extends Animation {

    private var animations:Array<Animation>;

    public function new() {
        super();
        animations = new Array();
    }

    override public function read(descriptions:Array<Dynamic>):Animation {
        super.read(descriptions);

        for (description in descriptions) {
            animations.push(AnimationFactory.create(description));
        }

        return this;
    }

}