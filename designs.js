// Select color input
const gridColor=$('#colorPicker');
// Select size input
const gridSize=[$("#inputHeight"), $("#inputWeight")];
console.log(gridSize)
// When size is submitted by the user, call makeGrid()
const pixelCanvas=$('#pixelCanvas');


function makeGrid() {
// Your code goes here!
	pixelCanvas.empty();
	for (var i =  gridSize[0].val(); i > 0; i--) {
		pixelCanvas.append('<tr></tr>');
		for (var j = gridSize[1].val(); j > 0; j--) {
			pixelCanvas.children().last().append("<td class='color-pixel'></td>");
		};
	};
};

$("#sizePicker").submit(function(e) {
	makeGrid();
    e.preventDefault();
});


$(makeGrid());

$("#pixelCanvas").click(function(e) {
	let pixelToChange= $(e.target)
	// if the click is dragged across the grid, this function prevents the <tr> from changing color
	pixelToChange.is('td') ? pixelToChange.css('background-color', $('#colorPicker').val()) : console.log('dragged click');
});