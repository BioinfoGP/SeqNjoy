

server <- function(input,output, session) {
	source("staticServer.R")
### Globals and reactive
	systemVolumes <<- c(Home = fs::path_home(), shinyFiles::getVolumes()())
	NOT_SELECTED = "_NONE_"
	
	shinyjs::runjs(paste0("NOT_SELECTED = `",NOT_SELECTED,"`;"))
	## separator between items in the Dependencies fields of the Files file.
	#dependSep<-';'
	dependSep<<-'@@'

	## set debug level:
	# 0<-No stop, show screen  message for errors and warnings.
	# 1<-No stop, show screen message only for errors.
	# 2<-Stop only on errors, do not show screen message on warnings.

#	finnyDEBUG <<- 2

	functionalities <<- c(
		 "JSN_SeriesDetails"
		,"JSN_PlotDetails"
		,"initFIESTAviewer"
		,"populateFIESTAui"
		,"ExitSeqNjoy"
		,"OpenVignette"
		,"showLog"
		,"viewFile"
		,"deleteProject"
		,"startNewProject"
		,"loadProjectsFromHomeDir"
		,"openProject"
		,"openProjectFromDir"
		,"changeProjectName"
		,"checkGenomeAvailability"
		,"EnsemblReload"
		,"processAlignmentQueue"    # to be removed
		,"processTrimQueue"         # to be removed
		,"deleteFiles" # to remove
		,"viewFiles"
		,"loadGFFfeatures"
		,"processQuantifyQueue"     # to be removed
		,"processExpressionQueue"   # to be removed
		,"filter_with_filterAndTrim"
		,"align_with_bowtie2"
		,"align_with_hisat2"
		,"align_with_alignRsubread"
		,"removedups_with_removeDupReads"
		,"quantify_with_featureCounts"
		,"compare_with_DESeq2"
		,"compare_with_edgeR"
		,"download_this_file"
		,"initialize_this_file"
		,"create_accessory_files_for_this_one"
		,"add_this_file_to_project"
		,"initialize_FASTQ_file"
		,"create_accessory_files_for_FASTQ"
		,"add_FASTQ_to_project"
		,"initialize_FASTA_file"
		,"create_accessory_files_for_FASTA"
		,"add_FASTA_to_project"
		,"initialize_GFF_file"
		,"create_accessory_files_for_GFF"
		,"add_GFF_to_project"
		,"initialize_COUNTS_file"
		,"create_accessory_files_for_COUNTS"
		,"add_COUNTS_to_project"
		,"initialize_DIFFEXP_file"
		,"create_accessory_files_for_DIFFEXP"
		,"add_DIFFEXP_to_project"
		,"initialize_BAM_file"
		,"create_accessory_files_for_BAM"
		,"add_BAM_to_project"
		,"initialize_ANN_file"
		,"create_accessory_files_for_ANN"
		,"add_ANN_to_project"
		,"add_file_to_zip"
		,"add_file_to_zip_and_download_it"
		,"delete_file"
        ,"add_annots_in_ANN_format"
	)
	
	# FUNCTION PARAMS
	
	setFunctionParams<-function(file) {
		raw_content <- paste(readLines(file), collapse="\n")
		cleaned_content<- gsub("\\s{2,}","\t",raw_content)
		return(utils::read.table(text=cleaned_content, sep="\t", header=TRUE, quote="", comment.char="#"))
	}
	
	PARAMS_filterAndTrim<<-setFunctionParams("filterAndTrim.params.txt")
	json<-RJSONIO::toJSON(PARAMS_filterAndTrim,.escapeEscapes = FALSE)
	shinyjs::runjs(paste0("PARAMS[`filter_with_filterAndTrim`]=",json,";PARAMS[`filter_with_filterAndTrim`][`FORM_ERRORS`]=0;PARAMS[`filter_with_filterAndTrim`][`INPUT_FILES`]=0;"))

	PARAMS_bowtie2<<-setFunctionParams("bowtie2.params.txt")
	json<-RJSONIO::toJSON(PARAMS_bowtie2,.escapeEscapes = FALSE)
	shinyjs::runjs(paste0("PARAMS[`align_with_bowtie2`]=",json,";PARAMS[`align_with_bowtie2`][`FORM_ERRORS`]=0;PARAMS[`align_with_bowtie2`][`INPUT_FILES`]=0;"))

	PARAMS_hisat2<<-setFunctionParams("hisat2.params.txt")
	json<-RJSONIO::toJSON(PARAMS_hisat2,.escapeEscapes = FALSE)
	shinyjs::runjs(paste0("PARAMS[`align_with_hisat2`]=",json,";PARAMS[`align_with_hisat2`][`FORM_ERRORS`]=0;PARAMS[`align_with_hisat2`][`INPUT_FILES`]=0;"))

	PARAMS_alignRsubread<<-setFunctionParams("alignRsubread.params.txt")
	json<-RJSONIO::toJSON(PARAMS_alignRsubread,.escapeEscapes = FALSE)
	shinyjs::runjs(paste0("PARAMS[`align_with_alignRsubread`]=",json,";PARAMS[`align_with_alignRsubread`][`FORM_ERRORS`]=0;PARAMS[`align_with_alignRsubread`][`INPUT_FILES`]=0;"))

	PARAMS_removeDupReads<<-setFunctionParams("removeDupReads.params.txt")
	json<-RJSONIO::toJSON(PARAMS_removeDupReads,.escapeEscapes = FALSE)
	shinyjs::runjs(paste0("PARAMS[`removedups_with_removeDupReads`]=",json,";PARAMS[`removedups_with_removeDupReads`][`FORM_ERRORS`]=0;PARAMS[`removedups_with_removeDupReads`][`INPUT_FILES`]=0;"))
	
	PARAMS_featureCounts<<-setFunctionParams("featureCounts.params.txt")
	json<-RJSONIO::toJSON(PARAMS_featureCounts,.escapeEscapes = FALSE)
	shinyjs::runjs(paste0("PARAMS[`quantify_with_featureCounts`]=",json,";PARAMS[`quantify_with_featureCounts`][`FORM_ERRORS`]=0;PARAMS[`quantify_with_featureCounts`][`INPUT_FILES`]=0;"))
	
	PARAMS_DESeq2<<-setFunctionParams("DESeq2.params.txt")
	json<-RJSONIO::toJSON(PARAMS_DESeq2,.escapeEscapes = FALSE)
	shinyjs::runjs(paste0("PARAMS[`compare_with_DESeq2`]=",json,";PARAMS[`compare_with_DESeq2`][`FORM_ERRORS`]=0;PARAMS[`compare_with_DESeq2`][`INPUT_FILES`]=0;"))
	
	PARAMS_edgeR<<-setFunctionParams("edgeR.params.txt")
	json<-RJSONIO::toJSON(PARAMS_edgeR,.escapeEscapes = FALSE)
	shinyjs::runjs(paste0("PARAMS[`compare_with_edgeR`]=",json,";PARAMS[`compare_with_edgeR`][`FORM_ERRORS`]=0;PARAMS[`compare_with_edgeR`][`INPUT_FILES`]=0;"))

	PARAMS_addAnnots<<-setFunctionParams("addAnnots.params.txt")
	json<-RJSONIO::toJSON(PARAMS_addAnnots,.escapeEscapes = FALSE)
	shinyjs::runjs(paste0("PARAMS[`add_annots_in_ANN_format`]=",json,";PARAMS[`add_annots_in_ANN_format`][`FORM_ERRORS`]=0;PARAMS[`add_annots_in_ANN_format`][`INPUT_FILES`]=0;"))

	
	loadProjectsFromHomeDir<-function(){
		currentProjects <<- data.frame(
				id=character()
				,status=character()
				,started=character()
				,accessed=character()
				,datapath=character()
				,description=character()
				,stringsAsFactors=F
		)			
		
		if(dir.exists(home_dir)){			
			potentialProjects<-list.dirs(path = home_dir, full.names = TRUE, recursive = FALSE)			
			validProjects<-c()
			for(r in potentialProjects){
				if(file.exists(paste0(r,"/",projectFileName))){
					recentP<-utils::read.table(paste0(r,"/",projectFileName),sep="\t",header=T,stringsAsFactors = FALSE,row.names = NULL)
					recentP$datapath<-r
					currentProjects<<-rbind(currentProjects,recentP)
					validProjects<-c(validProjects,r)
					
				} 
			}
			writeLines(home_dir,config_file)
		}
	}


	myDfFiles <- reactiveValues(
		files=data.frame(fname=character()
			,fsize=character()
			,ftype=character()
			,datapath=character()
			,fcreated=character()
			,viewfiles=character()
			,dependencies=character()
			,description=character()
			,hidden=character()
			,md5=character()
			,stringsAsFactors=F
		)
	)
	

	
	######################### DOWNLOAD GENOMES FROM ENSEMBL
	list_ftpdir<-function(siteURL) {
		tryCatch(
			{RCurl::getURL(siteURL,ftp.use.epsv = FALSE,dirlistonly = TRUE,forbid.reuse = TRUE,.encoding = "UTF-8")}
			, error = function(e) {""}
		)
	}

	read_ftpfile<-function(siteURL) {
		tryCatch(
			{RCurl::getURL(siteURL,ftp.use.epsv = FALSE,forbid.reuse = TRUE,.encoding = "UTF-8")}
			, error = function(e) {""}
		)
	}
	
	## ENSEMBL FUNCTIONS
	ensemblURL<<-"ftp://ftp.ensembl.org"
	
	checkEnsemblOnline<-function(){
		baseURL<-ensemblURL
		versionURL<-paste0(baseURL,"/pub/VERSION")
		if(RCurl::url.exists(versionURL)){
			versionData<-readLines(versionURL)
			if(exists("versionData") && as.numeric(versionData)>0){
				return(versionData)
			} else {
				return("")
			}
		} else {
			return("")
		}
	}

	getEnsemblSpeciesTable<-function(currentRelease){
		baseURL<-ensemblURL
		speciesFile<-paste0(baseURL,"/pub/release-",currentRelease,"/species_EnsemblVertebrates.txt")
		availableSpecies<-data.frame(NAME=character(),SPECIES=character(),FASTA=character(),GFF=character(),GTF=character(), COLLECTION=character())
		if(RCurl::url.exists(speciesFile)){
			tryCatch({
				species_data<-read.delim(text=read_ftpfile(speciesFile), sep="\t", header=T, quote="",comment.char = "",row.names=NULL)
				colnames(species_data)<-c(colnames(species_data)[-1],"EXTRA")

				collection_data<-gsub("_core.+$","",species_data$core_db)
				collection_data[!grepl("_collection",collection_data)]<-""

				availableSpecies<-data.frame(NAME=species_data[,1],SPECIES=species_data[,2],FASTA=rep("TRUE",nrow(species_data)),GFF=rep("TRUE",nrow(species_data)),GTF=rep("TRUE",nrow(species_data)), COLLECTION=collection_data)
			}, error = function(e) {""});
		}
		return(availableSpecies)

		
	}
	

	checkEnsemblFiles<-function(availableGenomes,genomeName,currentRelease){
		baseURL<-ensemblURL
		fastaName<-""
		gffName<-""
		gtfName<-""
		
		tryCatch({
		
			fastaURL=paste0(baseURL,"/pub/release-",currentRelease,"/fasta/",genomeName,"/dna/")
			fastaList<-strsplit(list_ftpdir(fastaURL),"[\r\n]+")[[1]]
			primaryAvailable<-any(grepl("\\.dna.primary_assembly\\.fa\\.gz",fastaList))
			topLevelAvailable<-any(grepl("\\.dna.toplevel\\.fa\\.gz",fastaList))

			if(primaryAvailable==TRUE){
				fastaName<-fastaList[grep("\\.dna.primary_assembly\\.fa\\.gz",fastaList)]
			} else if(topLevelAvailable==TRUE) {
				fastaName<-fastaList[grep("\\.dna.toplevel\\.fa\\.gz",fastaList)]
			} 

			gffURL<-paste0(baseURL,"/pub/release-",currentRelease,"/gff3/",genomeName,"/")
			gffList<-strsplit(list_ftpdir(gffURL),"[\r\n]+")[[1]]
			gffAvailable<-any(grepl(paste0(currentRelease,"\\.gff3\\.gz"),gffList))
			if(gffAvailable==TRUE){
				gffName<-gffList[grepl(paste0(currentRelease,"\\.gff3\\.gz"),gffList)]
			}
			
			gtfURL<-paste0(baseURL,"/pub/release-",currentRelease,"/gtf/",genomeName,"/")
			gtfList<-strsplit(list_ftpdir(gtfURL),"[\r\n]+")[[1]]
			gtfAvailable<-any(grepl(paste0(currentRelease,"\\.gtf\\.gz"),gtfList))
			if(gtfAvailable==TRUE){
				gtfName<-gtfList[grepl(paste0(currentRelease,"\\.gtf\\.gz"),gtfList)]
			}
		}, error = function(e) {""})		
		return(data.frame(SPECIES=c(genomeName),FASTA=c(fastaName),GFF=c(gffName),GTF=c(gtfName), fastaURL=c(fastaURL), gffURL=c(gffURL), gtfURL=c(gtfURL),tempFolder=paste0(projectDir,"/temp/")))	

	}	

	## ENSEMBL GENOMES FUNCTIONS
	ensemblGenomesURL<<-"ftp://ftp.ensemblgenomes.org"

	checkEnsemblGenomesOnline<-function(){
		baseURL<-ensemblGenomesURL
		versionURL<-paste0(baseURL,"/pub/VERSION")
		if(RCurl::url.exists(versionURL)){
			versionData<-readLines(versionURL)
			if(exists("versionData") && as.numeric(versionData)>0){
				return(versionData)
			} else {
				return("")
			}
		} else {
			return("")
		}

	}

	getEnsemblGenomesAllSpeciesTable<-function(currentRelease){
		baseURL<-ensemblGenomesURL
		availableAllSpecies<-list()
		
		speciesFile<-paste0(baseURL,"/pub/release-",currentRelease,"/species.txt")
		if(RCurl::url.exists(speciesFile)){
			tryCatch({
				species_all<-read.delim(text=read_ftpfile(speciesFile), sep="\t", header=T, quote="",comment.char = "",row.names=NULL)
				colnames(species_all)<-c(colnames(species_all)[-1],"EXTRA")
				
				kingdoms<-tolower(gsub("Ensembl","",unique(species_all$division)))
				
				for (kingdom in kingdoms){
					species_data<-species_all[species_all$division == paste0("Ensembl",toupper(substr(kingdom, 1, 1)),substring(kingdom, 2)),]
					collection_data<-gsub("_core.+$","",species_data$core_db)
					collection_data[!grepl("_collection",collection_data)]<-""
					availableAllSpecies[[kingdom]]<-data.frame(NAME=species_data[,1],SPECIES=species_data$species,FASTA=rep("TRUE",nrow(species_data)),GFF=rep("TRUE",nrow(species_data)),GTF=rep("TRUE",nrow(species_data)), COLLECTION=collection_data)
				}
			}, error = function(e) {""})
		}
		return(availableAllSpecies)
	}

		

	checkEnsemblGenomesFiles<-function(availableGenomes,kingdom,genomeName,currentRelease){
		baseURL<-ensemblGenomesURL
		fastaName<-""
		gtfName<-""
		gffName<-""
		tryCatch({
			fastaURL<-paste0(baseURL,"/pub/",kingdom,"/release-",currentRelease,"/fasta/",availableGenomes[availableGenomes$SPECIES==genomeName,]$COLLECTION,"/",genomeName,"/dna/")
			fastaList<-strsplit(list_ftpdir(fastaURL),"[\r\n]+")[[1]]
			primaryAvailable<-any(grepl("\\.dna.primary_assembly\\.fa\\.gz",fastaList))
			topLevelAvailable<-any(grepl("\\.dna.toplevel\\.fa\\.gz",fastaList))

			if(primaryAvailable==TRUE){
				fastaName<-fastaList[grep("\\.dna.primary_assembly\\.fa\\.gz",fastaList)]
			} else if(topLevelAvailable==TRUE) {
				fastaName<-fastaList[grep("\\.dna.toplevel\\.fa\\.gz",fastaList)]
			} 

			gffURL<-paste0(baseURL,"/pub/",kingdom,"/release-",currentRelease,"/gff3/",availableGenomes[availableGenomes$SPECIES==genomeName,]$COLLECTION,"/",genomeName,"/")
			gffList<-strsplit(list_ftpdir(gffURL),"[\r\n]+")[[1]]
			gffAvailable<-any(grepl(paste0(currentRelease,"\\.gff3\\.gz"),gffList))
			if(gffAvailable==TRUE){
				gffName<-gffList[grepl(paste0(currentRelease,"\\.gff3\\.gz"),gffList)]
			}

			gtfURL<-paste0(baseURL,"/pub/",kingdom,"/release-",currentRelease,"/gtf/",availableGenomes[availableGenomes$SPECIES==genomeName,]$COLLECTION,"/",genomeName,"/")
			gtfList<-strsplit(list_ftpdir(gtfURL),"[\r\n]+")[[1]]
			gtfAvailable<-any(grepl(paste0(currentRelease,"\\.gtf\\.gz"),gtfList))
			if(gtfAvailable==TRUE){
				gtfName<-gtfList[grepl(paste0(currentRelease,"\\.gtf\\.gz"),gtfList)]
			}
		}, error = function(e) {""})
		return(data.frame(SPECIES=c(genomeName),FASTA=c(fastaName),GFF=c(gffName),GTF=c(gtfName), fastaURL=c(fastaURL), gffURL=c(gffURL), gtfURL=c(gtfURL),tempFolder=paste0(projectDir,"/temp/")))	
		
	}

	checkGenomeAvailability<-function(newData){
		checkKingdom<-newData[["kingdom"]] 
		checkSpecies<-newData[["species"]]
		genomeFiles<-data.frame(SPECIES=c(""),FASTA=c(""),GFF=c(""),GTF=c(""), fastaURL=c(""), gffURL=c(""), gtfURL=c(""),tempFolder=paste0(projectDir,"/temp/"))
		if(checkKingdom == "vertebrates"){
			if(RCurl::url.exists(ensemblURL)){
				genomeFiles<-checkEnsemblFiles(availableEnsGenomes[[checkKingdom]],checkSpecies,ensVersion)
			} else{
				return(EnsemblReload())
			}
		} else {
			if(RCurl::url.exists(ensemblGenomesURL)){			
				genomeFiles<-checkEnsemblGenomesFiles(availableEnsGenomes[[checkKingdom]],checkKingdom,checkSpecies,ensGenomesVersion)
			} else {
				return(EnsemblReload())
			}
		}

		# message(paste0("Checked files ",genomeFiles))

		outGenomeFilesText<-RJSONIO::toJSON(list(genomefiles=genomeFiles),.escapeEscapes = FALSE)
		shinyjs::runjs(paste0("DownloadGenomeFiles=",outGenomeFilesText,";updateGenomeAvailability();"))		

	}
	
	
	ensemblCheck<-function(){
		ensGenomesVersion<<-checkEnsemblGenomesOnline()
		if(ensGenomesVersion != ""){
			availableEnsGenomes<<-getEnsemblGenomesAllSpeciesTable(ensGenomesVersion)
		} else {
			availableEnsGenomes<<-list()
		}
		
		ensVersion<<-checkEnsemblOnline()
		if(ensVersion != ""){
			availableEnsGenomes[["vertebrates"]]<<-getEnsemblSpeciesTable(ensVersion)		
		}
				
		message(paste0("Ensemble version is:",ensVersion))
		message(paste0("Ensemble Genomes version is:",ensGenomesVersion))
		if(length(availableEnsGenomes)==0){
			shinyjs::runjs(paste0("EnsemblVersion='",ensVersion,"';EnsemblGenomesVersion='",ensGenomesVersion,"';EnsemblTable= new Object();"))
		} else {
			outEnsemblText<-RJSONIO::toJSON(availableEnsGenomes,.escapeEscapes = FALSE)
			# message(outEnsemblText)	
			shinyjs::runjs(paste0("EnsemblVersion='",ensVersion,"';EnsemblGenomesVersion='",ensGenomesVersion,"';EnsemblTable=",outEnsemblText,";"))
		}
	}
	
	
	EnsemblReload<-function(newData){
		ensemblCheck()
		shinyjs::runjs(paste0("renderDownloadGenomesTab();"))

	}
	

	ensGenomesVersion<<-""
	ensVersion<<-""
	ensemblCheck()	
	
	######################### END DOWNLOAD GENOMES FROM ENSEMBL		
	
	projectFileName<<-"SeqNjoyProject.snj"

	fileTypes<-data.frame(ftype=character(),fname=character(),folder=character(),extensions=character(),stringsAsFactors=F)
	fileTypes[nrow(fileTypes)+1,]<-c("fasta","fasta","FASTA","fa fa.gz fasta fasta.gz fna fna.gz")
	fileTypes[nrow(fileTypes)+1,]<-c("gff","gff","GFF","gff gff.gz gtf gtf.gz gff3 gff3.gz")
	fileTypes[nrow(fileTypes)+1,]<-c("fastq","fastq","FASTQ","fastq fastq.gz fq fq.gz")
	fileTypes[nrow(fileTypes)+1,]<-c("bam","bam","ALIGNMENTS","bam sam")
	fileTypes[nrow(fileTypes)+1,]<-c("counts","counts","COUNTS","count counts count.gz counts.gz")
	fileTypes[nrow(fileTypes)+1,]<-c("ann","ann","ANNOTS","ann ann.xls ann.xlsx ann.txt ann.tsv ann.tab")
	fileTypes[nrow(fileTypes)+1,]<-c("diffexp","diffexp","DIFFEXP","xlsx")

	finny_dir<<-getwd()
	home_dir<<-""
	config_file <<- fs::path_home(".SeqNjoy")	
	if(base::file.exists(config_file)){
		currentPath <- readLines(config_file)
		if(base::dir.exists(currentPath)){
			home_dir<<-currentPath
		}
	}	
	
	
	loadProjectsFromHomeDir()

	json<-RJSONIO::toJSON(currentProjects,.escapeEscapes = FALSE)
	shinyjs::runjs(paste0("updateProjectsList(`",json,"`);setCurrentProjectsDir(`",home_dir,"`);"))
	
	shinyFiles::shinyDirChoose(input,'ChangeProjects_DirButton',roots=systemVolumes,session=session,defaultRoot="Home")

	# print("Active file systems:")
	# print(systemVolumes)
	shiny::observeEvent(input$ChangeProjects_DirButton, {
		# print(shinyFiles::parseDirPath(systemVolumes, input$ChangeProjects_DirButton))
		newPath<-shinyFiles::parseDirPath(systemVolumes, input$ChangeProjects_DirButton)
		if(length(newPath) >0){
			home_dir<<-newPath
			print(paste0("Changing Projects directory to ",newPath))
			loadProjectsFromHomeDir()
			json<-RJSONIO::toJSON(currentProjects,.escapeEscapes = FALSE)
			shinyjs::runjs(paste0("updateProjectsList(`",json,"`);setCurrentProjectsDir(`",home_dir,"`);"))

		}
	})

	#Check that Rbowtie2 functions work
	check_Rbowtie2<-function(){
		retVal<-tryCatch({
			d<- tempdir()
			indexRetVal<-Rbowtie2::bowtie2_build(system.file("extdata", "bt2/refs/lambda_virus.fa", package="Rbowtie2"),file.path(d, "testIndex"),overwrite=TRUE)
			if(is.null(indexRetVal)){
				stop("Genome indexing failed: Check that Python 3 is properly installed (See About -> Readme).")
			}

			Rbowtie2::bowtie2(bt2Index=file.path(d, "testIndex"),samOutput=file.path(d, "testAlign.sam"),seq1=system.file("extdata", "bt2/reads/reads_1.fastq", package="Rbowtie2"),seq2=system.file("extdata", "bt2/reads/reads_2.fastq", package="Rbowtie2"), overwrite=TRUE)
			return("OK")
		},
		error=function(cond) {
			print("Rbowtie2 test failed: Check that Python 3 and Perl are properly installed (See About -> Readme).")
			return("FAILED")
		},
		finally={
		})
		return(retVal)
	}
	
	# Check Rbowtie2 if SeqNjoy is running under Windows
	if(Sys.info()["sysname"] == "Windows"){
		Rbowtie2test<-suppressWarnings(check_Rbowtie2())
		# print(paste0("Rbowtie2test: ",Rbowtie2test))
		if(Rbowtie2test != "OK"){
			shinyjs::runjs("disableBowtie2();")						
		} 
	}

	# Show Welcome message
	message("**********************************************************************************************************")
	message("Welcome to SeqNjoy!") 
	message("If the browser has not already started, open your browser and enter the following URL.")
	message("http://127.0.0.1:7628/")
	message("Press Ctrl+C to stop SeqNjoy")
	message("**********************************************************************************************************")
	projectDir <<- ""
	projectFile <<- ""
	projectLogFile <<- ""
# Globals to stoppable loops
#	LOOP_ELEMENTS <<- null
	    LOOP_FROM <<- 0
	      LOOP_TO <<- 0
	    LOOP_STEP <<- 1

### End Globals and reactive

### UI Objects
#	insertUI("#DragLabel", ui=fileInput("LoadFiles", "\n Click or \n drag  to \n add files",multiple=T))
##	insertUI("#NewProjectButtons", ui=shinyDirButton(id="NewProjectSource", label="", icon=icon("folder-plus"), title="Select directory with the files to be included",class = "btn btn-primary"))

##	volumes<-getVolumes()
##	shinyDirChoose(input,'NewProjectSource',roots=volumes,session=session)
##	path1 <- reactive({
##	   print(parseDirPath(volumes, input$NewProjectSource))
##      return(print(parseDirPath(volumes, input$NewProjectSource)))       
##    })

### End UI Objects

	### EXIT APP FUNCTION
	ExitSeqNjoy<-function(newData){
		shiny::stopApp()
	}
	### EXIT APP FUNCTION


### Reactive

	shiny::observe({
		if(!is.null(input$LoadFiles)){
			actionOut <- tryCatch({
				shiny::isolate({
					startAddingFiles(input$LoadFiles,1)
				})
			},
			error=function(cond) {
				print ("ERROR UPLOADING")
				print(input$LoadFiles)
				return(NA)
			},
			# warning=function(cond) {
			# 	print ("WARNING UPLOADING")
			# 	print(input$LoadFiles)
			# },
			finally={
			})
		} 
	})
	
### End Reactive	


	OpenVignette<-function(newData){
		vignette_path <- system.file("doc", paste0(newData[["vignette"]],".html"), package = "SeqNjoy")
        if (file.exists(vignette_path)) {
            utils::browseURL(vignette_path)
        } else {
            showNotification("Vignette not found!", type = "error")
        }
		
	}

	startAddingFiles<-function(fileList,reload){
		delete_temp_folder()
		outText<-RJSONIO::toJSON(list(files=fileList),.escapeEscapes = FALSE)
		shinyjs::runjs(paste0("launchProcessingLoadedFilesQueue(`",outText,"`);"))
	}
	
	
		
	addFileToProject<-function(fileData){
		fileCheckPassed<-1
		checkResult<-c()
		if(projectDir != ""){
			if(!missing(fileData)){
				## FILE CHECK
				if(any(myDfFiles$files$fname==fileData[1])){
					checkResult<-c(checkResult,paste0("WARNING: File name (",fileData[1],") already in the file table."))
					if(any(myDfFiles$files[myDfFiles$files$fname==fileData[1],]$datapath == fileData[4])){
						checkResult<-c(checkResult,paste0("ERROR: File name and path (",fileData[4],") already in the file table. File will not be added."))
						fileCheckPassed<-0
					}
				}
			} else {
				checkResult<-c(checkResult,"WARNING: Not file provided to be added to the table.")
				fileCheckPassed<-0
			}
		} else {
			checkResult<-c(checkResult,"ERROR: File could not be added to the table because project path has not been initialized yet.")
			fileCheckPassed<-0
		}

		if(fileCheckPassed == 1){
			myDfFiles$files[nrow(myDfFiles$files) + 1,] <- fileData;
		} 

		if(length(checkResult)>0){
			print(checkResult)
		}
		saveFileTable()
		return(fileCheckPassed)
	}


	remove_file_from_project<-function(filePath){
		fileCheckPassed<-1
		checkResult<-c()
		if(projectDir != ""){
			if(!missing(filePath)){
			} else {
				checkResult<-c(checkResult,"WARNING: Not file provided to be removed from the table.")
				fileCheckPassed<-0
			}
		} else {
			checkResult<-c(checkResult,"ERROR: File could not be removed from the table because project path has not been initialized yet.")
			fileCheckPassed<-0
		}

		if(fileCheckPassed == 1){
			myDfFiles$files <- myDfFiles$files[myDfFiles$files$datapath != filePath, ]
			outText<-RJSONIO::toJSON(list(files=myDfFiles$files),.escapeEscapes = FALSE)
			shinyjs::runjs(paste0("DataTable = ",outText,";renderFileTable(currentSortBy,'current');resize();"))
		} 

		if(length(checkResult)>0){
			print(checkResult)
		}
		saveFileTable()
		return(fileCheckPassed)
	}





	intializeProject<-function(my_home_dir){
		dir.create(paste0(my_home_dir,"/FASTA"),showWarnings = FALSE,recursive=T)
		dir.create(paste0(my_home_dir,"/GFF"),showWarnings = FALSE,recursive=T)
		dir.create(paste0(my_home_dir,"/ALIGNMENTS"),showWarnings = FALSE,recursive=T)
		dir.create(paste0(my_home_dir,"/COUNTS"),showWarnings = FALSE,recursive=T)
		dir.create(paste0(my_home_dir,"/DIFFEXP"),showWarnings = FALSE,recursive=T)
		dir.create(paste0(my_home_dir,"/FASTQ"),showWarnings = FALSE,recursive=T)
		dir.create(paste0(my_home_dir,"/OTHERS"),showWarnings = FALSE,recursive=T)
		dir.create(paste0(my_home_dir,"/ANNOTS"),showWarnings = FALSE,recursive=T)
		dir.create(paste0(my_home_dir,"/temp"),showWarnings = FALSE,recursive=T)
	}
	
	writeLog<-function(myText){
		if(projectLogFile != ""){
			projectLog<-base::file(projectLogFile,open="a")
			cat(paste0(base::format(Sys.time(), "%Y/%m/%d %H:%M:%S"),"\t",myText,"\n"), file = projectLog)
			close(projectLog)
		} else {
			print("Log file is not defined.")
		}

	}
	
	saveFileTable<-function(){
		if(projectFile != ""){
			utils::write.table(myDfFiles$files,file=projectFile, col.names=T,sep="\t",quote=F,row.names = F)
		} else {
			print("ERROR: File table could not be added to the table because project file name has not been initialized yet.")
		}
	}
	

	shiny::observeEvent(input$NextStep, {
		if (input$NextStep=="none") { print ("Nothing to render"); flush.console(); return() }
		if (input$NextStep != "") {
			JSMESSAGE<<-RJSONIO::fromJSON(input$NextStep, asText=TRUE)
			newAction<-JSMESSAGE$action
			newData<-JSMESSAGE$data
			utils::flush.console();
			actionOut <- tryCatch(
				{
					if(any(functionalities==newAction)){
						#delete_temp_folder()
						do.call(newAction,list(newData))
					} else {
						print(paste0("WARNING!! Invalid request for function ",newAction))
					}
				},
				error=function(cond) {
					message(paste0("Error executing ",newAction))
					message("Here's the original error message:")
					outText<-RJSONIO::toJSON(list(message=cond,action=c(paste0("Error executing ",newAction))),.escapeEscapes = FALSE)
					shinyjs::runjs(paste0("ReturnMessage = ",outText,";showErrorMessage();"))
				},
				# warning=function(cond) {
				# 	message(paste0("Warning executing ",newAction))
				# 	message("Here's the original warning message:")
				#	outText<-RJSONIO::toJSON(list(message=cond,action=c(paste0("Warning executing ",newAction))),.escapeEscapes = FALSE)
				# 	shinyjs::runjs(paste0("ReturnMessage = ",outText,";showErrorMessage();"))
				# },
				finally={
				}
			)
		}
	})
	
	changeProjectName<-function(newData){
		projectInfoFile<-paste0(project_dir,"/",projectFileName)		
		currentProjectData<-utils::read.table(projectInfoFile,sep="\t",header=T,stringsAsFactors = FALSE,row.names = NULL, colClasses = "character")
		currentProjectData$description<-newData[["description"]]
		new_project_dir <<-paste0(home_dir,"/",newData[["description"]])
		currentProjectData$datapath<-new_project_dir
		fs::file_move(project_dir, new_project_dir)
		project_dir <<-new_project_dir
		projectInfoFile<-paste0(new_project_dir,"/",projectFileName)
		utils::write.table(currentProjectData,file=projectInfoFile, col.names=T,sep="\t",quote=F,row.names = F)
		projectLogFile<<-paste0(new_project_dir,"/SHIESTA.log")
		# writeLog(paste0("Project name changed to ",currentProjectData$description))		
		loadProjectsFromHomeDir()
		shiny::addResourcePath(prefix = "PROJECTS", directoryPath = project_dir)  
		if(exists("range_server")){
			range_server$stop_server()
		}
		message(paste0("Project renamed to ",newData[["description"]]))
		range_server<<-serve_data(project_dir)
		json<-RJSONIO::toJSON(currentProjects,.escapeEscapes = FALSE)
		shinyjs::runjs(paste0("ProjectData['session']['description']=`",newData[["description"]],"`;ProjectData['session']['datapath']=`",new_project_dir,"`;updateProjectsList(`",json,"`)"))		

	}


	
### Project management functions

	## Function to check the integrity of the data table and the correspondence with the files in the project folder
	checkProjectIntegrity<-function(){
		checkResult<-c()
		print(paste0("Starting project integrity check. PATH: ",projectDir))
		if(projectDir != ""){
			listFiles<-list.files(projectPath("."), recursive=T,include.dirs=F)

			currentProjectFiles<-myDfFiles$files
			currentProjectFiles[,"CHECKED"]<-rep("NO",nrow(myDfFiles$files))
			for(newPath in listFiles){
				if(newPath != "SHIESTA.log" && newPath != "SHIESTA.files"){
					if(!any(currentProjectFiles$fname==basename(newPath))){
						checkResult<-c(checkResult,paste0("ERROR: File ",newPath," is missing from the table."))
					}
					else{
						fileMatches<-currentProjectFiles[currentProjectFiles$fname==basename(newPath),]
						if(nrow(fileMatches)>1){
							checkResult<-c(checkResult,paste0("WARNING: Duplicate entries for file ",basename(newPath)))
						}
						fileFound<-0
						for(i in c(1:nrow(fileMatches))){
							cleanPath<-fileMatches[i,]$datapath
							cleanPath<-gsub("/\\./","/",cleanPath,perl=T)
							cleanPath<-gsub("/([^/]+)/\\.\\./","/",cleanPath,perl=T)
							cleanPath<-gsub("^\\./","",cleanPath,perl=T)
							if(cleanPath == newPath){
								fileFound<-1
								currentProjectFiles[currentProjectFiles$datapath==fileMatches[i,]$datapath,]$CHECKED="OK"
							}
						}
						if(fileFound == 0){
							checkResult<-c(checkResult,paste0("ERROR: Cannot find file with the given path: ",newPath))
						}
					}
				}
			}
			missingFiles<-currentProjectFiles[currentProjectFiles$CHECKED!="OK",]
			if(nrow(missingFiles)>0){
				for(i in c(1:nrow(missingFiles))){
					checkResult<-c(checkResult,paste0("ERROR: File ",missingFiles$fname," is in the project table but it cannot be found in the project dir"))
				}
			}
		} else {
			checkResult<-c(checkResult,paste0("ERROR: Project path has not been initialized yet"))
		}

		if(length(checkResult) ==0){
			print("Project integrity check completed without errors")
		} else {
			print("****************** ERRORS FOUND during project integrity check")
			print(checkResult)
		}

	}


	
	
	openProjectFromDir<-function(newDir){
		if(dir.exists(newDir)){
			projectInfoFile<-paste0(newDir,"/",projectFileName)
			if(file.exists(projectInfoFile)){
				project_dir <<- newDir
				print(paste0("Opening project dir ",project_dir))
				if("PROJECTS" %in% resourcePaths()){
					shiny::removeResourcePath(prefix = "PROJECTS")  
				}

				shiny::addResourcePath(prefix = "PROJECTS", directoryPath = project_dir)  
				if(exists("range_server")){
					range_server$stop_server()
				}
				range_server<<-serve_data(project_dir)
				
				projectDir<<-project_dir
				currentProjectData<-utils::read.table(projectInfoFile,sep="\t",header=T,stringsAsFactors = FALSE,row.names = NULL, colClasses = "character")
				currentProjectData$datapath<-newDir
				currentProjectData$accessed<-base::format(Sys.time(), "%Y/%m/%d %H:%M:%S")
				utils::write.table(currentProjectData,file=projectInfoFile, col.names=T,sep="\t",quote=F,row.names = F)
				
				projectFile<<-paste0(projectDir,"/SHIESTA.files")
				projectLogFile<<-paste0(projectDir,"/SHIESTA.log")
				writeLines("Continue",paste0(projectDir,"/stop.txt"))
				if(base::file.exists(projectFile)){
					currentFiles<-utils::read.table(projectFile,sep="\t",header=T,stringsAsFactors = FALSE,row.names = NULL, quote="")
					myDfFiles$files<-currentFiles
				}
				else {
					print(paste0(projectFile," couldn't be found in ",projectDir));
				}			 
 				
				loadProjectsFromHomeDir()
				json<-RJSONIO::toJSON(currentProjects,.escapeEscapes = FALSE)
				shinyjs::runjs(paste0("updateProjectsList(`",json,"`)"))

				
				outSessionText<-RJSONIO::toJSON(list(session=currentProjectData),.escapeEscapes = FALSE)
				outText<-RJSONIO::toJSON(list(files=myDfFiles$files),.escapeEscapes = FALSE)
				

		#		checkProjectIntegrity()
				delete_temp_folder()
				shinyjs::runjs(paste0("ProjectData=",outSessionText,";DataTable = ",outText,";renderProject();"))

				
			} else {
				shinyjs::runjs(paste0("myalert('Open Project','The folder ",newDir," does not contain a SeqNjoy project');"))
			}
		}		
	}

	
	
	startNewProject<-function(ProjectData){
		if(dir.exists(ProjectData[["BaseDir"]])){
			new_project_dir <<-paste0(home_dir,"/",ProjectData[["description"]])			
			
			if(dir.exists(new_project_dir)){
				shinyjs::runjs(paste0("myalert('New Project','The project folder ",new_project_dir," already exists');"))
			} else {
				project_dir <<-new_project_dir
				print(paste0("Creating project dir ",project_dir))				
				dir.create(project_dir,showWarnings = FALSE,recursive=T)
				
				print(paste0("Initiaizing project dir ",project_dir))
				intializeProject(project_dir)
				
				
				
				projectInfoFile<-paste0(project_dir,"/",projectFileName)				
				print(paste0("Creating project info file ",projectInfoFile))
				currentProjectData <<- data.frame(
				 	id=c("")
				 	,status=c("STARTED")
				 	,started=c(base::format(Sys.time(), "%Y/%m/%d %H:%M:%S"))
				 	,accessed=c(base::format(Sys.time(), "%Y/%m/%d %H:%M:%S"))
				 	,datapath=c(new_project_dir)
				 	,description=c(ProjectData[["description"]])
				 	,stringsAsFactors=F
				)
				utils::write.table(currentProjectData,file=projectInfoFile, col.names=T,sep="\t",quote=F,row.names = F)
				
				print(paste0("Starting server at ",project_dir))
				print(shiny::resourcePaths())
				if("PROJECTS" %in% shiny::resourcePaths()){
					shiny::removeResourcePath(prefix = "PROJECTS")  
				}
				shiny::addResourcePath(prefix = "PROJECTS", directoryPath = project_dir)  
				if(exists("range_server")){
					range_server$stop_server()
				}
				range_server<<-serve_data(project_dir)
				
				
				print(paste0("Creating file list "))
				projectDir<<-project_dir				
				projectFile<<-paste0(projectDir,"/SHIESTA.files")
				projectLogFile<<-projectLogFile<<-paste0(projectDir,"/SHIESTA.log")
				writeLog(paste0("Project ",ProjectData[["description"]]," created."))


				fileList<-data.frame(
					 fname=character()
					,fsize=character()
					,ftype=character()
					,datapath=character()
					,fcreated=character()
					,viewfiles=character()
					,dependencies=character()
					,description=character()
					,hidden=character()
					,md5=character()
					,stringsAsFactors = FALSE
				)
				# ToDo: Read files into a new project from a source dir
				# if(ProjectData[["sourceDir"]] != ""){
				# 	sourceDir <-ProjectData[["sourcedir"]]
				# 	if(dir.exists(sourceDir)){
				# 		dirFiles<-list.files(projectDir, recursive = TRUE)
				# 		for(f in dirFiles){
				# 			newFileInfo<-base::file.info(f)
				# 			fileList[nrow(fileList) + 1,] = list(
				# 				as.character(basename(rownames(newFileInfo)[1]))
				# 				,as.character(newFileInfo$size[1])
				# 				,as.character("")
				# 				,as.character(rownames(newFileInfo)[1])
				# 				,base::format(Sys.time(), "%Y/%m/%d %H:%M:%S")
				# 				,as.character("")
				# 				,as.character("")
				# 				,as.character("User provided")
				# 				,"NO"
				# 				,tools::md5sum(f)
				# 			)
				# 			colnames(fileList)<-c(
				# 				 "fname"
				# 				,"fsize"
				# 				,"ftype"
				# 				,"datapath"
				# 				,"fcreated"
				# 				,"viewfiles"
				# 				,"dependencies"
				# 				,"description"
				# 				,"hidden"
				# 				,"md5"
				# 			)
				# 		}
				# 		if(nrow(fileList)>0){
				# 			addFiles(fileList,0)
				# 		}
				# 	}
				# }
				myDfFiles$files<-fileList
				saveFileTable()
				
				#showNotification("Project created")
				
								
				loadProjectsFromHomeDir()
				json<-RJSONIO::toJSON(currentProjects,.escapeEscapes = FALSE)
				shinyjs::runjs(paste0("updateProjectsList(`",json,"`)"))


				
				outSessionText<-RJSONIO::toJSON(list(session=currentProjectData),.escapeEscapes = FALSE)
				outText<-RJSONIO::toJSON(list(files=myDfFiles$files),.escapeEscapes = FALSE)
		#		checkProjectIntegrity()

				shinyjs::runjs(paste0("ProjectData=",outSessionText,";DataTable = ",outText,";renderProject();"))
			}
		} else {			
			shinyjs::runjs(paste0("myalert('New Project','The selected folder ",ProjectData[["BaseDir"]]," does not exists');"))
		}
	}
	
	openProject<-function(ProjectData){
		newDir<-ProjectData[["datapath"]]
		openProjectFromDir(newDir)
	}


	deleteProject<-function(ProjectData){
		#showNotification(paste0("Deleting project: ",ProjectData[["id"]]))
		toRemove<-paste0(ProjectData[["datapath"]])
		
		toRemoveDesc<-currentProjects[currentProjects$datapath==ProjectData[["datapath"]],]$description
		#showNotification(toRemove)
		if(dir.exists(toRemove)){
			fs::dir_delete(toRemove)
			
			loadProjectsFromHomeDir()
			json<-RJSONIO::toJSON(currentProjects,.escapeEscapes = FALSE)			
			shinyjs::runjs(paste0("updateProjectsList(`",json,"`)"))
			#showNotification(paste0("Project ",toRemoveDesc," deleted"))
		}
		else {
			showNotification(paste0("Project at ",toRemove," does not exist"))
		}
	}

	projectPath<-function(path_list){ return(paste0(projectDir,'/',path_list)) }

	loadGFFfeatures<- function(newData){
		gffFile <- paste0(projectDir,"/",newData[["name"]])
		if (file.exists(gffFile)) {
			outText <- Rgff::get_features(gffFile, includeCounts=TRUE, outFormat="JSON")
		}
		else {
			outText <- "new Object()"
		}
		shinyjs::runjs(paste0("FeaturesTable = ",outText,";renderQuantifyFeatures();"))
	}



	checkExistingFileName<-function(fileName){
		outName<-fileName
		counter<-2
		while(base::file.exists(outName)){
			outName<-paste0(tools::file_path_sans_ext(fileName),"(",counter,").",tools::file_ext(fileName))
			counter <- counter+1
		}
		return(outName)
	}
	

		
	align_with_bowtie2<-function(newData) {
		delete_temp_folder()
		NODUPS <<- -1
		NALIGNED <<- -1
		tryCatch({
			CURRENT_COMMAND <<-''

			stringParams=""
			for(sp in names(newData$common_params)) {
				theparam=subset(PARAMS_bowtie2[["Param"]], PARAMS_bowtie2["ID"]==sp)
				thevalue=newData$common_params[sp]
				skipif=subset(PARAMS_bowtie2[["SkipIf"]],  PARAMS_bowtie2["ID"]==sp)
				if (thevalue != skipif) {
					if (theparam=="BLANK") { theparam="" }
					if (thevalue != "skip_this_param") {
						stringParams=paste0(stringParams," ",theparam," ",thevalue)
					}
				}
			}

			input1=paste0(projectDir,"/FASTQ/",basename(newData$input1))
			input2=paste0(projectDir,"/FASTQ/",basename(newData$input2))
			
			input1expanded="none"
			input2expanded="none"
			
			if (grepl("\\.gz$",input1)) {
				input1expanded=paste0(projectDir,"/temp/",gsub("\\.gz$","",basename(newData$input1)))
				R.utils::gunzip(input1, input1expanded, overwrite=FALSE, remove=FALSE)
				input1=input1expanded
			}
			if (grepl("\\.gz$",input2)) {
				input2expanded=paste0(projectDir,"/temp/",gsub("\\.gz$","",basename(newData$input2)))
				R.utils::gunzip(input2, input2expanded, overwrite=FALSE, remove=FALSE)
				input2=input2expanded
			}
			output=paste0(projectDir,"/temp/",basename(newData$output))	
			output_sam=paste0(projectDir,"/temp/", sub("\\.bam", ".sam", basename(output)))
			output_bam=paste0(projectDir,"/temp/", basename(output))
			genome_file=paste0(projectDir,"/FASTA/",basename(newData$genome))		
			genome_index_path_final=paste0(projectDir, "/FASTA/",basename(newData$genome),".bowtie2")
			genome_index_path_temp=paste0(projectDir, "/temp/",basename(newData$genome),".bowtie2")
			genome_index_temp=paste0(projectDir, "/temp/",basename(newData$genome),".bowtie2/",basename(genome_file))
			genome_index_final=paste0(projectDir, "/FASTA/",basename(newData$genome),".bowtie2/",basename(genome_file))
			
			to_eval_template <- '## ## 00000 Load libraries\nlibrary(Rbowtie2)\nlibrary(Rsamtools)\nlibrary(R.utils)\n'
			to_eval_template <- paste0(to_eval_template,'## ## 00100 Index genome if required
if ((!dir.exists("_GENOME_INDEX_PATH_FINAL_")) || (length(list.files("_GENOME_INDEX_PATH_FINAL_"))==0)) {
	unlink("_GENOME_INDEX_PATH_FINAL_",recursive=TRUE,force=TRUE) # REMOVE THIS LINE IN REPORT
if (!dir.exists("_GENOME_INDEX_PATH_TEMP_")) { # REMOVE THIS LINE IN REPORT
	dir.create("_GENOME_INDEX_PATH_TEMP_",showWarnings = FALSE,recursive=T)
}  # REMOVE THIS LINE IN REPORT
	print("* Indexing genome for the first time...")
	indexRetVal<-Rbowtie2::bowtie2_build(\'_GENOME_FILE_\', \'_GENOME_INDEX_TEMP_\', "--threads 6")
	if(is.null(indexRetVal)){
		stop("Genome indexing failed: Check that Python 3 is properly installed (See About -> Readme).")
	}
	file.rename(\'_GENOME_INDEX_PATH_TEMP_\', \'_GENOME_INDEX_PATH_FINAL_\') # REMOVE THIS LINE IN REPORT
}#REMOVE THIS STRING close in bowtie2build
')
			if (file.exists(input2)) {
				to_eval_template <- paste0(to_eval_template,'## ## 00150 Align paired-end reads with bowtie2 and convert result to bam format
print("* Aligning _SEQ1_ and _SEQ2_...")
Rbowtie2::bowtie2(bt2Index=\'_GENOME_INDEX_FINAL_\', samOutput=\'_OUTPUT_SAM_\', seq1=\'_SEQ1_\', seq2=\'_SEQ2_\', \'_STRINGPARAMS_\')
')
			}
			else {
				to_eval_template <- paste0(to_eval_template,'## ## 00150 Align single-end reads with bowtie2 and convert result to bam format
print("* Aligning _SEQ1_...")
Rbowtie2::bowtie2(bt2Index=\'_GENOME_INDEX_FINAL_\', samOutput=\'_OUTPUT_SAM_\', seq1=\'_SEQ1_\', \'_STRINGPARAMS_\')
')
			}
			to_eval_template <- paste0(to_eval_template, 'Rsamtools::asBam("_OUTPUT_SAM_", indexDestination=TRUE)\n')
			to_eval_template <- paste0(to_eval_template, 'file.remove("_OUTPUT_SAM_")\n')
			to_eval_template <- paste0(to_eval_template, 'param <- Rsamtools::ScanBamParam(flag=Rsamtools::scanBamFlag(isSecondaryAlignment=FALSE, isUnmappedQuery=FALSE),  what="seq") # REMOVE THIS LINE\n')
			to_eval_template <- paste0(to_eval_template, 'NALIGNED <<- Rsamtools::countBam("_OUTPUT_BAM_", param=param)[["records"]] # REMOVE THIS LINE\n\n')
			
			if (newData$commandRemoveDups!="none") {
				stringParamsRemoveDups=""
				for(sp in names(newData$common_params_removeDups)) {
					theparam=subset(PARAMS_removeDupReads[["Param"]], PARAMS_removeDupReads["ID"]==sp)
					if (theparam=="BLANK") { theparam="" }
					if (stringParamsRemoveDups=="") {
						stringParamsRemoveDups=paste0(theparam,"=",newData$common_params_removeDups[sp])
					}
					else {
						stringParamsRemoveDups=paste0(stringParamsRemoveDups,", ",theparam,"=",newData$common_params_removeDups[sp])
					}
				}
				to_eval_template <- paste0(to_eval_template,'## ## 00000 Load libraries\nlibrary(Rsubread)\n')
				to_eval_template <- paste0(to_eval_template,'## ## 00175 Remove duplicated reads
print("* Removing duplicated reads from _OUTPUT_BAM_...")
Rsubread::removeDupReads(input="_OUTPUT_BAM_", output="_OUTPUT_BAM_.tmp.bam", ',stringParamsRemoveDups,')
file.remove("_OUTPUT_BAM_")
file.remove("_OUTPUT_BAM_.bai")
file.rename("_OUTPUT_BAM_.tmp.bam", "_OUTPUT_BAM_")
Rsamtools::indexBam("_OUTPUT_BAM_")
param <- Rsamtools::ScanBamParam(flag=Rsamtools::scanBamFlag(isSecondaryAlignment=FALSE, isUnmappedQuery=FALSE),  what="seq") # REMOVE THIS LINE
NODUPS <<- Rsamtools::countBam("_OUTPUT_BAM_", param=param)[["records"]] # REMOVE THIS LINE IN REPORT\n
')
			}
			
			to_eval <- to_eval_template
			to_eval <- gsub('_GENOME_INDEX_PATH_FINAL_', genome_index_path_final, to_eval)
			to_eval <- gsub('_GENOME_INDEX_PATH_TEMP_' , genome_index_path_temp , to_eval)
			to_eval <- gsub('_GENOME_FILE_'            , genome_file            , to_eval)
			to_eval <- gsub('_GENOME_INDEX_TEMP_'      , genome_index_temp      , to_eval)
			to_eval <- gsub('_GENOME_INDEX_FINAL_'     , genome_index_final     , to_eval)
			to_eval <- gsub('_OUTPUT_SAM_'             , output_sam             , to_eval)
			to_eval <- gsub('_OUTPUT_BAM_'             , output_bam             , to_eval)
			to_eval <- gsub('_SEQ1_'                   , input1                 , to_eval)
			to_eval <- gsub('_SEQ2_'                   , input2                 , to_eval)
			to_eval <- gsub('_STRINGPARAMS_'           , stringParams           , to_eval)
			eval(parse(text=to_eval))
			
			## add some lines to command (no to be evaluated)
			
			to_eval_template <- paste0(to_eval_template,'## ## 00005 Uncompress input files if necessary\nprint("* Uncompressing input files (if necessary)...")
if (file.exists("_SEQ1_.gz") && !file.exists("_SEQ1_")) { R.utils::gunzip("_SEQ1_.gz", remove=FALSE) }
')
			if (newData$input2!=NOT_SELECTED) {
				to_eval_template <- paste0(to_eval_template,'if (file.exists("_SEQ2_.gz") && !file.exists("_SEQ2_")) { R.utils::gunzip("_SEQ2_.gz", remove=FALSE) }
')
			}
			to_eval_template <- paste0(to_eval_template,'if (file.exists("_GENOME_FILE_.gz") && !file.exists("_GENOME_FILE_")) { R.utils::gunzip("_GENOME_FILE_.gz", remove=FALSE) }
')
			
			CURRENT_COMMAND <<- to_eval_template
			CURRENT_COMMAND <<- gsub('_GENOME_INDEX_PATH_FINAL_', basename(genome_index_path_final)              , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_GENOME_INDEX_PATH_TEMP_' , basename(genome_index_path_temp)               , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_GENOME_FILE_'            , basename(genome_file)                          , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_GENOME_INDEX_TEMP_'      , paste0(basename(genome_file),".bowtie2/",basename(genome_index_temp)) , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_GENOME_INDEX_FINAL_'     , paste0(basename(genome_file),".bowtie2/",basename(genome_index_final)), CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_OUTPUT_SAM_'             , basename(output_sam)                           , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_OUTPUT_BAM_'             , basename(output_bam)                           , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_SEQ1_'                   , basename(input1)                               , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_SEQ2_'                   , basename(input2)                               , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_STRINGPARAMS_'           , stringParams                                   , CURRENT_COMMAND)

			fs::file_delete(paste0(output,".bai")) # we will index it later
			if (fs::file_exists(input1expanded)) { fs::file_delete(input1expanded) }
			if (fs::file_exists(input2expanded)) { fs::file_delete(input2expanded) }

			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}


	delete_temp_folder<-function() {
		showConnections() # try to understand this
		thePath=paste0(projectDir,"/temp/")
		f <- list.files(thePath, include.dirs = F, full.names = T, recursive = T)
		# remove the files
		fs::file_delete(f)
		# After deleting the files, check if there are any directories 
		tempDirs<-list.dirs(thePath, full.names = T, recursive = T)
		for(dirToRemove in tempDirs){
			if(dirToRemove != thePath && dir.exists(dirToRemove)){
				print(paste0("Removing directory ",dirToRemove))
				fs::dir_delete(dirToRemove)
			}

		}
		
	}
	
	align_with_hisat2<-function(newData) {
		delete_temp_folder()
		NODUPS <<- -1
		NALIGNED <<- -1
		tryCatch({
			CURRENT_COMMAND <<-''

			stringParams=""
			use_gff="none"
			for(sp in names(newData$common_params)) {
				theparam=subset(PARAMS_hisat2[["Param"]], PARAMS_hisat2["ID"]==sp)
				thevalue=newData$common_params[sp]
				skipif=subset(PARAMS_hisat2[["SkipIf"]],  PARAMS_hisat2["ID"]==sp)
				if (thevalue != skipif) {
					if (theparam=="BLANK") {
						theparam=""
						stringParams=paste0(stringParams," `",thevalue, "`=TRUE, ")
					}
					else if (theparam=="known-splicesite-infile") { # this param is not in the stringParams
						use_gff=paste0(projectDir,"/",thevalue)
						if (file.exists(use_gff)) {
							thevalue=paste0("'",projectDir,"/",thevalue,".introns'")
							stringParams=paste0(stringParams," `",theparam,"`=",thevalue, ", ")
						}
					}
					else if (thevalue==FALSE || thevalue==TRUE) {
						stringParams=paste0(stringParams," `",theparam,"`=",thevalue,", ")
					}
					else if (thevalue != "skip_this_param") {
						stringParams=paste0(stringParams," `",theparam,"`='",thevalue,"', ")
					}
				}
			}
			stringParams=trimws(stringParams)
			stringParams=gsub(",$","", stringParams)

			input1=paste0(projectDir,"/FASTQ/",basename(newData$input1))
			input2=paste0(projectDir,"/FASTQ/",basename(newData$input2))

			input1expanded="none"
			input2expanded="none"
			
			if (grepl("\\.gz$",input1)) {
				input1expanded=paste0(projectDir,"/temp/",gsub("\\.gz$","",basename(newData$input1)))
				R.utils::gunzip(input1, input1expanded, overwrite=FALSE, remove=FALSE)
				input1=input1expanded
			}
			if (grepl("\\.gz$",input2)) {
				input2expanded=paste0(projectDir,"/temp/",gsub("\\.gz$","",basename(newData$input2)))
				R.utils::gunzip(input2, input2expanded, overwrite=FALSE, remove=FALSE)
				input2=input2expanded
			}


			output=paste0(projectDir,"/temp/",basename(newData$output))	
			output_bam=paste0(projectDir,"/temp/", basename(output))
			output_sam=paste0(projectDir,"/temp/", basename(gsub(".bam$", ".sam",output)))
			genome_file=paste0(projectDir,"/FASTA/",basename(newData$genome))
			basename_genome=basename(newData$genome)
			genome_index_final=paste0(projectDir,"/FASTA/",basename(genome_file),".hisat2/",basename(genome_file))
			
			genome_index_path_final=paste0(projectDir,"/FASTA/",basename(genome_file),".hisat2")
			genome_index_path_temp=paste0(projectDir,"/temp/",basename(genome_file),".hisat2")
			
			to_eval_template='## ## 00000 Load libraries\nlibrary(Rhisat2)\nlibrary(Rsamtools)\nlibrary(R.utils)\n'
			to_eval_template=paste0(to_eval_template, '## ## 00100 Index genome if required
if ((!dir.exists("_GENOME_INDEX_PATH_FINAL_")) || (length(list.files("_GENOME_INDEX_PATH_FINAL_"))==0)) {
	dir.create("_GENOME_INDEX_PATH_TEMP_",showWarnings = FALSE,recursive=T)
	print("* Indexing genome for the first time...")
	Rhisat2::hisat2_build(references="_GENOME_FILE_", outdir="_GENOME_INDEX_PATH_TEMP_", prefix="_BASENAME_GENOME_", force=TRUE, p=6)
	file.rename("_GENOME_INDEX_PATH_TEMP_", "_GENOME_INDEX_PATH_FINAL_") # REMOVE THIS LINE IN REPORT
}#REMOVE THIS STRING close in hisat2build
')
			out_tmp="DUMMY"
			if (file.exists(use_gff)) {
				out_final=paste0(use_gff,".introns")
				out_tmp=gsub("/GFF/","/temp/", out_final)
				to_eval_template=paste0(to_eval_template, '## ## 00145 Extract introns from gff file
if (!file.exists("',out_final,'")) {
	print("* Extracting intron coordinates from _USE_GFF_...")
	suppressWarnings(  # REMOVE THIS LINE IN REPORT
	Rhisat2::extract_splice_sites(features="_USE_GFF_", outfile="_TMP_GFF_")
	)  # REMOVE THIS LINE IN REPORT
	file.rename("',out_tmp,'", "',out_final,'") # REMOVE THIS LINE IN REPORT
}#REMOVE THIS STRING for extract_splice_sites XXXXXX
')
			}

			if (file.exists(input2)) {
				to_eval_template=paste0(to_eval_template, '## ## 00150 Align paired reads with hisat2 and convert result to bam format
print("* Aligning _INPUT1_ and _INPUT2_...")
Rhisat2::hisat2(index=\'_GENOME_INDEX_FINAL_\', type=\'paired\', outfile=\'_OUTPUT_SAM_\', sequences=as.list(c(\'_INPUT1_\',\'_INPUT2_\')), _STRINGPARAMS_)
')
			}
			else {
				to_eval_template=paste0(to_eval_template, '## ## 00150 Align reads with hisat2 and convert result to BAM format
print("* Aligning _INPUT1_...")
Rhisat2::hisat2(sequences=\'_INPUT1_\', index=\'_GENOME_INDEX_FINAL_\', type=\'single\', outfile=\'_OUTPUT_SAM_\',  _STRINGPARAMS_)
')
			}
			to_eval_template <- paste0(to_eval_template, 'Rsamtools::asBam("_OUTPUT_SAM_", indexDestination=TRUE)\n')
			to_eval_template <- paste0(to_eval_template, 'file.remove("_OUTPUT_SAM_")\n')
			to_eval_template <- paste0(to_eval_template, 'param <- Rsamtools::ScanBamParam(flag=Rsamtools::scanBamFlag(isSecondaryAlignment=FALSE, isUnmappedQuery=FALSE),  what="seq") # REMOVE THIS LINE IN REPORT\n')
			to_eval_template <- paste0(to_eval_template, 'NALIGNED <<- Rsamtools::countBam("_OUTPUT_BAM_", param=param)[["records"]] # REMOVE THIS LINE IN REPORT\n\n')

			if (newData$commandRemoveDups!="none") {
				stringParamsRemoveDups=""
				for(sp in names(newData$common_params_removeDups)) {
					theparam=subset(PARAMS_removeDupReads[["Param"]], PARAMS_removeDupReads["ID"]==sp)
					if (theparam=="BLANK") { theparam="" }
					if (stringParamsRemoveDups=="") {
						stringParamsRemoveDups=paste0(theparam,"=",newData$common_params_removeDups[sp])
					}
					else {
						stringParamsRemoveDups=paste0(stringParamsRemoveDups,", ",theparam,"=",newData$common_params_removeDups[sp])
					}
				}
				to_eval_template <- paste0(to_eval_template,'## ## 00000 Load libraries\nlibrary(Rsubread)\n')
				to_eval_template <- paste0(to_eval_template,'## ## 00175 Remove duplicated reads
print("* Removing duplicated reads from _OUTPUT_BAM_...")
Rsubread::removeDupReads(input="_OUTPUT_BAM_", output="_OUTPUT_BAM_.tmp.bam", ',stringParamsRemoveDups,')
file.remove("_OUTPUT_BAM_")
file.remove("_OUTPUT_BAM_.bai")
file.rename("_OUTPUT_BAM_.tmp.bam", "_OUTPUT_BAM_")
Rsamtools::indexBam("_OUTPUT_BAM_")
param <- Rsamtools::ScanBamParam(flag=Rsamtools::scanBamFlag(isSecondaryAlignment=FALSE, isUnmappedQuery=FALSE),  what="seq") # REMOVE THIS LINE IN REPORT
NODUPS <<- Rsamtools::countBam("_OUTPUT_BAM_", param=param)[["records"]] # REMOVE THIS LINE IN REPORT\n
')
			}




			to_eval <- to_eval_template
			to_eval <- gsub('_GENOME_INDEX_PATH_FINAL_', genome_index_path_final, to_eval)
			to_eval <- gsub('_GENOME_INDEX_PATH_TEMP_' , genome_index_path_temp , to_eval)
			to_eval <- gsub('_GENOME_FILE_'            , genome_file            , to_eval)
			to_eval <- gsub('_BASENAME_GENOME_'        , basename_genome        , to_eval)
			to_eval <- gsub('_GENOME_INDEX_FINAL_'     , genome_index_final     , to_eval)
			to_eval <- gsub('_OUTPUT_SAM_'             , output_sam             , to_eval)
			to_eval <- gsub('_OUTPUT_BAM_'             , output_bam             , to_eval)
			to_eval <- gsub('_INPUT1_'                 , input1                 , to_eval)
			to_eval <- gsub('_INPUT2_'                 , input2                 , to_eval)
			to_eval <- gsub('_STRINGPARAMS_'           , stringParams           , to_eval)
			to_eval <- gsub('_USE_GFF_'                , use_gff                , to_eval)
			to_eval <- gsub('_TMP_GFF_'                , out_tmp                , to_eval)
			
			eval(parse(text=to_eval))
			## add some lines to command (no to be evaluated)
			
			to_eval_template <- paste0(to_eval_template,'## ## 00005 Uncompress input files if necessary\nprint("* Uncompressing input files (if necessary)...")
if (file.exists("_INPUT1_.gz") && !file.exists("_INPUT1_")) { R.utils::gunzip("_INPUT1_.gz", remove=FALSE) }
')
			if (newData$input2!=NOT_SELECTED) {
				to_eval_template <- paste0(to_eval_template,'if (file.exists("_INPUT2_.gz") && !file.exists("_INPUT2_")) { R.utils::gunzip("_INPUT2_.gz", remove=FALSE) }
')
			}
			to_eval_template <- paste0(to_eval_template,'if (file.exists("_GENOME_FILE_.gz") && !file.exists("_GENOME_FILE_")) { R.utils::gunzip("_GENOME_FILE_.gz", remove=FALSE) }
')

			if (file.exists(use_gff)) {
				to_eval_template <- paste0(to_eval_template,'if (file.exists("',use_gff,'.gz") && !file.exists("',use_gff,'")) { R.utils::gunzip("',use_gff,'.gz", remove=FALSE) }
')
			}
			
			CURRENT_COMMAND <<- to_eval_template
			CURRENT_COMMAND <<- gsub('_GENOME_INDEX_PATH_FINAL_', basename(genome_index_path_final)              , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_GENOME_INDEX_PATH_TEMP_' , basename(genome_index_path_temp)               , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_GENOME_FILE_'            , basename(genome_file)                          , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_BASENAME_GENOME_'         , basename(basename_genome)                      , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_GENOME_INDEX_FINAL_'     , paste0(basename(genome_file),".hisat2/",basename(genome_index_final)) , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_OUTPUT_SAM_'             , basename(output_sam)                           , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_OUTPUT_BAM_'             , basename(output_bam)                           , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_INPUT1_'                 , basename(input1)                               , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_INPUT2_'                 , basename(input2)                               , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_STRINGPARAMS_'           , stringParams                                   , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_TMP_GFF_'                , basename(out_tmp)                               , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_USE_GFF_'                , basename(use_gff)                               , CURRENT_COMMAND)
			
			fs::file_delete(paste0(output,".bai")) # we will index it later
			if (fs::file_exists(input1expanded)) { fs::file_delete(input1expanded) }
			if (fs::file_exists(input2expanded)) { fs::file_delete(input2expanded) }
			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}



	align_with_alignRsubread<-function(newData) {
		tryCatch({
			CURRENT_COMMAND <<-''

			stringParams=""
			for(sp in names(newData$common_params)) {
				theparam=subset(PARAMS_alignRsubread[["Param"]], PARAMS_alignRsubread["ID"]==sp)
				if (theparam=="BLANK") { theparam="" }
				if (stringParams=="") {
					stringParams=paste0(theparam,"=",newData$common_params[sp])
				}
				else {
					stringParams=paste0(stringParams,", ",theparam,"=",newData$common_params[sp])
				}
			}

			input1=paste0(projectDir,"/FASTQ/",basename(newData$input1))
			input2=paste0(projectDir,"/FASTQ/",basename(newData$input2))
			output=paste0(projectDir,"/temp/",basename(newData$output))	
			genome_file=paste0(projectDir,"/FASTA/",basename(newData$genome))
			genome_index_temp=paste0(projectDir,"/temp/alignRsubread/",basename(genome_file))
			genome_index_final=paste0(projectDir,"/FASTA/alignRsubread/",basename(genome_file))

			
			genome_index_path_temp=paste0(projectDir,"/temp/alignRsubread")
			genome_index_path_final=paste0(projectDir,"/FASTA/alignRsubread")
			
			to_eval_template=''
			
			to_eval_template=paste0(to_eval_template,'
if (!dir.exists("_GENOME_INDEX_PATH_FINAL")) {
	dir.create("_GENOME_INDEX_PATH_TEMP",showWarnings = FALSE,recursive=T)
	Rsubread::buildindex(basename="_GENOME_INDEX_TEMP_", reference="_GENOME_FILE_")
	fs::file_move("_GENOME_INDEX_PATH_TEMP_", "_GENOME_INDEX_PATH_FINAL_")
}\n')
			if (file.exists(input2)) {
				to_eval_template=paste0(to_eval_template, 'Rsubread::align(index="_GENOME_INDEX_FINAL_", output_file="_OUTPUT_", readfile1="_INPUT1_", readfile2="_INPUT2_", _STRINGPARAMS_)\n')
			}
			else {
				to_eval_template=paste0(to_eval_template, 'Rsubread::align(index="_GENOME_INDEX_FINAL_", output_file="_OUTPUT_", readfile1="_INPUT1_", _STRINGPARAMS_)\n')
			}
			
			to_eval <- to_eval_template
			to_eval <- gsub('_GENOME_INDEX_PATH_FINAL_', genome_index_path_final, to_eval)
			to_eval <- gsub('_GENOME_INDEX_PATH_TEMP_' , genome_index_path_temp , to_eval)
			to_eval <- gsub('_GENOME_INDEX_TEMP_'     , genome_index_temp      , to_eval)
			to_eval <- gsub('_GENOME_INDEX_FINAL_'    , genome_index_final     , to_eval)
			to_eval <- gsub('_GENOME_FILE_'           , genome_file            , to_eval)
			to_eval <- gsub('_OUTPUT_'                , output                 , to_eval)
			to_eval <- gsub('_INPUT1_'                , input1                 , to_eval)
			to_eval <- gsub('_INPUT2_'                , input2                 , to_eval)
			to_eval <- gsub('_STRINGPARAMS_'          , stringParams           , to_eval)
						
			eval(parse(text=to_eval))
			
			CURRENT_COMMAND <<- to_eval_template
			CURRENT_COMMAND <<- gsub('\tfile\\.rename\\("_GENOME_INDEX_PATH_TEMP_", "_GENOME_INDEX_PATH_FINAL_"\\)\n' , "", CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_GENOME_INDEX_PATH_FINAL_', basename(genome_index_path_final)              , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_GENOME_INDEX_PATH_TEMP_' , basename(genome_index_path_temp)               , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_GENOME_INDEX_TEMP_'      , paste0("alignRsubread/",basename(genome_index_temp))   , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_GENOME_INDEX_FINAL_'     , paste0("alignRsubread/",basename(genome_index_final))  , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_GENOME_FILE_'            , basename(genome_file)                          , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_OUTPUT_'                 , basename(output)                               , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_INPUT1_'                 , basename(input1)                               , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_INPUT2_'                 , basename(input2)                               , CURRENT_COMMAND)
			CURRENT_COMMAND <<- gsub('_STRINGPARAMS_'           , stringParams                                   , CURRENT_COMMAND)
			
			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			showNotification(toString(cond))
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	showNotification(toString(cond))
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}









	removedups_with_removeDupReads<-function(newData) {
		tryCatch({
			theinput=paste0(projectDir,"/ALIGNMENTS/",basename(newData$input))
			theoutput=paste0(projectDir,"/temp/",basename(newData$output))	
			stringParams=""
			for(sp in names(newData$common_params)) {
				theparam=subset(PARAMS_removeDupReads[["Param"]], PARAMS_removeDupReads["ID"]==sp)
				thevalue=newData$common_params[sp]
				skipif=subset(PARAMS_removeDupReads[["SkipIf"]], PARAMS_removeDupReads["ID"]==sp)
				if (thevalue != skipif) {
					if (theparam=="BLANK") { theparam="" }
					if (stringParams=="") {
						stringParams=paste0(theparam,"=",thevalue)
					}
					else {
						stringParams=paste0(stringParams,", ",theparam,"=",thevalue)
					}
				}
			}
			to_eval='## ## 00000 Load libraries\nlibrary(Rsubread)\n'
			to_eval=paste0(to_eval,'## ## 00175 Remove duplicated reads
Rsubread::removeDupReads(input="',theinput,'", output="',paste0(theoutput,".tmp"),'", ',stringParams,')
fs::file_move("',paste0(theoutput,".tmp"),'", "',theoutput,'")
')
			eval(parse(text=to_eval))
			
			#showNotification(toString(to_eval))
			CURRENT_COMMAND <<- to_eval
			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			showNotification(toString(cond))
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	showNotification(toString(cond))
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}
	
	
	quantify_with_featureCounts<-function(newData) {
		#delete_temp_folder()
		tryCatch({
			CURRENT_COMMAND <<- ""

			stringParams=""
			for(sp in names(newData$common_params)) {
				theparam=subset(PARAMS_featureCounts[["Param"]], PARAMS_featureCounts["ID"]==sp)
				thevalue=newData$common_params[sp]
				skipif=subset(PARAMS_featureCounts[["SkipIf"]], PARAMS_featureCounts["ID"]==sp)
				if (thevalue != skipif) {
					if (theparam=="BLANK") { theparam="" }
					if (stringParams=="") {
						stringParams=paste0(theparam,"=",thevalue)
					}
					else {
						stringParams=paste0(stringParams,", ",theparam,"=",thevalue)
					}
				}
			}

			theinput=paste0(projectDir,"/ALIGNMENTS/",basename(newData$input))
			theoutput=paste0(projectDir,"/temp/",basename(newData$output))	
			PATHSFILE=paste0(projectDir,"/GFF/",basename(newData$gff),".paths")	
			GFFFILE=paste0(projectDir,"/GFF/",basename(newData$gff))
			SAFFILE=paste0(projectDir,"/temp/",basename(newData$gff))
			#SAFFILE=gsub('\\.gff\\d*$','',SAFFILE, perl=TRUE)
			feature_and_block <-"c("
			for(fb in names(newData$features_blocks)) {
				if (feature_and_block!="c(") { feature_and_block=paste0(feature_and_block,",") }
				if (newData$features_blocks[fb]==NOT_SELECTED) {
					feature_and_block<-paste0(feature_and_block,"'",fb,"'")	
					SAFFILE=paste0(projectDir,"/temp/",basename(SAFFILE),".",fb);
				}
				else {
					feature_and_block<-paste0(feature_and_block,"'",fb," > ",newData$features_blocks[fb],"'")	
					SAFFILE=paste0(projectDir,"/temp/",basename(SAFFILE),".",fb,"-",newData$features_blocks[fb]);
				}
			}
			feature_and_block<-paste0(feature_and_block,")")
			SAFFILE=paste0(SAFFILE,".saf")
			
			if (file.exists(SAFFILE)) {
			}
			else {	
#				nfb=0
#				for(fb in names(newData$features_blocks)) {
#					thefeature=fb
#					theblock=newData$features_blocks[fb]
#					if (theblock==NOT_SELECTED) {
#						tmpSAF=SAFfromPATHS(file=PATHSFILE, groupBy=thefeature, block="NOBLOCK")
#					}
#					else {
#						tmpSAF=SAFfromPATHS(file=PATHSFILE, groupBy=thefeature, block=theblock)
#					}
#					if (nfb==0) {
#						SAF=tmpSAF
#					}
#					else {
#						SAF=rbind(SAF,tmpSAF)
#					}
#					nfb=nfb+1
#				}	
#				utils::write.table(SAF,file=SAFFILE, row.names=FALSE, quote=FALSE, sep="\t")
			}
			# to_eval will be a vector
			
			ISPAIRED=testPairedEndBam(theinput)

to_eval<-paste0('## ## 00000 Load libraries\nlibrary(Rgff)\nlibrary(R.utils)\n## ## 00200 Create SAF file if required
if (!file.exists("',SAFFILE,'")) {			
	print("* Create saf file from _',GFFFILE,'...")
	Rgff::saf_from_gff("',GFFFILE,'", features=',feature_and_block,', outFile="',SAFFILE,'")
}#REMOVE THIS STRING close saf_from_gff
## ## 00000 Load libraries\nlibrary(Rsubread)
## ## 00250 Quantify genomic elements with featureCounts
print("* Quantifying ',feature_and_block,' from ',theinput,'...")
countsData<-Rsubread::featureCounts(annot.ext="',SAFFILE,'", isGTFAnnotationFile=FALSE, files="',theinput,'", isPairedEnd=',ISPAIRED,', ', stringParams,')
utils::write.table(countsData$counts,file="',theoutput,'", append = FALSE, sep = "\t", col.names=F,row.names = TRUE, quote=FALSE)\n')
			eval(parse(text=to_eval))
			
			## add some lines to command (no to be evaluated)
			
			to_eval <- paste0(to_eval,'## ## 00005 Uncompress input files if necessary\nprint("* Uncompressing input files (if necessary)...")
if (file.exists("',GFFFILE,'.gz") && !file.exists("',GFFFILE,'")) { R.utils::gunzip("',GFFFILE,'.gz", remove=FALSE) }
')			

			CURRENT_COMMAND <<- to_eval
			#showNotification(toString(to_eval))
			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			showNotification(toString(cond))
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	showNotification(toString(cond))
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}


	CURRENT_COMMAND <<- ""
	compare_with_DESeq2<-function(newData) {
		delete_temp_folder()
		tryCatch({
			CURRENT_COMMAND <<- ""

			stringParamsResults=""
			stringParamsDESeq=""
			for(sp in names(newData$common_params)) {
				theparam=subset(PARAMS_DESeq2[["Param"]], PARAMS_DESeq2["ID"]==sp)
				thevalue=newData$common_params[sp]
				skipif=subset(PARAMS_DESeq2[["SkipIf"]], PARAMS_DESeq2["ID"]==sp)
				if (thevalue != skipif) {
					if (theparam=="BLANK") { theparam="" }
					if (grepl("DESeq_", sp)) {
						stringParamsDESeq=paste0(stringParamsDESeq,", ",theparam,"=",thevalue)
					}
					else {
						stringParamsResults=paste0(stringParamsResults,", ",theparam,"=",thevalue)
					}
				}
			}

			output_file=newData$output_file
			folder_reps=newData$folder_reps
			numerator_reps=newData$numerator_reps
			denominator_reps=newData$denominator_reps
			numerator_label=newData$numerator_label	
			denominator_label=newData$denominator_label	

			METADATA <- get_MetadataFileList(myDfFiles$files, denominator_reps, numerator_reps, denominator_label, numerator_label, DisplayFirstExperimentCounts=FALSE)
			to_eval <- '## ## 00000 Load libraries\nlibrary(DESeq2)\nlibrary(openxlsx)\nlibrary(dplyr)\n'
			to_eval <- paste0(to_eval,'## ## 00300 Create decoder table
print("* Calculating differential expression for comparison: ',numerator_label,' vs ',denominator_label,'...")
decoder <- data.frame(sample=character(), counts=character(), condition=character(), alignment=character(), reference=character(), annotations=character(), features=character(), reads=character(), stringsAsFactors=FALSE)
')
			to_eval_rawnames <- 'c('
			to_eval_normnames <- 'c('
			i = 1
			ii=1
			for(thefile in denominator_reps) {
				bamFile=METADATA$BAM$BAM_FILE[ii]
				fastaFile=METADATA$FASTA[ii]
				fastqFile=METADATA$FASTQ[ii]
				gffFile=METADATA$ANNOT$ANNOT_FILE[ii]
				featuresKey=gsub("\\."," and ",METADATA$ANNOT$ANNOT_FEATURE[ii])
				ii=ii+1
				fName=thefile
				if (i == 1) {
					SAF <- gsub("\\./COUNTS/(.+)/.+","\\1",fName)
					if (grepl("\\.gff3?\\..+\\.saf", SAF)) {
						GFF <- paste0(projectDir,"/GFF/",gsub("(\\.gff3?)\\..+","\\1",SAF))
						the_features <- gsub("^.+\\.gff3?\\.(.+)\\.saf","\\1",SAF)
						the_features <- gsub("\\.","|",the_features)
						the_features <- gsub("-[^\\|]+","",the_features)
					}
					else if (grepl("\\.gtf\\..+\\.saf", SAF)) {
						GFF <- paste0(projectDir,"/GFF/",gsub("(\\.gtf)\\..+","\\1",SAF))
						the_features <- gsub("^.+\\.gtf\\.(.+)\\.saf","\\1",SAF)
						the_features <- gsub("\\.","|",the_features)
						the_features <- gsub("-[^\\|]+","",the_features)
					}
				}
				if(file.exists(paste0(projectDir,"/",fName))) {
					sampleName <- gsub(".counts$", "", basename(thefile))
					to_eval<-paste0(to_eval,'decoder[nrow(decoder)+1,] <- c("',sampleName,'", "',fName,'", "',denominator_label,'", "',bamFile,'", "',fastaFile,'", "',gffFile,'", "',featuresKey,'", "',fastqFile,'")\n')
					if (to_eval_rawnames != 'c(') {
						to_eval_rawnames <- paste0(to_eval_rawnames,', ')
						to_eval_normnames <- paste0(to_eval_normnames,', ')
					}
					to_eval_rawnames<-paste0(to_eval_rawnames,'"Raw(',sampleName,')"')
					to_eval_normnames<-paste0(to_eval_normnames,'"Norm(',sampleName,')"')
					i = i+1
				} else {
					print(paste0("ERROR! Missing file: ",fName))
				}
			}
			i = 1
			for(thefile in numerator_reps) {
				fName=thefile
				bamFile=METADATA$BAM$BAM_FILE[ii]
				fastaFile=METADATA$FASTA[ii]
				gffFile=METADATA$ANNOT$ANNOT_FILE[ii]
				fastqFile=METADATA$FASTQ[ii]
				featuresKey=gsub("\\."," and ",METADATA$ANNOT$ANNOT_FEATURE[ii])
				ii=ii+1
				if(file.exists(paste0(projectDir,"/",fName))) {
					sampleName <- gsub(".counts$", "", basename(thefile))
					to_eval<-paste0(to_eval,'decoder[nrow(decoder)+1,] <- c("',sampleName,'", "',fName,'", "',numerator_label,'", "',bamFile,'", "',fastaFile,'", "',gffFile,'", "',featuresKey,'", "',fastqFile,'")\n')
					to_eval_rawnames<-paste0(to_eval_rawnames,', "Raw(',sampleName,')"')
					to_eval_normnames<-paste0(to_eval_normnames,', "Norm(',sampleName,')"')
					i = i+1
				} else {
					print(paste0("ERROR! Missing file: ",fName))
				}
			}
			
			annots_file=paste0(projectDir,"/",newData$annots_file)
			if (file.exists(annots_file)) {
				if (grepl("\\.xlsx?$", annots_file)) {
					readTheTableCommand=paste0("ANNOTS_FILE_CONTENT <- openxlsx::read.xlsx('",annots_file,"')")
				}
				else {
					readTheTableCommand=paste0("ANNOTS_FILE_CONTENT <- utils::read.table('",annots_file,"', sep='\t', header=TRUE, quote='', comment.char = '')")
				}
				code_to_add_annots=paste0("## ## 00383 Create additional annotation columns from ann file
",readTheTableCommand,"
## ## 00384 Remove problematic characters in annotations
ANNOTS_FILE_CONTENT <- as.data.frame(lapply(ANNOTS_FILE_CONTENT, function(y) gsub('[`\\\\]', '', y)))

# Merge annotations file with final gene ids.
ANNOTS <- dplyr::left_join(x=data.frame(ID=row.names(res)), y=ANNOTS_FILE_CONTENT, by=c('ID' = colnames(ANNOTS_FILE_CONTENT)[1]))

# Remove first column
ANNOTS <- ANNOTS %>% select(-1)

")
				annot_columns=" ANNOTS,"
			}
			else {
				code_to_add_annots=""
				annot_columns=""
			}
			
			
			decoder_file <- paste0(gsub('.xlsx$','',output_file),'.decoder.tsv')
			to_eval_rawnames <- paste0(to_eval_rawnames,')')
			to_eval_normnames <- paste0(to_eval_normnames,')')
			to_eval <- paste0(to_eval,"decoder$condition <- factor(decoder$condition)
pdecoder <- decoder # REMOVE THIS LINE
pdecoder[] <- lapply(pdecoder, function(y) gsub('\\\\.\\\\/\\\\S+\\\\/','', y)) # REMOVE THIS LINE
utils::write.table(pdecoder, file='",projectDir,"/temp/",decoder_file,"', sep='\t', row.names=FALSE, quote=FALSE) # REMOVE THIS LINE
## ## 00350 Read raw counts from files
dds <-  DESeq2::DESeqDataSetFromHTSeqCount(sampleTable = decoder, directory = '",projectDir,"', design = ~ condition)
## ## 00375 Apply DESeq2 functions to detect differentially expressed features
dds <- DESeq2::DESeq(dds",stringParamsDESeq,")
res <- DESeq2::results(dds, contrast=c('condition', '",numerator_label,"', '",denominator_label,"')",stringParamsResults,")
row.names(res) <- gsub('^[^\\t ]+:','',row.names(res)) # removing possible ID prefixes present in ENSEMBL gff files (e.g. 'gene:')
## ## 00377 Extract feature coordinates from paths file
PATHLINES <- grep('.+\\t(",the_features,");', readLines('",GFF,".paths'), value=TRUE)
PATHDATA <- gsub('^([^\\t]+)\\t([^\\t]+)\\t([^\\t]+)\\t([^\\t]+)\\t([^;]+);([^;]+)(.*)', '\\\\6\\t\\\\5\\t\\\\1:\\\\2-\\\\3\\t\\\\4', PATHLINES, perl=TRUE)
PATHDATA <- unique(PATHDATA)
TheID <- gsub('\\t.+', '', PATHDATA)
TheID <- gsub('^[^\\t ]+:','', TheID) # removing possible ID prefixes present in ENSEMBL gff files (e.g. 'gene:')
TheType <- gsub('^[^\\t]+\\t([^\\t]+)\\t.+', '\\\\1', PATHDATA)
TheLocation <- gsub('^[^\\t]+\\t[^\\t]+\\t([^\\t]+)\\t.+', '\\\\1', PATHDATA)
TheStrand <- gsub('^[^\\t]+\\t[^\\t]+\\t[^\\t]+\\t', '', PATHDATA)
DETAILS <- data.frame(ID=TheID, Type=TheType, Location=TheLocation, Strand=TheStrand)

# Aggregate discontinuous elements (eg. CDS)
DETAILS <- DETAILS %>% dplyr::group_by(ID,Type,Strand) %>% dplyr::summarise(Location=paste(Location,collapse=';')) %>% dplyr::relocate(Location, .before = Strand)

## ## 00380 Create ID Type and Location columns
ID_Type_Location <- dplyr::left_join(x=data.frame(ID=row.names(res)), y=DETAILS, by=c('ID' = 'ID'))
",code_to_add_annots,"## ## 00385 Format differential expression columns
suppressWarnings( # REMOVE THIS LINE
Log2BaseMean    <- data.frame(Log2BaseMean=apply(res['baseMean'], 1, function(x) { as.numeric(sprintf('%0.2f', log2(x))) }))
) # REMOVE THIS LINE
suppressWarnings( # REMOVE THIS LINE
Log2Ratio       <- data.frame(Log2Ratio=apply(res['log2FoldChange'], 1, function(x) { as.numeric(sprintf('%0.2f',x)) }))
) # REMOVE THIS LINE
suppressWarnings( # REMOVE THIS LINE
FoldChange      <- data.frame(FoldChange=apply(res['log2FoldChange'], 1, function(x) { ifelse(x<0, as.numeric(sprintf('%0.2f',-2**-x)), as.numeric(sprintf('%0.2f',2**x))) } ))
) # REMOVE THIS LINE
suppressWarnings( # REMOVE THIS LINE
StdErrLog2Ratio <- data.frame(StdErrLog2Ratio=apply(res['lfcSE'], 1, function(x) { as.numeric(sprintf('%0.2f',x)) }))
) # REMOVE THIS LINE
pvalue         <- res['pvalue']
padjusted      <- res['padj']
RawCounts      <- counts(dds, normalized = FALSE)
NormCounts     <- round(counts(dds, normalized = TRUE), digits=2)
colnames(pvalue)     <- 'P-value'
colnames(padjusted)  <- 'P-adjusted'
colnames(Log2Ratio)   <- 'Log2Ratio(",numerator_label,"/",denominator_label,")'
colnames(FoldChange)   <- 'FoldChange(",numerator_label,"/",denominator_label,")'
colnames(StdErrLog2Ratio) <- 'StdErr(Log2Ratio)'
colnames(RawCounts)  <- ",to_eval_rawnames,"
colnames(NormCounts) <- ",to_eval_normnames,"
## ## 0390 Create differential expression table
final <- data.frame(ID_Type_Location, Log2BaseMean, Log2Ratio, StdErrLog2Ratio, FoldChange, pvalue, padjusted,",annot_columns," RawCounts, NormCounts, check.names=FALSE)
openxlsx::write.xlsx(file='",paste0(projectDir, '/temp/', output_file),"', final, showNA = TRUE)
")

			eval(parse(text=to_eval))
			
			# create html version (FIESTA)
			
			create_FIESTA_from_DiffExpTable(paste0(projectDir, '/temp/', output_file), paste0(projectDir,"/temp/",decoder_file))

			
			CURRENT_COMMAND <<- to_eval
			
			#showNotification(toString(to_eval))
			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			showNotification(toString(cond))
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	showNotification(toString(cond))
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}
	

	compare_with_edgeR<-function(newData) {
		delete_temp_folder()
		tryCatch({
			CURRENT_COMMAND <<- ""
			output_file=newData$output_file
			folder_reps=newData$folder_reps
			numerator_reps=newData$numerator_reps
			denominator_reps=newData$denominator_reps
			numerator_label=newData$numerator_label	
			denominator_label=newData$denominator_label	
			stringParams=""
			for(sp in names(newData$common_params)) {
				theparam=subset(PARAMS_edgeR[["Param"]], PARAMS_edgeR["ID"]==sp)
				thevalue=newData$common_params[sp]
				skipif=subset(PARAMS_edgeR[["SkipIf"]], PARAMS_edgeR["ID"]==sp)
				if (thevalue != skipif) {
					if (theparam=="BLANK") { theparam="" }
					stringParams=paste0(stringParams,", ",theparam,"=",thevalue)
				}
			}

			METADATA <- get_MetadataFileList(myDfFiles$files, denominator_reps, numerator_reps, denominator_label, numerator_label, DisplayFirstExperimentCounts=FALSE)
			to_eval <- '## ## 00000 Load libraries\nlibrary(edgeR)\nlibrary(openxlsx)\nlibrary(dplyr)\n'
			to_eval <- paste0(to_eval, '## ## 00300 Create decoder table
print("* Calculating differential expression for comparison: ',numerator_label,' vs ',denominator_label,'...")
decoder <- data.frame(sample=character(), counts=character(), condition=character(), alignment=character(), reference=character(), annotations=character(), features=character(), reads=character(), stringsAsFactors=FALSE)

')
			to_eval_rawnames <- 'c('
			to_eval_normnames <- 'c('
			i = 1
			ii=1
			for(thefile in denominator_reps) {
				bamFile=METADATA$BAM$BAM_FILE[ii]
				fastaFile=METADATA$FASTA[ii]
				fastqFile=METADATA$FASTQ[ii]
				gffFile=METADATA$ANNOT$ANNOT_FILE[ii]
				featuresKey=gsub("\\."," and ",METADATA$ANNOT$ANNOT_FEATURE[ii])
				ii=ii+1
				fName=thefile
				if (i == 1) {
					SAF <- gsub("\\./COUNTS/(.+)/.+","\\1",fName)
					if (grepl("\\.gff3?\\..+\\.saf", SAF)) {
						GFF <- paste0(projectDir,"/GFF/",gsub("(\\.gff3?)\\..+","\\1",SAF))
						the_features <- gsub("^.+\\.gff3?\\.(.+)\\.saf","\\1",SAF)
						the_features <- gsub("\\.","|",the_features)
						the_features <- gsub("-[^\\|]+","",the_features)
					}
					else if (grepl("\\.gtf\\..+\\.saf", SAF)) {
						GFF <- paste0(projectDir,"/GFF/",gsub("(\\.gtf)\\..+","\\1",SAF))
						the_features <- gsub("^.+\\.gtf\\.(.+)\\.saf","\\1",SAF)
						the_features <- gsub("\\.","|",the_features)
						the_features <- gsub("-[^\\|]+","",the_features)
					}
				}
				if(file.exists(paste0(projectDir,"/",fName))) {
					sampleName <- gsub(".counts$", "", basename(thefile))
					to_eval<-paste0(to_eval,'decoder[nrow(decoder)+1,] <- c("',sampleName,'", "',fName,'", "',denominator_label,'", "',bamFile,'", "',fastaFile,'", "',gffFile,'", "',featuresKey,'", "',fastqFile,'")\n')
					if (to_eval_rawnames != 'c(') {
						to_eval_rawnames <- paste0(to_eval_rawnames,', ')
						to_eval_normnames <- paste0(to_eval_normnames,', ')
					}
					to_eval_rawnames<-paste0(to_eval_rawnames,'"Raw(',sampleName,')"')
					to_eval_normnames<-paste0(to_eval_normnames,'"Norm(',sampleName,')"')
					i = i+1
				} else {
					print(paste0("ERROR! Missing file: ",fName))
				}
			}
			i = 1
			for(thefile in numerator_reps) {
				fName=thefile
				bamFile=METADATA$BAM$BAM_FILE[ii]
				fastaFile=METADATA$FASTA[ii]
				gffFile=METADATA$ANNOT$ANNOT_FILE[ii]
				fastqFile=METADATA$FASTQ[ii]
				featuresKey=gsub("\\."," and ",METADATA$ANNOT$ANNOT_FEATURE[ii])
				ii=ii+1
				if(file.exists(paste0(projectDir,"/",fName))) {
					sampleName <- gsub(".counts$", "", basename(thefile))
					to_eval<-paste0(to_eval,'decoder[nrow(decoder)+1,] <- c("',sampleName,'", "',fName,'", "',numerator_label,'", "',bamFile,'", "',fastaFile,'", "',gffFile,'", "',featuresKey,'", "',fastqFile,'")\n')
					to_eval_rawnames<-paste0(to_eval_rawnames,', "Raw(',sampleName,')"')
					to_eval_normnames<-paste0(to_eval_normnames,', "Norm(',sampleName,')"')
					i = i+1
				} else {
					print(paste0("ERROR! Missing file: ",fName))
				}
			}
			
			annots_file=paste0(projectDir,"/",newData$annots_file)
			if (file.exists(annots_file)) {
				if (grepl("\\.xlsx?$", annots_file)) {
					readTheTableCommand=paste0("ANNOTS_FILE_CONTENT <- openxlsx::read.xlsx('",annots_file,"', check.names=FALSE)")
				}
				else {
					readTheTableCommand=paste0("ANNOTS_FILE_CONTENT <- utils::read.table('",annots_file,"', sep='\t', header=TRUE, quote='', comment.char = '', check.names=FALSE)")
				}
				code_to_add_annots=paste0("## ## 00383 Create additional annotation columns from ann file
",readTheTableCommand,"
## ## 00384 Remove problematic characters in annotations
ANNOTS_FILE_CONTENT <- as.data.frame(lapply(ANNOTS_FILE_CONTENT, function(y) gsub('[`\\\\]', '', y)))

# Merge annotations file with final gene ids.
ANNOTS <- dplyr::left_join(x=data.frame(ID=row.names(res$table)), y=ANNOTS_FILE_CONTENT, by=c('ID' = colnames(ANNOTS_FILE_CONTENT)[1]))

# Remove first column
ANNOTS <- ANNOTS %>% select(-1)
")
				annot_columns=" ANNOTS,"
			}
			else {
				code_to_add_annots=""
				annot_columns=""
			}			
			
			decoder_file <- paste0(gsub('.xlsx$','',output_file),'.decoder.tsv')
			to_eval_rawnames <- paste0(to_eval_rawnames,')')
			to_eval_normnames <- paste0(to_eval_normnames,')')
			to_eval <- paste0(to_eval, "decoder$condition <- factor(decoder$condition)
pdecoder <- decoder # REMOVE THIS LINE
pdecoder[] <- lapply(pdecoder, function(y) gsub('\\\\.\\\\/\\\\S+\\\\/','', y)) # REMOVE THIS LINE
utils::write.table(pdecoder, file='",projectDir,"/temp/",decoder_file,"', sep='\t', row.names=FALSE, quote=FALSE) # REMOVE THIS LINE
## ## 00350 Read raw counts from files
fg <- data.frame(files = decoder$counts, group = decoder$condition)
## ## 00375 Apply edgeR functions to detect differentially expressed elements
d <- edgeR::readDGE(fg, path = '",projectDir,"', labels = decoder$sample, header = FALSE)
d <- edgeR::estimateCommonDisp(d)
d <- edgeR::estimateTagwiseDisp(d)
et <- edgeR::exactTest(d, pair = c('",denominator_label,"', '",numerator_label,"')",stringParams,")
res <- edgeR::topTags(et, n = 100000000000, adjust.method = 'BH', sort.by = 'none', p.value = 100)
row.names(res$table) <- gsub('^[^\\t ]+:','',row.names(res$table)) # removing possible ID prefixes present in ENSEMBL gff files (e.g. 'gene:')
## ## 00377 Extract feature coordinates from paths file
PATHLINES <- grep('.+\\t(",the_features,");', readLines('",GFF,".paths'), value=TRUE)
PATHDATA <- gsub('^([^\\t]+)\\t([^\\t]+)\\t([^\\t]+)\\t([^\\t]+)\\t([^;]+);([^;]+)(.*)', '\\\\6\\t\\\\5\\t\\\\1:\\\\2-\\\\3\\t\\\\4', PATHLINES, perl=TRUE)
PATHDATA <- unique(PATHDATA)
TheID <- gsub('\\t.+', '', PATHDATA)
TheID <- gsub('^[^\\t ]+:','', TheID) # removing possible ID prefixes present in ENSEMBL gff files (e.g. 'gene:')
TheType <- gsub('^[^\\t]+\\t([^\\t]+)\\t.+', '\\\\1', PATHDATA)
TheLocation <- gsub('^[^\\t]+\\t[^\\t]+\\t([^\\t]+)\\t.+', '\\\\1', PATHDATA)
TheStrand <- gsub('^[^\\t]+\\t[^\\t]+\\t[^\\t]+\\t', '', PATHDATA)
DETAILS <- data.frame(ID=TheID, Type=TheType, Location=TheLocation, Strand=TheStrand)

# Aggregate discontinuous elements (eg. CDS)
DETAILS <- DETAILS %>% dplyr::group_by(ID,Type,Strand) %>% dplyr::summarise(Location=paste(Location,collapse=';')) %>% dplyr::relocate(Location, .before = Strand)
## ## 00380 Create ID Type and Location columns
ID_Type_Location <- dplyr::left_join(x=data.frame(ID=row.names(res$table)), y=DETAILS, by=c('ID' = 'ID'))
",code_to_add_annots,"## ## 00385 Format differential expression columns
suppressWarnings( # REMOVE THIS LINE
Log2BaseMean    <- data.frame(Log2BaseMean=apply(res$table['logCPM'], 1, function(x) { as.numeric(sprintf('%0.2f', log2(x))) }))
) # REMOVE THIS LINE
suppressWarnings( # REMOVE THIS LINE
Log2Ratio       <- data.frame(Log2Ratio=apply(res$table['logFC'], 1, function(x) { as.numeric(sprintf('%0.2f',x)) }))
) # REMOVE THIS LINE
suppressWarnings( # REMOVE THIS LINE
FoldChange      <- data.frame(FoldChange=apply(res$table['logFC'], 1, function(x) { ifelse(x<0, as.numeric(sprintf('%0.2f',-2**-x)), as.numeric(sprintf('%0.2f',2**x))) } ))
) # REMOVE THIS LINE
pvalue         <- res$table['PValue']
padjusted      <- res$table['FDR']
RawCounts      <- d$counts
NormCounts     <- round(cpm(d), digits=2)
colnames(pvalue)     <- 'P-value'
colnames(padjusted)  <- 'P-adjusted'
colnames(Log2Ratio)   <- 'Log2Ratio(",numerator_label,"/",denominator_label,")'
colnames(FoldChange)   <- 'FoldChange(",numerator_label,"/",denominator_label,")'
colnames(RawCounts)  <- ",to_eval_rawnames,"
colnames(NormCounts) <- ",to_eval_normnames,"
## ## 0390 Create differential expression table
final <- data.frame(ID_Type_Location, Log2BaseMean, Log2Ratio, FoldChange, pvalue, padjusted,",annot_columns," RawCounts, NormCounts, check.names=FALSE)
openxlsx::write.xlsx(file='",paste0(projectDir, '/temp/', output_file),"', final, showNA = TRUE)
")

			eval(parse(text=to_eval))

			# create html version (FIESTA)
			
			create_FIESTA_from_DiffExpTable(paste0(projectDir, '/temp/', output_file), paste0(projectDir,"/temp/",decoder_file))
			
			CURRENT_COMMAND <<- to_eval

			
			#showNotification(toString(to_eval))
			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			showNotification(toString(cond))
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	showNotification(toString(cond))
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}




	create_FIESTA_from_DiffExpTable<-function(input, details) {
		output=gsub("\\.xlsx?$","", input)
		output=paste0(output,".js")
		
		fileConn=file(output, "w+")

		myparams=paste0("_PARAMS.fname=\"",basename(input),"\"; _PARAMS.X=5; _PARAMS.Y=6; _PARAMS.XERR=-1; _PARAMS.YERR=-1; _PARAMS.max_in_plot[6]=5; _PARAMS.min_in_plot[6]=-5;")
		if (file.exists(details)) {
			myparams=paste0(myparams,"\n_PARAMS.DETAILS=`",readChar(details, file.info(details)$size),"`;")
		}
		else {
			myparams=paste0(myparams,"\n_PARAMS.DETAILS=``;")
		}
		writeLines(myparams, fileConn)
		
		if (grepl("\\.xlsx?$", input)) {
			mydata <- openxlsx::read.xlsx(input, check.names=FALSE)
		}
		else {
			mydata <- utils::read.table(input, sep="\t", header=TRUE, quote="", check.names=FALSE)
		}
		mydata <- cbind(trimws(seq.int(from=1, to=nrow(mydata))), mydata)
		
		mydata[2]<-apply(mydata, 1, function(x) {
			x[2]=paste0("_DATA[",trimws(x[1]),"]=`",x[2]);
		})

		mydata[ncol(mydata)]=paste0(mydata[[ncol(mydata)]],"`;")
		mydata<-mydata[, 2:ncol(mydata)]
		colnames(mydata)[[1]]=paste0("_DATA[0]=`",colnames(mydata)[[1]]);
		colnames(mydata)[[ncol(mydata)]]=paste0(colnames(mydata)[[ncol(mydata)]],"`;")
		utils::write.table(rbind(colnames(mydata),mydata), fileConn, sep="\t", col.names=FALSE, row.names=FALSE, quote=FALSE, append=TRUE)
		close(fileConn)
		
		HTML <- paste(readLines("www/FIESTA2.0/index_part1.html"), collapse="\n")
		HTML <- paste0(HTML, paste(readLines(output), collapse="\n"))
		HTML <- paste0(HTML, paste(readLines("www/FIESTA2.0/index_part2.html"), collapse="\n"))
		writeLines(HTML, con=paste0(input, ".FIESTA.html"))
		file.remove(output)
	}

	# after loading to a internal temp folder (datapath):
	download_this_file<-function(newData) {
		newData=as.list(newData)
		message(newData)
		tryCatch({
			tmpProject=paste0(projectDir,"/temp/",newData$fname)
			if(tmpProject != newData$datapath){
				message(paste0("WARNING: Different paths for download: ",newData$datapath," != ",tmpProject))
			}
			message(paste0("Downloading ",newData$url," to ", tmpProject))
			downloadResult<-utils::download.file(url=newData$url, destfile=tmpProject)
			message(paste0("Download result: ",downloadResult))
			if(!file.exists(tmpProject)){
				stop(paste0("Unable to download this file! Source: ",newData$url," -  Destination:",tmpProject))
			}
			stepDone("success","OK") 
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}
	
	# after loading to a internal temp folder (datapath):
	initialize_this_file<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tmpProject=paste0(projectDir,"/temp/",newData$fname)
			fs::file_move(newData$datapath,tmpProject)
			knowFileType<-apply(fileTypes,1,function(x){listexp=unlist(strsplit(c(x[4])," ")); any(sapply(listexp,function(x){grepl(paste0("\\.",x,"$"),newData$fname,perl=T)}))})
			newData$fname=tmpProject;
			
			
			baseNameNoGZ=gsub("\\.gz$","",basename(newData$fname))
			myFilesNoGZ=gsub("\\.gz$","",myDfFiles$files$fname)
			baseNameNoGZ=gsub("\\.sam$", ".bam", baseNameNoGZ) # to avoid load sam file already converted to bam
			if(any(myFilesNoGZ==baseNameNoGZ)){
				checkResult<-paste0("File (",baseNameNoGZ,") already present in the project.<br>")
				stop(checkResult, call.=FALSE)
			}

			
			if(any(knowFileType)){
				currentType<-fileTypes[which(knowFileType)[1],]
				if (currentType[1]=="bam") {
					initialize_BAM_file(newData);
				}
				else if (currentType[1]=="fasta") {
					initialize_FASTA_file(newData);
				}
				else if (currentType[1]=="fastq") {
					initialize_FASTQ_file(newData);
				}
				else if (currentType[1]=="gff") {
					initialize_GFF_file(newData);
				}
				else if (currentType[1]=="ann") {
					initialize_ANN_file(newData);
				}
				else {
					stop("Unable to load this file! Unknown file type.");
				}
			}
			else {
				stop("Unable to load this file! Unknown file type.");
			}
		#	stepDone("success","OK") # commented because each file type has its own "StepDone"
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}


	# after loading to a internal temp folder (datapath):
	create_accessory_files_for_this_one<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tmpProject=paste0(projectDir,"/temp/",newData$fname)
			knowFileType<-apply(fileTypes,1,function(x){listexp=unlist(strsplit(c(x[4])," ")); any(sapply(listexp,function(x){grepl(paste0("\\.",x,"$"),newData$fname,perl=T)}))})
			newData$fname=tmpProject;
			
			
			if(any(knowFileType)){
				currentType<-fileTypes[which(knowFileType)[1],]
				if (currentType[1]=="bam") {
					create_accessory_files_for_BAM(newData);
				}
				else if (currentType[1]=="fasta") {
					create_accessory_files_for_FASTA(newData);
				}
				else if (currentType[1]=="fastq") {
					create_accessory_files_for_FASTQ(newData);
				}
				else if (currentType[1]=="gff") {
					create_accessory_files_for_GFF(newData);
				}
				else if (currentType[1]=="ann") {
					create_accessory_files_for_ANN(newData);
				}
			}
#			else {
#				create_accessory_files_for_OTHER(newData);
#			}
		#	stepDone("success","OK") # commented because each file type has its own "StepDone"
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}


	
	# after loading to a internal temp folder (datapath):
	add_this_file_to_project<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tmpProject=paste0(projectDir,"/temp/",newData$fname)
			knowFileType<-apply(fileTypes,1,function(x){listexp=unlist(strsplit(c(x[4])," ")); any(sapply(listexp,function(x){grepl(paste0("\\.",x,"$"),newData$fname,perl=T)}))})
			newData$fname=tmpProject;

			if(any(knowFileType)){
				currentType<-fileTypes[which(knowFileType)[1],]
				if (currentType[1]=="bam") {
					add_BAM_to_project(newData);
				}
				else if (currentType[1]=="fasta") {
					add_FASTA_to_project(newData);
				}
				else if (currentType[1]=="fastq") {
					add_FASTQ_to_project(newData);
				}
				else if (currentType[1]=="gff") {
					add_GFF_to_project(newData);
				}
				else if (currentType[1]=="ann") {
					add_ANN_to_project(newData);
				}
			}
#			else {
#				add_OTHER_to_project(newData);
#			}
		#	stepDone("success","OK") # commented because each file type has its own "StepDone"
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}
	








	add_file_to_zip<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath     = paste0(projectDir,"/temp/",basename(newData$zipname))

			relativeFilePath = paste0(projectDir,"/",newData$todownload)
			if (file.exists(tempPath)) {
				zip::zipr_append(tempPath,relativeFilePath);
			}
			else {
				zip::zipr(tempPath,relativeFilePath);
			}
			if (newData$ftype=="bam") {
				zip::zipr_append(tempPath,paste0(relativeFilePath,".bai"));
			}
			if (file.exists(paste0(relativeFilePath,".R"))) {
				zip::zipr_append(tempPath,paste0(relativeFilePath,".R"));
			}

			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}
	
		add_file_to_zip_and_download_it<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath     = paste0(projectDir,"/temp/",basename(newData$todownload),".zip")
			# URL     = paste0(sub("^www/","",projectDir),"/temp/",basename(newData$todownload),".zip")
			URL     = paste0("http://127.0.0.1:5000/temp/",basename(newData$todownload),".zip")

			shinyjs::runjs("hideContent(\"<div style='vertical-align:middle;' class='inthemiddle center font20'><i class='fa fa-spinner fa-pulse font30'></div>\")")
			relativeFilePath = paste0(projectDir,"/",newData$todownload)
			zip::zipr(tempPath,relativeFilePath);

			if (newData$ftype=="bam") {
				zip::zipr_append(tempPath,paste0(relativeFilePath,".bai"));
			}
			if (file.exists(paste0(relativeFilePath,".R"))) {
				zip::zipr_append(tempPath,paste0(relativeFilePath,".R"));
			}
			if (file.exists(paste0(relativeFilePath,".FIESTA.html"))) {
				zip::zipr_append(tempPath,paste0(relativeFilePath,".FIESTA.html"));
			}
			print(paste0("download_this_file('",URL,"');"))
			shinyjs::runjs(paste0("download_this_file('",URL,"');"))
			shinyjs::runjs("showContent()")
		},
		error=function(cond) {
			print(cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# },
		finally={
		})
	}



	
	delete_file<-function(newData) {
		tryCatch({
			newData=as.list(newData)

			fullFilePath = paste0(projectDir,"/",newData$todelete)
			if (file.exists(fullFilePath)) {
				list<-Sys.glob(paste0(fullFilePath,".*"));
				fs::file_delete(fullFilePath);
				remove_file_from_project(newData$todelete)
				for (f in list) {
					fs::file_delete(f)
				}
			}
			else {
				print ("ERROR: FILE MISSING!")
				print(fullFilePath)
			}

			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}





















	initialize_FASTQ_file<-function(newData) {
		tryCatch({	
			newData=as.list(newData)
			tempPath     = paste0(projectDir,"/temp/",basename(newData$fname))

#			if (grepl("\\.gz$", tempPath)) {
#				R.utils::gunzip(tempPath)
#				tempPath=gsub("\\.gz$", "", tempPath,perl=T)
#			}

			relativePath = paste0("./FASTQ/",basename(tempPath))
			propsFile    = paste0(tempPath,".props.json")
					
			nreads <- ShortRead::countFastq(tempPath)$records

			currentDesc <- paste0(base::format(nreads, big.mark=",", scientific=FALSE)," short reads")

			prop <-list()
			prop["NAME"]         = basename(tempPath)
			prop["DATAPATH"]    = relativePath
			prop["SIZE"]         = base::file.info(tempPath)$size
			prop["TYPE"]         = "fastq"
			prop["NREADS"]       = nreads
			prop["VIEWFILES"]    = "ND"
			prop["DEPENDENCIES"] = "ND"
			prop["DESCRIPTION"]  = currentDesc
			prop["HIDDEN"]      = "NO"
			prop["MD5"]          = tools::md5sum(tempPath)
			prop["CREATED"]      = base::format(Sys.time(), "%Y/%m/%d %H:%M:%S")
	
			if (length(newData$dependencies)>0) {
				newData$dependencies=paste0(newData$dependencies," @@ REMOVETHIS")
				prop["DEPENDENCIES"]   = strsplit(newData$dependencies," @@ ")
			}

			outText<-RJSONIO::toJSON(prop,.escapeEscapes = FALSE)
			writeLines(outText, propsFile)
		
			commandPath=paste0(tempPath,".R");
			commandPathRaw=paste0(tempPath,".Raw");
			if (prop["DEPENDENCIES"]!="ND") {
				outText=""
				for (fdep in 1:NROW(prop[["DEPENDENCIES"]])) {
					Dfile=prop[["DEPENDENCIES"]][[fdep]]
					Rfile=paste0(projectDir,"/",Dfile,".Raw")
					if (file.exists(Rfile)) { 
						
						outText=paste0(outText,paste(readLines(Rfile), collapse="\n"))
					}
				}
				outText=paste0(outText,CURRENT_COMMAND)
				writeLines(outText, commandPathRaw)
				outText=remove_duplicated_commands(outText)
				writeLines(outText, commandPath)
			}
			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}
	


	create_accessory_files_for_FASTQ<-function(newData) {
		tryCatch({	
			newData=as.list(newData)
			tempPath     = paste0(projectDir,"/temp/",basename(newData$fname))

#			if (grepl("\\.gz$", tempPath)) {
#				tempPath=gsub("\\.gz$", "", tempPath,perl=T)
#			}
			
			relativePath = paste0("./FASTQ/",basename(tempPath))
			propsFile    = paste0(tempPath,".props.json")
					
#			qc <- viewFastq(tempPath)
#			pairs <- unique(perFileInformation(qc)$pair)
#			for(pair in pairs) {
#				qc.sub <- subsetByPair(qc, pair)
#				png(filename=paste0(tempPath,".RQC.1.png"), width=400, height=225)
#				dev.off()
#				png(filename=paste0(tempPath,".RQC.2.png"), width=400, height=225)
#				dev.off()
			
#				png(filename=paste0(tempPath,".RQC.3.png"), width=400, height=225)
#				dev.off()
						
#				png(filename=paste0(tempPath,".RQC.4.png"), width=400, height=225)
#				df <- rqcCycleAverageQualityCalc(qc.sub)
#				cycle <- as.numeric(levels(df$cycle))[df$cycle]
#				plot(cycle, df$quality, col = df$filename, xlab='Cycle', ylab='Quality Score')
#				dev.off()	
#			}



			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}
	
	
	
	add_FASTQ_to_project<-function(newData) {
		tryCatch({	
			newData=as.list(newData)
			tempPath=paste0(projectDir,"/temp/",basename(newData$fname))
			
#			if (grepl("\\.gz$", tempPath)) {
#				tempPath=gsub("\\.gz$", "", tempPath,perl=T)
#			}

			newPath=paste0(projectDir,"/FASTQ/",basename(tempPath))
			relativePath=paste0("./FASTQ/",basename(tempPath))
			propsFile    = paste0(tempPath,".props.json")
					

			propText=paste(readLines(propsFile), collapse="\n")
			prop<-RJSONIO::fromJSON(propText, asText=TRUE, na="null", null="null")

			NAME         = prop["NAME"]
			SIZE         = prop["SIZE"]
			TYPE         = prop["TYPE"]
			DATAPATH     = prop["DATAPATH"]
			CREATED      = prop["CREATED"]
			VIEWFILES    = prop["VIEWFILES"]
			if (prop["DEPENDENCIES"]=="ND") {
				DEPENDENCIES="ND"
			}
			else {
				DEPENDENCIES = paste(eval(parse(text=prop["DEPENDENCIES"])), collapse=" @@ ")
			}
			DESCRIPTION  = prop["DESCRIPTION"]
			HIDDEN       = prop["HIDDEN"]
			MD5          = prop["MD5"]

			fs::file_move(tempPath, newPath)
#			fs::file_move(paste0(tempPath,".RQC.1.png"), paste0(newPath,".RQC.1.png"))
#			fs::file_move(paste0(tempPath,".RQC.2.png"), paste0(newPath,".RQC.2.png"))
#			fs::file_move(paste0(tempPath,".RQC.3.png"), paste0(newPath,".RQC.3.png"))
#			fs::file_move(paste0(tempPath,".RQC.4.png"), paste0(newPath,".RQC.4.png"))

			if (file.exists(paste0(tempPath,".Raw"))) { fs::file_move(paste0(tempPath,".Raw"), paste0(newPath,".Raw")) }
			if (file.exists(paste0(tempPath,".R"))) { fs::file_move(paste0(tempPath,".R"), paste0(newPath,".R")) }

			fs::file_move(paste0(tempPath,".props.json"), paste0(newPath,".props.json"))

			addFileToProject(c(NAME, SIZE, TYPE, DATAPATH, CREATED, VIEWFILES, DEPENDENCIES, DESCRIPTION, HIDDEN, MD5))
			outText<-RJSONIO::toJSON(list(files=myDfFiles$files),.escapeEscapes = FALSE)
			shinyjs::runjs(paste0("DataTable = ",outText,";renderFileTable('fcreated','up');resize();"))
			shinyjs::runjs(paste0("hideFileType['",TYPE,"']=false;"))
			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}



	initialize_BAM_file<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath     = paste0(projectDir,"/temp/",basename(newData$fname))

			if (grepl("\\.sam$",tempPath)) {
				to_eval=paste0('Rsamtools::asBam("', tempPath,'", indexDestination=TRUE)')
				eval(parse(text=to_eval))
				fs::file_delete(tempPath)
				tempPath=gsub("\\.sam$",".bam", tempPath)
			}

			relativePath = paste0("./ALIGNMENTS/",basename(tempPath))
			propsFile    = paste0(tempPath,".props.json")

			if (!file.exists(paste0(tempPath,".bai"))) {
				to_eval=paste0('Rsamtools::indexBam("',tempPath,'")')
				eval(parse(text=to_eval))
			}
				
			#seqnames=names(Rsamtools::scanBamHeader(tempPath)[[tempPath]]$targets)
			#param <- Rsamtools::ScanBamParam(what=c('pos'), which=GRanges(seqnames, IRanges(1, 1e7)), flag=Rsamtools::scanBamFlag(isUnmappedQuery=FALSE))
			
			ispaired=Rsamtools::testPairedEndBam(tempPath,paste0(tempPath,".bai"))
			showConnections() # try to understand this

			#alignedReads="To be calculated"
			prop <-list()
			prop["NAME"]         = basename(tempPath)
			prop["DATAPATH"]     = relativePath
			prop["SIZE"]         = base::file.info(tempPath)$size
			prop["TYPE"]         = "bam"
			prop["VIEWFILES"]    = "ND"
			prop["DEPENDENCIES"] = "ND"
			prop["HIDDEN"]       = "NO"
			prop["MD5"]          = tools::md5sum(tempPath)
			prop["CREATED"]      = base::format(Sys.time(), "%Y/%m/%d %H:%M:%S")
			prop["ISPAIRED"]     = ispaired
			prop["COMMAND"]      = CURRENT_COMMAND

			if (length(newData$dependencies)>0) {
				newData$dependencies=paste0(newData$dependencies," @@ REMOVETHIS")
				prop["DEPENDENCIES"]   = strsplit(newData$dependencies," @@ ")

				if (ispaired) { 
					if (NODUPS > -1) { 
						PERC <- NODUPS/NALIGNED*100  
						currentDesc=toString(paste0(base::format(NALIGNED, big.mark=",", scientific=FALSE)," paired-end primary alignments. ",base::format(NODUPS, big.mark=",", scientific=FALSE)," (",base::format(PERC, digits=1, big.mark=",", scientific=FALSE),"%) remain after dups. removal."))
						prop["ALIGNEDREADS"] = NODUPS
					}
					else {      		
						currentDesc=toString(paste0(base::format(NALIGNED, big.mark=",", scientific=FALSE)," paired-end primary alignments."))
						prop["ALIGNEDREADS"] = NALIGNED
					}
				}
				else {
					if (NODUPS > -1) {
						PERC <- NODUPS/NALIGNED*100  
						currentDesc=toString(paste0(base::format(NALIGNED, big.mark=",", scientific=FALSE)," single-end primary alignments. ",base::format(NODUPS, big.mark=",", scientific=FALSE), " (",base::format(PERC, digits=1, big.mark=",", scientific=FALSE),"%) remain after dups. removal."))
						prop["ALIGNEDREADS"] = NODUPS
					}
					else {
						currentDesc=toString(paste0(base::format(NALIGNED, big.mark=",", scientific=FALSE)," single-end primary alignments."))
						prop["ALIGNEDREADS"] = NALIGNED
					}
				}
				NALIGNED <<- -1
				NODUPS <<- -1
				cc=1
				limit=NROW(prop[["DEPENDENCIES"]])-2
				for (d in 1:limit) {
					ff=paste0('<span class="fileSpan">',basename(prop[["DEPENDENCIES"]][[d]]),'</span>')
					if (grepl(NOT_SELECTED, ff) || grepl("REMOVETHIS", ff) || grepl("\\.(fasta|fa|fna)$", ff)) {
						limit=limit-1
					}
					else {
						if (cc==limit && cc>1) {
							currentDesc=paste0(currentDesc," and ")
						}
						else if (cc>1) {
							currentDesc=paste0(currentDesc,", ")
						}
						else if (cc==1) {
							currentDesc=paste0(currentDesc," Samples: ")
						}
						currentDesc=paste0(currentDesc,ff)
						cc=cc+1
					}
				}
			}
			else {
				param <- Rsamtools::ScanBamParam(flag=Rsamtools::scanBamFlag(isSecondaryAlignment=FALSE),  what="seq")
				naligned <- Rsamtools::countBam(tempPath, param=param)[["records"]]
				param <- Rsamtools::ScanBamParam(flag=Rsamtools::scanBamFlag(isDuplicate=TRUE),  what="seq")
				ndups <-  Rsamtools::countBam(tempPath, param=param)[["records"]]
				perc <- ndups/naligned*100
				if (ispaired) {          		
					currentDesc=paste0(base::format(naligned, big.mark=",", scientific=FALSE)," paired-end primary alignments. ", base::format(ndups, big.mark=",", scientific=FALSE)," (",base::format(perc, digits=1, big.mark=",", scientific=FALSE),"%) marked as duplicates (file provided by user)")
					prop["ALIGNEDREADS"] = naligned
					prop["DUPLICATEDREADS"] = ndups
				}
				else {
					currentDesc=paste0(base::format(naligned, big.mark=",", scientific=FALSE)," single-end primary alignments. ", base::format(ndups, big.mark=",", scientific=FALSE)," (",base::format(perc, digits=1, big.mark=",", scientific=FALSE),"%) marked as duplicates (",base::format(perc, digits=1, big.mark=",", scientific=FALSE),"%) (file provided by user)")
					prop["ALIGNEDREADS"] = naligned
					prop["DUPLICATEDREADS"] = ndups
				}
			}
			prop["DESCRIPTION"] = toString(currentDesc)


			outText<-RJSONIO::toJSON(prop,.escapeEscapes = FALSE)
			writeLines(outText, propsFile)


			commandPath=paste0(tempPath,".R");
			commandPathRaw=paste0(tempPath,".Raw");
			if (prop["DEPENDENCIES"]!="ND") {
				outText=""
				for (fdep in 1:NROW(prop[["DEPENDENCIES"]])) {
					Dfile=prop[["DEPENDENCIES"]][[fdep]]
					Rfile=paste0(projectDir,"/",Dfile,".Raw")
					if (file.exists(Rfile)) { 
						
						outText=paste0(outText,paste(readLines(Rfile), collapse="\n"))
					}
				}
				outText=paste0(outText,CURRENT_COMMAND)
				writeLines(outText, commandPathRaw)
				outText=remove_duplicated_commands(outText)
				writeLines(outText, commandPath)
			}


			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}
	

	create_accessory_files_for_BAM<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath     = paste0(projectDir,"/temp/",basename(newData$fname))

			if (grepl("\\.sam$",tempPath)) {
				tempPath=gsub("\\.sam$",".bam", tempPath)
			}
	
	
			newPath      = paste0(projectDir,"/ALIGNMENTS/",basename(newData$fname))
			relativePath = paste0("./ALIGNMENTS/",basename(newData$fname))
			propsFile    = paste0(tempPath,".props.json")

			tempPathBAI         = paste0(tempPath,".bai")
			relativePathBAI     = paste0(relativePath,".bai")
#			propsFileBAI        = paste0(tempPathBAI,".props.json")

#			currentDescBAI="Alignment file index to be described"
#			prop <-list()
#			prop["NAME"]         = basename(tempPathBAI)
#			prop["DATAPATH"]     = relativePathBAI
#			prop["SIZE"]         = base::file.info(tempPathBAI)$size
#			prop["TYPE"]         = "bam"
#			prop["VIEWFILES"]    = "ND"
#			prop["DEPENDENCIES"] = "ND"
#			prop["DESCRIPTION"]  = currentDescBAI
#			prop["HIDDEN"]       = "AUXILIARY"
#			prop["MD5"]          = tools::md5sum(tempPathBAI)
#			prop["CREATED"]      = base::format(Sys.time(), "%Y/%m/%d %H:%M:%S")
#			outText<-RJSONIO::toJSON(prop,.escapeEscapes = FALSE)
#			writeLines(outText, propsFileBAI)

			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}
	


	add_BAM_to_project<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath     = paste0(projectDir,"/temp/",basename(newData$fname))

			if (grepl("\\.sam$",tempPath)) {
				tempPath=gsub("\\.sam$",".bam", tempPath)
			}

			newPath      = paste0(projectDir,"/ALIGNMENTS/",basename(tempPath))
			propsFile    = paste0(tempPath,".props.json")
#			propsFileBAI    = paste0(tempPath,".bai.props.json")

			propText=paste(readLines(propsFile), collapse="\n")
			prop<-RJSONIO::fromJSON(propText, asText=TRUE, na="null", null="null")

			NAME         = prop["NAME"]
			SIZE         = prop["SIZE"]
			TYPE         = prop["TYPE"]
			DATAPATH     = prop["DATAPATH"]
			CREATED      = prop["CREATED"]
			VIEWFILES    = prop["VIEWFILES"]
			if (prop["DEPENDENCIES"]=="ND") {
				DEPENDENCIES="ND"
			}
			else {
				DEPENDENCIES = paste(eval(parse(text=prop["DEPENDENCIES"])), collapse=" @@ ")
			}
			DESCRIPTION  = prop["DESCRIPTION"]
			HIDDEN       = prop["HIDDEN"]
			MD5          = prop["MD5"]

#			propTextBAI=paste(readLines(propsFileBAI), collapse="\n")
#			prop<-RJSONIO::fromJSON(propTextBAI, asText=TRUE, na="null", null="null")

#			NAME_BAI         = prop["NAME"]
#			SIZE_BAI         = prop["SIZE"]
#			TYPE_BAI         = prop["TYPE"]
#			DATAPATH_BAI     = prop["DATAPATH"]
#			CREATED_BAI      = prop["CREATED"]
#			VIEWFILES_BAI    = prop["VIEWFILES"]
#			DEPENDENCIES_BAI = prop["DEPENDENCIES"]
#			DESCRIPTION_BAI  = prop["DESCRIPTION"]
#			HIDDEN_BAI       = prop["HIDDEN"]
#			MD5_BAI          = prop["MD5"]

			fs::file_move(tempPath,newPath)
			
			tempPathBAI=paste0(tempPath,".bai")
			newPathBAI=paste0(newPath,".bai")

			fs::file_move(tempPathBAI,newPathBAI)

			fs::file_move(paste0(tempPath,".props.json"), paste0(newPath,".props.json"))

#			fs::file_move(paste0(tempPath,".bai.props.json"), paste0(newPath,".bai.props.json"))

			if (file.exists(paste0(tempPath,".Raw"))) { fs::file_move(paste0(tempPath,".Raw"), paste0(newPath,".Raw")) }
			if (file.exists(paste0(tempPath,".R"))) { fs::file_move(paste0(tempPath,".R"), paste0(newPath,".R")) }
		
			addFileToProject(c(NAME, SIZE, TYPE, DATAPATH, CREATED, VIEWFILES, DEPENDENCIES, DESCRIPTION, HIDDEN, MD5))
			outText<-RJSONIO::toJSON(list(files=myDfFiles$files),.escapeEscapes = FALSE)
			shinyjs::runjs(paste0("DataTable = ",outText,";renderFileTable('fcreated','up');resize();"))
			
#			addFileToProject(c(NAME_BAI, SIZE_BAI, TYPE_BAI, DATAPATH_BAI, CREATED_BAI, VIEWFILES_BAI, DEPENDENCIES_BAI, DESCRIPTION_BAI, HIDDEN_BAI, MD5_BAI))
#			outText<-RJSONIO::toJSON(list(files=myDfFiles$files),.escapeEscapes = FALSE)
#			shinyjs::runjs(paste0("DataTable = ",outText,";renderFileTable('fcreated','down');resize();"))

			shinyjs::runjs(paste0("hideFileType['",TYPE,"']=false;"))
			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}
	
	
	
	initialize_FASTA_file<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath     = paste0(projectDir,"/temp/",basename(newData$fname))

			if (grepl("\\.gz$", tempPath)) {
				R.utils::gunzip(tempPath)
				tempPath=gsub("\\.gz$", "", tempPath,perl=T)
			}

			tempPathFAI=paste0(tempPath,".fai")

			Rsamtools::indexFa(tempPath)
			showConnections() # due to indexFa
			fai <- utils::read.table(tempPathFAI,sep="\t")
			chrs=nrow(fai)
			if (chrs==1) {
				currentDesc=paste0(base::format(chrs, big.mark=",", scientific=FALSE)," chromosome: '",fai[1,1],"'")
			}
			else if (chrs==2) {
				currentDesc=paste0(base::format(chrs, big.mark=",", scientific=FALSE)," chromosomes: '", fai[1,1],"' and '", fai[2,1],"'")
			}
			else if (chrs==3) {
				currentDesc=paste0(base::format(chrs, big.mark=",", scientific=FALSE)," chromosomes: '", fai[1,1],"', '", fai[2,1], "' and '", fai[3,1],"'")
			}
			else {
				currentDesc=paste0(base::format(chrs, big.mark=",", scientific=FALSE)," chromosomes: '", fai[1,1],"', '", fai[2,1], "', '", fai[3,1], "'...")
			}
	
			relativePath = paste0("./FASTA/",basename(tempPath))
			propsFile    = paste0(tempPath,".props.json")
			
			prop <-list()
			prop["NAME"]         = basename(tempPath)
			prop["DATAPATH"]     = relativePath
			prop["SIZE"]         = base::file.info(tempPath)$size
			prop["TYPE"]         = "fasta"
			prop["VIEWFILES"]    = "ND"
			prop["DEPENDENCIES"] = "ND"
			prop["DESCRIPTION"]  = currentDesc
			prop["HIDDEN"]       = "NO"
			prop["MD5"]          = tools::md5sum(tempPath)
			prop["CREATED"]      = base::format(Sys.time(), "%Y/%m/%d %H:%M:%S")

			if (length(newData$dependencies)>0) {
				newData$dependencies=paste0(newData$dependencies," @@ REMOVETHIS")
				prop["DEPENDENCIES"]   = strsplit(newData$dependencies," @@ ")
			}

			outText<-RJSONIO::toJSON(prop,.escapeEscapes = FALSE)
			writeLines(outText, propsFile)


			commandPath=paste0(tempPath,".R");
			commandPathRaw=paste0(tempPath,".Raw");
			if (prop["DEPENDENCIES"]!="ND") {
				outText=""
				for (fdep in 1:NROW(prop[["DEPENDENCIES"]])) {
					Dfile=prop[["DEPENDENCIES"]][[fdep]]
					Rfile=paste0(projectDir,"/",Dfile,".Raw")
					if (file.exists(Rfile)) { 
						
						outText=paste0(outText,paste(readLines(Rfile), collapse="\n"))
					}
				}
				outText=paste0(outText,CURRENT_COMMAND)
				writeLines(outText, commandPathRaw)
				outText=remove_duplicated_commands(outText)
				writeLines(outText, commandPath)
			}

			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}

	create_accessory_files_for_FASTA<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath=paste0(projectDir,"/temp/",basename(newData$fname))
			relativePath=paste0("./FASTA/",basename(newData$fname))

			if (grepl("\\.gz$", tempPath)) {
				tempPath=gsub("\\.gz$", "", tempPath,perl=T)
			}
			stepDone("success","OK")
		},
		error=function(cond){
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond){
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}



	add_FASTA_to_project<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath=paste0(projectDir,"/temp/",basename(newData$fname))

			if (grepl("\\.gz$", tempPath)) {
				tempPath=gsub("\\.gz$", "", tempPath,perl=T)
			}
			
			newPath=paste0(projectDir,"/FASTA/",basename(tempPath))
			relativePath=paste0("./FASTA/",basename(newPath))
			propsFile=paste0(tempPath,".props.json")

			tempPathFAI=paste0(tempPath,".fai")
			newPathFAI=paste0(newPath,".fai")
			relativePathFAI=paste0(relativePath,".fai")
#			propsFileFAI=paste0(tempPathFAI,".props.json")

			propText=paste(readLines(propsFile), collapse="\n")
			prop<-RJSONIO::fromJSON(propText, asText=TRUE, na="null", null="null")

			NAME         = prop["NAME"]
			SIZE         = prop["SIZE"]
			TYPE         = prop["TYPE"]
			DATAPATH     = prop["DATAPATH"]
			CREATED      = prop["CREATED"]
			VIEWFILES    = prop["VIEWFILES"]
			if (prop["DEPENDENCIES"]=="ND") {
				DEPENDENCIES="ND"
			}
			else {
				DEPENDENCIES = paste(eval(parse(text=prop["DEPENDENCIES"])), collapse=" @@ ")
			}
			DESCRIPTION  = prop["DESCRIPTION"]
			HIDDEN       = prop["HIDDEN"]
			MD5          = prop["MD5"]

			addFileToProject(c(NAME, SIZE, TYPE, DATAPATH, CREATED, VIEWFILES, DEPENDENCIES, DESCRIPTION, HIDDEN, MD5))
			outText<-RJSONIO::toJSON(list(files=myDfFiles$files),.escapeEscapes = FALSE)
			shinyjs::runjs(paste0("DataTable = ",outText,";renderFileTable('fcreated','up');resize();"))

			fs::file_move(tempPath, newPath)
			fs::file_move(paste0(tempPath,".props.json"), paste0(newPath,".props.json"))
			if (file.exists(paste0(tempPath,".Raw"))) { fs::file_move(paste0(tempPath,".Raw"), paste0(newPath,".Raw")) }
			if (file.exists(paste0(tempPath,".R"))) { fs::file_move(paste0(tempPath,".R"), paste0(newPath,".R")) }
			
#			propTextFAI=paste(readLines(propsFileFAI), collapse="\n")
#			prop<-RJSONIO::fromJSON(propTextFAI, asText=TRUE, na="null", null="null")

#			NAME         = prop["NAME"]
#			SIZE         = prop["SIZE"]
#			TYPE         = prop["TYPE"]
#			DATAPATH     = prop["DATAPATH"]
#			CREATED      = prop["CREATED"]
#			VIEWFILES    = prop["VIEWFILES"]
#			DEPENDENCIES = prop["DEPENDENCIES"]
#			DESCRIPTION  = prop["DESCRIPTION"]
#			HIDDEN       = prop["HIDDEN"]
#			MD5          = prop["MD5"]

#			addFileToProject(c(NAME, SIZE, TYPE, DATAPATH, CREATED, VIEWFILES, DEPENDENCIES, DESCRIPTION, HIDDEN, MD5))
#			outText<-RJSONIO::toJSON(list(files=myDfFiles$files),.escapeEscapes = FALSE)
#			shinyjs::runjs(paste0("DataTable = ",outText,";renderFileTable('fcreated','down');resize();"))
			
			fs::file_move(tempPathFAI, newPathFAI)
#			fs::file_move(paste0(tempPathFAI,".props.json"), paste0(newPathFAI,".props.json"))

			shinyjs::runjs(paste0("hideFileType['",TYPE,"']=false;"))
			stepDone("success","OK")
		},
		error=function(cond){
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond){
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}




	initialize_GFF_file<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath=paste0(projectDir,"/temp/",basename(newData$fname))

			if (grepl("\\.gz$", tempPath)) {
				R.utils::gunzip(tempPath)
				tempPath=gsub("\\.gz$", "", tempPath,perl=T)
			}
			
			if (grepl("\\.gtf$",tempPath)) { 
				track <- BiocIO::import(tempPath)
				BiocIO::export(track, con=paste0(gsub(".gtf$","",tempPath),".sorted.gtf"), format="gtf", index=TRUE)
			}
			else if (grepl("\\.gff3$",tempPath)) {
				track <- BiocIO::import(tempPath)
				BiocIO::export(track, con=paste0(gsub(".gff3$","",tempPath),".sorted.gff3"), format="gff3", version="3", index=TRUE)
			}			
			else if (grepl("\\.gff$",tempPath)) {
				track <- BiocIO::import(tempPath)
				BiocIO::export(track, con=paste0(gsub(".gff$","",tempPath),".sorted.gff"), format="gff3", version="3", index=TRUE)
			}			
			
			relativePath = paste0("./GFF/",basename(tempPath))
			propsFile    = paste0(tempPath,".props.json")
			

			prop <-list()
			prop["NAME"]         = basename(tempPath)
			prop["DATAPATH"]     = relativePath
			prop["SIZE"]         = base::file.info(tempPath)$size
			prop["TYPE"]         = "gff"
			prop["VIEWFILES"]    = "ND"
			prop["DEPENDENCIES"] = "ND"
			prop["DESCRIPTION"]  = "ND"
			prop["HIDDEN"]       = "NO"
			prop["MD5"]          = tools::md5sum(tempPath)
			prop["CREATED"]      = base::format(Sys.time(), "%Y/%m/%d %H:%M:%S")

			if (length(newData$dependencies)>0) {
				newData$dependencies=paste0(newData$dependencies," @@ REMOVETHIS")
				prop["DEPENDENCIES"]   = strsplit(newData$dependencies," @@ ")
			}

			outText<-RJSONIO::toJSON(prop,.escapeEscapes = FALSE)
			writeLines(outText, propsFile)


			commandPath=paste0(tempPath,".R");
			commandPathRaw=paste0(tempPath,".Raw");
			if (prop["DEPENDENCIES"]!="ND") {
				outText=""
				for (fdep in 1:NROW(prop[["DEPENDENCIES"]])) {
					Dfile=prop[["DEPENDENCIES"]][[fdep]]
					Rfile=paste0(projectDir,"/",Dfile,".Raw")
					if (file.exists(Rfile)) { 
						
						outText=paste0(outText,paste(readLines(Rfile), collapse="\n"))
					}
				}
				outText=paste0(outText,CURRENT_COMMAND)
				writeLines(outText, commandPathRaw)
				outText=remove_duplicated_commands(outText)
				writeLines(outText, commandPath)
			}

			stepDone("success","OK")
		},
		error=function(cond){
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond){
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}


	create_accessory_files_for_GFF<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath     = paste0(projectDir,"/temp/",basename(newData$fname))

			if (grepl("\\.gz$", tempPath)) {
				tempPath=gsub("\\.gz$", "", tempPath,perl=T)
			}
			
			Rgff::plot_features(tempPath, outFile=paste0(tempPath,".png"), includeCounts=TRUE)
			# Rgff::saf_from_gff(tempPath, outFile=paste0(tempPath,".saf"), features="gene") # to generate .paths
			# genes=length(readLines(paste0(tempPath,".saf")))-1

			gffFeatures<-Rgff::get_features(tempPath,outFormat="data.frame",includeCounts=T)
			gffFeaturesCounts<-as.data.frame(matrix(unlist(strsplit(gffFeatures$FEATURES,":")),ncol=2, byrow=T))
			colnames(gffFeaturesCounts)<-c("FEATURES","N")

			# Annotate number of genes 
			genes=0
			if("gene" %in% gffFeaturesCounts$FEATURES){
				genes=gffFeaturesCounts[gffFeaturesCounts$FEATURES=="gene","N"]
				Rgff::saf_from_gff(tempPath, outFile=paste0(tempPath,".saf"), features="gene") # to generate .paths
			} 
			else{
				# Determine less frequent unique feature and create paths file 
				# smallestFeature<-(gffFeaturesCounts[gffFeaturesCounts$FEATURES %in% names(which(table(gffFeaturesCounts$FEATURES) == 1)),] %>% arrange(N))[1,]$FEATURES
				# Rgff::saf_from_gff(tempPath, outFile=paste0(tempPath,".saf"),features=c(gffFeaturesCounts$FEATURES[gffFeaturesCounts$FEATURES==smallestFeature]))  # to generate .paths
				stop("The annotation file provide does not contain genes")
			}

			try(suppressWarnings(Rhisat2::extract_splice_sites(features=tempPath, outfile=paste0(tempPath,".introns"))))
			showConnections() # try to understand this

			propsFile    = paste0(tempPath,".props.json")
			propText=paste(readLines(propsFile), collapse="\n")
			prop<-RJSONIO::fromJSON(propText, asText=TRUE, na="null", null="null")
			
			if (file.exists(paste0(tempPath,".introns")) && file.info(paste0(tempPath,".introns"))$size >0) {
				introns <- utils::read.table(paste0(tempPath,".introns"), sep="\t", header=FALSE, quote="")
				intronsizes <- introns[,3]-introns[,2]
				
				prop["MININTRONSIZE"]=min(intronsizes)
				prop["MAXINTRONSIZE"]=max(intronsizes)
				prop["AVGINTRONSIZE"]=round(mean(intronsizes), 2)
				prop["MEDIANINTRONSIZE"]=median(intronsizes)
				prop["INTRONS"]=NROW(intronsizes)
				prop["DESCRIPTION"]=paste0(base::format(genes, big.mark=",", scientific=FALSE)," genes. ",base::format(prop["INTRONS"], big.mark=",", scientific=FALSE), " introns found (min: ",base::format(prop["MININTRONSIZE"])," nt; max: ",base::format(prop["MAXINTRONSIZE"], big.mark=",", scientific=FALSE), " nt; average: ", base::format(prop["AVGINTRONSIZE"], big.mark=",", scientific=FALSE)," nt; median: ", base::format(prop["MEDIANINTRONSIZE"], big.mark=",", scientific=FALSE)," nt)")
			}
			else if (file.exists(paste0(tempPath,".introns")) && file.info(paste0(tempPath,".introns"))$size==0) {		
				prop["MININTRONSIZE"]=0
				prop["MAXINTRONSIZE"]=0
				prop["AVGINTRONSIZE"]=0
				prop["MEDIANINTRONSIZE"]=0
				prop["INTRONS"]=0
				prop["DESCRIPTION"]=paste0(base::format(genes, big.mark=",", scientific=FALSE)," genes. No introns found")
			}
			else {
				prop["MININTRONSIZE"]=-1
				prop["MAXINTRONSIZE"]=-1
				prop["AVGINTRONSIZE"]=-1
				prop["MEDIANINTRONSIZE"]=-1
				prop["INTRONS"]=-1
				prop["DESCRIPTION"]=paste0(base::format(genes, big.mark=",", scientific=FALSE)," genes. Unable to analyze introns in this file")
			}

			outText<-RJSONIO::toJSON(prop,.escapeEscapes = FALSE)
			writeLines(outText, propsFile)

			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}








	add_GFF_to_project<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath     = paste0(projectDir,"/temp/",basename(newData$fname))

			if (grepl("\\.gz$", tempPath)) {
				tempPath=gsub("\\.gz$", "", tempPath,perl=T)
			}

			newPath      = paste0(projectDir,"/GFF/",basename(tempPath))
			propsFile    = paste0(tempPath,".props.json")

			propText=paste(readLines(propsFile), collapse="\n")
			prop<-RJSONIO::fromJSON(propText, asText=TRUE, na="null", null="null")

			NAME         = prop["NAME"]
			SIZE         = prop["SIZE"]
			TYPE         = prop["TYPE"]
			DATAPATH     = prop["DATAPATH"]
			CREATED      = prop["CREATED"]
			VIEWFILES    = prop["VIEWFILES"]
			if (prop["DEPENDENCIES"]=="ND") {
				DEPENDENCIES="ND"
			}
			else {
				DEPENDENCIES = paste(eval(parse(text=prop["DEPENDENCIES"])), collapse=" @@ ")
			}
			DESCRIPTION  = prop["DESCRIPTION"]
			HIDDEN       = prop["HIDDEN"]
			MD5          = prop["MD5"]

			
			tempPathPAIRS=paste0(tempPath,".pairs")
			newPathPAIRS=paste0(newPath,".pairs")

			tempPathPATHS=paste0(tempPath,".paths")
			newPathPATHS=paste0(newPath,".paths")

			tempPathNoExtension=gsub("\\.[gtf3]+$", "", tempPath)
			newPathNoExtension=gsub("\\.[gtf3]+$", "", newPath)

			fs::file_move(tempPathPAIRS,newPathPAIRS)
			fs::file_move(tempPathPATHS,newPathPATHS)

			fs::file_move(paste0(tempPath,".props.json"), paste0(newPath,".props.json"))
			fs::file_move(tempPath,newPath)
			if (file.exists(paste0(tempPath,".png"))) { fs::file_move(paste0(tempPath,".png"), paste0(newPath,".png")) }
			if (file.exists(paste0(tempPath,".Raw"))) { fs::file_move(paste0(tempPath,".Raw"), paste0(newPath,".Raw")) }
			if (file.exists(paste0(tempPath,".R"))) { fs::file_move(paste0(tempPath,".R"), paste0(newPath,".R")) }
			if (file.exists(paste0(tempPath,".introns"))) { fs::file_move(paste0(tempPath,".introns"), paste0(newPath,".introns")) }
			if (file.exists(paste0(tempPathNoExtension,".sorted.gff3.bgz")))     { fs::file_move(paste0(tempPathNoExtension,".sorted.gff3.bgz"),     paste0(newPathNoExtension,".sorted.gff3.bgz")) }
			if (file.exists(paste0(tempPathNoExtension,".sorted.gff3.bgz.tbi"))) { fs::file_move(paste0(tempPathNoExtension,".sorted.gff3.bgz.tbi"), paste0(newPathNoExtension,".sorted.gff3.bgz.tbi")) }
			if (file.exists(paste0(tempPathNoExtension,".sorted.gtf.bgz")))      { fs::file_move(paste0(tempPathNoExtension,".sorted.gtf.bgz"),      paste0(newPathNoExtension,".sorted.gtf.bgz")) }
			if (file.exists(paste0(tempPathNoExtension,".sorted.gtf.bgz.tbi")))  { fs::file_move(paste0(tempPathNoExtension,".sorted.gtf.bgz.tbi"),  paste0(newPathNoExtension,".sorted.gtf.bgz.tbi")) }
			if (file.exists(paste0(tempPathNoExtension,".sorted.gff.bgz")))      { fs::file_move(paste0(tempPathNoExtension,".sorted.gff.bgz"),      paste0(newPathNoExtension,".sorted.gff.bgz")) }
			if (file.exists(paste0(tempPathNoExtension,".sorted.gff.bgz.tbi")))  { fs::file_move(paste0(tempPathNoExtension,".sorted.gff.bgz.tbi"),  paste0(newPathNoExtension,".sorted.gff.bgz.tbi")) }
	
			addFileToProject(c(NAME, SIZE, TYPE, DATAPATH, CREATED, VIEWFILES, DEPENDENCIES, DESCRIPTION, HIDDEN, MD5))
			outText<-RJSONIO::toJSON(list(files=myDfFiles$files),.escapeEscapes = FALSE)
			shinyjs::runjs(paste0("DataTable = ",outText,";renderFileTable('fcreated','up');resize();"))
			
			shinyjs::runjs(paste0("hideFileType['",TYPE,"']=false;"))
			stepDone("success","OK")
		},
		error=function(cond){
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond){
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}




	initialize_COUNTS_file<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath     = paste0(projectDir,"/temp/",basename(newData$fname))

			if (grepl("\\.gz$", tempPath)) {
				R.utils::gunzip(tempPath)
				tempPath=gsub("\\.gz$", "", tempPath,perl=T)
			}


			PATHSFILE=paste0(projectDir,"/GFF/",basename(newData$gff),".paths")	

			SAFFILE=paste0(projectDir,"/temp/",basename(newData$gff))
			#SAFFILE=gsub('\\.gff\\d*$','',SAFFILE, perl=TRUE)
			for(fb in names(newData$features_blocks)) {
				if (newData$features_blocks[fb]==NOT_SELECTED) {
					SAFFILE=paste0(projectDir,"/temp/",basename(SAFFILE),".",fb);
				}
				else {
					SAFFILE=paste0(projectDir,"/temp/",basename(SAFFILE),".",fb,"-",newData$features_blocks[fb]);
				}
			}
			SAFFILE=paste0(SAFFILE,".saf")
			
			tmpdata <- utils::read.table(tempPath, sep="\t")
			nrows=nrow(tmpdata)
			first=paste0("'",tmpdata[1,1], "', '",tmpdata[2,1],"', '",tmpdata[3,1],"'...")
	
			currentDesc=paste0(". From <span class=\"fileSpan\">",basename(newData$gff),"</span> in ")	
			for(fb in names(newData$features_blocks)) {
				if (newData$features_blocks[fb]==NOT_SELECTED) {
					currentDesc=paste0(currentDesc,fb," (full) ")	
				}
				else {
					currentDesc=paste0(currentDesc,fb," (",newData$features_blocks[fb],") ")
				}
			}

			currentDesc=paste0(base::format(nrows, big.mark=",", scientific=FALSE)," features: ",first, currentDesc)

			propsFile    = paste0(tempPath,".props.json")

			prop <-list()
			prop["SAF"]          = basename(SAFFILE)
			prop["MD5SAF"]       = tools::md5sum(SAFFILE)
			prop["NAME"]         = basename(tempPath)

			relativePath = paste0("./COUNTS/",prop["SAF"],"/",basename(tempPath))

			prop["DATAPATH"]     = relativePath
			prop["SIZE"]         = base::file.info(tempPath)$size
			prop["TYPE"]         = "counts"
			prop["VIEWFILES"]    = "ND"
			prop["DEPENDENCIES"] = "ND"
			prop["DESCRIPTION"]  = currentDesc
			prop["HIDDEN"]       = "NO"
			prop["MD5"]          = tools::md5sum(tempPath)
			prop["CREATED"]      = base::format(Sys.time(), "%Y/%m/%d %H:%M:%S")
 			prop["COMMAND"]      = CURRENT_COMMAND

			if (length(newData$dependencies)>0) {
				newData$dependencies=paste0(newData$dependencies," @@ REMOVETHIS")
				prop["DEPENDENCIES"]   = strsplit(newData$dependencies," @@ ")
			}

			outText<-RJSONIO::toJSON(prop,.escapeEscapes = FALSE)
			writeLines(outText, propsFile)

			commandPath=paste0(tempPath,".R");
			commandPathRaw=paste0(tempPath,".Raw");
			if (prop["DEPENDENCIES"]!="ND") {
				outText=""
				for (fdep in 1:NROW(prop[["DEPENDENCIES"]])) {
					Dfile=prop[["DEPENDENCIES"]][[fdep]]
					Rfile=paste0(projectDir,"/",Dfile,".Raw")
					if (file.exists(Rfile)) { 
						
						outText=paste0(outText,paste(readLines(Rfile), collapse="\n"))
					}
				}
				outText=paste0(outText,CURRENT_COMMAND)
				writeLines(outText, commandPathRaw)
				outText=remove_duplicated_commands(outText)
				writeLines(outText, commandPath)
			}
			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}


	create_accessory_files_for_COUNTS<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath     = paste0(projectDir,"/temp/",basename(newData$fname))

			if (grepl("\\.gz$", tempPath)) {
				tempPath=gsub("\\.gz$", "", tempPath,perl=T)
			}


			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}


	add_COUNTS_to_project<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath     = paste0(projectDir,"/temp/",basename(newData$fname))

			if (grepl("\\.gz$", tempPath)) {
				tempPath=gsub("\\.gz$", "", tempPath,perl=T)
			}

			propsFile    = paste0(tempPath,".props.json")

			propText=paste(readLines(propsFile), collapse="\n")
			prop<-RJSONIO::fromJSON(propText, asText=TRUE, na="null", null="null")
			
			SAF       = prop["SAF"]
			countsFolder=paste0(projectDir,"/COUNTS/",SAF)
			newPath      = paste0(countsFolder,"/",basename(tempPath))
			
			
			if (!dir.exists(countsFolder)) { dir.create(countsFolder,showWarnings = FALSE,recursive=T) }

			NAME         = prop["NAME"]
			SIZE         = prop["SIZE"]
			TYPE         = prop["TYPE"]
			DATAPATH     = prop["DATAPATH"]
			CREATED      = prop["CREATED"]
			VIEWFILES    = prop["VIEWFILES"]
			if (prop["DEPENDENCIES"]=="ND") {
				DEPENDENCIES="ND"
			}
			else {
				DEPENDENCIES = paste(eval(parse(text=prop["DEPENDENCIES"])), collapse=" @@ ")
			}
			DESCRIPTION  = prop["DESCRIPTION"]
			HIDDEN       = prop["HIDDEN"]
			MD5          = prop["MD5"]

			
			fs::file_move(paste0(tempPath,".props.json"), paste0(newPath,".props.json"))
			fs::file_move(tempPath,newPath)
			if (file.exists(paste0(tempPath,".Raw"))) { fs::file_move(paste0(tempPath,".Raw"), paste0(newPath,".Raw")) }
			if (file.exists(paste0(tempPath,".R"))) { fs::file_move(paste0(tempPath,".R"), paste0(newPath,".R")) }
	
			addFileToProject(c(NAME, SIZE, TYPE, DATAPATH, CREATED, VIEWFILES, DEPENDENCIES, DESCRIPTION, HIDDEN, MD5))
			outText<-RJSONIO::toJSON(list(files=myDfFiles$files),.escapeEscapes = FALSE)
			shinyjs::runjs(paste0("DataTable = ",outText,";renderFileTable('fcreated','up');resize();"))
			
			shinyjs::runjs(paste0("hideFileType['",TYPE,"']=false;"))
			stepDone("success","OK")
		},
		error=function(cond){
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond){
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}




	initialize_DIFFEXP_file<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath     = paste0(projectDir,"/temp/",basename(newData$fname))
			
			currentDesc="Differential expression results (log2Ratio, FoldChange, P-value, P-adjusted, etc.)"

			if (grepl("\\.gz$", tempPath)) {
				R.utils::gunzip(tempPath)
				tempPath=gsub("\\.gz$", "", tempPath,perl=T)
			}

			propsFile    = paste0(tempPath,".props.json")

			prop <-list()
			prop["NAME"]         = basename(tempPath)

			relativePath = paste0("./DIFFEXP/",basename(tempPath))

			prop["DATAPATH"]     = relativePath
			prop["SIZE"]         = base::file.info(tempPath)$size
			prop["TYPE"]         = "diffexp"
			prop["VIEWFILES"]    = "ND"
			prop["DEPENDENCIES"] = "ND"
			prop["DESCRIPTION"]  = currentDesc
			prop["HIDDEN"]       = "NO"
			prop["MD5"]          = tools::md5sum(tempPath)
			prop["CREATED"]      = base::format(Sys.time(), "%Y/%m/%d %H:%M:%S")
			prop["COMMAND"]      = CURRENT_COMMAND
 
			if (length(newData$dependencies)>0) {
				newData$dependencies=paste0(newData$dependencies," @@ REMOVETHIS")
				prop["DEPENDENCIES"]   = strsplit(newData$dependencies," @@ ")
			}

			outText<-RJSONIO::toJSON(prop,.escapeEscapes = FALSE)
			writeLines(outText, propsFile)


			commandPath=paste0(tempPath,".R");
			commandPathRaw=paste0(tempPath,".Raw");
			if (prop["DEPENDENCIES"]!="ND") {
				outText=""
				for (fdep in 1:NROW(prop[["DEPENDENCIES"]])) {
					Dfile=prop[["DEPENDENCIES"]][[fdep]]
					Rfile=paste0(projectDir,"/",Dfile,".Raw")
					if (file.exists(Rfile)) { 
						
						outText=paste0(outText,paste(readLines(Rfile), collapse="\n"))
					}
				}
				outText=paste0(outText,CURRENT_COMMAND)
				writeLines(outText, commandPathRaw)
				outText=remove_duplicated_commands(outText)
				writeLines(outText, commandPath)
			}

			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}

	create_accessory_files_for_DIFFEXP<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath     = paste0(projectDir,"/temp/",basename(newData$fname))

			if (grepl("\\.gz$", tempPath)) {
				tempPath=gsub("\\.gz$", "", tempPath,perl=T)
			}
			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}


	add_DIFFEXP_to_project<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath     = paste0(projectDir,"/temp/",basename(newData$fname))

			if (grepl("\\.gz$", tempPath)) {
				tempPath=gsub("\\.gz$", "", tempPath,perl=T)
			}

			propsFile    = paste0(tempPath,".props.json")

			propText=paste(readLines(propsFile), collapse="\n")
			prop<-RJSONIO::fromJSON(propText, asText=TRUE, na="null", null="null")
			
			newPath      = paste0(projectDir,"/DIFFEXP/",basename(tempPath))
			
			NAME         = prop["NAME"]
			SIZE         = prop["SIZE"]
			TYPE         = prop["TYPE"]
			DATAPATH     = prop["DATAPATH"]
			CREATED      = prop["CREATED"]
			VIEWFILES    = prop["VIEWFILES"]
			if (prop["DEPENDENCIES"]=="ND") {
				DEPENDENCIES="ND"
			}
			else {
				DEPENDENCIES = paste(eval(parse(text=prop["DEPENDENCIES"])), collapse=" @@ ")
			}
			DESCRIPTION  = prop["DESCRIPTION"]
			HIDDEN       = prop["HIDDEN"]
			MD5          = prop["MD5"]

			
			fs::file_move(paste0(tempPath,".props.json"), paste0(newPath,".props.json"))
			fs::file_move(tempPath,newPath)
			if (file.exists(paste0(tempPath,".Raw"))) { fs::file_move(paste0(tempPath,".Raw"), paste0(newPath,".Raw")) }
			if (file.exists(paste0(tempPath,".R"))) { fs::file_move(paste0(tempPath,".R"), paste0(newPath,".R")) }
			#if (file.exists(gsub(".xlsx$", ".decoder.tsv", tempPath))) { fs::file_move(gsub(".xlsx$", ".decoder.tsv", tempPath), gsub(".xlsx$", ".decoder.tsv", newPath)) }

			if (file.exists(paste0(tempPath,".FIESTA.html"))) { fs::file_move(paste0(tempPath,".FIESTA.html"), paste0(newPath,".FIESTA.html")) }
	
			addFileToProject(c(NAME, SIZE, TYPE, DATAPATH, CREATED, VIEWFILES, DEPENDENCIES, DESCRIPTION, HIDDEN, MD5))
			outText<-RJSONIO::toJSON(list(files=myDfFiles$files),.escapeEscapes = FALSE)
			shinyjs::runjs(paste0("DataTable = ",outText,";renderFileTable('fcreated','up');resize();"))
			
			shinyjs::runjs(paste0("hideFileType['",TYPE,"']=false;"))
			stepDone("success","OK")
		},
		error=function(cond){
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond){
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}


	remove_duplicated_commands<-function(text) {
		commands=as.vector(unique(as.data.frame(strsplit(text,"## ##"))))
		final=paste(sort(unlist(commands)),collapse="## ## ##")
		final_no_redundant_comments=paste(unlist(as.vector(unique(as.data.frame(strsplit(final,"\n"))))), collapse="\n")
		final_fixed_comments=gsub("## ## ## \\d+ ","\n# ",final_no_redundant_comments, perl=TRUE)
		final_no_paths=gsub(paste0(projectDir,"/[a-zA-Z0-9]+/"),"",final_fixed_comments)
		final_no_paths=gsub("\\.\\/ALIGNMENTS\\/","",final_no_paths)
		final_no_paths=gsub("\\.\\/ANNOTS\\/","",final_no_paths)
		final_no_paths=gsub("\\.\\/DIFFEXP\\/","",final_no_paths)
		final_no_paths=gsub("\\.\\/FASTA\\/","",final_no_paths)
		final_no_paths=gsub("\\.\\/FASTQ\\/","",final_no_paths)
		final_no_paths=gsub("\\.\\/GFF\\/","",final_no_paths)
		final_no_paths=gsub("\\.\\/COUNTS\\/[^\\/]+\\/","",final_no_paths)
		final_no_paths=gsub(paste0(projectDir,"\\/"),"",final_no_paths)
		final_no_paths=gsub(projectDir,".",final_no_paths)
		final_no_dirty_lines=gsub(".+REMOVE THIS LIN.+","", final_no_paths, perl=TRUE)
		final_no_dirty_lines=gsub("#REMOVE THIS STRIN.+","", final_no_dirty_lines, perl=TRUE)


		final_no_dirty_lines=paste0("
########################################################################
#                                                                      #
#                                                                      #
#    R code generated automatically by SeqNjoy (BioinfoGP CNB-CSIC)    #
#                                                                      #
#                                                                      #
########################################################################
"
		,final_no_dirty_lines)
		final_no_dirty_lines = gsub("[\\n]+","\n", final_no_dirty_lines, perl=TRUE)
		final_no_dirty_lines = gsub("([^#])\\n#","\\1\n\n#", final_no_dirty_lines, perl=TRUE)
		final_no_dirty_lines = gsub("\\n# Load libraries","\n\n# Load libraries", final_no_dirty_lines, perl=TRUE)
		final_no_dirty_lines = gsub("^\\n","", final_no_dirty_lines, perl=TRUE)
		return(final_no_dirty_lines)
	}


	initialize_ANN_file<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath=paste0(projectDir,"/temp/",basename(newData$fname))
			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}

	create_accessory_files_for_ANN<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath     = paste0(projectDir,"/temp/",basename(newData$fname))

			if (grepl("\\.gz$", tempPath)) {
				tempPath=gsub("\\.gz$", "", tempPath,perl=T)
			}
			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}



	add_ANN_to_project<-function(newData) {
		tryCatch({
			newData=as.list(newData)
			tempPath=paste0(projectDir,"/temp/",basename(newData$fname))
			newPath=paste0(projectDir,"/ANNOTS/",basename(tempPath))
			relativePath=paste0("./ANNOTS/",basename(newPath))
			
			if (grepl("\\.xlsx?$", tempPath)) {
				tmpdata <- openxlsx::read.xlsx(tempPath)
			}
			else {
				tmpdata <- utils::read.table(tempPath,sep="\t", quote="", comment.char="", header=TRUE)
			}
			nrows = nrow(tmpdata)
			ncols = ncol(tmpdata)
			unique_ids = NROW(unique(tmpdata[,1]))
			
			if (nrows < 1) {
				stop("Annotations file does not contains genes")
			}
			else if(nrows > unique_ids) {
				dups=nrows - unique_ids
				if (dups==1) {
					stop(paste0("Unable to load ann file. ",dups," duplicated ID detected!"))
				}
				else {
					stop(paste0("Unable to load ann file. ",dups," duplicated IDs detected!"))
				}
			}
			
			firstrows=paste0("'",tmpdata[1,1], "', '", tmpdata[2,1], "', '", tmpdata[3,1],"'...")
			if (ncols > 3) {
				firstcols=paste0("'",colnames(tmpdata)[1], "', '", colnames(tmpdata)[2], "', '", colnames(tmpdata)[3],"'...")
			}
			else if (ncols == 3) {
				firstcols=paste0("'",colnames(tmpdata)[1], "', '", colnames(tmpdata)[2], "' and '", colnames(tmpdata)[3],"'")
			}
			else if (ncols == 2) {
				firstcols=paste0("'",colnames(tmpdata)[1], "' and '", colnames(tmpdata)[2],"'")
			}
			else {
				stop("Annotations file contains less than 2 columns")
			}
			
			currentDesc=paste0(base::format(nrows, big.mark=",", scientific=FALSE)," genes: ",firstrows," x ",ncols, " annotation fields: ",firstcols)

			fs::file_move(tempPath,newPath)

			NAME         = basename(newPath)
			SIZE         = base::file.info(newPath)$size
			TYPE         = "ann"
			DATAPATH     = relativePath
			CREATED      = base::format(Sys.time(), "%Y/%m/%d %H:%M:%S")
			VIEWFILES    = ""
			DEPENDENCIES = "ND"
			DESCRIPTION  = currentDesc
			HIDDEN       = "NO"
			MD5          = tools::md5sum(newPath)

			addFileToProject(c(NAME, SIZE, TYPE, DATAPATH, CREATED, VIEWFILES, DEPENDENCIES, DESCRIPTION, HIDDEN, MD5))
			outText<-RJSONIO::toJSON(list(files=myDfFiles$files),.escapeEscapes = FALSE)
			shinyjs::runjs(paste0("DataTable = ",outText,";renderFileTable('fcreated','up');resize();"))

			shinyjs::runjs(paste0("hideFileType['",TYPE,"']=false;"))

			stepDone("success","OK")
		},
		error=function(cond) {
			print(cond)
			stepDone("fail",cond)
		},
		# warning=function(cond) {
		# 	print(cond)
		# 	stepDone("fail",cond)
		# },
		finally={
		})
	}


	stepDone<-function(result,message) {
		shinyjs::runjs(paste0("StepDone(`",result,"`,`",gsub('`','\'',message),"`);"))
	}
	
	
	
#############################################################################################
# INI Function getMetadataFileList
#############################################################################################
	get_MetadataFileList <- function(projectFiles, samplesControl, samplesExperiment, ctrlLabel, expLabel, DisplayFirstExperimentCounts) {
	
		if (class(projectFiles)!="data.frame") {
			warning("Error! projectFiles must be a data.frame")
		}
		myList <- list(
			FASTQ = c(character(0)),
			BAM = c(list( 
				BAM_COUNTS=character(0),
				BAM_FILE=character(0),
				BAM_CONDITION_TYPE=character(0)
				)
			),
			ANNOT = c(list( 
				ANNOT_FILE=character(0),
				ANNOT_FEATURE=character(0)
				)
			),
			FASTA = c(character(0))
		)
    
    
		listCountFiles <- data.frame(countFile=character(0), condition=character(0), conditionType=character(0), stringsAsFactors = FALSE)
		listCountFiles <- rbind(listCountFiles,data.frame(countFile=samplesControl,condition=ctrlLabel,conditionType=c("control")))
		listCountFiles <- rbind(listCountFiles,data.frame(countFile=samplesExperiment,condition=expLabel,conditionType=c("experiment")))

		conditionsVector <- unique(listCountFiles$conditionType)

		if (DisplayFirstExperimentCounts==TRUE) {
			conditionsVector <- rev(unique(listCountFiles$conditionType))
		}

		# for(conditionType in levels(listCountFiles$conditionType)) {
		for(conditionType in conditionsVector) {
			for(countFile in listCountFiles$countFile[listCountFiles$conditionType == conditionType]) {
				if(nrow(projectFiles[projectFiles$datapath == countFile,])==0){  # doesnt exist count file
					warning(paste0("doesn't exist counts files:",countFile))
				} 
				else {
					countDependencies <- projectFiles[projectFiles$datapath == countFile,]$dependencies
					#if (countDependencies == "User provided" || countDependencies=="") {
					if (countDependencies == "ND") {
						print(paste0("User provided counts file or not informed. No bam, no gff info could be retrieved. Counts file: ",countFile))
					}
					else {
						eachDependency <- unlist(strsplit(countDependencies, " @@ "))
						#DEPENDENCIES_RETRIEVING Step1: retrieve the annotation, feature, block and alignment file (bam)
						#Example: countDependencies<-'ALIGNMENT=71.bam@@ANNOTATION=Saccharomyces_cerevisiae.R64-1-1.100.gff3@@FEATURE=gene@@BLOCK=exon@@'
						#countAnnotPat <- paste0('^.*ANNOTATION=(.+?)',dependSep,'.*$')
						gffFile <- grep('\\.(gtf|gff|gff3)$', eachDependency, value=TRUE)
						myList$ANNOT$ANNOT_FILE = c(myList$ANNOT$ANNOT_FILE,gffFile)
						featuresBlocks <- gsub(".+(gtf|gff|gff3)\\.(.+)\\.saf.+", "\\2", countFile)
						myList$ANNOT$ANNOT_FEATURE = c(myList$ANNOT$ANNOT_FEATURE, featuresBlocks)
						bamFile <- grep('\\.bam$', eachDependency, value=TRUE)

						if(length(bamFile) !=0 && bamFile !=""){ # bam file informed for the countFile
							myList$BAM$BAM_CONDITION_TYPE = c(myList$BAM$BAM_CONDITION_TYPE,conditionType)
							myList$BAM$BAM_FILE = c(myList$BAM$BAM_FILE,bamFile)
							myList$BAM$BAM_COUNTS = c(myList$BAM$BAM_COUNTS,countFile)
						}

						#DEPENDENCIES_RETRIEVING Step2: retrieve the reference (FASTA) file from the dependencies of the BAM file retrieved in Step 1 
						# Example1: bamDependencies <- 'FASTQ=1M_SRR9336471.fastq@@REFERENCE=Saccharomyces_cerevisiae.R64-1-1.dna.toplevel.fa@@'
						# Example2: bamDependencies <- 'FASTQ1=1M_SRR9336470_1.fastq@@FASTQ2=1M_SRR9336470_2.fastq@@REFERENCE=Saccharomyces_cerevisiae.R64-1-1.dna.toplevel.fa@@'

						#TODO: Explore the possibility of include the complete dependencies of counts files (including this FASTA file) to subsume this step in Step 1 (and therefore avoid Step2)

						bamDependencies <- projectFiles[projectFiles$datapath == bamFile,]$dependencies
						if(nrow(projectFiles[projectFiles$datapath == bamFile,])==0){  # doesnt exist bam file 
							warning(paste0("Bam file doesn't exists in projectFiles for ",bamFile))
						}
						else if (bamDependencies=='User provided' || length(bamDependencies)==0) {
							#bam file informed as user-provided or not informed (no FASTA linked)
							print(paste0("Bam file is User-provided or not informed: ",bamFile))
						}
						else {
							eachDependency <- unlist(strsplit(bamDependencies, " @@ "))
							refFile <- grep('\\.(fa|fna|fasta)$', eachDependency, value=TRUE)
							myList$FASTA=c(myList$FASTA,refFile)
							fastqFile <- grep('\\.(fq|fastq|fq\\.gz|fastq\\.gz)$', eachDependency, value=TRUE)
							myList$FASTQ=c(myList$FASTQ,toString(fastqFile))
						}
					}
				}
			}
		}
		return(myList)
	}
	

}



