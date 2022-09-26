'use strict';

function renderExpressionTab(option){
	var countFolderSelect='';
	countSelect=new Object();
	selectedCountFolder=NOT_SELECTED;
	for (var key in DataTable) {
		if (DataTable.hasOwnProperty(key)) {
			var myObj=DataTable[key];
			var nElems=myObj["fname"].length;
			for(var i=0; i<nElems;i++){
				if(myObj["hidden"][i]=="NO"){				
					var color="#0000FF";
					if(myObj["ftype"][i]=="counts"){
						var thisFolderName=myObj["datapath"][i].replace(/\.\/COUNTS\//,"").replace(/\/.+/,"");
						if (typeof(countSelect[thisFolderName])=="undefined") {
							countSelect[thisFolderName]=new Array();
						}
						countSelect[thisFolderName].push(myObj["datapath"][i]);
						countSelect[thisFolderName].sort();
					}
				}
			}
			for(var f in countSelect) {
				var captionFolder=basename(f).replace(/\.gtf\./, ".gtf nbsp;nbsp; ");
				var captionFolder=captionFolder.replace(/\.gff3\./, ".gff3 nbsp;nbsp; ");
				var captionFolder=captionFolder.replace(/\.gff\./, ".gff nbsp;nbsp; ");
				var captionFolder=captionFolder.replace(/\.saf$/, "");
				var tokens=captionFolder.split(" nbsp;nbsp; ");
				tokens[1]=tokens[1].replace(/-(\w+)/g," ($1)");
				tokens[1]=tokens[1].replace(/\./g," | ");
				captionFolder=tokens[0]+" &nbsp;&nbsp; "+tokens[1];
				countFolderSelect+='<option value="'+f+'" style="color:#000000;">'+captionFolder+'</option>';
			}
		}
	}
	
	var htmlOut=`
	<form id="NewExpression" name="NewExpression"  action="javascript:void(0);">
		<table cellpadding="0px" cellspacing="0px" border="0px" style="margin:1rem;">
			<tr>
				<td colspan=4 class="medipadded nowrap">
					<div class="nowrap" style="display:inline;">Counts Group:
						<select id="CountsFolder" onchange="loadCountsFolder(this.value);checkExpressionForm();">
							<option value="`+NOT_SELECTED+`">Select Counts Group</option>
							`+countFolderSelect+`
						</select>
					</div>
				</td>
			</tr>
			<tr>
				<td id="expressionNumeratorQueueTD" class="medipadded" style="height:14rem;">
				</td>
				<td class="top tborder" style="font-size:2.25rem;color:white;font-weight:bold;">vs.</td>
				<td id="expressionDenominatorQueueTD" class="medipadded" style="height:14rem;">
				</td>
				<td class="medipadded" style="height:18rem;">
					<div class="medipadded borderbox shadow bsilver radius">
						<table cellpadding="0px" cellspacing="0px" border="0px" style="min-width:18rem;">
							<tr>
								<td class="medipadded" style="border-bottom:1px solid #000000;display:none;">
									<b> Method:</b>
									<input type="radio" name="exprMethod" id="exprMethod_DESeq2" checked onclick="setExprMethod();checkExpressionForm()"/>
									DESeq2
									<input type="radio" name="exprMethod" id="exprMethod_edgeR" onclick="setExprMethod();checkExpressionForm()"/>
									edgeR
									<input type="hidden" name="diffexpressionprogram" id="diffexpressionprogram" value="compare_with_DESeq2"/>
								</td>
								<td id="compareFunctionCaption" colspan=2 class="medipadded" style="border-bottom:1px solid #000000;">
								compareFunctionCaption
								</td>
							</tr>
							<tr>
								<td class="medipadded top" style="border-bottom:1px solid #000000;border-top:1px solid #EFEFEF;">
									<div id="DESeq2_options" name="DESeq2_options" class="medipadded" style="height:9rem;overflow-y:auto;">
									`+populateFunctionOptions("compare_with_DESeq2")+`
									</div>
									<div id="edgeR_options" name="edgeR_options" class="medipadded" style="height:9rem;overflow-y:auto;display:none;">
									`+populateFunctionOptions("compare_with_edgeR")+`
									</div>
								</td>
							</tr>
							<tr>
								<td style="border-top:1px solid #EFEFEF;">
									<div id="addAnnots_options" name="addAnnots_options" class="medipadded" style="height:4em;overflow-y:auto;">
									`+populateFunctionOptions("add_annots_in_ANN_format")+`
									</div>
								</td>
							</tr>
						</table>
					</div>
				</td>
			</tr>
			<tr>
				<td colspan=3 style="text-align:center;">
					<div class="nowrap" style="display:inline;margin-left:1rem;">
						Output files suffix (optional): <input type="textbox" id="COMPARISON_OUT_SUFFIX" placeholder="" value="" oninput="this.value=this.value.replace(/[^a-z\.A-Z0-9\-\+\(\)_]/g,'');checkExpressionForm();" title="Common suffix to be added to all output file names.">
						<input type="hidden" id="OutComparisonFile">
					</div>
				</td>
				<td>
					<div class="medipadded center"><input type="button" class="ButtonLaunch" id="expression_LAUNCHBUTTON" disabled value="Launch!" onClick="launchExpressionQueue()"></div>
				</td>
			</tr>
		</table>
	</form>`;
	document.getElementById('ExpressionFormTable').innerHTML=htmlOut;
	addExpressionNumeratorRow(countSelect[selectedCountFolder]);
	addExpressionNumeratorRow(countSelect[selectedCountFolder]);
	addExpressionNumeratorRow(countSelect[selectedCountFolder]);
	addExpressionNumeratorRow(countSelect[selectedCountFolder]);
	addExpressionNumeratorRow(countSelect[selectedCountFolder]);
	addExpressionNumeratorRow(countSelect[selectedCountFolder]);
	addExpressionNumeratorRow(countSelect[selectedCountFolder]);
	addExpressionNumeratorRow(countSelect[selectedCountFolder]);
	addExpressionNumeratorRow(countSelect[selectedCountFolder]);
	addExpressionNumeratorRow(countSelect[selectedCountFolder]);
	addExpressionNumeratorRow(countSelect[selectedCountFolder]);
	addExpressionNumeratorRow(countSelect[selectedCountFolder]);
	addExpressionNumeratorRow(countSelect[selectedCountFolder]);
	addExpressionNumeratorRow(countSelect[selectedCountFolder]);


	addExpressionDenominatorRow(countSelect[selectedCountFolder]);
	addExpressionDenominatorRow(countSelect[selectedCountFolder]);
	addExpressionDenominatorRow(countSelect[selectedCountFolder]);
	addExpressionDenominatorRow(countSelect[selectedCountFolder]);
	addExpressionDenominatorRow(countSelect[selectedCountFolder]);
	addExpressionDenominatorRow(countSelect[selectedCountFolder]);
	addExpressionDenominatorRow(countSelect[selectedCountFolder]);
	addExpressionDenominatorRow(countSelect[selectedCountFolder]);
	addExpressionDenominatorRow(countSelect[selectedCountFolder]);
	addExpressionDenominatorRow(countSelect[selectedCountFolder]);
	addExpressionDenominatorRow(countSelect[selectedCountFolder]);
	addExpressionDenominatorRow(countSelect[selectedCountFolder]);
	addExpressionDenominatorRow(countSelect[selectedCountFolder]);
	addExpressionDenominatorRow(countSelect[selectedCountFolder]);
	
	if (option=="DESeq2") {
		_$("exprMethod_DESeq2").setAttribute("checked", "checked");
		_$("exprMethod_edgeR").removeAttribute("checked");
		_$("compareFunctionCaption").innerHTML="<b>Function:</b> DESeq (DESeq2)";
	}
	if (option=="edgeR") {
		_$("exprMethod_edgeR").setAttribute("checked", "checked");
		_$("exprMethod_DESeq2").removeAttribute("checked");
		_$("compareFunctionCaption").innerHTML="<b>Function:</b> exactTest (edgeR)";
	}
	setExprMethod();
}

function setExprMethod(){
		if(_$("exprMethod_DESeq2").checked == true){
			_$("diffexpressionprogram").value="compare_with_DESeq2";
			_$("DESeq2_options").style.display="block";
			_$("edgeR_options").style.display="none";
		} 
		else if (_$("exprMethod_edgeR").checked == true){
			_$("diffexpressionprogram").value="compare_with_edgeR"
			_$("DESeq2_options").style.display="none";
			_$("edgeR_options").style.display="block";
		}
}

function clearNumerator() {
	var t=0;
	while (_$("ExpressionNumerator_"+t)) {
		_$("ExpressionNumerator_"+t).value=NOT_SELECTED;
		t++;
	}
	_$("numeratorLabel").value="";
}

function clearDenominator() {
	var t=0;
	while (_$("ExpressionDenominator_"+t)) {
		_$("ExpressionDenominator_"+t).value=NOT_SELECTED;
		t++;
	}
	_$("denominatorLabel").value="";
}




function loadCountsFolder(this_folder) {
	selectedCountFolder=this_folder;
	var t=0;
	var myNumerators=new Array();
	while (_$("ExpressionNumerator_"+t)) {
		myNumerators[t]=NOT_SELECTED;
		t++;
	}
	populateExpressionNumeratorQueueTD(myNumerators, countSelect[selectedCountFolder]);

	var t=0;
	var myDenominators=new Array();
	while (_$("ExpressionDenominator_"+t)) {
		myDenominators[t]=NOT_SELECTED;
		t++;
	}
	populateExpressionDenominatorQueueTD(myDenominators, countSelect[selectedCountFolder]);

}

function addExpressionNumeratorRow(countSelect) {
	var myNumerators=new Array();
	var t=0;
	while (_$("ExpressionNumerator_"+t)) {
		myNumerators[t]=_$("ExpressionNumerator_"+t).value;
		t++;
	}
	// last element
	myNumerators[t]=NOT_SELECTED;
	populateExpressionNumeratorQueueTD(myNumerators, countSelect);
}

function addExpressionDenominatorRow(countSelect) {
	var myDenominators=new Array();
	var t=0;
	while (_$("ExpressionDenominator_"+t)) {
		myDenominators[t]=_$("ExpressionDenominator_"+t).value;
		t++;
	}
	// last element
	myDenominators[t]=NOT_SELECTED;
	populateExpressionDenominatorQueueTD(myDenominators, countSelect);
}


function populateExpressionNumeratorQueueTD(myNumerators, countSelect) {
	var options="";
	if (countSelect) {
		for(var c=0;c<countSelect.length;c++) {
			options+='<option value="'+countSelect[c]+'" style="color:#000000;">'+basename(countSelect[c])+'</option>';
		}
	}
	var html=`<table cellpadding="0px" cellspacing="0px" border="0px">
	<tr>
		<td class="medipadded center" style="white-space:nowrap;">Case Label: <input type="textbox" size="12" maxlength="12" id="numeratorLabel" placeholder="" oninput="this.value=this.value.replace(/[^a-z\.A-Z0-9\-\+_]/g,'');checkExpressionForm();"></td>
	</tr>
	<tr>
		<td>
			<div id="numeratorsDIV" class="borderbox" style="border-bottom:1px solid silver;height:16rem;overflow-y:scroll;" onscroll="SCT=this.scrollTop;if (this.scrollHeight-this.scrollTop < this.clientHeight+2) { addExpressionNumeratorRow(countSelect[selectedCountFolder]);_$('numeratorsDIV').scrollTop=SCT;checkExpressionForm(); }">
				<table cellpadding="0px" cellspacing="0px" border="0px" class="borderbox">
`;

	for (var t=0;t<myNumerators.length;t++) {
		if (!countSelect) { var isdisabled="disabled"; } else { var isdisabled=""; }
		html+=`
					<tr>
						<td class="tinypadded">
							<select `+isdisabled+` id="ExpressionNumerator_`+t+`" class="w100" style="min-width:16rem;" onchange="checkExpressionForm();">
								<option value="`+NOT_SELECTED+`" style="color:#000000;">Select Replicate</option>
								`+options+`
							</select>
						</td>
					</tr>`;
	}
	html+=`
				</table>
			</div>
		</td>
	</tr>
	<tr>
		<td class="right medipadded">
			<button id="clearNumeratorButton" onclick="clearNumerator();checkForm();">clear</button>
		</td>
	</tr>
</table>`;
	_$("expressionNumeratorQueueTD").innerHTML=html;
	for (var t=0;t<myNumerators.length;t++) {
		_$("ExpressionNumerator_"+t).value=myNumerators[t];
	}
}



function populateExpressionDenominatorQueueTD(myDenominators, countSelect) {
	var options="";
	if (countSelect) {
		for(var c=0;c<countSelect.length;c++) {
			options+='<option value="'+countSelect[c]+'" style="color:#000000;">'+basename(countSelect[c])+'</option>';
		}
	}
	var html=`<table cellpadding="0px" cellspacing="0px" border="0px">
	<tr>
		<td class="medipadded center" style="white-space:nowrap;">Control Label: <input type="textbox" size="12" maxlength="12" id="denominatorLabel" placeholder="" oninput="this.value=this.value.replace(/[^a-z\.A-Z0-9\-\+_]/g,'');checkExpressionForm();"></td>
	</tr>
	<tr>
		<td>
			<div id="denominatorsDIV" class="borderbox" style="border-bottom:1px solid silver;height:16rem;overflow-y:scroll;" onscroll="SCT=this.scrollTop;if (this.scrollHeight-this.scrollTop < this.clientHeight+2) { addExpressionDenominatorRow(countSelect[selectedCountFolder]);_$('denominatorsDIV').scrollTop=SCT;checkExpressionForm(); }">
				<table cellpadding="0px" cellspacing="0px" border="0px" class="borderbox">
`;

	for (var t=0;t<myDenominators.length;t++) {
		if (!countSelect) { var isdisabled="disabled"; } else { var isdisabled=""; }
		html+=`
					<tr>
						<td class="tinypadded">
							<select `+isdisabled+` id="ExpressionDenominator_`+t+`" class="w100" style="min-width:16rem;" onchange="checkExpressionForm();">
								<option value="`+NOT_SELECTED+`" style="color:#000000;">Select Replicate</option>
								`+options+`
							</select>
						</td>
					</tr>`;
	}
	html+=`
				</table>
			</div>
		</td>
	</tr>
	<tr>
		<td class="right medipadded">
			<button id="clearDenominatorButton" onclick="clearDenominator();checkForm();">clear</button>
		</td>
	</tr>
</table>`;
	_$("expressionDenominatorQueueTD").innerHTML=html;
	for (var t=0;t<myDenominators.length;t++) {
		_$("ExpressionDenominator_"+t).value=myDenominators[t];
	}
}






function checkExpressionForm() {
	var errors=0;
	var duplicatedfiles=0;
	var numeratorfiles=0;
	var denominatorfiles=0;

	var METHOD=_$("diffexpressionprogram").value;
	for (var o=0;o<PARAMS[METHOD]['ID'].length;o++) {
		var Editable=PARAMS[METHOD]["Editable"][o];
		if (Editable=="YES") {
			var Caption1=PARAMS[METHOD]["Caption1"][o];
			var Caption2=PARAMS[METHOD]["Caption2"][o];
			var Default=PARAMS[METHOD]["Default"][o];
			var ID=PARAMS[METHOD]["ID"][o];
			var Type=PARAMS[METHOD]["Type"][o];
			var Range=PARAMS[METHOD]["Range"][o];	
			if (!validParam(ID, Type, Range)) { errors++; } 
		}
	}
	
	_$("COMPARISON_OUT_SUFFIX").className="ValidInput";
	_$("numeratorLabel").className="ValidInput";
	_$("denominatorLabel").className="ValidInput";
	
	if (_$("CountsFolder").value==NOT_SELECTED) {
		_$("numeratorLabel").setAttribute("disabled","disabled");
		_$("denominatorLabel").setAttribute("disabled","disabled");
	}
	
//	if (!_$("COMPARISON_OUT_SUFFIX").value.match(/\w/)) {
//		errors++;
//		_$("COMPARISON_OUT_SUFFIX").className="WrongInput";
//	}

	if (!_$("numeratorLabel").value.match(/\w/)) {
		errors++;
		_$("numeratorLabel").className="WrongInput";
	}

	if (!_$("denominatorLabel").value.match(/\w/)) {
		errors++;
		_$("denominatorLabel").className="WrongInput";
	}

	if (_$("numeratorLabel").value==_$("denominatorLabel").value) {
		errors++;
		_$("denominatorLabel").className="WrongInput";
		_$("numeratorLabel").className="WrongInput";
	}

	
	if (_$("COMPARISON_OUT_SUFFIX").value.match(/\w/)) {
		_$("OutComparisonFile").value="DiffExp."+_$("numeratorLabel").value+"_vs_"+_$("denominatorLabel").value+"."+_$("COMPARISON_OUT_SUFFIX").value+".xlsx";
	}
	else {
		_$("OutComparisonFile").value="DiffExp."+_$("numeratorLabel").value+"_vs_"+_$("denominatorLabel").value+".xlsx";
	}

	if (_$("CountsFolder").value==NOT_SELECTED) {
		_$("CountsFolder").className="WrongInput";
		errors++;
	}
	else {
		_$("CountsFolder").className="ValidInput";
	}



	var t=0;
	var alreadyHere=new Object();
	while (_$("ExpressionNumerator_"+t)) {
		if (_$("ExpressionNumerator_"+t).value==NOT_SELECTED) {
			_$("ExpressionNumerator_"+t).style.color="black";
		}
		else {
			numeratorfiles++;
			var outNumerator=_$("ExpressionNumerator_"+t).value;

			if (typeof(alreadyHere[outNumerator])=="undefined") {
				alreadyHere[outNumerator]=1;
				_$("ExpressionNumerator_"+t).style.color="#000000";
			}
			else {
				alreadyHere[outNumerator]++;
				_$("ExpressionNumerator_"+t).style.color="#FF0000";
				duplicatedfiles++;
			}
		}
		t++;
	}

	var t=0;
	while (_$("ExpressionDenominator_"+t)) {
		if (_$("ExpressionDenominator_"+t).value==NOT_SELECTED) {
			_$("ExpressionDenominator_"+t).style.color="black";
		}
		else {
			denominatorfiles++;
			var outDenominator=_$("ExpressionDenominator_"+t).value;

			if (typeof(alreadyHere[outDenominator])=="undefined") {
				alreadyHere[outDenominator]=1;
				_$("ExpressionDenominator_"+t).style.color="#000000";
			}
			else {
				alreadyHere[outDenominator]++;
				_$("ExpressionDenominator_"+t).style.color="#FF0000";
				duplicatedfiles++;
			}
		}
		t++;
	}

	var alreadyFile=new Object();
	var outputFile=_$("OutComparisonFile").value
	for (var f=0;f<DataTable["files"]["fname"].length;f++) {
		if (basename(outputFile)==DataTable["files"]["fname"][f] && typeof(alreadyFile[f])=="undefined") {
			alreadyFile[f]=1;
			errors++;
			_$("COMPARISON_OUT_SUFFIX").className="WrongInput";
			_$("numeratorLabel").className="WrongInput";
			_$("denominatorLabel").className="WrongInput";
		}	
	}
	
	if (numeratorfiles < 2 && denominatorfiles < 2) { errors++; }
	if (numeratorfiles == 0 || denominatorfiles == 0) { errors++; }


	if (errors>0 || duplicatedfiles>0 || numeratorfiles==0) { _$("expression_LAUNCHBUTTON").setAttribute("disabled","true"); }
	else { _$("expression_LAUNCHBUTTON").removeAttribute("disabled"); }
}





// CONSTRUCT expression queue and launch it (oliveros)
function launchExpressionQueue() {
	CANCEL_NOW=false;
	// global variables to separate tasks in R: after each R task, a signal is sent to client to launch next one.
	CURRENT_TASKS=new Array();
	CURRENT_TASK_STEP=0;
	CURRENT_TASK_SAMPLE=0;
	
	
	var DIFFEXPRFUN=_$("diffexpressionprogram").value;
		
	var common_params_diffexpr=getCommonParams(PARAMS[DIFFEXPRFUN]);

	
	var numerator_reps=new Object();
	var t=0;
	var dependencies="";
	while (_$("ExpressionNumerator_"+t)) {
		if (_$("ExpressionNumerator_"+t).value!==NOT_SELECTED) {	
			numerator_reps[t]=_$("ExpressionNumerator_"+t).value;
			if (dependencies=="") {
				dependencies=numerator_reps[t];
			}
			else {
				dependencies=dependencies+" @@ "+numerator_reps[t];
			}
		}
		t++;
	}	

	var denominator_reps=new Object();
	var t=0;
	while (_$("ExpressionDenominator_"+t)) {
		if (_$("ExpressionDenominator_"+t).value!==NOT_SELECTED) {	
			denominator_reps[t]=_$("ExpressionDenominator_"+t).value;
			dependencies=dependencies+" @@ "+denominator_reps[t];
		}
		t++;
	}
	
	if (_$("annots_ann").value!==NOT_SELECTED) {
			dependencies=dependencies+" @@ "+_$("annots_ann").value;
	}
	

	var t=0;
	CURRENT_TASKS[CURRENT_TASK_SAMPLE]=new Array(); // first dimension is the sample
			
	var nn=0;

	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]=DIFFEXPRFUN;
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["output_file"]=basename(_$("OutComparisonFile").value);
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["folder_reps"]=_$("CountsFolder").value;
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["numerator_reps"]=numerator_reps;
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["denominator_reps"]=denominator_reps;
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["numerator_label"]=_$("numeratorLabel").value;
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["denominator_label"]=_$("denominatorLabel").value;
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["dependencies"]=dependencies;
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["common_params"]=common_params_diffexpr;
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["annots_file"]=_$("annots_ann").value;
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Calculating differential expression...";

	nn++;

	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="initialize_DIFFEXP_file";
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("OutComparisonFile").value);
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["dependencies"]=dependencies;
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Initializing results file...";
	nn++;

	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="create_accessory_files_for_DIFFEXP";
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("OutComparisonFile").value);
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Creating accessory files...";
	nn++;

	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="add_DIFFEXP_to_project";
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("OutComparisonFile").value);
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Adding results file to project...";
	nn++;



//	CURRENT_TASK_STEPS[CURRENT_TASK_SAMPLE]=CURRENT_TASKS[CURRENT_TASK_SAMPLE].length;
	CURRENT_TASK_SAMPLE++;
//	CURRENT_TASK_SAMPLES=CURRENT_TASK_SAMPLE;

	var stepCaptions=new Array();
	for (var f=0;f<CURRENT_TASKS.length;f++) {
		stepCaptions[f]=CURRENT_TASKS[f][0]["data"]["numerator_label"]+" vs "+CURRENT_TASKS[f][0]["data"]["denominator_label"];
		for (var ff=0;ff<CURRENT_TASKS[f].length;ff++) {
			if (!CURRENT_TASKS[f][ff]["bottomMessage"]) {
				CURRENT_TASKS[f][ff]["bottomMessage"]="--BOTTOM MESSAGE--";
			}
		}
	}
	hideContent(initStepsDialog("Comparing samples...","Samples compared", stepCaptions, "default", true));
	CURRENT_TASK_SAMPLE=0;
	CURRENT_TASK_STEP=0;
	var ShinyObject=new Object();
	ShinyObject["action"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["command"];
	ShinyObject["data"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["data"];
	nextStepInShiny(ShinyObject);
}







