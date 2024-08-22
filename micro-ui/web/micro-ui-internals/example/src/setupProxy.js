const { createProxyMiddleware } = require("http-proxy-middleware");

const createProxy = createProxyMiddleware({
  //target: process.env.REACT_APP_PROXY_API || "https://uat.digit.org",
  // target: process.env.REACT_APP_PROXY_API || "https://qa.digit.org",
  target: process.env.REACT_APP_PROXY_API || "https://works-dev.digit.org",
  changeOrigin: true,
  secure: false
});
const assetsProxy = createProxyMiddleware({
  target: process.env.REACT_APP_PROXY_ASSETS || "https://works-dev.digit.org",
  changeOrigin: true,
  secure: false
});
const mdmsProxy = createProxyMiddleware({
  target: process.env.REACT_APP_PROXY_ASSETS || "http://localhost:8080",
  changeOrigin: true,
  secure: false
});
module.exports = function (app) {
  ["/mdms-v2/v2/_create"].forEach((location) => app.use(location, mdmsProxy));
  [
    "/access/v1/actions/mdms",
    "/tenant-management",
    "/user-otp",
    "/egov-mdms-service",
    "/mdms-v2",
    "/egov-idgen",
    "/egov-location",
    "/localization",
    "/egov-workflow-v2",
    "/pgr-services",
    "/filestore",
    "/egov-hrms",
    "/user-otp",
    "/user",
    "/fsm",
    "/billing-service",
    "/collection-services",
    "/pdf-service",
    "/pg-service",
    "/vehicle",
    "/vendor",
    "/property-services",
    "/fsm-calculator/v1/billingSlab/_search",
    "/pt-calculator-v2",
    "/dashboard-analytics",
    "/echallan-services",
    "/egov-searcher/bill-genie/mcollectbills/_get",
    "/egov-searcher/bill-genie/billswithaddranduser/_get",
    "/egov-searcher/bill-genie/waterbills/_get",
    "/egov-searcher/bill-genie/seweragebills/_get",
    "/egov-pdf/download/UC/mcollect-challan",
    "/egov-hrms/employees/_count",
    "/tl-services/v1/_create",
    "/tl-services/v1/_search",
    "/egov-url-shortening/shortener",
    "/inbox/v1/_search",
    "/inbox/v2/_search",
    "/tl-services",
    "/tl-calculator",
    "/org-services",
    "/edcr",
    "/hcm-moz-impl",
    "/bpa-services",
    "/noc-services",
    "/egov-user-event",
    "/egov-document-uploader",
    "/egov-pdf",
    "/egov-survey-services",
    "/ws-services",
    "/sw-services",
    "/ws-calculator",
    "/sw-calculator/",
    "/audit-service/",
    "/egov-searcher",
    "/report",
    "/inbox/v1/dss/_search",
    "/loi-service",
    "/project/v1/",
    "/estimate-service",
    "/loi-service",
    "/works-inbox-service/v2/_search",
    "/egov-pdf/download/WORKSESTIMATE/estimatepdf",
    "/muster-roll",
    "/individual",
    "/mdms-v2",
    "/facility/v1/_search",
    "/project/staff/v1/_create",
    "/product/v1/_create",
    "/boundary-service",
    "/project-factory",
    "/project-factory/v1/data/_autoGenerateBoundaryCode",
    "/billing-service/bill/v2/_fetchbill",
    "/tenant-management"
  ].forEach((location) => app.use(location, createProxy));
  ["/pb-egov-assets"].forEach((location) => app.use(location, assetsProxy));
  ["/mdms-v2/v2/_create"].forEach((location) => app.use(location, mdmsProxy));
};
