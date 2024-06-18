// icons for elements
import { MdOutlineMailOutline } from "react-icons/md";
import { MdOutlinePhone } from "react-icons/md";
import { TiDocumentText } from "react-icons/ti";
import { BsCardText } from "react-icons/bs";
import { AiOutlineNumber } from "react-icons/ai";
import { RiDropdownList } from "react-icons/ri";
import { RiCheckboxMultipleLine } from "react-icons/ri";
import { LuUploadCloud } from "react-icons/lu";

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
    icon: <MdOutlinePhone size={18} />,
    name: "Phone Number",
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
  // NEW FORM ELE
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
