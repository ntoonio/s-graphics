function settings() {
	return '<h1>Egen</h1><h3>Dimensioner</h3><p><b>Bredd</b> <input id="dimension_width" type="number" value="1080"></p><p><b>Höjd</b> <input id="dimension_height" type="number" value="1080"></p><h3>Bakgrundsbild</h3><input id="inp" type="file"><h3>Texter</h3><ul id="texts"></ul><input type="submit" value="Lägg till text" onclick="addText()"><h3>Logga</h3><select id="logo-select"><option value="standing-neg">Stående negativ</option><option value="standing-pos">Stående positiv</option><option value="laying-neg">Liggande negativ</option><option value="laying-pos">Liggande positiv</option></select><p><b>X</b> <input id="logo_pos_x" type="number" value="970"></p><p><b>Y</b> <input id="logo_pos_y" type="number" value="990"></p><p><b>Skala</b> <input id="logo_scale" type="number" value="3"></p>'
}

function textElementHTML() {
	return '<h4>Text</h4><p><b>X</b> <input class="text_pos_x" type="number" value="0"></p><p><b>Y</b> <input class="text_pos_y" type="number" value="0"><p><b>Storlek</b> <input class="text_size" type="number" value="70"></p></p><textarea class="text_text" cols="30" rows="5"></textarea><p><b>Justering</b> <select class="text_justify"><option value="normal">Normal</option><option value="center">Center</option><option value="width">Vidd-anpassad</option></select></p><input class="text_remove" type="submit" value="Ta bort text">'
}

function render(json, complete) {
	document.fonts.ready.then(function () {
		var canvas = document.createElement("canvas")
		canvas.width = json.width
		canvas.height = json.height
		
		var ctx = canvas.getContext("2d")

		var backgorundImg = new Image()
		backgorundImg.src = json.bgImg
		
		backgorundImg.onload = function() {
			ctx.drawImage(this, 0, 0, canvas.width, canvas.height)

			json.texts.forEach(text => {
				const lines = text.text.split("\n")

				if (text.justify == "width") {
					const padding = calculateMeanPadding(ctx, lines, text.size)
					sTextWidthFitted(ctx, lines, text.size, padding, text.x, text.y, false)
				}
				else if (text.justify == "normal") {
					sText(ctx, lines, text.size, text.x, text.y)
				}
				else if (text.justify == "center") {
					sText(ctx, lines, text.size, text.x, text.y, true)
				}
			})
			
			var logoImg = new Image()
			logoImg.src = "img/s-logo/" + json.logo.img.replace("-", "_") + ".svg"

			logoImg.onload = function() {
				const l = json.logo
				const newWidth = this.width / l.scale
				const newHeight = this.height / l.scale

				ctx.drawImage(this, l.x - newWidth / 2, l.y - newHeight / 2, newWidth, newHeight)

				complete(canvas)
			}
		}
	})
}

function addText() {
	const li = document.createElement("li")
	li.innerHTML = textElementHTML()
	li.getElementsByClassName("text_remove")[0].addEventListener("click", function () {this.parentElement.remove()})
	
	document.getElementById("texts").appendChild(li)
}

var imgData = ""

function readFile() {
	if (this.files && this.files[0]) {
		var FR = new FileReader()
		FR.addEventListener("load", function(e) {
			imgData = e.target.result
		})
		FR.readAsDataURL(this.files[0])
	}
}

function generate(completion) {
	render(buildJSON(), completion)
}

function buildJSON() {
	const dict = {
		"width": parseInt(document.getElementById("dimension_width").value),
		"height": parseInt(document.getElementById("dimension_height").value),

		"bgImg": imgData,

		"logo": {
			"img": document.getElementById("logo-select").value,
			"x": parseInt(document.getElementById("logo_pos_x").value),
			"y": parseInt(document.getElementById("logo_pos_y").value),
			"scale": parseInt(document.getElementById("logo_scale").value)
		},

		"texts": []
	}

	document.getElementById("texts").childNodes.forEach(liChild => {
		const d = {
			"text": liChild.getElementsByClassName("text_text")[0].value,
			"size": parseInt(liChild.getElementsByClassName("text_size")[0].value),
			"x": parseInt(liChild.getElementsByClassName("text_pos_x")[0].value),
			"y": parseInt(liChild.getElementsByClassName("text_pos_y")[0].value),
			"justify": liChild.getElementsByClassName("text_justify")[0].value,
		}

		dict.texts.push(d)
	})

	return dict
}

setup()
document.getElementById("inp").addEventListener("change", readFile)