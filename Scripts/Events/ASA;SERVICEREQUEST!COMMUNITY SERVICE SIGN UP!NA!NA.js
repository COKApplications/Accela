/**
 * The below code is related to the ServiceRequest/Community Service Sign Up/NA/NA record, with
 * an ApplicationSubmitAfter event. 
 */

//Start Script 04 - Auto Close Record
closeTask("Service Request Intake", "Completed", "The record has been closed by a script.", "The record has been closed by a script.");
closeCap(currentUserID);
//End Script 04