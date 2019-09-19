//PRODUCTION
//ASA:SERVICEREQUEST/*/*/*
//EMAIL SECTION ADDED BY COK 2017
//for service requests send thank you email to customer if they provided an email

//2018 - seems to be requiring comment in order to run with 9.3(?)
var d = new Date();
//js month is 0 based
var mon = d.getMonth();
mon = mon + 1;
var vDate = mon + "/" + d.getDate() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
createCapComment("Record created at: " + vDate);

//2018 - if application name is empty fill in with record type alias and first 100 of description
//update - just fill in with record type alias

var sourceCap = aa.cap.getCap(capId).getOutput();
var appTypeResult = cap.getCapType();
var appTypeAlias = appTypeResult.getAlias();
var appName = sourceCap.getSpecialText();

if (appName == null) {
    
    detailDesc = workDescGet(capId);
    appName = detailDesc.slice(0,100);
    //var setAppNameSuccess = sourceCap.setSpecialText(appTypeAlias + " : " + appName);
    var setAppNameSuccess = sourceCap.setSpecialText(appTypeAlias);
    setNameResult = aa.cap.editCapByPK(sourceCap.getCapModel());
}


//showMessage = true;

//was set to look up SR type in Standard Choice table to determine if that type should get an email
//311 desires that all types get an email if Citizen included email address
//left code here in case it is needed later
//var vTypeAlias = cap.capType.alias;
//var checkSendEmail = lookup("COK_SERVICE_REQUEST_THANKS_FOR_SUBMITTAL", vTypeAlias);
var checkSendEmail = "YES";

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
			var notificationTemplate = "COK_SR_THANKS_FOR_SUBMITTAL";
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
			if (contactType.toUpperCase() == "CITIZEN"){
				//comment("contactType: " + contactType);
				//comment("sending email");
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

//END EMAIL SECTION

//Map Location
try {
	if(doesASIFieldExistOnRecord("Map Location")) {
		var mapLocation = "";
		var varFeet = 0;
		for (; i < 15; ) { 
		varFeet = i * 10;
		mapLocation = getGISInfo2("KGIS","Intersection","STREETS",varFeet,"feet");
        if (!matches(mapLocation, null, "", "undefined")) {
        	editAppSpecific("Map Location",mapLocation);
            //logDebug("Map Location: " + mapLocation + " feet used in getGISInfo2 script: " + varFeet);        
        	i = 15;
        }
        i++;
        }
	}
}
catch (err) {
	logDebug("A JavaScript Error occurred: ASA:SERVICEREQUEST/*/*/* - Map Location" + err.message);
} ;