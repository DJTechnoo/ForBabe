


vec = function(x, y){
    this.x = x;
    this.y = y;
}

vec.prototype.add = function(v){
    return new vec(this.x + v.x, this.y + v.y);
}


vec.prototype.sub = function(v){
    return new vec(this.x - v.x, this.y - v.y);
}


vec.prototype.scale = function(s){
    this.x *= s; this.y *= s;
}


vec.prototype.length = function(){
    return Math.sqrt(this.x * this.x + this.y * this.y);
}


vec.prototype.normalize = function(){
    let len = this.length();
    if(len > 0) {this.x /= len; this.y /= len;}
    else {this.x = 0; this.y = 0;}
}


vec.prototype.limit = function(lim){
    let len = this.length();
    if(len > lim){
        this.normalize();
        this.scale(lim);
    }
}


function dist(v1, v2){
    var v3 = v1.sub(v2);
    return v3.length();
}