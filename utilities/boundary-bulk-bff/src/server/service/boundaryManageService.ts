import express from "express";
import { logger } from "../utils/logger";
import { validateCreateBoundariesRequest, validateSearchBoundaryDetailRequest } from "../validators/boundaryValidator";
import { getLocalizedMessagesHandler } from "../utils/localisationUtils";
import { boundaryBulkUpload, getBoundaryDetails } from "../utils/boundaryUtils";
import { enrichAndPersistBoundaryDetails } from "../utils/persistUtils";

export async function createBoundariesService(request: express.Request, response: express.Response) {
    const localizationMap = await getLocalizedMessagesHandler(request, request?.query?.tenantId);

    // Validate the request for creating a project type campaign
    await validateCreateBoundariesRequest(request, localizationMap);
    enrichAndPersistBoundaryDetails(request);
    logger.info("VALIDATED THE BOUNDARY CREATE REQUEST");

    boundaryBulkUpload(request, localizationMap);
}

export async function searchBoundaryDetailService(request: express.Request) {
    validateSearchBoundaryDetailRequest(request);
    await getBoundaryDetails(request);
}