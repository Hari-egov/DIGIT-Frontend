import * as express from "express";
import { produceIngestion } from "../../utils";
import FormData from 'form-data';
import config from "../../config/index";
import * as XLSX from 'xlsx';
import { logger } from "../../utils/logger";
import { produceModifiedMessages } from '../../Kafka/Listener';
import { getCampaignDetails } from '../../utils/index'
import { validateProcessMicroplan } from '../../utils/validator'
import {
  searchMDMS
} from "../../api/index";

import {
  errorResponder,
  sendResponse,
} from "../../utils/index";
import { httpRequest } from "../../utils/request";

const saveCampaignTopic = config.KAFKA_SAVE_CAMPAIGN_DETAILS_TOPIC;
// Define the MeasurementController class
class BulkUploadController {
  // Define class properties
  public path = "/hcm";
  public router = express.Router();
  public dayInMilliSecond = 86400000;

  // Constructor to initialize routes
  constructor() {
    this.intializeRoutes();
  }

  // Initialize routes for MeasurementController
  public intializeRoutes() {
    this.router.post(`${this.path}/_processmicroplan`, this.processMicroplan);
  }


  processMicroplan = async (
    request: express.Request,
    response: express.Response
  ) => {
    await validateProcessMicroplan(request, response);
    const campaignDetails = getCampaignDetails(request?.body);
    var result: any, Job: any = { ingestionDetails: { userInfo: {}, projectType: request?.body?.HCMConfig?.projectType, projectTypeId: request?.body?.HCMConfig?.projectTypeId, projectName: request?.body?.HCMConfig?.campaignName, history: [], campaignDetails: campaignDetails } };
    const saveHistory: any = Job.ingestionDetails;
    logger.info("Saving campaign details : " + JSON.stringify(campaignDetails));
    produceModifiedMessages(saveHistory, saveCampaignTopic);
    try {
      try {
        const { campaignType } = request?.body?.HCMConfig;
        const campaign: any = await searchMDMS([campaignType], config.values.campaignType, request.body.RequestInfo, response);
        if (!campaign.mdms || Object.keys(campaign.mdms).length === 0) {
          throw new Error("Invalid Campaign Type");
        }
        request.body.HCMConfig['transformTemplate'] = campaign?.mdms?.[0]?.data?.transformTemplate;
        const parsingTemplates = campaign?.mdms?.[0]?.data?.parsingTemplates;
        logger.info("ParsingTemplates : " + JSON.stringify(parsingTemplates))
        const hostHcmBff = config.host.hcmBff.endsWith('/') ? config.host.hcmBff.slice(0, -1) : config.host.hcmBff;
        result = await httpRequest(`${hostHcmBff}${config.app.contextPath}${'/bulk'}/_transform`, request.body, undefined, undefined, undefined, undefined);
        if (result.Error) {
          throw new Error(result.Error);
        }
        var parsingTemplatesLength = parsingTemplates.length
        for (let i = 0; i < parsingTemplatesLength; i++) {
          const parsingTemplate = parsingTemplates[i];
          request.body.HCMConfig['parsingTemplate'] = parsingTemplate.templateName;
          request.body.HCMConfig['data'] = result?.updatedDatas;
          var processResult: any = await httpRequest(`${hostHcmBff}${config.app.contextPath}${'/bulk'}/_process`, request.body, undefined, undefined, undefined, undefined);
          if (processResult.Error) {
            throw new Error(processResult.Error);
          }
          const updatedData = processResult?.updatedDatas;
          if (Array.isArray(updatedData)) {
            // Create a new array with simplified objects
            const simplifiedData = updatedData.map((originalObject: any) => {
              // Initialize acc with an explicit type annotation
              const acc: { [key: string]: any } = {};

              // Extract key-value pairs where values are not arrays or objects
              const simplifiedObject = Object.entries(originalObject).reduce((acc, [key, value]) => {
                if (!Array.isArray(value) && typeof value !== 'object') {
                  acc[key] = value;
                }
                return acc;
              }, acc);

              return simplifiedObject;
            });
            logger.info("SimplifiedData for sheet : " + JSON.stringify(simplifiedData))
            const ws = XLSX.utils.json_to_sheet(simplifiedData);

            // Create a new workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
            const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
            const formData = new FormData();
            formData.append('file', buffer, 'filename.xlsx');
            formData.append('tenantId', request?.body?.RequestInfo?.userInfo?.tenantId);
            formData.append('module', 'pgr');

            try {
              var fileCreationResult;
              try {
                logger.info("File uploading url : " + config.host.filestore + config.paths.filestore);
                fileCreationResult = await httpRequest(config.host.filestore + config.paths.filestore, formData, undefined, undefined, undefined,
                  {
                    'Content-Type': 'multipart/form-data',
                    'auth-token': request?.body?.RequestInfo?.authToken
                  }
                );
              } catch (error: any) {
                logger.error("File Creation Error : " + JSON.stringify(error));
                return errorResponder(
                  { message: error?.response?.data?.Errors[0]?.message },
                  request,
                  response
                );
              }
              const responseData = fileCreationResult?.files;
              logger.info("Response data after File Creation : " + JSON.stringify(responseData));
              if (Array.isArray(responseData) && responseData.length > 0) {
                Job.ingestionDetails.history.push({ fileStoreId: responseData[0].fileStoreId, tenantId: responseData[0].tenantId, state: "not-started", type: "xlsx", ingestionType: parsingTemplate.ingestionType });
              }
            } catch (error: any) {
              return errorResponder(
                { message: "Error in creating FileStoreId" },
                request,
                response
              );
            }
          }
        }
      } catch (e: any) {
        logger.error(String(e))
        return errorResponder({ message: String(e) + "    Check Logs" }, request, response);
      }
    } catch (e: any) {
      return errorResponder({ message: e?.response?.data?.Errors[0].message }, request, response);
    }
    Job.ingestionDetails.userInfo = request?.body?.RequestInfo?.userInfo;
    Job.ingestionDetails.campaignDetails = campaignDetails;
    const updatedJob: any = await produceIngestion({ Job });
    return sendResponse(
      response,
      { Job: updatedJob },
      request
    );
  };
}

// Export the MeasurementController class
export default BulkUploadController;