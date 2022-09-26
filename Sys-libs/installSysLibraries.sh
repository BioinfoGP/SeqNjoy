#!/bin/bash
#/home/tono/CNB/bionfogp/FINNY/R-4.0.4/bin/R -e 'source("server.R");source("ui.R");app <- shiny::shinyAppDir(ui, server); shiny::runApp(app, launch.browser = TRUE)'

#/home/tono/CNB/bionfogp/FINNY/R-4.0.4/bin/R -e 'source("server.R");source("ui.R");app <- shinyAppDir("./"); shiny::runApp(app, launch.browser = TRUE)'

# Ubuntu libraries: sudo apt-get install build-essential gfortran libreadline-dev xorg-dev libbz2-dev liblzma-dev  libpcre2-dev libcurl4 libcurl4-openssl-dev -y
# Ubuntu libraries: sudo apt-get install libjpeg-dev libxml2-dev libssl-dev libmagick++-dev -y

# Fedora libraries: yum install gcc-c++ gcc-gfortran readline-devel libX11 libX11-devel libXt libXt-devel bzip2-devel lzma-devel  pcre2-devel libcurl-devel
# Fedora libraries: yum install openjpeg-devel libxml2-devel openssl-devel ImageMagick-c++-devel libpng-devel libjpeg-turbo-devel

# Output by OS: https://gist.github.com/natefoo/814c5bf936922dad97ff 
#

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

SYS_LIBSRC="."


nargs=1;

until [[ 1 -gt "$#" ||  -z "$1" ]]  # Until all parameters used up . . .
do
	if  [ "$1" == "-l" ] 
	then
		shift
		nargs=$((nargs + 1))
		if [ -z "$1" ]; then 
			echo "No SYS_LIBSRC (-l) parameter";
			exit;
		else
			SYS_LIBSRC=$1;
		fi
	fi
	shift
	nargs=$((nargs + 1))
done



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



if (($EUID != 0)); then
	echo "You must be root or have administrative privileges (sudo) in order to install the required libraries"
	RUN_AS_SUDO=0
	RUN_AS_ROOT=0
	while true; do
		read -p "Indicate if your user have sudo privileges (s), you want to switch to root user (r) or exit (x):" srx
		case $srx in
			[Ss]* ) RUN_AS_SUDO=1; break;;
			[Rr]* ) RUN_AS_ROOT=1; break;;
			[Xx]* ) echo "Exiting..." ; exit;;
			* ) echo "Please answer sudo privileges (s), root (r) or exit (x).";;
		esac
	done

	if [ "$RUN_AS_SUDO" == "1" ]; then
		echo "Asking for administrative privileges."
		if [[ -t 1 ]]; then
			sudo "$0" "$@"
		else
			exec 1>output_file
			gksu "$0 $@"
		fi
	elif [ "$RUN_AS_ROOT" == "1" ]; then
		echo "Logging as root to install the required libraries."
		su -c "${SYS_LIBSRC}/$0"
	fi
else 

	echo "System library installer."
#	DEBIAN_LIBS=("build-essential" "gfortran" "libreadline-dev" "libx11-dev" "libbz2-dev" "liblzma-dev" "libpcre2-dev" "libcurl4" "libcurl4-openssl-dev" "libjpeg-dev" "libxml2-dev" "libssl-dev" "librsvg2-dev" "libnode-dev")
#	FEDORA_LIBS=("make" "gcc-c++" "gcc-gfortran" "readline-devel" "libX11" "libX11-devel" "libXt" "libXt-devel" "bzip2-devel" "lzma-sdk-devel" "pcre2-devel" "libcurl-devel" "libxml2-devel" "openssl-devel" "libpng-devel" "libjpeg-turbo-devel" "librsvg2-devel" "v8-devel")
#	SUSE_LIBS=("make" "gcc-c++" "gcc-fortran" "readline-devel" "libX11-devel" "libXt-devel" "libbz2-devel" "lzma-sdk-devel" "pcre2-devel" "libcurl-devel" "openjpeg-devel" "libxml2-devel" "libopenssl-devel" "libjpeg8-devel" "libpng16-devel" "librsvg-devel")

	REQ_LIB_INSTALL=0

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
			echo "Installing system libraries..."
			for i in "${DEBIAN_LIBS[@]}"
			do
				apt-get install $i -y
			done

		elif [ "$IS_FEDORA_RH" == "1" ] ; then
			echo "Fedora/RHEL-based Linux detected."
			echo "Installing system libraries..."
			for i in "${FEDORA_LIBS[@]}"
			do
				yum install -y $i 
			done
		elif [ "$IS_SUSE" == "1" ] ; then
			echo "openSUSE-based Linux detected."
			echo "Installing system libraries..."
			for i in "${SUSE_LIBS[@]}"
			do
				zypper install -y $i 
			done
		elif [ "$IS_ARCH" == "1" ]; then
			echo "Arch-based Linux detected."
			echo "The libraries for this distribution must be installed manually."
		fi
	fi
fi
