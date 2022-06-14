const entitesColumns = {
  name: true,
  subdomain: true,
  kiosk: true,
  package: true,
};
const dashboardColumns = {
  Image: true,
  Status: true,
  FirstName: true,
  LastName: true,
  UserType: true,
  Area: true,
  Site: true,
  InputType: true,
  Temperature: true,
  hasMask: true,
  Arrival: true,
  Compliances: true,
  VaccineDocument: true,
};
const usersColumns = {
  Image: true,
  FirstName: true,
  LastName: true,
  UserType: true,
  ID: true,
  RFID:true,
  Email: true,
  Status: true,
  SystemUser: true,
  VaccineDocument: true,
};
const userTypesColumns = {
  Name: true,
};
const privacyManagerColumns = {
  UserType: true,
  DataRetention: true,
  ScansRetention: true,
  DeleteRecordsUpTo: true,
};
const complianceColumns = {
  name: true,
  version: true,
  date: true,
};
const reportHistoryColumns = {
  Image: true,
  Status: true,
  FirstName: true,
  LastName: true,
  UserType: true,
  ID: true,
  Kiosk: true,
  Area: true,
  Site: true,
  InputType: true,
  hasMask: true,
  Temperature: true,
  Date: true,
  VaccineDocument: true,
  Compliances: true,
};
const reportTimeColumns = {
  Image: true,
  FirstName: true,
  LastName: true,
  UserType: true,
  Kiosk: true,
  InputType: true,
  Temperature: true,
  CheckIN: true,
};
const trackTraceColumns = {
  FirstName: true,
  LastName: true,
  UserType: true,
  InputType: true,
  Kiosk: true,
  Date: true,
};
const importUsersColumns = {
  Image: true,
  Name: true,
  UserType: true,
  ID: true,
  RFID: true,
  Email: true,
  PhoneNumber: true,
  Status: true,
  Comments: true,
};
const importQueuesColumns = {
  Operator: true,
  Serial: true,
  Date: true,
  ID: true,
  Time: true,
  Status: true,
};
const importUsersDetailsColumns = {
  Image: true,
  Name: true,
  UserType: true,
  UserId: true,
  RFID: true,
  Email: true,
  PhoneNumber: true,
  Status: true,
  Comments: true,
};
// sites 
const sitesColumns = {
  Name: true,
  AreasCount: true,
  KiosksCount: true,
  ReceptionEmail: true,
  Timezone: true,
};
// area 
const areasColumns = {
  Area_Name: true,
  Login_Mode: true,
  Kiosk_Name: true,
  Journey: true,
  Android_Serial: true,
  Lamasatech_Serial: true,
  Mac_Address: true,
  Status: true,
  Pre_Registration_URL:true,
};
// journey
const journeyColumns = {
  Journey_Name: true,
  Flow_Name: true,
  User_Type: true,
  Input: true,
  Checks: true,
  Compliance: true,
  Output: true,
  Notification: true,
  Feedback: true,
};
// export list
const exportListColumns = {
  requested_by: true,
  generation_date: true,
  expiry_date: true,
  type: true,
};
const daemonLogsColumns = {
  id: true,
  kiosk: true,
  type: true,
  status: true,
  requestedAt: true,
  reasonOfFailure: true,
  download: true
}

export {
  entitesColumns,
  dashboardColumns,
  sitesColumns,
  usersColumns,
  userTypesColumns,
  reportHistoryColumns,
  reportTimeColumns,
  importUsersColumns,
  importQueuesColumns,
  importUsersDetailsColumns,
  complianceColumns,
  areasColumns,
  journeyColumns,
  trackTraceColumns,
  privacyManagerColumns,
  exportListColumns,
  daemonLogsColumns
};
