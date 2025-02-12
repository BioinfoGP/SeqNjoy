function launchDeletingQueue() {
	var paths = Array.prototype.slice.call(arguments);
	if(paths.length >0){
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
		
		if (paths[0]=="selected") {	// delete selected files	
			if (DataTable.hasOwnProperty("files")) {
				var myObj=DataTable["files"];
				var files=myObj["fname"].length;
				var nn=0;
				var t=0;
				for (var f=0;f<files;f++) {
					if (selectedFiles[f]==true) {
						CURRENT_TASKS[t]=new Array(); // first dimension is the sample
						CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
						CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="delete_file";
						CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
						CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["todelete"]=myObj["datapath"][f];
						CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Deleting file...";
						CURRENT_TASK_SAMPLE++;
						t++
					}
				}
			}
		}
		else { // delete single or multiple files
			var nn=0;
			var t=0;
			for (var i=0;i<paths.length;i++) {
				var path = paths[i]
				CURRENT_TASKS[t]=new Array(); // first dimension is the sample
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]=new Object();
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["command"]="delete_file";
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]=new Object();
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["data"]["todelete"]=path;
				CURRENT_TASKS[CURRENT_TASK_SAMPLE][nn]["bottomMessage"]="Deleting file...";
				CURRENT_TASK_SAMPLE++;
				t++
			}
		}
		var stepCaptions=new Array();
		for (var f=0;f<CURRENT_TASKS.length;f++) {
			stepCaptions[f]=basename(CURRENT_TASKS[f][0]["data"]["todelete"]);
			for (var ff=0;ff<CURRENT_TASKS[f].length;ff++) {
				if (!CURRENT_TASKS[f][ff]["bottomMessage"]) {
					CURRENT_TASKS[f][ff]["bottomMessage"]="--BOTTOM MESSAGE--";
				}
			}
		}
		hideContent(initStepsDialog("Preparing to delete files...","Deleted", stepCaptions, "default", true));
		CURRENT_TASK_SAMPLE=0;
		CURRENT_TASK_STEP=0;
		var ShinyObject=new Object();
		ShinyObject["action"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["command"];
		ShinyObject["data"]=CURRENT_TASKS[CURRENT_TASK_SAMPLE][CURRENT_TASK_STEP]["data"];
		nextStepInShiny(ShinyObject);
	}
}
