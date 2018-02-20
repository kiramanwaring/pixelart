// Select color input
const gridColor=$('#colorPicker');
// Select size input
const gridSize=[$("#inputHeight"), $("#inputWeight")];
console.log(gridSize)
// When size is submitted by the user, call makeGrid()

const pixelCanvas=$('#pixelCanvas');

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
	console.log('click');
	let pixelToChange = $(e.target);
	// if the click is dragged across the grid, this function prevents the <tr> from changing color
	if (pixelToChange.is('td')){
		pixelToChange.css('background-color', nextColor());
	}else if (pixelToChange.is('tr') && $('#randomizer').is(':checked')){
		console.log('row click');
		pixelToChange.children().each(function() {
			$(this).css('background-color', nextColor());
		})
	}else if ($('#randomizer').is(':checked')){
		console.log('table click');
		pixelToChange.children().children().each(function() {
			$(this).css('background-color', nextColor());
		})
	}
});

function nextColor() {
	if ($('#randomizer').is(':checked')) {
		$('#colorPicker').val(randomColor());
	}
	return $('#colorPicker').val();
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

$(makeGrid());