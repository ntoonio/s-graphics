function settings() {
	return '<h1>Ruta 2</h1><p id="note">Du behöver inte ange namn och beskrivning</p><h3>Bakgrundsbild</h3><input id="inp" type="file"><h3>Namn</h3><input id="name"><h3>Beskrivning</h3><textarea id="description" cols="30" rows="2"></textarea><h3>Text</h3><textarea id="textlines" cols="30" rows="10"></textarea>'
}

function render(lines, name, description, bgImgData, complete) {
	document.fonts.ready.then(function () {
		var canvas = document.createElement("canvas")
		canvas.height = "1080"
		canvas.width = "1080"
		
		var ctx = canvas.getContext("2d")
		var backgorundImg = new Image()
		backgorundImg.src = bgImgData
		
		backgorundImg.onload = function() {
			ctx.drawImage(this, 0, 0, canvas.width, canvas.height)
			
			// Draw main text
			// canvasHeight - marginBottom - fontSize * lines.length
			const marginTop = ctx.canvas.height - 90 - 120 * lines.length
			sText(ctx, lines, 120, 70, marginTop)
			
			// Draw name
			ctx.fillStyle = "white"
			ctx.font = "bold 24px Avenir LT Std"
			ctx.fillText(name, 110, 150)
			
			// Draw description
			var p = 180
			ctx.font = "24px Avenir LT Std"
			description.forEach(line => {
				ctx.fillText(line, 110, p)
				p += 24
			})
			
			// Draw logo
			var logoImg = new Image()
			logoImg.src = "img/s-logo_standing_neg_1000.png"
			logoImg.onload = function() {
				ctx.drawImage(this, 815, 85, this.width / 5.5, this.height / 5.5)
				
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

	var description = document.getElementById("description").value.split("\n")
	
	if (document.getElementById("description").value == "") {
		description = []
	}
	var name = document.getElementById("name").value

	render(lines, name, description, imgData, completion)
}

setup()
document.getElementById("inp").addEventListener("change", readFile)