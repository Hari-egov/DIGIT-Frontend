import React, { useState, useEffect } from "react";
import { Header, TextInput } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { LabelFieldPair } from "@egovernments/digit-ui-react-components";

const CampaignName = ({ onSelect, formData, control, ...props }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(props?.props?.sessionData?.HCM_CAMPAIGN_NAME?.campaignName || null);

  useEffect(() => {
    setName(props?.props?.sessionData?.HCM_CAMPAIGN_NAME?.campaignName);
  }, [props?.props?.sessionData?.HCM_CAMPAIGN_NAME]);

  useEffect(() => {
    onSelect("campaignName", name);
  }, [name, props?.props?.sessionData?.HCM_CAMPAIGN_NAME?.campaignName]);

  return (
    <React.Fragment>
      <Header>{t(`HCM_CAMPAIGN_NAME_HEADER`)}</Header>
      <p className="name-description">{t(`HCM_CAMPAIGN_NAME_DESCRIPTION`)}</p>
      <LabelFieldPair>
        <div className="name-container">
          <span>{`${t("HCM_CAMPAIGN_NAME")}`}</span>
          <span className="mandatory-span">*</span>
        </div>
        <TextInput style={{ width: "50%" }} name="campaignName" value={name} onChange={(event) => setName(event.target.value)} />
      </LabelFieldPair>
    </React.Fragment>
  );
};

export default CampaignName;