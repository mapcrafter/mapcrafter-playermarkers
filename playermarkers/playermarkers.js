var INTERVAL = 5 * 1000;
var JSON_PATH = "/path/to/players.json";
var IMG_PATH = "/path/to/player.php?username=";

String.prototype.endswith = function(suffix) {
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function PlayerMarker(ui, username, world, pos) {
	this.ui = ui;
	
	this.username = username;
	this.world = world;
	this.active = false;
	
	this.marker = new google.maps.Marker({
		position: this.ui.mcToLatLng(pos.x, pos.z, pos.y),
		map: this.ui.gmap,
		title: this.username,
		icon: IMG_PATH + username
	});
	
	this.moveCounter = 0;
	this.start = null;
	this.destination = pos;
}

PlayerMarker.prototype.setActive = function(active) {
	if(active == this.active)
		return;
	this.active = active;
	if(active) {
		this.marker.setMap(this.ui.gmap);
	} else
		this.marker.setMap(null);
};

PlayerMarker.prototype.move = function(destination) {
	if(this.start != null) {
		this.marker.setPosition(this.ui.mcToLatLng(this.destination));
	}
	
	this.start = this.destination;
	this.destination = destination;
	
	var counter = this.moveCounter + 1;
	this.moveCounter++;
	
	var steps = INTERVAL / 1000 * 10;
	var step = steps;
	var time = (INTERVAL * 0.75) / step;
	
	var self = this;
	var animate = function() {
		if(counter < self.moveCounter) {
			return;
		}

		var latlng1 = self.ui.mcToLatLng(self.start.x, self.start.z, self.start.y);
		var latlng2 = self.ui.mcToLatLng(self.destination.x, self.destination.z, self.destination.y);
		
		var latDiff = latlng2.lat() - latlng1.lat();
		var lngDiff = latlng2.lng() - latlng1.lng();
		
		var lat = latlng2.lat() - latDiff*(step/steps);
		var lng = latlng2.lng() - lngDiff*(step/steps);
		self.marker.setPosition(new google.maps.LatLng(lat, lng));
		
		step--;
		if(step <= 0) {
			self.start = null;
			return;
		}
		window.setTimeout(animate, time);
	}
	
	this.timeout = window.setTimeout(animate, time);
};

MapPlayerMarkerHandler.prototype = new MapHandler();

function MapPlayerMarkerHandler() {
	this.players = {};
	
	this.currentWorld = "";
	this.documentTitle = document.title;
}

MapPlayerMarkerHandler.prototype.create = function() {
	ui = this.ui;
	
	var handler = function(self) {
		return function() {
			$.getJSON(JSON_PATH, function(data) { self.updatePlayers(data); });
		};
	}(this);
	
	window.setTimeout(handler, 500);
	window.setInterval(handler, INTERVAL);
};

MapPlayerMarkerHandler.prototype.onMapChange = function(name, rotation) {
	this.currentWorld = this.ui.getConfig(name).worldName;
	
	var playersOnline = 0;
	for(var i = 0; i < this.players.length; i++) {
		var player = this.players[i];
		player.setActive(player.world == this.currentWorld);
		if(player.active)
			playersOnline++;
	}
	
	document.title = "(" + playersOnline + ") " + this.documentTitle;
};

MapPlayerMarkerHandler.prototype.updatePlayers = function(data) {
	if(!data)
		return;
	
	var playersOnline = []
	for(var i = 0; i < data["players"].length; i++) {
		var user = data["players"][i];
		var username = user.username;
		var pos = {x: user.x, z: user.z, y: user.y};

		var player;

		if(user.username in this.players) {
			player = this.players[username];
		}
		else {
			player = new PlayerMarker(ui, username, user.world, pos);
			this.players[username] = player;
		}
		
		// TODO better world mapping
		player.setActive(user.world.endswith(this.currentWorld));
		
		if(player.active) {
			player.move(pos);
			playersOnline.push(username);
		}
	}
	
	for(var name in this.players) {
		if(playersOnline.indexOf(name) == -1) {
			this.players[name].setActive(false);
			delete this.players[name];
		}
	}

	document.title = "(" + playersOnline.length + ") " + this.documentTitle;
};

$(window).ready(function() {	
	Mapcrafter.addHandler(new MapPlayerMarkerHandler());
});
