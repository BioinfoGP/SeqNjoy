checkAppPackages<- function(inFile, outFile){

	if(missing(inFile)){
		stop(paste0("Input required library was not provided."))
	}
	
	if(missing(inFile)){
		stop(paste0("Output missing library was not provided."))
	}


	cat("Checking if required R packages are installed...  ")



	if(!file.exists(inFile)){
		stop(paste0("Required library file ",inFile," does not exist."))
	}

	if(file.exists(outFile)){
		unlink(outFile)
	}

	requiredLibs<-readLines(inFile)
	# requiredLibs<-c("tools","shiny","shinyjs","Rbowtie2","Rsubread","Rsamtools","Rhisat2","DESeq2","edgeR","openxlsx","Rgff","rtracklayer","fs","R.utils","RJSONIO","ShortRead")
	missingLibs<-c()
	for (l in requiredLibs){
		# message(l)
		if (!requireNamespace(l, quietly = TRUE))
			missingLibs<-c(missingLibs,l)
	}

	if(length(missingLibs)>0){
		message(paste0("The following libraries could not be loaded: ", paste0(missingLibs,collapse=", ")))
		writeLines(missingLibs,outFile)
		cat("NO.\n")
		return(1)
	} else {
		missingLibs<-c("OK")
		writeLines(missingLibs,outFile)	
		cat("YES.\n")
		return(0)
	}	
}
