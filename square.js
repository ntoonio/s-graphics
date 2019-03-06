function settings() {
	return '<h1>Ruta</h1><h3>Bakgrundsbild</h3><input id="inp" type="file"><h3>Text</h3><textarea id="textlines" cols="30" rows="10"></textarea>'
}

function render(lines, bgImgData, complete) {
	document.fonts.ready.then(function () {
		var canvas = document.createElement("canvas")
		canvas.height = "1080"
		canvas.width = "1080"
		
		var ctx = canvas.getContext("2d")
		var backgorundImg = new Image()
		backgorundImg.src = bgImgData
		
		backgorundImg.onload = function() {
			ctx.drawImage(this, 0, 0, canvas.width, canvas.height)
			
			ctx.fillStyle = sRed
			rect(ctx, 0, 980, 1080, 100)
			
			// Draw main text
			
			// canvasHeight - marginBottom - fontSize * lines.length
			const marginTop = ctx.canvas.height - 150 - 120 * lines.length
			sText(ctx, lines, 120, 70, marginTop)
			
			// Draw sub-text
			ctx.font = "32px Kapra Neue Custom"
			ctx.fillStyle = "white"
			ctx.fillText("Ett starkare samhälle. Ett tryggare Sverige.".toUpperCase(), 30, 1045)
			
			// Draw logo
			var logoImg = new Image()
			logoImg.src = "img/s-logo/laying_neg.svg"
			logoImg.onload = function() {
				ctx.drawImage(this, 750, 1000, this.width / 1.5, this.height / 1.5)
				
				complete(canvas)
			}
		}
	})
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
	var lines = document.getElementById("textlines").value.split("\n")

	if (document.getElementById("textlines").value == "") {
		lines = []
	}

	render(lines, imgData, completion)
}

setup()
document.getElementById("inp").addEventListener("change", readFile)