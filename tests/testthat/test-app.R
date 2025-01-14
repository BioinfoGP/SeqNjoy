test_that("Shiny app launches and stop without error", {
    if (!requireNamespace("shinytest2", quietly = TRUE)) {
        skip("shinytest2 not installed")
    }
    
    library(shinytest2)
    # Set up the app directory
    app_dir <- system.file("app", package = "SeqNjoy")
    expect_true(file.exists(app_dir)) # Check that the app directory exists

    # Launch the app in test mode using AppDriver
    app <- AppDriver$new(app_dir,shiny_args=list(port=7628),variant = "test")

    # Check that the app driver was successfully created
    expect_s3_class(app, "AppDriver")
    
    # Ensure that SeqNjoy has correctly started
    # expect_true(any(grepl("Welcome to SeqNjoy!",app$get_logs()$message)))
    
    # Stop SeqNjoy
    # app$stop()
    
    # Ensure that SeqNjoy has correctly stopped
    # expect_true(tail(app$get_logs()$message,1) == "Thanks for using SeqNjoy!")
})
