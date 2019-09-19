var vFrom = aa.env.getValue("From");
//var vInspectorFirstName = aa.env.getValue("InspectorFirstName");
//var vInspectorLastName = aa.env.getValue("InspectorLastName");

//in app inspector cannot be assigned 
//still need a way to check if inspector is filled in
//inspector name does not work - is blank even if "inspector" has a value
//ACA should be from ACA, AA is from AA, App has no value

if (vFrom != "ACA" || vFrom != "AA"){

//can do editAppSpecific if needed
//    editAppSpecific("Ward", "From: " + vFrom);

//lookup inspector from std choice user_districts - dependent on inspection area populated from record creation
    var vinspectorArea = AInfo["Inspection Area"];
    var vinspDisciplineDistrict = "Electric Inspection Zones-" + vinspectorArea;
    var autoInspector = lookup("USER_DISTRICTS", vinspDisciplineDistrict);

//	comment("Inspector: " + autoInspector);

    var vinspId = aa.env.getValue("InspectionIdList");

//    assignInspection(vinspId,"BLDTEST"); 
    assignInspection(vinspId,autoInspector); 
}

/*
var vinspInspector = inspInspector;
comment("Inspector: " + vinspInspector);

if (vinspInspector != "BLDTEST") {

	//var vinspType = inspType;
	//comment("Inspection Type: " + vinspType);

	var vinspectorArea = AInfo["Inspection Area"];
	comment("Inspection Area from ASI: " + vinspectorArea);

	var vinspDisciplineDistrict = "Electric Inspection Zones-" + vinspectorArea;
	comment("Inspection Discipline District: " + vinspDisciplineDistrict);

	var autoInspector = lookup("USER_DISTRICTS", vinspDisciplineDistrict);
	comment("Found Inspector: " + autoInspector);

	var vinspId = inspId;
	comment("Inspection ID: " + vinspId);

	assignInspection(vinspId,"BLDTEST"); 
}
*/