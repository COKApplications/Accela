eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));

showMessage = true;

var contactArray = getContactArray();

for(ca in contactArray) {
	var thisContact = contactArray[ca];
		    
	if(thisContact["contactType"] == "Applicant") {
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

		var contactSeqNumber = thisContact["contactSeqNumber"];

		comment("contactSeqNumber: " + contactSeqNumber);

		if (contactFullName == null) {
			new_FullName = contactFName + " " + contactLName;
			comment("new_FullName: " + new_FullName);

		}

	}
}

