//ApplicationSpecificInfoUpdateAfter - ASIUA
//ASIUA:ENFORCEMENT/MISCELLANEOUS/USER DISTRICT MAINTENANCE/NA 
showMessage = true;

//comment("Script start");
//comment("User: " + getUpdateUser() + " Date: " + getUpdateDateTime());

var stdChoice = "USER_DISTRICTS";
var rowCount = 0;

var screenFunction = AInfo["User District Functions"];
comment("You have selected: " + screenFunction);
comment("");

screenFunctionString = String(screenFunction);

switch(screenFunctionString) {
	case "01 List All Values":

		//list all values
		var bizDomScriptResultOrig= aa.bizDomain.getBizDomain(stdChoice);
		if (bizDomScriptResultOrig.getSuccess()) {
			bizDomScriptArray = bizDomScriptResultOrig.getOutput().toArray()
			for (var i in bizDomScriptArray) {
				// this list is sorted the same as the UI 
				var stdValue = bizDomScriptArray[i].getBizdomainValue();
				var stdAct = bizDomScriptArray[i].getAuditStatus();
				var stdDesc = bizDomScriptArray[i].getDescription();
				rowCount = rowCount + 1;
				comment("(" + rowCount + ") " + stdValue);
				comment(stdDesc);
			}
		}
		break;

	case "02 Find Value":
		//find specific value
		//will not find unless case is same
		//confirm user has entered a value
		//var zonetypevalueToFind = "Electric";
		var zonetypevalueToFind = AInfo["Find Zone Type"];
		var zonevalueToFind = AInfo["Find Zone Value"];

		var findFieldCount = 0;
		if (zonetypevalueToFind == null) {
			zonetypevalueToFind = "999999999";
		}else{
			findFieldCount = findFieldCount + 1;
		}

		if (zonevalueToFind == null) {
			zonevalueToFind = "999999999";
		}else{
			findFieldCount = findFieldCount + 1;
		}
		
		zonetypevalueToFind = String(zonetypevalueToFind);
		zonetypevalueToFind = zonetypevalueToFind.toLowerCase();
		zonevalueToFind = String(zonevalueToFind);
		zonevalueToFind = zonevalueToFind.toLowerCase();

		var rowCount = 0;
		
		var bizDomScriptResultOrig = aa.bizDomain.getBizDomain(stdChoice);
		if (bizDomScriptResultOrig.getSuccess()) {
			bizDomScriptArray = bizDomScriptResultOrig.getOutput().toArray()
			for (var i in bizDomScriptArray) {
				// this list is sorted the same as the UI 
				var stdValue = bizDomScriptArray[i].getBizdomainValue();
				var stdAct = bizDomScriptArray[i].getAuditStatus();
				var stdDesc = bizDomScriptArray[i].getDescription();
				//comment(stdValue + " " + stdDesc);
				stdDescString = String(stdDesc);
				stdValueString = String(stdValue);
				//comment(stdValueString);
				
				switch(findFieldCount) {
				
					case 1:
						if (zonetypevalueToFind !== "999999999") {
							var n = stdValueString.toLowerCase().indexOf(zonetypevalueToFind);
							if (n >= 0) {
								comment("Found Record - " + stdValue);
								comment(stdDesc);
								rowCount = rowCount + 1;
							}
						}else{
							var x = stdDescString.toLowerCase().indexOf(zonevalueToFind);
							if (x >= 0) {
								comment("Found Record - " + stdValue);
								comment(stdDesc);
								rowCount = rowCount + 1;
							}
						}
					break;
				
					case 2:
						var n = stdValueString.toLowerCase().indexOf(zonetypevalueToFind);
						var x = stdDescString.toLowerCase().indexOf(zonevalueToFind);
						if ((n >= 0) && (x >= 0)) {
							comment("Found Record - " + stdValue);
							comment(stdDesc);
							rowCount = rowCount + 1;
						}
				
					break;
				}
				
			}
		}
		if(rowCount == 0) {
			comment("Value(s) not found");
		}

		break;

	case "03 Change Single Value":
		//change specific value
		//confirm value entered in both from and to fields

		var changesMadeCount = 0;
		
		//need to confirm these all have values
		var choiceToChange = AInfo["Zone to Change"];
		var valueToChangeFrom = AInfo["Current Zone Value"];
		var valueToChangeTo = AInfo["New Zone Value"];

		var okToProceed = "Yes";
		if(choiceToChange == null) {
			okToProceed = "No";
		}
		
		if(valueToChangeFrom == null) {
			okToProceed = "No";
		}
		
		if(valueToChangeTo == null) {
			okToProceed = "No";
		}

		//check if from/to are valid users
		if(okToProceed == "Yes"){
			valueToChangeFrom = valueToChangeFrom.toUpperCase();
			var fromUser = aa.people.getSysUserByID(valueToChangeFrom).getOutput();
			//comment(fromUser);
			if (!fromUser) {
				comment("Current Zone Value " + valueToChangeFrom + " is not a valid user");
				okToProceed = "No";
			}
			valueToChangeTo = valueToChangeTo.toUpperCase();
			var toUser = aa.people.getSysUserByID(valueToChangeTo).getOutput();
			//comment(toUser);
			if (!toUser) {
				comment("New Zone Value " + valueToChangeTo + " is not a valid user");
				okToProceed = "No";
			}
		}

		if(okToProceed == "Yes"){
			var bizDomScriptResultOrig = aa.bizDomain.getBizDomain(stdChoice);
			if (bizDomScriptResultOrig.getSuccess()) {
				bizDomScriptArray = bizDomScriptResultOrig.getOutput().toArray()
				for (var i in bizDomScriptArray) {
					// this list is sorted the same as the UI 
					var stdValue = bizDomScriptArray[i].getBizdomainValue();
					var stdAct = bizDomScriptArray[i].getAuditStatus();
					var stdDesc = bizDomScriptArray[i].getDescription();
					if (stdValue == choiceToChange) {
						//comment("Found Choice to Change - " + stdValue + " " + stdDesc);
						if (stdDesc == valueToChangeFrom) {
							comment("Changing value:" + " Std choice: " + stdChoice + " " + stdValue + " From: " + valueToChangeFrom + " To: " + valueToChangeTo);

							valueToChangeTo = valueToChangeTo.toUpperCase();
							
							//use editLookup function to make actual change
							editLookup(stdChoice, choiceToChange, valueToChangeTo);

							//remove user district information on from userid - add user district information on to userid
							var removeDistrictFromUser = aa.people.deleteUserDistrict(valueToChangeFrom, choiceToChange);
							var addDistrictToUser = aa.people.addUserDistrict(valueToChangeTo, choiceToChange);

							createCapComment(getUpdateUser() + " " + getUpdateDateTime() 
							+ " Changed std choice user_district value: " + stdChoice + " " + choiceToChange + "\n" +
							" From: " + valueToChangeFrom + " To: " + valueToChangeTo + "\n" +
							" Removed value: " + choiceToChange + " from user: " + valueToChangeFrom + "\n" + 
							" Added value: " + choiceToChange + " to user: " + valueToChangeTo);

							changesMadeCount = changesMadeCount + 1;
						}
					}

				}
			}
		}else{
			comment("Please check values for Zone to Change, Current Zone Value, and New Zone Value.");
		}

		if(changesMadeCount == 0){
			comment("No changes made.  Please check Zone to Change and Current Zone Value to confirm that " +
			"match existing values in system.")
		}
		break;

		case "04 Clear Fields":
			editAppSpecific("Find Zone Type", "");		
			editAppSpecific("Find Zone Value", "");		
			editAppSpecific("Zone to Change", "");		
			editAppSpecific("Current Zone Value", "");		
			editAppSpecific("New Zone Value", "");		
		break;

	default:
		comment("No screen function selection made");
}

//comment("Script end");

function getUpdateDateTime() {
	sysDate = aa.date.getCurrentDate();
	updateDate = sysDate.getMonth() + "/" + sysDate.getDayOfMonth() + "/" + sysDate.getYear(); 

	var timeNow = new Date();
	var hours   = timeNow.getHours();
	var minutes = timeNow.getMinutes();
	var seconds = timeNow.getSeconds();
	var timeString = "" + ((hours > 12) ? hours - 12 : hours);
	timeString  += ((minutes < 10) ? ":0" : ":") + minutes;
	timeString  += ((seconds < 10) ? ":0" : ":") + seconds;
	timeString  += (hours >= 12) ? " P.M." : " A.M.";
	
	return updateDate + " " + timeString;
}

function getUpdateUser() {
	systemUserObj = aa.person.getUser(currentUserID).getOutput();

	var systemUserObjString = String(systemUserObj);

	var userParse = systemUserObjString.lastIndexOf("/");
	//comment(userParse);

	userParse = userParse + 1;
	updateUser = systemUserObjString.substring(userParse);
	//comment(systemUserObjString.substring(userParse));

	return updateUser;
}