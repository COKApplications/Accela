var checkSendEmail;
var notificationTemplate;
var reportName;

 if (balanceDue > 0)  {
updateAppStatus("Approved Pending Payment", "Updated by Script.");
checkSendEmail = "YES";
notificationTemplate = "COK_PERMIT_APPROVED_PENDING_PAYMENT";
}

if (checkSendEmail == "YES") {
	var checkEmailCopy = lookup("COK_Permits_Email_CC", "PERMITS/TRAFFIC ENGINEERING/PARKING PERMIT/NA");

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
			//get copy (cc) addresses if there are any
			//comment("checkEmailCopy: " + checkEmailCopy);
			var emailCopyTo = "grandles@knoxvilletn.gov";
			if (checkEmailCopy != null) {
				emailCopyTo = checkEmailCopy;
			}
			//provide capId, template to use
			//if for some reason report is not to be attached, send null in that field
			//limit to specific contact type
			//comment("contactEmail: " + contactEmail);
			//comment("contactType.toUpperCase: " + contactType.toUpperCase());
			if (contactType.toUpperCase() == "CONTACT"){
                                 showMessage = true;
				comment("contactType: " + contactType);
				comment("sending email");
				COKGenerateReportAttachToEmail(capId, notificationTemplate, null, "Permits", "Workflow", contactType, contactEmail, emailCopyTo);
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

/*------------------------------------------------------------------------------------------------------/
|  COK Generate Report Attach to Email (Start)
/------------------------------------------------------------------------------------------------------*/
function COKGenerateReportAttachToEmail(capId, inputNotificationTemplate, inputReportName, inputReportModule, inputSource, inputContactType, inputContactEmail, inputEmailCopyTo,rptparamname) {

// input capId, notification template, and report name - will send email using that template
// generated report will be attached to email
// has specific variables for notification template
// source - indicates need for specific variables that are not available for all situations
// ex. source = inspection will supply variables specific to that
// acceptable values are null, general, inspection

	var params = aa.util.newHashtable(); 

//record file date
//comment("fileDate: " + cap.getFileDate().getMonth()+ '/' + cap.getFileDate().getDayOfMonth() + '/' + cap.getFileDate().getYear());

	addParameter(params, "$$fileDate$$", cap.getFileDate().getMonth()+ '/' + cap.getFileDate().getDayOfMonth() + '/' + cap.getFileDate().getYear());

	addParameter(params, "$$altId$$", capIDString);
	addParameter(params, "$$workDesc$$", workDescGet(capId));
//	addParameter(params, "$$appName$$", getAppName());
	addParameter(params, "$$taskComments$$", " ");
 
	var recordtypealias = cap.capType.alias;
	addParameter(params, "$$recordtypealias$$", recordtypealias);
	
	//var streetAddressOnly1 = COKFormatCapStreetAddressOnly(capId);
	//var streetAddressPlus1 = COKFormatCapStreetAddressPlus(capId);

	//addParameter(params, "$$streetAddressPlus$$", streetAddressPlus1);
	//addParameter(params, "$$streetAddressOnly$$", streetAddressOnly1);

	addParameter(params, "$$appTypeString$$", appTypeString);

//only applies if this is coming from an inspection result
	var vInspType = "NA";
	var vInspResult = "NA";
	var vInspResultDate = "NA";
	var vInspComment = "NA";
	if (inputSource == "inspection") {
		vInspType = inspType;
		addParameter(params, "$$InspectionType$$", vInspType);
		vInspResult = inspResult;
		addParameter(params, "$$InspectionResult$$", vInspResult);
		vInspResultDate = inspResultDate;
		addParameter(params, "$$InspectionResultDate$$", vInspResultDate);
		vInspComment = inspComment;
		addParameter(params, "$$InspectionComment$$", vInspComment);
	}

//	var appTypeArray = appTypeString.split("/");
//	var appSplit = appTypeArray[1] + " - " + appTypeArray[2];
	//comment("appSplit: " + appSplit);
//	addParameter(params, "$$appSplit$$", appSplit);

//loop through contacts and find the one that is being passed in
	var BusinessName = "NA";
	var contactEmail = "NA";
	var v_checkContactType = "NA";
	var v_ContactType = "NA";
	var v_inputContactType = inputContactType;
	
	v_inputContactType = v_inputContactType.toUpperCase();

	var contactArray = new Array();
	contactArray = getContactArray();

	y=0;
	while(y < contactArray.length) {	
	
		var tContact = contactArray[y];

		getContactParams4Notification(params,tContact)
		
		if (tContact["contactType"] != null){
			v_checkContactType = tContact["contactType"];
			v_checkContactType = v_checkContactType.toUpperCase();
			v_contactEmail = tContact["email"];
			if (v_checkContactType == v_inputContactType && v_contactEmail == inputContactEmail){
				v_ContactType = v_checkContactType;
				contactEmail = inputContactEmail;
				BusinessName = tContact["businessName"];
			}
		}
		
		y = y + 1;
	}

	addParameter(params, "$$contactType$$", v_ContactType);

	//note - may need to check for business name then full name
	addParameter(params, "$$BusinessName$$", BusinessName);

	addParameter(params, "$$contactEmail$$", contactEmail);

        //call function to get formmated record date and time (rec_date)
	//var v_recorddateandtime = COKGetRecordDateandTime(capId);
	//if (v_recorddateandtime != null){
	    //addParameter(params, "$$recordDateandTime$$", v_recorddateandtime);
	//}else{
	//    addParameter(params, "$$recordDateandTime$$", "NA");
	//}

        //call function to get overall record duration setting
	//var v_recordDurationSetting = COKGetRecordDurationSetting(capId);
	//if (v_recordDurationSetting != null){
	//    addParameter(params, "$$recordDurationSetting$$", v_recordDurationSetting);
	//}else{
	//    addParameter(params, "$$recordDurationSetting$$", "NA");
	//}

	var ACAWebSite;
	var emailTo;
	var emailTesting;

	//if test - change email to value and website
	var databaseName = lookup("COK_Database_Name", "Database_Name");
	if(databaseName != "AAPROD") {
	//	emailTo = lookup("COK_Permits_Email_CC", "PERMITS/TRAFFIC ENGINEERING/PARKING PERMIT/NA");
		emailTo = contactEmail;
	//	emailTo = "grandles@knoxvilletn.gov";
		emailTesting = "**This is a test**" ;
		ACAWebSite = "https://aca.knoxvilletn.gov/ACATEST" + getACAUrl();
	}
	else{
		//emailTo = contactEmail;
		//emailTo = "grandles@knoxvilletn.gov";
		emailTo = contactEmail;
		emailTesting = "";
		ACAWebSite = "https://aca.knoxvilletn.gov/ACAPROD" + getACAUrl();
	}


	//emailTo = emailTo + ";" + "grandles@knoxvilletn.gov";

	addParameter(params, "$$Url$$", ACAWebSite);
	addParameter(params, "$$testing$$", emailTesting);



	var rFile;

	
	if(reportName != null) {

		//even if report has no parameters use this as a placeholder
		var param4attachDoc = aa.util.newHashMap();
		param4attachDoc.put(rptparamname, capIDString);

		//user must have rights to run report
		//need report name, parameters (hash), module
                var rFile = null;
		rFile = generateReport(reportName,param4attachDoc,"Permits");
                comment ("generated report");
		//logDebug("rfile is = " + rFile);
		if (rFile) {
		//	comment("we are in");
			var rFiles = new Array();
			rFiles.push(rFile);
		}

		//format is from, to, cc, template to use, parameters, attached report
		//using null for from indicates use the from value in the template definition
		//sendNotification(null,"grandles@knoxvilletn.gov","",inputNotificationTemplate,params,rFiles);
		sendNotification(null,emailTo,inputEmailCopyTo,inputNotificationTemplate,params,rFiles);

	}else{
	
		//use null for report file parameter if no report is to be attached
		//sendNotification(null,"grandles@knoxvilletn.gov","",inputNotificationTemplate,params,null);
		sendNotification(null,emailTo,inputEmailCopyTo,inputNotificationTemplate,params,null);

	}
}
/*------------------------------------------------------------------------------------------------------/
|  COK Generate Report Attach to Email (End)
/------------------------------------------------------------------------------------------------------*/

function generateReport(aaReportName,parameters,rModule) {
     showMessage = true;
     comment("aaReportName" + aaReportName + " parameters " + parameters + "  rModule" + rModule);

	var reportName = aaReportName;
      
    report = aa.reportManager.getReportInfoModelByName(reportName);
    report = report.getOutput();
	
		var reportName = aaReportName;
      
    report = aa.reportManager.getReportInfoModelByName(reportName);
    report = report.getOutput();
  

  report.setModule(rModule);
    report.setCapId(capId);

    report.setReportParameters(parameters);

    var permit = aa.reportManager.hasPermission(reportName,"ADMIN");

    if(permit.getOutput().booleanValue()) {
       var reportResult = aa.reportManager.getReportResult(report);
   
       if(reportResult) {
	       reportResult = reportResult.getOutput();
	       var reportFile = aa.reportManager.storeReportToDisk(reportResult);
              logMessage("Report Result: "+ reportResult);
	       reportFile = reportFile.getOutput();
	       return reportFile
       } else {
       		logMessage("Unable to run report: "+ reportName + " for Admin" + systemUserObj);
       		return false;
       }
    } else {
         logMessage("No permission to report: "+ reportName + " for Admin" + systemUserObj);
         return false;
    }
  
  
}

function getRecordParams4Notification(params) {
	// pass in a hashtable and it will add the additional parameters to the table

	addParameter(params, "$$altID$$", capIDString);
	return params;
}

function getACARecordParam4Notification(params,acaUrl) {
	// pass in a hashtable and it will add the additional parameters to the table

	addParameter(params, "$$acaRecordUrl$$", getACARecordURL(acaUrl));
	
	return params;	
}

function getACADeepLinkParam4Notification(params,acaUrl,pAppType,pAppTypeAlias,module) {
	// pass in a hashtable and it will add the additional parameters to the table

	addParameter(params, "$$acaDeepLinkUrl$$", getDeepLinkUrl(acaUrl, pAppType, module));
	addParameter(params, "$$acaDeepLinkAppTypeAlias$$", pAppTypeAlias);
	
	return params;
}
