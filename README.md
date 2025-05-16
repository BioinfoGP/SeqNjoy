# SeqNjoy: Complete RNA-Seq workflow in your Desktop

**SeqNjoy** is a stand-alone application to generate and analyze differential gene expression results from RNA-Seq experiments. Analyses can be performed from the very initial step using the files containing short reads (also known as *FASTQ* files), or from an intermediate stage using alignments files (*BAM*/*SAM* files). The result of the **SeqNjoy** analyses are files containing annotated list of the genes (or other genetic features) differentially expressed between groups of samples in different conditions, and interactive HTML pages that allow the user to graphically analyze, filter and download selected genesets of interest.

**SeqNjoy** has a series of minimal requirements. Before trying to install it, check if your computer meets these requirements.

## Computer requirements

The following minimum computational requirements are adequate for carrying out analyses involving bacterial genomes, while recommended requirements are adequate also for eukaryotic genomes. 

<table border="1" cellspacing="1">
<thead>
<tr class="header">
<th align="left">File type</th>
<th align="left">Minimum</th>
<th align="left">Recommended</th>
</tr>
</thead>
<tbody >
<tr class="odd">
<td align="left">Architecture</td>
<td align="center"colspan=2">64-bit</td>
</tr>
<tr class="even">
<td align="left">Operative System</td>
<td align="center" colspan=2">Windows, macOS, Linux (Debian, Fedora or SUSE-based)</td>
</tr>
<tr class="odd">
<td align="left">Web Browser</td>
<td align="center" colspan=2">Chrome, Firefox, Safari</td>
</tr>
<tr class="even">
<td align="left">RAM Memory</td>
<td align="left">8GB</td>
<td align="left">16GB</td>
</tr>
<tr class="odd">
<td align="left">Disk Space</td>
<td align="left">500GB</td>
<td align="left">1TB</td>
</tr>
</tbody>
</table>


**SeqNjoy** is optimized to be used with 1920 x 1080 screen resolution (or higher).

Some of the steps performed by **SeqNjoy** may take many hours to complete. It is not recommended to run the application along other CPU or RAM intensive processes. 

Connection to the internet is NOT required (it is a stand-alone application), as long as all the libraries and packages needed for the analysis reside on the file system (your computer or a external hard disk, for example) where the installation is done.

## Software requirements

*SeqNjoy* is an R package; therefore, installing [R](https://cran.r-project.org/) is required before using the software.

### Windows
#### Rtools on Windows

RTools is necessary to install SeqNjoy on Windows because some neccesary R packages are not available as precompiled Windows binaries and must be built from source.

Download the appropriate version of RTools for your R installation from the official website: [https://cloud.r-project.org/bin/windows/Rtools/](https://cloud.r-project.org/bin/windows/Rtools/).

#### Bowtie2 aligner

To use the feature "Align reads with **Bowtie2**" on Windows, ensure the following software is installed:

1. **Python 3**
    - Python 3 is required for genome indexing.
    - If Python 3 is not already installed:
        - **Recommended Option:** Download and install Python 3 from the official website: [https://www.python.org/downloads/](https://www.python.org/downloads/).
        - Ensure that you check the option to **Add Python to PATH** during installation.
    - **Alternative Option:** Install Python 3 from the Microsoft Store. 
    - After installing Python, verify its installation by running the following command in a terminal: 
     ```cmd
         python3 --version
     ```
    - If python3 does not work and instead opens the Microsoft Store, you may need to adjust your system configuration:
        - Check **App Execution Aliases** settings: Open **Manage App Execution Aliases** in the Control panel and disable the python3 alias for the Microsoft Store.
        - Ensure that the installation path for Python is correctly added to your PATH environment variable. 



2. **Perl** 
    - Perl is required for sequence aligning
    - You can download and install Perl from [Strawberry Perl](http://strawberryperl.com/) or another Perl distribution for Windows.
    - After installing Perl, verify its installation by running the following command in a terminal:
    ```cmd
        perl --version
     ```
    
#### Pandoc

Pandoc is required to build the vignettes used within the app. If you do not already have Pandoc installed.

- Download Pandoc from the official website: [https://pandoc.org/installing.html](https://pandoc.org/installing.html).
- Follow the installation instructions for Windows.
- After installation, verify it by running the following command in a terminal:
```cmd
    pandoc --version
```

### macOS

Administrator privileges are required to install [R binaries](https://cran.r-project.org/bin/macosx/).

#### Pandoc

Pandoc is required to build the vignettes used within the app. If you do not already have Pandoc installed:

- Download Pandoc from the official website: [https://pandoc.org/installing.html](https://pandoc.org/installing.html).
- Follow the installation instructions for macOS.

#### Source compilers

Depending on the macOS distribution, developer tools and compilers such as xcode might be required. Check [R macOS tools](https://mac.r-project.org/tools/) website for installation instructions.

These tools are also required to install R from source.

### Linux

Installing SeqNjoy dependencies from source requires several system libraries. The package names vary depending on the Linux distribution. Ensure the appropriate libraries are installed by running the commands below.

#### Debian-based Distributions (e.g., Debian, Ubuntu)

```bash
    sudo apt-get install $i -y \
        build-essential gfortran libreadline-dev libx11-dev libxt-dev \
        libbz2-dev liblzma-dev libpcre2-dev libcurl4 libcurl4-openssl-dev \
        libpng-dev libjpeg-dev libxml2-dev libssl-dev librsvg2-dev
```
    
#### Fedora-based (e.g., Fedora, Red Hat, Rocky Linux)
```bash
    sudo yum install -y \
        make gcc-c++ gcc-gfortran readline-devel libX11 libX11-devel \
        libXt libXt-devel bzip2-devel pcre2-devel libcurl-devel \
        libxml2-devel openssl-devel libpng-devel libjpeg-turbo-devel \
        librsvg2-devel
```

#### Suse -based (e.g., openSUSE, SUSE Linux Enterprise)

```bash
    sudo zypper install -y  \
        make gcc-c++ gcc-fortran readline-devel libX11-devel libXt-devel \
        libbz2-devel lzma-sdk-devel pcre2-devel libcurl-devel \
        openjpeg-devel libxml2-devel libopenssl-devel libjpeg8-devel \
        libpng16-devel librsvg-devel
```

## Installation

<!--- 

### From Bioconductor

SeqNjoy is currently available in [Bioconductor](https://bioconductor.org/packages/SeqNjoy). To install the current release use:
```R

if (!requireNamespace("BiocManager", quietly = TRUE)){
    install.packages("BiocManager")
}

BiocManager::install("SeqNjoy")
```
-->
### From GitHub

The most recent release, avalaible on GitHub, can be installed using the `remotes` package. 
Pandoc is required to build vignettes (see Software requirements). 
You can disable this option, but some help pages will not be available.

```{r, eval=FALSE}

## Install Bioconductor
if (!requireNamespace("BiocManager", quietly = TRUE)){
    install.packages("BiocManager")
}

## Install remotes
if (!requireNamespace("remotes", quietly = TRUE)){
    install.packages("remotes")
}

## Install SeqNjoy without vignettes
remotes::install_github("BioinfoGP/SeqNjoy", dependencies=TRUE, bioc_version = BiocManager::version())

## Install SeqNjoy with vignettes
remotes::install_github("BioinfoGP/SeqNjoy", dependencies=TRUE, build_vignettes = TRUE, bioc_version = BiocManager::version())

```

**Warning:** Installation of Bioconductor dependencies can fail due to known bugs in the remotes package. If SeqNjoy installation fails due to missing required pacakges, install them manually from Bioconductor using:

```{r, eval=FALSE}

## Install Bioconductor
if (!requireNamespace("BiocManager", quietly = TRUE)){
    install.packages("BiocManager")
}
## Install required packages whos installation failed. e.g. "Rbowtie", "DESeq2"
BiocManager::install(c("Rbowtie","DESeq2"))

```

### From Source

Installation from source can also be done using devtools.

1. Download the latest gzipped package source code SeqNjoy_0.5.X.tar.gz available at [BioinfoGP’s GitHub repository](https://github.com/BioinfoGP/SeqNjoy).

2. Open R.

```{r, eval=FALSE}

## Set your working directory to the location where the package was downloaded. 
setwd("path/to/downloaded/package")

## Install devtools
if (!requireNamespace("devtools", quietly = TRUE)){
    install.packages("devtools")
}

## Install Bioconductor
if (!requireNamespace("BiocManager", quietly = TRUE)){
    install.packages("BiocManager")
}

# Create a temporary directory and extract the package contents
d <- tempdir()
untar("SeqNjoy_0.5.X.tar.gz", exdir=d)

# Install SeqNjoy
devtools::install(file.path(d, "SeqNjoy"), dependencies=TRUE, repos=BiocManager::repositories())
```

## Starting SeqNjoy

Open R, then load **SeqNjoy** library and launch the application. 
The browser will automatically start.

```R
library(SeqNjoy)

SeqNjoy()
```
If the browser has not already started, or you have closed it. 
Open your browser and enter the 
URL [http://127.0.0.1:7628/](http://127.0.0.1:7628/).

To stop *SeqNjoy*, click the "Exit SeqNjoy" button or press 
Ctrl+C in the R console.

## How to use SeqNjoy?

Detailed documentation and a Quick Guide to help you get started are available through 
the About menu within the application and online 
at [BioinfoGP's website](https://bioinfogp.cnb.csic.es/tools/seqnjoy), 

## Authors

- Juan Antonio Garcia-Martin
- Juan Carlos Oliveros
- Rafael Torres-Perez

