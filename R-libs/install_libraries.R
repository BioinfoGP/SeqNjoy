Sys.setenv(DOWNLOAD_STATIC_LIBV8=1);
options(repos = "https://cran.microsoft.com/snapshot/2022-02-11/")

# Install shiny dependencies
installPKG=c("base64enc","bslib","cachem","commonmark","crayon","digest","ellipsis","fastmap","fontawesome","fs","glue","htmltools","httpuv","jquerylib","jsonlite","later","lifecycle","magrittr","mime","promises","R6","rappdirs","Rcpp","rlang","sass","sourcetools","withr","xtable")
for (l in installPKG){
	if (!requireNamespace(l, quietly = TRUE))
		install.packages(l)
}


# Install modified shiny
install.packages(paste0(R_LIBSRC,"/shiny_1.7.1.tar.gz"), repos = NULL, type="source")


# Install other required CRAN libraries
installPKG=c("fs","openxlsx","R.utils","RJSONIO","shinyjs","tools")
for (l in installPKG){
	if (!requireNamespace(l, quietly = TRUE))
		install.packages(l)
}

# Install Rgff required and optional CRAN libraries
installPKG=c("dplyr","data.tree","magrittr","RJSONIO","rlang","stringi","tidyr","tibble","knitr","rmarkdown","DiagrammeR","rsvg","DiagrammeRsvg")
for (l in installPKG){
	if (!requireNamespace(l, quietly = TRUE))
		install.packages(l)
}

# Install Bioconductor (version = "3.14")
if (!require("BiocManager", quietly = TRUE))
    install.packages("BiocManager")
# BiocManager::install(version = "3.14")

# Install Bioconductor required libraries (including those of Rgff)
options(repos = c(CRAN = "https://cran.microsoft.com/snapshot/2022-02-11/"))
installPKG=c("DESeq2","edgeR","GenomicRanges", "Rbowtie2","RJSONIO", "Rsamtools","Rhisat2","Rsubread","rtracklayer","S4Vectors", "ShortRead")
for (l in installPKG){
	if (!requireNamespace(l, quietly = TRUE))
		BiocManager::install(l)
}

options(repos = "https://cloud.r-project.org/")
options(repos = c(CRAN = "https://cloud.r-project.org/"))

# Install Rgff
install.packages("Rgff")

