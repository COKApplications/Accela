//ApplicationSpecificInfoUpdateAfter - ASIUA
//ASIUA:ENFORCEMENT/MISCELLANEOUS/USER SETUP MAINTENANCE/NA 
showMessage = true;

//comment("Script start");
//comment("User: " + getUpdateUser() + " Date: " + getUpdateDateTime());

var stdChoice = "COK_Service_Request_Email_To";
var rowCount = 0;

var screenFunction = AInfo["Screen Function"];
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
		//var valueToFind = "GRANDLES";
		var valueToFind = AInfo["Value to Find"];

		if(valueToFind == null){
			comment("No value entered in Value to Find field - substituting 999999999");
			valueToFind = "999999999";
		}
		valueToFind = String(valueToFind);
		valueToFind = valueToFind.toLowerCase();

		var bizDomScriptResultOrig= aa.bizDomain.getBizDomain(stdChoice);
		if (bizDomScriptResultOrig.getSuccess()) {
			bizDomScriptArray = bizDomScriptResultOrig.getOutput().toArray()
			for (var i in bizDomScriptArray) {
				// this list is sorted the same as the UI 
				var stdValue = bizDomScriptArray[i].getBizdomainValue();
				var stdAct = bizDomScriptArray[i].getAuditStatus();
				var stdDesc = bizDomScriptArray[i].getDescription();
				//comment(stdValue + " " + stdDesc);
				stdDescString = String(stdDesc);
				//comment(stdDescString);
				var n = stdDescString.toLowerCase().indexOf(valueToFind);
				//comment(n);
				if (n > 0) {
					comment("Found Record - " + stdValue);
					comment(stdDesc);
					rowCount = rowCount + 1;
				}

			}
		}
		if(rowCount == 0) {
			comment("Value: " + valueToFind + " not found");
		}

		break;

	case "03 Change Value":
		//change specific value
		//confirm value entered in both from and to fields

		var changesMadeCount = 0;
		
		//need to confirm these all have values
		var choiceToChange = AInfo["Distribution List to Change"];
		var valueToChangeFrom = AInfo["Current List Value"];
		var valueToChangeTo = AInfo["New List Value"];

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
							comment("Changing value");
							comment("Std choice: " + stdChoice);
							comment("From: " + valueToChangeFrom);
							comment("To: " + valueToChangeTo);

							//use editLookup function to make actual change
							editLookup(stdChoice, choiceToChange, valueToChangeTo);

							createCapComment(getUpdateUser() + " " + getUpdateDateTime() 
							+ " Changed std choice email list: " + stdChoice + " " + choiceToChange +
							" From: " + valueToChangeFrom + " To: " + valueToChangeTo);
							
							changesMadeCount = changesMadeCount + 1;
						}
					}

				}
			}
		}else{
			comment("Please check values for Distribution List to Change, Current List Value, and Current List Value.");
		}

		if(changesMadeCount == 0){
			comment("No changes made.  Please check Distribution List to Change and Current List Value to confirm that " +
			"match existing values in system.")
		}
		break;

		case "04 Clear Fields":
			editAppSpecific("Value to Find", "");		
			editAppSpecific("Distribution List to Change", "");		
			editAppSpecific("Current List Value", "");		
			editAppSpecific("New List Value", "");		
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