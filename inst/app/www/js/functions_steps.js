'use strict';

var CURRENT_TASKS=new Array();
var CURRENT_TASK_STEP=0;
var CURRENT_TASK_SAMPLE=0;
var CANCEL_NOW=false;

// Populate object for Shiny from another object 
function nextStepInShiny(newObj) {
//	hideContent("");
//	JSShinyDetails = newObj;
	_$("ModalCourtain").style.cursor="wait";
	var d = new Date();
	newObj["timestamp"]=d.getTime();
	var json_message=JSON.stringify(newObj);
	//alert(_$("area_ShinyDetails").value);
	if (json_message=="none") { } else {
		Shiny.onInputChange("NextStep", json_message);
	}
}	

function StepDone(result,message) {
	checkForm();
	var go=true;
	if (CANCEL_NOW==true) {
		var go=false; 
		_$("StepCaptionB"+CURRENT_TASK_SAMPLE).innerHTML="Cancelled";
	}
	else if (result=="success") { // step was successfull
		if (_$("divStep_"+CURRENT_TASK_SAMPLE+"_"+CURRENT_TASK_STEP)) {
			_$("divStep_"+CURRENT_TASK_SAMPLE+"_"+CURRENT_TASK_STEP).setAttribute("class","divstep");
			_$("divStep_"+CURRENT_TASK_SAMPLE+"_"+CURRENT_TASK_STEP).style.background="green";
			_$("divStep_"+CURRENT_TASK_SAMPLE+"_"+CURRENT_TASK_STEP).innerHTML="&nbsp;";
		}
		CURRENT_TASK_STEP++;
		if (CURRENT_TASK_STEP==CURRENT_TASKS[CURRENT_TASK_SAMPLE].length) { // was the last step for this sample
			_$("StepCaptionB"+CURRENT_TASK_SAMPLE).innerHTML=_$("StepCaptionB"+CURRENT_TASK_SAMPLE).innerHTML.replace(/fa fa-spinner fa-pulse/,"fa fa-check");
			_$("StepCaptionB"+CURRENT_TASK_SAMPLE).style.color="green";
			CURRENT_TASK_SAMPLE++;
			CURRENT_TASK_STEP=0;
		}
		if (CURRENT_TASK_SAMPLE==CURRENT_TASKS.length) {
			var go=false;
			_$("titleRunning").style.display="none";
			_$("titleFinished").style.display="block";
		}
		else {
//			_$("divStep_"+CURRENT_TASK_SAMPLE+"_"+CURRENT_TASK_STEP).style.background="blue";
			_$("divStep_"+CURRENT_TASK_SAMPLE+"_"+CURRENT_TASK_STEP).setAttribute("class","divstep loading animated fadeIn");
			_$("divStep_"+CURRENT_TASK_SAMPLE+"_"+CURRENT_TASK_STEP).innerHTML="&nbsp;<div class='bg'></div>";
			var go=true;
		}
	}
	else { // step throw error!. Skip to next sample.
		var go=true;
		if (_$("divStep_"+CURRENT_TASK_SAMPLE+"_"+CURRENT_TASK_STEP)) {
			_$("divStep_"+CURRENT_TASK_SAMPLE+"_"+CURRENT_TASK_STEP).style.background="red";
			_$("divStep_"+CURRENT_TASK_SAMPLE+"_"+CURRENT_TASK_STEP).className="divstep";
			_$("divStep_"+CURRENT_TASK_SAMPLE+"_"+CURRENT_TASK_STEP).innerHTML="&nbsp;";
		}
		_$("StepCaptionB"+CURRENT_TASK_SAMPLE).innerHTML=_$("StepCaptionB"+CURRENT_TASK_SAMPLE).innerHTML.replace(/fa fa-spinner fa-pulse/,"fa fa-spinner fa-pulse transparent");
		_$("StepCaptionB"+CURRENT_TASK_SAMPLE).style.color="red";
		_$("errorMessageDiv").innerHTML=_$("errorMessageDiv").innerHTML+"\n"+message;
		CURRENT_TASK_SAMPLE++;
		CURRENT_TASK_STEP=0;
	}

	if (go==true) {
		var go=false;
		if (CURRENT_TASK_SAMPLE<CURRENT_TASKS.length) {
			if (CURRENT_TASK_STEP<CURRENT_TASKS[CURRENT_TASK_SAMPLE].length) {
				var ShinyObject=new Object();
				var go=true;
				ShinyObject["action"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["command"];
				ShinyObject["data"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["data"];
				_$("bottomMessageDiv").innerHTML=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["bottomMessage"];
				nextStepInShiny(ShinyObject);
			}
		}
	}
	if (go==false) {
		//alert("All steps finished!");
		if (CURRENT_TASKS[0][0]["lastBottomMessage"]) {
			_$("bottomMessageDiv").innerHTML=CURRENT_TASKS[0][0]["lastBottomMessage"];
		}
		else {
			_$("bottomMessageDiv").innerHTML="All steps done!";
		}
		if (_$("errorMessageDiv").innerHTML!=="") {
			_$("bottomMessageDiv").innerHTML+=" (some warnings/errors detected)";
			_$("errorMessageDiv").style.background="#D4D0C8";
		}
		//renderFileTable(currentSortBy,'current');
		resize();
		_$("CANCEL").setAttribute("disabled","disabled");
		_$("CLOSE").removeAttribute("disabled");
		//setTimeout(renderProject,2000);
		_$("ModalCourtain").style.cursor="default";
	}
}

function initStepsDialog(title, titleFinished, stepCaptionsA, stepCaptionsB, cancelbutton) {
	var html=`<div class="inthemiddle bwhite radius largeshadow padded relative borderbox" id="StepLabel">
	<table border=0 cellpadding=0 cellspacing=0 class="w100 mw100 h100 borderbox">
		<tr>
			<td id="titleRunning" class="DialogTitle" style="padding:1rem;">`+title+`</td>
			<td id="titleFinished" class="DialogTitle" style="padding:1rem;display:none;">`+titleFinished+`</td>
		</tr>
		<tr>
		<td class="w100 mw100 h100"><div class="w100 mw100" style="height:160px;overflow:auto;">
			<table border=0 cellpadding=0 cellspacing=0 class="w100">
`;
	for(var n=0;n<stepCaptionsA.length;n++) {
		if (stepCaptionsB=="default") {
			var stepWidth=5;
			var captionB="";
			for (var s=0;s<CURRENT_TASKS[n].length;s++) {
				if (s==0) {
					var finalStepWidth=stepWidth*16;
				}
				else if (s==1) {
					var finalStepWidth=stepWidth*8;
				}
				else if (s==2) {
					var finalStepWidth=stepWidth*4;
				}
				else if (s==3) {
					var finalStepWidth=stepWidth*2;
				}
				else {
					var finalStepWidth=stepWidth
				}
				if (n==0 && s==0) {
					var background="blue";
					captionB+="<div id='divStep_"+n+"_"+s+"' class='divstep' style='width:"+finalStepWidth+"px;background:yellow;'>&nbsp;<div class='bg'></div></div>";
				} else {
					captionB+="<div id='divStep_"+n+"_"+s+"' class='divstep' style='width:"+finalStepWidth+"px;background:#D4D0C8;'>&nbsp;</div>";
				}
			}
			captionB+=" <div class='divstep'><i class='fa fa-spinner fa-pulse'></div>";
		}
		else {
			var captionB=stepCaptionsB[n];
		}
		html+=`<tr><td id="StepCaptionA`+n+`" style="width:50vw;max-width:50vw;" class="DialogRow bgradient"><div class="ellipsis">`;
		html+=stepCaptionsA[n];
		html+=`</div></td>`;
		html+=`<td class="nowrap right DialogRow bgradient" id="StepCaptionB`+n+`">`;
		html+=captionB;
		html+=`</td></tr>`;
	}
	
	html+=`</table></div></td></tr>
	<tr><td class="center medipadded"><div id="bottomMessageDiv">`+CURRENT_TASKS[0][0]["bottomMessage"]+`</div></td></tr>
	<tr><td class="center medipadded"><div id="errorMessageDiv"></div></td></tr>
	<tr><td class="right" style="padding-top:1rem;">`;
	if (cancelbutton==true) {
		html+=`<button class="buttonDialog" id="CANCEL" onclick="cancelButtonPressed();">Cancel</button>`;
	}
	else {
		html+=`<button class="buttonDialog" id="CANCEL" onclick="cancelButtonPressed();" disabled>Cancel</button>`;
	}
	html+=`<button class="buttonDialog" id="CLOSE" onclick="renderProject();" disabled>Close</button>`;
	html+=`</td></tr></table></div>`;
	return (html);
}

function cancelButtonPressed() {
	CANCEL_NOW=true;
	_$("CANCEL").setAttribute("disabled","disabled");
	_$("StepCaptionB"+CURRENT_TASK_SAMPLE).innerHTML="Cancelling...&nbsp;<div class='divstep'><i class='fa fa-spinner fa-pulse'></div>";
	for (var c=CURRENT_TASK_SAMPLE+1;c<CURRENT_TASKS.length;c++) {
		_$("StepCaptionB"+c).innerHTML="Cancelled";
			
	}
}

