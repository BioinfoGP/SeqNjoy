'use strict';

function renderQcTab(option){
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
	<form id="NewQc" name="NewQc"  action="javascript:void(0);">
		<table cellpadding="0px" cellspacing="0px" border="0px" style="margin:1rem;">
			<tr>
				<td id="qcsQueueTD" class="medipadded" style="height:16rem;">
				</td>
				<td class="medipadded" style="height:16rem;">
					<div class="borderbox medipadded shadow bsilver radius">
						<table cellpadding="0px" cellspacing="0px" border="0px" height="100%" style="min-width:16rem;">
							<tr>
								<td class="medipadded" style="border-bottom:1px solid #000000;">
									<input type="hidden" name="qcprogram" id="qcprogram" value="`+option+`"/>				
									<b> Function:</b>
									`+option+`									
								</td>
							</tr>
							<tr>
								<td class="medipadded top" style="border-top:1px solid #EFEFEF;">
									<div id="qc_options" name="qc_options" class="medipadded" style="height:12rem;overflow-y:auto;overflow-x:hidden">
									`+populateFunctionOptions(option)+`
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
					<div class="medipadded center"><input type="button" class="ButtonLaunch" id="QC_LAUNCHBUTTON" disabled value="Launch!" onClick="launchQcQueue()"></div>
				</td>
			</tr>
		</table>
	</form>`;
	document.getElementById('QcFormTable').innerHTML=htmlOut;
	addQcRow(fastqSelect1,fastqSelect2);
	addQcRow(fastqSelect1,fastqSelect2);
	addQcRow(fastqSelect1,fastqSelect2);
	addQcRow(fastqSelect1,fastqSelect2);
	addQcRow(fastqSelect1,fastqSelect2);
	addQcRow(fastqSelect1,fastqSelect2);
	addQcRow(fastqSelect1,fastqSelect2);
	addQcRow(fastqSelect1,fastqSelect2);
	addQcRow(fastqSelect1,fastqSelect2);
	addQcRow(fastqSelect1,fastqSelect2);
	addQcRow(fastqSelect1,fastqSelect2);
	addQcRow(fastqSelect1,fastqSelect2);
	addQcRow(fastqSelect1,fastqSelect2);
	addQcRow(fastqSelect1,fastqSelect2);
	addQcRow(fastqSelect1,fastqSelect2);
	addQcRow(fastqSelect1,fastqSelect2);
}

//function removeQcRow(n, fastqSelect) {
//	var myQcs=new Array();
//	var t=0;
//	var tt=0;
//	while (_$("ToQcFQ1_"+t)) {
//		if (t!==n) {
//			myQcs[tt]=new Array();
//			myQcs[tt].fq1=_$("ToQcFQ1_"+t).value;
//			myQcs[tt].fq2=_$("ToQcFQ2_"+t).value;
//			tt++;
//		}
//		t++;
//	}
//	populateQcQueueTD(myQcs, fastqSelect);
//	if (tt<2) { _$("removeQc_0").disabled=true; }
//}

function addQcRow(fastqSelect1,fastqSelect2) {
	var myQcs=new Array();
	var t=0;
	while (_$("ToQcFQ1_"+t)) {
		myQcs[t]=new Array();
		myQcs[t].fq1=_$("ToQcFQ1_"+t).value;
		myQcs[t].fq2=_$("ToQcFQ2_"+t).value;
		t++;
	}
	// last element
	myQcs[t]=new Array();
	myQcs[t].fq1=NOT_SELECTED;
	myQcs[t].fq2=NOT_SELECTED;
	populateQcQueueTD(myQcs, fastqSelect1,fastqSelect2);
}

function populateQcQueueTD(myQcs, fastqSelect1,fastqSelect2) {
	var html=`<table cellpadding="0px" cellspacing="0px" border="0px" class="borderbox">
	<tr>
		<td class="medipadded center borderbox" id="fastq1_qc_HTD">Fastq 1</td>
		<td class="medipadded center borderbox" id="fastq2_qc_HTD">Fastq 2 (optional)</td>
	</tr>
</table>
<div id="qcsDIV" class="borderbox" style="border-bottom:1px solid silver;height:16rem;overflow-y:scroll;" onscroll="SCT=this.scrollTop;if (this.scrollHeight-this.scrollTop === this.clientHeight) { addQcRow(fastqSelect1,fastqSelect2);_$('qcsDIV').scrollTop=SCT;checkQcForm(); }">
	<table cellpadding="0px" cellspacing="0px" border="0px" class="borderbox">
		<tr id="TRqc_to_hide">
			<td class="medipadded center" id="fastq1_qc_HTD_hidden">Fastq 1</td>
			<td class="medipadded center" id="fastq2_qc_HTD_hidden">Fastq 2 (optional)</td>
		</tr>
`;

	if (fastqSelect1=="") { var isdisabled="disabled"; } else { var isdisabled=""; }

	for (var t=0;t<myQcs.length;t++) {
		html+=`
		<tr>
			<td class="tinypadded">
				<select `+isdisabled+` id="ToQcFQ1_`+t+`" class="w100" style="min-width:16rem;" onchange="autoPairSelection('ToQcFQ1_`+t+`','ToQcFQ2_`+t+`',1);checkQcForm();">
					<option value="`+NOT_SELECTED+`" style="color:#000000;">Select FASTQ</option>
					`+fastqSelect1+`
				</select>
			</td>
			<td class="tinypadded">
				<select id="ToQcFQ2_`+t+`" class="w100" style="min-width:16rem;" onchange="autoPairSelection('ToQcFQ1_`+t+`', 'ToQcFQ2_`+t+`', 2);checkQcForm();">
					<option value="`+NOT_SELECTED+`" style="color:#000000;">Select FASTQ (paired)</option>
					`+fastqSelect2+`
				</select>
			</td>
		</tr>`;
	}
	html+=`
	</table>
</div>
`;
	_$("qcsQueueTD").innerHTML=html;
	for (var t=0;t<myQcs.length;t++) {
		_$("ToQcFQ1_"+t).value=myQcs[t].fq1;
		_$("ToQcFQ2_"+t).value=myQcs[t].fq2;
	}
	_$("fastq1_qc_HTD").style.width=_$("fastq1_qc_HTD_hidden").offsetWidth+"px";
	_$("fastq2_qc_HTD").style.width=_$("fastq2_qc_HTD_hidden").offsetWidth+"px";
	_$("TRqc_to_hide").style.display="none";
}

function launchQcQueue() {
	CANCEL_NOW=false;
	// global variables to separate tasks in R: after each R task, a signal is sent to client to launch next one.
	CURRENT_TASKS=new Array();
	CURRENT_TASK_STEP=0;
	CURRENT_TASK_SAMPLE=0;
	var QCFUN=_$("qcprogram").value;

	var common_params_qc=getCommonParams(PARAMS[QCFUN]);

	var t=0;
	while (_$("ToQcFQ1_"+t)) {
		if (_$("ToQcFQ1_"+t).value!==NOT_SELECTED) {	
			CURRENT_TASKS[t]=new Array(); // first dimension is the sample
			
			var nn=0;

			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]=QCFUN;
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["input1"]=basename(_$("ToQcFQ1_"+t).value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["input2"]=basename(_$("ToQcFQ2_"+t).value);
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["common_params"]=common_params_qc;		
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Generating Quality Control report...";
			nn++;

/*
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="initialize_FASTQ_file";
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("QCFQ1_"+t).value);		
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["dependencies"]=_$("ToQcFQ1_"+t).value;		
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["viewfiles"]=basename(_$("QCFQ1_"+t).value)+".html";
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Initializing FASTQ...";
			nn++;

			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="create_accessory_files_for_FASTQ";
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("QCFQ1_"+t).value);		
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Creating accessory files for FASTQ...";
			nn++;

			
			if (_$("QCFQ2_"+t).value!==NOT_SELECTED) {
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="initialize_FASTQ_file";
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("QCFQ2_"+t).value);		
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["dependencies"]=_$("ToQcFQ2_"+t).value;		
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["viewfiles"]=basename(_$("QCFQ2_"+t).value)+".html";	
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Initializing mate FASTQ...";
				nn++;

				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="create_accessory_files_for_FASTQ";
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("QCFQ2_"+t).value);		
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Creating accessory files for mate FASTQ...";
				nn++;
			}
			
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="add_FASTQ_to_project";
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("QCFQ1_"+t).value);		
			CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Adding FASTQ file to project...";
			nn++;

			if (_$("QCFQ2_"+t).value!==NOT_SELECTED) {
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="add_FASTQ_to_project";
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=basename(_$("QCFQ2_"+t).value);
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Adding mate FASTQ file to project...";
			}*/
			CURRENT_TASK_SAMPLE++;
		}
		t++;
	}


//	var stepCaptions=new Array();
//	var st=0;
//	for (var f=0;f<QcQueue["data"][0]["input1"].length;f++) {
//		stepCaptions[st]=QcQueue["data"][0]["input1"][f]+` and `+QcQueue["data"][0]["input2"][f];
//		st++;
//	}
//	hideContent(initStepsDialog("Processing FASTQ Files...",stepCaptions, "default", true));
//	sendShinyObject(QcQueue);







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
	hideContent(initStepsDialog("Generating Quality Control report...", "Quality Control report finished.", stepCaptions, "default", true));
	CURRENT_TASK_SAMPLE=0;
	CURRENT_TASK_STEP=0;
	var ShinyObject=new Object();
	ShinyObject["action"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["command"];
	ShinyObject["data"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["data"];
	nextStepInShiny(ShinyObject);
}




function checkQcForm() {
	var QCFUN=_$("qcprogram").value;
	var errors=0;
	var inputfiles=0;
	var duplicatedfiles=0;
	for (var o=0;o<PARAMS[QCFUN]['ID'].length;o++) {
		var Editable=PARAMS[QCFUN]["Editable"][o];
		if (Editable=="YES") {
			var Caption1=PARAMS[QCFUN]["Caption1"][o];
			var Caption2=PARAMS[QCFUN]["Caption2"][o];
			var Default=PARAMS[QCFUN]["Default"][o];
			var ID=PARAMS[QCFUN]["ID"][o];
			var Type=PARAMS[QCFUN]["Type"][o];
			var Range=PARAMS[QCFUN]["Range"][o];	
			if (!validParam(ID, Type, Range)) { errors++;  }
		}
	}

	var t=0;
	var alreadyHere=new Object();
	var alreadyFile=new Object();
	while (_$("ToQcFQ1_"+t)) {
		var class1="ValidOutputFile";
		var class2="ValidOutputFile";

		if (_$("ToQcFQ1_"+t).value==NOT_SELECTED) {
			_$("ToQcFQ1_"+t).style.color="#000000";
			_$("ToQcFQ2_"+t).setAttribute("disabled","disabled");
			_$("ToQcFQ2_"+t).value=NOT_SELECTED;
			_$("ToQcFQ2_"+t).style.color="silver";
		}
		else {
			_$("ToQcFQ2_"+t).removeAttribute("disabled");
			_$("ToQcFQ2_"+t).style.color="black";
			inputfiles++;
			if (basename(_$("ToQcFQ1_"+t).value).match(/\.gz$/)) {
				var sample=basename(_$("ToQcFQ1_"+t).value).replace(/(\.[^\.]+\.gz)$/,"");
				var extension=basename(_$("ToQcFQ1_"+t).value).replace(/^.+\.([^\.]+)\.gz$/,"$1");
			}
			else {
				var sample=basename(_$("ToQcFQ1_"+t).value).replace(/(\.[^\.]+)$/,"");
				var extension=basename(_$("ToQcFQ1_"+t).value).replace(/^.+\.([^\.]+)$/,"$1");
			}
			var out1=dirname(_$("ToQcFQ1_"+t).value)+sample+"."+extension+".gz.html";
			out1=out1.replace(/\.\./,".");
			if (typeof(alreadyHere[out1])=="undefined") {
				alreadyHere[out1]=1;
				_$("ToQcFQ1_"+t).style.color="#000000";
			}
			else {
				alreadyHere[out1]++;
				_$("ToQcFQ1_"+t).style.color="#FF0000";
				duplicatedfiles++;
			}
			var out2=NOT_SELECTED;
			if (_$("ToQcFQ2_"+t).value!==NOT_SELECTED) {
				if (basename(_$("ToQcFQ2_"+t).value).match(/\.gz$/)) {
					var sample=basename(_$("ToQcFQ2_"+t).value).replace(/(\.[^\.]+\.gz$)/,"");
					var extension=basename(_$("ToQcFQ2_"+t).value).replace(/^.+\.([^\.]+)\.gz$/,"$1");
				}
				else {
					var sample=basename(_$("ToQcFQ2_"+t).value).replace(/(\.[^\.]+$)/,"");
					var extension=basename(_$("ToQcFQ2_"+t).value).replace(/^.+\.([^\.]+)$/,"$1");
				}
				var out2=dirname(_$("ToQcFQ2_"+t).value)+sample+"."+extension+".gz.html";
				out2=out2.replace(/\.\./,".");

				if (typeof(alreadyHere[out2])=="undefined") {
					_$("ToQcFQ2_"+t).style.color="#000000";
					alreadyHere[out2]=1;
				}
				else {
					alreadyHere[out2]++;
					_$("ToQcFQ2_"+t).style.color="#FF0000";
					duplicatedfiles++;
				}
			}

			for (var f=0;f<DataTable["files"]["fname"].length;f++) {
				if (basename(out1)==DataTable["files"]["fname"][f] && typeof(alreadyFile[f])=="undefined") {
					alreadyFile[f]=1;
					errors++;
					_$("QC_OUT_SUFFIX").className="WrongInput";
				}	
				if (basename(out2)==DataTable["files"]["fname"][f] && typeof(alreadyFile[f])=="undefined") {
					alreadyFile[f]=1;
					errors++;
					_$("QC_OUT_SUFFIX").className="WrongInput";
				}	
			}
		}
		t++;
	}
	
	if (errors>0 || duplicatedfiles>0 || inputfiles==0) { _$("QC_LAUNCHBUTTON").setAttribute("disabled","true"); }
	else { _$("QC_LAUNCHBUTTON").removeAttribute("disabled"); }
}


