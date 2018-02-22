// Select color input
const gridColor=$('#colorPicker');
// Select size input
const gridSize=[$("#inputHeight"), $("#inputWeight")];
console.log(gridSize)
// When size is submitted by the user, call makeGrid()

const pixelCanvas=$('#pixelCanvas');
let drawingToggle=true;

function makeGrid() {
	pixelCanvas.empty();
	for (let i =  gridSize[0].val(); i > 0; i--) {
		pixelCanvas.append('<tr></tr>');
		for (let j = gridSize[1].val(); j > 0; j--) {
			pixelCanvas.children().last().append("<td></td>");
		}
	}
}

$("#sizePicker").submit(function(e) {
	makeGrid();
    e.preventDefault();
});


$("#pixelCanvas").click(function(e) {
	console.log(e.target);
	let pixelToChange = $(e.target);
	// if the click is dragged across the grid, this function prevents the <tr> from changing color
	if (pixelToChange.is('td')){
		pixelToChange.css('background-color', nextColor());
	}else if (pixelToChange.is('tr')){
		console.log("row");
		pixelToChange.children().each(function() {
			$(this).css('background-color', incrementDrag());
		});
	}else{
		console.log('table click');
		pixelToChange.children().children().each(function() {
			$(this).css('background-color', incrementDrag());
		})
	}
});

const draggingColor=[200,200,200];
function incrementDrag() {
	let hexDrag="#"
	for (i=0; i<3; i++){
		draggingColor[i]+=(Math.round(Math.random()*10) -5);
		draggingColor[i]>255 ? draggingColor[i]=255 : draggingColor[i]<0 ? draggingColor[i]=0 : true;
		dragFragment=draggingColor[i].toString(16)
		hexDrag+= (dragFragment.length==1 ? "0"+dragFragment : dragFragment);
	}
	return hexDrag;
}

$("#pixelCanvas").mouseover(function(e) {
	let dragPixel = $(e.target);
	if (drawingToggle){
		dragPixel.css('background-color', incrementDrag());
	}
});



function nextColor() {
	for (i=0; i<3; i++){
		draggingColor[i]=(Math.floor(Math.random() * 255));
	}
	return incrementDrag()
}

function randomColor() {
	let hexCode = "#";
	for(i=0; i<3; i++){
		hexCode+=randomHexFragment();
	}
    return hexCode
}

function randomHexFragment() {
    var fragment = (Math.floor(Math.random() * 255).toString(16));
    return fragment.length == 1 ? "0" + fragment : fragment;
}




$('body').mousemove(function() {
	// console.log('MOVE');
	if ($('#cover').css('display') !== "none"){
		$('#cover').stop(true, false).slideUp(500);
	}
	$('#cover').delay(10000).slideDown(500);
});

$('body').keypress(function (e) {
	if (e.which==32){
		makeGrid();
	} else if (e.which==100){
		drawingToggle = !drawingToggle;
	}
})

$(makeGrid());

