copyParcelGisObjects();
serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);

//get nearest intersection for parcel - if found will update Custom Field with value
var addNearestIntersection = COK_Nearest_Intersection_Function("Permits/Traffic Engineering/Wireless Facility Permit~Parcels");

//display error code if desired
//comment(capId + " add intersection cok_error_code: " + addNearestIntersection);

assignCapToDept ("KNOXVILLE/KNOX/ENG/TRAFFIC/NA/NA/NA",capId);