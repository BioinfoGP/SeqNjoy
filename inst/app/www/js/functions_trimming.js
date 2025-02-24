'use strict';

function renderTrimTab(option){
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
				}
			}
		}
	}

	var htmlOut=`
	<form id="NewTrim" name="NewTrim"  action="javascript:void(0);">
		<table cellpadding="0px" cellspacing="0px" border="0px" style="margin:1rem;">
			<tr>
				<td class="medipadded" colspan=2>
					<input type="hidden" name="trimprogram" id="trimprogram" value="`+option+`"/>
					<div class="nowrap" style="display:inline;margin:1rem;margin-left:0rem;">Output Prefix: <input type="textbox" id="TRIM_OUT_PREFIX" placeholder="" value="" oninput="this.value=this.value.replace(/[^a-z\.A-Z0-9\-\+\(\)_ ]/g,'');checkTrimmingForm();"></div>
					<div class="nowrap" style="display:inline;opacity:0;">
						Genome:
						<select disabled id="DUMMY" onchange="checkForm();">
							<option value="`+NOT_SELECTED+`">Select FASTA</option>
						</select>
					</div>
				</td>
			</tr>
			<tr>
				<td id="trimsQueueTD" class="medipadded" style="height:16rem;">
				</td>
				<td class="medipadded" style="height:16rem;">
					<div class="borderbox medipadded shadow bsilver radius">
						<table cellpadding="0px" cellspacing="0px" border="0px" height="100%" style="min-width:16rem;">
							<tr>
								<td class="medipadded" style="border-bottom:1px solid #000000;">
									<b> Function:</b>
									`+option.toLowerCase()+`									
								</td>
							</tr>
							<tr>
								<td class="medipadded top" style="border-top:1px solid #EFEFEF;">
									<div id="trimming_options" name="trimming_options" class="medipadded" style="height:12rem;overflow-y:auto;overflow-x:hidden">
									`+populateFunctionOptions("filter_with_"+option)+`
									</div>
								</td>
							</tr>	
						</table>
					</div>
				</td>
			</tr>
			<tr>
				<td>
				</td>
				<td>
					<div class="medipadded center"><input type="button" class="ButtonLaunch" id="filterAndTrim_LAUNCHBUTTON" disabled value="Launch!" onClick="launchTrimQueue()"></div>
				</td>
			</tr>
		</table>
	</form>`;
	document.getElementById('TrimFormTable').innerHTML=htmlOut;
	addTrimRow(fastqSelect1,fastqSelect2);
	addTrimRow(fastqSelect1,fastqSelect2);
	addTrimRow(fastqSelect1,fastqSelect2);
	addTrimRow(fastqSelect1,fastqSelect2);
	addTrimRow(fastqSelect1,fastqSelect2);
	addTrimRow(fastqSelect1,fastqSelect2);
	addTrimRow(fastqSelect1,fastqSelect2);
	addTrimRow(fastqSelect1,fastqSelect2);
	addTrimRow(fastqSelect1,fastqSelect2);
	addTrimRow(fastqSelect1,fastqSelect2);
	addTrimRow(fastqSelect1,fastqSelect2);
	addTrimRow(fastqSelect1,fastqSelect2);
	addTrimRow(fastqSelect1,fastqSelect2);
	addTrimRow(fastqSelect1,fastqSelect2);
	addTrimRow(fastqSelect1,fastqSelect2);
	addTrimRow(fastqSelect1,fastqSelect2);
}

//function removeTrimRow(n, fastqSelect1,fastqSelect2) {
//	var myTrims=new Array();
//	var t=0;
//	var tt=0;
//	while (_$("ToTrimFQ1_"+t)) {
//		if (t!==n) {
//			myTrims[tt]=new Array();
//			myTrims[tt].fq1=_$("ToTrimFQ1_"+t).value;
//			myTrims[tt].fq2=_$("ToTrimFQ2_"+t).value;
//			tt++;
//		}
//		t++;
//	}
//	populateTrimQueueTD(myTrims, fastqSelect1,fastqSelect2);
//	if (tt<2) { _$("removeTrim_0").disabled=true; }
//}

function addTrimRow(fastqSelect1,fastqSelect2) {
	var myTrims=new Array();
	var t=0;
	while (_$("ToTrimFQ1_"+t)) {
		myTrims[t]=new Array();
		myTrims[t].fq1=_$("ToTrimFQ1_"+t).value;
		myTrims[t].fq2=_$("ToTrimFQ2_"+t).value;
		t++;
	}
	// last element
	myTrims[t]=new Array();
	myTrims[t].fq1=NOT_SELECTED;
	myTrims[t].fq2=NOT_SELECTED;
	populateTrimQueueTD(myTrims, fastqSelect1,fastqSelect2);
}

function populateTrimQueueTD(myTrims, fastqSelect1,fastqSelect2) {
	var html=`<table cellpadding="0px" cellspacing="0px" border="0px" class="borderbox">
	<tr>
		<td class="medipadded center borderbox" id="fastq1_trim_HTD">Fastq 1</td>
		<td class="medipadded center borderbox" id="fastq2_trim_HTD">Fastq 2 (optional)</td>
	</tr>
</table>
<div id="trimsDIV" class="borderbox" style="border-bottom:1px solid silver;height:16rem;overflow-y:scroll;" onscroll="SCT=this.scrollTop;if (this.scrollHeight-this.scrollTop === this.clientHeight) { addTrimRow(fastqSelect1,fastqSelect2);_$('trimsDIV').scrollTop=SCT;checkTrimmingForm(); }">
	<table cellpadding="0px" cellspacing="0px" border="0px" class="borderbox">
		<tr id="TRtrim_to_hide">
			<td class="medipadded center" id="fastq1_trim_HTD_hidden">Fastq 1</td>
			<td class="medipadded center" id="fastq2_trim_HTD_hidden">Fastq 2 (optional)</td>
		</tr>
`;

	if (fastqSelect1=="") { var isdisabled="disabled"; } else { var isdisabled=""; }

	for (var t=0;t<myTrims.length;t++) {
		html+=`
		<tr>
			<td class="tinypadded">
				<select `+isdisabled+` id="ToTrimFQ1_`+t+`" class="w100" style="min-width:16rem;" onchange="autoPairSelection('ToTrimFQ1_`+t+`','ToTrimFQ2_`+t+`',1);checkTrimmingForm();">
					<option value="`+NOT_SELECTED+`" style="color:#000000;">Select FASTQ</option>
					`+fastqSelect1+`
				</select>
				<input type="hidden" id="TrimmedFQ1_`+t+`" value="`+NOT_SELECTED+`">
			</td>
			<td class="tinypadded">
				<select id="ToTrimFQ2_`+t+`" class="w100" style="min-width:16rem;" onchange="autoPairSelection('ToTrimFQ1_`+t+`', 'ToTrimFQ2_`+t+`', 2);checkTrimmingForm();">
					<option value="`+NOT_SELECTED+`" style="color:#000000;">Select FASTQ (paired)</option>
					`+fastqSelect2+`
				</select>
				<input type="hidden" id="TrimmedFQ2_`+t+`" value="`+NOT_SELECTED+`">
			</td>
		</tr>`;
	}
	html+=`
	</table>
</div>
`;
	_$("trimsQueueTD").innerHTML=html;
	for (var t=0;t<myTrims.length;t++) {
		_$("ToTrimFQ1_"+t).value=myTrims[t].fq1;
		_$("ToTrimFQ2_"+t).value=myTrims[t].fq2;
	}
	_$("fastq1_trim_HTD").style.width=_$("fastq1_trim_HTD_hidden").offsetWidth+"px";
	_$("fastq2_trim_HTD").style.width=_$("fastq2_trim_HTD_hidden").offsetWidth+"px";
	_$("TRtrim_to_hide").style.display="none";
}

function launchTrimQueue() {
	CANCEL_NOW=false;
	// global variables to separate tasks in R: after each R task, a signal is sent to client to launch next one.
	CURRENT_TASKS=new Array();
	CURRENT_TASK_STEP=0;
	CURRENT_TASK_SAMPLE=0;
	var TRIMFUN=_$("trimprogram").value;

	var common_params_trimmer=getCommonParams(PARAMS["filter_with_"+TRIMFUN]);

	var t=0;
	while (_$("ToTrimFQ1_"+t)) {
		if (_$("ToTrimFQ1_"+t).value!==NOT_SELECTED) {	
			CURRENT_TASKS[t]=new Array(); // first dimension is the sample
			
			var nn=0;

			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="filter_with_"+TRIMFUN;
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["input1"]=basename(_$("ToTrimFQ1_"+t).value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["input2"]=basename(_$("ToTrimFQ2_"+t).value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["output1"]=basename(_$("TrimmedFQ1_"+t).value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["output2"]=basename(_$("TrimmedFQ2_"+t).value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["common_params"]=common_params_trimmer;		
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Filtering and/or trimming reads...";
			nn++;

			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="initialize_FASTQ_file";
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("TrimmedFQ1_"+t).value);		
			// CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["dependencies"]=_$("ToTrimFQ1_"+t).value;		
			// CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["viewfiles"]=basename(_$("TrimmedFQ1_"+t).value)+".html";
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Initializing FASTQ...";
			nn++;

			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="create_accessory_files_for_FASTQ";
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("TrimmedFQ1_"+t).value);		
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Creating accessory files for FASTQ...";
			nn++;

			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="add_FASTQ_to_project";
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("TrimmedFQ1_"+t).value);		
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Adding FASTQ file to project...";
			nn++;

			
			if (_$("TrimmedFQ2_"+t).value!==NOT_SELECTED) {
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="initialize_FASTQ_file";
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("TrimmedFQ2_"+t).value);		
				// CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["dependencies"]=_$("ToTrimFQ2_"+t).value;		
				// CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["viewfiles"]=basename(_$("TrimmedFQ2_"+t).value)+".html";	
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Initializing mate FASTQ...";
				nn++;

				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="create_accessory_files_for_FASTQ";
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("TrimmedFQ2_"+t).value);		
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Creating accessory files for mate FASTQ...";
				nn++;
			}
			

			if (_$("TrimmedFQ2_"+t).value!==NOT_SELECTED) {
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="add_FASTQ_to_project";
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("TrimmedFQ2_"+t).value);
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Adding mate FASTQ file to project...";
			}
			CURRENT_TASK_SAMPLE++;
		}
		t++;
	}


//	var stepCaptions=new Array();
//	var st=0;
//	for (var f=0;f<TrimQueue["data"][0]["input1"].length;f++) {
//		stepCaptions[st]=TrimQueue["data"][0]["input1"][f]+` and `+TrimQueue["data"][0]["input2"][f];
//		st++;
//	}
//	hideContent(initStepsDialog("Processing FASTQ Files...",stepCaptions, "default", true));
//	sendShinyObject(TrimQueue);







	var stepCaptions=new Array();
	for (var f=0;f<CURRENT_TASKS.length;f++) {
		stepCaptions[f]=CURRENT_TASKS[f][0]["data"]["input1"];
		if(CURRENT_TASKS[f][0]["data"]["input2"] != NOT_SELECTED){
			stepCaptions[f]+=` and `+CURRENT_TASKS[f][0]["data"]["input2"];
		}
		for (var ff=0;ff<CURRENT_TASKS[f].length;ff++) {
			if (!CURRENT_TASKS[f][ff]["bottomMessage"]) {
				CURRENT_TASKS[f][ff]["bottomMessage"]="--BOTTOM MESSAGE--";
			}
		}
	}
	hideContent(initStepsDialog("Pre-processing reads...", "Reads pre-processed", stepCaptions, "default", true));
	CURRENT_TASK_SAMPLE=0;
	CURRENT_TASK_STEP=0;
	var ShinyObject=new Object();
	ShinyObject["action"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["command"];
	ShinyObject["data"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["data"];
	nextStepInShiny(ShinyObject);
}




function checkTrimmingForm() {
	_$("TRIM_OUT_PREFIX").className="ValidInput";
	var TRIMFUN=_$("trimprogram").value;
	var errors=0;
	var inputfiles=0;
	var duplicatedfiles=0;
	for (var o=0;o<PARAMS['filter_with_'+TRIMFUN]['ID'].length;o++) {
		var Editable=PARAMS['filter_with_'+TRIMFUN]["Editable"][o];
		if (Editable=="YES") {
			var Caption1=PARAMS['filter_with_'+TRIMFUN]["Caption1"][o];
			var Caption2=PARAMS['filter_with_'+TRIMFUN]["Caption2"][o];
			var Default=PARAMS['filter_with_'+TRIMFUN]["Default"][o];
			var ID=PARAMS['filter_with_'+TRIMFUN]["ID"][o];
			var Type=PARAMS['filter_with_'+TRIMFUN]["Type"][o];
			var Range=PARAMS['filter_with_'+TRIMFUN]["Range"][o];	
			if (!validParam(ID, Type, Range)) { errors++;  }
		}
	}
	
	if (!_$("TRIM_OUT_PREFIX").value.match(/\w/)) {
		errors++;
		_$("TRIM_OUT_PREFIX").className="WrongInput";
	}
	
	var t=0;
	var alreadyHere=new Object();
	var alreadyFile=new Object();
	while (_$("ToTrimFQ1_"+t)) {
		var class1="ValidOutputFile";
		var class2="ValidOutputFile";

		if (_$("ToTrimFQ1_"+t).value==NOT_SELECTED) {
			_$("ToTrimFQ1_"+t).style.color="#000000";
			_$("ToTrimFQ2_"+t).setAttribute("disabled","disabled");
			_$("ToTrimFQ2_"+t).value=NOT_SELECTED;
			_$("ToTrimFQ2_"+t).style.color="silver";
		}
		else {
			_$("ToTrimFQ2_"+t).removeAttribute("disabled");
			_$("ToTrimFQ2_"+t).style.color="black";
			inputfiles++;
			if (basename(_$("ToTrimFQ1_"+t).value).match(/\.gz$/)) {
				var sample=basename(_$("ToTrimFQ1_"+t).value).replace(/(\.[^\.]+\.gz)$/,"");
				var extension=basename(_$("ToTrimFQ1_"+t).value).replace(/^.+\.([^\.]+)\.gz$/,"$1");
			}
			else {
				var sample=basename(_$("ToTrimFQ1_"+t).value).replace(/(\.[^\.]+)$/,"");
				var extension=basename(_$("ToTrimFQ1_"+t).value).replace(/^.+\.([^\.]+)$/,"$1");
			}
			var out1=dirname(_$("ToTrimFQ1_"+t).value)+_$("TRIM_OUT_PREFIX").value+"_"+sample+"."+extension+".gz";
			out1=out1.replace(/\.\./,".");
			_$("TrimmedFQ1_"+t).value=out1;
			if (typeof(alreadyHere[out1])=="undefined") {
				alreadyHere[out1]=1;
				_$("ToTrimFQ1_"+t).style.color="#000000";
			}
			else {
				alreadyHere[out1]++;
				_$("ToTrimFQ1_"+t).style.color="#FF0000";
				duplicatedfiles++;
			}
			var out2=NOT_SELECTED;
			if (_$("ToTrimFQ2_"+t).value!==NOT_SELECTED) {
				if (basename(_$("ToTrimFQ2_"+t).value).match(/\.gz$/)) {
					var sample=basename(_$("ToTrimFQ2_"+t).value).replace(/(\.[^\.]+\.gz$)/,"");
					var extension=basename(_$("ToTrimFQ2_"+t).value).replace(/^.+\.([^\.]+)\.gz$/,"$1");
				}
				else {
					var sample=basename(_$("ToTrimFQ2_"+t).value).replace(/(\.[^\.]+$)/,"");
					var extension=basename(_$("ToTrimFQ2_"+t).value).replace(/^.+\.([^\.]+)$/,"$1");
				}
				var out2=dirname(_$("ToTrimFQ2_"+t).value)+_$("TRIM_OUT_PREFIX").value+"_"+sample+"."+extension+".gz";
				out2=out2.replace(/\.\./,".");

				_$("TrimmedFQ2_"+t).value=out2;
				if (typeof(alreadyHere[out2])=="undefined") {
					_$("ToTrimFQ2_"+t).style.color="#000000";
					alreadyHere[out2]=1;
				}
				else {
					alreadyHere[out2]++;
					_$("ToTrimFQ2_"+t).style.color="#FF0000";
					duplicatedfiles++;
				}
			}

			for (var f=0;f<DataTable["files"]["fname"].length;f++) {
				if (basename(out1)==DataTable["files"]["fname"][f] && typeof(alreadyFile[f])=="undefined") {
					alreadyFile[f]=1;
					errors++;
					_$("TRIM_OUT_PREFIX").className="WrongInput";
				}	
				if (basename(out2)==DataTable["files"]["fname"][f] && typeof(alreadyFile[f])=="undefined") {
					alreadyFile[f]=1;
					errors++;
					_$("TRIM_OUT_PREFIX").className="WrongInput";
				}	
			}
		}
		t++;
	}
	
	if (errors>0 || duplicatedfiles>0 || inputfiles==0) { _$("filterAndTrim_LAUNCHBUTTON").setAttribute("disabled","true"); }
	else { _$("filterAndTrim_LAUNCHBUTTON").removeAttribute("disabled"); }
}


