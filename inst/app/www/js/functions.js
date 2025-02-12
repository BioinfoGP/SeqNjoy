'use strict';

function open_credits() {
	_$("ModalCourtainDialogs").style.display="block";
	_$("CreditsDiv").style.display="block";
}

function close_credits() {
	_$("ModalCourtainDialogs").style.display="none";
	_$("CreditsDiv").style.display="none";
}

function open_exitDialog() {
	hideContent("");
	_$("ModalCourtain").style.display="block";
	_$("ExitDiv").style.display="block";
}

function close_exitDialog() {
	_$("ModalCourtain").style.display="none";
	_$("ExitDiv").style.display="none";
}


function setCurrentProjectsDir(CurrentProjectsDir){
	// document.styleSheet[0].cssRules[".sF-modalContainer"].style.z-index = '9999';
	if(CurrentProjectsDir == ""){
		_$("CurrentProjectsDir").innerHTML="Click to select projects folder";
		_$("NewSession_Input").disabled=true;
	} else {
		_$("CurrentProjectsDir").innerHTML=CurrentProjectsDir;
		_$("NewProjectDir").value=CurrentProjectsDir;
		_$("NewSession_Input").disabled=false;
	}
}

function updateProjectsList(json)	{
	ALL_PROJECTS=JSON.parse(json);
	var SessionRows="";
	if(ALL_PROJECTS["status"].length == 0){
		var html=`<div class="NoProjectsToShowDiv gray">
			<span class="gray font20">Create your first project into the selected folder:</span>
			<ul class="list gray">
				<li class="ListItem"><span>Enter the project name</span>
				<li class="ListItem"><span>Click Create New Project</span>
			</ul>
			<div class="font30 medipadded bold gray" style="text-align:center">&darr;</div>
		</div>`;		
	} 
	else {
		for (var t=0;t<ALL_PROJECTS["status"].length;t++) {
			if(ALL_PROJECTS["status"][t] == "UNAVAILABLE"){
				SessionRows+=`
				<tr>
					<td class="nowrap DialogRow bgradient">
						<button class="buttonIcon" title="Project data not found at `+ALL_PROJECTS["datapath"][t]+`" disabled >
							&nbsp;<i class="fa fa-play buttonIconPadding"></i>&nbsp;
						</button>
					</td>
					<td id="SessionDescription_Td_`+t+`" class="w100 DialogRow bgradient">
						`+ALL_PROJECTS["description"][t]+` (UNAVAILABLE)
					</td>
					<td id="SessionStarted_Td" class="nowrap DialogRow bgradient">
						`+ALL_PROJECTS["started"][t]+`
					</td>
					<td class="nowrap DialogRow bgradient">
						<button class="buttonIcon" title="Remove project from list" onClick="removeProject('`+ALL_PROJECTS["datapath"][t]+`')">
							&nbsp;<i class="fa fa-times buttonIconPadding"></i>&nbsp;
						</button>
					</td>
				</tr>`;
			} 
			else {
				SessionRows+=`
				<tr>
					<td class="nowrap DialogRow bgradient">
						<button class="buttonIcon" title="Open project" onclick="openProject('`+t+`')">
							&nbsp;<i class="fa fa-play buttonIconPadding"></i>&nbsp;
						</button>
					</td>
					<td id="SessionDescription_Td_`+t+`" class="w100 DialogRow bgradient"title="`+ALL_PROJECTS["description"][t]+`">
						`+basename(ALL_PROJECTS["datapath"][t])+`
					</td>
					<td id="SessionStarted_Td" class="nowrap DialogRow bgradient">
						`+ALL_PROJECTS["started"][t]+`
					</td>
					<td class="nowrap DialogRow bgradient">
						<button class="buttonIcon" title="Delete project" onClick="deleteProject('`+ALL_PROJECTS["datapath"][t]+`')">
							&nbsp;<i class="fa fa-trash buttonIconPadding"></i>&nbsp;
						</button>
					</td>
				</tr>`;
			}
		}
		var html=`
		<table id="SessionsTable" border="0px" cellpadding="0px" cellspacing="0px">`
			+SessionRows+
		`</table>`;

	}
	_$("Sessions").innerHTML=html;
	_$("ChangeProjects_DirButton").disabled=false;
}

function go_full_screen() {
	var elem = document.documentElement;
	if (elem.requestFullScreen) {
		elem.requestFullScreen();
	} 
	else if (elem.msRequestFullscreen) {
		elem.msRequestFullscreen();
	}
	else if (elem.mozRequestFullScreen) {
		elem.mozRequestFullScreen();
	}
	else if (elem.webkitRequestFullscreen) {
		elem.webkitRequestFullscreen();
	}
}

// Warning mesage to inform to the user that closing the browser will not stop SeqNjoy
const setBeforeUnloadWarning = function(event) {
    event.preventDefault();
	// event.returnValue = 'SeqNjoy will continue running unless you use the Close app button or stop it in the R console by pressing Ctrl+C.'
	event.returnValue = "Are you sure you want to leave?";
	return "Are you sure you want to leave?"; // For legacy support	
};

function main() {

//  trick to remove shiny event listeners:
//	var old_element = document.getElementById("LoadFiles");
//	var new_element = old_element.cloneNode(true);
//	old_element.parentNode.replaceChild(new_element, old_element);
	document.title="SeqNjoy BioinfoGP CNB-CSIC"
	JSShinyDetails["action"]="";
	JSShinyDetails["timestamp"]="";
	JSShinyDetails["data"]=new Object();
	AlignmentQueue["action"]="processAlignmentQueue";
	AlignmentQueue["data"]=new Object();
	QcQueue["action"]="processQcQueue";
	QcQueue["data"]=new Object();
	TrimQueue["action"]="processTrimQueue";
	TrimQueue["data"]=new Object();
	QuantifyQueue["action"]="processQuantifyQueue";
	QuantifyQueue["data"]=new Object();
	ExpressionQueue["action"]="processExpressionQueue";
	ExpressionQueue["data"]=new Object();

	ProjectData=new Object();
	ProjectData["session"]=new Object();
	ProjectData["session"]["description"]="";


	window.addEventListener("beforeunload",setBeforeUnloadWarning);
	
	// Function to disable the warning and use the Shiny 'shiny:disconnected' event to clear the warning
	Shiny.addCustomMessageHandler('disableWarning', function(message) {
		window.removeEventListener("beforeunload", setBeforeUnloadWarning);
	});

	$(document).on('shiny:disconnected', function(event) {
		window.removeEventListener("beforeunload", setBeforeUnloadWarning);
	});

	populateHome();
	renderProject();
	resize();
}

function openProjectFromDir(newProjectsDir){
	alert("Opening project "+newProjectsDir);

}

function newProjectDir(selectedProjectDir){
	_$("NewProjectDir").value=selectedProjectDir;
	_$("NewSession_Input").disabled=false;
	_$("NewSession_Button").title="Create new project in "+selectedProjectDir+"/"+_$("NewSession_Input").value;	
}

function populateHome() {
	var html=`
			<table cellpadding=0 cellspacing=0 border="0px" id="Table_Logo" style="width:50vw;min-width:54rem;">
				<tr>
					<td class="w100">
						<table cellpadding=0 cellspacing=0 class="w100" border="0px">
							<tr>
								<td class="medipadded top" style="padding-top:1.2rem;">
									<div class="HomeLogo logo">SeqNjoy<br><div style="font-size:0.3em;">BioinfoGP CNB-CSIC</div></div>
								</td>
								<td class="top medipadded w50" style="padding-left:1rem;">
									<div class="font15" style="padding-bottom:0.2em;padding-top:0.2em;">Welcome to SeqNjoy!</div>
									<div class="justify">

Perform complete RNA-seq pipelines, from the genomic alignment of short-reads to the analysis of gene differential expression.
User friendly dialog boxes and tools allow you to implement powerful statistical methods to your data and visually analyze the results without having to write lines of code (<a href="https://bioinfogp.cnb.csic.es/tools/seqnjoy/help" target="SeqNjoy_help">more info...</a>).
									</div>
								</td>
								<td class="top medipadded w50" style="padding-left:1rem;">
									<div class="font15" style="padding-bottom:0.2em;text-align: right;"><button class="btn btn-custom-red" onclick="open_exitDialog();" title="Close SeqNjoy">Exit SeqNjoy</button></div>
									<div class="justify">
Please note that SeqNjoy uses standard file formats (fastq, fasta, gff, bam) some of which can be very
large and therefore may require long processing times, a lot of disk space and large amounts of RAM memory.
									</div>
									<div class="font15 right" style="padding-top:0.2em;">Enjoy!</div>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td>
						<div id="Home_Dialog" class="border padded shadow radius bwhite" style="margin-top:3rem;">
							<table id="RecentProject_Dialog_Table" border="0px" cellpadding="0px" cellspacing="0px" class="w100 h100">
								<tr>
									<td id="ChangeProjects_DirButtonContainer" class="DialogTitle nowrap" style="padding-bottom:1rem;">
									</td>
									<td id="Home_Dialog_Td_Up" class="DialogTitle nowrap w100" style="padding-bottom:1rem;padding-left:2rem;"">
										<span id="CurrentProjectsDir" name="CurrentProjectsDir"> Click to select projects folder </span>
										<input type="hidden" value="" id="NewProjectDir" name="NewProjectDir"/>
									</td>									
								</tr>								
								<tr>
									<td id="Home_Dialog_Td_Main" style="height:200px;" colspan="2">
										<div id="Sessions" class="autoscroll h100"><div style="width:100%;text-align:center;padding-top:5rem;"> <b>Initializing SeqNjoy </b> <i class="fa fa-spinner fa-spin"> </i> <br/> <br/> Close the browser to finish the program. </div>
									</td>
								</tr>
								<tr>
									<td id="Home_Dialog_Td_Bottom" style="padding-top:2rem;" colspan="2">
										<table id="NewSession_Table" cellspacing="0px" cellpadding="0px" border="0px" class="w100">
											<tr>
												<td id="NewSession_Td_Left" style="text-align:left;padding-right:2rem;">
													<button id="NewSession_Button" class="nowrap btn btn-default btn btn-primary" name="NewSession_Button" disabled onclick="var id='P'+Date.now(); startNewProject(id,_$('NewSession_Input').value,_$('NewProjectDir').value)">
														Create New Project
													</button>													
												</td>
												<td id="NewSession_Td_Left" class="w100" style="text-align:left">
													<input type="textbox" id="NewSession_Input" disabled class="w100 borderbox" name="NewSession_Input" placeholder="Enter a new project name" value="" oninput="this.value=safeString(this.value);" onkeyup="checkProjectName(trim(this.value));if(event.keyCode == 13) {_$('NewSession_Button').click();}"/> 
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</div>
					</td>
				</tr>
				<tr>
					<td>
						<div id="Home_Welcome2">SeqNjoy for RNA-Seq. Developed by BioinfoGP CNB-CSIC (2022)</div>
					</td>
				</tr>
				<tr>
					<td>
						<div id="Home_Welcome3">Optimized for 1920 x 1080 or higher screen resolution</div>
					</td>
				</tr>
			</table>
	`;
	_$("HomeCourtain").innerHTML=html;
	_$("ChangeProjects_DirButton").disabled=true;
	document.getElementById('ChangeProjects_DirButtonContainer').appendChild( document.getElementById('ChangeProjects_DirButton') );
}

function safeString(text) {
	return (text.replace(/[\'\`\"\\\/\:\*\?<>\|]/g,""));		
	// return (text.replace(/[\'\`\"\\]/g,""));
}

function resize() {
	_$("FilesDivTD").style.height="100%";
	var t1=_$("TopRow").offsetHeight;
	var t2=_$("FilesTD").offsetHeight;
	var t3=_$("FootDivTD").offsetHeight;
	_$("FilesDivTD").style.height=(_$("MainDiv").offsetHeight-t1-t2-t3)+"px";
	if (_$("filesTableHeader-ftype")) {
		renderFileTable(currentSortBy,"current");
	}
}

/// BEGIN Viewport functions 

// Show overlay to disable content and prevent action collisions
function hideContent(message){
	_$("ModalCourtain").style.display="block";
	_$("ModalCourtain").innerHTML=message;
}

function sssssetLoadingMessage(message){
	_$("ModalCourtain").innerHTML=message;
}


// Hide overlay to disable content and prevent action collisions
function showContent(){
	_$("ModalCourtain").style.display="none";
}



// Expand file viewer
function expandFilesDiv(direction) {
	if (_$("filesTableHeader-ftype")) {
		if (!$("#FilesDiv").data("animating")){
			_$("FilesDiv").style.animationDelay="0s";
			_$("FilesDiv").style.animationName="expandFilesDiv";
			_$("FilesDiv").style.animationDuration="0.2s";
			_$("FilesDiv").style.animationFillMode="forwards";
			_$("FilesDiv").style.animationDirection=direction;

			_$("dtFiles").style.animationDelay="0s";
			_$("dtFiles").style.animationName="expandFilesDiv";
			_$("dtFiles").style.animationDuration="0.2s";
			_$("dtFiles").style.animationFillMode="forwards";
			_$("dtFiles").style.animationDirection=direction;
		}
	}
}

// Reduce file viewer
function reduceFilesDiv(direction) {
	if (_$("filesTableHeader-ftype")) {
		if (!$("#FilesDiv").data("animating")){
			_$("FilesDiv").style.animationDelay="0s";
			_$("FilesDiv").style.animationName="reduceFilesDiv";
			_$("FilesDiv").style.animationDuration="0.2s";
			_$("FilesDiv").style.animationFillMode="forwards";
			_$("FilesDiv").style.animationDirection=direction;

			_$("dtFiles").style.animationDelay="0s";
			_$("dtFiles").style.animationName="reduceFilesDiv";
			_$("dtFiles").style.animationDuration="0.2s";
			_$("dtFiles").style.animationFillMode="forwards";
			_$("dtFiles").style.animationDirection=direction;
		}
	}
}

// Show file options
function populateFileOptions(){
	var typeList="";
	var htmlOut="";
	var already=new Array();
	for (var t=0;t<DataTable["files"]["ftype"].length;t++) {
		var k=DataTable["files"]["ftype"][t];
		if (typeof(already[k])=="undefined") { 
			typeList+=`<label><input id="showType`+k+`" OnChange="toggleViewType('`+k+`');" type="checkbox" `+(hideFileType[k]?'':'checked')+`/> `+k+`</label><br>`;
			already[k]=true;
		}
	}
	typeList+=`<label><input id="showAuxFiles" OnChange="toggleAuxFiles();" type="checkbox" `+(showAuxFiles?'checked':'')+`/> auxiliary</label><br>`;
	typeList+=`<label><input id="showHiddenFiles" OnChange="toggleHiddenFiles();" type="checkbox" `+(showHiddenFiles?'checked':'')+`/> hidden</label><br>`;
//	htmlOut+=`<div style="width:100%;text-align:right;"><button onclick="_$('FileOptionsDiv').style.display='none';">X</button></div>`;
	htmlOut+=typeList;
	_$("FileOptionsDiv").innerHTML=htmlOut;
}

function stopEventPropagation(e) {
    //stop the event propagating to the body element
    var evt = e ? e : window.event;

    if (evt.stopPropagation) {evt.stopPropagation();}
    else {evt.cancelBubble=true;}
    return false;
}

// Show file type options
function toggleViewType(k) {
	if(hideFileType[k] == true){
		hideFileType[k]=false;
	}
	else{
		hideFileType[k]=true;
	}
	resize();
}
// Show or hide hidden files 
function  toggleHiddenFiles(){
//	if($('#showHiddenFiles').prop("checked") == true){
//		showHiddenFiles=true;
//	}
//	else{
//		showHiddenFiles=false;
//	}
	showHiddenFiles=showHiddenFiles?false:true;
	resize();
}

// Show or hide auxiliary files 
function  toggleAuxFiles(){
//	if($('#showAuxFiles').prop("checked") == true){
//		showAuxFiles=true;
//	}
//	else{
//		showAuxFiles=false;
//	}
	showAuxFiles=showAuxFiles?false:true;
	resize();
}

var fileNameFilter="";
function filterFileName(text) {
	fileNameFilter=trim(text);
	resize();
}



// Shows projects screen
function endSession(){
	ProjectData=new Object();
	ProjectData["session"]=new Object();
	ProjectData["session"]["description"]="";
	document.getElementById('NewSession_Input').value="";
	document.getElementById('HomeCourtain').style.display='block';
	document.getElementById('MainDiv').style.display='none';
	// Reset project display variables
	checkProjectName("");
	FileOptionsDivDisplay="none";
	hideFileType=new Array();

}

var allFileChecks=false;
// Check or uncheck all files
function toggleFileChecks() {
	if($('#allFileChecks').prop("checked") == true){
//		$('input[name=fileChecked]').prop("checked", true);
		allFileChecks=true;
		for (var i=0;i<DataTable["files"]["fname"].length;i++) {
			var thefile=DataTable["files"]["datapath"][i];
			var thetype=DataTable["files"]["ftype"][i];
//			if (hideFileType[thetype]==false) {
			if (showingFile[i]==true) {
				if (selectedFiles[i]==false) {
					selectedFileTypes[thetype]++;
				}
				selectedFiles[i]=true;
				// Apply selection to partners
				var viewFilesInfo=parseData(DataTable["files"]["viewfiles"][i],"@@",";;")
				var isPair = false;
				var partnerIndex = -1;
				var pairValue = "";
				if(DataTable["files"]["ftype"][i]=="fastq" && viewFilesInfo.hasOwnProperty("PARTNER") && viewFilesInfo.hasOwnProperty("PAIR")){
					isPair = true;
					pairValue = viewFilesInfo["PAIR"];
					partnerIndex=DataTable["files"]["fname"].indexOf(viewFilesInfo["PARTNER"]);
				}
				if(isPair == true && pairValue  == "1" && partnerIndex != -1){
					if (selectedFiles[partnerIndex]==false) {
						selectedFileTypes[thetype]++;
					}
					selectedFiles[partnerIndex]=true;
				}
				
			}
		}
	}
	else{
//		$('input[name=fileChecked]').prop("checked", false);
		allFileChecks=false;
		for (var i=0;i<DataTable["files"]["fname"].length;i++) {
			var thefile=DataTable["files"]["datapath"][i];
			var thetype=DataTable["files"]["ftype"][i];
//			if (hideFileType[thetype]==false) {
			if (showingFile[i]==true) {
				if (selectedFiles[i]==true) {
					selectedFileTypes[thetype]--;
				}
				selectedFiles[i]=false;

				// Apply selection to partners
				var viewFilesInfo=parseData(DataTable["files"]["viewfiles"][i],"@@",";;")
				var isPair = false;
				var partnerIndex = -1;
				var pairValue = "";
				if(DataTable["files"]["ftype"][i]=="fastq" && viewFilesInfo.hasOwnProperty("PARTNER") && viewFilesInfo.hasOwnProperty("PAIR")){
					isPair = true;
					pairValue = viewFilesInfo["PAIR"];
					partnerIndex=DataTable["files"]["fname"].indexOf(viewFilesInfo["PARTNER"]);
				}
				if(isPair == true && pairValue  == "1" && partnerIndex != -1){
					if (selectedFiles[partnerIndex]==true) {
						selectedFileTypes[thetype]--;
					}
					selectedFiles[partnerIndex]=false;
				}
			}
		}

	}
	resize();
	checkSelectedFiles();
}

// Change tab
function selectTab(tabName){
	$("div[name='FunctionTab']").attr("class","slash_off");
	_$("QcTab").style.zIndex=450;
	_$("TrimTab").style.zIndex=400;
	_$("AlignTab").style.zIndex=350;
	_$("QuantifyTab").style.zIndex=300;
	_$("DownloadGenomesTab").style.zIndex=350;
	_$("ExpressionTab").style.zIndex=250;
	var tabFullName=tabName+"Tab";
	$("#"+tabFullName).attr("class","slash_on");
	_$(tabFullName).style.zIndex=401;
	var containerFullName=tabName+"Div";
	$("div[name='FunctionDiv']").hide();
	$("#"+containerFullName).show();
	
	switch (tabName) {
		case "Qc":
			renderQcTab();
			checkForm();
			break;
		case "Trim":
			renderTrimTab();
			checkForm();
			break;
		case "Quantify":
			renderQuantifyTab();
			checkForm();
			break;
		case "Expression":
			renderExpressionTab();
			checkForm();
			break;
		case "Align":
			renderAlignmentTab();
			checkForm();
			break;
		case "DownloadGenomes":
			renderDownloadGenomesTab();
			checkForm();
			break;
	}
	
				
			
			
			
			
			

}

// Show view Tab
function showView(){
	$("#Viewer").show();
}

function showErrorMessage(){
	myalert(ReturnMessage["action"], ReturnMessage["message"]["message"]);
}

// OLIVEROS myalert
function myalert(title, content, buttons="") {
	_$("myalert_title").innerHTML=title;
	_$("myalert_content").innerHTML=content;
	_$("myalert_buttons").innerHTML="";
	if (buttons.match(/cancel/)) {
		_$("myalert_buttons").innerHTML+=`<input type="button" class="buttonIcon" value="Cancel" onclick="_$('myalert').style.display='none';">`;
	}
	_$("myalert_buttons").innerHTML+=`<input type="button" class="buttonIcon" value="Accept" onclick="_$('myalert').style.display='none';">`;
	_$("myalert").style.display="block";
}

/// END Viewport functions 


/// BEGIN Render functions

var nselected=0;
function renderProject() {
	_$("ProjectName").style.color="black";
	if (ProjectData["session"]["description"]!==""){
		showHiddenFiles=false;
		showAuxFiles=false;
		allFileChecks=false;
		selectedFiles=new Array();
		selectedFileTypes=new Object();
//		_$("ButtonViewFiles").innerHTML=" ... ";
		nselected=0;
		for (var t in SeqNjoy.FileTypeColor) {
			selectedFileTypes[t]=0;
		}
		_$("ProjectName").value=ProjectData["session"]["description"];
		renderFileTable(currentSortBy,"current");
//		selectTab("Trim");
//		renderTrimTab();
//		selectTab("Quantify");
//		renderQuantifyTab();
//		selectTab("Expression");
//		renderExpressionTab();
//		selectTab("Align");
//		renderAlignmentTab();
		document.getElementById('HomeCourtain').style.display='none';
		_$("ModalCourtain").style.display="none";
		document.getElementById('MainDiv').style.display='block';
		resize();
	}
}

function checkForm() {
	if (_$("DownloadGenomesTab").className=="slash_on") { checkDownloadGenomesForm(); }
	if (_$("AlignTab").className=="slash_on") { checkAligningForm(); }
	if (_$("QcTab").className=="slash_on") { checkQcForm(); }
	if (_$("TrimTab").className=="slash_on") { checkTrimmingForm(); }
	if (_$("QuantifyTab").className=="slash_on") { checkQuantifyForm(); }
	if (_$("ExpressionTab").className=="slash_on") { checkExpressionForm(); }
}

function checkSelectedFiles() {
	_$("ButtonDownloadFiles").setAttribute("disabled","disabled");
	_$("ButtonDeleteFiles").setAttribute("disabled","disabled");

	if (nselected>0) {
		_$("ButtonDownloadFiles").removeAttribute("disabled");
		if (nSelectedWithChildren==0) {
			_$("ButtonDeleteFiles").removeAttribute("disabled");
		}
	}
	if (_$("labelNSelectedFiles")) { _$("labelNSelectedFiles").innerHTML="x"+nselected; }
}

function renderFileTable(sortBy, sense) {
	nSelectedWithChildren=0;
	nSelectedWithNoChildren=0;
	nselected=0;
	if (allFileChecks==true) { var allChecked=" checked";  } else { var allChecked=""; }

		var htmlOut=`<table id="over_FilesTable" border="0px" cellpadding="0px" cellspacing="0px" width="100%">
	<tr>
		<th style=position:sticky;top:0;" class="tinypadded bwhite nowrap center bbottom"><input id="allFileChecks" type="checkbox" onChange="toggleFileChecks();"`+allChecked+`><div style="display:none" class="bwhite" id="labelNSelectedFiles">x`+nselected+`</div></td>
		<th style=position:sticky;top:0;" class="tinypadded bwhite bbottom"><div id="DIV_filesTableHeader-ftype" class="w100"><button id="filesTableHeader-ftype" class="ButtonTableHead nowrap w100 center" onclick="renderFileTable('ftype','auto');" value="Type">Type <i class="D4D0C8 fa fa-sort"></i></button></div></td>
		<th style=position:sticky;top:0;" class="tinypadded bwhite w100 bbottom"><div id="DIV_filesTableHeader-fname" class="w100"><button id="filesTableHeader-fname" class="ButtonTableHead nowrap w100 left" onclick="renderFileTable('fname','auto');" value="Details">Details <i class="D4D0C8 fa fa-sort"></i></button></div></td>
		<th style=position:sticky;top:0;" class="tinypadded bwhite bbottom"><div id="DIV_filesTableHeader-fsize" class="w100"><button id="filesTableHeader-fsize" class="ButtonTableHead nowrap w100 right" onclick="renderFileTable('fsize','auto');" value="Bytes">Bytes <i class="D4D0C8 fa fa-sort"></i></button></div></td>
		<th style=position:sticky;top:0;" class="tinypadded bwhite bbottom"><div id="DIV_filesTableHeader-fcreated" class="w100"><button id="filesTableHeader-fcreated" class="ButtonTableHead nowrap w100 left" onclick="renderFileTable('fcreated','auto');" value="Date">Date <i class="D4D0C8 fa fa-sort"></i></button></div></td>
		<th style=position:sticky;top:0;" class="tinypadded bwhite bbottom">&nbsp;</td>
	</tr>`;

	if (sense=="up") { currentSortSense=1; }
	else if (sense=="down") { currentSortSense=-1; }
	else if (sense=="current") {  }
	else if (sense=="auto") {
		if (sortBy==currentSortBy) { currentSortSense=-currentSortSense; }
		else { currentSortSense=1; }
	}
	var nElems=0;
	if (DataTable.hasOwnProperty("files")) {
		var myObj=DataTable["files"];
		var nElems=myObj["fname"].length;
		
		var isParent=new Object();
		
		for (var f=0;f<nElems;f++) {
			var tmp=myObj["dependencies"][f].split(" @@ ");
			for (var ff=0;ff<tmp.length;ff++) {
				isParent[tmp[ff].replace(/&.+/,"")]=1;
			}
		}
		
		if (sortBy=="fcreated") {
			var DateList=new Object();
			var keysSorted;
			for(var i=0; i<nElems;i++){
				DateList[i]=Date.parse(myObj[sortBy][i]);
			}
			keysSorted = Object.keys(DateList).sort(function(a,b){return (DateList[b]-DateList[a])*currentSortSense})
		}
		else if (sortBy=="fsize") {
			var FieldList=new Object();
			var keysSorted;
			for(var i=0; i<nElems;i++){
				FieldList[i]=myObj[sortBy][i];
			}
			keysSorted = Object.keys(FieldList).sort(function(a,b){return (FieldList[b]-FieldList[a])*currentSortSense})
		}
		else {
			var FieldList=new Object();
			var keysSorted;
			for(var i=0; i<nElems;i++){
				FieldList[i]=myObj[sortBy][i];
			}
			keysSorted = Object.keys(FieldList).sort(function(a,b){
						if (FieldList[a]>FieldList[b]) { return (1*currentSortSense); }
						else if (FieldList[a]<FieldList[b]) { return (-1*currentSortSense); }
						else { return (0); }
				});
		}
		currentSortBy=sortBy;

		var allTypes=new Object();
		for (var t in SeqNjoy.FileTypeColor) { allTypes[t]=0; }
		for(var k=0; k<nElems;k++){
			var i =  keysSorted[k];
			if (typeof(selectedFiles[i])=="undefined") { selectedFiles[i]=false; }
			if (myObj["hidden"][i]=="NO") { allTypes[myObj["ftype"][i]]++; }
			if (typeof(hideFileType[myObj["ftype"][i]])=="undefined") { hideFileType[myObj["ftype"][i]]=false; }
			showingFile[i]=false;
			if (myObj["fname"][i].match(RegExp(fileNameFilter))) {
				if(((showHiddenFiles && myObj["hidden"][i]=="YES") || (showAuxFiles && myObj["hidden"][i]=="AUXILIARY")|| myObj["hidden"][i]=="NO") && hideFileType[myObj["ftype"][i]]==false){
					var color="#0000FF";
					if (typeof(SeqNjoy.FileTypeColor[myObj["ftype"][i]])=="undefined") {
						var color="#FFFF00";
					}
					else {
						var color=SeqNjoy.FileTypeColor[myObj["ftype"][i]];
					}
					var viewFilesInfo=parseData(myObj["viewfiles"][i],"@@",";;")
					var isPair = false;
					var partnerIndex = -1;
					var pairValue = "";
					if(myObj["ftype"][i]=="fastq" && viewFilesInfo.hasOwnProperty("PARTNER") && viewFilesInfo.hasOwnProperty("PAIR")){
						isPair = true;
						pairValue = viewFilesInfo["PAIR"];
						partnerIndex=myObj["fname"].indexOf(viewFilesInfo["PARTNER"])
					}

					if(isPair == false || (pairValue  == "1" && partnerIndex != -1)){
						showingFile[i]=true;
						if (selectedFiles[i]) { var trClass="trFileSelected"; var isChecked="checked"; nselected++; } else {  var trClass="trFile"; var isChecked=""; }
						//if(allFileChecks == true) { var isChecked="checked";  }
						htmlOut+=`<tr class='`+trClass+`'>`;
						if(isPair && pairValue  == "1"){
							htmlOut+=`<td class="tinypadded middle">
							              <input name="fileChecked" id="checked_`+myObj["datapath"][i]+`" type="checkbox" `+isChecked+` onchange="_$('checked_`+myObj["datapath"][partnerIndex]+`').checked=this.checked; if(selectedFiles['`+i+`']==true) { nselected--; selectedFiles['`+i+`']=false; selectedFileTypes['`+myObj["ftype"][i]+`']--; } else { nselected++; selectedFiles['`+i+`']=true; selectedFileTypes['`+myObj["ftype"][i]+`']++; } if(selectedFiles['`+partnerIndex+`']==true) { nselected--; selectedFiles['`+partnerIndex+`']=false; selectedFileTypes['`+myObj["ftype"][partnerIndex]+`']--; } else { nselected++; selectedFiles['`+partnerIndex+`']=true; selectedFileTypes['`+myObj["ftype"][partnerIndex]+`']++; }checkSelectedFiles();renderFileTable(currentSortBy,'current');">
							              <input name="fileChecked" id="checked_`+myObj["datapath"][partnerIndex]+`" style="display:none" type="checkbox" `+isChecked+`>
							          </td>`;							
						} else {
							// Edit to add check for both pairs
							htmlOut+=`<td class="tinypadded middle"><input name="fileChecked" id="checked_`+myObj["datapath"][i]+`" type="checkbox" `+isChecked+` onchange="if(selectedFiles['`+i+`']==true) { nselected--; selectedFiles['`+i+`']=false; selectedFileTypes['`+myObj["ftype"][i]+`']--; } else { nselected++; selectedFiles['`+i+`']=true; selectedFileTypes['`+myObj["ftype"][i]+`']++; }checkSelectedFiles();renderFileTable(currentSortBy,'current');"></td>`;
						}
						var viewLink="";
						if (myObj["ftype"][i]=="bam" && !myObj["description"][i].match(/by user/)) {
							var deps=myObj["dependencies"][i].split(" @@ ");
							var fastaFile="none";
							var annotsFile="none";
							for (var d=0;d<deps.length;d++) {
								if (deps[d].match(/\.f[an][^\.]*$/)) { var fastaFile="PROJECTS/"+deps[d].replace(/&.+/,""); }
							}
							if (myObj["description"][i].match(/single-end/)) { var bamType="single"; } else { var bamType="paired"; }
							var bamFiles="PROJECTS/"+myObj["datapath"][i]+"&type="+bamType;
							//htmlOut+=`<td class="bgradient nowrap center middle" onclick="open_browser('igv-div','`+bamFiles+`','`+fastaFile+`','`+annotsFile+`');">`+myObj["ftype"][i]+`</td>`;
							var viewLink=`<button class="buttonIcon" style="background:`+color+`;" onclick="open_browser('igv-div','`+bamFiles+`','`+fastaFile+`','`+annotsFile+`');"><i class="fa fa-chart-area left buttonIconPadding fa-fw" style="color:white;background:transparent;" onmouseover="this.style.color='black';" onmouseout="this.style.color='white';" title="Open in IGV"></i></button>`;
						}
						else if (myObj["ftype"][i]=="fasta") {
							var annotsFile="none";
							var bamFiles="none";
							var fastaFile="PROJECTS/"+myObj["datapath"][i];
							//htmlOut+=`<td class="bgradient nowrap center middle"  onclick="open_browser('igv-div','`+bamFiles+`','`+fastaFile+`','`+annotsFile+`');">`+myObj["ftype"][i]+`</td>`;
							var viewLink=`<button class="buttonIcon" style="background:`+color+`;" onclick="open_browser('igv-div','`+bamFiles+`','`+fastaFile+`','`+annotsFile+`');"><i class="fa fa-chart-area left buttonIconPadding fa-fw" style="color:white;background:transparent;" onmouseover="this.style.color='black';" onmouseout="this.style.color='white';" title="Open in IGV"></i></button>`;
						}
						else if (myObj["ftype"][i]=="fastq") {
							var viewFilesInfo=parseData(myObj["viewfiles"][i],"@@",";;")
							var reportFile="";
							if(viewFilesInfo.hasOwnProperty("REPORT")){
								//reportFile=viewFilesInfo["REPORT"];
								reportFile="PROJECTS/"+viewFilesInfo["REPORT"];
								var viewLink=`<button class="buttonIcon" style="color:white;background:`+color+`;" onclick="window.open('`+reportFile+`','fastq`+i+`','toolbar=no, menubar=no, resizable=yes');"><i class="fa fa-chart-bar left buttonIconPadding  fa-fw" style="background:transparent;" onmouseover="this.style.color='black';" onmouseout="this.style.color='white';" title="Quality Control Report"></i></button>`;
							} else {
								var viewLink=`<button class="buttonIcon" disabled ><i class="fa fa-chart-bar left buttonIconPadding  fa-fw" style="background:transparent;" title="Generate quality control report first"></i></button>`;
							}						
						}
						else if (myObj["ftype"][i]=="gff") {
							var pngFile="PROJECTS/"+myObj["datapath"][i]+".png";
							//htmlOut+=`<td class="bgradient nowrap center middle"  onclick="open_browser('igv-div','`+bamFiles+`','`+fastaFile+`','`+annotsFile+`');">`+myObj["ftype"][i]+`</td>`;
							var viewLink=`<button class="buttonIcon" style="color:white;background:`+color+`;" onclick="window.open('`+pngFile+`','gff','toolbar=no, menubar=no, resizable=yes');"><i class="fa fa-project-diagram left buttonIconPadding fa-fw" style="background:transparent;" onmouseover="this.style.color='black';" onmouseout="this.style.color='white';"></i></button>`;
						}
						else if (myObj["ftype"][i]=="diffexp") {
							var htmlFile="PROJECTS/"+myObj["datapath"][i]+".FIESTA.html";
							var viewLink=`<button class="buttonIcon" style="background:`+color+`;" onclick="window.open('`+htmlFile+`');"><i class="fa fa-table left buttonIconPadding fa-fw" style="color:white;background:transparent;" onmouseover="this.style.color='black';" onmouseout="this.style.color='white';"></i></button>`;
						}

						htmlOut+=`<td class="tinypadded bgradient nowrap center middle">`+myObj["ftype"][i]+`</td>`;
						//var rcode=` (download <a href="`+window.location.origin+`/PROJECTS/`+ProjectData['session']['datapath'][0]+`/`+myObj["datapath"][i]+`.R">R code</a>)`;
						if(isPair && pairValue  == "1"){
							htmlOut+=`<td class="tinypadded bgradient left middle w100 nowrap">`+`<table cellpadding=0 cellspacing=0 border=0><tr><td style="padding-right:0.5rem;"><span class="FileTypeSpan" style="background:`+color+`;color:white;">`+myObj["fname"][i]+`</span>  <span class="FileTypeSpan" style="background:`+color+`;color:white;">`+viewFilesInfo["PARTNER"]+`</span> `+`</td><td class="w100"><span class="wrap font08">`+myObj["description"][i]+`</span></td><td class="right" style="padding-left:1rem;">`+viewLink+`</td></tr></table>`;	
						} else {						
							htmlOut+=`<td class="tinypadded bgradient left middle w100 nowrap">`+`<table cellpadding=0 cellspacing=0 border=0><tr><td style="padding-right:0.5rem;"><span class="FileTypeSpan" style="background:`+color+`;color:white;">`+myObj["fname"][i]+`</span> `+`</td><td class="w100"><span class="wrap font08">`+myObj["description"][i]+`</span></td><td class="right" style="padding-left:1rem;">`+viewLink+`</td></tr></table>`;
						}
						htmlOut+=`</td>`;
						htmlOut+=`<td class="tinypadded bgradient nowrap right middle">`+MyNumberFormat.format(myObj["fsize"][i])+`&nbsp;&nbsp;</td>`;
						htmlOut+=`<td class="tinypadded bgradient nowrap left middle">`+myObj["fcreated"][i]+`&nbsp;&nbsp;</td>`;
						htmlOut+=`<td class="tinypadded  nowrap center middle">`
						if(isPair && pairValue  == "1"){
							htmlOut+=`<button class="buttonIcon" onclick="launchDownloadingMultipleFiles('PAIR-END_`+myObj["fname"][i].split('.')[0]+`','`+myObj["datapath"][i]+`','`+myObj["ftype"][i]+`','`+myObj["datapath"][partnerIndex]+`','`+myObj["ftype"][partnerIndex]+`')"><i class="fa fa-download left buttonIconPadding"></i></button>`;
						} else {
							htmlOut+=`<button class="buttonIcon" onclick="launchDownloadingSingleFile('`+myObj["datapath"][i]+`','`+myObj["ftype"][i]+`')"><i class="fa fa-download left buttonIconPadding"></i></button>`;							
						}
						//htmlOut+=`<button onclick="`+window.location.origin+`/PROJECTS/`+ProjectData['session']['datapath'][0]+`/`+myObj["datapath"][i]+`"><i class="fa fa-download"></i></button>`;
						if (isParent[myObj["datapath"][i]]) {
							var isDisabled=" disabled";
							if (isChecked=="checked") { nSelectedWithChildren++; }
						} else {
							var isDisabled="";
							if (isChecked=="checked") { nSelectedWithNoChildren++; }
						}
						var viewFilesInfo=parseData(myObj["viewfiles"][i],"@@",";;")
						if(viewFilesInfo.hasOwnProperty("PARTNER")){
							htmlOut+=`<button class="buttonIcon" onclick="if(confirm('Delete file `+myObj["fname"][i]+` and its pair `+viewFilesInfo["PARTNER"]+`?')) { launchDeletingQueue('`+myObj["datapath"][i]+`','`+myObj["datapath"][i].substring(0, myObj["datapath"][i].lastIndexOf("/")+1)+viewFilesInfo["PARTNER"]+`'); }"`+isDisabled+`><i class="fa fa-trash left buttonIconPadding"></i></button>`;
						} else {
							htmlOut+=`<button class="buttonIcon" onclick="if(confirm('Delete file `+myObj["fname"][i]+`?')) { launchDeletingQueue('`+myObj["datapath"][i]+`'); }"`+isDisabled+`><i class="fa fa-trash left buttonIconPadding"></i></button>`;
						}

						htmlOut+=`</td></tr>`;	
					}
				}
			}
		}
	}
	htmlOut+='</table>';
	
	var htmlFileTypes=`Show: `;
	if (nElems==0) {
		htmlOut=`<div class="NoFilesToShowDiv gray">
	<div class="font30 medipadded bold gray">&uarr;</div>
	<span class="gray font20">Start by loading some files:</span>
	<ul class="list gray">
		<li class="ListItem"><span>Short-reads in standard FASTQ format</span>
		<li class="ListItem"><span>Already aligned short-reads in standard BAM or SAM format</span>
		<li class="ListItem"><span>Genomic sequences in standard FASTA format</span>
		<li class="ListItem"><span>Genomic features coordinates (genes, CDS, exons...) in standard GFF3 or GTF format</span>
		<li class="ListItem"><span>Feature annotations (gene symbols, descriptions...) in ANN format: text-tabulated with the GeneIDs in the first column (use file extension ".ann")</span>
	</ul>
</div>`;
		_$("MenuAlign").setAttribute("disabled","disabled")
		_$("MenuQuantify").setAttribute("disabled","disabled")
		_$("MenuCompare").setAttribute("disabled","disabled")
		_$("FilesTD").style.display="none";
	}
	else {
		_$("MenuAlign").removeAttribute("disabled")
		_$("MenuQuantify").removeAttribute("disabled")
		_$("MenuCompare").removeAttribute("disabled")
		_$("FilesTD").style.display="block";
		for (var t in SeqNjoy.FileTypeColor) {
			if (allTypes[t]==0) { hideFileType[t]=true; }
			if (hideFileType[t]==false) {
				var bgcolor=SeqNjoy.FileTypeColor[t];
				var color="white";
			}
			else {
				var bgcolor="#EDEDED";
				var color="#666666";
				var border="3px solid white";
			}
			if (selectedFileTypes[t]>0) {
				var theclass="FileTypeButtonSomeSelected";
				color="white";
				var border="3px solid "+SeqNjoy.FileTypeColorDark[t];;
			}
			else {
				var theclass="FileTypeButton";
				var border="3px solid white";
			}
			
			htmlFileTypes+=`<button class="`+theclass+`" style="border:`+border+`;color:`+color+`;background:`+bgcolor+`" onclick="if (selectedFileTypes['`+t+`']==0) { toggleViewType('`+t+`');}">`+t+` (`+selectedFileTypes[t]+`/`+allTypes[t]+`)</button>`;
		}
//		if (showAuxFiles) { var colorAux="#FFFFFF"; var bgcolorAux="#000000"; } else { var colorAux="#666666"; var bgcolorAux="#EDEDED"; }
//		htmlFileTypes+=`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class="FileTypeButton" onclick="toggleAuxFiles();" style="color:`+colorAux+`;background:`+bgcolorAux+`">Aux. Files</button>`;
	}

	document.getElementById('FileTypesDiv').innerHTML=htmlFileTypes;
	document.getElementById('dtFiles').style.position="relative";
//	document.getElementById('dtFiles').style.overflowY="scroll";
//	document.getElementById('dtFiles').style.overflowX="auto";
//	document.getElementById('dtFiles').innerHTML=htmlOut+htmlOverHeaderOut;
	document.getElementById('dtFiles').innerHTML=htmlOut;
//	populateFileOptions();
//	_$("FileOptionsDiv").style.display=FileOptionsDivDisplay;
	if (nElems>0) {
		if (currentSortSense==1) { var arrow=` <i class="fa fa-sort-up"></i>`; } else { var arrow=` <i class="fa fa-sort-down"></i>`; }
		document.getElementById('filesTableHeader-'+currentSortBy).innerHTML=document.getElementById('filesTableHeader-'+currentSortBy).value+arrow;
		document.getElementById('FilesDiv').scrollTop = 0;
//		resizeFilesTableOverHeader();
		checkSelectedFiles();
	}
}

function view_gff(thediv,pngFile) {
	_$("ModalCourtainGFF").style.display="block";
	_$("gff_name_TD").innerHTML=basename(pngFile);
	_$(thediv).innerHTML=`<img src="`+pngFile+`">`;
	_$("gff-div-container").style.display="block";
}

function close_gff() {
	_$("ModalCourtainGFF").style.display="none";
	_$("gff-div-container").style.display="none";
}



function resizeFilesTableOverHeader() {
	_$('dtFiles').style.height=_$("FilesTable").offsetHeight+"px";
	_$("DIV_filesTableHeader-ftype").style.width=_$("DIV_back_filesTableHeader-ftype").getBoundingClientRect().width+"px";
	_$("DIV_filesTableHeader-fsize").style.width=_$("DIV_back_filesTableHeader-fsize").getBoundingClientRect().width+"px";
	_$("DIV_filesTableHeader-fcreated").style.width=_$("DIV_back_filesTableHeader-fcreated").getBoundingClientRect().width+"px";
	_$("DIV_filesTableHeader-fname").style.width=_$("DIV_back_filesTableHeader-fname").getBoundingClientRect().width+"px";
	_$("labelNSelectedFiles").style.width=_$("back_labelNSelectedFiles").getBoundingClientRect().width+"px";
//	_$("cog_sep").style.width=_$("back_cog_sep").offsetWidth+"px";
}

function renderLog(){
	if(LogData.hasOwnProperty('log')){
		var inLogData=LogData['log'];
		//var outText = '<table id="LogTable" style="text-align:left" border="0px" cellpadding="0px" cellspacing="0px" width="100%" height="100%">'
		var outText = '<table id="LogTable" style="text-align:left" border="0px" cellpadding="0px" cellspacing="0px" width="100%">'
		//var outText = '<table id="LogTable" style="text-align:left">'
		for(var i =0; i< inLogData["TIME"].length;i++){
			outText +=	'<tr><td style="width:20%">'+inLogData["TIME"][i]+'</td><td>'+inLogData["MESSAGE"][i]+'</td></tr>'
		}
		outText += '</table>'
		_$("LogContent").innerHTML=outText;
		_$("LogDiv").style.display='block';
	}
}

function renderView(){
	showView('View');
	if(ViewData.hasOwnProperty('inputFiles')){
		var inViewFiles =ViewData['inputFiles'];
		if(ViewData.hasOwnProperty('viewType')){
			var viewType =ViewData['viewType'];
			//_$('CurrentView').innerHTML="View mode: "+viewType+" - Files: "+inViewFiles;
			if(viewType == "FastqView"){
				renderRQCoutput("ViewerDiv",ViewData);
			}
			else if(viewType == "tableView"){
				renderFIESTA("ViewerDiv",ViewData);
			}
		}
	}
}

/// END Render functions

/// BEGIN Data Check functions

function multipleViewWarnings(toViewElements){
	// Check View limitatios for multiple files on toViewElements
	var retVal="";
	return retVal;
}


function checkProjectName(name){
	var isNotDuplicated=true;
	for (var t=0;t<ALL_PROJECTS["description"].length;t++) {
		if (basename(ALL_PROJECTS["datapath"][t]).toUpperCase()==name.toUpperCase() && name != ProjectData["session"]["description"]) {
			isNotDuplicated=false;
			break;
		}
	}	
	
	
	if(name.match(/\w/) && isNotDuplicated && _$("NewProjectDir").value != ""){
		_$("NewSession_Button").disabled=false;
		_$("ProjectName").style.color="black";
		_$("NewSession_Input").style.color="black";
		_$("NewSession_Button").title="Create new project in "+_$("NewProjectDir").value+"/"+name;
	}
	else{
		_$("NewSession_Button").disabled=true;
		_$("ProjectName").style.color="red";
		_$("NewSession_Input").style.color="red";
		_$("NewSession_Button").title="";
	}
}

/// END Data Check functions

function populateFunctionOptions(name) {
	var html=`<table cellpadding="0px" cellspacing="0px" border="0px">`;
	for (var o=0;o<PARAMS[name]["ID"].length;o++) {
		var Editable=PARAMS[name]["Editable"][o];
		var IsActive=PARAMS[name]["ACTIVE"][o];
		var Caption1=PARAMS[name]["Caption1"][o];
		var Caption2=PARAMS[name]["Caption2"][o];
		var Default=PARAMS[name]["Default"][o];
		var Param=PARAMS[name]["Param"][o];
		var ID=PARAMS[name]["ID"][o];
		var Type=PARAMS[name]["Type"][o];
		var Range=PARAMS[name]["Range"][o];
		var Help=PARAMS[name]["Help"][o];
		if (Editable=="NO") {
			html+=`<tr style="display:none;"><td><input type="hidden" id="`+ID+`" value="`+Default+`"></td></tr>`;
		}
		else if (Editable=="YES") {
			if (Caption1=="BLANK") { Caption1=""; }
			if (Caption2=="BLANK") { Caption2=""; }
			if (Param==="BLANK") { Param=""; }
			
			if (IsActive=="always") { var tdCheck="<span></span>"; var isDisabled=""; }
			else {
				if (IsActive=="YES") { var isChecked="checked"; var isDisabled=""; } else { var isChecked=""; var isDisabled="disabled"; }
				var tdCheck=`
			<input type="checkbox" `+isChecked+` id="`+ID+`Check" onchange="if(this.checked) { _$('`+ID+`').disabled=false; } else { _$('`+ID+`').disabled=true; }">
		`;
			}
			if (Type=="Integer") {
				html+=`
	<tr>
		<td class="tinypadded nowrap">`+tdCheck+Caption1+`</td>
		<td class="tinypadded nowrap">
			<input title="`+Help+`" id="`+ID+`" `+isDisabled+` type="textbox" class="DefaultInput`+Type+`" value="`+Default+`" onFocus="this.select()" onblur="checkForm();" oninput='this.value=this.value.replace(/[^-0-9]/g,\"\");checkForm();'> `+Caption2+`
		</td>
		<td>
		</td>
	</tr>`;
			}
			
			if (Type=="Float") {
				html+=`
	<tr>
		<td class="tinypadded nowrap">`+tdCheck+Caption1+`</td>
		<td class="tinipadded nowrap">
			<input title="`+Help+`" id="`+ID+`" `+isDisabled+` type="textbox" class="DefaultInput`+Type+`" value="`+Default+`" onFocus="this.select()" onblur="checkForm();" oninput='this.value=this.value.replace(/[^-0-9\.]/g,\"\");checkForm();'> `+Caption2+`
		</td>
	</tr>`;
			}


			if (Type=="SelectFile") {
				var RangeCaptions=PARAMS[name]["RangeCaptions"][o];
				var filter=new RegExp(PARAMS[name]["Range"][o]);

				var theselect=`<select title="`+Help+`" id="`+ID+`" onchange="checkForm();">`;
				var opts=new Array();
				var optcaptions=new Array();
				for (var f=0;f<DataTable["files"]["datapath"].length;f++) {
					var thefile=DataTable["files"]["datapath"][f];
					var desc=DataTable["files"]["description"][f];
					if (thefile.match(filter) && (desc.match(/introns found \(min:/i) || thefile.match(/\.ann(\.\w+)?$/))) {
						opts.push(thefile);
						optcaptions.push(basename(thefile));
					}
				}
				if (Default=="NO_DEFAULT") {
					theselect+=`<option value="`+NOT_SELECTED+`" selected>Please select file</option>`;
				}
				if (Default=="NO_MANDATORY") {
					theselect+=`<option value="no_mandatory" selected>none selected</option>`;
				}
				for (var opt=0;opt<opts.length;opt++) {
					if (Default==opts[opt]) { var isdefault="selected"; } else { var isdefault=""; }
					theselect+=`<option value="`+opts[opt]+`" `+isdefault+` style="color:#000000;">`+optcaptions[opt]+`</option>`;
				}
				theselect+=`</select>`;
				
				html+=`
	<tr>
		<td class="tinypadded nowrap">`+tdCheck+Caption1+`</td>
		<td class="tinypadded nowrap">
			`+theselect+` `+Caption2+`
		</td>
	</tr>`;
			}





			if (Type=="Select") {
				var RangeCaptions=PARAMS[name]["RangeCaptions"][o];

				var theselect=`<select title="`+Help+`" id="`+ID+`" onchange="checkForm();">`;
				var opts=Range.split("\|");
				var optcaptions=RangeCaptions.split("\|");
				if (Default=="NO_DEFAULT") {
					theselect+=`<option value="`+NOT_SELECTED+`" selected>Please select</option>`;
				}
				for (var opt=0;opt<opts.length;opt++) {
					if (Default==opts[opt]) { var isdefault="selected"; } else { var isdefault=""; }
					theselect+=`<option value="`+opts[opt]+`" `+isdefault+` style="color:#000000;">`+optcaptions[opt]+`</option>`;
				}
				theselect+=`</select>`;
				
				html+=`
	<tr>
		<td class="tinypadded nowrap">`+tdCheck+Caption1+`</td>
		<td class="tinypadded nowrap">
			`+theselect+` `+Caption2+`
		</td>
	</tr>`;
			}


			if (Type=="Radio") {
				var RangeCaptions=PARAMS[name]["RangeCaptions"][o];

				var theselect=``;
				var opts=Range.split("\|");
				var optcaptions=RangeCaptions.split("\|");
				for (var opt=0;opt<opts.length;opt++) {
					if (Default==optcaptions[opt]) { var isdefault="checked"; } else { var isdefault=""; }
					theselect+=`<input title="`+Help+`" type="radio" id="`+optcaptions[opt]+`" name="`+ID+`" value="`+opts[opt]+`" `+isdefault+` onclick="checkForm();"> `+optcaptions[opt]+`</input>&nbsp;`;
				}
				html+=`
	<tr>
		<td class="tinypadded nowrap" style="padding-bottom:0rem;padding-top:0rem;">`+tdCheck+Caption1+`</td>
		<td class="tinypadded nowrap" style="padding-bottom:0rem;padding-top:0rem;">
			`+theselect+` `+Caption2+`	
		</td>
	</tr>`;
			}


			if (Type=="Check") {
				var RangeCaptions=PARAMS[name]["RangeCaptions"][o];

				var theselect=``;
				if (Default.toLowerCase()=="checked") { var isdefault="checked"; } else { var isdefault=""; }
				theselect+=`<input title="`+Help+`" type="checkbox" style="display:table-cell;vertical-align:top;" id="`+ID+`" name="`+ID+`" `+isdefault+`>`;
				html+=`
	<tr>
		<td class="tinypadded nowrap" style="padding-bottom:0rem;padding-top:0rem;">`+tdCheck+Caption1+`</td>
		<td class="tinypadded nowrap" style="padding-bottom:0rem;padding-top:0rem;">
			`+theselect+` <div style="display:inline-block;vertical-align:bottom;">`+Caption2+`</div>
		</td>
	</tr>`;
			}




		}
	}
	html+=`</table>`;
	return (html);
}

function  validParam(id, type, range) {
	var result=true;
	if (type=="Integer") {
		var value=_$(id).value;
		if (value=="Inf") { value="1234567890"; }
		if (!isNaN(value)) {
			var tmp=range.split(" ");
			var min=tmp[0];
			var max=tmp[tmp.length-1];
			if (parseInt(value) >=min && parseInt(value) <=max && parseInt(value)==parseInt(value)) {
				var result=true;
			}
			else {
				var result=false;
			}
		}
		else {
			var result=false;
		}
		if (result) { _$(id).className="ValidInput"+type; } else { _$(id).className="WrongInput"+type; }
	}
	if (type=="Float") {
		var value=_$(id).value;
		if (value=="Inf") { value="1234567890"; }
		if (!isNaN(value)) {
			var tmp=range.split(" ");
			var min=tmp[0];
			var max=tmp[tmp.length-1];
			if (parseFloat(value) >=min && parseFloat(value) <=max && parseFloat(value)==parseFloat(value)) {
				var result=true;
			}
			else {
				var result=false;
			}
		}
		else {
			var result=false;
		}
		if (result) { _$(id).className="ValidInput"+type; } else { _$(id).className="WrongInput"+type; }
	}
	
	if (type=="Radio") {
		var radios=document.getElementsByName(id);
		var selected=0;
		for (var r=0;r<radios.length;r++) {
			if (radios[r].checked) {
				selected++;
			}
		}
		
		if (selected==0) { var result=false; } else { var result=true; }

		for (var r=0;r<radios.length;r++) {
			if (result) { radios[r].className="ValidInputRadio"; } else { radios[r].className="WrongInputRadio"; }
		}
	}
	
	if (type=="Select") {
		var value=_$(id).value;
		if (value==NOT_SELECTED) { result=false; } else { result=true; }
		if (result) { _$(id).className="ValidInput"+type; } else { _$(id).className="WrongInput"+type; }
	}
	
	if (type=="SelectFile") {
		var value=_$(id).value;
		if (value==NOT_SELECTED) { result=false; } else { result=true; }
		if (result) { _$(id).className="ValidInput"+type; } else { _$(id).className="WrongInput"+type; }
	}

	return (result);
}


function getCommonParams(PARAMS) {
	var common_params=new Object();
	for (var o=0;o<PARAMS["ID"].length;o++) {
		var EDITABLE=PARAMS["Editable"][o];
		var ID=PARAMS["ID"][o];
		var IncludeThis=true;
		if (_$(ID+"Check")) {
			if (!_$(ID+"Check").checked) { IncludeThis=false; }
		}
		if (IncludeThis==true) {
			if (EDITABLE!=="Array") {
				if (PARAMS["Type"][o]=="Check") {
					if (_$(ID).checked) {
						common_params[ID]="TRUE";
					}
					else {
						common_params[ID]="FALSE";
					}
				}
			
				else if (PARAMS["Type"][o]=="Radio") {
					// name is the ID of the Radio
					// ID is the value of each Radio option
					var ID=PARAMS["ID"][o];
					var options=document.getElementsByName(ID);
					for (var o=0;o<options.length;o++) {
						if (options[o].checked) {
							common_params[ID]=options[o].value;
						}
					}
				}
				else {
					var ID=PARAMS["ID"][o];
					common_params[ID]=_$(ID).value;
				}

			}
		}
	}
	return (common_params);
}	


