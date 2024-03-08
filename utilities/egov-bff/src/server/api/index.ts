import * as XLSX from 'xlsx';
import config from "../config";
import FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';
import { httpRequest } from "../utils/request";
import { logger } from "../utils/logger";
import { convertToFacilityCreateData, convertToFacilityExsistingData, correctParentValues, sortCampaignDetails } from "../utils/index";
import { validateFacilityCreateData, validateFacilityData, validateFacilityDataWithCode, validateFacilityViaSearch, validateProjectFacilityResponse, validateProjectResourceResponse, validateStaffResponse, validatedProjectResponseAndUpdateId } from "../utils/validator";
const _ = require('lodash');







async function getWorkbook(fileUrl: string) {

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/pdf',
  };

  logger.info("FileUrl : " + fileUrl);

  const responseFile = await httpRequest(fileUrl, null, {}, 'get', 'arraybuffer', headers);

  // Convert ArrayBuffer directly to Buffer
  const fileBuffer = Buffer.from(responseFile);

  // Assuming the response is a binary file, adjust the type accordingly
  const fileXlsx = fileBuffer;

  const arrayBuffer = await fileXlsx.buffer.slice(fileXlsx.byteOffset, fileXlsx.byteOffset + fileXlsx.length);
  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: 'array' });

  return workbook;

}


const getSheetData = async (fileUrl: string, sheetName: string) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/pdf',
  };

  const responseFile = await httpRequest(fileUrl, null, {}, 'get', 'arraybuffer', headers);
  const workbook = XLSX.read(responseFile, { type: 'buffer' });

  // Check if the specified sheet exists in the workbook
  if (!workbook.Sheets.hasOwnProperty(sheetName)) {
    throw new Error(`Sheet with name "${sheetName}" is not present in the file.`);
  }

  const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  const jsonData = sheetData.map((row: any) => {
    const rowData: any = {};
    Object.keys(row).forEach(key => {
      rowData[key] = row[key] === undefined || row[key] === '' ? null : row[key];
    });
    return rowData;
  });
  logger.info("Sheet Data : " + JSON.stringify(jsonData))
  return jsonData;
};




const searchMDMS: any = async (uniqueIdentifiers: any[], schemaCode: string, requestinfo: any, response: any) => {
  if (!uniqueIdentifiers) {
    return;
  }
  const apiUrl = config.host.mdms + config.paths.mdms_search;
  logger.info("Mdms url : " + apiUrl)
  const data = {
    "MdmsCriteria": {
      "tenantId": requestinfo?.userInfo?.tenantId,
      "uniqueIdentifiers": uniqueIdentifiers,
      "schemaCode": schemaCode
    },
    "RequestInfo": requestinfo
  }
  try {
    const result = await httpRequest(apiUrl, data, undefined, undefined, undefined, undefined);
    logger.info("Template search Result : " + JSON.stringify(result))
    return result;
  } catch (error: any) {
    logger.error("Error: " + error)
    return error?.response?.data?.Errors[0].message;
  }

}


const getCampaignNumber: any = async (requestBody: any, idFormat: String, idName: string) => {
  const data = {
    RequestInfo: requestBody?.RequestInfo,
    "idRequests": [
      {
        "idName": idName,
        "tenantId": requestBody?.HCMConfig?.tenantId,
        "format": idFormat
      }
    ]
  }
  const idGenUrl = config.host.idGenHost + config.paths.idGen;
  logger.info("IdGen url : " + idGenUrl)
  logger.info("Idgen Request : " + JSON.stringify(data))
  try {
    const result = await httpRequest(idGenUrl, data, undefined, undefined, undefined, undefined);
    if (result?.idResponses?.[0]?.id) {
      return result?.idResponses?.[0]?.id;
    }
    return result;
  } catch (error: any) {
    logger.error("Error: " + error)
    return error;
  }

}

const getCampaignNumberForCampaignController: any = async (requestBody: any, idFormat: String, idName: string) => {
  const data = {
    RequestInfo: requestBody?.RequestInfo,
    "idRequests": [
      {
        "idName": idName,
        "tenantId": requestBody?.Campaign?.tenantId,
        "format": idFormat
      }
    ]
  }
  const idGenUrl = config.host.idGenHost + config.paths.idGen;
  logger.info("IdGen url : " + idGenUrl)
  logger.info("Idgen Request : " + JSON.stringify(data))
  try {
    const result = await httpRequest(idGenUrl, data, undefined, undefined, undefined, undefined);
    if (result?.idResponses?.[0]?.id) {
      return result?.idResponses?.[0]?.id;
    }
    return result;
  } catch (error: any) {
    logger.error("Error: " + error)
    return error;
  }

}

const getResouceNumber: any = async (RequestInfo: any, idFormat: String, idName: string) => {
  const data = {
    RequestInfo,
    "idRequests": [
      {
        "idName": idName,
        "tenantId": RequestInfo?.userInfo?.tenantId,
        "format": idFormat
      }
    ]
  }
  const idGenUrl = config.host.idGenHost + config.paths.idGen;
  logger.info("IdGen url : " + idGenUrl)
  logger.info("Idgen Request : " + JSON.stringify(data))
  try {
    const result = await httpRequest(idGenUrl, data, undefined, undefined, undefined, undefined);
    if (result?.idResponses?.[0]?.id) {
      return result?.idResponses?.[0]?.id;
    }
    return result;
  } catch (error: any) {
    logger.error("Error: " + error)
    return error;
  }

}

const getSchema: any = async (code: string, RequestInfo: any) => {
  const data = {
    RequestInfo,
    SchemaDefCriteria: {
      "tenantId": RequestInfo?.userInfo?.tenantId,
      "limit": 200,
      "codes": [
        code
      ]
    }
  }
  const mdmsSearchUrl = config.host.mdms + config.paths.mdmsSchema;
  logger.info("Schema search url : " + mdmsSearchUrl)
  logger.info("Schema search Request : " + JSON.stringify(data))
  try {
    const result = await httpRequest(mdmsSearchUrl, data, undefined, undefined, undefined, undefined);
    return result?.SchemaDefinitions?.[0]?.definition;
  } catch (error: any) {
    logger.error("Error: " + error)
    return error;
  }

}



const getCount: any = async (responseData: any, request: any, response: any) => {
  try {
    const host = responseData?.host;
    const url = responseData?.searchConfig?.countUrl;
    const requestInfo = { "RequestInfo": request?.body?.RequestInfo }
    const result = await httpRequest(host + url, requestInfo, undefined, undefined, undefined, undefined);
    const count = _.get(result, responseData?.searchConfig?.countPath);
    return count;
  } catch (error: any) {
    logger.error("Error: " + error)
    throw error;
  }

}

async function createAndUploadFile(updatedWorkbook: XLSX.WorkBook, request: any) {
  const buffer = XLSX.write(updatedWorkbook, { bookType: 'xlsx', type: 'buffer' });
  const formData = new FormData();
  formData.append('file', buffer, 'filename.xlsx');
  formData.append('tenantId', request?.body?.RequestInfo?.userInfo?.tenantId);
  formData.append('module', 'pgr');

  logger.info("File uploading url : " + config.host.filestore + config.paths.filestore);
  var fileCreationResult = await httpRequest(config.host.filestore + config.paths.filestore, formData, undefined, undefined, undefined,
    {
      'Content-Type': 'multipart/form-data',
      'auth-token': request?.body?.RequestInfo?.authToken
    }
  );
  const responseData = fileCreationResult?.files;
  return responseData;
}

function generateHierarchyList(data: any[], parentChain: any = []) {
  let result: any[] = [];

  // Iterate over each boundary in the current level
  for (let boundary of data) {
    let currentChain = [...parentChain, boundary.code];

    // Add the current chain to the result
    result.push(currentChain.join(','));

    // If there are children, recursively call the function
    if (boundary.children.length > 0) {
      let childResults = generateHierarchyList(boundary.children, currentChain);
      result = result.concat(childResults);
    }
  }
  return result;

}

function generateHierarchy(boundaries: any[]) {
  // Create an object to store boundary types and their parents
  const parentMap: any = {};

  // Populate the object with boundary types and their parents
  for (const boundary of boundaries) {
    parentMap[boundary.boundaryType] = boundary.parentBoundaryType;
  }

  // Traverse the hierarchy to generate the hierarchy list
  const hierarchyList = [];
  for (const boundaryType in parentMap) {
    if (Object.prototype.hasOwnProperty.call(parentMap, boundaryType)) {
      const parentBoundaryType = parentMap[boundaryType];
      if (parentBoundaryType === null) {
        // This boundary type has no parent, add it to the hierarchy list
        hierarchyList.push(boundaryType);
        // Traverse its children recursively
        traverseChildren(boundaryType, parentMap, hierarchyList);
      }
    }
  }
  return hierarchyList;
}

function traverseChildren(parent: any, parentMap: any, hierarchyList: any[]) {
  for (const boundaryType in parentMap) {
    if (Object.prototype.hasOwnProperty.call(parentMap, boundaryType)) {
      const parentBoundaryType = parentMap[boundaryType];
      if (parentBoundaryType === parent) {
        // This boundary type has the current parent, add it to the hierarchy list
        hierarchyList.push(boundaryType);
        // Traverse its children recursively
        traverseChildren(boundaryType, parentMap, hierarchyList);
      }
    }
  }
}

const getHierarchy = async (request: any) => {
  const url = `${config.host.boundaryHost}${config.paths.boundaryHierarchy}`;

  // Create request body
  const requestBody = {
    "RequestInfo": request?.body?.RequestInfo,
    "BoundaryTypeHierarchySearchCriteria": {
      "tenantId": request?.body?.Filters?.tenantId,
      "limit": 5,
      "offset": 0,
      "hierarchyType": request?.body?.Filters?.hierarchyType
    }
  };

  try {
    const response = await httpRequest(url, requestBody);
    const boundaryList = response?.BoundaryHierarchy?.[0].boundaryHierarchy;
    return generateHierarchy(boundaryList);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};



async function createExcelSheet(data: any, headers: any, sheetName: string = 'Sheet1') {
  const workbook = XLSX.utils.book_new();
  const sheetData = [headers, ...data];
  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Define column widths (in pixels)
  const columnWidths = headers.map(() => ({ width: 30 }));

  // Apply column widths to the sheet
  ws['!cols'] = columnWidths;

  XLSX.utils.book_append_sheet(workbook, ws, sheetName);
  return { wb: workbook, ws: ws, sheetName: sheetName };
}


function getBoundaryCodes(boundaryList: any) {
  const childParentMap: Map<string, string> = new Map();
  for (let i = 1; i < boundaryList.length; i++) {
    const child = boundaryList[i][boundaryList[i].length - 1]; // Last element is the child
    const parent = boundaryList[i][boundaryList[i].length - 2]; // Second last element is the parent
    childParentMap.set(child, parent);
  }
  const columnsData: string[][] = [];
  for (const row of boundaryList) {
    row.forEach((element: any, index: any) => {
      if (!columnsData[index]) {
        columnsData[index] = [];
      }
      if (!columnsData[index].includes(element)) {
        columnsData[index].push(element);
      }
    });
  }

  const elementSet = new Set<string>();
  columnsData.forEach(column => {
    column.forEach(element => {
      elementSet.add(element);
    });
  });
  let countMap = new Map();
  const elementCodesMap = new Map();
  elementCodesMap.set("IN", "ADMIN_IN");
  let parentCode; // Default parent code
  for (let i = 1; i < columnsData.length; i++) {
    const column = columnsData[i];
    for (const element of column) {
      parentCode = childParentMap.get(element)!; // Update parent code for the next element
      if (elementSet.has(parentCode)) {
        if (countMap.has(parentCode)) {
          countMap.set(parentCode, countMap.get(parentCode)! + 1);
        } else {
          countMap.set(parentCode, 1);
        }
      }
      let code;
      if (parentCode != 'IN') {
        let parentBoundaryCodeTrimmed;
        const parentBoundaryCode = elementCodesMap.get(parentCode);
        const lastUnderscoreIndex = parentBoundaryCode.lastIndexOf('_');
        if (lastUnderscoreIndex !== -1) {
          parentBoundaryCodeTrimmed = parentBoundaryCode.substring(0, lastUnderscoreIndex);
        }
        code = generateElementCode(countMap.get(parentCode), parentBoundaryCodeTrimmed, element); // Generate code for the element
      } else {
        code = generateElementCode(countMap.get(parentCode), elementCodesMap.get(parentCode), element);
      }// Generate code for the element
      elementCodesMap.set(element, code); // Store the code of the element in the map
    }
  }
}

function generateElementCode(sequence: any, parentCode: any, element: any) {
  let paddedSequence = sequence.toString().padStart(2, '0'); // Pad single-digit numbers with leading zero
  return parentCode + '_' + paddedSequence + '_' + element;
}

async function getBoundarySheetData(request: any) {
  const url = `${config.host.boundaryHost}${config.paths.boundaryRelationship}`;
  const params = request?.body?.Filters;
  const boundaryType = request?.body?.Filters?.boundaryType;
  const response = await httpRequest(url, request.body, params);
  const data = response?.TenantBoundary?.[0]?.boundary;
  if (data) {
    const boundaryList = generateHierarchyList(data)
    const newArray = boundaryList.map(item => item.split(','))
    getBoundaryCodes(newArray);
    if (Array.isArray(boundaryList) && boundaryList.length > 0) {
      const boundaryCodes = boundaryList.map(boundary => boundary.split(',').pop());
      const string = boundaryCodes.join(', ');
      const boundaryResponse = await httpRequest(config.host.boundaryHost + config.paths.boundaryServiceSearch, request.body, { tenantId: "pg", codes: string });

      const mp: { [key: string]: string } = {};
      boundaryResponse?.Boundary?.forEach((data: any) => {
        mp[data?.code] = data?.additionalDetails?.name;
      });

      const hierarchy = await getHierarchy(request);
      const startIndex = boundaryType ? hierarchy.indexOf(boundaryType) : -1;
      const reducedHierarchy = startIndex !== -1 ? hierarchy.slice(startIndex) : hierarchy;
      const headers = [...reducedHierarchy, "Boundary Code", "Target at the Selected Boundary level", "Start Date of Campaign (Optional Field)", "End Date of Campaign (Optional Field)"];
      const data = boundaryList.map(boundary => {
        const boundaryParts = boundary.split(',');
        const boundaryCode = boundaryParts[boundaryParts.length - 1];
        const rowData = boundaryParts.concat(Array(Math.max(0, reducedHierarchy.length - boundaryParts.length)).fill(''));
        const mappedRowData = rowData.map((cell: any, index: number) =>
          index === reducedHierarchy.length ? '' : cell !== '' ? mp[cell] || cell : ''
        );
        const boundaryCodeIndex = reducedHierarchy.length;
        mappedRowData[boundaryCodeIndex] = boundaryCode;
        return mappedRowData;
      });
      return await createExcelSheet(data, headers);
    }
  }
  return { wb: null, ws: null, sheetName: null }; // Return null if no data found
}




async function updateFile(fileStoreId: any, finalResponse: any, sheetName: any, request: any) {
  try {
    const fileUrl = `${config.host.filestore}${config.paths.filestore}/url?tenantId=${request?.body?.RequestInfo?.userInfo?.tenantId}&fileStoreIds=${fileStoreId}`;
    const response = await httpRequest(fileUrl, undefined, undefined, 'get');

    if (response?.fileStoreIds.length === 0) {
      throw new Error("No file found with the provided file store ID");
    }

    for (const file of response.fileStoreIds) {
      try {
        const workbook = await getWorkbook(file.url);
        const desiredSheet: any = workbook.Sheets[sheetName || workbook.SheetNames[0]];

        if (desiredSheet) {
          const range = XLSX.utils.decode_range(desiredSheet['!ref']);
          const emptyColumnIndex = range.e.c + 1;
          const statusColumn = String.fromCharCode(65 + emptyColumnIndex); // Get next column letter

          // Add header for status column
          desiredSheet[statusColumn + '1'] = { v: '#status#', t: 's', r: '<t xml:space="preserve">#status#</t>', h: '#status#', w: '#status#' };

          // Populate status values for affected rows
          const activities = finalResponse?.Activities || [];
          activities.forEach((activity: any) => {
            activity.affectedRows.forEach((row: any) => {
              const rowIndex = row - 1; // Adjust for zero-based 
              desiredSheet[statusColumn + (rowIndex + 1)] = { v: activity.status, t: 's', r: `<t xml:space="preserve">${activity.status}</t>`, h: activity.status, w: activity.status }; // Adjust row index and add status value
            });
          });

          // Update range
          desiredSheet['!ref'] = desiredSheet['!ref'].replace(/:[A-Z]+/, ':' + statusColumn);
          workbook.Sheets[sheetName] = desiredSheet;

          // Call the function to create and upload the file with the updated sheet
          const responseData = await createAndUploadFile(workbook, request);
          logger.info('File updated successfully:' + JSON.stringify(responseData));
          if (responseData?.[0]?.fileStoreId) {
            const statusFileStoreId = responseData?.[0]?.fileStoreId;

            // Update finalResponse.ResponseDetails with statusFileStoreId
            finalResponse.ResponseDetails.forEach((detail: any) => {
              detail.statusFileStoreId = statusFileStoreId;
            });
          }
          else {
            throw new Error("Error in Creatring Status File");
          }

        }

      } catch (error) {
        logger.error('Error processing file:' + error);
      }
    }
  } catch (error) {
    logger.error('Error fetching file information:' + JSON.stringify(error));
  }
}


async function createProjectAndUpdateId(projectBody: any, boundaryProjectIdMapping: any, boundaryCode: any, campaignDetails: any) {
  const projectCreateUrl = `${config.host.projectHost}` + `${config.paths.projectCreate}`
  logger.info("Project Creation url " + projectCreateUrl)
  logger.info("Project Creation body " + JSON.stringify(projectBody))
  const projectResponse = await httpRequest(projectCreateUrl, projectBody, undefined, "post", undefined, undefined);
  logger.info("Project Creation response" + JSON.stringify(projectResponse))
  validatedProjectResponseAndUpdateId(projectResponse, projectBody, campaignDetails);
  boundaryProjectIdMapping[boundaryCode] = projectResponse?.Project[0]?.id
  await new Promise(resolve => setTimeout(resolve, 10000));
}

async function createProjectIfNotExists(requestBody: any) {
  const { projectType, tenantId } = requestBody?.Campaign
  sortCampaignDetails(requestBody?.Campaign?.CampaignDetails)
  correctParentValues(requestBody?.Campaign?.CampaignDetails)
  var boundaryProjectIdMapping: any = {};
  for (const campaignDetails of requestBody?.Campaign?.CampaignDetails) {
    const projectBody: any = {
      RequestInfo: requestBody.RequestInfo,
      Projects: []
    }
    var { projectId, startDate, endDate, boundaryCode, boundaryType, parentBoundaryCode, description, department, referenceID, projectSubType, isTaskEnabled = true, documents = [], rowVersion = 0 } = campaignDetails;
    const address = {
      tenantId,
      boundary: boundaryCode,
      boundaryType
    }
    startDate = parseInt(startDate);
    endDate = parseInt(endDate);
    if (!projectId) {
      projectBody.Projects.push({
        tenantId, parent: boundaryProjectIdMapping[parentBoundaryCode] || null, address, description, department, referenceID, projectSubType, projectType, startDate, endDate, isTaskEnabled, documents, rowVersion
      })
      await createProjectAndUpdateId(projectBody, boundaryProjectIdMapping, boundaryCode, campaignDetails)
    }
  }
}

async function createStaff(resouceBody: any) {
  const staffCreateUrl = `${config.host.projectHost}` + `${config.paths.staffCreate}`
  logger.info("Staff Creation url " + staffCreateUrl)
  logger.info("Staff Creation body " + JSON.stringify(resouceBody))
  const staffResponse = await httpRequest(staffCreateUrl, resouceBody, undefined, "post", undefined, undefined);
  logger.info("Staff Creation response" + JSON.stringify(staffResponse))
  validateStaffResponse(staffResponse);
}

async function createProjectResource(resouceBody: any) {
  const projectResourceCreateUrl = `${config.host.projectHost}` + `${config.paths.projectResourceCreate}`
  logger.info("Project Resource Creation url " + projectResourceCreateUrl)
  logger.info("Project Resource Creation body " + JSON.stringify(resouceBody))
  const projectResourceResponse = await httpRequest(projectResourceCreateUrl, resouceBody, undefined, "post", undefined, undefined);
  logger.info("Project Resource Creation response" + JSON.stringify(projectResourceResponse))
  validateProjectResourceResponse(projectResourceResponse);
}

async function createProjectFacility(resouceBody: any) {
  const projectFacilityCreateUrl = `${config.host.projectHost}` + `${config.paths.projectFacilityCreate}`
  logger.info("Project Facility Creation url " + projectFacilityCreateUrl)
  logger.info("Project Facility Creation body " + JSON.stringify(resouceBody))
  const projectFacilityResponse = await httpRequest(projectFacilityCreateUrl, resouceBody, undefined, "post", undefined, undefined);
  logger.info("Project Facility Creation response" + JSON.stringify(projectFacilityResponse))
  validateProjectFacilityResponse(projectFacilityResponse);
}
async function createRelatedEntity(resources: any, tenantId: any, projectId: any, startDate: any, endDate: any, resouceBody: any) {
  for (const resource of resources) {
    const type = resource?.type
    for (const resourceId of resource?.resourceIds) {
      if (type == "staff") {
        const ProjectStaff = {
          // FIXME : Tenant Id should not be splitted
          tenantId: tenantId.split('.')?.[0],
          projectId,
          userId: resourceId,
          startDate,
          endDate
        }
        resouceBody.ProjectStaff = ProjectStaff
        await createStaff(resouceBody)
      }
      else if (type == "resource") {
        const ProjectResource = {
          // FIXME : Tenant Id should not be splitted
          tenantId: tenantId.split('.')?.[0],
          projectId,
          resource: {
            productVariantId: resourceId,
            type: "DRUG",
            "isBaseUnitVariant": false
          },
          startDate,
          endDate
        }
        resouceBody.ProjectResource = ProjectResource
        await createProjectResource(resouceBody)
      }
      else if (type == "facility") {
        const ProjectFacility = {
          // FIXME : Tenant Id should not be splitted
          tenantId: tenantId.split('.')?.[0],
          projectId,
          facilityId: resourceId
        }
        resouceBody.ProjectFacility = ProjectFacility
        await createProjectFacility(resouceBody)
      }
    }
  }
}

async function createRelatedResouce(requestBody: any) {
  const { tenantId } = requestBody?.Campaign

  for (const campaignDetails of requestBody?.Campaign?.CampaignDetails) {
    const resouceBody: any = {
      RequestInfo: requestBody.RequestInfo,
    }
    var { projectId, startDate, endDate, resources } = campaignDetails;
    startDate = parseInt(startDate);
    endDate = parseInt(endDate);
    await createRelatedEntity(resources, tenantId, projectId, startDate, endDate, resouceBody);
  }
}

async function enrichCampaign(requestBody: any) {
  if (requestBody?.Campaign) {
    requestBody.Campaign.id = uuidv4();
    requestBody.Campaign.campaignNo = await getCampaignNumberForCampaignController(requestBody, config.values.idgen.format, config.values.idgen.idName)
    for (const campaignDetails of requestBody?.Campaign?.CampaignDetails) {
      campaignDetails.id = uuidv4();
    }
  }
}

async function getAllFacilitiesInLoop(searchedFacilities: any[], facilitySearchParams: any, facilitySearchBody: any) {
  await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds
  logger.info("facilitySearchParams : " + JSON.stringify(facilitySearchParams));
  const response = await httpRequest(config.host.facilityHost + config.paths.facilitySearch, facilitySearchBody, facilitySearchParams);

  if (Array.isArray(response?.Facilities)) {
    searchedFacilities.push(...response?.Facilities);
    return response.Facilities.length >= 50; // Return true if there are more facilities to fetch, false otherwise
  } else {
    throw new Error("Search failed for Facility. Check Logs");
  }
}

async function getAllFacilities(tenantId: string, requestBody: any) {
  const facilitySearchBody = {
    RequestInfo: requestBody?.RequestInfo,
    Facility: {}
  };

  const facilitySearchParams = {
    limit: 50,
    offset: 0,
    tenantId: tenantId?.split('.')?.[0]
  };

  logger.info("Facility search url : " + config.host.facilityHost + config.paths.facilitySearch);
  logger.info("facilitySearchBody : " + JSON.stringify(facilitySearchBody));
  const searchedFacilities: any[] = [];
  let searchAgain = true;

  while (searchAgain) {
    searchAgain = await getAllFacilitiesInLoop(searchedFacilities, facilitySearchParams, facilitySearchBody);
    facilitySearchParams.offset += 50;
  }

  return searchedFacilities;
}

async function getFacilitiesViaIds(tenantId: string, ids: any[], requestBody: any) {
  const facilitySearchBody: any = {
    RequestInfo: requestBody?.RequestInfo,
    Facility: {}
  };

  const facilitySearchParams = {
    limit: 50,
    offset: 0,
    tenantId: tenantId?.split('.')?.[0]
  };

  logger.info("Facility search url : " + config.host.facilityHost + config.paths.facilitySearch);
  const searchedFacilities: any[] = [];

  // Split ids into chunks of 50
  for (let i = 0; i < ids.length; i += 50) {
    const chunkIds = ids.slice(i, i + 50);
    facilitySearchBody.Facility.id = chunkIds;
    logger.info("facilitySearchBody : " + JSON.stringify(facilitySearchBody));
    await getAllFacilitiesInLoop(searchedFacilities, facilitySearchParams, facilitySearchBody);
  }

  return searchedFacilities;
}


async function processFacilityCreate(facilityCreateData: any[], request: any) {
  request.body.Facilities = facilityCreateData;
  logger.info("facility bulk create url : " + config.host.facilityHost + config.paths.facilityBulkCreate);
  const response = await httpRequest(config.host.facilityHost + config.paths.facilityBulkCreate, request.body);
  if (response?.status != "successful") {
    throw new Error("Error occured during facility create")
  }
}



async function createFacilityData(request: any) {
  const fileStoreId = request?.body?.ResourceDetails?.fileStoreId
  const tenantId = request?.body?.ResourceDetails?.tenantId
  const fileResponse = await httpRequest(config.host.filestore + config.paths.filestore + "/url", {}, { tenantId: tenantId, fileStoreIds: fileStoreId }, "get");
  if (!fileResponse?.fileStoreIds?.[0]?.url) {
    throw new Error("Not any download url returned for given fileStoreId")
  }
  const facilityData = await getSheetData(fileResponse?.fileStoreIds?.[0]?.url, "List of Available Facilities")
  validateFacilityData(facilityData)
  const facilityCreateData = convertToFacilityCreateData(facilityData, request?.body?.ResourceDetails?.tenantId)
  validateFacilityCreateData(facilityCreateData)
  await processFacilityCreate(facilityCreateData, request)
}

async function validateExistingFacilityData(request: any) {
  const fileStoreId = request?.body?.ResourceDetails?.fileStoreId
  const tenantId = request?.body?.ResourceDetails?.tenantId
  const fileResponse = await httpRequest(config.host.filestore + config.paths.filestore + "/url", {}, { tenantId: tenantId, fileStoreIds: fileStoreId }, "get");
  if (!fileResponse?.fileStoreIds?.[0]?.url) {
    throw new Error("Not any download url returned for given fileStoreId")
  }
  const facilityData = await getSheetData(fileResponse?.fileStoreIds?.[0]?.url, "List of Available Facilities")
  validateFacilityDataWithCode(facilityData)
  const facilityExsistingData = convertToFacilityExsistingData(facilityData)
  await validateFacilityViaSearch(tenantId, facilityExsistingData, request.body)
}



async function processAction(request: any) {
  if (request?.body?.ResourceDetails?.action == "create") {
    if (request?.body?.ResourceDetails?.type == "facility") {
      await createFacilityData(request)
    }
  }
  else {
    if (request?.body?.ResourceDetails?.type == "facility") {
      await validateExistingFacilityData(request)
    }
  }
}

export {
  getSheetData,
  searchMDMS,
  getCampaignNumber,
  getSchema,
  getResouceNumber,
  getCount,
  updateFile,
  getBoundarySheetData,
  createAndUploadFile,
  createProjectIfNotExists,
  createRelatedResouce,
  enrichCampaign,
  createExcelSheet,
  getAllFacilities,
  createFacilityData,
  processAction,
  getFacilitiesViaIds
};