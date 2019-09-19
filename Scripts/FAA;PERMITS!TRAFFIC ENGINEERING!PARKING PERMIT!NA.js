showMessage = true;

var  pp_meterbag = feeAmount("PP_METERBAG","NEW","INVOICED");
var  pp_nmfee = feeAmount("PP_NMFEE","NEW","INVOICED");
var  pp_annualfee = feeAmount("PP_ANNUALFEE","NEW","INVOICED");
var  pp_removal = feeAmount("PP_REMOVAL","NEW","INVOICED");
var  pp_minfee = feeAmount("PP_MINFEE","NEW","INVOICED");
var  feetotal = pp_meterbag + pp_nmfee + pp_annualfee + pp_removal;
comment ("feetotal=" + feetotal);
comment ("pp_minfeefee=" + pp_minfee);
if   (feetotal > 24.99) {
     pp_minfee = 0;
     }
else 
    {pp_minfee = 25.00 - feetotal};

if (pp_minfee == 0) {
    if (feeExists("PP_MINFEE")== true) {
   updateFee("PP_MINFEE","PERMIT_PARKING", "FINAL", 0, "N");
    }
}    

if (pp_minfee > 0) {
    if (feeExists("PP_MINFEE")== true) {
   updateFee("PP_MINFEE","PERMIT_PARKING", "FINAL", pp_minfee, "N");
    }
else
   {addFee("PP_MINFEE","PERMIT_PARKING", "FINAL", pp_minfee, "N");
}  
}
