// Enter your script here...

var v_ChangeAssignedTo = AInfo["Change Assigned To"];
if (v_ChangeAssignedTo == "Yes") {
    var v_AssignToFromField = AInfo["Assign To"];
//    var v_assets = " ";
//    assetArray = getAssetListByWorkOrder(capId);
//    for(aa in assetArray) {
//	var thisAsset = assetArray[aa];
//        var assetId = thisAsset["assetId"];
//        v_assets = v_assets + assetId + ", ";
//}
//}	    

    if (isEmpty(v_AssignToFromField) == false) {
        var v_STAFF = lookup("COK_TE_SIGN_STAFF", v_AssignToFromField);
        assignCap(v_STAFF);
        editAppSpecific("Change Assigned To", "No"); 
        editAppSpecific("Assigned To", v_STAFF);
 
		//Start Script 32
		var databaseName = lookup("COK_Database_Name", "Database_Name");
		var alternateId = capId.getCustomID();
		var emailTo = v_STAFF + "@knoxvilletn.gov";
		var emailSubject = "A Sign Work Order has been assigned to you. " + alternateId;
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

		email(emailTo, "trafficsigns@knoxvilletn.gov", emailSubject, emailBody);
		//End Script 32

        }
     }