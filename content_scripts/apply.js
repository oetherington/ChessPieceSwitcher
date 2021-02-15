(function() {
	if (window.hasRun)
		return;

	window.hasRun = true;

	var pieces = [
		"pawn",
		"knight",
		"bishop",
		"rook",
		"queen",
		"king",
	];

	var colors = [
		"white",
		"black",
	];

	var images = undefined;

	function init() {
		console.log("Initialising LichessPieceSwitcher...");

		images = {};

		for (var piece = 0; piece < pieces.length; piece++) {
			for (var color = 0; color < colors.length; color++) {
				var selector = "." + pieces[piece] + "." + colors[color];
				var style = getComputedStyle(document.querySelector(selector));
				images[selector] = style.backgroundImage;
			}
		}
	}

	function apply(message) {
		if (!images)
			init();

		console.log("Applying LichessPieceSwitcher...");

		var css = "";

		for (var piece = 0; piece < pieces.length; piece++) {
			for (var color = 0; color < colors.length; color++) {
				var col = colors[color];
				var src = message[pieces[piece]];
				var target = pieces[piece];
				css += ".is2d ." + target + "." + col + "{background-image:" +
					images[ "." + src + "." + col ] + ";}\n";
			}
		}

		var styles = document.getElementById("lps-styles");
		if (!styles) {
			styles = document.createElement("style");
			styles.setAttribute("id", "lps-styles");
			document.querySelector("head").appendChild(styles);
		}

		styles.innerHTML = css;
	}

	browser.runtime.onMessage.addListener((message) => {
		if (message.command === "apply") {
			apply(message);
		} else if (message.command === "reset") {
			for (var piece = 0; piece < pieces.length; piece++)
				message[pieces[piece]] = pieces[piece];
			apply(message);
		}
	});
})();
