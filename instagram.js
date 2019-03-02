function render(lines, bgImgData, secure, complete) {
	document.fonts.ready.then(function () {
		var canvas = document.createElement("canvas")
		canvas.height = "1920"
		canvas.width = "1080"
		
		var ctx = canvas.getContext("2d")
		var backgorundImg = new Image()
		backgorundImg.src = bgImgData

		backgorundImg.onload = function() {
			ctx.drawImage(this, 0, 0, canvas.width, canvas.height)

			// Draw main text
			// canvasHeight - marginBottom - fontSize * lines.length
			const marginTop = ctx.canvas.height - 250 - 120 * lines.length
			sText(ctx, lines, 120, 70, marginTop)

			// Draw sub-text
			ctx.font = "40px Kapra Neue Custom"
			ctx.fillStyle = "white"
			ctx.fillText("Ett starkare samhälle. Ett tryggare " + secure + ".".toUpperCase(), 65, 1711)

			// Draw logo
			var logoImg = new Image()
			logoImg.src = "img/s-logo_standing_neg_1000.png"
			logoImg.onload = function() {
				ctx.drawImage(this, 830, 1520, this.width / 4.5, this.height / 4.5)
				
				complete(canvas)
			}
		}
	})
}

function settings() {
	return '<h1>Instagram story</h1><h3>Bakgrundsbild</h3><input id="inp" type="file"><h3>Text</h3><textarea id="textlines" cols="30" rows="10"></textarea><h3>Ett tryggare...</h3><input id="secure" type="text" value="Sverige">'
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
	const lines = document.getElementById("textlines").value.split("\n")
	const secure = document.getElementById("secure").value

	render(lines, imgData, secure, completion)
}

setup()
document.getElementById("inp").addEventListener("change", readFile)