package adl;

import adl.animation.Linear;

class AnimationFactory {

    static private function readArray (description:Dynamic):Animation {
        var sequenceDescription:Array<Dynamic> = description;
        var animation:Animation = null;

        if (sequenceDescription.length > 1) {
            animation = new Sequence();
            animation.read(description);
        } else if (sequenceDescription.length == 1 && Std.is(sequenceDescription[0], Array)) {
            animation = new Parallel();
            animation.read(sequenceDescription[0]);
        } else {
            throw "A sequence should have 2 or more animations";
        }

        return animation;
    }

    static private function readObject (description:Dynamic):Animation {
        var animation:Animation = null;

        if (Reflect.hasField(description, 'type')) {
            var type:String = Reflect.getProperty(description, 'type');

            switch (type) {
                case 'linear':
                    animation = new Linear();
                    animation.read(description);
                default:
                    throw "Unrecognized type : " + type;
            }
        } else {
            throw "Can't read an animation with no type";
        }

        return animation;
    }

    static public function create (description:Dynamic):Animation {
        var animation:Animation = null;

        if (Std.is(description, Array)) {
            animation = AnimationFactory.readArray(description);
        } else if (Reflect.isObject(description)) {
            animation = AnimationFactory.readObject(description);
        } else {
            throw "Unknown animation type";
        }

        return animation;
    }

}