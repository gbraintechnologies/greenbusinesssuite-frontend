import { isConvertibleToNumber } from '@/utils/IsNumber/IsNumber'
import React from 'react'

const Description = ({
    companyDescription,
    companyData,
    country,
    parentAddressScheme,
    companyChildAddressId,
    industry,
    companySubSector
}:{
    companyDescription: string,
    companyData: any,
    country: any,
    parentAddressScheme: any,
    companyChildAddressId: any,
    industry: any,
    companySubSector: any


}) => {
  return (
    <div><>
    <div className="flex-1 py-5 pb-3">
      {companyDescription && (
        <div className="group-item">
          <div className="label">Company description</div>
          <div className="value">{companyDescription}</div>
        </div>
      )}
      {companyData?.company_address && (
        <div className="group-item">
          <div className="label">Jurisdiction</div>
          <div className="value">
            {country?.countryName}
            {","}
            {parentAddressScheme?.parentName}
            {","}
            {parentAddressScheme?.childLevels?.find(
              (entry: any) => entry == companyChildAddressId
            )}
          </div>
        </div>
      )}
      {companyData?.industry && (
        <div className="group-item">
          <div className="label">Sector</div>
          <div className="value">
            {isConvertibleToNumber(companyData?.industry)
              ? industry?.sector?.parentSector
              : companyData?.industry}
            {","}
            {companySubSector}
          </div>
        </div>
      )}
      {companyData?.primary_contact_name && (
        <div className="group-item">
          <div className="label">Contact person</div>
          <div className="value">
            {companyData?.primary_contact_name}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        {companyData?.primary_contact_phone_number && (
          <div className="group-item">
            <div className="label">Phone Number</div>
            <div className="value">
              {companyData?.primary_contact_phone_number}
            </div>
          </div>
        )}
        {companyData?.primary_contact_email && (
          <div className="group-item">
            <div className="label">Email</div>
            <div className="value">
              {companyData?.primary_contact_email}
            </div>
          </div>
        )}
      </div>
    </div>
  </></div>
  )
}

export default Description