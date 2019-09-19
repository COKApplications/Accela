AssignedToDept = "KNOXVILLE/KNOX/SPEVENTS/NA/NA/NA/NA";
assignCapToDept(AssignedToDept);


var myAltId = capId.getCustomID();
var dbName = "jetspeed";
var sql;
var message;
var v_eventname = AInfo["Event Name"];
sql = "update accela.b1permit set B1_SPECIAL_TEXT = '"; 
sql = sql + v_eventname + "' where b1_alt_id = '";
sql = sql + myAltId + "'";
message = "update sql =" + sql;
//displayMessage(message);
//showMessage=true;
//comment(message);
var updateresult = aa.util.update(dbName, sql, null);


var checkSendEmail = "NO";
var v_workDesc = workDescGet(capId);
var setDescription = updateShortNotes(v_workDesc);

if (checkSendEmail != null) {

	var contactArray = new Array();
	contactArray = getContactArray();
	var params = aa.util.newHashtable(); 

	//will send an email to each contact type that has an email address
	x=0;
	while(x < contactArray.length) {	
	
		var tContact = contactArray[x];

		getContactParams4Notification(params,tContact)

		//comment("Contact Type: " + tContact["contactType"]);
		//comment("Contact BusinessName: " + tContact["businessName"]);

		var contactEmail;
		if (tContact["email"] != null){
			contactEmail = tContact["email"];
			contactType = tContact["contactType"];
			var notificationTemplate = "COK_PERMIT_ACKNOWLEDGE_SUBMITTAL";
			//get copy (cc) addresses if there are any
			var checkEmailCopy = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/311/SRTHANKSCOPY/NA/NA/NA");
			//comment("checkEmailCopy: " + checkEmailCopy);
			var emailCopyTo = "";
			if (checkEmailCopy != null) {
				emailCopyTo = checkEmailCopy;
			}
			//provide capId, template to use
			//if for some reason report is not to be attached, send null in that field
			//limit to specific contact type
			//comment("contactEmail: " + contactEmail);
			//comment("contactType.toUpperCase: " + contactType.toUpperCase());
			if (contactType.toUpperCase() == "CONTACT"){
//                                showMessage = true;
//				comment("contactType: " + contactType);
//				comment("sending email");
				COKGenerateReportAttachToEmail(capId, notificationTemplate, null, "Service Request", "general", contactType, contactEmail, emailCopyTo);
			}else{
				contactEmail = "NA";
			}
		}else{
			contactEmail = "NA";
		}

		//comment("contactEmail: " + contactEmail);
		x = x + 1;
	}
}