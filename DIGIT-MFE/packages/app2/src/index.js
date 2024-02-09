import React from "react";
import ReactDOM from "react-dom";
import { QueryClient } from "react-query";
import App from "./ModuleWrapper";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import { BrowserRouter as Router } from "react-router-dom";
import Dummy from "./Dummy";
initLibraries();
const c = new QueryClient();
const stateCode = "pg";
const userType = "employee";
const tenants = "";
const sessionStorageData = {
  "Digit.Employee.tenantId":
    '{"value":"pg.citya","ttl":86400,"expiry":1707386460951}',
  "Digit.user_type": '{"value":"employee","ttl":86400,"expiry":1707386390166}',
  "Digit.User":
    '{"value":{"info":{"id":927,"uuid":"49341961-f413-4ae1-b7f8-92a8d9136f38","userName":"ADMIN","name":"Plant operator","mobileNumber":"8282828121","emailId":null,"locale":null,"type":"EMPLOYEE","roles":[{"name":"FSM Administrator","code":"FSM_ADMIN","tenantId":"pg.citya"},{"name":"FSM Employee Application Viewer","code":"FSM_VIEW_EMP","tenantId":"pg.citya"}],"active":true,"tenantId":"pg.citya","permanentCity":null},"access_token":"3e470368-1015-4a21-ba10-1fd791dbfa8","token_type":"bearer","refresh_token":"f0855c19-867d-4613-b5a1-1120555ee7e0","expires_in":604545,"scope":"read","ResponseInfo":{"api_id":"","ver":"","ts":"","res_msg_id":"","msg_id":"","status":"Access Token generated successfully"}},"ttl":86400,"expiry":1707386460955}',
  "Digit.userType": '{"value":"employee","ttl":86400,"expiry":1707386390166}',
  "Digit.Citizen.tenantId": '{"value":null,"ttl":86400,"expiry":1707386389862}',
  "Digit.initData":
    '{"value":{"languages":[{"label":"ENGLISH","value":"en_IN"},{"label":"हिंदी","value":"hi_IN"}],"stateInfo":{"code":"pg","name":"Demo","logoUrl":"https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png","statelogo":"https://s3.ap-south-1.amazonaws.com/works-dev-asset/pg/logo.png","logoUrlWhite":"https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png","bannerUrl":"https://s3.ap-south-1.amazonaws.com/works-dev-asset/banner-bg.jpg"},"localizationModules":[{"label":"rainmaker-abg","value":"rainmaker-abg"},{"label":"rainmaker-common","value":"rainmaker-common"},{"label":"rainmaker-noc","value":"rainmaker-noc"},{"label":"rainmaker-pt","value":"rainmaker-pt"},{"label":"rainmaker-uc","value":"rainmaker-uc"},{"label":"rainmaker-pgr","value":"rainmaker-pgr"},{"label":"rainmaker-fsm","value":"rainmaker-fsm"},{"label":"rainmaker-tl","value":"rainmaker-tl"},{"label":"rainmaker-hr","value":"rainmaker-hr"},{"label":"rainmaker-test","value":"rainmaker-test"},{"label":"finance-erp","value":"finance-erp"},{"label":"rainmaker-receipt","value":"rainmaker-receipt"},{"label":"rainmaker-dss","value":"rainmaker-dss"},{"label":"rainmaker-workbench","value":"rainmaker-workbench"},{"label":"rainmaker-schema","value":"rainmaker-schema"},{"label":"rainmaker-mdms","value":"rainmaker-mdms"},{"label":"rainmaker-measurement","value":"rainmaker-measurement"},{"label":"rainmaker-common-masters","value":"rainmaker-common-masters"},{"label":"rainmaker-workflow","value":"rainmaker-workflow"}],"modules":[{"module":"Payment","code":"Payment","active":true,"order":1,"tenants":[{"code":"pb.jalandhar"},{"code":"pb.phagwara"},{"code":"pb.amritsar"}]},{"module":"HRMS","code":"HRMS","active":true,"order":2,"tenants":[{"code":"pg.cityb"},{"code":"pg.cityc"},{"code":"pg.citya"}]},{"module":"FSM","code":"FSM","bannerImage":"https://egov-qa-assets.s3.amazonaws.com/FSM.png","active":true,"order":2,"tenants":[{"code":"pg.cityb"},{"code":"pg.cityc"},{"code":"pg.citya"}]},{"module":"DSS","code":"DSS","active":true,"order":10,"tenants":[{"code":"pg.cityb"},{"code":"pg.cityc"},{"code":"pg.citya"}]},{"module":"Utilities","code":"Utilities","active":true,"order":11,"tenants":[{"code":"pg.cityb"},{"code":"pg.cityc"},{"code":"pg.citya"}]},{"module":"Tqm","code":"Tqm","active":true,"order":14,"additionalComponent":"TqmAdminNotification","tenants":[{"code":"pg.cityb"},{"code":"pg.cityc"},{"code":"pg.citya"}]}],"uiHomePage":{"redirectURL":"attendencemgmt/shghome","appBannerDesktop":{"code":"APP_BANNER_DESKTOP","name":"App Banner Desktop View","bannerUrl":"https://s3.ap-south-1.amazonaws.com/egov-qa-assets/app-banner-web.jpg","enabled":true},"appBannerMobile":{"code":"APP_BANNER_MOBILE","name":"App Banner Mobile View","bannerUrl":"https://s3.ap-south-1.amazonaws.com/egov-qa-assets/app-banner-mobile.jpg","enabled":true},"citizenServicesCard":{"code":"HOME_CITIZEN_SERVICES_CARD","name":"Home Citizen services Card","enabled":true,"headerLabel":"DASHBOARD_CITIZEN_SERVICES_LABEL","sideOption":{"name":"DASHBOARD_VIEW_ALL_LABEL","enabled":true,"navigationUrl":"/sanitation-ui/citizen/all-services"},"props":[{"code":"CITIZEN_SERVICE_PGR","name":"Complaints","label":"ES_PGR_HEADER_COMPLAINT","enabled":true,"navigationUrl":"/digit-ui/citizen/pgr-home"},{"code":"CITIZEN_SERVICE_PT","name":"Property Tax","label":"MODULE_PT","enabled":true,"navigationUrl":"/digit-ui/citizen/pt-home"},{"code":"CITIZEN_SERVICE_TL","name":"Trade Licence","label":"MODULE_TL","enabled":true,"navigationUrl":"/digit-ui/citizen/tl-home"},{"code":"CITIZEN_SERVICE_WS","name":"Water & Sewerage","label":"ACTION_TEST_WATER_AND_SEWERAGE","enabled":true,"navigationUrl":"/digit-ui/citizen/ws-home"}]},"informationAndUpdatesCard":{"code":"HOME_CITIZEN_INFO_UPDATE_CARD","name":"Home Citizen Information and Updates card","enabled":true,"headerLabel":"CS_COMMON_DASHBOARD_INFO_UPDATES","sideOption":{"name":"DASHBOARD_VIEW_ALL_LABEL","enabled":true,"navigationUrl":""},"props":[{"code":"CITIZEN_MY_CITY","name":"My City","label":"CS_HEADER_MYCITY","enabled":true,"navigationUrl":""},{"code":"CITIZEN_EVENTS","name":"Events","label":"EVENTS_EVENTS_HEADER","enabled":true,"navigationUrl":"/digit-ui/citizen/engagement/events"},{"code":"CITIZEN_DOCUMENTS","name":"Documents","label":"CS_COMMON_DOCUMENTS","enabled":true,"navigationUrl":"/digit-ui/citizen/engagement/docs"},{"code":"CITIZEN_SURVEYS","name":"Surveys","label":"CS_COMMON_SURVEYS","enabled":true,"navigationUrl":"/digit-ui/citizen/engagement/surveys/list"}]},"whatsNewSection":{"code":"WHATSNEW","name":"What\'s New","enabled":true,"headerLabel":"DASHBOARD_WHATS_NEW_LABEL","sideOption":{"name":"DASHBOARD_VIEW_ALL_LABEL","enabled":true,"navigationUrl":"/digit-ui/citizen/engagement/whats-new"}},"whatsAppBannerDesktop":{"code":"WHATSAPP_BANNER_DESKTOP","name":"WhatsApp Banner Desktop View","bannerUrl":"https://s3.ap-south-1.amazonaws.com/egov-qa-assets/whatsapp-web.jpg","enabled":true,"navigationUrl":"https://api.whatsapp.com/send?phone=918744060444&text=mSeva"},"whatsAppBannerMobile":{"code":"WHATSAPP_BANNER_MOBILE","name":"WhatsApp Banner Mobile View","bannerUrl":"https://s3.ap-south-1.amazonaws.com/egov-qa-assets/whatsapp-mobile.jpg","enabled":true,"navigationUrl":"https://api.whatsapp.com/send?phone=918744060444&text=mSeva"}},"selectedLanguage":"en_IN","tenants":[{"i18nKey":"TENANT_TENANTS_PG","code":"pg","name":"Demo","description":"Demo","logoId":"https://s3.ap-south-1.amazonaws.com/works-dev-asset/pg/logo.png","imageId":"https://s3.ap-south-1.amazonaws.com/works-dev-asset/pg/logo.png","domainUrl":"www.mccitya.in","type":"CITY","twitterUrl":"https://twitter.com/search?q=%23citya","facebookUrl":"https://www.facebook.com/city/citya-Demo","emailId":"complaints.mcj@gmail.com","OfficeTimings":{"Mon - Fri":"9.00 AM - 6.00 PM"},"city":{"name":"Demo","localName":"Demo","districtCode":"0","districtName":"Demo","districtTenantCode":"pg.demo","regionName":"Demo","ulbGrade":"ST","longitude":75.3412,"latitude":31.1471,"shapeFileLocation":null,"captcha":null,"code":"0","ddrName":null},"address":"5 Demo Municipal Bhawan, 3, Dakshin Marg, 35A, Sector 35A, Chandigarh, 160022","pincode":[],"contactNumber":"0181-2227015","pdfHeader":"PG_PDF_HEADER","pdfContactDetails":"PG_CONTACT_DETAILS"},{"i18nKey":"TENANT_TENANTS_PG_CITYA","code":"pg.citya","name":"CityA","description":"CityA","logoId":"https://s3.ap-south-1.amazonaws.com/works-dev-asset/pg.citya/logo.png","imageId":"https://s3.ap-south-1.amazonaws.com/works-dev-asset/pg.citya/logo.png","domainUrl":"www.mccitya.in","type":"CITY","twitterUrl":"https://twitter.com/search?q=%23citya","facebookUrl":"https://www.facebook.com/city/citya-Demo","emailId":"complaints.mcj@gmail.com","OfficeTimings":{"Mon - Fri":"9.00 AM - 6.00 PM"},"city":{"name":"CityA","localName":"Janlandhar","districtCode":"10","districtName":"CityA","districtTenantCode":"pg.citya","regionName":"CityA Region","ulbGrade":"Municipal Corporation","ulbType":"Municipal Corporation","longitude":75.5761829,"latitude":31.3260152,"shapeFileLocation":null,"captcha":null,"code":"1013","regionCode":"4","municipalityName":"CityA","ddrName":"CityA-MC"},"address":"Municipal Corporation Office, Dr. B.R.Ambedkar Admin Complex, Nehru Garden, CityA City-144001","pincode":[144001,144002,144003,144004,144005,144006,144007,144008,144009,144010],"contactNumber":"0181-2227015","pdfHeader":"PG_JALANDHAR_PDF_HEADER","pdfContactDetails":"PG_JALANDHAR_CONTACT_DETAILS"},{"i18nKey":"TENANT_TENANTS_PG_CITYB","code":"pg.cityb","name":"CityB","description":null,"logoId":"https://s3.ap-south-1.amazonaws.com/works-dev-asset/pg.cityb/logo.png","imageId":"https://s3.ap-south-1.amazonaws.com/works-dev-asset/pg.cityb/logo.png","domainUrl":"www.citybcorp.com","type":"CITY","twitterUrl":"https://twitter.com/search?q=%23AMRITSAR","facebookUrl":"https://www.facebook.com/city/CityB-Demo","emailId":"cmcasr@gmail.com","OfficeTimings":{"Mon - Fri":"9.00 AM - 6.00 PM","Sat":"9.00 AM - 12.00 PM"},"city":{"name":"CityB","localName":"CityB","districtCode":"1","districtName":"CityB","districtTenantCode":"pg.cityb","regionName":"CityB Region","ulbGrade":"Municipal Corporation","ulbType":"Municipal Corporation","longitude":74.8723,"latitude":31.634,"shapeFileLocation":null,"captcha":null,"code":"107","regionCode":"1","municipalityName":"CityB","ddrName":"CityB-MC"},"address":"Municipal Corporation CityB, C Block, Ranjit Avenue, CityB, Demo","pincode":[143001,143002,143003,143004,143005,143006,143007,143008,143009,143010],"contactNumber":"0183-2545155","helpLineNumber":"0183-2210300","pdfHeader":"PG_AMRITSAR_PDF_HEADER","pdfContactDetails":"PG_AMRITSAR_CONTACT_DETAILS"},{"i18nKey":"TENANT_TENANTS_PG_CITYC","code":"pg.cityc","name":"CityC","description":null,"logoId":"https://s3.ap-south-1.amazonaws.com/works-dev-asset/pg.cityc/logo.png","imageId":"https://s3.ap-south-1.amazonaws.com/works-dev-asset/pg.cityc/logo.png","domainUrl":"www.cityc.com","type":"CITY","twitterUrl":null,"facebookUrl":null,"emailId":"","OfficeTimings":{"Mon - Fri":"9.00 AM - 6.00 PM"},"city":{"name":"CityC","localName":"CityC","districtCode":"17","districtName":"Nawanshar","districtTenantCode":"pg.nawanshar","regionName":"CityA Region","ulbGrade":"MC Class I","ulbType":"Municipal Council","longitude":76.0392,"latitude":31.0913,"shapeFileLocation":null,"captcha":null,"code":"1703","regionCode":"4","municipalityName":"SBS Nagar","ddrName":"CityA-DDR"},"address":"Committee Bazar","pincode":[144513,144514,144516,144517],"contactNumber":"1823220085","helpLineNumber":"","pdfHeader":"PG_NAWANSHAHR_PDF_HEADER","pdfContactDetails":"PG_NAWANSHAHR_CONTACT_DETAILS"}]},"ttl":86400,"expiry":1707386390151}',
  "Digit.citizen.userRequestObject":
    '{"value":{"info":{"id":927,"uuid":"49341961-f413-4ae1-b7f8-92a8d9136f38","userName":"ADMIN","name":"Plant operator","mobileNumber":"8282828121","emailId":null,"locale":null,"type":"EMPLOYEE","roles":[{"name":"FSM Administrator","code":"FSM_ADMIN","tenantId":"pg.citya"},{"name":"FSM Employee Application Viewer","code":"FSM_VIEW_EMP","tenantId":"pg.citya"}],"active":true,"tenantId":"pg.citya","permanentCity":null},"access_token":"3e470368-1015-4a21-ba10-1fd791dbfa8","token_type":"bearer","refresh_token":"f0855c19-867d-4613-b5a1-1120555ee7e0","expires_in":604545,"scope":"read","ResponseInfo":{"api_id":"","ver":"","ts":"","res_msg_id":"","msg_id":"","status":"Access Token generated successfully"}},"ttl":86400,"expiry":1707386460954}',
};

Object.entries(sessionStorageData).forEach(([key, value]) => {
  sessionStorage.setItem(key, value);
});

ReactDOM.render(
  <Router>
    <App
      stateCode={stateCode}
      userType={userType}
      tenants={tenants}
      queryClient={c}
    />
    ,
  </Router>,
  document.getElementById("app")
);
