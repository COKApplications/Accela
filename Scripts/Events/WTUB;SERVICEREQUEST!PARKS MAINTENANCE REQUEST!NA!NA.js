if(wfTask == "SR Intake" && wfStatus == "Public Service Work Order" && AInfo["Updated.Public Service Work Order Type"] == "") {
    showMessage = true;
    comment("Public Service Work Order Type Is Missing " + AInfo["Updated.Public Service Work Order Type"]);
    cancel = true;
}


if(wfTask == "SR Intake" && wfStatus == "Parks & Rec Work Order" && AInfo["Updated.Parks & Rec Work Order Type"] == "") {
    showMessage = true;
    comment("Parks & Rec Work Order Type Is Missing");
    cancel = true;
}