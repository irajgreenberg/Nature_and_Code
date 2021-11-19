class VerletHelix {

    constructor(r1, r2, slices, connects, springiness, rigidity = 5, ht = 100, rots = 5) {
        this.r1 = r1; // number
        this.r2 = r2; // number
        this.slices = slices; // number
        this.connects = connects; // number
        this.springiness = springiness; // number
        rigidity = abs(5 - rigidity) + 1; // inverse
        this.rigidity = constrain(rigidity, 1, 5); // number
        this.ht = ht;
        this.rots = rots;

        this.nodeCol = color(255, 25, 25);
        this.stickCol = color(65, 65, 175);
        this.skinCol = color(175, 175, 175, 255);

        // 2D array
        this.nodes = []; // verlet nodes
        this.nodes1D = []; // 1d array for convenience
        this.sliceNodes = []; //conveninence array for calculating slice cross-ssupports

        this.sticks = []; // verlet sticks
        this.crossSupportSticks = [];

        // controls downward incrementation of helix
        this.helixStepper = this.ht / this.slices;

        // create nodes
        let theta = 0;

        this.crossSupportsVisible = false;

        // calculate nodes
        for (let i = 0, k = 0; i < this.connects; i++) {
            // create tube profile (based on # of connects)

            /* Z-rotation to calculate connects
            x' = x*cos q - y*sin q
            y' = x*sin q + y*cos q
            z' = z
            */
            let x = this.r1 + Math.cos(theta) * r2;
            let y = -this.ht / 2 + Math.sin(theta) * r2;
            let z = 0;

            // create new connects arrays
            let connectNodes = [];

            let phi = 0;

            let y2 = y;
            for (let j = 0; j < this.slices; j++) {
                // create copies of tube profiles (based on # of slices)
                /* Y-rotation to sweep connects, creating slices
                z' = z*cos p - x*sin p
                x' = z*sin p + x*cos p
                y' = y
                */
                let z2 = z * Math.cos(phi) - x * Math.sin(phi);
                let x2 = z * Math.sin(phi) + x * Math.cos(phi);

                this.nodes1D[k++] = connectNodes[j] = new VerletNode(createVector(x2, y2 += this.helixStepper, z2), .8, this.nodeCol);

                phi += Math.PI * 2 * this.rots / this.slices;
            }
            // add each connectNodes array to nodes 2D array
            this.nodes[i] = connectNodes;

            theta += Math.PI * 2 / this.connects;
        }

        // create sticks
        for (let i = 0, k = 0; i < this.connects; i++) {
            for (let j = 0; j < this.slices; j++) {
                if (i < this.connects - 1 && j < this.slices - 1) {
                    this.sticks[k++] = new VerletStick(this.nodes[i][j], this.nodes[i][j + 1], this.springiness, 0, this.stickCol)
                    this.sticks[k++] = new VerletStick(this.nodes[i][j + 1], this.nodes[i + 1][j + 1], this.springiness, 0, this.stickCol)
                    this.sticks[k++] = new VerletStick(this.nodes[i + 1][j + 1], this.nodes[i + 1][j], this.springiness, 0, this.stickCol)
                    this.sticks[k++] = new VerletStick(this.nodes[i + 1][j], this.nodes[i][j], this.springiness, 0, this.stickCol)
                } else if (i == this.connects - 1 && j < this.slices - 1) {
                    this.sticks[k++] = new VerletStick(this.nodes[i][j], this.nodes[i][j + 1], this.springiness, 0, this.stickCol);
                    this.sticks[k++] = new VerletStick(this.nodes[i][j + 1], this.nodes[0][j + 1], this.springiness, 0, this.stickCol);
                    this.sticks[k++] = new VerletStick(this.nodes[0][j + 1], this.nodes[0][j], this.springiness, 0, this.stickCol);
                    this.sticks[k++] = new VerletStick(this.nodes[0][j], this.nodes[i][j], this.springiness, 0, this.stickCol);
                } else if (i < this.connects - 1 && j == this.slices - 1) {
                    // this.sticks[k++] = new VerletStick(this.nodes[i][j], this.nodes[i][0], this.springiness, 0, this.stickCol);
                    // this.sticks[k++] = new VerletStick(this.nodes[i][0], this.nodes[i + 1][0], this.springiness, 0, this.stickCol);
                    // this.sticks[k++] = new VerletStick(this.nodes[i + 1][0], this.nodes[i + 1][j], this.springiness, 0, this.stickCol);
                    // this.sticks[k++] = new VerletStick(this.nodes[i + 1][j], this.nodes[i][j], this.springiness, 0, this.stickCol);
                }
            }
        }

        // create global cross supports
        let randNodeindex = 0;
        for (let i = 0, k = 0; i < this.nodes1D.length; i++) {
            let val = Math.floor(Math.random() * (this.nodes1D.length - 1));
            if (i % this.rigidity == 0 && i != val) {
                this.crossSupportSticks[k++] = new VerletStick(this.nodes1D[i], this.nodes1D[val], 1, 0, this.stickCol);
            }
        }


    }

    setColor(skinCol) {
        this.skinCol = skinCol;
    }

    nudge(index, offset) {
        if (index === -1) {
            let ind = Math.floor(Math.random() * (this.nodes1D.length - 1));
            this.nodes1D[ind].pos.add(offset);
        } else {
            this.nodes1D[index].pos.add(offset);
        }
    }


    verlet() {
        for (let i = 0; i < this.nodes1D.length; i++) {
            this.nodes1D[i].verlet();
        }

        // constrain Toroid sticks
        for (let i = 0; i < this.sticks.length; i++) {
            this.sticks[i].constrainLen();
        }

        //constrain cross-supports 
        for (let i = 0; i < this.crossSupportSticks.length; i++) {
            this.crossSupportSticks[i].constrainLen();
        }
    }

    draw(areNodesDrawable = true, areSticksDrawable = true, isSkinDrawable = true) {
        // draw nodes
        if (areNodesDrawable) {
            for (let i = 0; i < this.nodes1D.length; i++) {
                this.nodes1D[i].draw();
            }
        }

        // draw verlet sticks
        if (areSticksDrawable) {
            for (let i = 0; i < this.sticks.length; i++) {
                this.sticks[i].draw();
            }
        }

        // draw skin
        if (isSkinDrawable) {
            for (let i = 0; i < this.connects; i++) {
                for (let j = 0; j < this.slices; j++) {
                    fill(this.skinCol);
                    noStroke();
                    if (i < this.connects - 1 && j < this.slices - 1) {
                        beginShape();
                        vertex(this.nodes[i][j].pos.x, this.nodes[i][j].pos.y, this.nodes[i][j].pos.z);
                        vertex(this.nodes[i][j + 1].pos.x, this.nodes[i][j + 1].pos.y, this.nodes[i][j + 1].pos.z);
                        vertex(this.nodes[i + 1][j + 1].pos.x, this.nodes[i + 1][j + 1].pos.y, this.nodes[i + 1][j + 1].pos.z);
                        vertex(this.nodes[i + 1][j].pos.x, this.nodes[i + 1][j].pos.y, this.nodes[i + 1][j].pos.z);
                        endShape(CLOSE);
                    } else if (i == this.connects - 1 && j < this.slices - 1) {
                        beginShape();
                        vertex(this.nodes[i][j].pos.x, this.nodes[i][j].pos.y, this.nodes[i][j].pos.z);
                        vertex(this.nodes[i][j + 1].pos.x, this.nodes[i][j + 1].pos.y, this.nodes[i][j + 1].pos.z);
                        vertex(this.nodes[0][j + 1].pos.x, this.nodes[0][j + 1].pos.y, this.nodes[0][j + 1].pos.z);
                        vertex(this.nodes[0][j].pos.x, this.nodes[0][j].pos.y, this.nodes[0][j].pos.z);
                        endShape(CLOSE);
                    } else if (i < this.connects - 1 && j == this.slices - 1) {
                        // beginShape();
                        // vertex(this.nodes[i][j].pos.x, this.nodes[i][j].pos.y, this.nodes[i][j].pos.z);
                        // vertex(this.nodes[i][0].pos.x, this.nodes[i][0].pos.y, this.nodes[i][0].pos.z);
                        // vertex(this.nodes[i + 1][0].pos.x, this.nodes[i + 1][0].pos.y, this.nodes[i + 1][0].pos.z);
                        // vertex(this.nodes[i + 1][j].pos.x, this.nodes[i + 1][j].pos.y, this.nodes[i + 1][j].pos.z);
                        // endShape(CLOSE);
                    }
                }
            }
        }

        if (this.crossSupportsVisible) {
            for (let i = 0; i < this.crossSupportSticks.length; i++) {
                 this.crossSupportSticks[i].draw();
            }
        }
    }

    boundsCollide(bounds) {
        for (let i = 0; i < this.nodes1D.length; i++) {
            this.nodes1D[i].boundsCollide(bounds);
        }
    }

    setAreCrossSupportsVisible(crossSupportsVisible){
        this.crossSupportsVisible = crossSupportsVisible;
    }

}