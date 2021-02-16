(function() {
	if (window.hasRun)
		return;

	window.hasRun = true;

	const pieces = [
		"pawn",
		"knight",
		"bishop",
		"rook",
		"queen",
		"king",
	];

	const shortPieces = [
		"p",
		"n",
		"b",
		"r",
		"q",
		"k",
	];

	const colors = [
		"white",
		"black",
	];

	var images = {};
	var site = undefined;

	function isLichess() {
		var e = document.querySelector(".site-title a");
		return e && e.innerHTML && e.innerHTML.includes("lichess");
	}

	function isChessCom() {
		var e = document.querySelector(".chess-logo");
		return e && e.href && e.href.includes(".chess.com");
	}

	function lichessClass(piece, color) {
		return "." + pieces[piece] + "." + colors[color];
	}

	function chesscomClass(piece, color) {
		return "." + colors[color][0] + shortPieces[piece];
	}

	function longToShort(piece) {
		return piece == "knight" ? "n" : piece[0];
	}

	function init() {
		console.log("Initialising ChessPieceSwitcher...");

		if (isLichess()) {
			site = "lichess";

			for (var piece = 0; piece < pieces.length; piece++) {
				for (var color = 0; color < colors.length; color++) {
					var selector = lichessClass(piece, color);
					var style = getComputedStyle(document.querySelector(selector));
					images[selector] = style.backgroundImage;
				}
			}
		} else if (isChessCom()) {
			site = "chesscom";

			for (var piece = 0; piece < pieces.length; piece++) {
				for (var color = 0; color < colors.length; color++) {
					var selector = chesscomClass(piece, color);
					var style = getComputedStyle(document.querySelector(selector));
					images[selector] = style.backgroundImage;
				}
			}
		} else {
			console.log("Site is invalid: please visit lichess.org or chess.com");
			site = "invalid";
		}
	}

	function apply(message) {
		if (!site)
			init();

		console.log("Applying ChessPieceSwitcher... (site=" + site + ")");

		var css = "";

		if (site == "lichess") {
			for (var piece = 0; piece < pieces.length; piece++) {
				for (var color = 0; color < colors.length; color++) {
					var col = colors[color];
					var src = message[pieces[piece]];
					var target = pieces[piece];
					css += ".is2d ." + target + "." + col + "{background-image:" +
						images[ "." + src + "." + col ] + ";}\n";
				}
			}
		} else if (site == "chesscom") {
			var boardId = document.querySelector("chess-board").id;

			for (var piece = 0; piece < pieces.length; piece++) {
				for (var color = 0; color < colors.length; color++) {
					var col = colors[color][0];
					var src = longToShort(message[pieces[piece]]);
					var target = shortPieces[piece];
					css += "#" + boardId + " .piece." + col + target + ", " +
						"#" + boardId + " .promotion-piece." + col + target +
						"{background-image:" + images[ "." + col + src ] + " !important;}\n";
				}
			}
		} else {
			console.log("Error: Invalid site");
			return;
		}

		var styles = document.getElementById("lps-styles");
		if (!styles) {
			styles = document.createElement("style");
			styles.setAttribute("id", "lps-styles");
			document.querySelector("head").appendChild(styles);
		}

		styles.innerHTML = css;
	}

	function randomize(message) {
		function shuffle(array) {
			var currentIndex = array.length, temporaryValue, randomIndex;

			while (0 !== currentIndex) {
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}

			return array;
		}

		var order = null;

		if (message.dups) {
			order = [];
			var i = 0;

			if (!message.pawns) {
				order[i] = pieces[i];
				i += 1;
			}

			for ( ; i < pieces.length; i++) {
				var n = Math.round(Math.random() * 1000) % pieces.length;
				order[i] = pieces[n];
			}
		} else {
			if (message.pawns) {
				order = [ ...pieces ];
				shuffle(order);
			} else {
				order = [ ...pieces.slice(1) ];
				shuffle(order);
				order.unshift(pieces[0]);
			}
		}

		for (var i = 0; i < pieces.length; i++)
			message[pieces[i]] = order[i];

		apply(message);
	}

	function reset(message) {
		document.getElementById("lps-styles").remove();
	}

	browser.runtime.onMessage.addListener((message) => {
		if (message.command === "apply") {
			apply(message);
		} else if (message.command === "randomize") {
			randomize(message);
		} else if (message.command === "reset") {
			reset(message);
		}
	});
})();
