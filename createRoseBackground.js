function settings() {
	return '<h1>Ros-bakgrund</h1><p><b>Bredd</b> <input id="dimension_width" type="number" value="1080"></p><p><b>Stil</b> <select id="style"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></p><p><b>Färg</b> <select id="color"><option value="1">Ljus-röd</option><option value="2">Mörk-röd</option><option value="3">Off-white</option></select></p>'
}

function render(style, color, width, completion) {
	const canvas = document.createElement("canvas")
	canvas.width = width

	const ctx = canvas.getContext("2d")

	var img = new Image()
	img.src = "img/rose/" + style + "_" + color + ".svg"
	img.onload = function() {
		canvas.height = this.height / this.width * canvas.width

		ctx.drawImage(this, 0, 0, canvas.width, canvas.height)

		completion(canvas)
	}
}

function generate(completion) {
	const color = document.getElementById("color").value
	const style = document.getElementById("style").value
	const width = document.getElementById("dimension_width").value

	render(style, color, width, completion)
}

setup()