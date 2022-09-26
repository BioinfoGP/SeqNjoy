library(shinyjs)



options(shiny.maxRequestSize = 30*1000*1024^2)
options(shiny.autoreload = TRUE)

ui <- bootstrapPage(
	suppressDependencies("bootstrap"),
	includeHTML("www/index.html"),
	useShinyjs()
)

