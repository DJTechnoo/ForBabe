


const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

function square(x, y, w, h, col){
    c.fillStyle = col;
    c.fillRect(x, y, w, h);
}


function clear(){
    square(0, 0, W, H, "rgba(0, 0, 0, 0.3)");
}

Boid = function(){
    this.pos = new vec(Math.random()*W, Math.random()*H);
    this.acc = new vec(Math.random()*0.1-0.05, Math.random()*0.1-0.05);
    this.vel = new vec(0, 0);
    this.s = Math.random() * 2 + 2;
    this.rot = 0;
}


Boid.prototype.update = function(){
    this.acc.limit(0.05);
    this.vel = this.vel.add(this.acc);
    this.vel.limit(1);
    this.rot = Math.atan2(this.vel.y, this.vel.x);
    this.pos = this.pos.add(this.vel);

    this.wrap();
}

Boid.prototype.draw = function(){
    c.save();
    c.translate(this.pos.x, this.pos.y);
    c.rotate(this.rot);
    square(-this.s/2, -this.s/2, this.s, this.s, "#94ffff");
    c.beginPath();
    c.moveTo(this.s/2,-this.s/2);
    c.lineTo(this.s/2, this.s/2);
    c.lineTo(this.s/2+5, 0);
    c.fill();
    c.restore();
}

Boid.prototype.wrap = function(){
    if(this.pos.x > W) this.pos.x = 0;
    else if(this.pos.x < 0) this.pos.x = W;
    if(this.pos.y > H) this.pos.y = 0;
    else if(this.pos.y < 0) this.pos.y = H;
}


Engine = function(n){
    this.boids = [];
    this.perc = 20;
    this.sep = 10;

    for(let i = 0; i < n; i++) this.boids.push(new Boid());

    this.update = function(){
        for(let i in this.boids) this.boids[i].update();
    }

    this.draw = function(){
        for(let i in this.boids) this.boids[i].draw();
    }

    this.allignAll = function(){
        for(let i in this.boids) this.allign(i);
    }

    this.avoidAll = function(){
        for(let i in this.boids) this.avoid(i);
    }

    this.allign = function(i){
        var desired = new vec(0, 0);
        var c = 0;
        for(let j in this.boids){
            if((i != j) &&   (dist(this.boids[j].pos, this.boids[i].pos) < this.perc)){
                desired = desired.add(this.boids[j].vel);
                c++;
            }
        }

        if(c > 0) desired = desired.sub(this.boids[i].vel);
        this.boids[i].acc = this.boids[i].acc.add(desired);//this.boids[i].acc.sub(desired);
    }

    this.avoid = function(i){
        var desired = new vec(0, 0);
        var tmp = new vec(0, 0);
        var c = 0;
        for(let j in this.boids){
            if((i != j) &&   (dist(this.boids[j].pos, this.boids[i].pos) < this.sep)){
                tmp = this.boids[j].pos.sub(this.boids[i].pos);
                desired = desired.sub(tmp);
                c++;
            }
        }

       if(c > 0) {
            desired.scale(1/c);
           // desired.limit(0.1);
           // desired = desired.sub(this.boids[i].pos)
        };
        this.boids[i].acc = this.boids[i].acc.add(desired);//this.boids[i].acc.sub(desired);
    }

    this.cohese = function(i){
        var desired = new vec(0, 0);
        var c = 0;
        for(let j in this.boids){
            if((j != i) &&   (dist(this.boids[j].pos, this.boids[i].pos) < this.perc)){
                c++;
                desired = desired.add(this.boids[j].pos);
            }
        }

        if(c > 0) {
            desired.scale(1/c);
            desired = desired.sub(this.boids[i].pos);
            desired.limit(0.5);
        }
        this.boids[i].acc = this.boids[i].acc.add(desired);
    }

    this.allRules = function(){
        for(let i in this.boids){
            //this.allign(i);
            //this.avoid(i);
           // this.cohese(i);
            this.everything(i);
        }
    }

    this.everything = function(i){
        var desired1 = new vec(0, 0);
        var desired2 = new vec(0, 0); var tmp = new vec(0, 0);
        var desired3 = new vec(0, 0);
        var c1 = 0;
        var c2 = 0;
        var c3 = 0;

        for(let j in this.boids){
            if((i != j) &&   (dist(this.boids[j].pos, this.boids[i].pos) < this.perc)){
                desired1 = desired1.add(this.boids[j].vel);
                c1++;
                if((dist(this.boids[j].pos, this.boids[i].pos) < this.sep)){
                    tmp = this.boids[j].pos.sub(this.boids[i].pos);
                    desired2 = desired2.sub(tmp);
                    c2++;
                }

                c3++;
                desired3 = desired3.add(this.boids[j].pos);
            }
        }

        if(c1 > 0) desired1 = desired1.sub(this.boids[i].vel);
        if(c2 > 0) desired2.scale(1/c2);
        if(c3 > 0) {
            desired3.scale(1/c3);
            desired3 = desired3.sub(this.boids[i].pos);
            desired3.limit(0.5);
        } 
        this.boids[i].acc = this.boids[i].acc.add(desired1);
        this.boids[i].acc = this.boids[i].acc.add(desired2);
        this.boids[i].acc = this.boids[i].acc.add(desired3);
    }
}


var engine = new Engine(300);

function loop(){
    clear();
    engine.allRules();
    engine.update();
    engine.draw();
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

