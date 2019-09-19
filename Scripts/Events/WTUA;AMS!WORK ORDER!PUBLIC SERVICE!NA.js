/**  TEST
 * The below code is related to the AMS/Work Order/Public Service/NA record, with
 * a WorkflowTaskUpdateAfter event. 
 */

// Set the record assignment to the same staff member as the workflow assignment
//var Foreman = aa.workflow.getTasks(capId).getOutput().getAssignedStaff().getUserID();
//assignCap(Foreman);

var parentRecord = getParent();
var myCap = "";
var myAppTypeString = "";
var myAppTypeArray = "";
var myRecordModule = "";
var myRecordType = "";
var myRecordSubType = "";

if(isEmpty(parentRecord) == false) {
	myCap = aa.cap.getCap(parentRecord).getOutput(); 
        myAppTypeString = myCap.getCapType().toString();
        myAppTypeArray = myAppTypeString.split("/");
	myRecordModule = myAppTypeArray[0];
        myRecordType = myAppTypeArray[1];
	myRecordSubType = myAppTypeArray[2];

	//Start Script 16 - Update Service Request Parent Status
	if (wfTask == "Open" && (wfStatus == "Canceled" || wfStatus == "Completed")) {
	closeTask("Closed", "Completed", "Scheduled by Script", "Scheduled by Script.");
        deactivateTask("Closed");
	if (myRecordModule == "ServiceRequest") {
	        checkRelatedAndCloseSR ();
			
        //ADDED 12-6-18 
        var xWOType = AInfo["Work Order Type"];
        if (myRecordType == "Parks Maintenance Request" && xWOType == "PS06 Litter") {
	 			//updateAppStatus("Bill Owed Add Fees", "Updated by Script.", parentId);
			closeTaskParent("PS Work Order", "Completed", "Updated by Script.", "Updated by Script.");

       var xSRType = myAppTypeArray[1];
       }

       // END 12-6-18


       } //(myRecordModule == "ServiceRequest")

    if (myRecordType == "Traffic Engineering" && myRecordSubType == "Investigation") {
		    checkRelatedENFAndCloseENF();
  //                   checkRelatedAndCloseSR ();
	}
           var grandparentRecord = getGrandParent(); 
           if(isEmpty(grandparentRecord) == false) {
		 closeTaskGrandParent("Service Request Intake", "Completed", "Updated by Script", "Updated by Script.");
                updateAppStatus("Completed", "Updated by Script.", getGrandParent());
                 }
			

//Added 10-22-2018 to close Stormwater Investigation
  if (myRecordType == "Stormwater" && myRecordSubType == "Investigation") {
		    checkRelatedENFAndCloseENF();
  //                   checkRelatedAndCloseSR ();
  
             var grandparentRecord = getGrandParent(); 
           if(isEmpty(grandparentRecord) == false) {
		 closeTaskGrandParent("Service Request Intake", "Completed", "Updated by Script", "Updated by Script.");
                updateAppStatus("Completed", "Updated by Script.", getGrandParent());
                 }
			}
		}  //  END of (wfTask == "Open" && (wfStatus == "Canceled" || wfStatus == "Completed"))


	//End Script 16


	//Start Script 27 - Add Codes Fees
	if(wfTask == "Open" && wfStatus == "Completed") {
		var parentId = getParent();
		var thisWorkOrderType = getAppSpecific("Work Order Type");	
	if (myRecordType == "Codes Enforcement") {
	
	  if(matches(thisWorkOrderType, "PS41 Dirty Lot Cleanup", "PS42 Mow Overgrown Lot", "PS48 Clean and Mow")) {
			updateAppStatus("Bill Owed Add Fees", "Updated by Script.", parentId);
			closeTaskParent("PS Work Order", "Completed", "Updated by Script.", "Updated by Script.");
			//RFS#24696 KCR 07/21/2017 - set bill task status to "Bill Owed Add Fees" for both Dirty Lot and ROW records  
			updateTask("Bill", "Bill Owed Add Fees", "Updated by Script.", "Updated by Script.", "CE_DIRTY_LOT", parentId)
			updateTask("Bill", "Bill Owed Add Fees", "Updated by Script.", "Updated by Script.", "CE_ROW", parentId)
		}
                // New RFS22848 - New Enforcement Boarding Record - KCR 10/2016
      	if(matches(thisWorkOrderType, "PS39 Board House Codes Enforcement")) {
			updateAppStatus("Bill Owed Add Fees", "Updated by Script.", parentId);
			closeTaskParent("PS Work Order", "Completed", "Updated by Script.", "Updated by Script.");
			//RFS#24696 KCR 07/21/2017 - set bill task status to "Bill Owed Add Fees" for Boarding records  
			updateTask("Bill", "Bill Owed Add Fees", "Updated by Script.", "Updated by Script.", "CE_BOARD_STR", parentId)
		}
                // End RFS22848
		if(matches(thisWorkOrderType, "PS43 Illegal Dump Site","PS09 Mowing City Property")) {
			closeTaskParent("PS Work Order", "Completed", "Updated by Script.", "Updated by Script.");
			 //HD#40160  added 3 lines below. 7/20/2017 KCR				 
                         closeTaskParent("Bill", "No Fees Due", "Updated by Script.", "Updated by Script.");
	                 deactivateTask("Bill");
	                 closeTaskParent("Case Closed", "Completed", "Updated by Script.", "Updated by Script.");	
			updateAppStatus("Completed", "Updated by Script.", parentId);
 			 //HD#40160  removed below 4 lines. 7/20/2017 KCR				 
                         //capId = parentId;
			 //deactivateTask("Bill");
	                //closeTaskParent("Bill", "No Fees Due", "Updated by Script.", "Updated by Script.");
	                //closeTaskParent("Case Closed", "Completed", "Updated by Script.", "Updated by Script.");	
	         }
	}
	  if (myRecordType == "Traffic Engineering" && myRecordSubType == "Investigation") {
		  if (myRecordSubType == "Investigation") {
			  closeTaskParent("TEINVEST: Work Order", "Completed", "Updated by Script.", "Updated by Script");
			  updateAppStatus("Completed", "Updated by Script.", parentId);
			  capId = parentId;
			  deactivateTask("Waiting Completion Of Ad Hoc Tasks");
			  deactivateTask("TEINVEST: Work Order");
			  activateTask("Case Closed");
		}
	  }
         //10-22-18 HD #45589 Added to close Parent Task  
         if (myRecordType == "Stormwater" && myRecordSubType == "Investigation") {
		  if (myRecordSubType == "Investigation") {
			  closeTaskParent("SWINVEST: Work Order", "Completed", "Updated by Script.", "Updated by Script");
			  updateAppStatus("Completed", "Updated by Script.", parentId);
			  capId = parentId;
			  deactivateTask("Re-Inspection");
			  deactivateTask("SWINVEST: Work Order");
			  activateTask("Case Closed");
		}
	  }
	} //END Of (wfTask == "Open" && wfStatus == "Completed")
	  
	if(wfTask == "Open" && wfStatus == "Canceled") {
		if (myRecordType == "Codes Enforcement") {
			var parentId = getParent();
			var thisWorkOrderType = getAppSpecific("Work Order Type");
     	//HD#40914 - moved this section below under else.....no longer checking for PS41, PS42, PS48.
		//if(matches(thisWorkOrderType, "PS41 Dirty Lot Cleanup", "PS42 Mow Overgrown Lot", "PS48 Clean and Mow")) {
		//	updateAppStatus("Completed", "Updated by Script.", parentId);
		//	updateAppStatus("Completed", "Updated by Script.", getGrandParent());
		//	closeTaskParent("PS Work Order", "Canceled", "Updated by Script.", "Updated by Script.");
		//	closeTaskParent("Bill", "Violation Corrected", "Updated by Script.", "Updated by Script.");
		//	closeTaskParent("Case Closed", "Violation Corrected", "Updated by Script.", "Updated by Script.");
        //                 var grandparentRecord = getGrandParent();                         
        //                 if(isEmpty(grandparentRecord) == false) {
		//         closeTaskGrandParent("Service Request Intake", "Completed", "Updated by Script", "Updated by Script.");
        //                 updateAppStatus("Completed", "Updated by Script.", getGrandParent());
		//          }
        //      }
	        // New RFS22848 - New Enforcement Boarding Record - KCR 10/2016
			if(matches(thisWorkOrderType, "PS39 Board House Codes Enforcement")) {
				updateAppStatus("Completed", "Updated by Script.", parentId);
				closeTaskParent("PS Work Order", "Canceled", "Updated by Script.", "Updated by Script.");
				// closeTaskParent("Bill", "Violation Corrected", "Updated by Script.", "Updated by Script.");
				closeTaskParent("Case Closed", "Violation Corrected", "Updated by Script.", "Updated by Script.");
				}
			// End RFS22848 - KCR
            // HD#40914 - moved logic below...}
			else {
				updateAppStatus("Completed", "Updated by Script.", parentId);
				updateAppStatus("Completed", "Updated by Script.", getGrandParent());
				closeTaskParent("PS Work Order", "Canceled", "Updated by Script.", "Updated by Script.");
				closeTaskParent("Bill", "Violation Corrected", "Updated by Script.", "Updated by Script.");
				closeTaskParent("Case Closed", "Violation Corrected", "Updated by Script.", "Updated by Script.");
				var grandparentRecord = getGrandParent();                         
				if(isEmpty(grandparentRecord) == false) {
					closeTaskGrandParent("Service Request Intake", "Completed", "Updated by Script", "Updated by Script.");
					updateAppStatus("Completed", "Updated by Script.", getGrandParent());
					}
				}
			}
			//HD#40914 END
	}
}
//End Script 27


//SW Script Added 01-15-19 Handle Setup of Work Order
if (myRecordType == "Stormwater" && myRecordSubType == "Investigation") {

if(wfTask == "Setup Work Order" && wfStatus == "Completed" || wfStatus == "Approved") {
		//var thisWorkOrderType = getAppSpecific("Work Order Type");	
	    //closeTaskParent("SWINVEST: Work Order", "Completed", "Updated by Script.", "Updated by Script");
		var parentId = getParent();
		//capId = parentId;
            updateAppStatus("Under Review" , "Updated by Script.");	
            var parentId = getParent();
	    //capId = parentId;
            updateAppStatus("Work Order", "Updated by Script.", parentId);
		}
		
if(wfTask == "Setup Work Order" && wfStatus == "Approval Requested") {
		//var thisWorkOrderType = getAppSpecific("Work Order Type");	
	        //closeTaskParent("SWINVEST: Work Order", "Completed", "Updated by Script.", "Updated by Script");
		var parentId = getParent();
		//capId = parentId;
		updateAppStatus("Approval Requested" ,"Updated by Script.");
		}

		if(wfTask == "Setup Work Order" && wfStatus == "Pending") {
		updateAppStatus("Pending","Updated by Script.");
		}
if(wfTask == "Open" && wfStatus == "Completed") {
		updateAppStatus("Pending","Updated by Script.");
		var wfStarted =  getWorkflowHistory (capID, "Setup Work Order" );
	     showMessage = true;
        comment ("wfStartedf=" + wfStarted);
	showMessage = false;
	}

//  showMessage = true;
//  comment ("Begin For Loop");  
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
         
   //      comment ("Workflow Assigned Staff=" + wfAssignedStaff);
   //      comment ("Workflow Assigned StaffUserId=" + v_userID);
          }
       }

   }  //END OF (myRecordType == "Stormwater" && myRecordSubType == "Investigation")

//Script 32 DH ADDED 12-6-18

if (myRecordType == "Parks Maintenance Request" && wfTask == "Open" && (wfStatus == "Completed")) {
//comment ("Begin email");	
	//Start Script 32
		var databaseName = lookup("COK_Database_Name", "Database_Name");
		var alternateId = capId.getCustomID();
		var emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/PARK/MTC/NA/NA/NA");
		var emailSubject = "A Public Service Work Order for Parks and Recreation has been completed. " + alternateId;

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
		" Public Service Work Order number " + alternateId + " has been Completed." +"<br>" + "<br>" +
                xSRType + " - " + xWOType + "<br>" + "<br>" +		
		"Location - " + locationInfo + "<br>" + "<br>" + 
		"</html>";

		email(emailTo, "311@knoxvilletn.gov", emailSubject, emailBody);
		//End Script 32
}
