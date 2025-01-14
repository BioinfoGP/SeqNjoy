'use strict';

//var igvDiv = document.getElementById("igv-div");

var addThisTrack=
{
	"name": "NC_017671.1 genes",
	"url": "PROJECTS/P1639484224169/GFF/NC_017671.1.gff3",
	"order": 1000000,
	"indexed": false
}

var addTheseTracks=new Array();
addTheseTracks[0]={
	"name": "NC_017671.1 genes",
	"url": "PROJECTS/P1639484224169/GFF/NC_017671.1.gff3",
	"order": 1000000,
	"indexed": false
};

addTheseTracks[1]={
	"height":80,
	"maxHeight":80,
	"name": "paired1",
			
	"url": "PROJECTS/P1639484224169/ALIGNMENTS/11_12.align.bam",
	"indexURL": "PROJECTS/P1639484224169/ALIGNMENTS/11_12.align.bam.bai",
	"format": "bam",
	"colorBy": "firstOfPairStrand"	
};


var addThisBam =
{
	"height":80,
	"maxHeight":80,
	"name": "paired1",
			
	"url": "PROJECTS/P1639484224169/ALIGNMENTS/11_12.align.bam",
	"indexURL": "PROJECTS/P1639484224169/ALIGNMENTS/11_12.align.bam.bai",
	"format": "bam",
	"colorBy": "firstOfPairStrand"
		
};


var NC_017671_igv=
{
    "id": "NC_017671.1",
    "name": "NC_017671.1",
    "fastaURL": "PROJECTS/P1639484224169/FASTA/NC_017671.1.fasta",
    "indexURL": "PROJECTS/P1639484224169/FASTA/NC_017671.1.fasta.fai",
    "tracks": [
      {
        "name": "NC_017671.1 genes",
        "url": "PROJECTS/P1639484224169/GFF/NC_017671.1.gff3",
        "order": 1000000,
        "indexed": false
      }
    ]
}

var optionsIGV =
{
	genome: "bacteria",
	reference: NC_017671_igv,
	locus: "NC_017671.1:109284-110282",
	tracks: [
		{
			"height":80,
			"maxHeight":80,
			"name": "paired1",
			
			"url": "PROJECTS/P1639484224169/ALIGNMENTS/11_12.align.bam",
			"indexURL": "PROJECTS/P1639484224169/ALIGNMENTS/11_12.align.bam.bai",
			"format": "bam",
			"colorBy": "firstOfPairStrand"
		}
	]
};


function getGFFs(DataTable) {
	var gffSelect='';
	for (var key in DataTable) {
		if (DataTable.hasOwnProperty(key)) {
			var myObj=DataTable[key];
			var nElems=myObj["fname"].length;
			for(var i=0; i<nElems;i++){
				if(myObj["hidden"][i]=="NO"){				
					if(myObj["ftype"][i]=="gff"){
						gffSelect+='<option value="'+myObj["datapath"][i]+'" style="color:#000000;">'+myObj["fname"][i]+'</option>';
					}
				}
			}
		}
	}
	return (gffSelect);
}

function getBAMs(DataTable, fasta) {
	var bamSelect='';
	for (var key in DataTable) {
		if (DataTable.hasOwnProperty(key)) {
			var myObj=DataTable[key];
			var nElems=myObj["fname"].length;
			for(var i=0; i<nElems;i++){
				if(myObj["hidden"][i]=="NO"){
					if(myObj["ftype"][i]=="bam" && (myObj["dependencies"][i]=="ND" || myObj["dependencies"][i].match(new RegExp("/"+basename(fasta))))){
						if (myObj["description"][i].match(/single-end/)) {
							var bamType="single";
						}
						else {
							var bamType="paired";
						}
						bamSelect+='<option value="'+myObj["datapath"][i]+'&type='+bamType+'" style="color:#000000;">'+myObj["fname"][i]+'</option>';
					}
				}
			}
		}
	}
	return (bamSelect);
}



function loadIGVSelectedTracks(sel) {
	var urls=new Array();
	var types=new Array();
	for (var o=0;o<sel.options.length;o++) {
		if (sel.options[o].selected) {
			var selectValueTokens=sel.options[o].value.split("&type=");
			urls.push(selectValueTokens[0]);
			if (selectValueTokens[1]) {
				types.push(selectValueTokens[1]);
			}
			else {
				types.push("none");
			}
		}
	}
	var trackList=new Array();
	for (var t=0;t<urls.length;t++) {
		if (urls[t]!==NOT_SELECTED) {
			trackList[t]=new Object();
			trackList[t].id="PEPE";
			trackList[t].url="PROJECTS/"+CURRENT_PROJECT_ID+"/"+urls[t];
			trackList[t].indexed=false;
			trackList[t].order=1000000;
			if (urls[t].match(/\.bam$/)) {
				trackList[t].indexed=true;
				trackList[t].indexURL="PROJECTS/"+CURRENT_PROJECT_ID+"/"+urls[t]+".bai";
				trackList[t].height=80;
				trackList[t].maxHeight=80;
				trackList[t].displayMode="squished";
				if (types[t]=="paired") {
					trackList[t].colorBy="firstOfPairStrand";
				}
				else {
					trackList[t].colorBy="strand";
				}
			}
			else if (urls[t].match(/\.gtf$/)) {
				trackList[t].searchable=true;
				trackList[t].indexed=true;
				trackList[t].url="PROJECTS/"+CURRENT_PROJECT_ID+"/"+urls[t].replace(/\.gtf$/,"")+".sorted.gtf.bgz";
				trackList[t].indexURL=trackList[t].url+".tbi";
			}
			else if (urls[t].match(/\.gff3?$/)) {
				trackList[t].searchable=true;
				trackList[t].indexed=true;
				trackList[t].url="PROJECTS/"+CURRENT_PROJECT_ID+"/"+urls[t].replace(/\.gff3?$/,"")+".sorted.gff3.bgz";
				trackList[t].indexURL=trackList[t].url+".tbi";
			}

		}
	}
	igvBrowser.loadTrackList(trackList);
}


var IGV=new Object();
var igvBrowser;
function open_browser(igvDiv, bamFiles, fastaFile, annotFile) {
	IGV.trackHeight=80;
	IGV.pairedBamColorBy="firstOfPairStrand";
	IGV.singleBamColorBy="strand";
	var bamOptions=getBAMs(DataTable, fastaFile);
	if (bamOptions=="") {
		_$("IGV_available_bam").setAttribute("disabled","disabled");
	}
	else {
		_$("IGV_available_bam").removeAttribute("disabled");
	}
	_$("IGV_available_bam").innerHTML="<option selected value="+NOT_SELECTED+">Select bam</option>"+bamOptions;


	var gffOptions=getGFFs(DataTable);
	if (gffOptions=="") {
		_$("IGV_available_gff").setAttribute("disabled","disabled");
	}
	else {
		_$("IGV_available_gff").removeAttribute("disabled");
	}
	_$("IGV_available_gff").innerHTML="<option selected value="+NOT_SELECTED+">Select gff</option>"+gffOptions;

	var options=new Object();
//	options.genome="hg38";
	options.reference=new Object();
	options.reference.id="---";
	options.reference.name="????";
	if (fastaFile!=="none") {
		options.reference.fastaURL=fastaFile;
		options.reference.indexURL=fastaFile+".fai";
	}
	if (annotFile!=="none") {
		options.reference.tracks=new Object();
		//options.reference.tracks.name="PEPE";
		options.reference.tracks.url=annotFile;
		options.reference.tracks.order=10000000;
		if (annotFile.match(/\.gtf$/)) {
			options.reference.tracks.indexed=true;
			options.reference.tracks.url=annotFile+".exported.gtf.bgz";
			options.tracks[b].indexURL=annotFile+".exported.gtf.bgz.tbi";
			options.reference.tracks.searchable=true;
		}
		else if(annotFile.match(/\.gff3?$/)) {
			options.reference.tracks.indexed=true;
			options.reference.tracks.url=annotFile+".exported.gff3.bgz";
			options.tracks[b].indexURL=annotFile+".exported.gff3.bgz.tbi";
			options.reference.tracks.searchable=true;
		}
	}
	if (bamFiles!=="none") {
		options.tracks=new Array();
		var BF=bamFiles.split(" @@ ");
		for (var b=0;b<BF.length;b++) {
			var BTokens=BF[b].split("&type=");
			options.tracks[b]=new Object();
			options.tracks[b].height=IGV.trackHeight;
			options.tracks[b].maxHeight=IGV.trackHeight;
			//options.tracks[b].name="PEPE";
			options.tracks[b].url=BTokens[0];
			options.tracks[b].indexURL=BTokens[0]+".bai";
			options.tracks[b].format="bam";
			if (BTokens[1]=="single") {
				options.tracks[b].colorBy=IGV.singleBamColorBy;
			}
			else {
				options.tracks[b].colorBy=IGV.pairedBamColorBy;
			}
			options.tracks[b].displayMode="squished";
		}
	}
	_$(igvDiv).style.display="block";
	_$("ModalCourtainDark").style.display="block";
	_$("igv_div_container").style.display="block";
	igv.createBrowser(_$(igvDiv), options).then (
		function (browser) {
			igvBrowser=browser;
			console.log("Created IGV browser");
		}
	)
}

function close_igv() {
	_$("ModalCourtainDark").style.display="none";
	_$("igv_div_container").style.display="none";
	igv.removeBrowser(igvBrowser);
}





function open_browser_in_window(igvDiv, bamFiles, fastaFile, annotFile) {
	var html=`<html>
	<script src="js/igv.js"></script>
	<body>
		<table border="0px" cellpadding="0px" cellspacing="0px" style="width:100%;height:100%;background:#EFEFEF;">
			<tr>
				<td style="padding-left:1rem;padding-right:1rem;padding-top:1rem;padding-bottom:0rem;white-space:nowrap;">
					Add tracks: <select id="IGV_available_bam" onchange="loadIGVSelectedTracks(this);"></select>
					<select id="IGV_available_gff" onchange="loadIGVSelectedTracks(this);"></select>
				</td>
				<td style="text-align:right;padding-bottom:0rem;padding-right:1rem;padding-top:1rem;padding-left:1rem;"><button class="miniCloseButton" onclick="close_igv();">X</button></td>
			</tr>
			<tr>
				<td colspan=2 style="height:100%;padding-left:1rem;padding-right:1rem;padding-bottom:1rem;padding-top:0.5rem;">
					<div id="igv-div" class="igv_div"></div>
				</td>
			</tr>
		</table>
	</body>
</html>`;

	
	
	IGV.trackHeight=80;
	IGV.pairedBamColorBy="firstOfPairStrand";
	IGV.singleBamColorBy="strand";
	var bamOptions=getBAMs(DataTable, fastaFile);
	if (bamOptions=="") {
		_$("IGV_available_bam").setAttribute("disabled","disabled");
	}
	else {
		_$("IGV_available_bam").removeAttribute("disabled");
	}
	_$("IGV_available_bam").innerHTML="<option selected value="+NOT_SELECTED+">Select bam</option>"+bamOptions;


	var gffOptions=getGFFs(DataTable);
	if (gffOptions=="") {
		_$("IGV_available_gff").setAttribute("disabled","disabled");
	}
	else {
		_$("IGV_available_gff").removeAttribute("disabled");
	}
	_$("IGV_available_gff").innerHTML="<option selected value="+NOT_SELECTED+">Select gff</option>"+gffOptions;

	var options=new Object();
//	options.genome="hg38";
	options.reference=new Object();
	options.reference.id="---";
	options.reference.name="????";
	if (fastaFile!=="none") {
		options.reference.fastaURL=fastaFile;
		options.reference.indexURL=fastaFile+".fai";
	}
	if (annotFile!=="none") {
		options.reference.tracks=new Object();
		//options.reference.tracks.name="PEPE";
		options.reference.tracks.url=annotFile;
		options.reference.tracks.order=10000000;
		if (annotFile.match(/\.gtf$/)) {
			options.reference.tracks.indexed=true;
			options.reference.tracks.url=annotFile+".exported.gtf.bgz";
			options.tracks[b].indexURL=annotFile+".exported.gtf.bgz.tbi";
			options.reference.tracks.searchable=true;
		}
		else if(annotFile.match(/\.gff3?$/)) {
			options.reference.tracks.indexed=true;
			options.reference.tracks.url=annotFile+".exported.gff3.bgz";
			options.tracks[b].indexURL=annotFile+".exported.gff3.bgz.tbi";
			options.reference.tracks.searchable=true;
		}
	}
	if (bamFiles!=="none") {
		options.tracks=new Array();
		var BF=bamFiles.split(" @@ ");
		for (var b=0;b<BF.length;b++) {
			var BTokens=BF[b].split("&type=");
			options.tracks[b]=new Object();
			options.tracks[b].height=IGV.trackHeight;
			options.tracks[b].maxHeight=IGV.trackHeight;
			//options.tracks[b].name="PEPE";
			options.tracks[b].url=BTokens[0];
			options.tracks[b].indexURL=BTokens[0]+".bai";
			options.tracks[b].format="bam";
			if (BTokens[1]=="single") {
				options.tracks[b].colorBy=IGV.singleBamColorBy;
			}
			else {
				options.tracks[b].colorBy=IGV.pairedBamColorBy;
			}
			options.tracks[b].displayMode="squished";
		}
	}
	_$(igvDiv).style.display="block";
	_$("ModalCourtainDark").style.display="block";
	_$("igv_div_container").style.display="block";
	igv.createBrowser(_$(igvDiv), options).then (
		function (browser) {
			igvBrowser=browser;
			console.log("Created IGV browser");
		}
	)
}
