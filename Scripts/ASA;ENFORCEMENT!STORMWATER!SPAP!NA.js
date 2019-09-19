// Enter your script here...



copyParcelGisObjects();


var v_cityblock = getGISInfo("KGIS", "Parcels", "LOW_BLOCK");
editAppSpecific("City Block Number", v_cityblock);

serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);
// SW Investigation Assign Watershed based on address
watershed = getGISInfo("KGIS", "Watershed Basin Boundaries", "BASIN_NAME");
editAppSpecific("Watershed", watershed);
//
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);
setSingleAddressToPrimary(capId);
var gisIdForLayer = getGISIdForLayer("Intersection");
editAppSpecific("Intersection", gisIdForLayer);


assignCapToDept ("KNOXVILLE/KNOX/ENG/STORM/NA/NA/NA",capId);