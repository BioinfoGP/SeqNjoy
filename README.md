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

### Bowtie2 aligner on Windows 

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

## Installation

<!--- 

SeqNjoy is currently available in [Bioconductor](https://bioconductor.org/packages/SeqNjoy). To install the current release use:
```R

if (!requireNamespace("BiocManager", quietly = TRUE)){
    install.packages("BiocManager")
}

BiocManager::install("SeqNjoy")
```
-->

The most recent release, avalaible on GitHub, can be installed using devtools. 

```{r, eval=FALSE}
if (!requireNamespace("devtools", quietly = TRUE)){
    install.packages("devtools")
}

devtools::install_github("BioinfoGP/SeqNjoy", dependencies=TRUE, build_vignettes = TRUE)

```

Installation from source can also be done using devtools.

   - Download the gzipped package source code SeqNjoy_0.5.6.tar.gz available at [BioinfoGP’s GitHub repository](https://github.com/BioinfoGP/SeqNjoy).
   - Open R.

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
untar("SeqNjoy_0.5.6.tar.gz", exdir=d)

# Install SeqNjoy
devtools::install(file.path(d, "SeqNjoy"), dependencies=TRUE, repos=BiocManager::repositories())
```


## Starting SeqNjoy

Load **SeqNjoy** library 
```R
library(SeqNjoy)
```

Launch the application. The browser will automatically start.
```R
SeqNjoy()
```


## How to use SeqNjoy?

SeqNjoy includes vignettes with detailed help intructions and a Quick Guide.
To access the vignettes, please use:

```R
vignette('SeqNjoy')
vignette('SeqNjoy_Tutorial')
vignette('SeqNjoy_QuickGuide')
```

Additional information will be available at [BioinfoGP's website](https://bioinfogp.cnb.csic.es/tools/seqnjoy)

## Authors

- Juan Antonio Garcia-Martin
- Juan Carlos Oliveros
- Rafael Torres-Perez

