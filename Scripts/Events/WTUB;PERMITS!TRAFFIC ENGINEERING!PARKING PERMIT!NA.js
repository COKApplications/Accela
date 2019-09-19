if(wfTask == "Application Submittal" && wfStatus == "Approved Pending Payment")
{
   if(balanceDue == 0) {
    showMessage = true;
    comment("****Fees Have Not Been Calculated and Invoiced");
    cancel = true;
    }
}

if(wfTask == "Application Submittal" && wfStatus == "Approved Pending Permit")
{
   if(balanceDue > 0) {
    showMessage = true;
    comment("****Fees Have Not Been Paid");
    cancel = true;
    }
}

//if(wfTask == "Create Work Order" && wfStatus == "Create Work Order")
//{
//   var workordertype = AInfo["Traffic Engineering Work Order Type"];
//   if (isEmpty(workordertype) == true) {
//    showMessage = true;
//    comment("****a Traffic Engineering Work Order Type Has Not Been Selected");
//    cancel = true;
//    }
//}