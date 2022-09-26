'use strict';

/// BEGIN Functions to send objects to Shiny server

// Populate object for Shiny from another object 
function sendShinyObject(newObj) {
//	hideContent("");
//	JSShinyDetails = newObj;
	var d = new Date();
	newObj["timestamp"]=d.getTime();
	var json_message=JSON.stringify(newObj);
	_$("area_ShinyDetails").value=json_message;
	//alert(_$("area_ShinyDetails").value);
	if (_$("area_ShinyDetails").value=="none") { } else {
		Shiny.onInputChange("ShinyDetails", document.getElementById("area_ShinyDetails").value);
	}
}
// Send JSShinyDetails object to shiny
function sendShinyDetails() {
	var d = new Date();
	JSShinyDetails["timestamp"]=d.getTime();
	var json_message=JSON.stringify(JSShinyDetails);
	_$("area_ShinyDetails").value=json_message;
	//alert(_$("area_ShinyDetails").value);
	if (_$("area_ShinyDetails").value=="none") { } else {
		Shiny.onInputChange("ShinyDetails", document.getElementById("area_ShinyDetails").value);
	}
}

// Populate object for Shiny from an HTML FORM
//function populateShinyDetails(formName) {
//	formData=document.getElementById(formName).elements;
//	JSShinyDetails["data"] = new Object();
//	for (i = 0; i < formData.length; i++) {
//		if (formData[i].nodeName == "INPUT" &&  formData[i].id == "ShinyAction"){
//			JSShinyDetails["action"]= formData[i].value;
//		}
//		else if ((formData[i].nodeName == "INPUT" && formData[i].type == "text") ||
//			(formData[i].nodeName == "SELECT")) {
//			JSShinyDetails["data"][formData[i].id] = formData[i].value;  // update text input
//		}
//	}
	//JSShinyDetails["data"]=formData;
//	sendShinyDetails();

	//alert(formData)
//}

/// END Functions to send objects to Shiny server

/// Define actions to be executed we can classify these actions in two types:
///  - Functionalities that require a call to the Shiny server: These actions have at least two functions
///    - A request that must end with a call to sendShinyObject() whose action value must be defined in the server side (Request)
///    - A set of callback functions that process reads the data from a javascript object and transform it into a view, these render functions can be related to many actions (Callback)
///
///  - Functionalities independent of the Shiny server: These actions can be implemented in a single function, but sometimes the call a render function.



/// BEGIN Shiny dependent functionalities

/// Multiple actions: ShinyActions:(viewFiles, deleteFiles, downloadFiles) - Callbacks: (renderView, renderFileTable)
function multipleAction(newAction){
	checkedElements=$('input[name=fileChecked]:checked').map(function () {return this.id;}).get();
	var clearNames = [];
	for(var i=0; i<checkedElements.length;i++){
		clearNames.push(checkedElements[i].replace('checked_',''));
	}
	var r = true;
	if(newAction == "deleteFiles"){
		var confirmText = "Do you want to remove the following files from the project?";
		for(var i=0; i<clearNames.length;i++){
			confirmText += "\n- "+clearNames[i];
		}
		r=confirm(confirmText);
	}
	else if (newAction == "viewFiles"){
		var message = multipleViewWarnings(clearNames);
	}
	if(r==true){
		//alert(JSON.stringify(downloadChecks));
		var MultipleData=new Object();
		MultipleData["action"]=newAction;
		MultipleData["data"]=new Object();
		MultipleData["data"]["names"]=clearNames;
//		sendShinyObject(MultipleData);
	}
}

/// Show project log: ShinyAction: showLog - Callbacks: renderLog 
function showLog(fileName){
	var LogElem=new Object();
	LogElem["action"]="showLog";
	LogElem["data"]=new Object();
//	sendShinyObject(LogElem)
}

/// loadGFFfeatures: ShinyAction: loadGFFfeatures - Callbacks: renderQuantifyFeatures; 
function loadGFFfeatures(fileName){
	var IndexElem=new Object();
	IndexElem["action"]="loadGFFfeatures";
	IndexElem["data"]=new Object();
	IndexElem["data"]["name"]=fileName;
//	sendShinyObject(IndexElem)
	nextStepInShiny(IndexElem);
}

/// Delete single file: ShinyAction: deleteFile - Callbacks: renderFileTable renderProject?
function deleteFile(fileName){
	var r = confirm("Do you want to remove "+fileName+" from the project?");
	if(r==true){
		var DeleteElem=new Object();
		DeleteElem["action"]="deleteFile";
		DeleteElem["data"]=new Object();
		DeleteElem["data"]["name"]=fileName;
//		sendShinyObject(DeleteElem)
	}
}

/// View single file: ShinyAction: viewFile - Callbacks: renderView
function viewFile(fileName){
	var ViewElem=new Object();
	ViewElem["action"]="viewFile";
	ViewElem["data"]=new Object();
	ViewElem["data"]["name"]=fileName;
//	sendShinyObject(ViewElem);
}

/// Start Project: ShinyAction: startProject - Callbacks: renderProject (project table is NOT reactive)
function openProject(t){
	CURRENT_PROJECT_ID=ALL_PROJECTS["id"][t];
	CURRENT_PROJECT_INDEX=t;
	
	var ProjectData=new Object();
	ProjectData["action"]="openProject";
	ProjectData["data"]=new Object();
	ProjectData["data"]["id"]=CURRENT_PROJECT_ID;
	ProjectData["data"]["description"]="";
//	sendShinyObject(ProjectData)
	nextStepInShiny(ProjectData);
}

/// Delete Project: ShinyAction: deleteProject - Callbacks: NONE (project table is NOT reactive)
function deleteProject(projectID){
	var r = confirm("Do you want to delete this project?");
	if(r==true){
		var ProjectData=new Object();
		ProjectData["action"]="deleteProject";
		ProjectData["data"]=new Object();
		ProjectData["data"]["id"]=projectID;
		sendShinyObject(ProjectData)
	//	sendShinyObject(ProjectData)
		nextStepInShiny(ProjectData);
	}
}
/// New Project: ShinyAction: startProject - Callbacks: renderProject (project table is NOT reactive)
function startNewProject(projectId, projectDescription){
	CURRENT_PROJECT_ID=projectId;
	var ProjectData=new Object();
	ProjectData["action"]="startNewProject";
	ProjectData["data"]=new Object();
	ProjectData["data"]["id"]=projectId;
	ProjectData["data"]["description"]=projectDescription;
//	ProjectData["data"]["sourceDir"]=_$("NewProjectSource").value;
	ProjectData["data"]["sourceDir"]="";
//	sendShinyObject(ProjectData)
	nextStepInShiny(ProjectData);
}

/// Change project name: ShinyAction: changeProjectDescription - Callbacks: renderProject (project table is NOT reactive)
function changeProjectDescription(name){
	var isNotDuplicated=true;
	for (var t=0;t<ALL_PROJECTS["description"].length;t++) {
		if (ALL_PROJECTS["description"][t]==trim(name)) {
			isNotDuplicated=false;
			break;
		}
	}
	if (isNotDuplicated && name.match(/\w/)) {
		_$("ProjectName").style.color="black";
		ALL_PROJECTS["id"][CURRENT_PROJECT_INDEX]=trim(_$("ProjectName").value);
		_$("SessionDescription_Td_"+CURRENT_PROJECT_INDEX).innerHTML=_$("ProjectName").value;
		var ProjectData=new Object();
		ProjectData["action"]="changeProjectDescription";
		ProjectData["data"]=new Object();
		ProjectData["data"]["id"]=CURRENT_PROJECT_ID;
		ProjectData["data"]["description"]=trim(_$("ProjectName").value);
		nextStepInShiny(ProjectData);
	}
	else {
		_$("ProjectName").style.color="red";
	}
}



/// END Define actions to be executed in Shiny server
