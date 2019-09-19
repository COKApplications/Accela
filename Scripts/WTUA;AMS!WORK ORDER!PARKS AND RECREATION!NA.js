/**
 * The below code is related to the AMS/Work Order/PARKS AND RECREATION/NA record, with
 * a WorkflowTaskUpdateAfter event. 
 */

var parentRecord = getParent();

if(isEmpty(parentRecord) == false) {
	//Start Script 16 - Update Service Request Parent Status
	if (wfTask == "Open" && (wfStatus == "Canceled" || wfStatus == "Completed")) {
                checkRelatedAndCloseSR ();
                
    	}
}
	//End Script 16