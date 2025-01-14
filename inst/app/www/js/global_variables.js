'use strict';

var EnsemblVersion="";
var EnsemblGenomesVersion="";
var EnsemblTable=new Object();

var DataTable=new Object();


var ALL_PROJECTS=new Object(); // passed in json format from server
var CURRENT_PROJECT_ID="";
var CURRENT_PROJECT_INDEX=0;
var CURRENT_PROJECT_PATH="";

var NOT_SELECTED="NO_OPTION_SELECTED";

var SCT=0;

var PARAMS=new Object();
var ARGS=new Object();

const MyNumberFormat = new Intl.NumberFormat('en-US');

/// Global objects to send data to the Shiny server
var JSShinyDetails=new Object();
var AlignmentQueue=new Object();
var TrimQueue=new Object();
var QuantifyQueue=new Object();
var ExpressionQueue=new Object();
var showHiddenFiles=true;
var showAuxFiles=true;
var FeaturesTable=new Object();

var FileOptionsDivDisplay="none";
var hideFileType=new Array();

var selectedFiles=new Array();
var selectedFileTypes=new Object();
var nSelectedWithChildren=0;
var nSelectedWithNoChildren=0;

var showingFile=new Array();

var ReturnMessage=new Object();

var currentSortBy="fcreated";
var currentSortSense=1;

var ensKingdoms=new Array();
var genomeSelect=new Array();
var DownloadGenomeFiles=new Object();

var fastqSelect=new Array();
var fastaSelect=new Array();
var bamSelect=new Array();
var gffSelect=new Array();
var featureSelect="";
var blockSelect="";
var countSelect=new Object();
var selectedCountFolder="";

var genomeSelectHTML=new Array();
var fastqSelectHTML="";
var fastaSelectHTML="";
var bamSelectHTML="";
var gffSelectHTML="";
var countSelectHTML="";



var ProjectData=new Object();

var SeqNjoy=new Array();

SeqNjoy.COLOR=["#FF0000","#00FF00","#0000FF","#FFFF00","#FF00FF","#00FFFF","#800000","#008000"
             ,"#000080","#808000","#800080","#008080","#C0C0C0","#808080","#9999FF","#993366"
             ,"#FFFFCC","#CCFFFF","#660066","#FF8080","#0066CC","#CCCCFF","#000080","#FF00FF"
             ,"#FFFF00","#00FFFF","#800080","#800000","#008080","#0000FF","#00CCFF","#CCFFFF"
             ,"#CCFFCC","#FFFF99","#99CCFF","#FF99CC","#CC99FF","#FFCC99","#3366FF","#33CCCC"
             ,"#99CC00","#FFCC00","#FF9900","#FF6600","#666699","#969696","#003366","#339966"
             ,"#003300","#333300","#993300","#993366","#333399","#333333"];	

SeqNjoy.DEFAULT_PLOT_PARAM=new Array();

SeqNjoy.DEFAULT_PLOT_PARAM.lineWidth         = 2;
SeqNjoy.DEFAULT_PLOT_PARAM.strokeStyle       = "#000000";
SeqNjoy.DEFAULT_PLOT_PARAM.MYU               = 64;
SeqNjoy.DEFAULT_PLOT_PARAM.MYD               = 112;
SeqNjoy.DEFAULT_PLOT_PARAM.MXL               = 128;
SeqNjoy.DEFAULT_PLOT_PARAM.MXR               = 64;
SeqNjoy.DEFAULT_PLOT_PARAM.xmax              = "auto";
SeqNjoy.DEFAULT_PLOT_PARAM.xmin              = "auto";
SeqNjoy.DEFAULT_PLOT_PARAM.ymax              = "auto";
SeqNjoy.DEFAULT_PLOT_PARAM.ymin              = "auto";
SeqNjoy.DEFAULT_PLOT_PARAM.yinv              = false;
SeqNjoy.DEFAULT_PLOT_PARAM.xinv              = false;
SeqNjoy.DEFAULT_PLOT_PARAM.stepXtic          = "auto";
SeqNjoy.DEFAULT_PLOT_PARAM.stepXtic2         = "auto";
SeqNjoy.DEFAULT_PLOT_PARAM.firstXtic         = "auto";
SeqNjoy.DEFAULT_PLOT_PARAM.stepYtic          = "auto";
SeqNjoy.DEFAULT_PLOT_PARAM.stepYtic2          = "auto";
SeqNjoy.DEFAULT_PLOT_PARAM.firstYtic         = "auto";
SeqNjoy.DEFAULT_PLOT_PARAM.bgPlot            = "#FFFFFF";
SeqNjoy.DEFAULT_PLOT_PARAM.bgPlot2           = "#F5F5F5";
SeqNjoy.DEFAULT_PLOT_PARAM.fontFamily        = "sans-serif";	
SeqNjoy.DEFAULT_PLOT_PARAM.fontStyle         = "normal";	
SeqNjoy.DEFAULT_PLOT_PARAM.xLabelFontStyle   = "normal";	
SeqNjoy.DEFAULT_PLOT_PARAM.yLabelFontStyle   = "normal";	
SeqNjoy.DEFAULT_PLOT_PARAM.titleFontStyle    = "normal";	
SeqNjoy.DEFAULT_PLOT_PARAM.fontSizePX        = 30;	
SeqNjoy.DEFAULT_PLOT_PARAM.xLabelRelFontSize = 8;	
SeqNjoy.DEFAULT_PLOT_PARAM.yLabelRelFontSize = 8;	
SeqNjoy.DEFAULT_PLOT_PARAM.titleRelFontSize  = 8;	
SeqNjoy.DEFAULT_PLOT_PARAM.radius            = "auto";
SeqNjoy.DEFAULT_PLOT_PARAM.bgFrame           = "#EEEEEE";
SeqNjoy.DEFAULT_PLOT_PARAM.fgFrame           = "#D4D0C8";
SeqNjoy.DEFAULT_PLOT_PARAM.textColor         = "#000000";	
SeqNjoy.DEFAULT_PLOT_PARAM.cxMargin          = 24;
SeqNjoy.DEFAULT_PLOT_PARAM.cyMargin          = 24;
SeqNjoy.DEFAULT_PLOT_PARAM.xLabel            = "Default X Label";
SeqNjoy.DEFAULT_PLOT_PARAM.yLabel            = "Default Y Label";
SeqNjoy.DEFAULT_PLOT_PARAM.title             = "Default Title";
SeqNjoy.DEFAULT_PLOT_PARAM.titleAlign        = "center";


SeqNjoy.FileTypeColor=new Array();
SeqNjoy.FileTypeColor["fastq"]="hsl(0,100%,30%)";
SeqNjoy.FileTypeColor["bam"]="hsl(50,100%,30%)";
SeqNjoy.FileTypeColor["fasta"]="hsl(100,100%,30%)";
SeqNjoy.FileTypeColor["gff"]="hsl(170,100%,30%)";
SeqNjoy.FileTypeColor["ann"]="hsl(200,100%,30%)";
SeqNjoy.FileTypeColor["counts"]="hsl(250,100%,30%)";
SeqNjoy.FileTypeColor["diffexp"]="hsl(300,100%,30%)";

SeqNjoy.FileTypeColorDark=new Array();
SeqNjoy.FileTypeColorDark["fastq"]="hsl(0,100%,15%)";
SeqNjoy.FileTypeColorDark["bam"]="hsl(50,100%,15%)";
SeqNjoy.FileTypeColorDark["fasta"]="hsl(100,100%,15%)";
SeqNjoy.FileTypeColorDark["gff"]="hsl(170,100%,15%)";
SeqNjoy.FileTypeColorDark["ann"]="hsl(200,100%,15%)";
SeqNjoy.FileTypeColorDark["counts"]="hsl(250,100%,15%)";
SeqNjoy.FileTypeColorDark["diffexp"]="hsl(300,100%,15%)";



