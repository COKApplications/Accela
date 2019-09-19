var v_ChangeAssignedTo = AInfo["Change Assigned To"];
if (v_ChangeAssignedTo == "Yes") {
    var v_AssignToFromField = AInfo["Assign To"];
    if (isEmpty(v_AssignToFromField) == false) {
        var v_STAFF = lookup("COK_TE_SIGN_STAFF", v_AssignToFromField);
        assignCap(v_STAFF);
        editAppSpecific("Change Assigned To", "No");
        editAppSpecific("Assigned To", v_STAFF);
} 
}