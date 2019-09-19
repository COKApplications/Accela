if(wfTask == "Application Submittal" && wfStatus == "Approved")
{
   if(balanceDue > 0) {
    showMessage = true;
    comment("****Fees Have Not Been Paid");
    cancel = true;
    }
}