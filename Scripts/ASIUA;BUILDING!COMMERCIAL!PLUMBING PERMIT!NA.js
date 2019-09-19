//ASIUA:BUILDING/COMMERCIAL/PLUMBING PERMIT/NA
showMessage = true;

var alternateId = capId.getCustomID();
var cap1 = capId.getID1();
var cap2 = capId.getID2();
var cap3 = capId.getID3();
var dbName = "jetspeed";
var sql = "select B1_CHECKBOX_DESC, B1_CHECKLIST_COMMENT ";
sql = sql + "from accela.bchckbox ";
sql = sql + "where serv_prov_code = 'KNOXVILLE' ";
sql = sql + "and b1_per_id1 = '" + cap1 + "' ";
sql = sql + "and b1_per_id2 = '" + cap2 + "' ";
sql = sql + "and b1_per_id3 = '" + cap3 + "' ";
sql = sql + "and upper(B1_CHECKBOX_DESC) = 'PROJECT NUMBER' ";
sql = sql + "order by b1_group_display_order, b1_display_order "
//comment(sql);
var result = aa.util.select(dbName, sql, null);

if (result.getSuccess()) {
	result = result.getOutput();
	var i = 0;
	//comment("Total # of records: " + result.size());
	
	if (i < result.size()) {

		var addParentOK = "YES";

		//var fieldValue = result.get(i).get("B1_CHECKBOX_DESC") + " | " + result.get(i).get("B1_CHECKLIST_COMMENT");
		var checkForProjectValue = result.get(i).get("B1_CHECKLIST_COMMENT");
		checkForProjectValue = checkForProjectValue.toUpperCase();
		//comment("Checking for: " + checkForProjectValue);		

		//if this record already has a parent - check if it is the same as the one entered
		//if it is the same then no need to add it again
		//if it is not the same then notify user and do not add another parent - user will need to remove existing parent
		var parentCapId = getParent();
		if (parentCapId != null){
			var parentalternateId = parentCapId.getCustomID();
			//comment("parentCapId: " + parentCapId + " parentalternateId: " + parentalternateId);
			parentalternateId = parentalternateId.toUpperCase();
			if (parentalternateId == checkForProjectValue){
				comment("This project number "  + checkForProjectValue + " is already related to this record");
				addParentOK = "NO";
			}else{
				comment("Record has a project number: "  + parentalternateId + ". No relationship will be added. Remove the current relationship before updating this field.");
				createCapComment("Record has a project number: "  + parentalternateId + ". No relationship will be added. Remove the current relationship before updating this field.");
				addParentOK = "NO";
				//set Project Number value back to prior value
				sql = "update accela.bchckbox ";
				sql = sql + "set B1_CHECKLIST_COMMENT = '" + parentalternateId + "' ";
				sql = sql + "where serv_prov_code = 'KNOXVILLE' ";
				sql = sql + "and b1_per_id1 = '" + cap1 + "' ";
				sql = sql + "and b1_per_id2 = '" + cap2 + "' ";
				sql = sql + "and b1_per_id3 = '" + cap3 + "' ";
				sql = sql + "and upper(B1_CHECKBOX_DESC) = 'PROJECT NUMBER' ";
				result = aa.util.update(dbName, sql, null);
			}
		}
			
		if(addParentOK == "YES"){
		
			sql = "select B1_ALT_ID, B1_APPL_STATUS, B1_APP_TYPE_ALIAS ";
			sql = sql + "from accela.b1permit ";
			sql = sql + "where serv_prov_code = 'KNOXVILLE' ";
			sql = sql + "and b1_alt_id = '" + checkForProjectValue + "' ";
			//comment(sql);
			var result = aa.util.select(dbName, sql, null);

			if (result.getSuccess()) {
				result = result.getOutput();
				if (i < result.size()) {
					comment("Project number " + checkForProjectValue + " found");
					//check on location (parcel), type, and status
					var recordtypeString = result.get(i).get("B1_APP_TYPE_ALIAS");
					recordtypeString = recordtypeString.toUpperCase();
					if (recordtypeString.indexOf("BUILDING PERMIT") == -1){
						addParentOK = "NO";
						createCapComment("Project number is not correct permit type - parent not added: " + checkForProjectValue + " " + recordtypeString);
					}
					var recordStatus = result.get(i).get("B1_APPL_STATUS");
					recordStatus = recordStatus.toUpperCase();
					if (recordStatus != "OPEN" && recordStatus != "APPLIED" && recordStatus != "APPROVED"){
						addParentOK = "NO";
						createCapComment("Project cannot be added as parent - must be in Open/Applied/Approved status: " + checkForProjectValue + " " + recordStatus);
					}
					if (addParentOK == "YES"){
						addParent(aa.cap.getCapID(checkForProjectValue).getOutput());
						comment("Parent " + checkForProjectValue + " added");
						createCapComment("Parent added by ASIUA script: " + checkForProjectValue);
					}else{
						//add condition so that number can be identified as needing correction
						addStdCondition("Lock", "COK Project Association Check", capId);
					}
				}else{
					if (checkForProjectValue != null && checkForProjectValue != "") {
						comment("1-Project number " + checkForProjectValue + " not found");
						//add condition so that number can be identified as needing correction
						addStdCondition("Lock", "COK Project Association Check", capId);
					}else{
						comment("2-Project number not entered " + checkForProjectValue);	
					}
				}
			}else{
				comment("3-Project number not entered " + checkForProjectValue);	
			}
		}
	}
}
comment("Completed");