
#R_LIBSRC<-"./R-libs"
Sys.setenv(DOWNLOAD_STATIC_LIBV8=1);
options(repos =R_LIBSRC )
options(repos = c(CRAN = R_LIBSRC))
localPKGs<-list.files(paste0(R_LIBSRC,"/src/contrib/"))
localPKGs<-localPKGs[grep("tar.gz",localPKGs)]

installPKG<-sapply(strsplit(localPKGs,"_"), function(x){x[1]})

for (l in installPKG){
	if (!requireNamespace(l, quietly = TRUE))
		install.packages(l, repos = file.path("file://",normalizePath(R_LIBSRC)), type="source")
}

#install.packages(installPKG, repos = R_LIBSRC, type="source")


