function vec(x, y){
	this.x = x;
	this.y = y;


	this.add = function(vc){
		return new vec(this.x + vc.x, this.y + vc.y);
	}

	this.sub = function(vc){
		return new vec(this.x - vc.x, this.y - vc.y);
	}

	this.scale = function(scalar){
		return new vec(this.x * scalar, this.y * scalar);
	}


	// Returns the length of the vector
	this.length = function() 
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}



	// Normalizes the vector
	this.normalize = function()
	{
		var length = this.length(this);

		if (length != 0) {
			this.x /= length;
			this.y /= length;
		}
	}
}