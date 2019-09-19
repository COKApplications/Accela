var cap = aa.env.getValue("CapModel");

//var testRecord = "CE-18-000047"
var foundRecord = "NO";
var checkASIGroups = cap.getAppSpecificInfoGroups();
var partOfProject = getFieldValue("Is this part of a City approved construction project?",checkASIGroups);
var projectNumberValue = getFieldValue("Project Number",checkASIGroups);

if (partOfProject == "Yes") {
	//look up project number in system and pull in information
	var capCheck


	//var itemCap = aa.cap.getCapID(testRecord);
	var itemCap = aa.cap.getCapID(projectNumberValue);

	itemCapId = itemCap.getOutput();

	if(!itemCapId){
		capCheck = "Record " + projectNumberValue + " not found";
	} else {
		foundRecord = "YES";
		capCheck = "Record " + projectNumberValue + " found" + "<BR>";
		cap = aa.cap.getCap(itemCapId).getOutput();
		//get capId (record number)
		capId = aa.cap.getCapID(cap.getCapID().getID1(), cap.getCapID().getID2(), cap.getCapID().getID3()).getOutput();
		var myCap = aa.cap.getCap(cap.getCapID()).getOutput();

		//get status
		var myCapStatus = myCap.getCapStatus();
		capCheck = capCheck + " Status: " + myCapStatus + "<BR>";

		//gives 4 level record type ex. Enforcement/Traffic Engineering/Investigation/NA
		var myCapType = myCap.getCapType();
		capCheck = capCheck + " Type: " + myCapType + "<BR>";

		//look up standard choice value for valid project record types - confirm that it is Active (auditstatus)
		//check both values as string
		var bizDomScriptResultOrig= aa.bizDomain.getBizDomain("COK_BUILDING_PROJECT_RECORD_TYPE");
		var validCapType = "NO";
		if (bizDomScriptResultOrig.getSuccess()) {
			bizDomScriptArray = bizDomScriptResultOrig.getOutput().toArray()
			for (var i in bizDomScriptArray) {
				// this list is sorted the same as the UI 
				var stdValue = bizDomScriptArray[i].getBizdomainValue();
				var stdAct = bizDomScriptArray[i].getAuditStatus();
				var stdDesc = bizDomScriptArray[i].getDescription();
				//capCheck = capCheck + " Type Std Choice " + stdValue + " " + stdAct + " " + stdDesc + "<BR>";
				if (String(stdValue) == String(myCapType) && String(stdAct) == "A"){
					validCapType = "YES";
				}
			}
		}
		capCheck = capCheck + " Valid Type? " + validCapType + "<BR>";

		//look up standard choice value for valid project statuses - confirm that it is Active (auditstatus)
		//check both values as string
		var bizDomScriptResultOrig= aa.bizDomain.getBizDomain("COK_BUILDING_PROJECT_RECORD_APPROVED_STATUSES");
		var validCapStatus = "NO";
		if (bizDomScriptResultOrig.getSuccess()) {
			bizDomScriptArray = bizDomScriptResultOrig.getOutput().toArray()
			for (var i in bizDomScriptArray) {
				// this list is sorted the same as the UI 
				var stdValue = bizDomScriptArray[i].getBizdomainValue();
				var stdAct = bizDomScriptArray[i].getAuditStatus();
				var stdDesc = bizDomScriptArray[i].getDescription();
				//capCheck = capCheck + " Status Std Choice " + stdValue + " " + stdAct + " " + stdDesc + "<BR>";
				if (String(stdValue) == String(myCapStatus) && String(stdAct) == "A"){
					validCapStatus = "YES";
				}
			}
		}
		capCheck = capCheck + " Valid Status? " + validCapStatus + "<BR>";

	}
}
	
//var message = "Hello " + capCheck + " " + projectNumberValue;

if (partOfProject == "Yes") {
	if (foundRecord == "YES" && validCapStatus == "YES" && validCapType == "YES") {
		//valid record found - continue to next step
	}else{
		var message = "<BR> The following issues were found with entered project number " + projectNumberValue + ": <BR>"
		message = message + capCheck + "<BR>Please check the number and re-enter.<BR>";;
		displayMessage(itemCapId + " " + message);
	}
}
	
//display message in ACA - stop moving forward
function displayMessage(str){
	if(str){
		aa.env.setValue("ErrorCode", "-1");
		aa.env.setValue("ErrorMessage", str);
	}
}

function getFieldValue(fieldName, asiGroups) { 
	if(asiGroups == null){
			return null;
	}
	
	var iteGroups = asiGroups.iterator();
	while (iteGroups.hasNext()){
		var group = iteGroups.next();
 		var fields = group.getFields();
        if (fields != null){	
          	var iteFields = fields.iterator();
           	while (iteFields.hasNext()){
				var field = iteFields.next();
               	if (fieldName == field.getCheckboxDesc()){
					return field.getChecklistComment();
				}
			}
       	}

    }
}