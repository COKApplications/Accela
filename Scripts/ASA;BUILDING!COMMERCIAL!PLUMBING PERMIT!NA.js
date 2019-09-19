//ASA:BUILDING/COMMERCIAL/PLUMBING PERMIT/NA

//testing lookup of project number, adding parent if project found
//adds condition if project not found

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));

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
		//var fieldValue = result.get(i).get("B1_CHECKBOX_DESC") + " | " + result.get(i).get("B1_CHECKLIST_COMMENT");
		var checkForProjectValue = result.get(i).get("B1_CHECKLIST_COMMENT");
		//comment("Checking for: " + checkForProjectValue);		
		sql = "select B1_ALT_ID ";
		sql = sql + "from accela.b1permit ";
		sql = sql + "where serv_prov_code = 'KNOXVILLE' ";
		sql = sql + "and b1_alt_id = '" + checkForProjectValue + "' ";
		//comment(sql);
		var result = aa.util.select(dbName, sql, null);

		//return is a success even if no records truly found (null) - need to check for number of results

		if (result.getSuccess()) {
			result = result.getOutput();
			if (i < result.size()) {
				comment("Project number " + checkForProjectValue + " found");
				//addParent(cap1 + "-" + cap2 + "-" + cap3);
				//addParent(checkForProjectValue);
				addParent(aa.cap.getCapID(checkForProjectValue).getOutput());
				comment("Parent " + checkForProjectValue + " added");
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
comment("Completed");