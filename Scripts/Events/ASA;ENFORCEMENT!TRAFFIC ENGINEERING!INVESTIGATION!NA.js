/**
 * The below code is related to the Enforcement/Traffic Engineering/Investigation/NA record, with
 * an ApplicationSubmitAfter event. 
 */


copyParcelGisObjects();
serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);
setSingleAddressToPrimary(capId);
var gisIdForLayer = getGISIdForLayer("Intersection");
editAppSpecific("Intersection", gisIdForLayer);


assignCapToDept ("KNOXVILLE/KNOX/ENG/TRAFFIC/NA/NA/NA",capId);
