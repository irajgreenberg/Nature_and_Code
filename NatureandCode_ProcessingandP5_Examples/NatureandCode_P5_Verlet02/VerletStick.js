
class VerletStick {

    constructor(start, end, stickTension, anchorTerminal, color) {
        this.start = start;
        this.end = end;
        this.len = this.start.pos.dist(this.end.pos);
        this.stickTension = stickTension;
        this.anchorTerminal = anchorTerminal;
        this.color = color;
    }

    constrainLen() {
        let accuracyCount = 1; // costs a bit in performance
        // To Do: create a parameter in constructor for accuracyCount
        
        for (let i = 0; i < accuracyCount; i++) {
            let delta = new p5.Vector(
                this.end.pos.x - this.start.pos.x,
                this.end.pos.y - this.start.pos.y
            );
            let deltaLength = delta.mag();
            let node1ConstrainFactor = 0;
            let node2ConstrainFactor = 0;

            switch (this.anchorTerminal) {
                case 0:
                    node1ConstrainFactor = 0.5;
                    node2ConstrainFactor = 0.5;
                    break;
                case 1:
                    node1ConstrainFactor = 0.0;
                    node2ConstrainFactor = 1.0;
                    break;
                case 2:
                    node1ConstrainFactor = 1.0;
                    node2ConstrainFactor = 0.0;
                    break;
                case 3:
                    node1ConstrainFactor = 0.0;
                    node2ConstrainFactor = 0.0;
                    break;
                default:
                    node1ConstrainFactor = 0.5;
                    node2ConstrainFactor = 0.5;
            }

            let difference = (deltaLength - this.len) / deltaLength;
            this.start.pos.x += delta.x * (node1ConstrainFactor * this.stickTension * difference);
            this.start.pos.y += delta.y * (node1ConstrainFactor * this.stickTension * difference);
            this.end.pos.x -= delta.x * (node2ConstrainFactor * this.stickTension * difference);
            this.end.pos.y -= delta.y * (node2ConstrainFactor * this.stickTension * difference);
        }
    }

    nudge(index, offset) {
        if (index == 0) {
            this.start.nudge(offset);
        } else {
            this.end.nudge(offset);
        }

    }

    verlet() {
        this.start.verlet();
        this.end.verlet();
        this.constrainLen();
    }

    draw() {
        fill(this.color);
        noStroke();
        this.start.draw();
        this.end.draw();

        stroke(this.color);
        noFill();
        beginShape();
        vertex(this.start.pos.x, this.start.pos.y);
        vertex(this.end.pos.x, this.end.pos.y);
        endShape();
    }

    boundsCollide(bounds) {
        this.start.boundsCollide(bounds);
        this.end.boundsCollide(bounds);
    }

    setColor(color) {
        // to do
    }

    setOpacity(alpha) {
        // to do
    }

    setVisibility(isVisible) {
        // to do
    }
    reinitializeLen() {
        this.len = this.start.pos.dist(this.end.pos);
    }


}