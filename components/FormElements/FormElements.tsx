// icons for elements
import { MdOutlineMailOutline } from "react-icons/md";
import { MdOutlinePhone } from "react-icons/md";
import { TiDocumentText } from "react-icons/ti";
import { BsCardText } from "react-icons/bs";
import { AiOutlineNumber } from "react-icons/ai";
import { RiDropdownList } from "react-icons/ri";
import { RiCheckboxMultipleLine } from "react-icons/ri";
import { LuUploadCloud } from "react-icons/lu";
import { LuUser2 } from "react-icons/lu";
import { FaRegBuilding } from "react-icons/fa";
import { FaRegMap } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { FaRegAddressBook } from "react-icons/fa6";

// general properties
let template = {
  name: "",
  description: "",
  isStatistical: false,
  statisticalFunction: null,
  displayType: null,
  label: "",
  placeHolder: "",
  instruction: "",
  isDeleted: false,
  choiceValues: [],
  isMandatory: true,
  horizontalAlign: false,
  validPattern: null,
  createdOn: new Date(),
  updatedOn: new Date(),
  deletedOn: null,
};

// types
// text
// number
// string
// email
// phone

// TODO: add new elements
// full name
// address information
// Date -
// business information
// dropdown
// multiple choice
//
// file upload?

// INSIGHTS
// number

export const defaultFormElements = [
  {
    icon: <LuUser2 size={18} />,
    name: "Full Name",
    properties: {
      ...template,
      fieldDataType: "short-text",
      name: "Full name",
      description: "Full name",
      label: "Full name",
      placeHolder: "Enter your full name here",
    },
  },
  {
    icon: <MdOutlinePhone size={18} />,
    name: "Contact",
    properties: {
      ...template,
      fieldDataType: "phone",
      name: "Phone Number",
      description: "Phone Number",
      label: "Phone Number",
      placeHolder: "Enter your phone number",
    },
  },
  {
    icon: <MdOutlineMailOutline size={18} />,
    name: "Email",
    properties: {
      ...template,
      fieldDataType: "email",
      name: "Email Address",
      description: "Email Address",
      label: "Email Address",
      placeHolder: "Enter your email address here",
    },
  },
  {
    icon: <FaRegMap size={18} />,
    name: "Open Address information",
    properties: {
      ...template,
      fieldDataType: "long-text",
      name: "Address information",
      description: "Address information",
      label: "Address information",
      placeHolder: "Enter your address information",
    },
  },
  {
    icon: <IoCalendarOutline size={18} />,
    name: "Date of birth",
    properties: {
      ...template,
      fieldDataType: "calendar",
      horizontalAlign: true,
      name: "Date of birth",
      choiceValues: [],
      description: "Select date of birth",
      label: "Date of birth",
      placeHolder: "Select your date of birth",
    },
  },
  {
    icon: <FaRegAddressBook size={18} />,
    name: "Address",
    properties: {
      ...template,
      fieldDataType: "dropdown",
      name: "Address",
      description: "Address",
      label: "Address",
      placeHolder: "Select your address",
    },
  },
  {
    icon: <FaRegBuilding size={18} />,
    name: "Business information",
    properties: {
      ...template,
      fieldDataType: "long-text",
      name: "Business information",
      description: "Business information",
      label: "Business information",
      placeHolder: "Enter your business information here",
    },
  },
  {
    icon: <BsCardText size={18} />,
    name: "Short text",
    properties: {
      ...template,
      fieldDataType: "short-text",
      name: "Short text",
      description: "Short text",
      label: "Short text",
      placeHolder: "Enter your short text here",
    },
  },
  {
    icon: <TiDocumentText size={18} />,
    name: "Long text",
    properties: {
      ...template,
      fieldDataType: "long-text",
      name: "Long text",
      description: "Long text",
      label: "Long text",
      placeHolder: "Enter your long text here",
    },
  },
  {
    icon: <AiOutlineNumber size={18} />,
    name: "Number",
    properties: {
      ...template,
      fieldDataType: "number",
      name: "Number",
      description: "Number",
      label: "Number",
      placeHolder: "Enter your number",
    },
  },
  {
    icon: <FaRegMap size={18} />,
    name: "Open Address information",
    properties: {
      ...template,
      fieldDataType: "long-text",
      name: "Address information",
      description: "Address information",
      label: "Address information",
      placeHolder: "Enter your address information",
    },
  },
  {
    icon: <IoCalendarOutline size={18} />,
    name: "Date",
    properties: {
      ...template,
      fieldDataType: "calendar",
      name: "Date Select",
      horizontalAlign: true,
      choiceValues: [],
      description: "Select date",
      label: "Date",
      placeHolder: "Select date",
    },
  },
  {
    icon: <RiDropdownList size={18} />,
    name: "Dropdown",
    properties: {
      ...template,
      fieldDataType: "dropdown",
      name: "Dropdown",
      choiceValues: ["Option 1", "Option 2"],
      description: "Dropdown",
      label: "Dropdown",
      placeHolder: "Select one option",
    },
  },
  {
    icon: <RiCheckboxMultipleLine size={18} />,
    name: "Multiple Choice (Checkboxes)",
    properties: {
      ...template,
      fieldDataType: "checkboxes",
      name: "Multiple Choice",
      choiceValues: ["Option 1", "Option 2", "Option 3", "Option 4"],
      description: "Multiple Choice",
      label: "Multiple Choice",
      placeHolder: "Select one or more options",
    },
  },
  {
    icon: <LuUploadCloud size={18} />,
    name: "File Upload",
    properties: {
      ...template,
      fieldDataType: "upload",
      name: "Upload file",
      description: "Upload file",
      label: "Upload file",
      placeHolder: "Drag and drop or choose image or document to upload",
    },
  },
];
