//var cTypeArray;
var childId;

cTypeArray = new Array("Building","Residential","Building Permit","Trade Contractor");
childId = createChildTempRecord(cTypeArray);

showMessage = true;
comment("childId =" + childId);

copyParcelGisObjects();
serviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
editAppSpecific("Service Area", serviceArea);
CouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
editAppSpecific("Council District", CouncilDistrict);
//trafficzone = getGISInfo("KGIS", "Traffic Zones (2000 Census)", "TAZ");
//editAppSpecific("Traffic Zone", trafficzone);
//zoning =  getGISInfo("KGIS", "Zoning Labels", "ZONE_LABEL");
//editAppSpecific("Zoning", zoning);
//var today = new Date();
//editAppSpecific("Applied",dateFormatted(today.getMonth()+1,today.getDate(),today.getFullYear(),"MM/DD/YYYY"));

InspectorName = getGISInfo("KGIS", "Electric Inspection Zones", "Inspector",-1,"feet");
//InspectorInitials = getGISInfo("KGIS", "Electric Inspection Zones", "Comments",-1,"feet");
//comment("Insp Name: " + InspectorName);
//comment("Insp Initials: " + InspectorInitials);
InspectorArea = getGISInfo("KGIS", "Electric Inspection Zones", "OBJECTID",-1,"feet");
editAppSpecific("Inspection Area", InspectorArea);

//set short desc = 1st 80 of original long desc
var workDesc = workDescGet(capId);
//comment("Work Desc: " + workDesc);
var workDescString = workDesc.toString();
var workDescLength = workDescString.length();
//comment("Work Desc Len: " + workDescLength);

if (workDescLength > 80) {
//    comment("Work Desc more than 80");
    var workDescShort = workDesc.substring(0, 80);
//    comment("Work Desc Short: " + workDescShort);
    var setShortNotes = updateShortNotes(workDescShort, capId);
}
else {
    var setShortNotes = updateShortNotes(workDesc, capId);
}

//add subtype to beginning of work description
//workDesc = v_sub_type + " - " +   workDesc;
//var setDescription = updateWorkDesc(workDesc);
