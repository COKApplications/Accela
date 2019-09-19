/**
 * The below code is related to the AMS/Work Order/TRAFFIC ENGINEERING/SIGN record, with
 * a WorkflowTaskUpdateAfter event. 
 */

var parentRecord = getParent();

if(isEmpty(parentRecord) == false) {
	//Start Script 16 - Update Service Request Parent Status
	if (wfTask == "Open" && (wfStatus == "Canceled" || wfStatus == "Completed")) {
                checkRelatedAndCloseSR ();
                checkRelatedENFAndCloseENF ();
	        deactivateTask("Closed");
    	}
}
	//End Script 16


if((wfTask == "Open") && (wfStatus == "In Queue")){
for (i in wfObj) {
   fTask = wfObj[i];
   if (fTask.getTaskDescription().equals(wfTask) && 
      (fTask.getProcessID() == wfProcessID)) {
       wfAssignedStaff = fTask.getTaskItem().getAssignedUser();
      var taskAssignUser = aa.person.getUser(fTask.getAssignedStaff().getFirstName(),fTask.getAssignedStaff().getMiddleName(),fTask.getAssignedStaff().getLastName()).getOutput();
      if (taskAssignUser != null)
       {
         // re-grabbing for userid.
         wfUserObj = aa.person.getUser(fTask.getAssignedStaff().getFirstName(),fTask.getAssignedStaff().getMiddleName(),fTask.getAssignedStaff().getLastName()).getOutput();
         v_userID = wfUserObj.getUserID();
  	     assignCap(v_userID);
             editAppSpecific("Assigned To", v_userID);

      }
 //     showMessage = true;
 //     comment ("Workflow Assigned Staff=" + wfAssignedStaff);
 //     comment ("Workflow Assigned StaffUserId=" + v_userID);
}
}
}

if((wfTask == "Open") && (wfStatus == "In Queue")){
for (i in wfObj) {
   fTask = wfObj[i];
   if (fTask.getTaskDescription().equals(wfTask) && 
      (fTask.getProcessID() == wfProcessID)) {
       wfAssignedStaff = fTask.getTaskItem().getAssignedUser();
      var taskAssignUser = aa.person.getUser(fTask.getAssignedStaff().getFirstName(),fTask.getAssignedStaff().getMiddleName(),fTask.getAssignedStaff().getLastName()).getOutput();
      if (taskAssignUser != null)
       {
         // re-grabbing for userid.
         wfUserObj = aa.person.getUser(fTask.getAssignedStaff().getFirstName(),fTask.getAssignedStaff().getMiddleName(),fTask.getAssignedStaff().getLastName()).getOutput();
         v_userID = wfUserObj.getUserID();
  	     assignCap(v_userID);
      }
 //     showMessage = true;
 //     comment ("Workflow Assigned Staff=" + wfAssignedStaff);
 //     comment ("Workflow Assigned StaffUserId=" + v_userID);
}
}
}


if (wfTask == "Open" && (wfStatus == "In Queue")) {
		//Start Script 32
		var databaseName = lookup("COK_Database_Name", "Database_Name");
		var alternateId = capId.getCustomID();
		var emailTo = v_userID + "@knoxvilletn.gov";
		var emailSubject = "A Marking Work Order has been assigned to you. " + alternateId;
		var natureOfRequest = workDescGet(capId);

		var locationInfo = "";
		var contactInfo = "";

		//comment("CAP ID: " + capId);

		var capAddResult = aa.address.getAddressByCapId(capId);

		//comment("capAddResult: " + capAddResult);

		var contactArray = getContactArray();
		var emailBody = "";
		var Intersection = AInfo["Intersection"];

		if(isEmpty(Intersection)) {
			Intersection = "No Intersection";
		}

		if(isEmpty(natureOfRequest)) {
			natureOfRequest = "<< No information provided by caller. >>";
		}
	
	
		if(capAddResult.getSuccess()) {
			var addrArray = new Array();
			var addrArray = capAddResult.getOutput();
			
			if(addrArray.length==0 || addrArray==undefined) {
				logDebug("The current CAP has no address.")
				locationInfo = "<< No address was input. >>";
			} else {
		 
			var hseNum = addrArray[0].getHouseNumberStart();
			var streetDir = addrArray[0].getStreetDirection();  
			var streetName = addrArray[0].getStreetName();
			var streetSuffix = addrArray[0].getStreetSuffix();
			var streetCity = addrArray[0].getCity();
			var streetState = addrArray[0].getState();
			var streetZip = addrArray[0].getZip();

			if(isEmpty(streetDir)) {
				streetDir = "";
			}

			locationInfo = hseNum + " " + streetDir + " " + streetName + " " + streetSuffix + " " + streetCity + " " + streetState + " " + streetZip;

			}
		} 


		if(Intersection != "No Intersection") {
			locationInfo = locationInfo + "<br>" + "Intersection - " + Intersection
		}

		for(ca in contactArray) {
			var thisContact = contactArray[ca];
		    
			if(thisContact["contactType"] == "Citizen") {
				var contactBusinessPhone = thisContact["phone1"];
				var contactMobilePhone = thisContact["phone2"];
				var contactHomePhone = thisContact["phone3"];
				var contactFName = thisContact["firstName"];
				var contactMName = thisContact["middleName"];
				var contactLName = thisContact["lastName"];
				var contactFullName = thisContact["fullName"];
				var contactFullAddress = thisContact["fullAddress"];
				var contactEmailAddress = thisContact["email"];
				var contactAddressLine1 = thisContact["addressLine1"];
				var contactAddressLine2 = thisContact["addressLine2"];
				var contactCity = thisContact["city"];
				var contactState = thisContact["state"];
				var contactZip = thisContact["zip"];

				if(isEmpty(contactFName)) {
					contactFName = "<< Nothing on record. >>";
				}
				
				if(isEmpty(contactMName)) {
					contactMName = "<< Nothing on record. >>";
				}
				
				if(isEmpty(contactLName)) {
					contactLName = "<< Nothing on record. >>";
				} 
				
				if(isEmpty(contactFullName)) {
					contactFullName = contactFName + " " + contactLName;
				}
				
				if(isEmpty(contactBusinessPhone)) {
					contactBusinessPhone = "<< Nothing on record. >>";
				}
				
				if(isEmpty(contactMobilePhone)) {
					contactMobilePhone = "<< Nothing on record. >>";
				}
				
				if(isEmpty(contactHomePhone)) {
					contactHomePhone = "<< Nothing on record. >>";
				}
				
				if(isEmpty(contactFullAddress)) {
					contactFullAddress = "<< Nothing on record. >>";
				}

				if(isEmpty(contactEmailAddress)) {
					contactEmailAddress = "<< Nothing on record. >>";
				}
				
				if(isEmpty(contactAddressLine1)) {
					contactAddressLine1 = "<< Nothing on record. >>";
				}
				
				if(isEmpty(contactAddressLine2)) {
					contactAddressLine2 = "<< Nothing on record. >>";
				}
				
				if(isEmpty(contactCity)) {
					contactCity = "<< Nothing on record. >>";
				}
				
				if(isEmpty(contactState)) {
					contactState = " ";
				}
				
				if(isEmpty(contactZip)) {
					contactZip = " ";
				}
						
				contactInfo = "Contact Name = " + contactFullName +  "<br>" + 
							"Contact Business Phone = " + contactBusinessPhone + "<br>" + 
							"Contact Home Phone = " + contactHomePhone + "<br>" + 
							"Contact Mobile Phone = " + contactMobilePhone + "<br>" +
							"Contact Email = " + contactEmailAddress + "<br>" +
							"Contact Address 1 = " + contactAddressLine1 + "<br>" +
							"Contact Address 2 = " + contactAddressLine2 + "<br>" +
							"Contact City, State, Zip = " + contactCity + ", " + contactState + " " + contactZip + "<br>";
			}
		}

		if(databaseName != "AAPROD") {
			emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/IS/NA/NA/NA/NA");
			emailSubject = "**This is a test** " + emailSubject;
		}

		emailBody = "<html>" + 
		"You have been assigned the following Sign Work Order:" + "<br>" + "<br>" +
		"What is the nature of the request - " + natureOfRequest + "<br>" + "<br>" +
		"Location - " + locationInfo + "<br>" + "<br>" + 
		"Citizen Contact Information:" + "<br>" + 
		contactInfo  + "<br>" + "<br>" + 
		"Traffic Engineering Work Order Number - " + alternateId + 
		"</html>";

		email(emailTo, "trafficsigs@knoxvilletn.gov", emailSubject, emailBody);
		//End Script 32
}