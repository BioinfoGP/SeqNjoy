shiny::onStop(function() {
	if(exists("range_server")){
		range_server$stop_server()
	}
	message("Thanks for using SeqNjoy!")
	# q(save="no", status=50)
})

