import { Button, Header } from "@egovernments/digit-ui-react-components";
import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DownloadIcon } from "@egovernments/digit-ui-react-components";
import BulkUpload from "./BulkUpload";
import Ajv from "ajv";
import XLSX from "xlsx";
import { InfoCard, Toast } from "@egovernments/digit-ui-components";
import { schemaConfig } from "../configs/schemaConfig";

/**
 * The `UploadData` function in JavaScript handles the uploading, validation, and management of files
 * for different types of data in a web application.
 * @returns The `UploadData` component is returning a JSX structure that includes a div with class
 * names, a Header component, a Button component for downloading a template, an info-text div, a
 * BulkUpload component for handling file uploads, and an InfoCard component for displaying error
 * messages if any validation errors occur during file upload.
 */
const UploadData = ({ formData, onSelect, ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [uploadedFile, setUploadedFile] = useState([]);
  const params = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_UPLOAD_ID")
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [errorsType, setErrorsType] = useState({});
  const [schema, setSchema] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const type = props?.props?.type;
  const [executionCount, setExecutionCount] = useState(0);

  useEffect(() => {
    if (type === "facilityWithBoundary") {
      onSelect("uploadFacility", uploadedFile);
    } else if (type === "boundary") {
      onSelect("uploadBoundary", uploadedFile);
    } else {
      onSelect("uploadUser", uploadedFile);
    }
  }, [uploadedFile]);

  // useEffect(() => {
  //   if(type === "boundary"){
  //     if (executionCount < 5) {
  //       onSelect("uploadBoundary", uploadedFile);
  //       setExecutionCount(prevCount => prevCount + 1);
  //     }
  //   }
  //   else if(type === "facilityWithBoundary"){
  //     if (executionCount < 5) {
  //       onSelect("uploadFacility", uploadedFile);
  //       setExecutionCount(prevCount => prevCount + 1);
  //     }
  //   }
  //   else{
  //     if (executionCount < 5) {
  //       onSelect("uploadUser", uploadedFile);
  //       setExecutionCount(prevCount => prevCount + 1);
  //     }
  //   }
  // });

  useEffect(() => {
    if (executionCount < 5) {
      let uploadType = "uploadUser";
      if (type === "boundary") {
        uploadType = "uploadBoundary";
      } else if (type === "facilityWithBoundary") {
        uploadType = "uploadFacility";
      }
      onSelect(uploadType, uploadedFile);
      setExecutionCount(prevCount => prevCount + 1);
    }
  }, [type, executionCount, onSelect, uploadedFile]);
  

  useEffect(() => {
    switch (type) {
      case "boundary":
        setUploadedFile(props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_BOUNDARY_DATA?.uploadBoundary || []);
        break;
      case "facilityWithBoundary":
        setUploadedFile(props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_FACILITY_DATA?.uploadFacility || []);
        break;
      default:
        setUploadedFile(props?.props?.sessionData?.HCM_CAMPAIGN_UPLOAD_USER_DATA?.uploadUser || []);
        break;
    }
  }, [type, props?.props?.sessionData]);

  useEffect(() => {
    if (errorsType[type]) {
      setShowInfoCard(true);
    } else {
      setShowInfoCard(false);
    }
  }, [type, errorsType]);

  const validateData = (data) => {
    const ajv = new Ajv(); // Initialize Ajv
    // const validate = ajv.compile(schema); // Compile schema
    let validate;
    if (type === 'facilityWithBoundary') {
      validate = ajv.compile(schemaConfig?.facilityWithBoundary);
    } else if (type === 'boundary') {
      validate = ajv.compile(schemaConfig?.Boundary);
    }
    else {
      validate = ajv.compile(schemaConfig?.User);
    }
    const errors = []; // Array to hold validation errors

    data.forEach((item, index) => {
      if (!validate(item)) {
        errors.push({ index: item?.["!row#number!"] + 1, errors: validate.errors });
      }
    });

    if (errors.length > 0) {
      const errorMessage = errors
        .map(({ index, errors }) => {
          const formattedErrors = errors.map((error) => {
            let formattedError = `${error.instancePath}: ${error.message}`;
            if (error.keyword === 'enum' && error.params && error.params.allowedValues) {
                formattedError += `. Allowed values are: ${error.params.allowedValues.join('/ ')}`;
            }
            return formattedError;
        }).join(', ');
        return `Data at row ${index}: ${formattedErrors}`;
        })
        .join(" , ");

      setErrorsType((prevErrors) => ({
        ...prevErrors,
        [type]: errorMessage,
      }));
      return false;
    } else {
      setErrorsType((prevErrors) => ({
        ...prevErrors,
        [type]: '' // Clear the error message
      }));
      setShowInfoCard(false);
      return true;
    }
  };

  const validateExcel = (selectedFile) => {
    return new Promise((resolve, reject) => {
      // Check if a file is selected
      if (!selectedFile) {
        reject(t("HCM_FILE_UPLOAD_ERROR"));
        return;
      }

      // Read the Excel file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const SheetNames = workbook.SheetNames[0];
          if (type === "boundary") {
            if (SheetNames !== "Boundary Data") {
              const errorMessage = t("HCM_INVALID_BOUNDARY_SHEET");
              setErrorsType((prevErrors) => ({
                ...prevErrors,
                [type]: errorMessage
              }));
              return ;
            }
          } else if (type === "facilityWithBoundary") {
            if (SheetNames !== "List of Available Facilities") {
              const errorMessage = t("HCM_INVALID_FACILITY_SHEET");
              setErrorsType((prevErrors) => ({
                ...prevErrors,
                [type]: errorMessage
              }));
              return ;
            }
          }else{
            if (SheetNames !== "Create List of Users") {
              const errorMessage = t("HCM_INVALID_USER_SHEET");
              setErrorsType((prevErrors) => ({
                ...prevErrors,
                [type]: errorMessage
              }));
              return ;
            }
          }
          
          const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { blankrows: true });
          var jsonData = sheetData.map((row, index) => {
            const rowData = {};
            if (Object.keys(row).length > 0) {
              Object.keys(row).forEach((key) => {
                rowData[key] = row[key] === undefined || row[key] === "" ? "" : row[key];
              });
              rowData["!row#number!"] = index + 1; // Adding row number
              return rowData;
            }
          });

          jsonData = jsonData.filter((element) => element !== undefined);

          if (validateData(jsonData, SheetNames)) {
            resolve(true);
          } else {
            setShowInfoCard(true);
          }
        } catch (error) {
          console.log("error", error);
          reject("HCM_FILE_UNAVAILABLE");
        }
      };

      reader.readAsArrayBuffer(selectedFile);
    });
  };

  const closeToast = () => {
    setShowToast(null);
  };
  useEffect(() => {
    if (showToast) {
      setTimeout(closeToast, 5000);
    }
  }, [showToast]);

  const onBulkUploadSubmit = async (file) => {
    if (file.length > 1) {
      setShowToast({ key: "error", label: t("HCM_ERROR_MORE_THAN_ONE_FILE") });
      return;
    }
    const module = "HCM";
    const { data: { files: fileStoreIds } = {} } = await Digit.UploadServices.MultipleFilesStorage(module, file, tenantId);
    const filesArray = [fileStoreIds?.[0]?.fileStoreId];
    const { data: { fileStoreIds: fileUrl } = {} } = await Digit.UploadServices.Filefetch(filesArray, tenantId);
    const fileData = fileUrl.map((i) => {
      const urlParts = i?.url?.split("/");
      const fileName = file?.[0]?.name;
      const fileType = type === "facilityWithBoundary" ? "facility" : type;
      return {
        ...i,
        fileName: fileName,
        type: fileType,
      };
    });
    setUploadedFile(fileData);
    const validate = await validateExcel(file[0]);
  };

  const onFileDelete = (file, index) => {
    setUploadedFile((prev) => prev.filter((i) => i.id !== file.id));
  };

  const onFileDownload = (file) => {
    // window.open(file?.url, "_blank", `name=${file?.fileName}`);
    if (file && file?.url) {
      window.location.href = file?.url;
    }
  };

  const Template = {
    url: "/project-factory/v1/data/_download",
    params: {
      tenantId: tenantId,
      type: type,
      forceUpdate: false,
      hierarchyType: params.hierarchyType,
      id: type === "boundary" ? params?.boundaryId : type === "facilityWithBoundary" ? params?.facilityId : params?.userId,
    },
  };
  const mutation = Digit.Hooks.useCustomAPIMutationHook(Template);

  const downloadTemplate = async () => {
    await mutation.mutate(
      {
        params: {
          tenantId: tenantId,
          type: type,
          forceUpdate: false,
          hierarchyType: params.hierarchyType,
          id: type === "boundary" ? params?.boundaryId : type === "facilityWithBoundary" ? params?.facilityId : params?.userId,
        },
      },
      {
        onSuccess: async (result) => {
          const filesArray = [result?.GeneratedResource?.[0]?.fileStoreid];
          const { data: { fileStoreIds: fileUrl } = {} } = await Digit.UploadServices.Filefetch(filesArray, tenantId);
          const fileData = fileUrl?.map((i) => {
            const urlParts = i?.url?.split("/");
            // const fileName = urlParts[urlParts?.length - 1]?.split("?")?.[0];
            const fileName = type === "boundary" ? "Boundary Template" : type === "facilityWithBoundary" ? "Facility Template" : "User Template";
            return {
              ...i,
              fileName: fileName,
            };
          });

          if (fileData && fileData?.[0]?.url) {
            window.location.href = fileData?.[0]?.url;

            // const link = document.createElement("a");
            // link.href = fileData?.[0]?.url;
            // link.download = "download"; // Set custom file name here
            // link.target = "_blank"; // Open in a new tab/window
            // link.click();

            // fetch(fileData?.[0]?.url)
            // .then((response) => response.blob())
            // .then((blob) => {
            //   const url = window.URL.createObjectURL(new Blob([blob]));
            //   const link = document.createElement("a");
            //   link.href =  "https://unified-dev-bucket-s3.s3-ap-south-1.amazonaws.com/mz/pgr/April/26/1714119186437HfyAmLyvuX.xlsx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCURO6LL2T7ZQYP7%2F20240426%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240426T081306Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=44fafeddf259073a42d9e03ad21522afbae3d47edc663ad051c7d46209b548ab"
            //   link.download = "downloaded-file";
            //   document.body.appendChild(link);

            //   link.click();

            //   document.body.removeChild(link);
            //   // window.URL.revokeObjectURL(url);
            // })
            // .catch((error) => {
            //   console.error("Error fetching the file:", error);
            // });
          }
        },
      }
    );
  };
  return (
    <React.Fragment>
      <div className="campaign-bulk-upload">
        <Header className="digit-form-composer-sub-header">
          {type === "boundary" ? t("WBH_UPLOAD_TARGET") : type === "facilityWithBoundary" ? t("WBH_UPLOAD_FACILITY") : t("WBH_UPLOAD_USER")}
        </Header>
        <Button
          label={t("WBH_DOWNLOAD_TEMPLATE")}
          variation="secondary"
          icon={<DownloadIcon styles={{ height: "1.25rem", width: "1.25rem" }} fill="#F47738" />}
          type="button"
          className="campaign-download-template-btn"
          onButtonClick={downloadTemplate}
        />
      </div>
      {uploadedFile.length === 0 && (
        <div className="info-text">
          {type === "boundary" ? t("HCM_BOUNDARY_MESSAGE") : type === "facilityWithBoundary" ? t("HCM_FACILITY_MESSAGE") : t("HCM_USER_MESSAGE")}
        </div>
      )}
      <BulkUpload onSubmit={onBulkUploadSubmit} fileData={uploadedFile} onFileDelete={onFileDelete} onFileDownload={onFileDownload} />
      {showInfoCard && (
        <InfoCard
          populators={{
            name: "infocard",
          }}
          variant="error"
          style={{ marginLeft: "0rem", maxWidth: "100%" }}
          label={t("HCM_ERROR")}
          additionalElements={[
            <React.Fragment key={type}>
              {errorsType[type] && (
                <React.Fragment>
                  {errorsType[type].split(",").map((error, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <br />}
                      {error.trim()}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              )}
            </React.Fragment>,
          ]}
        />
      )}
      {showToast && <Toast error={showToast.key === "error" ? true : false} label={t(showToast.label)} onClose={closeToast} />}
    </React.Fragment>
  );
};

export default UploadData;