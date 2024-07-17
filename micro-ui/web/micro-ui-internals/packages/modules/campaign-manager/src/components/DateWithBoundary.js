import React, { useState, useEffect, Fragment, useReducer } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { LabelFieldPair, Header } from "@egovernments/digit-ui-react-components";
import { Button, Card, Dropdown, MultiSelectDropdown } from "@egovernments/digit-ui-components";
import BoundaryWithDate from "./BoundaryWithDate";

const initialState = (projectData) => {
  return projectData;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "RELOAD":
      return initialState(action.projectData);
      break;
    case "START_DATE":
      return state.map((item, index) => {
        if (item?.id === action?.item?.id) {
          return {
            ...item,
            startDate: Digit.Utils.pt.convertDateToEpoch(action?.date, "dayStart"),
          };
        }
        return item;
      });
      break;
    case "END_DATE":
      return state.map((item, index) => {
        if (item?.id === action?.item?.id) {
          return {
            ...item,
            endDate: Digit.Utils.pt.convertDateToEpoch(action?.date),
          };
        }
        return item;
      });
      break;
    case "CYCLE_START_DATE":
      const cycleStartRemap = action?.cycles?.map((item, index) => {
        if (item?.id === action?.cycleIndex) {
          return {
            ...item,
            startDate: Digit.Utils.pt.convertDateToEpoch(action?.date, "dayStart"),
          };
        }
        return item;
      });
      return state?.map((item, index) => {
        if (item?.id === action?.item?.id) {
          return {
            ...item,
            additionalDetails: {
              ...item?.additionalDetails,
              projectType: {
                ...item?.additionalDetails?.projectType,
                cycles: cycleStartRemap,
              },
            },
          };
        }
        return item;
      });
      break;
    case "CYCYLE_END_DATE":
      const cycleEndRemap = action?.cycles?.map((item, index) => {
        if (item?.id === action?.cycleIndex) {
          return {
            ...item,
            endDate: Digit.Utils.pt.convertDateToEpoch(action?.date),
          };
        }
        return item;
      });
      return state?.map((item, index) => {
        if (item?.id === action?.item?.id) {
          return {
            ...item,
            additionalDetails: {
              ...item?.additionalDetails,
              projectType: {
                ...item?.additionalDetails?.projectType,
                cycles: cycleEndRemap,
              },
            },
          };
        }
        return item;
      });
      break;
    default:
      return state;
      break;
  }
};

const DateWithBoundary = ({ onSelect, formData, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const { state } = useLocation();
  const historyState = window.history.state;
  const [selectedBoundaries, setSelectedBoundaries] = useState(null);
  const { data: BOUNDARY_HIERARCHY_TYPE } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-ADMIN-CONSOLE", [{ name: "hierarchyConfig" }], {
    select: (data) => {
      return data?.["HCM-ADMIN-CONSOLE"]?.hierarchyConfig?.find((item) => item.isActive)?.hierarchy;
    },
  });
  const [hierarchyTypeDataresult, setHierarchyTypeDataresult] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [filteredBoundaries, setFilteredBoundaries] = useState([]);
  const [targetBoundary, setTargetBoundary] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [dateReducer, dateReducerDispatch] = useReducer(reducer, initialState(projectData));

  useEffect(() => {
    onSelect("dateWithBoundary", dateReducer);
  }, [dateReducer]);
  useEffect(() => {
    if (projectData) {
      dateReducerDispatch({
        type: "RELOAD",
        projectData: projectData,
      });
    }
  }, [projectData]);

  const reqCriteria = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    changeQueryName: `${BOUNDARY_HIERARCHY_TYPE}`,
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: tenantId,
        limit: 2,
        offset: 0,
        hierarchyType: BOUNDARY_HIERARCHY_TYPE,
      },
    },
    config: {
      enabled: !!BOUNDARY_HIERARCHY_TYPE,
      select: (data) => {
        return data?.BoundaryHierarchy?.[0];
      },
    },
  };
  const { data: hierarchyDefinition } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  //hierarchy level
  useEffect(() => {
    if (hierarchyDefinition) {
      const sortHierarchy = (hierarchy) => {
        const boundaryMap = new Map();
        hierarchy.forEach((item) => {
          boundaryMap.set(item.boundaryType, item);
        });

        const sortedHierarchy = [];
        let currentType = null;

        while (sortedHierarchy.length < hierarchy.length) {
          for (let i = 0; i < hierarchy.length; i++) {
            if (hierarchy[i].parentBoundaryType === currentType) {
              sortedHierarchy.push(hierarchy[i]);
              currentType = hierarchy[i].boundaryType;
              break;
            }
          }
        }

        return sortedHierarchy;
      };

      const sortedHierarchy = sortHierarchy(hierarchyDefinition.boundaryHierarchy);
      const sortedHierarchyWithLocale = sortedHierarchy.map((i) => {
        return {
          ...i,
          i18nKey: BOUNDARY_HIERARCHY_TYPE + "_" + i?.boundaryType,
        };
      });
      setHierarchyTypeDataresult(sortedHierarchyWithLocale);
    }
  }, [hierarchyDefinition]);

  useEffect(() => {
    if (state?.data) {
      setSelectedBoundaries(state?.data?.boundaries);
    } else if (historyState?.data) {
      setSelectedBoundaries(historyState?.data?.boundaries);
    }
  }, [state?.data, historyState?.data]);

  useEffect(() => {
    if (selectedLevel) {
      setFilteredBoundaries(selectedBoundaries?.filter((i) => i.type === selectedLevel?.boundaryType));
    }
  }, [selectedLevel]);

  const handleBoundaryChange = (data) => {
    let res = [];
    data.map((arg) => {
      res.push(arg[1]);
    });
    setTargetBoundary(res);
  };

  const selectBoundary = async () => {
    const temp = await Digit.Hooks.campaign.useProjectSearchWithBoundary({
      name: state?.name ? state.name : historyState?.name,
      tenantId: tenantId,
      boundaries: targetBoundary,
    });
    setProjectData(temp);
  };

  return (
    <>
      <Card className={"campaign-update-container"}>
        <Header className="header">{t(`HCM_CAMPAIGN_DATES_CHANGE_BOUNDARY_HEADER`)}</Header>
        <Card className={"search-field-container"}>
          <p className="field-description">{t(`HCM_CAMPAIGN_DATES_CHANGE_BOUNDARY_SUB_TEXT`)}</p>
          <div className="label-field-grid">
            <LabelFieldPair className="update-date-labelField">
              <div className="update-label">
                <p>{t(`HCM_CAMPAIGN_SELECT_BOUNDARY_HIERARCHY_LEVEL`)}</p>
                <span className="mandatory-date">*</span>
              </div>
              <div className="update-field">
                <Dropdown
                  style={{ width: "20rem" }}
                  variant={""}
                  t={t}
                  option={hierarchyTypeDataresult}
                  optionKey={"i18nKey"}
                  selected={selectedLevel}
                  select={(value) => {
                    setSelectedLevel(value);
                    setTargetBoundary([]);
                  }}
                />
              </div>
            </LabelFieldPair>
            <LabelFieldPair className="update-date-labelField" style={{ display: "grid", gridTemplateColumns: "1fr", alignItems: "start" }}>
              <div className="update-label">
                <p>{t(`HCM_CAMPAIGN_SELECT_BOUNDARY_DATA_LABEL`)}</p>
                <span className="mandatory-date">*</span>
              </div>
              <div className="update-field">
                <MultiSelectDropdown
                  props={{ className: "select-boundaries-target" }}
                  t={t}
                  options={filteredBoundaries || []}
                  optionsKey={"code"}
                  selected={targetBoundary || []}
                  onSelect={(value) => handleBoundaryChange(value)}
                />
              </div>
            </LabelFieldPair>
            <Button variation="primary" label={t(`CAMPAIGN_SELECT_BOUNDARY_BUTTON`)} onClick={() => selectBoundary()} />
          </div>
        </Card>
      </Card>
      {dateReducer?.length > 0 && dateReducer?.map((item, index) => <BoundaryWithDate project={item} dateReducerDispatch={dateReducerDispatch} />)}
    </>
  );
};

export default DateWithBoundary;