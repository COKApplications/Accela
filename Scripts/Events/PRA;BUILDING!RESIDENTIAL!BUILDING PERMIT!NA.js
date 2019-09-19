showMessage = true;
comment("PRA Script Begin");
comment("balanceDue = " + balanceDue);

if ((balanceDue == 0) && (capStatus == "Applied")) {
    comment("Balance is zero - set Status to Open");
    updateAppStatus("Open", "Updated by PRA Script - Balance Zero - on " + PaymentDate);
    deactivateTask("Permit Issuance");
    activateTask("Inspections");
};

//comment("PaymentDate = " + PaymentDate);