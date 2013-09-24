package adl;

class Engine implements Listenable {

    private var animation:Animation;
    private var ctx:Context;
    private var events:Events;
    private var elapsed:Int;

    public function new (animation:Animation) {
        this.animation = animation;
        this.events = new Events();
        this.elapsed = 0;
    }

    public function loop (ctx:Context) {
        this.ctx = ctx;
    }

    public function step (delta:Int) {
        elapsed += delta;
        this.animation.step(ctx, elapsed);
    }

    public function on(name:String, callback:Dynamic) {
        events.on(name, callback);
    }

    public function trigger(name:String, data:Dynamic) {
        events.trigger(name, data);
    }
}