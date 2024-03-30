
const colorWonk=document.getElementById("inputWonk");
const draggingColor=[255,200,100];

const incrementDrag = () => {
	let hexDrag="#"
	for (i=0; i<3; i++){
		draggingColor[i]+=Math.round((2**colorWonk.value)*(Math.random() -0.5));
		draggingColor[i]>255 ? draggingColor[i]=255 : draggingColor[i]<0 ? draggingColor[i]=0 : true;
		dragFragment=draggingColor[i].toString(16)
		hexDrag+= (dragFragment.length==1 ? "0"+dragFragment : dragFragment);
	}
	return hexDrag;
}

export default incrementDrag;