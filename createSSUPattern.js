function settings() {
	return '<h1>SSU Mönster</h1><p><b>Bredd</b> <input id="dimension_width" type="number" value="1080"></p><p><b>Höjd</b> <input id="dimension_height" type="number" value="1080"></p><p><b>Färg</b> <select id="color"><option value="offwhite">Off-white</option><option value="red">Röd</option></select></p><p><b>Upprepningar</b> <input id="repeats" type="number" value="4"></p>'
}

function render(color, repeats, width, height, completion) {
	const canvas = document.createElement("canvas")
	canvas.width = width
	canvas.height = height

	const ctx = canvas.getContext("2d")

	const sqWidth = canvas.width / repeats
	const verticalRepeats = Math.ceil(canvas.height / sqWidth)

	const imgSrc = "img/pattern/" + color + ".svg"

	for (let i = 0; i < verticalRepeats; i++) {
		for (let j = 0; j < repeats; j++) {
			var img = new Image()
			img.src = imgSrc

			img.onload = function() {
				ctx.drawImage(this, sqWidth * j, sqWidth * i, sqWidth, sqWidth)
			}
		}
	}

	completion(canvas)
}

function generate(completion) {
	const color = document.getElementById("color").value
	const repeats = document.getElementById("repeats").value
	const width = document.getElementById("dimension_width").value
	const height = document.getElementById("dimension_height").value

	render(color, repeats, width, height, completion)
}

setup()