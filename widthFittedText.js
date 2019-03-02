function settings() {
	return '<h1>Vidd-anpassad text</h1><p class="settings-note">Tanken med det här verktyget är att du ska kunna skapa din egen "vidd-anpassade" text, som du kan lägga till över en bild med ett annat program</p><textarea id="textlines" cols="30" rows="10"></textarea><h3>Vidd</h3><input id="width" type="number" value="700"></input>'
}

function render(lines, width, complete) {
	document.fonts.ready.then(function () {
		var canvas = document.createElement("canvas")
		var ctx = canvas.getContext("2d")
		
		const padding = calculateMeanPadding(ctx, lines, width)

		canvas.height = getWidthFittedHeight(ctx, lines, width, padding, true) + 10
		canvas.width = parseInt(width) + 2 * padding + 10
		
		sTextWidthFitted(ctx, lines, width, padding, width / 2 + padding + 5, 5, true)
		
		complete(canvas)
	})
}

function generate(completion) {
	const lines = document.getElementById("textlines").value.split("\n")
	const width = document.getElementById("width").value

	render(lines, width, completion)
}

setup()