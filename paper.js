function settings() {
	return '<h1>Papper</h1><p class="settings-note">En liten notis för den som är petig med färger: Programmet använder RGB-färger, det betyder att ifall du tänker skriva ut bilden kommer inte färgerna vara exakt samma som de är på skärmen</p><h3>Storlek</h3><select id="size"><option value="7016">A1</option><option value="4960">A2</option><option value="3508">A3</option><option value="2480" selected>A4</option><option value="1748">A5</option><option value="1240">A6</option><option value="8350">B1</option><option value="5906">B2</option><option value="4169">B3</option><option value="2953">B4</option><option value="2079">B5</option><option value="1476">B6</option></select><h3>Bakgrundsbild</h3><input id="inp" type="file"><h3>Text</h3><textarea id="textlines" cols="30" rows="10"></textarea><h3>Ett tryggare...</h3><input id="secure" type="text" value="Sverige"><h3>Logga</h3><p><b>Positiv</b> <input type="checkbox" id="logo_pos"></p>'
}

function render(lines, bgImgData, secure, canvasSize, logoPos, complete) {
	document.fonts.ready.then(function () {
		var canvas = document.createElement("canvas")
		canvas.height = Math.pow(2, 0.5) * canvasSize
		canvas.width = canvasSize

		var ctx = canvas.getContext("2d")
		var backgorundImg = new Image()
		backgorundImg.src = bgImgData

		backgorundImg.onload = function() {
			ctx.drawImage(this, 0, 0, canvas.width, canvas.height)

			// Draw main text
			// canvasHeight - marginBottom - fontSize * lines.length
			const marginTop = ctx.canvas.height - 0.1008064516 * canvasSize - 0.1048387097 * canvasSize * lines.length
			sText(ctx, lines, 0.1048387097 * canvasSize, 0.07258064516 * canvasSize, marginTop)
			
			// Draw sub-text
			ctx.font = 0.03629032258 * canvasSize + "px Kapra Neue Custom"
			ctx.fillStyle = "white"
			ctx.fillText("Ett starkare samhälle. Ett tryggare " + secure + ".".toUpperCase(), 0.06451612903 * canvasSize, 1.3266129032 * canvasSize + 0.028125 * canvasSize)

			// Draw logo
			var logoImg = new Image()
			logoImg.src = "img/s-logo/standing_" + (logoPos ? "pos" : "neg") + ".svg"
			logoImg.onload = function() {
				ctx.drawImage(this, 0.7580645161 * canvasSize, 1.185483871 * canvasSize, 0.1987903226 * canvasSize, 0.1741935484 * canvasSize)
				
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
	const lines = document.getElementById("textlines").value.split("\n")
	const secure = document.getElementById("secure").value
	const size = document.getElementById("size").value
	const logoPos = document.getElementById("logo_pos").checked

	render(lines, imgData, secure, size, logoPos, completion)
}

setup()
document.getElementById("inp").addEventListener("change", readFile)