'use strict';
function disableBowtie2(){
	if (_$("MenuSteps_Align_bowtie2").classList.contains('ButtonMenuContent') ){
		_$("MenuSteps_Align_bowtie2").classList.replace("ButtonMenuContent","ButtonMenuDisabled")
	}
	_$("MenuSteps_Align_bowtie2").setAttribute("title", "Rbowtie2 test failed: Check that Python 3 and Perl are properly installed (See About -> Readme)");
	_$("MenuSteps_Align_bowtie2").setAttribute("disabled","disabled");
}

function renderAlignmentTab(option){
	fastqSelect1=''
	fastqSelect2=''
	for (var key in DataTable) {
		if (DataTable.hasOwnProperty(key)) {
			var myObj=DataTable[key];
			var nElems=myObj["fname"].length;
			for(var i=0; i<nElems;i++){
				if(myObj["hidden"][i]=="NO"){
					var color="#0000FF";
					if(myObj["ftype"][i]=="fastq"){
						var viewFilesInfo=parseData(myObj["viewfiles"][i],"@@",";;")
						if(viewFilesInfo.hasOwnProperty("PAIR")){
							if(viewFilesInfo["PAIR"] ==2){
								fastqSelect2+='<option value="'+myObj["datapath"][i]+'" style="color:#000000;">'+myObj["fname"][i]+'</option>';
							} else {
								fastqSelect1+='<option value="'+myObj["datapath"][i]+'" style="color:#000000;">'+myObj["fname"][i]+'</option>';
							}
							
						}
						else{
							fastqSelect1+='<option value="'+myObj["datapath"][i]+'" style="color:#000000;">'+myObj["fname"][i]+'</option>';
							fastqSelect2+='<option value="'+myObj["datapath"][i]+'" style="color:#000000;">'+myObj["fname"][i]+'</option>';
						}
					}
					if(myObj["ftype"][i]=="fasta"){
						fastaSelect.push(myObj["datapath"][i]);
						fastaSelect.sort();
					}
				}
			}
		}
	}
	for (var t=0;t<fastaSelect.length;t++) {
		fastaSelectHTML+='<option style="font-size:inherit;" value="'+fastaSelect[t]+'" class="ValidInput">'+basename(fastaSelect[t])+'</option>';
	}
	
	if (fastaSelectHTML=="") { var isdisabled="disabled"; } else { var isdisabled=""; }

	var htmlOut=`
	<form id="NewAlignment" name="NewAlignment"  action="javascript:void(0);">
		<table cellpadding="0px" cellspacing="0px" border="0px" style="margin:1rem;">
			<tr>
				<td class="medipadded nowrap" colspan=2>
					<div class="nowrap" style="display:inline;">Genome Sequence:
						<select `+isdisabled+` id="ReferenceToAlignFASTA" onchange="checkAligningForm();">
							<option value="`+NOT_SELECTED+`" class="WrongInput">Select FASTA</option>
							`+fastaSelectHTML+`
						</select>
					</div>
				</td>
			</tr>
			<tr>
				<td id="alignmentsQueueTD" class="medipadded" style="height:16rem;">
				</td>
				<td class="medipadded" style="height:100%;">
					<div class="medipadded borderbox shadow bsilver radius">
						<table cellpadding="0px" cellspacing="0px" border="0px" style="height:18rem;">
							<tr>
								<td class="medipadded" style="border-bottom:1px solid #000000;display:none;">
									<b> Aligner:</b>
									<input type="radio" name="aligner" id="aligner_bowtie2" checked onclick="setAlignProgram()"/>
									Bowtie2
									<input type="radio" name="aligner" id="aligner_hisat2" onclick="setAlignProgram()"/>
									HISAT2
									<input type="hidden" name="alignprogram" id="alignprogram" value="align_with_bowtie2"/>
									<input type="hidden" name="removedupsprogram" id="removedupsprogram" value="removedups_with_removeDupReads"/>
								</td>
								<td id="alignFunctionCaption" colspan=2 class="medipadded" style="border-bottom:1px solid #000000;">
									<b> Function:</b> featureCounts (Rsubread) nnnnn
								</td>

							</tr>
							<tr>
								<td class="medipadded top" style="border-bottom:1px solid #000000;border-top:1px solid #EFEFEF;">
									<div id="bowtie2_options" name="bowtie2_options" class="medipadded" style="height:12rem;overflow-y:auto;">
									`+populateFunctionOptions("align_with_bowtie2")+`
									</div>
									<div id="hisat2_options" name="hisat2_options" class="medipadded" style="height:12rem;overflow-y:auto;display:none;">
									`+populateFunctionOptions("align_with_hisat2")+`
									</div>
								</td>
							</tr>
							<tr>
								<td style="border-top:1px solid #EFEFEF;">
									<div id="removeDupReads_options" name="removeDupReads_options" class="medipadded" style="height:4rem;overflow-y:auto;">
									`+populateFunctionOptions("removedups_with_removeDupReads")+`
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
						Output files suffix (optional): <input type="textbox" id="ALIGN_OUT_SUFFIX" placeholder="" value="" oninput="this.value=this.value.replace(/[^a-z\.A-Z0-9\-\+\(\)_]/g,'');checkAligningForm();" title="Common suffix to be added to all output file names.">
					</div>
				</td>
				<td class="medipadded center">
					<input type="button" id="Align_LAUNCHBUTTON" value="Launch!" onClick="launchAlignmentQueue()" class="ButtonLaunch">
				</td>
			</tr>
		</table>
	</form>`;

	document.getElementById('AlignFormTable').innerHTML=htmlOut;
	addAlignment(fastqSelect1,fastqSelect2);
	addAlignment(fastqSelect1,fastqSelect2);
	addAlignment(fastqSelect1,fastqSelect2);
	addAlignment(fastqSelect1,fastqSelect2);
	addAlignment(fastqSelect1,fastqSelect2);
	addAlignment(fastqSelect1,fastqSelect2);
	addAlignment(fastqSelect1,fastqSelect2);
	addAlignment(fastqSelect1,fastqSelect2);
	addAlignment(fastqSelect1,fastqSelect2);
	addAlignment(fastqSelect1,fastqSelect2);
	addAlignment(fastqSelect1,fastqSelect2);
	addAlignment(fastqSelect1,fastqSelect2);
	addAlignment(fastqSelect1,fastqSelect2);
	addAlignment(fastqSelect1,fastqSelect2);
	addAlignment(fastqSelect1,fastqSelect2);
	addAlignment(fastqSelect1,fastqSelect2);
	addAlignment(fastqSelect1,fastqSelect2);
	if (option=="bowtie2") {
		_$("aligner_bowtie2").setAttribute("checked", "checked");
		_$("aligner_hisat2").removeAttribute("checked");
		_$("alignFunctionCaption").innerHTML="<b>Function:</b> bowtie2 (Rbowtie2)";
	}
	if (option=="hisat2") {
		_$("aligner_hisat2").setAttribute("checked", "checked");
		_$("aligner_bowtie2").removeAttribute("checked");
		_$("alignFunctionCaption").innerHTML="<b>Function:</b> hisat2 (Rhisat2)";
	}
	setAlignProgram();
}



// CONSTRUCT queue  and launch it (oliveros)
function launchAlignmentQueue() {
	CANCEL_NOW=false;
	// global variables to separate tasks in R: after each R task, a signal is sent to client to launch next one.
	CURRENT_TASKS=new Array();
	CURRENT_TASK_STEP=0;
	CURRENT_TASK_SAMPLE=0;
	
	var ALIGNFUN=_$("alignprogram").value;
	
	var common_params_aligner=getCommonParams(PARAMS[ALIGNFUN]);
		
	if (_$("removeDupReads_thresholdCheck").checked) { 
		var REMOVEDUPSFUN=_$("removedupsprogram").value;
	}
	else {
		var REMOVEDUPSFUN=NOT_SELECTED;
	}
	
	if (REMOVEDUPSFUN!==NOT_SELECTED) {
		var common_params_removedups=getCommonParams(PARAMS[REMOVEDUPSFUN]);
	}		

	var t=0;
	while (_$("ToAlignFQ1_"+t)) {
		if (_$("ToAlignFQ1_"+t).value!==NOT_SELECTED) {	
			CURRENT_TASKS[CURRENT_TASK_SAMPLE]=new Array(); // first dimension is the sample
			
			var nn=0;

			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]=ALIGNFUN;
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["genome"]=basename(_$("ReferenceToAlignFASTA").value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["input1"]=basename(_$("ToAlignFQ1_"+t).value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["input2"]=basename(_$("ToAlignFQ2_"+t).value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["output"]=basename(_$("AlignedBAM_"+t).value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["common_params"]=common_params_aligner;
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Aligning reads to genome...";

			if (REMOVEDUPSFUN!==NOT_SELECTED) {
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["commandRemoveDups"]=REMOVEDUPSFUN;
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["common_params_removeDups"]=common_params_removedups;
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Aligning reads to genome and removing duplicates...";
			}
			else {
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["commandRemoveDups"]="none";
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["common_params_removeDups"]="";
			}

			nn++;

			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="initialize_BAM_file";
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("AlignedBAM_"+t).value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["output"]=basename(_$("AlignedBAM_"+t).value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["dependencies"]=_$("ToAlignFQ1_"+t).value+" @@ "+_$("ToAlignFQ2_"+t).value+" @@ "+_$("ReferenceToAlignFASTA").value;
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Initializing results file...";
			nn++;

			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="create_accessory_files_for_BAM";
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("AlignedBAM_"+t).value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["output"]=basename(_$("AlignedBAM_"+t).value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Creatting accessory files...";
			nn++;


			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="add_BAM_to_project";
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("AlignedBAM_"+t).value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["output"]=basename(_$("AlignedBAM_"+t).value);	
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Adding file to project...";
			nn++;

		
			CURRENT_TASK_SAMPLE++;
		}
		t++;
	}
	var stepCaptions=new Array();
	for (var f=0;f<CURRENT_TASKS.length;f++) {
		if (CURRENT_TASKS[f][0]["data"]["input2"]==NOT_SELECTED) {
			stepCaptions[f]=CURRENT_TASKS[f][0]["data"]["input1"];
		}
		else {
			stepCaptions[f]=CURRENT_TASKS[f][0]["data"]["input1"]+`&nbsp;&nbsp;&nbsp;and&nbsp;&nbsp;&nbsp;`+CURRENT_TASKS[f][0]["data"]["input2"];
		}
		for (var ff=0;ff<CURRENT_TASKS[f].length;ff++) {
			if (!CURRENT_TASKS[f][ff]["bottomMessage"]) {
				CURRENT_TASKS[f][ff]["bottomMessage"]="--BOTTOM MESSAGE--";
			}
		}
	}
	hideContent(initStepsDialog("Aligning reads to genome..."," Reads aligned", stepCaptions, "default", true));
	CURRENT_TASK_SAMPLE=0;
	CURRENT_TASK_STEP=0;
	var ShinyObject=new Object();
	ShinyObject["action"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["command"];
	ShinyObject["data"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["data"];
	nextStepInShiny(ShinyObject);
}

function addAlignment(fastqSelect1,fastqSelect2) {
	var myAlignments=new Array();
	var t=0;
	while (_$("ToAlignFQ1_"+t)) {
		myAlignments[t]=new Array();
		myAlignments[t].fq1=_$("ToAlignFQ1_"+t).value;
		myAlignments[t].fq2=_$("ToAlignFQ2_"+t).value;
		myAlignments[t].label=_$("ALIGN_OUT_"+t).value;
		t++;
	}
	// last element
	myAlignments[t]=new Array();
	myAlignments[t].fq1=NOT_SELECTED;
	myAlignments[t].fq2=NOT_SELECTED;
	myAlignments[t].label="";
	populateAlignmentsQueueTD(myAlignments, fastqSelect1,fastqSelect2);
}

function populateAlignmentsQueueTD(myAlignments, fastqSelect1,fastqSelect2) {

	var html=`<div id="alignmentsDIV" class="borderbox" style="border-bottom:1px solid silver;height:22rem;overflow-y:scroll;" onscroll="SCT=this.scrollTop;if (this.scrollHeight-this.scrollTop < this.clientHeight+2) { addAlignment(fastqSelect1,fastqSelect2);_$('alignmentsDIV').scrollTop=SCT;checkAligningForm(); }">
<table cellpadding="0px" cellspacing="0px" border="0px" class="borderbox" style="height:100%;">
	<tr style="position:sticky;top:0px;background:#EFEFEF;z-index:9999">
		<th class="medipadded center" id="fastq1_HTD">Fastq 1</td>
		<th class="medipadded center" id="fastq2_HTD">Fastq 2 (optional)</td>
		<th class="medipadded center" id="sampleLabel_HTD">Sample Label</td>
	</tr>
`;

	if (fastqSelect1=="") { var isdisabled="disabled"; } else { var isdisabled=""; }

	for (var t=0;t<myAlignments.length;t++) {
		html+=`
	<tr>
		<td class="tinypadded">
			<select `+isdisabled+` id="ToAlignFQ1_`+t+`" class="w100" style="min-width:16rem;" onchange="autoPairSelection('ToAlignFQ1_`+t+`','ToAlignFQ2_`+t+`',1);checkAligningForm();">
				<option value="`+NOT_SELECTED+`" style="color:#000000;">Select FASTQ</option>
				`+fastqSelect1+`
			</select>
			<input type="hidden" id="AlignedBAM_`+t+`" value="`+NOT_SELECTED+`">
		</td>
		<td class="tinypadded">
			<select id="ToAlignFQ2_`+t+`" class="w100" style="min-width:16rem;" onchange="autoPairSelection('ToAlignFQ1_`+t+`','ToAlignFQ2_`+t+`',2);checkAligningForm();">
				<option value="`+NOT_SELECTED+`" style="color:#000000;">Select FASTQ (paired)</option>
				`+fastqSelect2+`
			</select>
		</td>
		<td class="tinypadded">
			<input type="text" id="ALIGN_OUT_`+t+`" oninput="this.value=this.value.replace(/[^a-zA-Z0-9-_\.]/g,'_');checkAligningForm();" />
		</td>
	</tr>`;
	}
	html+=`
	</table>
	</div>
	<div class="right medipadded">
		<button id="clearFastqToAlignButton" onclick="clearFastqToAlign();checkForm();">clear</button>
	</div>
`;
	_$("alignmentsQueueTD").innerHTML=html;
	for (var t=0;t<myAlignments.length;t++) {
		_$("ToAlignFQ1_"+t).value=myAlignments[t].fq1;
		_$("ToAlignFQ2_"+t).value=myAlignments[t].fq2;
		_$("ALIGN_OUT_"+t).value=myAlignments[t].label;
	}
}

function clearFastqToAlign() {
	var t=0;
	while (_$("ToAlignFQ1_"+t)) {
		_$("ToAlignFQ1_"+t).value=NOT_SELECTED;
		_$("ToAlignFQ2_"+t).value=NOT_SELECTED;
		_$("ALIGN_OUT_"+t).value="";
		t++;
	}
}

function setAlignProgram(){
		if(_$("aligner_bowtie2").checked == true){
			_$("alignprogram").value="align_with_bowtie2";
			_$("bowtie2_options").style.display="block";
			_$("hisat2_options").style.display="none";
//			_$("align_options").style.display="none";
		} 
		else if (_$("aligner_hisat2").checked == true){
			_$("alignprogram").value="align_with_hisat2"
			_$("bowtie2_options").style.display="none";
			_$("hisat2_options").style.display="block";
//			_$("align_options").style.display="none";
		}
//		else if (_$("aligner_align").checked == true){
//			_$("alignprogram").value="align_with_alignRsubread"
//			_$("bowtie2_options").style.display="none";
//			_$("hisat2_options").style.display="none";
//			_$("align_options").style.display="block";
//		}
}

function checkAligningForm() {
	_$("ALIGN_OUT_SUFFIX").className="ValidInput";
	var errors=0;
	var inputfiles=0;
	var duplicatedfiles=0;
	var ALIGNFUN=_$("alignprogram").value;
	for (var o=0;o<PARAMS[ALIGNFUN]['ID'].length;o++) {
		var Editable=PARAMS[ALIGNFUN]["Editable"][o];
		if (Editable=="YES") {
			var Caption1=PARAMS[ALIGNFUN]["Caption1"][o];
			var Caption2=PARAMS[ALIGNFUN]["Caption2"][o];
			var Default=PARAMS[ALIGNFUN]["Default"][o];
			var ID=PARAMS[ALIGNFUN]["ID"][o];
			var Type=PARAMS[ALIGNFUN]["Type"][o];
			var Range=PARAMS[ALIGNFUN]["Range"][o];	
			if (!validParam(ID, Type, Range)) { errors++; _$(ID).className="WrongInput"+Type; } else { _$(ID).className="ValidInput"+Type; }
		}
	}
	var REMOVEDUPSFUN=_$("removedupsprogram").value;
	for (var o=0;o<PARAMS[REMOVEDUPSFUN]['ID'].length;o++) {
		var Editable=PARAMS[REMOVEDUPSFUN]["Editable"][o];
		if (Editable=="YES") {
			var Caption1=PARAMS[REMOVEDUPSFUN]["Caption1"][o];
			var Caption2=PARAMS[REMOVEDUPSFUN]["Caption2"][o];
			var Default=PARAMS[REMOVEDUPSFUN]["Default"][o];
			var ID=PARAMS[REMOVEDUPSFUN]["ID"][o];
			var Type=PARAMS[REMOVEDUPSFUN]["Type"][o];
			var Range=PARAMS[REMOVEDUPSFUN]["Range"][o];	
			if (!validParam(ID, Type, Range)) { errors++; }
		}
	}
	
//	if (!_$("ALIGN_OUT_SUFFIX").value.match(/\w/)) {
//		errors++;
//		_$("ALIGN_OUT_SUFFIX").className="WrongInput";
//	}

	
	if (_$("ReferenceToAlignFASTA").value==NOT_SELECTED) {
		_$("ReferenceToAlignFASTA").className="WrongInput";
		errors++;
	}
	else {
		_$("ReferenceToAlignFASTA").className="ValidInput";
	}

	var t=0;
	var alreadyHere=new Object();
	var alreadyFile=new Object();
	var alreadyLabelOut=new Object();
	while (_$("ToAlignFQ1_"+t)) {
		if (_$("ToAlignFQ1_"+t).value==NOT_SELECTED) {
			if (t==0) {
				_$("ToAlignFQ1_"+t).style.color="black";
			}
			else {
				_$("ToAlignFQ1_"+t).style.color="black";
			}
			_$("ToAlignFQ2_"+t).setAttribute("disabled","disabled");
			_$("ToAlignFQ2_"+t).value=NOT_SELECTED;
			_$("ToAlignFQ2_"+t).style.color="silver";
			_$("ALIGN_OUT_"+t).setAttribute("disabled","disabled");
			_$("ALIGN_OUT_"+t).className="ValidInput";
		}
		else {
			_$("ToAlignFQ2_"+t).removeAttribute("disabled");
			_$("ToAlignFQ2_"+t).style.color="black";
			_$("ALIGN_OUT_"+t).removeAttribute("disabled");
			_$("ALIGN_OUT_"+t).style.color="black";
			inputfiles++;
			var out=_$("ALIGN_OUT_"+t).value+"."+_$("ALIGN_OUT_SUFFIX").value+".bam";
			out=out.replace(/\.\./,".");
			_$("AlignedBAM_"+t).value=out;
			if (!_$("ALIGN_OUT_"+t).value.match(/\w/)) {
				errors++;
				_$("ALIGN_OUT_"+t).className="WrongInput";
			}
			else {
				_$("ALIGN_OUT_"+t).className="ValidInput";
				if (typeof(alreadyLabelOut[_$("ALIGN_OUT_"+t).value])=="undefined") {
					alreadyLabelOut[_$("ALIGN_OUT_"+t).value]=true;
				}
				else {
					errors++;
					_$("ALIGN_OUT_"+t).className="WrongInput";
				}
			}

			for (var f=0;f<DataTable["files"]["fname"].length;f++) {
				if (basename(out)==DataTable["files"]["fname"][f] && typeof(alreadyFile[f])=="undefined") {
					alreadyFile[f]=1;
					errors++;
					_$("ALIGN_OUT_SUFFIX").className="WrongInput";
					_$("ALIGN_OUT_"+t).className="WrongInput";
				}	
			}	
		}
		t++;
	}
	
	var t=0;
	while (_$("ToAlignFQ1_"+t)) {
		if (_$("ToAlignFQ1_"+t).value==NOT_SELECTED) {
		}
		else {
			if (typeof(alreadyHere[_$("ToAlignFQ1_"+t).value])=="undefined") {
				alreadyHere[_$("ToAlignFQ1_"+t).value]=1;
				_$("ToAlignFQ1_"+t).style.color="#000000";
			}
			else {
				alreadyHere[_$("ToAlignFQ1_"+t).value]++;
				_$("ToAlignFQ1_"+t).style.color="#FF0000";
				duplicatedfiles++;
			}
		}
		t++;
	}

	var t=0;
	while (_$("ToAlignFQ2_"+t)) {
		if (_$("ToAlignFQ2_"+t).value==NOT_SELECTED) {
		}
		else {
			if (typeof(alreadyHere[_$("ToAlignFQ2_"+t).value])=="undefined") {
				alreadyHere[_$("ToAlignFQ2_"+t).value]=1;
				_$("ToAlignFQ2_"+t).style.color="#000000";
			}
			else {
				alreadyHere[_$("ToAlignFQ2_"+t).value]++;
				_$("ToAlignFQ2_"+t).style.color="#FF0000";
				duplicatedfiles++;
			}
		}
		t++;
	}


	if (errors>0 || duplicatedfiles>0 || inputfiles==0) { _$("Align_LAUNCHBUTTON").setAttribute("disabled","true"); }
	else { _$("Align_LAUNCHBUTTON").removeAttribute("disabled"); }
}


