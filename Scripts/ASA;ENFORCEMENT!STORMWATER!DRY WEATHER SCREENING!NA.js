
watershed = getGISInfo("KGIS", "Watershed Boundary", "BASIN_NAME");
editAppSpecific("Watershed", watershed);

//Outfall Name

OutfallName = getGISInfo("KGIS", "Outfalls", "Outfall_Name");

editAppSpecific("Outfall", OutfallName);

//Append Outfall to Description
var workDesc = workDescGet(capId);
//if workDesc already has outfall name do not add
var res = workDesc.indexOf("Outfall: ")
//comment("workDesc: " + workDesc);
//comment("res: " + res);
if (res == -1) {
	var setDescription = updateWorkDesc("Outfall: " + OutfallName + " " + "\r" + workDesc);
}

//call function to add nearest address-parcel-owner to record if none exists on record
//that function will look up a standard choice called COK_Nearest_Address_Function_Input
//that entry will need the appropriate values GIS layers, attribute, etc. for the record type specified
var addNearestAddress = COK_Nearest_Address_Function("Enforcement/Stormwater/Dry Weather Screening/NA~Outfalls");

//take return code from function and look up appropriate message in standard choice
//if code = 0 (no issue) may not want to display message
comment(capId + " cok_error_code: " + addNearestAddress);
var v_get_error_message = lookup("COK_Nearest_Address_Function_Errors", addNearestAddress);
comment(capId + " v_get_error_message: " + v_get_error_message);
logDebug(capId + " v_get_error_message: " + v_get_error_message);
