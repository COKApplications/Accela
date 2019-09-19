copyParcelGisObjects();
serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);

assignCapToDept ("KNOXVILLE/KNOX/ENG/TRAFFIC/OPERATNS/NA/NA",capId);

var gisIdForLayer = getGISIdForLayer("Intersection");
editAppSpecific("Intersection", gisIdForLayer);

deactivateTask("Setup Work Order");
activateTask("Open");

updateAppStatus("Under Review", "Updated by PRA Script");