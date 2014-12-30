// View

var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	displayMiss: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};


// Model

var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	ships : [{ locations: ["0", "0", "0"],
				hits: ["", "", ""]
			},
			{ locations: ["0", "0", "0"],
				hits: ["", "", ""]
			},
			{ locations: ["0", "0", "0"],
				hits: ["", "", ""]
			}],
	
	fire: function(guess) { // i.e. guess = "10"
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i]; // Selecciona un barco
			//var locations = ship.locations; // establece que las locations son las que estan dentro del ship elegido en la linea anterior
			// Ahora hay que buscar guess dentro de locations
			//var index = locations.indexOf(guess); // indexOf busca dentro de un array un valor y cuando lo encuentra devuelve su index
			// Esta linea reemplaza a las dos anteriores:
			var index = ship.locations.indexOf(guess);
			if (index >= 0) { // >0 porque cuando no lo encuentra indexOf devuelve de index -1
				// We have a hit!
				ship.hits[index] = "hit";
				view.displayHit(guess); // Estas dos lineas son las que conectan con view
				view.displayMessage("HUNDIDO!");
				if (this.isSunk(ship)) {
					view.displayMessage("Hundiste mi barco!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("Fallaste.");
		return false; // Llega aca una vez que busco en todos los barcos y no encontro un hit, asi que es un "miss"
	},

	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},

	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i ++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength ));
		} else {
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength ));
			col = Math.floor(Math.random() * this.boardSize);
		}
	
		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = model.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}

};


// Controller

var controller = {
	guesses: 0,
	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("Hundiste todos mis barcos en " + this.guesses + " intentos.");
			}
		}
	}
}


// Help functions

function init() {
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

function handleFireButton() {
	var guessInput = document.getElementById("guessInput"); // guessInput es el campo que contiene el input del usuario
	var guess = guessInput.value; // "value" para obtener el valor del campo o el input del usuario, en este caso
	controller.processGuess(guess);

	guessInput.value = "";
}

function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	if (guess === null || guess.length !== 2) {
		alert("Oops, por favor colocá un número y letra del tablero.");
	} else {
		firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);

		if (isNaN(row) || isNaN(column)) {
			alert("Oops, eso no está en el tablero.");
		} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
			alert("Oops, eso no está en el tablero");
		} else {
			return row + column;
		}
	}
	return null;
}

window.onload = init;

// Tests

