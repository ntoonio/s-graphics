const sRed = "rgb(255, 0, 0)"
const sOrange = "rgb(255, 122, 0)"
const sPink = "rgb(255, 218, 212)"
const sRightBlue = "rgb(0, 80, 251)"
const sDarkRed = "rgb(180, 13, 30)"
const transparent = "rgba(0, 0, 0, 0)"

const styles = {
	"1": {
		"bg": sRed,
		"txt": "white"
	},
	"2": {
		"bg": "white",
		"txt": sRed
	},
	"3": {
		"bg": sOrange,
		"txt": "white"
	},
	"4": {
		"bg": sPink,
		"txt": sRed
	},
	"5": {
		"bg": transparent,
		"txt": "white"
	},
	"6": {
		"bg": transparent,
		"txt": sRed
	},
	"7": {
		"bg": sDarkRed,
		"txt": "white"
	},
	"8": {
		"bg": sRightBlue,
		"txt": "white"
	}
}

function getStyle(l) {
	if (l.startsWith("!")) {
		return l.substring(1, 2)
	}
	return "1"
}

function sText(ctx, lines, fs, marginLeft, marginTop, centered=false) {
	const padding = fs * 0.0625

	ctx.font = fs + "px Kapra Neue Custom"
	ctx.textBaseline = "alphabet"
	
	var p = marginTop
	
	lines.forEach(element => {
		const txt = element.replace(/^!\d/, "").toUpperCase()
		const style = styles[getStyle(element)]
		const txtWidth = ctx.measureText(txt).width

		// Draw main text background
		ctx.strokeStyle = style["bg"]
		ctx.fillStyle = style["bg"]

		var centerOffset = parseInt((txtWidth / 2) * (centered ? -1 : 0))
		
		const x = marginLeft - padding + centerOffset
		const y = p - padding
		const width = txtWidth + 2 * padding
		const height = fs * 0.76 + 2 * padding
		
		roundRect(ctx, x, y, width, height, padding, true)

		// Draw background for Å Ä Ö
		drawBackgorundAAO(ctx, txt, style, fs, p, marginLeft + centerOffset)

		// Draw main text
		ctx.fillStyle = style["txt"]
		ctx.fillText(txt, marginLeft + centerOffset, p + 0.76 * fs)

		if (txtWidth + marginLeft + padding > ctx.canvas.width - marginLeft - padding && !centered) {
			console.warn("Too wide text")
		}

		p += fs
	})
}

function drawBackgorundAAO(ctx, txt, style, fs, p, marginLeft) {
	const specChars = [{"char": "Å", "x1": -0.23 * fs, "y": -1/60*fs, "r": 0.16 * fs}, {"char": "Ä", "x1": -0.3375 * fs, "x2": -0.125 * fs, "y": -1/24 * fs, "r": 0.1375 * fs}, {"char": "Ö", "x1": -0.35 * fs, "x2": -0.15 * fs, "y": -1/24 * fs, "r": 0.1375 * fs}]

	specChars.forEach(char => {
		var indexes = []
		var i = -1
		while ((i = txt.indexOf(char["char"], i + 1)) >= 0) {
			indexes.push(i)
		}
		
		indexes.forEach(index => {
			const processed = txt.substring(0, index)
			ax = ctx.measureText(processed + char["char"]).width
			
			ctx.fillStyle = style["bg"]
			
			circle(ctx, marginLeft + ax + char["x1"], p + char["y"], char["r"])
			
			if ("x2" in char) {
				circle(ctx, marginLeft + ax + char["x2"], p + char["y"], char["r"])
			}
		})
	})
}

function sTextWidthFitted(ctx, lines, width, padding, marginLeft, marginTop, compensateAAO) {
	ctx.textBaseline = "alphabetic"
	
	// Center the text
	marginLeft -= width / 2

	var p = marginTop
	
	lines.forEach((line, i) => {
		const style = styles[getStyle(line)]
		line = line.replace(/^!\d/, "").toUpperCase()

		ctx.font = "100px Kapra Neue Custom"
		
		const fs = 100 * width / ctx.measureText(line).width
		ctx.font = fs + "px Kapra Neue Custom"
		
		if (compensateAAO && i == 0) {
			if (line.includes("Å") || line.includes("Ä") || line.includes("Ö")) {
				p += 0.13 * fs
			}
		}
		
		// Calculate background square bounds
		const sqX = marginLeft - padding
		const sqY = p
		const sqWidth = ctx.measureText(line).width + 2 * padding
		const sqHeight = 0.76 * fs + 2 * padding
		
		ctx.fillStyle = style["bg"]
		ctx.strokeStyle = style["bg"]
		roundRect(ctx, sqX, sqY, sqWidth, sqHeight, padding, true)
		
		drawBackgorundAAO(ctx, line, style, fs, p + padding, marginLeft)
		
		ctx.fillStyle = style["txt"]
		ctx.fillText(line, marginLeft, p + padding - 7 / 1280 * fs + 0.76 * fs)

		p += 0.76 * fs + 3 * padding
	})
}

function getWidthFittedHeight(ctx, lines, width, padding, compensateAAO) {
	var p = 0
	lines.forEach((line, i) => {
		line = line.replace(/^!\d/, "").toUpperCase()
		ctx.font = "100px Kapra Neue Custom"
		const fs = 100 * width / ctx.measureText(line).width
		
		if (compensateAAO && i == 0) {
			if (line.includes("Å") || line.includes("Ä") || line.includes("Ö")) {
				p += 0.13 * fs
			}
		}

		p += 0.76 * fs + 3 * padding
	})

	return p - padding // Last iteration still adds bottom margin
}

function calculateMeanPadding(ctx, lines, width) {
	var totPadding = 0
	lines.forEach(line => {
		line = line.replace(/^!\d/, "").toUpperCase()
		ctx.font = "100px Kapra Neue Custom"
		const fs = 100 * width / ctx.measureText(line).width
		totPadding += fs/100*5
	})
	
	return totPadding / lines.length
}

function circle(ctx, x, y, radius) {
	ctx.beginPath()
	ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
	ctx.fill()
	ctx.closePath()
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
	if (typeof stroke == "undefined") {
		stroke = true
	}
	if (typeof radius === "undefined") {
		radius = 5
	}
	if (typeof radius === "number") {
		radius = {tl: radius, tr: radius, br: radius, bl: radius}
	}
	else {
		var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0}
		for (var side in defaultRadius) {
			radius[side] = radius[side] || defaultRadius[side]
		}
	}
	
	ctx.beginPath()
	ctx.moveTo(x + radius.tl, y)
	ctx.lineTo(x + width - radius.tr, y)
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
	ctx.lineTo(x + width, y + height - radius.br)
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
	ctx.lineTo(x + radius.bl, y + height)
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
	ctx.lineTo(x, y + radius.tl)
	ctx.quadraticCurveTo(x, y, x + radius.tl, y)
	ctx.closePath()

	if (fill) {
		ctx.fill()
	}
	if (stroke) {
		ctx.stroke()
	}
}

function rect(ctx, x, y, width, height) {
	ctx.beginPath()
	ctx.moveTo(x, y)
	ctx.lineTo(x + width, y)
	ctx.lineTo(x + width, y + height)
	ctx.lineTo(x, y + height)
	ctx.closePath()
	ctx.fill()
}

function testForFont(font) {
	const canvas = document.createElement("canvas")
	const ctx = canvas.getContext("2d")
	const s = "Hej en exempeltext som helst ska vara så lång som möjligt!.&5©212%0"

	ctx.font = "20px Times"
	const w1 = ctx.measureText(s).width
	ctx.font = "20px " + font
	const w2 = ctx.measureText(s).width

	return w1 !== w2
}