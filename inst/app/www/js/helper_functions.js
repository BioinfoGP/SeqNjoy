'use strict';

/// BEGIN Helper functions

function _$(obj) { return (document.getElementById(obj)); }

//const numberWithCommas = (x) => { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

function basename(path) { return path.replace(/.*\//, ''); }

function dirname(path) { return path.match(/.*\//); }

function trim(text) { return text.replace(/^\s+/,'').replace(/\s+$/,''); }

function parseData(myData, sep1, sep2) {
	const vals = {};
	myData.split(sep1).forEach(pair => {
		const [key, value] = pair.split(sep2);
		if (key && value !== undefined) {
			vals[key] = value;
		}
	});
	return vals;
}


function autoPairSelection(pair1Select, pair2Select, pairSelected){
	if(pairSelected=="1"){
		var selectedPath=_$(pair1Select).value;
	} else {
		var selectedPath=_$(pair2Select).value;
	}
	
	if(selectedPath != "_NONE_"){
		var selectedValue=basename(selectedPath);
		var selectedIndex=DataTable["files"]["datapath"].indexOf(selectedPath);
		var viewFilesData=DataTable["files"]["viewfiles"][selectedIndex];
		if(viewFilesData != "" && viewFilesData != "ND" ){
			var viewFilesInfo=parseData(viewFilesData,"@@",";;");
			if(viewFilesInfo.hasOwnProperty("PARTNER") && viewFilesInfo.hasOwnProperty("PAIR")){
				if(viewFilesInfo["PAIR"]==pairSelected){
					if(DataTable["files"]["fname"].indexOf(viewFilesInfo["PARTNER"])!= -1){
						var partnerValue=DataTable["files"]["datapath"][DataTable["files"]["fname"].indexOf(viewFilesInfo["PARTNER"])];
						if(pairSelected=="1"){
							_$(pair2Select).value=partnerValue;
						} else {
							_$(pair1Select).value=partnerValue;
						}
						
						
					}
				}
			}
		}	
	}
}


/// END Helper functions
