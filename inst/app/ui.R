


options(shiny.maxRequestSize = 30*1000*1024^2)
options(shiny.autoreload = TRUE)

ui <- bootstrapPage(
	#suppressDependencies("bootstrap"),
	suppressWarnings(shiny::includeHTML("www/index.html")),
	shinyjs::useShinyjs(),
	shinyFiles::shinyDirButton("ChangeProjects_DirButton", "Projects Folder...", "Select projects folder",class="btn btn-default btn-primary action-button")
)

