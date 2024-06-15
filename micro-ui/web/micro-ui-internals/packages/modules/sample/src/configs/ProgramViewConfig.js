import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const data = (program) => {
  const { t } = useTranslation();
//   const ancestor = project?.Project?.[0]?.ancestors;
//   const lastAncestor = ancestor?.length  > 0 ? ancestor[ancestor?.length - 1] : { projectNumber: "NA" };
//   const isLink = ancestor?.length > 0 ? true: false;

  return {
    cards: [
      {
        sections: [
          {
            type: "DATA",
            values: [
                {
                    key: "ID",
                    value: program.programs?.[0]?.id || "NA",
                  },
                  {
                    key: "TENANT_ID",
                    value: program.programs?.[0]?.tenantId || "NA",
                  },
                  {
                    key: "PROGRAM_CODE",
                    value: program.programs?.[0]?.programCode || "NA",
                  },
                  {
                    key: "PROGRAM_ID",
                    value: program.programs?.[0]?.programId || "NA",
                  },
                  {
                    key: "NAME",
                    value: program.programs?.[0]?.name || "NA",
                  },
                  {
                    key: "DESCRIPTION",
                    value: program.programs?.[0]?.description || "NA",
                  },
                  {
                    key: "START_DATE",
                    value: Digit.DateUtils.ConvertEpochToDate(program.programs?.[0]?.startDate) || "NA",
                  },
                  {
                    key: "END_DATE",
                    value: Digit.DateUtils.ConvertEpochToDate(program.programs?.[0]?.endDate) || "NA",
                  },
                  {
                    key: "STATUS_CODE",
                    value: program.programs?.[0]?.status?.statusCode || "NA",
                  },
                  {
                    key: "STATUS_MESSAGE",
                    value: program.programs?.[0]?.status?.statusMessage || "NA",
                  },
                  
              // {
              //   key: "WORKBENCH_PROJECT_PARENT_PROJECT_NUMBER",
              //   value: ancestor?.length > 0 ? ancestor[ancestor?.length - 1]?.projectNumber : "NA",
              //   isLink: ancestor?.length > 0 ? true : false,
              //   to: isLink? `campaign-view?tenantId=mz&projectNumber=${ancestor[ancestor?.length - 1].projectNumber}` : undefined
              // },
              // {
              //   key: "WORKBENCH_PROJECT_PRIMARY_TARGET_NO",
              //   value: project?.Project?.[0]?.targets?.[0]?.targetNo || "NA",
              // },
              // {
              //   key: "WORKBENCH_PROJECT_PRIMARY_TOTAL_NO",
              //   value: project?.Project?.[0]?.targets?.[0]?.totalNo || "NA",
              // },
              // {
              //   key: "WORKBENCH_PROJECT_BOUNDARY",
              //   value: project?.Project?.[0]?.address?.boundary || "NA",
              // },
              // {
              //   key: "WORKBENCH_PROJECT_BOUNDARY_TYPE",
              //   value: project?.Project?.[0]?.address?.boundaryType || "NA",
              // },
            ],
          },
        ],
      },
    //   {
    //     navigationKey: "card2",
    //     sections: [
    //       {
    //         navigationKey: "card2",
    //         type: "COMPONENT",
    //         component: "ProjectBeneficiaryComponent",
    //         props: { projectId: project?.Project?.[0]?.id },
    //       },
    //     ],
    //   },
    //   {
    //     navigationKey: "card1",
    //     sections: [
    //       {
    //         navigationKey: "card1",

    //         type: "COMPONENT",
    //         component: "ProjectStaffComponent",
    //         props: { projectId: project?.Project?.[0]?.id, ...project },
    //       },
    //     ],
    //   },
    //   {
    //     navigationKey: "card3",
    //     sections: [
    //       {
    //         navigationKey: "card3",

    //         type: "COMPONENT",
    //         component: "ProjectChildrenComponent",
    //         props: { projectId: project?.Project?.[0]?.id, ...project },
    //       },
    //     ],
    //   },
    //   {
    //     navigationKey: "card4",
    //     sections: [
    //       {
    //         navigationKey: "card4",

    //         type: "COMPONENT",
    //         component: "FacilityComponent",
    //         props: { projectId: project?.Project?.[0]?.id },
    //       },
    //     ],
    //   },
    //   {
    //     navigationKey: "card5",
    //     sections: [
    //       {
    //         navigationKey: "card5",

    //         type: "COMPONENT",
    //         component: "TargetComponent",
    //         props: { targets: project?.Project?.[0]?.targets, project: project?.Project?.[0] },
    //       },
    //     ],
    //   },
    ],
    apiResponse: {},
    additionalDetails: {},
  };
};
