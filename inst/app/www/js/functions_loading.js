'use strict';

// File input div behavior
//$(document).on('change', ':file', function() {
//	var input = $(this),
//	numFiles = input.get(0).files ? input.get(0).files.length : 1,
//	label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
//	hideContent("Loading files..."+label);
//	input.trigger('fileselect', [numFiles, label]);
//});


var TI="";
var PBAR=0;
var FF=0;
function uploadFiles(files) {
	close_all_menus();
	FF=0;
	PBAR=0;
	var numFiles=files.length;

// Old style
//	var label=`<div id="UploadDialog" class="padded border radius largeshadow inthemiddle bwhite"><span class="font15">Loading:<br></span><div id="UploadRowsContainer">`;
//	for (var f=0;f<numFiles;f++) {
//		label+=`<div id='StepProgress`+f+`'> </div>
//<div class="ProgressBarDiv"><div id="ProgressBar`+f+`" class="ProgressBar"></div></div>`;
//	}
//	label+=`</div><br><label id="StepLabel"></label>
//<div id='LoadFiles_progress' class='progress shiny-file-input-progress' style='display:none;'>
//	<div id='bar' class='progress-bar' style='width:100%;'> </div>
//</div></div>`;
	var stepCaptionsA=new Array();
	var stepCaptionsB=new Array();
	for (var f=0;f<numFiles;f++) {
		stepCaptionsA[f]=files[f].name;
		stepCaptionsB[f]=`<span id='PercentageLoaded`+f+`'></span>&nbsp;&nbsp;&nbsp;<i class='fa fa-spinner fa-pulse'></i>`;
	}
	// to handle native progress-bar
	var title=`Loading Files... <div id='LoadFiles_progress' class='progress shiny-file-input-progress' style='display:none;'><div id='bar' class='progress-bar' style='width:100%;'></div></div>`;
	var titleFinished=`Files loaded <div id='LoadFiles_progress' class='progress shiny-file-input-progress' style='display:none;'><div id='bar' class='progress-bar' style='width:100%;'></div></div>`;
	CANCEL_NOW=false;
	// global variables to separate tasks in R: after each R task, a signal is sent to client to launch next one.
	CURRENT_TASKS=new Array();
	CURRENT_TASKS[0]=new Array();
	CURRENT_TASKS[0][0]=new Array();
	CURRENT_TASKS[0][0]["bottomMessage"]="Loading files...";

	hideContent(initStepsDialog(title, titleFinished, stepCaptionsA, stepCaptionsB, false));
	for (var f=0;f<numFiles;f++) {
//		_$("StepProgress"+f).className="ProgressCurrent";
//		_$("ProgressBar"+f).style.width="0%";
//		_$("StepProgress"+f).innerHTML=`<i class='fa fa-spinner fa-pulse'></i> `+files[f].name;
	}
//	_$("StepLabel").innerHTML="Loading "+files[FF].name+"...";
	TI=setTimeout(function() { checkUploadProgressBar(files)},50);
}

function checkUploadProgressBar(files) {
	var PBAR2=0;
	if (_$("bar")) { PBAR2=parseFloat(_$("bar").style.width); }
	if (PBAR2<PBAR) {
		FF++;
//		_$("StepLabel").innerHTML="Loading "+files[FF].name+"...";
	}
	for (var f=0;f<files.length;f++) {
//		if (_$("ProgressBar"+f) && PBAR!==PBAR2) {
//			_$("ProgressBar"+f).style.width=Math.min(98,Math.max(PBAR,PBAR2))+f/10+Math.random()/2+"%";
//			_$("ProgressBar"+f).style.width=Math.min(100,Math.max(PBAR,PBAR2))+"%";
//		}
		if (_$("PercentageLoaded"+f)) {
			_$("PercentageLoaded"+f).innerHTML=Math.min(100,Math.max(PBAR,PBAR2))+"%";
		}
	}
	PBAR=PBAR2;
	if (FF<files.length) { TI=setTimeout(function() { checkUploadProgressBar(files)},50); }
}



function launchProcessingLoadedFilesQueue(json) {
	CANCEL_NOW=false;
	// global variables to separate tasks in R: after each R task, a signal is sent to client to launch next one.
	CURRENT_TASKS=new Array();
	CURRENT_TASK_STEP=0;
	CURRENT_TASK_SAMPLE=0;
	
	// substitute \ by \\ in json
	json=decodeURI(encodeURI(json).replace(/%5C/g, "%5C%5C"));
	var filesToAdd=JSON.parse(json)["files"];
	for (var f=0;f<filesToAdd["name"].length;f++) {
		filesToAdd["name"][f]=filesToAdd["name"][f].replace(/ /g,"_");
		CURRENT_TASKS[CURRENT_TASK_SAMPLE]=new Array(); // first dimension is the sample
		
		var nn=0;

		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="initialize_this_file";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=filesToAdd["name"][f];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fsize"]=filesToAdd["size"][f];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["ftype"]=filesToAdd["type"][f];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["datapath"]=filesToAdd["datapath"][f];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Initializing file...";
		nn++;

		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="create_accessory_files_for_this_one";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=filesToAdd["name"][f];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fsize"]=filesToAdd["size"][f];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["ftype"]=filesToAdd["type"][f];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["datapath"]=filesToAdd["datapath"][f];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Creating accessory files...";
		if (filesToAdd["name"][f].match(/\.gtf$/) || filesToAdd["name"][f].match(/\.gtf\.gz$/) || filesToAdd["name"][f].match(/\.gff3?$/) || filesToAdd["name"][f].match(/\.gff3?\.gz$/) ) {
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Creating accessory files (may take a long time for large genomes)...";
		}
		nn++;

		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="add_this_file_to_project";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=filesToAdd["name"][f];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fsize"]=filesToAdd["size"][f];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["ftype"]=filesToAdd["type"][f];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["datapath"]=filesToAdd["datapath"][f];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Adding file to project...";
		nn++;

		CURRENT_TASK_SAMPLE++;
	}
	var stepCaptionsA=new Array();
	var stepCaptionsB=new Array();
	for (var f=0;f<CURRENT_TASKS.length;f++) {
		stepCaptionsA[f]=filesToAdd["name"][f];
//		stepCaptionsB[f]=`<i class="fa fa-spinner fa-pulse"></i>`;
		for (var ff=0;ff<CURRENT_TASKS[f].length;ff++) {
			if (!CURRENT_TASKS[f][ff]["bottomMessage"]) {
				CURRENT_TASKS[f][ff]["bottomMessage"]="--BOTTOM MESSAGE--";
			}
		}
	}
	hideContent(initStepsDialog("Adding Files to Project...", "Files added", stepCaptionsA, "default", true));
	CURRENT_TASK_SAMPLE=0;
	CURRENT_TASK_STEP=0;
	var ShinyObject=new Object();
	ShinyObject["action"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["command"];
	ShinyObject["data"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["data"];
	nextStepInShiny(ShinyObject);
}
