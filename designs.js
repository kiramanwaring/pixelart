// import incrementDrag from "./color";

// set dob object variables
const appTitle=document.getElementById("app-title")
const instructions=document.getElementById("instructions");
const basics=document.getElementById("basics");
const controls=document.getElementById("controls");
const pixelCanvas=document.getElementById("pixelCanvas");
const sizePicker=document.getElementById("sizePicker")
let drawingToggle=true;
// Select color input
// const gridColor=document.getElementById('colorPicker');
// Select size input
const gridHeight=document.getElementById("inputHeight")
const gridStretch=document.getElementById("inputStretch");
const stretchTable=[1, 1.25, 1.618, 2]
const stretchSymbol=["1", "5/4", "&phi", "2"]
function gridWidth() {
	return Math.round(stretchTable[gridStretch.value]*gridHeight.value);
}

// When size is submitted by the user, call makeGrid()
function makeGrid() {
	while (pixelCanvas.firstChild) {
		pixelCanvas.removeChild(pixelCanvas.firstChild);
	}
	for (let i = 1; i <= gridHeight.value; i++) {
		let newRow = "<tr id='row-"+i+"'></tr>";
		pixelCanvas.innerHTML = pixelCanvas.innerHTML + newRow;
		let currentRow = document.getElementById("row-"+i);
		for (let j = 1; j<=gridWidth(); j++) {
			let newPixel = "<td id='pixel-"+i+"-"+j+"'></td>"
			currentRow.innerHTML = currentRow.innerHTML + newPixel;
		}
	}
}

sizePicker.addEventListener('change',function(){
	makeGrid();
	document.getElementsByTagName('table tr td').style.border = ".5px solid grey";
	setTimeout(function() {
		document.getElementsByTagName('table tr td').style.border = 'none';
    }, 500);
    document.getElementById('ratio').text(stretchSymbol[gridStretch.value+1]);
    console.log(stretchSymbol[gridStretch.value-1]);
});

// click function

document.getElementById("pixelCanvas").click(function(e) {
	// console.log(e.target);
	let pixelToChange = $(e.target);
	// if the click is dragged across the grid, this function prevents the <tr> from changing color
	if (pixelToChange.is('td')){
		pixelToChange.style.backgroundColor = nextColor();
	// this allows you to create gradients across rows
	}else if (pixelToChange.is('tr')){
		pixelToChange.children().each(function() {
			this.style.backgroundColor = incrementDrag();
		});
	// creates full screen gradient
	}else{
		pixelToChange.children().children().each(function() {
			this.style.backgroundColor = incrementDrag();
		})
	}
});
// drawing function
document.getElementById("pixelCanvas").addEventListener('mouseover',function(e){
	let dragPixel = e.target;
	if (drawingToggle){
		dragPixel.style.backgroundColor = incrementDrag();
	}
	if (appTitle.style.display !== "none"){
		appTitle.style.color = incrementDrag();
	}
});

// slowly morphing color formula
const colorWonk=document.getElementById("inputWonk");
const draggingColor=[255,200,100];
function incrementDrag() {
	let hexDrag="#"
	for (i=0; i<3; i++){
		draggingColor[i]+=Math.round((2**colorWonk.value)*(Math.random() -0.5));
		draggingColor[i]>255 ? draggingColor[i]=255 : draggingColor[i]<0 ? draggingColor[i]=0 : true;
		dragFragment=draggingColor[i].toString(16)
		hexDrag+= (dragFragment.length==1 ? "0"+dragFragment : dragFragment);
	}
	return hexDrag;
}


// Random color formulas
function nextColor() {
	for (i=0; i<3; i++){
		draggingColor[i]=randomPicker(255);
	}
	return incrementDrag()
}
function randomColor() {
	let hexCode = "#";
	for(i=0; i<3; i++){
		hexCode+=randomHexFragment();
	}
    return hexCode;
}
function randomHexFragment() {
    let fragment = randomPicker(255).toString(16);
    return fragment.length == 1 ? "0" + fragment : fragment;
}
// the wandering random color gremlin
const gremlinSpeed=document.getElementById('gremlin-speed');
gremlinSpeed.addEventListener('change',function(){
	theGremlin();
	theGremlin();
})
const gremlinRange=document.getElementById('gremlin-range');
gremlinRange.addEventListener('change',function(){
	theGremlin();
	theGremlin();
})
let gremlinOn=false;
let intervalID;
let gremlinCount=0;
let trails=true;
function theGremlin() {
	if (gremlinOn) {
		clearInterval(intervalID);
	} else {
		let currentPixel=[Math.round(gridHeight.value/2), Math.round(gridWidth()/2)];
		intervalID= setInterval(function(){
			let maxPixel=[gridHeight.value, gridWidth()];
			let gremlinPixel;
			currentPixel
			if (trails){
					for (var i = gremlinRange.value; i >= 0; i--) {
						gremlinPixel=undefined;
						let upPix=$(`#pixel-${currentPixel[0]-1}-${currentPixel[1]}`);
						let downPix=$(`#pixel-${currentPixel[0]+1}-${currentPixel[1]}`);
						let leftPix=$(`#pixel-${currentPixel[0]}-${currentPixel[1]-1}`);
						let rightPix=$(`#pixel-${currentPixel[0]}-${currentPixel[1]+1}`);
						let moves = [];
						rightPix.length ? moves.push(rightPix) : true;
						upPix.length ? moves.push(upPix) : true;
						leftPix.length ? moves.push(leftPix) : true;
						downPix.length ? moves.push(downPix) : true;
						// console.log(moves);
						move =shuffle(moves);
						// console.log(moves);
						let lowest=Number.POSITIVE_INFINITY;
						moves.forEach(function(pixel) {
							// console.log(pixel)
							if (pixel.attr('class')){
								if (lowest>Number(pixel.attr('class'))){lowest=Number(pixel.attr('class'))};
							} else {
								gremlinPixel=pixel;
							}
						});
						if (gremlinPixel && gremlinPixel.length){
							// console.log(gremlinPixel)
						} else {
							moves.forEach(function(pixel) {
								if (lowest===Number(pixel.attr('class'))){gremlinPixel=pixel};
							});
						}
						gremlinPixel === upPix ? currentPixel[0]-- : gremlinPixel === downPix ? currentPixel[0]++ : gremlinPixel === leftPix ? currentPixel[1]-- : gremlinPixel === rightPix ? currentPixel[1]++ : console.log('MOVE ERROR');
						// console.log(currentPixel);
						gremlinPixel.style.backgroundColor = incrementDrag();
						gremlinCount++;
						gremlinPixel.removeClass().addClass(gremlinCount.toString());
					}
			}else{
				for (var j = Number(gremlinRange.value**2); j >= 0; j--) {
					for (var i = 1; i >= 0; i--) {
						currentPixel[i]+=randomPicker(-gremlinRange.value)
						if (currentPixel[i]>maxPixel[i]){
							currentPixel[i]-=Number(gremlinRange.value);
						} else if (currentPixel[i]<0){
							currentPixel[i]+=Number(gremlinRange.value);
						}
					}
					gremlinPixel=$(`#pixel-${currentPixel[0]}-${currentPixel[1]}`);
					gremlinPixel.style.backgroundColor = incrementDrag();
					gremlinCount++;
					gremlinPixel.removeClass().addClass(gremlinCount.toString());
				}
			}
		}, gremlinSpeed.value/4);
	}
	gremlinOn=!gremlinOn;
}

// filter effects
function filterEffects() {
	let filterCobmo="blur("+(Math.random()*2)+"px) ";
	filterCobmo+="brightness("+(0.75+Math.random()/2)+") ";
	filterCobmo+="contrast("+(125+randomPicker(-50))+"%) ";
	// filterCobmo+="opacity("+(100+randomPicker(-50))+"%) ";
	filterCobmo+="saturate("+(125+randomPicker(-50))+"%) ";
	// filterCobmo+="sepia("+randomPicker(100)+"%)";
	return filterCobmo;
}

let movingOn=false;
let movingId;
function movingColors(argument) {
	if (movingOn){
		clearInterval(movingId);
		pixelCanvas.css("filter", "");
	} else {
		let colorRotation=0;
		movingId=setInterval(function(){
			colorRotation+=1+randomPicker(-2);
			pixelCanvas.css("filter", "hue-rotate("+colorRotation+"deg)");
		}, 100);
	}
	movingOn=!movingOn;
}

// random range selector, use negative values to select between -x to x
function randomPicker(randomRange) {
	if (randomRange<0){
		return Math.round(2*randomRange*(Math.random()-0.5));
	} else {
		return Math.round(randomRange*Math.random());
	}
}
// shuffler
function shuffle (array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

// // click away menu
// basics.click(function(){
// 	instructions.slideUp(750);
// })


// key commands
document.addEventListener("keydown", (event) => {
	console.log(event.key)
	if (event.key==32){
		drawingToggle = !drawingToggle;
	} else if (event.key==(101||69)){
		movingColors();
	} else if (event.key==(99||67)){
		makeGrid();
	} else if (event.key==(105||73)){
		// toggle instructions with 'i'
		if (instructions.style.display !== "none"){
			instructions.stop(true, false).slideUp(750);
			controls.style.display = 'none';
			basics.css("display", "block")
		}else{
			instructions.slideDown(750);
		}
	} else if (event.key==(104||72)){
		// toggle title with 'h'
		if (appTitle.style.display !== "none"){
			appTitle.stop(true, false).hide();
		}else{
			appTitle.show();
		}
	} else if (event.key==(102||70)){
		// apply random grey filter with 'f'
		document.getElementById('body').css("filter", filterEffects());
	} else if (event.key==(114||82)){
		document.getElementById('body').css("filter", "");
	} else if (event.key==(119||87)){
		// toggle the gremlin
		theGremlin();
	} else if (event.key==(116||84)){
		// trails on and off
		trails=!trails
		theGremlin();
		theGremlin();
	} else if (event.key==('s')){
		// open the secret controls menu
		if (controls.style.display == "none"){
			instructions.slideDown(750);
			controls.style.display = "block";
			basics.style.display = 'none';
		} else {
			instructions.slideUp(750);
			setTimeout(function() {
				controls.style.display =="none" ? controls.css("display", "block") : controls.style.display = 'none';
				basics.style.display =="none" ? basics.css("display", "block") : basics.style.display = 'none';
			}, 750)
		}
	} else if (event.key==(98||66)){
		document.getElementById('body').style.backgroundColor = randomColor();
	} else if (event.key==(110||78)){
		document.getElementById('body').style.backgroundColor = 'white';
    // } else {
    }
});

// // reverse speed range
// $(function() {
//   document.getElementById("rangeValue").text(document.getElementById("gremlin-speed").value);

//   document.getElementById("gremlin-speed").on('change input', function() {
//     document.getElementById("rangeValue").text(this.value);
//   });
// });

// stop mobile use untill further development
// function mobileWarning() {
// 	if(window.innerWidth <= 800
// 		|| navigator.userAgent.match(/webOS/i)
// 		|| navigator.userAgent.match(/iPhone/i)
// 		|| navigator.userAgent.match(/iPad/i)
// 		|| navigator.userAgent.match(/iPod/i)
// 		|| navigator.userAgent.match(/BlackBerry/i)
// 		|| navigator.userAgent.match(/Windows Phone/i)
// 	) {
//     	instructions.empty().append("<h2>Sorry, not yet available on mobile</h2>");
// 	}else{
// 		makeGrid();
// 	}
// }
// startup code
// $(mobileWarning());
function beginSoothing() {
	// instructions.slideUp(1);
	// instructions.delay(7500).slideDown(2000);
	// appTitle.style.color = incrementDrag().fadeIn(1000).fadeOut(6000);
	// setTimeout(function() {
		// basics.append("<p style='italics'>Press 's' for the secret menu<p>");
		// }, 20000);
	}
	
	makeGrid();