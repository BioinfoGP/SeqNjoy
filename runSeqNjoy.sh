#!/bin/bash

R_VER="4.1.2"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
R_SRC="${SCRIPT_DIR}/R-src"
R_DIR="${SCRIPT_DIR}/R-${R_VER}"
R_EXE="${R_DIR}/bin/R"
RSCRIPT_EXE="${R_DIR}/bin/Rscript"
R_LIB_DIR="${R_DIR}/lib/R/library"

R_LIBSRC="${SCRIPT_DIR}/R-libs"
R_LOCALLIBSRC="${SCRIPT_DIR}/R-localLibs"
SYS_LIBSRC="${SCRIPT_DIR}/Sys-libs"
APP_NAME="SeqNjoy"
APP_DIR="${SCRIPT_DIR}/${APP_NAME}"
APP_PORT="7628"
APP_LOG_DIR="${SCRIPT_DIR}/logs"

DOWNLOAD_MODE=0


CHECK_LIBS_SCRIPT="${R_LIBSRC}/test_libraries.R"
APP_LIBS_FILE="${R_LIBSRC}/app_libraries.txt"
MISSING_LIBS_FILE="${R_LIBSRC}/missing_libraries.txt"

nargs=1;

until [[ 1 -gt "$#" ||  -z "$1" ]]  # Until all parameters used up . . .
do
	if  [ "$1" == "-d" ] 
	then
		shift
		nargs=$((nargs + 1))
		if [ -z "$1" ]; then 
			echo "No value DOWNLOAD_MODE (-d) parameter. Please specify 1-(ENABLED) or 0(DISABLED)";
			exit;
		else
			DOWNLOAD_MODE=$1;
		fi
	fi
	shift
	nargs=$((nargs + 1))
done


R_INSTALLED="0"
RLIB_INSTALLED="0"

if [ -f "${MISSING_LIBS_FILE}" ] &&  [ "OK" == $(cat "${MISSING_LIBS_FILE}") ]; then
	echo "Libraries are installed"
	
fi


if [ -f "$R_EXE" ]; then
	R_INSTALLED="1"
	if [ -f "${MISSING_LIBS_FILE}" ] &&  [ "OK" == $(cat "${MISSING_LIBS_FILE}") ];
	then
		RLIB_INSTALLED="1"
	fi
fi


if [ "$R_INSTALLED" == "0" ] || [ "$RLIB_INSTALLED" == "0" ]; then
	# READ REQUIRED SYSTEM LIBRARY FILES
	DEBIAN_LIBS=()
	while IFS= read -r line; do
	   DEBIAN_LIBS+=("$line")
	done < ${SYS_LIBSRC}/debian_libs.txt

	FEDORA_LIBS=()
	while IFS= read -r line; do
	   FEDORA_LIBS+=("$line")
	done < ${SYS_LIBSRC}/fedora_libs.txt

	SUSE_LIBS=()
	while IFS= read -r line; do
	   SUSE_LIBS+=("$line")
	done < ${SYS_LIBSRC}/suse_libs.txt


	REQ_LIB_INSTALL=0
	MISSING_LIBS=""
	REQ_R_INSTALL=0

	echo "Detecting Linux distribution..."

	IS_DEBIAN=0
	IS_FEDORA_RH=0
	IS_ARCH=0
	IS_SUSE=0
	if [ -f "/etc/os-release" ]; then
		if grep -q "debian" /etc/os-release; then
			IS_DEBIAN=1
		elif grep -q "ubuntu" /etc/os-release; then
			IS_DEBIAN=1
		elif grep -q "fedora" /etc/os-release; then
			IS_FEDORA_RH=1
		elif grep -q "opensuse" /etc/os-release; then
			IS_SUSE=1
		elif grep -q "arch" /etc/os-release; then
			IS_ARCH=1
		fi
	fi


	if [ "$IS_DEBIAN" == "0" ] && [ "$IS_FEDORA_RH" == "0" ] && [ "$IS_ARCH" == "0" ] && [ "$IS_SUSE" == "0" ]; then
		if which lsb_release &>> /dev/null; then
			OS_TYPE=$(lsb_release -a 2> /dev/null | grep -P '^Description:[\s]+.+$' | awk '{print $2}')
		elif [ -r /etc/issue ]; then
			OS_TYPE=$(head -n 1 /etc/issue | awk '{print $1}')
		else
			OS_TYPE=$(for f in $(find /etc -type f -maxdepth 1 \( ! -wholename /etc/os-release ! -wholename /etc/lsb-release -wholename /etc/\*release -o -wholename /etc/\*version \) 2> /dev/null); do echo ${f:5:${#f}-13}; done;)
		fi

	fi

	# ToDo: Determine distribution from OS_TYPE  (Debian, ubuntu, Suse)

	if [ "$IS_DEBIAN" == "0" ] && [ "$IS_FEDORA_RH" == "0" ] && [ "$IS_ARCH" == "0" ] && [ "$IS_SUSE" == "0" ]; then
		echo "Detected distribution name is (${OS_TYPE}), but the distribution type cannot be determined. Allowed types are Debian-based (d), Fedora/RHEL-based (f) and openSUSE (s). Select one of them or (x) exit."
		while true; do
			read -p "Please select the distribution type or exit to skip library installation:" dfsx
			case $dfsx in
				[Dd]* ) IS_DEBIAN=1; break;;
				[Ff]* ) IS_FEDORA_RH=1; break;;
				[Ss]* ) IS_SUSE=1; break;;
				[Xx]* ) exit;;
				* ) echo "Please answer Debian-based (d), Fedora/RHEL-based (f), openSUSE-based (s) or exit (x).";;
			esac
		done
	else
		if [ "$IS_DEBIAN" == "1" ] ; then
			echo "Debian-based Linux detected."
			for i in "${DEBIAN_LIBS[@]}"
			do
				PKG_OK=$(dpkg-query -W --showformat='${Status}\n' $i 2> /dev/null |grep "install ok installed" )
				if [ "" == "$PKG_OK" ]; then
					MISSING_LIBS=" $MISSING_LIBS $i"
					#echo "Package $i not found. "
					REQ_LIB_INSTALL=1
				fi
			done

		elif [ "$IS_FEDORA_RH" == "1" ] ; then
			echo "Fedora/RHEL-based Linux detected."
			for i in "${FEDORA_LIBS[@]}"
			do
	#			PKG_OK=$(yum list installed $i 2> /dev/null |grep "$i")
				PKG_OK=$(rpm -qa $i)
				if [ "" == "$PKG_OK" ]; then
					MISSING_LIBS=" $MISSING_LIBS $i"
					#echo "Package $i not found. "
					REQ_LIB_INSTALL=1
				fi
			done
		elif [ "$IS_SUSE" == "1" ] ; then
			echo "openSUSE-based Linux detected."
			for i in "${SUSE_LIBS[@]}"
			do
				PKG_OK=$(rpm -qa $i)
				if [ "" == "$PKG_OK" ]; then
					MISSING_LIBS=" $MISSING_LIBS $i"
					#echo "Package $i not found. "
					REQ_LIB_INSTALL=1
				fi
			done
		elif [ "$IS_ARCH" == "1" ]; then
			echo "Arch-based Linux detected."
			echo "The libraries for this distribution must be installed manually."
			exit;
		fi
	fi


	if [ "$REQ_LIB_INSTALL" == 1 ]; then
		echo "Checking if required system libraries are installed...  NO"
		echo "Some required system libraries are missing:"
		echo "${MISSING_LIBS}"
		while true; do
			read -p "Do you wish to install the required libraries? If not the installation can fail: (yes/no/cancel) " ync
			case $ync in
				[Yy]* ) cd ${SYS_LIBSRC};./installSysLibraries.sh -l "${SYS_LIBSRC}";cd ${SCRIPT_DIR};$0 -d ${DOWNLOAD_MODE};exit;;
				[Nn]* ) echo "Continuing installation without the required libraries";break;;
				[Cc]* ) exit;;
				* ) echo "Please answer (y)es, n(o) or (c)ancel.";;
			esac
		done
	else
		echo "Checking if required system libraries are installed...  YES"
	fi

	current_user=${SUDO_USER:-$(whoami)}
	if [ "$current_user" == "root" ]; then
		while true; do
			read -p "You are logged as root. It is recommended that you install ${APP_NAME} as a normal user. Do you want to continue as root? (yes/no) " yn
			case $yn in
				[Yy]* ) echo "Continuing installation as root";break;;
				[Nn]* ) echo "Exiting. Please log in as a normal user and run $0";exit;;
				* ) echo "Please answer yes or no.";;
			esac
		done	
	fi 

	if [ ! -f "$R_EXE" ]; then	
		echo "Checking if ${APP_NAME} is installed...  NO"
		while true; do
			read -p "Do you want to proceed with ${APP_NAME} installation? Estimated time: 40 minutes. (yes/no) " yn
			case $yn in
				[Yy]* ) break;;
				[Nn]* ) exit;;
				* ) echo "Please answer yes or no.";;
			esac
		done
		echo "Installing R..."

		cd ${R_SRC} 
		# Check ir R source exists, if not download it from https://cran.r-project.org/src/base/R-4/R-${R_VER}.tar.gz
		if [ ! -f "${R_SRC}/R-${R_VER}.tar.gz" ]; then
			wget https://cran.r-project.org/src/base/R-${R_VER:0:1}/R-${R_VER}.tar.gz -O "${R_SRC}/R-${R_VER}.tar.gz"
		fi
		tar -xvzf R-${R_VER}.tar.gz
		cd R-${R_VER}
		mkdir -p ${R_DIR}
		./configure --prefix=${R_DIR}
		make
		make install
		cd ${APP_DIR}

		if [ ! -f "$R_EXE" ]; then
			echo "ERROR: R installation failed! Check that the system libraries have been correctly installed"
			exit
		else
			echo "R installed succesfully. Installing R libraries..."
		fi
	else
		echo "Checking if ${APP_NAME} is installed...  NO"
	fi

	mkdir -p ${R_LIB_DIR}
	
	if [ "$DOWNLOAD_MODE" == "1" ]; then
		${R_EXE} -e "R_LIBSRC<-'${R_LIBSRC}';.libPaths( c('${R_LIB_DIR}',.libPaths()));source(paste0('${R_LIBSRC}','/install_libraries.R'));source('${CHECK_LIBS_SCRIPT}');checkAppPackages('${APP_LIBS_FILE}','${MISSING_LIBS_FILE}');"
	else
		if [ -d "${R_LOCALLIBSRC}/src" ]; then
			${R_EXE} -e "R_LIBSRC<-'${R_LOCALLIBSRC}';.libPaths( c('${R_LIB_DIR}',.libPaths()));source(paste0('${R_LIBSRC}','/install_libraries_fromSrc.R'));source('${CHECK_LIBS_SCRIPT}');checkAppPackages('${APP_LIBS_FILE}','${MISSING_LIBS_FILE}');"
		else
			echo "R local packages are not available for installation. Type $0 -d 1 to run the installer in download mode."
		fi

	fi
	
	if [ -f "${MISSING_LIBS_FILE}" ] &&  [ "OK" == $(cat "${MISSING_LIBS_FILE}") ]; then
		echo "Creating ${APP_NAME} icons... "	
		if [ -d "${HOME}/.local/share/applications" ]; then 
			echo "Creating ${APP_NAME} app launcher ";
			cat > "${HOME}/.local/share/applications/${APP_NAME}.desktop" << EOF
#!/usr/bin/env xdg-open
[Desktop Entry]
Type=Application
Terminal=true
Exec=${SCRIPT_DIR}/runSeqNjoy.sh
Name=${APP_NAME}
Comment=${APP_NAME}
Icon=${SCRIPT_DIR}/SeqNjoyLogo.png
EOF

			chmod +x "${HOME}/.local/share/applications/${APP_NAME}.desktop"
			echo "Created ${APP_NAME} app launcher ";
		fi

		DESKTOP_PATH=$(xdg-user-dir DESKTOP)

		if [ -d "${DESKTOP_PATH}" ]; then 
			echo "Creating ${APP_NAME} desktop launcher ";		
			cat > "${DESKTOP_PATH}/${APP_NAME}.desktop" << EOF
#!/usr/bin/env xdg-open
[Desktop Entry]
Type=Application
Terminal=true
Exec=${SCRIPT_DIR}/runSeqNjoy.sh
Name=${APP_NAME}
Comment=${APP_NAME}
Icon=${SCRIPT_DIR}/SeqNjoyLogo.png
EOF

			gio set "${DESKTOP_PATH}/${APP_NAME}.desktop" metadata::trusted true
			chmod +x "${DESKTOP_PATH}/${APP_NAME}.desktop"
			echo "Created ${APP_NAME} desktop launcher "
		fi

	fi
fi



if [ -f "${MISSING_LIBS_FILE}" ] &&  [ "OK" == $(cat "${MISSING_LIBS_FILE}") ]; then
	echo "Libraries are installed."

	# Create log directory	
	mkdir -p ${APP_LOG_DIR}
	DATE_STR=$(date +%F)
	TIME_STR=$(date +%T)
	RUN_LOG_DIR="${APP_LOG_DIR}/${DATE_STR}"
	mkdir -p ${RUN_LOG_DIR}

	cd ${APP_DIR}	
	# Start SeqNjoy
	echo "Starting SeqNjoy: Close the browser to finish the program."
	echo "Session log file: ${RUN_LOG_DIR}/${DATE_STR}-${TIME_STR}.log"

	${R_EXE} -e ".libPaths( c('${R_LIB_DIR}',.libPaths()));library(shiny);app <- shinyAppDir('${APP_DIR}'); shiny::runApp(app, port=${APP_PORT}, launch.browser = TRUE)" &> "${RUN_LOG_DIR}/${DATE_STR}-${TIME_STR}.log"

	echo "Thank you for using SeqNjoy!"

else
	MISSING_LIBS=$(cat "${MISSING_LIBS_FILE}")
	echo "Installation error: The following R packages could not be loaded:"
	echo "${MISSING_LIBS}"
	echo "Check that you have installed the all the required system libraries."

fi









