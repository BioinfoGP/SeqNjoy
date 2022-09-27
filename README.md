SeqNjoy: Complete RNA-Seq workflows in your Desktop
==========================================================

_The RNA-Seq GUI_
---------------------

[SeqNjoy](https://bioinfogp.cnb.csic.es/tools/seqnjoy) is a stand-alone application for generating and analyzing differential gene expression results from RNA-Seq experiments. Analyses can be performed from the very initial step, using the files containing short reads (FASTQ files), or from an intermediate stage, using already aligned reads in BAM/SAM files.

The main results of SeqNjoy are annotated list of genes differentially expressed (or not) between groups of samples. These results are presented both as standard tables and as interactive pages that allow the user to apply custom filters and to download ready-to-publish figures (scatter-plots).

Computer Requirements
---------------------

Architecture
: 64-bit

Operative System
: Windows, macOS, Linux (Debian or Fedora-based)

Web Browser
: Chrome, Firefox, Safari, Edge

RAM Memory
: 8 GB (minimum) / 16 GB (recommended)

Hard Disk
: 500 GB  (minimum) / 1 TB (recommended)


*   Minimum requirements are adequate for bacterial genomes. Recommended requirements are adequate also for eukaryotic genomes.
*   Some of the steps performed by SeqNjoy may take many hours to complete. It is recommended to run the application with no other intensive processes consumming CPU or RAM memory.  
    Please disable Sleep Mode or Hibernation in your computer to avoid interruptions of long lasting processes
*   It is recommended to install SeqNjoy on a dedicated hard disk, not shared with other documents or applications. Installing SeqNjoy on an external, USB-connected, 4-5 TB hard disk is a convenient choice that helps keeping organized all files of multiple projects.


Downloads
---------

Choose the installer for your operative system. Consult the [Help Pages](https://bioinfogp.cnb.csic.es/tools/seqnjoy/help) for complete installation instructions.

*   [Windows Installer (v 0.5.0)](https://bioinfogp.cnb.csic.es/tools/seqnjoy/download/SeqNjoy_0.5.0-Windows_setup.exe)
*   [Linux Installer (v 0.5.0)](https://bioinfogp.cnb.csic.es/tools/seqnjoy/download/SeqNjoy_0.5.0-Linux.tar.gz)
*   [macOS Installer (v 0.5.0)](https://bioinfogp.cnb.csic.es/tools/seqnjoy/download/SeqNjoy_0.5.0-macOS.dmg)


Install from source
---------

We strongly recommend downloading and using the corresponding installer for the desired operative system, that already contains precompiled versions (Windows and macOS) or the source code (Linux) of all necessary packages. 

The installation/launcher script has been tested on the following Linux platforms, all of them in the 64-bit architecture version: Debian 10.10, Ubuntu 20.04, Linux Mint 20.2, Fedora 34, Rocky Linux 8.6 and openSuse Leap 15.3.

If you want to run **SeqNjoy** from source, follow the installation instructions below:
   
  - Clone the **SeqNjoy** repository.
  
  - Open a terminal, navigate to the directory where the code has been downloaded and run the installation/launcher script in download mode:
~~~
      ./runSeqNjoy.sh -d 1
~~~

During the installation:

- **SeqNjoy** requires some system libraries installed that will be checked at the beginning of the installation. You will be asked for the installation of those libraries that are not already present. Note that the installation of libraries requires administrator privileges, either as root (*r* option) of superuser (*s* option).
- After the system library check, you will be asked for starting the **SeqNjoy** installation. Installation under Linux may take a long time, since it involves:
    a) Downloading, decompressing, compiling and installing R, version R-4.1.2.
    b) Downloading and installing the required R packages from CRAN and Bioconductor repositories .


Resources
---------

*   [Help Pages](https://bioinfogp.cnb.csic.es/tools/seqnjoy/help)
*   [Quick Guide](https://bioinfogp.cnb.csic.es/tools/seqnjoy/help/quick_guide) and [RNA-Seq Sample Files](https://bioinfogp.cnb.csic.es/files/samples/rnaseq) to start using SeqNjoy
*   Source code: [GitHub](github.com/BioinfoGP/SeqNjoy)

License
-------

Copyright 2022 BioinfoGP (CNB-CSIC). All rights reserved.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License 3 as published by the Free Software Foundation, either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

R-Portable and Google Chrome portable obtained from PortableApps.com are included along this software, as well as Strawberry Perl portable from [https://strawberryperl.com](https://strawberryperl.com)

You can read the full GNU General Public License [here](http://www.gnu.org/licenses/gpl-3.0.txt).

Credits
-------

*   Authors: Juan Antonio García-Martín, Rafael Torres-Pérez and Juan Carlos Oliveros
*   Please cite: Juan A Garcia-Martin, Rafael Torres-Perez and Juan C Oliveros (2022) SeqNjoy: Complete RNA-Seq workflows in your Desktop. (Manuscript in preparation)
*   Contact: bioinfogp@cnb.csic.es
