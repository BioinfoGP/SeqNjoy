var rangeServerURL="http://localhost:5000/"

function launchDownloadingQueue() {
	CANCEL_NOW=false;
	// global variables to separate tasks in R: after each R task, a signal is sent to client to launch next one.
	CURRENT_TASKS=new Array();
	CURRENT_TASK_STEP=0;
	CURRENT_TASK_SAMPLE=0;
	
	
	var today = new Date();
	var ss = today.getSeconds();
	var mn = today.getMinutes();
	var hh = today.getHours();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();
	
//	var zipname="Files_from_Finny ("+yyyy+"-"+mm+"-"+dd+" "+hh+"h"+mn+"m"+ss+"s).zip";
	var zipname="SeqNjoy_Export("+yyyy+"-"+mm+"-"+dd+").zip";

	
	if (DataTable.hasOwnProperty("files")) {
		var myObj=DataTable["files"];
		var files=myObj["fname"].length;
		var nn=0;
		var t=0;
		for (var f=0;f<files;f++) {
			if (selectedFiles[f]==true) {
				CURRENT_TASKS[t]=new Array(); // first dimension is the sample
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="add_file_to_zip";
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["todownload"]=myObj["datapath"][f];
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["ftype"]=myObj["ftype"][f];
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["zipname"]=zipname;
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Adding file to compressed folder...";
				CURRENT_TASK_SAMPLE++;
				t++
			}
		}
	}
	var stepCaptions=new Array();
	for (var f=0;f<CURRENT_TASKS.length;f++) {
		stepCaptions[f]=basename(CURRENT_TASKS[f][0]["data"]["todownload"]);
		for (var ff=0;ff<CURRENT_TASKS[f].length;ff++) {
			if (!CURRENT_TASKS[f][ff]["bottomMessage"]) {
				CURRENT_TASKS[f][ff]["bottomMessage"]="--BOTTOM MESSAGE--";
			}
		}
	}
	// last bottomMessage (not always present)
	//CURRENT_TASKS[0][0]["lastBottomMessage"]=`Your files: <a class="yourFiles" target="`+zipname+`" href="PROJECTS/`+CURRENT_PROJECT_ID+`/temp/`+zipname+`">`+zipname+`</a>`;
	CURRENT_TASKS[0][0]["lastBottomMessage"]=`Your files: <a class="yourFiles" target="`+zipname+`" href="`+rangeServerURL+`/temp/`+zipname+`">`+zipname+`</a>`;
	hideContent(initStepsDialog("Preparing to download..."," Download ready", stepCaptions, "default", true));
	CURRENT_TASK_SAMPLE=0;
	CURRENT_TASK_STEP=0;
	var ShinyObject=new Object();
	ShinyObject["action"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["command"];
	ShinyObject["data"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["data"];
	nextStepInShiny(ShinyObject);
}


function launchDownloadingSingleFile(filePath, fileType) {
	CANCEL_NOW=false;
	// global variables to separate tasks in R: after each R task, a signal is sent to client to launch next one.
	CURRENT_TASKS=new Array();
	CURRENT_TASK_STEP=0;
	CURRENT_TASK_SAMPLE=0;
	
	var nn=0;
	var t=0;
	CURRENT_TASKS[t]=new Array(); // first dimension is the sample
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="add_file_to_zip_and_download_it";
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["todownload"]=filePath;
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["ftype"]=fileType;
	CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Adding file to compressed folder...";
	CURRENT_TASK_SAMPLE++;
	t++

	CURRENT_TASK_SAMPLE=0;
	CURRENT_TASK_STEP=0;
	var ShinyObject=new Object();
	ShinyObject["action"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["command"];
	ShinyObject["data"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["data"];
	nextStepInShiny(ShinyObject);
}


function download_this_file(URL) {
	var a = document.createElement('a');
	a.setAttribute('href', URL);
	a.setAttribute('download', basename(URL));
	a.setAttribute('target', "_blank");
	
	document.body.appendChild(a);
	a.click();
	a.parentNode.removeChild(a); 
	
}
