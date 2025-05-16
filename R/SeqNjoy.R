#' Start SeqNjoy app
#'
#' This function starts the SeqNjoy server and launches the browser 
#'
#' @return either run the app as a side effect or return a shiny.appobj object
#'
#' @importFrom shiny addResourcePath isolate observe observeEvent
#' @importFrom shiny removeResourcePath resourcePaths runApp shinyAppDir
#' @importFrom BiocIO export import
#' @importFrom DESeq2 DESeq DESeqDataSetFromHTSeqCount results
#' @importFrom dplyr group_by left_join relocate summarise
#' @importFrom dplyr mutate arrange
#' @importFrom edgeR estimateCommonDisp estimateTagwiseDisp 
#' @importFrom edgeR exactTest readDGE topTags
#' @importFrom fs dir_delete file_delete file_exists file_move path_home
#' @importFrom Rbowtie2 bowtie2 bowtie2_build
#' @importFrom Rgff get_features plot_features saf_from_gff
#' @importFrom Rhisat2 extract_splice_sites hisat2 hisat2_build
#' @importFrom jsonlite fromJSON toJSON
#' @importFrom Rsamtools asBam countBam indexBam indexFa 
#' @importFrom Rsamtools scanBamFlag scanBamHeader ScanBamParam testPairedEndBam
#' @importFrom Rsubread align buildindex featureCounts removeDupReads 
#' @importFrom Biostrings quality
#' @importFrom shinyjs runjs
#' @importFrom shinyFiles getVolumes parseDirPath shinyDirChoose
#' @importFrom ShortRead countFastq readFastq sread width
#' @importFrom tools file_ext file_path_sans_ext md5sum toTitleCase
#' @importFrom zip zipr zipr_append
#' @importFrom cli cli_alert_info cli_end cli_h2 cli_par cli_text cli_ul
#' @importFrom httpuv decodeURIComponent startServer stopServer 
#' @importFrom mime guess_type
#' @importFrom stringr str_c str_ends str_glue str_trunc
#' @importFrom openxlsx read.xlsx write.xlsx
#' @importFrom R.utils gunzip
#' @importFrom utils flush.console read.table write.table
#' @importFrom RCurl getURL url.exists
#' @importFrom rtracklayer import.gff2 export.gff
#' @importFrom DiagrammeR DiagrammeR
#' @importFrom DiagrammeRsvg export_svg
#' @importFrom rsvg rsvg_png
#' @importFrom magrittr %>%
#' @importFrom Rfastp rfastp
#' @importFrom knitr knit opts_chunk
#' @importFrom markdown markdownToHTML
#'
#' @examples
#' # This example runs only in interactive sessions:
#' if (interactive()) {
#'     SeqNjoy()
#' }
#'
#' @export

SeqNjoy<-function(){
    ## This call satisfies R CMD check for DiagrammeR, used in Rgff calls
    dummyDiagrammeR<-DiagrammeR::DiagrammeR()

    ## Check that the app directory is properly installed
    myAppDir<-system.file("app", package = "SeqNjoy")
    if (myAppDir == "") {
        stop("Could not find the SeqNjoy app directory. 
            Try re-installing `SeqNjoy`.", call. = FALSE)
    }

    ## If the session is non-interactive, the function respects 
    ## the shiny.launch.browser option. This lets users override 
    ## the default behavior if needed.
    launch_browser <- (interactive() || 
                        getOption("shiny.launch.browser", default = TRUE))

    ## Run SeqNjoy app.
    app<-shiny::shinyAppDir(appDir = myAppDir)
    shiny::runApp(app,port=7628, launch.browser = launch_browser)
}
