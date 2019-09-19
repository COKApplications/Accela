var AMPMFrom = AInfo["AM/PM From"];
var AMPMTo = AInfo["AM/PM To"];
var TimeRequiredFrom = AInfo["Time Required From"];
var TimeRequiredTo = AInfo["Time Required To"];
 

if (TimeRequiredFrom > "00:00") {
    if (AMPMFrom == "PM") {
        var parts = TimeRequiredFrom.split(":");
        var v_timehh = new Number (parts[0]);
        v_timehh = v_timehh + 12;
        var v_newtime = v_timehh + ":" + parts[1];
        comment ("v_newtime = " + v_newtime);
        editAppSpecific("Time Required From", v_newtime);
 }
}
if (TimeRequiredTo > "00:00") {
    if (AMPMTo == "PM") {
        var parts = TimeRequiredTo.split(":");
        var v_timehh = new Number (parts[0]);
        v_timehh = v_timehh + 12;
        var v_newtime = v_timehh + ":" + parts[1];
        comment ("v_newtime = " + v_newtime);
        editAppSpecific("Time Required To", v_newtime);
 }
}


var checkSendEmail = "YES";

if (checkSendEmail != "YES") {

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
                         var checkEmailCopy = lookup("COK_Permits_Email_CC", "PERMITS/TRAFFIC ENGINEERING/PARKING PERMIT/NA");			//comment("checkEmailCopy: " + checkEmailCopy);
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



var notificationTemplate = "COK_PERMIT_ACKNOWLEDGE_SUBMITTAL";

//var reportName = "Permit Application";

var reportName;

COKGenerateReportAttachToEmail(capId, notificationTemplate, reportName, "Permits", "general", "Contact", "grandles@knoxvilletn.gov", null,"REPORT_ID");

