//user enters project number in ASI field as part of ACA application
//SQL is used to check if that is a valid project number in the system
//if so then add that as the parent
//if number is not valid then corresponding ASA script will add a condition so record can be checked

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));

createCapComment("CRCA script ran");

var dbName = "jetspeed";

var i = 0;

//var checkForProjectValue = "BU17-00044";
var checkForProjectValue;
var performCheck = "YES";

//get ID for record being entered
var myId1 = aa.env.getValue("PermitId1");
var myId2 = aa.env.getValue("PermitId2");
var myId3 = aa.env.getValue("PermitId3");
createCapComment("CRCA script - myId: " + myId1 + "-" + myId2 + "-" + myId3);
var myId = aa.cap.getCapID(myId1, myId2, myId3);
var myCap = myId.getOutput();

var vProjectNumber = getAppSpecific("Project Number", myCap);
createCapComment("CRCA script - vProjectNumber: " + vProjectNumber);
//ensure that variable value is capitalized
if (vProjectNumber != null && vProjectNumber != "") {
	checkForProjectValue = vProjectNumber.toUpperCase();
}else{
	checkForProjectValue = vProjectNumber;
	performCheck = "NO";
}

createCapComment("CRCA script - checkForProjectValue: " + checkForProjectValue);

//skip sql if no value was input

if (performCheck == "YES") {
	var sql = "select B1_ALT_ID ";
	sql = sql + "from accela.b1permit ";
	sql = sql + "where serv_prov_code = 'KNOXVILLE' ";
	sql = sql + "and b1_alt_id = '" + checkForProjectValue + "' ";
	createCapComment("CRCA script - 1st SQL: " + sql);

	var result = aa.util.select(dbName, sql, null);

	if (result.getSuccess()) {
		createCapComment("CRCA script - SQL 1 Successful");
		result = result.getOutput();
		createCapComment("CRCA script - SQL 1 Total Records: " + result.size());

		if (i < result.size()) {
			createCapComment("CRCA script - Project Number Found: " + checkForProjectValue);
			addParent(aa.cap.getCapID(checkForProjectValue).getOutput());
			createCapComment("CRCA script - parent added: " + checkForProjectValue);
		}else{
			if (checkForProjectValue != null && checkForProjectValue != "") {
				createCapComment("CRCA script - 1-Project number " + checkForProjectValue + " not found");
				//add condition so that record can be identified as needing correction
				//commented out - this condition is being added by the ASA script - otherwise it was being added twice
				//addStdCondition("Lock", "COK Project Association Check", myCap);
			}else{
				createCapComment("CRCA script - 2-Project number not entered " + checkForProjectValue);	
			}
		}
	}
}else{
	//no project number entered
	createCapComment("CRCA script - 3-Project number not entered " + checkForProjectValue);	
}

createCapComment("CRCA script - Completed");
