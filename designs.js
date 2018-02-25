// Select color input
const gridColor=$('#colorPicker');
// Select size input
const gridHeight=$("#inputHeight")
const gridStretch=$("#inputStretch");
const stretchTable=[0.618, 1, 1.25, 1.618, 2]
function gridWidth() {
	return Math.round(stretchTable[gridStretch.val()-1]*gridHeight.val());
}
// When size is submitted by the user, call makeGrid()

const pixelCanvas=$('#pixelCanvas');
let drawingToggle=true;

function makeGrid() {
	pixelCanvas.empty();
	for (let i = 1; i < gridHeight.val(); i++) {
		pixelCanvas.append('<tr></tr>');
		for (let j = 1; j<gridWidth(); j++) {
			pixelCanvas.children().last().append("<td id='pixel-"+i+"-"+j+"'></td>");
		}
	}
}
$("#sizePicker").change(function(e) {
	makeGrid();
	$('table tr td').css('border', ".5px solid grey")
	setTimeout(function() {
		$('table tr td').css('border', 'none');
    }, 500);
});



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

// slowly morphing color formula
const colorWonk=$("#inputWonk");
const draggingColor=[230,180,190];
function incrementDrag() {
	let hexDrag="#"
	for (i=0; i<3; i++){
		draggingColor[i]+=Math.round((2.154**colorWonk.val())*(Math.random() -0.5));
		draggingColor[i]>255 ? draggingColor[i]=255 : draggingColor[i]<0 ? draggingColor[i]=0 : true;
		dragFragment=draggingColor[i].toString(16)
		hexDrag+= (dragFragment.length==1 ? "0"+dragFragment : dragFragment);
	}
	console.log(draggingColor);
	return hexDrag;
}

// drawing function
$("#pixelCanvas").mouseover(function(e) {
	let dragPixel = $(e.target);
	if (drawingToggle){
		dragPixel.css('background-color', incrementDrag());
	}
	if ($('#cover').css('display') !== "none"){
		$('#cover').css('color', incrementDrag());
	}
});

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
    var fragment = randomPicker(255).toString(16);
    return fragment.length == 1 ? "0" + fragment : fragment;
}

// random range selector, use negative values to select between -x to x
function randomPicker(randomRange) {
	if (randomRange<0){
		return Math.round(2*randomRange*(Math.random()-0.5));
	} else {
		return Math.round(randomRange*Math.random());
	}
}
// key commands
$(document).keypress(function (e) {
	if (e.which==32){
		drawingToggle = !drawingToggle;
	} else if (e.which==(99||67)){
		makeGrid();
	} else if (e.which==(105||73)){
		if ($('#instructions').css('display') !== "none"){
			$('#instructions').stop(true, false).slideUp(750);
		}else{
			$('#instructions').slideDown(750);
		}
	} else if (e.which==(104||72)){
		if ($('#cover').css('display') !== "none"){
			$('#cover').stop(true, false).hide();
		}else{
			$('#cover').show();
		}
	} else if (e.which==(102||70)){
		$("#filter").css("background-color", "rgba(")
	} else if (e.which==(115||83)){
		$("#controls").css('display')=="none" ? $("#controls").css("display", "block") : $("#controls").css('display', 'none');
		$("#basics").css('display')=="none" ? $("#basics").css("display", "block") : $("#basics").css('display', 'none');
	} else if (e.which==(103||71)){
        window.location.assign('https://github.com/MichaelManwaring/pixelart');
    }
});


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
    	$("#instructions").empty().append("<h2>Sorry, not yet available on mobile</h2>");
	}else{
		makeGrid();
	}
}
$(mobileWarning());
$(function() {
	$('#instructions').delay(7500).slideDown(1000);
	$('#cover').css('color', incrementDrag()).fadeIn(1000).fadeOut(16000);

})
