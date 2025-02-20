'use strict';

function renderDownloadGenomesTab(option){
	genomeSelectHTML=new Array();
	ensKingdoms=new Array();
	var ensKingdomsHTML="";
	var genomeSelectName=new Array();
	genomeSelect=new Array();
	fastaSelect=new Array();
	for (var key in EnsemblTable) {
		if (EnsemblTable.hasOwnProperty(key)) {
			ensKingdoms.push(key);
			genomeSelectHTML[key]="";
			genomeSelect[key]=new Array();
			genomeSelectName[key]=new Array();
			var myObj=EnsemblTable[key];
			var nElems=myObj["NAME"].length;
			for(var i=0; i<nElems;i++){
				var color="#0000FF";
				genomeSelect[key].push(myObj["SPECIES"][i]);
				genomeSelectName[key].push(myObj["NAME"][i]);
				//genomeSelect.sort();
			}
			
			for (var t=0;t<genomeSelect[key].length;t++) {
				genomeSelectHTML[key]+='<option value="'+genomeSelect[key][t]+'" style="color:#000000;" class="ValidInput">'+ genomeSelect[key][t][0].toUpperCase() + genomeSelect[key][t].slice(1).replaceAll("_"," ") + ' ('  + genomeSelectName[key][t]+') </option>';
			}
			ensKingdomsHTML +='<option value="'+key+'" style="color:#000000;" class="ValidInput">'+ key[0].toUpperCase() + key.slice(1) +'</option>';
		}
	}
	
	
	var EnsemblVersionText= (EnsemblVersion!="") ? `Ensembl (vertebrates) <i class="fa fa-globe" aria-hidden="true" style="font-size:1.1rem;"> Online  - release `+EnsemblVersion+` </i>` : `Ensembl (vertebrates) <i class="fa fa-times-circle" aria-hidden="true" style="font-size:1.1rem;"> Offline </i>`
	var EnsemblGenomesVersionText= (EnsemblGenomesVersion!="") ? `Ensembl Genomes (others) <i class="fa fa-globe" aria-hidden="true" style="font-size:1.1rem;"> Online  - release `+EnsemblGenomesVersion+` </i>` : `Ensembl Genomes (others) <i class="fa fa-times-circle" aria-hidden="true" style="font-size:1.1rem;"> Offline  </i>`;

	var htmlOut=`
	<form id="NewGenomeDownload" name="NewGenomeDownload"  action="javascript:void(0);">
		<table cellpadding="0px" cellspacing="0px" border="0px" style="margin:1rem;width:99%;">
			<tr>
				<td style="text-align:left;">
					`+EnsemblVersionText+`
					<br>
					`+EnsemblGenomesVersionText+`
				</td>
				<td class="medipadded right">`;

	if(EnsemblVersion=="" || EnsemblGenomesVersion==""){ // Activate reload if any server is offline
	htmlOut+=`
				<span id="EnsemblCheckDiv" name="EnsemblCheckDiv" ></span> <input type="button" id="EnsemblCheck" value="Reload" onClick="reloadDownloadGenomesTab()" class="ButtonLaunch"> `;
	}
	htmlOut+=`				
				</td>
			</tr>`;
	if(EnsemblVersion!="" || EnsemblGenomesVersion!=""){ // Show options if any server is online
		htmlOut+=`				
			<tr>
				<td class="medipadded nowrap" colspan=2>
					<b> Select taxonomic group </b>
					<select  id="genomeKingdom" name="genomeKingdom" onchange="showGenomeList();checkAvailableGenomesForm();">
						<option value="`+NOT_SELECTED+`" class="WrongInput">Select Group</option>
						`+ensKingdomsHTML+`					
					</select>
				</td>
			</tr>
			<tr>
				<td class="medipadded nowrap" colspan=2>`;
					
		for (var t=0;t<ensKingdoms.length;t++){
/*			htmlOut+=`<input style="display:none" list="listGenomes`+ensKingdoms[t]+`" id="availableGenomes`+ensKingdoms[t]+`" name="availableGenomes`+ensKingdoms[t]+`" onchange="checkAvailableGenomesForm();">
						<datalist id="listGenomes`+ensKingdoms[t]+`">
							<option value="`+NOT_SELECTED+`" class="WrongInput">Select Genome</option>
							`+genomeSelectHTML[ensKingdoms[t]]+`
						</datalist>`; */

			htmlOut+=`
					<select style="display:none" id="availableGenomes`+ensKingdoms[t]+`" name="availableGenomes`+ensKingdoms[t]+`" onchange="checkAvailableGenomesForm();">
						<option value="`+NOT_SELECTED+`" class="WrongInput">Select Genome</option>
						`+genomeSelectHTML[ensKingdoms[t]]+`
					</select>`;		
					
		}				
				
		htmlOut+=`
				</td>
			</tr>
			<tr>
				<td style="text-align:left;">	
					<input type="button" disabled id="CheckGenomeButton" value="Check Genome Avalaibility" onClick="checkGenomeAvailability()" class="ButtonLaunch">
				</td>
				<td class="medipadded center">
					<div id="availableDownloadsDiv" name="availableDownloadsDiv" style="display:none">
					</div>
					
				</td>
			</tr>
			<tr>
				<td style="text-align:center;"  colspan=2>
					<div id="selectDownloadsDiv" name="selectDownloadsDiv" style="display:none">						
						<input type="checkbox" disabled name="downloadFasta" id="downloadFasta" onclick="checkDownloadGenomesForm()"/> <b> Sequence (FASTA) </b> 
						&nbsp;&nbsp;
						<input type="checkbox" disabled name="downloadGFF" id="downloadGFF" onclick="checkDownloadGenomesForm()"/> <b> Annotations (GFF3) </b> 
						&nbsp;&nbsp;
						<input type="checkbox" disabled name="downloadGTF" id="downloadGTF" onclick="checkDownloadGenomesForm()"/> <b> Annotations (GTF) </b> 
					</div>
					
				</td>								
			</tr>
			<tr>
				<td style="text-align:center;">
				</td>
				<td class="medipadded center">
					<div id="launchDownloadsDiv" name="launchDownloadsDiv" style="display:none">				
						<input type="button" id="DownloadGenomes_LAUNCHBUTTON" value="Download!" onClick="launchDownloadGenomesQueue()" class="ButtonLaunch">
					</div>
				</td>
			</tr>`;
	}
	htmlOut+=`			
		</table>
	</form>`;

	document.getElementById('DownloadGenomesFormTable').innerHTML=htmlOut;
	
}

function showGenomeList() {
	for (var t=0;t<ensKingdoms.length;t++){
		if(ensKingdoms[t] == _$("genomeKingdom").value){
			_$("availableGenomes"+ensKingdoms[t]).value=NOT_SELECTED;
			_$("availableGenomes"+ensKingdoms[t]).style.display="block";			
			
		} else{
			_$("availableGenomes"+ensKingdoms[t]).value=NOT_SELECTED;
			_$("availableGenomes"+ensKingdoms[t]).style.display="none";
			
		}
	}
	_$("availableDownloadsDiv").style.display="none"	
	_$("selectDownloadsDiv").style.display="none"
	_$("launchDownloadsDiv").style.display="none"

}

function checkGenomeAvailability(){
	var kingdom = _$('genomeKingdom').value;
	var species = _$('availableGenomes'+_$('genomeKingdom').value).value;
	
	if(kingdom != NOT_SELECTED && species != NOT_SELECTED){
		_$("CheckGenomeButton").setAttribute("disabled","true"); 
		_$("availableDownloadsDiv").innerHTML='<i class="fa fa-spinner fa-spin"> </i> <b> Checking genome avalaibility... </b> ';
		_$("availableDownloadsDiv").style.display="block"
		queryGenomeAvailability(_$('genomeKingdom').value,_$('availableGenomes'+_$('genomeKingdom').value).value);
	}
}

function reloadDownloadGenomesTab(){
	_$("EnsemblCheck").setAttribute("disabled","true"); 
	_$("EnsemblCheckDiv").innerHTML='<i class="fa fa-spinner fa-spin"> </i> <b> Checking... </b> ';
	EnsemblReload();
}

function updateGenomeAvailability(){
	if("genomefiles" in DownloadGenomeFiles && 
		(DownloadGenomeFiles["genomefiles"]["FASTA"][0] != "" || 
		 DownloadGenomeFiles["genomefiles"]["GFF"][0] != "" || 
		 DownloadGenomeFiles["genomefiles"]["GTF"][0] != "")) {

		_$("selectDownloadsDiv").style.display="block"
		_$("launchDownloadsDiv").style.display="block"
		if (DownloadGenomeFiles["genomefiles"]["FASTA"][0] == "" && DownloadGenomeFiles["genomefiles"]["GFF"][0] == "" && DownloadGenomeFiles["genomefiles"]["GTF"][0] == ""){
			_$("availableDownloadsDiv").innerHTML='<i class="fa fa-exclamation-triangle " aria-hidden="true" style="font-size:1.1rem;"></i> <b> Genome partially available for download </b> ';					
		}
		else {
			_$("availableDownloadsDiv").innerHTML='<i class="fa fa-check " aria-hidden="true" style="font-size:1.1rem;"></i> <b> Genome available for download </b> ';
		}
		

		if(DownloadGenomeFiles["genomefiles"]["FASTA"][0] != ""){
			_$("downloadFasta").removeAttribute("disabled");
			_$("downloadFasta").checked=false;
		}  else {
			_$("downloadFasta").setAttribute("disabled","true");
		}
		
		if(DownloadGenomeFiles["genomefiles"]["GFF"][0] != ""){
			_$("downloadGFF").removeAttribute("disabled");
			_$("downloadGFF").checked=false;
		}  else {
			_$("downloadGFF").setAttribute("disabled","true");
		}
		
		if(DownloadGenomeFiles["genomefiles"]["GTF"][0] != ""){
			_$("downloadGTF").removeAttribute("disabled");
			_$("downloadGTF").checked=false;
		}  else {
			_$("downloadGTF").setAttribute("disabled","true");
		}
	} else {
		_$("availableDownloadsDiv").innerHTML='<i class="fa fa-times-circle " aria-hidden="true" style="font-size:1.1rem;"></i> <b> Genome NOT available for download </b>';
		_$("selectDownloadsDiv").style.display="none"
		_$("launchDownloadsDiv").style.display="none"
		_$("downloadFasta").setAttribute("disabled","true")
		_$("downloadGFF").setAttribute("disabled","true")
		_$("downloadGTF").setAttribute("disabled","true")
		
	}
		
	
}
		



// CONSTRUCT queue  and launch it (oliveros)
function launchDownloadGenomesQueue() {
	CANCEL_NOW=false;
	// global variables to separate tasks in R: after each R task, a signal is sent to client to launch next one.
	CURRENT_TASKS=new Array();
	CURRENT_TASK_STEP=0;
	CURRENT_TASK_SAMPLE=0;
	
	var downloadKingdom=_$("genomeKingdom").value;
	var downloadSpecies=_$("availableGenomes"+_$("genomeKingdom").value).value;
	var downloadFasta=false;
	if(_$("downloadFasta").checked){
		downloadFasta=true;
	}
	
	var downloadGFF=false;
	if(_$("downloadGFF").checked){
		downloadGFF=true;
	}

	var downloadGTF=false;
	if(_$("downloadGTF").checked){
		downloadGTF=true;
	}

	if(downloadFasta==true){
		CURRENT_TASKS[CURRENT_TASK_SAMPLE]=new Array(); // first dimension is the sample
		
		var nn=0;

		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="download_this_file";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["url"]=DownloadGenomeFiles["genomefiles"]["fastaURL"][0]+DownloadGenomeFiles["genomefiles"]["FASTA"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=DownloadGenomeFiles["genomefiles"]["FASTA"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fsize"]="unknown";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["ftype"]="fasta";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["datapath"]=DownloadGenomeFiles["genomefiles"]["tempFolder"][0]+DownloadGenomeFiles["genomefiles"]["FASTA"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Downloading file...";
		nn++;


		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="initialize_this_file";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=DownloadGenomeFiles["genomefiles"]["FASTA"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fsize"]="unknown";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["ftype"]="fasta";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["datapath"]=DownloadGenomeFiles["genomefiles"]["tempFolder"][0]+DownloadGenomeFiles["genomefiles"]["FASTA"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Initializing file...";
		nn++;

		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="create_accessory_files_for_this_one";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=DownloadGenomeFiles["genomefiles"]["FASTA"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fsize"]="unknown";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["ftype"]="fasta";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["datapath"]=DownloadGenomeFiles["genomefiles"]["tempFolder"][0]+DownloadGenomeFiles["genomefiles"]["FASTA"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Creating accessory files...";
		nn++;

		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="add_this_file_to_project";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=DownloadGenomeFiles["genomefiles"]["FASTA"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fsize"]="unknown";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["ftype"]="fasta";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["datapath"]=DownloadGenomeFiles["genomefiles"]["tempFolder"][0]+DownloadGenomeFiles["genomefiles"]["FASTA"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Adding file to project...";
		nn++;

		CURRENT_TASK_SAMPLE++;		
		
	}

	if(downloadGFF==true){
		CURRENT_TASKS[CURRENT_TASK_SAMPLE]=new Array(); // first dimension is the sample
		
		var nn=0;

		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="download_this_file";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["url"]=DownloadGenomeFiles["genomefiles"]["gffURL"][0]+DownloadGenomeFiles["genomefiles"]["GFF"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=DownloadGenomeFiles["genomefiles"]["GFF"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fsize"]="unknown";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["ftype"]="gff";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["datapath"]=DownloadGenomeFiles["genomefiles"]["tempFolder"][0]+DownloadGenomeFiles["genomefiles"]["GFF"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Downloading file...";
		nn++;


		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="initialize_this_file";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=DownloadGenomeFiles["genomefiles"]["GFF"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fsize"]="unknown";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["ftype"]="gff";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["datapath"]=DownloadGenomeFiles["genomefiles"]["tempFolder"][0]+DownloadGenomeFiles["genomefiles"]["GFF"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Initializing file...";
		nn++;

		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="create_accessory_files_for_this_one";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=DownloadGenomeFiles["genomefiles"]["GFF"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fsize"]="unknown";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["ftype"]="gff";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["datapath"]=DownloadGenomeFiles["genomefiles"]["tempFolder"][0]+DownloadGenomeFiles["genomefiles"]["GFF"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Creating accessory files...";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Creating accessory files (may take a long time for large genomes)...";
		nn++;

		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="add_this_file_to_project";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=DownloadGenomeFiles["genomefiles"]["GFF"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fsize"]="unknown";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["ftype"]="gff";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["datapath"]=DownloadGenomeFiles["genomefiles"]["tempFolder"][0]+DownloadGenomeFiles["genomefiles"]["GFF"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Adding file to project...";
		nn++;

		CURRENT_TASK_SAMPLE++;		
		
	}

	if(downloadGTF==true){
		CURRENT_TASKS[CURRENT_TASK_SAMPLE]=new Array(); // first dimension is the sample
		
		var nn=0;

		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="download_this_file";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["url"]=DownloadGenomeFiles["genomefiles"]["gtfURL"][0]+DownloadGenomeFiles["genomefiles"]["GTF"][0];;
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=DownloadGenomeFiles["genomefiles"]["GTF"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fsize"]="unknown";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["ftype"]="gff";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["datapath"]=DownloadGenomeFiles["genomefiles"]["tempFolder"][0]+DownloadGenomeFiles["genomefiles"]["GTF"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Downloading file...";
		nn++;


		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="initialize_this_file";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=DownloadGenomeFiles["genomefiles"]["GTF"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fsize"]="unknown";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["ftype"]="gff";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["datapath"]=DownloadGenomeFiles["genomefiles"]["tempFolder"][0]+DownloadGenomeFiles["genomefiles"]["GTF"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Initializing file...";
		nn++;

		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="create_accessory_files_for_this_one";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=DownloadGenomeFiles["genomefiles"]["GTF"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fsize"]="unknown";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["ftype"]="gff";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["datapath"]=DownloadGenomeFiles["genomefiles"]["tempFolder"][0]+DownloadGenomeFiles["genomefiles"]["GTF"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Creating accessory files...";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Creating accessory files (may take a long time for large genomes)...";

		nn++;

		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="add_this_file_to_project";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fname"]=DownloadGenomeFiles["genomefiles"]["GTF"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["fsize"]="unknown";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["ftype"]="gtf";
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["datapath"]=DownloadGenomeFiles["genomefiles"]["tempFolder"][0]+DownloadGenomeFiles["genomefiles"]["GTF"][0];
		CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Adding file to project...";
		nn++;

		CURRENT_TASK_SAMPLE++;		
		
	}
			
	var stepCaptionsA=new Array();
	for (var f=0;f<CURRENT_TASKS.length;f++) {
		stepCaptionsA[f]=CURRENT_TASKS[f][0]["data"]["fname"];
		for (var ff=0;ff<CURRENT_TASKS[f].length;ff++) {
			if (!CURRENT_TASKS[f][ff]["bottomMessage"]) {
				CURRENT_TASKS[f][ff]["bottomMessage"]="--BOTTOM MESSAGE--";
			}
		}
	}
	hideContent(initStepsDialog("Downloading Files to Project...", "Files added", stepCaptionsA, "default", true));
	
	
	CURRENT_TASK_SAMPLE=0;
	CURRENT_TASK_STEP=0;
	var ShinyObject=new Object();
	ShinyObject["action"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["command"];
	ShinyObject["data"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["data"];
	nextStepInShiny(ShinyObject);
}

function checkAvailableGenomesForm(){
	var errors=0;
	if (_$("genomeKingdom").value==NOT_SELECTED) {
		_$("genomeKingdom").className="WrongInput";
		errors++;
	}
	else {
		_$("genomeKingdom").className="ValidInput";
		if (_$("availableGenomes"+_$("genomeKingdom").value).value==NOT_SELECTED) {
			_$("availableGenomes"+_$("genomeKingdom").value).className="WrongInput";
			errors++;
		}
		else {
			_$("availableGenomes"+_$("genomeKingdom").value).className="ValidInput";			
		}
	}

	if (errors>0) { 
		_$("CheckGenomeButton").setAttribute("disabled","true"); 
		_$("DownloadGenomes_LAUNCHBUTTON").setAttribute("disabled","true"); 	
		_$("selectDownloadsDiv").style.display="none"
		_$("launchDownloadsDiv").style.display="none"		
		_$("availableDownloadsDiv").style.display="none"

	}
	else { 
		_$("CheckGenomeButton").removeAttribute("disabled");
		_$("selectDownloadsDiv").style.display="none"
		_$("launchDownloadsDiv").style.display="none"		
		_$("availableDownloadsDiv").style.display="none"
	}
	
}

function checkDownloadGenomesForm() {
	var errors=0;
	var downloadfiles=0;
	if(EnsemblVersion != "" || EnsemblGenomesVersion != ""){
		if (_$("genomeKingdom").value==NOT_SELECTED) {
			_$("genomeKingdom").className="WrongInput";
			errors++;
		}
		else {
			_$("genomeKingdom").className="ValidInput";
			if (_$("availableGenomes"+_$("genomeKingdom").value).value==NOT_SELECTED) {
				_$("availableGenomes"+_$("genomeKingdom").value).className="WrongInput";
				errors++;
			}
			else {
				_$("availableGenomes"+_$("genomeKingdom").value).className="ValidInput";			
			}
		}
		
		if(_$("downloadFasta").checked){
			downloadfiles++;
		}
		
		if(_$("downloadGFF").checked){
			downloadfiles++;
		}

		if(_$("downloadGTF").checked){
			downloadfiles++;
		}

		if (errors>0) { 
			_$("CheckGenomeButton").setAttribute("disabled","true"); 
			_$("DownloadGenomes_LAUNCHBUTTON").setAttribute("disabled","true"); 	
			_$("selectDownloadsDiv").style.display="none"
			_$("launchDownloadsDiv").style.display="none"		
			_$("availableDownloadsDiv").style.display="none"

		}


		if (errors>0 || downloadfiles==0) { 
			_$("DownloadGenomes_LAUNCHBUTTON").setAttribute("disabled","true"); 
		}
		else { 
			_$("DownloadGenomes_LAUNCHBUTTON").removeAttribute("disabled"); 
		}
	}
}


