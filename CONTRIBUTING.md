The Open Farm Carbon Tracker is a community project and we welcome contributions from anyone! 

Useful links:
<a href="https://github.com/euraf/OpenFarmCarbonTracker/blob/main/README.md">README</a>

<h1>Non-code contributions</h1>
There are several ways that you can contribute to the OFCT without coding. These are: 

<ul>
<li>Contributing with data sources and references for parameters</li>
<li>Report bugs and issues <a href="https://github.com/euraf/OpenFarmCarbonTracker/issues">here</a></li>
<li>Translating the OFCT app to a new language.</li>
</ul>

<strong>Contributing sources for parameters</strong>

The Open Farm Carbon Tracker seeks to adhere to the highest standards of transparency and scientific rigor. This means that sources needs to:
<ul>
  <li>be supported by litterature, ideally peer reviewed litterature</li>
  <li>have a DOI, to ensure permanence in the source availability</li>
</ul>

<h1>Contributing to development</h1>

<h2>Methodologies and model development</h2>

The long term strategy of the Open Farm Carbon Tracker is to improve modelling from Tier 1 towards Tier 2 and 3. We welcome any contributions that can:
<ul>
  <li>evaluate, scrutinize and improve already implemented methodologies</li>
  <li>increase methodologies from Tier 1 to Tier 2 and 3</li>
</ul>

<h2>Parsing open datasets for automated data integration</h2>

The aim with the OFCT is to leverage several open datasets to quickly populate input data for establishing a baseline scenario for a farm. 

<ul>
  <li>LPIS data for land-use and crop data.</li>
</ul>

<h3>Land-use and crop data from LPIS datasets</h3>

Each country (Or region) has their own LPIS data format which is updated once or several times a year. LPIS data integeration is currently being developed for the following countries:

<ul>
  <li>Denmark (DK)</li>
</ul>

The following countries have high priority: 

<ul>
  <li>Czech Republic (CZ)</li>
  <li>France (FR)</li>
  <li>Netherlands (NL)</li>
  <li>Finland (FI)</li>
</ul>

<strong>Adding LPIS crop reference files</strong>

The OFCT use LPIS crop reference codes to pre-fill most current crop references for specific countries. 

The crop references are located in <code>/ui/source/data</code>. Several files can be added for each country, with crop references for specific years. To add a new LPIS crop reference file for a specific country or region, create the file in the directory <a href="https://github.com/euraf/OpenFarmCarbonTracker/tree/main/ui/src/data">/ui/source/data</a> and use the naming convention <code>LPIS_[COUNTRY]_[YEAR].ts</code>. 

Example of crop reference code file:
For an example of how a crop reference file can look we have an example for Denmark here:
<a href="https://github.com/euraf/OpenFarmCarbonTracker/blob/main/ui/src/data/LPIS_DK_2023.ts">ui/source/data/LPIS_DK_2023.ts</a>
