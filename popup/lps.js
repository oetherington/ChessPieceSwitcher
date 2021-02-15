function listenForClicks() {
	function reportError(error) {
		console.error(`Could not initialize: ${error}`);
	}

	document.querySelector("#apply-button").addEventListener("click", (e) => {
		function apply(tabs) {
			browser.tabs.sendMessage(tabs[0].id, {
				command: "apply",
				pawn: document.getElementById("pawn-select").value,
				knight: document.getElementById("knight-select").value,
				bishop: document.getElementById("bishop-select").value,
				rook: document.getElementById("rook-select").value,
				queen: document.getElementById("queen-select").value,
				king: document.getElementById("king-select").value,
			});
		}

		browser.tabs.query({ active: true, currentWindow: true })
			.then(apply)
			.catch(reportError);
	});

	document.querySelector("#reset-button").addEventListener("click", (e) => {
		function reset(tabs) {
			browser.tabs.sendMessage(tabs[0].id, {
				command: "reset",
			});
		}

		browser.tabs.query({ active: true, currentWindow: true })
			.then(reset)
			.catch(reportError);
	});
}

function reportExecuteScriptError(error) {
	document.querySelector("#popup-content").classList.add("hidden");
	document.querySelector("#error-content").classList.remove("hidden");
	console.error(`Failed to execute script: ${error.message}`);
}

document.addEventListener("DOMContentLoaded", function(event) {
	browser.tabs.executeScript({ file: "/popup/browser-polyfill.js" })
		.then(function() {
			browser.tabs.executeScript({ file: "/content_scripts/apply.js" })
				.then(listenForClicks)
				.catch(reportExecuteScriptError);
		})
		.catch(reportExecuteScriptError);
});
