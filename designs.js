// set dob object variables
const appTitle=$("#app-title")
const instructions=$("#instructions");
const basics=$("#basics");
const controls=$("#controls");
const pixelCanvas=$('#pixelCanvas');
const sizePicker=$("#sizePicker")
let drawingToggle=true;
// Select color input
const gridColor=$('#colorPicker');
// Select size input
const gridHeight=$("#inputHeight")
const gridStretch=$("#inputStretch");
const stretchTable=[1, 1.25, 1.618, 2]
const stretchSymbol=["1", "5/4", "&phi", "2"]
function gridWidth() {
	return Math.round(stretchTable[gridStretch.val()]*gridHeight.val());
}

// When size is submitted by the user, call makeGrid()
function makeGrid() {
	pixelCanvas.empty();
	for (let i = 1; i <= gridHeight.val(); i++) {
		pixelCanvas.append('<tr></tr>');
		for (let j = 1; j<=gridWidth(); j++) {
			pixelCanvas.children().last().append("<td id='pixel-"+i+"-"+j+"'></td>");
		}
	}
}
sizePicker.change(function(e) {
	makeGrid();
	$('table tr td').css('border', ".5px solid grey")
	setTimeout(function() {
		$('table tr td').css('border', 'none');
    }, 500);
    $('#ratio').text(stretchSymbol[gridStretch.val()+1]);
    console.log(stretchSymbol[gridStretch.val()-1]);
});

// click function

$("#pixelCanvas").click(function(e) {
	// console.log(e.target);
	let pixelToChange = $(e.target);
	// if the click is dragged across the grid, this function prevents the <tr> from changing color
	if (pixelToChange.is('td')){
		pixelToChange.css('background-color', nextColor());
	// this allows you to create gradients across rows
	}else if (pixelToChange.is('tr')){
		pixelToChange.children().each(function() {
			$(this).css('background-color', incrementDrag());
		});
	// creates full screen gradient
	}else{
		pixelToChange.children().children().each(function() {
			$(this).css('background-color', incrementDrag());
		})
	}
});
// drawing function
$("#pixelCanvas").mouseover(function(e) {
	let dragPixel = $(e.target);
	if (drawingToggle){
		dragPixel.css('background-color', incrementDrag());
	}
	if (appTitle.css('display') !== "none"){
		appTitle.css('color', incrementDrag());
	}
});

// slowly morphing color formula
const colorWonk=$("#inputWonk");
const draggingColor=[255,200,100];
function incrementDrag() {
	let hexDrag="#"
	for (i=0; i<3; i++){
		draggingColor[i]+=Math.round((2**colorWonk.val())*(Math.random() -0.5));
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
const gremlinSpeed=$('#gremlin-speed');
gremlinSpeed.change(function() {
	theGremlin();
	theGremlin();
})
const gremlinRange=$('#gremlin-range');
gremlinRange.change(function() {
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
		let currentPixel=[Math.round(gridHeight.val()/2), Math.round(gridWidth()/2)];
		intervalID= setInterval(function(){
			let maxPixel=[gridHeight.val(), gridWidth()];
			let gremlinPixel;
			currentPixel
			if (trails){
					for (var i = gremlinRange.val(); i >= 0; i--) {
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
						gremlinPixel.css('background-color', incrementDrag());
						gremlinCount++;
						gremlinPixel.removeClass().addClass(gremlinCount.toString());
					}
			}else{
				for (var j = Number(gremlinRange.val()); j >= 0; j--) {
					for (var i = 1; i >= 0; i--) {
						currentPixel[i]+=randomPicker(-gremlinRange.val())
						if (currentPixel[i]>maxPixel[i]){
							currentPixel[i]-=Number(gremlinRange.val());
						} else if (currentPixel[i]<0){
							currentPixel[i]+=Number(gremlinRange.val());
						}
					}
					gremlinPixel=$(`#pixel-${currentPixel[0]}-${currentPixel[1]}`);
					gremlinPixel.css('background-color', incrementDrag());
					gremlinCount++;
					gremlinPixel.removeClass().addClass(gremlinCount.toString());
				}
			}
		}, gremlinSpeed.val()/4);
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

// click away menu
instructions.click(function(){
	instructions.slideUp(750);
})
// key commands
$(document).keypress(function (e) {
	if (e.which==32){
		drawingToggle = !drawingToggle;
	} else if (e.which==(101||69)){
		movingColors();
	} else if (e.which==(99||67)){
		makeGrid();
	} else if (e.which==(105||73)){
		// toggle instructions with 'i'
		if (instructions.css('display') !== "none"){
			instructions.stop(true, false).slideUp(750);
		}else{
			instructions.slideDown(750);
		}
	} else if (e.which==(104||72)){
		// toggle title with 'h'
		if (appTitle.css('display') !== "none"){
			appTitle.stop(true, false).hide();
		}else{
			appTitle.show();
		}
	} else if (e.which==(102||70)){
		// apply random grey filter with 'f'
		$('body').css("filter", filterEffects());
	} else if (e.which==(114||82)){
		$('body').css("filter", "");
	} else if (e.which==(119||87)){
		// toggle the gremlin
		theGremlin();
	} else if (e.which==(116||84)){
		// trails on and off
		trails=!trails
		theGremlin();
		theGremlin();
	} else if (e.which==(115||83)){
		// open the secret controls menu
		if (instructions.css('display') == "none"){
			instructions.slideDown(750);
			controls.css("display", "block");
			basics.css('display', 'none');
		} else {
			controls.css('display')=="none" ? controls.css("display", "block") : controls.css('display', 'none');
			basics.css('display')=="none" ? basics.css("display", "block") : basics.css('display', 'none');
		}
	} else if (e.which==(98||66)){
		$('body').css('background-color', randomColor());
	} else if (e.which==(110||78)){
		$('body').css('background-color', 'white');
	} else if (e.which==(103||71)){
        window.location.assign('https://github.com/MichaelManwaring/pixelart');
    // } else {
    }
  	console.log(e.which)
});

// // reverse speed range
// $(function() {
//   $("#rangeValue").text($("#gremlin-speed").val());

//   $("#gremlin-speed").on('change input', function() {
//     $("#rangeValue").text($(this).val());
//   });
// });

// stop mobile use untill further development
function mobileWarning() {
	if(window.innerWidth <= 800
		|| navigator.userAgent.match(/webOS/i)
		|| navigator.userAgent.match(/iPhone/i)
		|| navigator.userAgent.match(/iPad/i)
		|| navigator.userAgent.match(/iPod/i)
		|| navigator.userAgent.match(/BlackBerry/i)
		|| navigator.userAgent.match(/Windows Phone/i)
	) {
    	instructions.empty().append("<h2>Sorry, not yet available on mobile</h2>");
	}else{
		makeGrid();
	}
}
// startup code
$(mobileWarning());
$(function() {
	instructions.slideUp(1);
	instructions.delay(7500).slideDown(2000);
	appTitle.css('color', incrementDrag()).fadeIn(1000).fadeOut(6000);
})
