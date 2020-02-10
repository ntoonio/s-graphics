function settings() {
	return '<h1>Rösta på</h1><h3>Storlek</h3><select id="size"><option value="1080" selected>Fyrkant (1080x1080)</option><option value="7016">A1</option><option value="4960">A2</option><option value="3508">A3</option><option value="2480" selected>A4</option><option value="1748">A5</option><option value="1240">A6</option><option value="8350">B1</option><option value="5906">B2</option><option value="4169">B3</option><option value="2953">B4</option><option value="2079">B5</option><option value="1476">B6</option></select><h3>Bakgrundsbild</h3><input id="inp" type="file"><h3>Namn</h3><textarea id="name" cols="30" rows="2"></textarea><h3>Andra text</h3><input id="subText" value=""><p>Till exempel</p><ul><li>#27 kommunfullmäktige</li><li>Den 9 september</li><li>För vår framtid</li></ul><h3>Ett tryggare...</h3><input id="secure" type="text" value="Sverige"><h3>Logga</h3><p><b>Positiv</b> <input type="checkbox" id="logo_pos"></p>'
}

function render(lines, bgImgData, secure, subText, canvasSize, logoPos, complete) {
	document.fonts.ready.then(function () {
		var canvas = document.createElement("canvas")

		if (canvasSize == 1080) {
			canvas.height = 1080
		}
		else {
			canvas.height = Math.pow(2, 0.5) * canvasSize
		}

		canvas.width = canvasSize

		var ctx = canvas.getContext("2d")
		var backgorundImg = new Image()
		backgorundImg.src = bgImgData

		function startRender() {
			ctx.drawImage(backgorundImg, 0, 0, canvas.width, canvas.height)

			const marginBottom = 120/1080*canvasSize

			const mainTextSize = 115/1080*canvasSize
			const mainTextPadding = mainTextSize * 0.0625
			const mainTextMarginLeft = 80/1080*canvasSize

			const subTextSize = 55/1080*canvasSize
			const subTextsMarginLeft = mainTextMarginLeft - mainTextPadding + 55 * 0.0625

			const marginTopSubText = ctx.canvas.height - marginBottom - subTextSize
			const marginTopMainText = marginTopSubText - mainTextSize * lines.length + 10/1080*canvasSize
			const marginTopVoteFor = marginTopMainText - subTextSize - 5/1080*canvasSize

			// Draw sub text
			sText(ctx, ["!7" + subText], subTextSize, subTextsMarginLeft, marginTopSubText)

			// Draw "Vote for" text
			sText(ctx, ["!3Rösta på"], subTextSize, subTextsMarginLeft, marginTopVoteFor)

			// Draw main text
			sText(ctx, lines, mainTextSize, mainTextMarginLeft, marginTopMainText)

			// Draw sub-text
			ctx.font = 40/1080*canvasSize + "px Kapra Neue Custom"
			ctx.fillStyle = "white"
			ctx.fillText("Ett starkare samhälle. Ett tryggare " + secure + ".".toUpperCase(), 70/1080*canvasSize, ctx.canvas.height - 70/1080*canvasSize)

			// Draw logo
			var logoImg = new Image()
			logoImg.src = "img/s-logo/standing_" + (logoPos ? "pos" : "neg") + ".svg"
			logoImg.onload = function() {
				ctx.drawImage(this, 820/1080*canvasSize, ctx.canvas.height - 250/1080*canvasSize, this.width / 1.8/1080*canvasSize, this.height / 1.8/1080*canvasSize)

				complete(canvas)
			}
		}

		if (backgorundImg.onload == "") {
			startRender()
		}
		else {
			backgorundImg.onload = startRender()
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
	const lines = document.getElementById("name").value.split("\n")
	const secure = document.getElementById("secure").value
	const subText = document.getElementById("subText").value
	const size = document.getElementById("size").value
	const logoPos = document.getElementById("logo_pos").checked

	render(lines, imgData, secure, subText, size, logoPos, completion)
}

setup()
document.getElementById("inp").addEventListener("change", readFile)
