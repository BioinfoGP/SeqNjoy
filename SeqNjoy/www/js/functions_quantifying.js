'use strict';

function renderQuantifyTab(){
	FeaturesTable = new Object();
	bamSelect=new Array();
	gffSelect=new Array();
	bamSelectHTML="";
	gffSelectHTML="";
	for (var key in DataTable) {
		if (DataTable.hasOwnProperty(key)) {
			var myObj=DataTable[key];
			var nElems=myObj["fname"].length;
			for(var i=0; i<nElems;i++){
				if(myObj["hidden"][i]=="NO"){				
					var color="#0000FF";
					if(myObj["ftype"][i]=="bam"){
						bamSelect.push(myObj["datapath"][i]);
						bamSelect.sort();
					}
					if(myObj["ftype"][i]=="gff"){
						gffSelect.push(myObj["datapath"][i]);
						gffSelect.sort();
					}
				}
			}
		}
	}
	for (var t=0;t<bamSelect.length;t++) {
		bamSelectHTML+='<option value="'+bamSelect[t]+'" style="color:#000000;">'+basename(bamSelect[t])+'</option>';
	}
	for (var t=0;t<gffSelect.length;t++) {
		gffSelectHTML+='<option value="'+gffSelect[t]+'" style="color:#000000;">'+basename(gffSelect[t])+'</option>';
	}
	
	if (gffSelectHTML=="") { var isdisabled="disabled"; } else { var isdisabled=""; }

	var htmlOut=`
	<form id="NewQuantify" name="NewQuantify"  action="javascript:void(0);">
		<table cellpadding="0px" cellspacing="0px" border="0px" style="margin:1rem;">
			<tr>
				<td class="medipadded nowrap" colspan=2>
					<div class="nowrap" style="display:inline;">Genome Features:
						<select `+isdisabled+` id="ReferenceToQuantifyBAM" onchange="loadGFFfeatures(this.value);checkQuantifyForm();">
							<option value="`+NOT_SELECTED+`">Select GFF</option>
							`+gffSelectHTML+`
						</select>
					</div>
				</td>
			</tr>
			<tr>
				<td id="quantifyQueueTD" class="medipadded" style="height:18rem;">
				</td>
				<td class="medipadded" style="height:18rem;">
					<div class="borderbox medipadded shadow bsilver radius">
						<table cellpadding="0px" cellspacing="0px" border="0px">
							<tr>
								<td colspan=2 class="medipadded" style="border-bottom:1px solid #000000;">
									<b> Function:</b>
									featureCounts (Rsubread)
								</td>
							</tr>
							<tr>
								<td class="medipadded top" style="border-right:1px solid #000000;border-top:1px solid #EFEFEF">
									<div id="quantifying_options" name="quantifying_options" style="height:16rem;overflow-y:auto;">
										`+populateFunctionOptions("quantify_with_featureCounts")+`
									</div>
								</td>
								<td class="medipadded top" style="border-left:1px solid #EFEFEF;border-top:1px solid #EFEFEF;">
									<div id="featureAndBlockTD" name="featureAndBlockTD" style="height:16rem;">
									</div>
								</td>
							</tr>	
						</table>
					</div>
				</td>
			</tr>
			<tr>
				<td style="text-align:center;">
					<div class="nowrap" style="display:inline;margin-left:1rem;">
						Output files suffix (optional): <input type="textbox" id="QUANT_OUT_SUFFIX" placeholder="" value="" oninput="this.value=this.value.replace(/[^a-z\.A-Z0-9\-\+\(\)_]/g,'');checkQuantifyForm();" title="Common suffix to be added to all output file names.">
					</div>
				</td>
				<td>
					<div class="medipadded center"><input type="button" class="ButtonLaunch" id="featureCounts_LAUNCHBUTTON" disabled value="Launch!" onClick="launchQuantifyQueue()"></div>
				</td>
			</tr>
		</table>
	</form>`;
	document.getElementById('QuantifyFormTable').innerHTML=htmlOut;
	addQuantifyRow(bamSelectHTML);
	addQuantifyRow(bamSelectHTML);
	addQuantifyRow(bamSelectHTML);
	addQuantifyRow(bamSelectHTML);
	addQuantifyRow(bamSelectHTML);
	addQuantifyRow(bamSelectHTML);
	addQuantifyRow(bamSelectHTML);
	addQuantifyRow(bamSelectHTML);
	addQuantifyRow(bamSelectHTML);
	addQuantifyRow(bamSelectHTML);
	addQuantifyRow(bamSelectHTML);
	addQuantifyRow(bamSelectHTML);

	addFeatureBlockRow();
}

var myFeatures=new Array();
function addFeatureBlockRow() {
	var t=0;
	myFeatures=new Array(); // is global
	while (_$("FeatureToQuant_"+t)) {
		myFeatures[t]=new Array();
		myFeatures[t].feature=_$("FeatureToQuant_"+t).value;
		myFeatures[t].block=_$("BlockToQuant_"+t).value;
		t++;
	}
	// last element
	myFeatures[t]=new Array();
	myFeatures[t].feature=NOT_SELECTED;
	myFeatures[t].block=NOT_SELECTED;
	populateFeatureBlockTD(myFeatures);
	renderQuantifyFeatures();
}

function populateFeatureBlockTD(myFeatures, featureSelect, blockSelect) {
	var html=`<table cellpadding="0px" cellspacing="0px" border="0px">
	<tr>
		<td>
			<div id="featuresDIV" class="borderbox" style="border-bottom:1px solid silver;height:12rem;overflow-y:auto;">
				<table cellpadding="0px" cellspacing="0px" border="0px" class="borderbox">
					<tr>
						<td colspan=2 class="tinypadded center nowrap">Genomic features and blocks:</td>
					</tr>
`;
	for (var t=0;t<myFeatures.length;t++) {
		html+=`
					<tr>
						<td class="tinypadded">
							<select id="FeatureToQuant_`+t+`" class="w100" onchange="renderQuantifyBlocks(`+t+`);checkQuantifyForm();">
								<option value="`+NOT_SELECTED+`" style="color:#000000;">Select Feature</option>
								`+featureSelect+`
							</select>
						</td>
						<td class="tinypadded">
							<select id="BlockToQuant_`+t+`" class="w100" onchange="checkQuantifyForm();">
								<option value="`+NOT_SELECTED+`" style="color:#000000;">Select Block</option>
								`+blockSelect+`
							</select>
						</td>
					</tr>`;
	}
	html+=`
					<tr><td class="right" colspan=2 style="padding-top:0.5rem;"><button class="buttonIcon" style="padding:0.25rem 0.5rem 0.25rem 0.5rem;" onclick="addFeatureBlockRow();_$('featuresDIV').scrollTop=100000;checkForm();">Add more</button></td></tr>
				</table>
			</div>
		</td>
	</tr>
</table>`;
	_$("featureAndBlockTD").innerHTML=html;
	for (var t=0;t<myFeatures.length;t++) {
		_$("FeatureToQuant_"+t).value=myFeatures[t].feature;
		_$("BlockToQuant_"+t).value=myFeatures[t].block;
	}
}






function addQuantifyRow(bamSelectHTML) {
	var myQuants=new Array();
	var t=0;
	while (_$("ToQuantify_"+t)) {
		myQuants[t]=_$("ToQuantify_"+t).value;
		t++;
	}
	// last element
	myQuants[t]=NOT_SELECTED;
	populateQuantifyQueueTD(myQuants, bamSelectHTML);
}

function populateQuantifyQueueTD(myQuants, bamSelectHTML) {
	var html=`<table cellpadding="0px" cellspacing="0px" border="0px" class="borderbox">
		<tr>
			<td class="medipadded center borderbox" id="quant_HTD">Alignments</td>
		</tr>
	</table>
	<div id="quantsDIV" class="borderbox" style="border-bottom:1px solid silver;height:18rem;overflow-y:scroll;" onscroll="SCT=this.scrollTop;if (this.scrollHeight-this.scrollTop < this.clientHeight+2) { addQuantifyRow(bamSelectHTML);_$('quantsDIV').scrollTop=SCT;checkQuantifyForm(); }">
		<table cellpadding="0px" cellspacing="0px" border="0px" class="borderbox" style="width:100%;">
			<tr id="TRquant_to_hide">
				<td class="medipadded center" id="quant_HTD_hidden">Alignments</td>
			</tr>
`;
	for (var t=0;t<myQuants.length;t++) {
		if (bamSelectHTML=="") { var isdisabled="disabled"; } else { var isdisabled=""; }
		html+=`
					<tr>
						<td class="tinypadded">
							<select `+isdisabled+` id="ToQuantify_`+t+`" class="w100" style="min-width:16rem;width:100%;" onchange="checkQuantifyForm();">
								<option value="`+NOT_SELECTED+`" style="color:#000000;">Select BAM</option>
								`+bamSelectHTML+`
							</select>
							<input type="hidden" id="Quantified_`+t+`" value="`+NOT_SELECTED+`">
						</td>
					</tr>`;
	}
	html+=`
		</table>
	</div>
	<div class="right medipadded">
		<button id="clearAlignmentsButton" onclick="clearAlignments();checkForm();">clear</button>
	</div>
`;
	_$("quantifyQueueTD").innerHTML=html;
	for (var t=0;t<myQuants.length;t++) {
		_$("ToQuantify_"+t).value=myQuants[t];
	}
	_$("quant_HTD").style.width=_$("quant_HTD_hidden").offsetWidth+"px";
	_$("TRquant_to_hide").style.display="none";
}

function clearAlignments() {
	var t=0;
	while (_$("ToQuantify_"+t)) {
		_$("ToQuantify_"+t).value=NOT_SELECTED;
		t++;
	}
}


function checkQuantifyForm() {
	var errors=0;
	var duplicatedfiles=0;
	var inputfiles=0;

	for (var o=0;o<PARAMS['quantify_with_featureCounts']['ID'].length;o++) {
		var Editable=PARAMS['quantify_with_featureCounts']["Editable"][o];
		if (Editable=="YES") {
			var Caption1=PARAMS['quantify_with_featureCounts']["Caption1"][o];
			var Caption2=PARAMS['quantify_with_featureCounts']["Caption2"][o];
			var Default=PARAMS['quantify_with_featureCounts']["Default"][o];
			var ID=PARAMS['quantify_with_featureCounts']["ID"][o];
			var Type=PARAMS['quantify_with_featureCounts']["Type"][o];
			var Range=PARAMS['quantify_with_featureCounts']["Range"][o];
			if (!validParam(ID, Type, Range)) { errors++; }
		}
	}


	
	_$("QUANT_OUT_SUFFIX").className="ValidInput";
	
//	if (!_$("QUANT_OUT_SUFFIX").value.match(/\w/)) {
//		errors++;
//		_$("QUANT_OUT_SUFFIX").className="WrongInput";
//	}
	
	if (_$("ReferenceToQuantifyBAM").value==NOT_SELECTED) {
		_$("ReferenceToQuantifyBAM").className="WrongInput";
		errors++;
	}
	else {
		_$("ReferenceToQuantifyBAM").className="ValidInput";
	}



	var t=0;
	var alreadyHere=new Object();
	var alreadyFile=new Object();
	while (_$("ToQuantify_"+t)) {
		if (_$("ToQuantify_"+t).value==NOT_SELECTED) {
			if (t==0) {
				_$("ToQuantify_"+t).style.color="black";
			}
			else {
				_$("ToQuantify_"+t).style.color="black";
			}
		}
		else {
			inputfiles++;

			var thisBAM=_$("ToQuantify_"+t).value;
			if (typeof(alreadyHere[thisBAM])=="undefined") {
				alreadyHere[thisBAM]=1;
				_$("ToQuantify_"+t).style.color="#000000";
			}
			else {
				alreadyHere[thisBAM]++;
				_$("ToQuantify_"+t).style.color="#FF0000";
				duplicatedfiles++;
			}

			var out=_$("ToQuantify_"+t).value.replace(/\.bam/,"")+"."+_$("QUANT_OUT_SUFFIX").value+".counts";
			out=out.replace(/\.\./,".");
			_$("Quantified_"+t).value=out;

			for (var f=0;f<DataTable["files"]["fname"].length;f++) {
				if (basename(out)==DataTable["files"]["fname"][f] && typeof(alreadyFile[f])=="undefined") {
					alreadyFile[f]=1;
					errors++;
					_$("QUANT_OUT_SUFFIX").className="WrongInput";
				}	
			}		
		}
		t++;
	}

	var t=0;
	
	var alreadyHere=new Object();
	var featureNotSelected=0;
	var featureSelected=0;
	while (_$("FeatureToQuant_"+t)) {
		if (_$("FeatureToQuant_"+t).value==NOT_SELECTED) {
			if (featureSelected==0) { _$("FeatureToQuant_"+t).style.color="#FF0000"; } else { _$("FeatureToQuant_"+t).style.color="#000000"; }
			featureNotSelected++;
		}
		else {
			featureSelected++;
			var thisFeature=_$("FeatureToQuant_"+t).value;
			if (typeof(alreadyHere[thisFeature])=="undefined") {
				alreadyHere[thisFeature]=1;
				_$("FeatureToQuant_"+t).style.color="#000000";
			}
			else {
				alreadyHere[thisFeature]++;
				_$("FeatureToQuant_"+t).style.color="#FF0000";
				duplicatedfiles++;
			}
		}
		var tmu=t-1;
		if (t>0) {
			if (_$("FeatureToQuant_"+tmu).value==NOT_SELECTED) {
				_$("FeatureToQuant_"+t).setAttribute("disabled","disabled");
				_$("BlockToQuant_"+t).setAttribute("disabled","disabled");
			}
			else {
				_$("FeatureToQuant_"+t).removeAttribute("disabled");
				_$("BlockToQuant_"+t).removeAttribute("disabled");
			}
		}
		t++;
	}
	if (featureSelected==0) { errors++; }
	
	if (errors>0 || duplicatedfiles>0 || inputfiles==0) { _$("featureCounts_LAUNCHBUTTON").setAttribute("disabled","true"); }
	else { _$("featureCounts_LAUNCHBUTTON").removeAttribute("disabled"); }
}



function renderQuantifyFeatures(){
	var s=0;
	while (_$("FeatureToQuant_"+s)) {
		var select = _$("FeatureToQuant_"+s);
		while (select.childNodes.length >= 1 ){
			select.removeChild(select.firstChild);       
		}
		var newOption = document.createElement('option');
		newOption.value=NOT_SELECTED;
		newOption.text="Select Feature";
		select.appendChild(newOption);
		var qFeatures = FeaturesTable["features"];
		if(qFeatures != null){
			var qKeys = Object.keys(qFeatures);
			for (var k in qKeys){
				newOption = document.createElement('option');
				newOption.value=qFeatures[qKeys[k]][1].replace(/:.+/,"");
				newOption.text=qFeatures[qKeys[k]][1];
				newOption.style="color:#000000;"
				select.appendChild(newOption);
				var featureKey=myFeatures[s].feature.replace(/:.+/,"");
				if (newOption.value=="gene") { newOption.setAttribute("selected","selected"); } 
			}
			renderQuantifyBlocks(s);
		}
		s++;
	}
	checkQuantifyForm();
}

function renderQuantifyBlocks(s){
	var select = _$("BlockToQuant_"+s);
	while (select.childNodes.length >= 1 ){
		select.removeChild(select.firstChild);       
	}
	var newOption = document.createElement('option');
	newOption.value=NOT_SELECTED;
	newOption.text="Select Block";
	select.appendChild(newOption);
	var qFeatures = FeaturesTable["features"];

	if(qFeatures != null && _$("FeatureToQuant_"+s).value!= NOT_SELECTED){
		var selectedFeature = _$("FeatureToQuant_"+s).value;
		var qKeys = Object.keys(qFeatures);
		var selectedFeatureIndex = -1;
		for (var k in qKeys) {
			var theKey=FeaturesTable["features"][qKeys[k]][1].replace(/:.+/,"");
			if(theKey == selectedFeature){
					selectedFeatureIndex = qKeys[k];
			}
		}
		if(selectedFeatureIndex != -1){
			var qKeys = FeaturesTable["features"][selectedFeatureIndex][0].split(" ");
			var already=new Object();
			for (var k = 0; k< qKeys.length;k++){
				if(qKeys[k] != "" && typeof(already[qKeys[k]])=="undefined"){
					newOption = document.createElement('option');
					newOption.value=qKeys[k].replace(/:.+/,"");
					newOption.text=qKeys[k];
					select.appendChild(newOption);
					if (myFeatures[s].block==newOption.value) { newOption.setAttribute("selected","selected"); } 
					already[qKeys[k]]=1;
				}
			}
		}
	}
}


// CONSTRUCT queue  and launch it (oliveros)
function launchQuantifyQueue() {
	CANCEL_NOW=false;
	// global variables to separate tasks in R: after each R task, a signal is sent to client to launch next one.
	CURRENT_TASKS=new Array();
	CURRENT_TASK_STEP=0;
	CURRENT_TASK_SAMPLE=0;
	
	
	var QUANTFUN="quantify_with_featureCounts";
	
	var common_params_quant=getCommonParams(PARAMS[QUANTFUN]);
	
	var features_blocks=new Object();
	var t=0;
	while (_$("FeatureToQuant_"+t)) {
		if (_$("FeatureToQuant_"+t).value!==NOT_SELECTED) {	
			features_blocks[_$("FeatureToQuant_"+t).value.replace(/:.+/,"")]=_$("BlockToQuant_"+t).value.replace(/:.+/,"");
		}
		t++;
	}	


	var t=0;
	while (_$("ToQuantify_"+t)) {
		if (_$("ToQuantify_"+t).value!==NOT_SELECTED) {	
			CURRENT_TASKS[CURRENT_TASK_SAMPLE]=new Array(); // first dimension is the sample
			
			var nn=0;

			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]=QUANTFUN;
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["features_blocks"]=features_blocks;
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["gff"]=basename(_$("ReferenceToQuantifyBAM").value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["input"]=basename(_$("ToQuantify_"+t).value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["output"]=basename(_$("Quantified_"+t).value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["common_params"]=common_params_quant;
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Quantifiying genomic features...";
			nn++;

			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="initialize_COUNTS_file";
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("Quantified_"+t).value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["dependencies"]=_$("ToQuantify_"+t).value+" @@ "+_$("ReferenceToQuantifyBAM").value;
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["features_blocks"]=features_blocks;
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["gff"]=basename(_$("ReferenceToQuantifyBAM").value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Inizialiting results file...";
			nn++;

			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="create_accessory_files_for_COUNTS";
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("Quantified_"+t).value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Creating accessory files...";
			nn++;


			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="add_COUNTS_to_project";
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("Quantified_"+t).value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Adding counts file to project...";
			nn++;
	
//			CURRENT_TASK_STEPS[CURRENT_TASK_SAMPLE]=CURRENT_TASKS[CURRENT_TASK_SAMPLE].length;
			CURRENT_TASK_SAMPLE++;
//			CURRENT_TASK_SAMPLES=CURRENT_TASK_SAMPLE;
		}
		t++;
	}
	var stepCaptions=new Array();
	for (var f=0;f<CURRENT_TASKS.length;f++) {
		stepCaptions[f]=CURRENT_TASKS[f][0]["data"]["input"];
		for (var ff=0;ff<CURRENT_TASKS[f].length;ff++) {
			if (!CURRENT_TASKS[f][ff]["bottomMessage"]) {
				CURRENT_TASKS[f][ff]["bottomMessage"]="--BOTTOM MESSAGE--";
			}
		}
	}
	hideContent(initStepsDialog("Quantifying Genomic Features...","Genomic Features Quantified", stepCaptions, "default", true));
	CURRENT_TASK_SAMPLE=0;
	CURRENT_TASK_STEP=0;
	var ShinyObject=new Object();
	ShinyObject["action"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["command"];
	ShinyObject["data"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["data"];
	nextStepInShiny(ShinyObject);
}







