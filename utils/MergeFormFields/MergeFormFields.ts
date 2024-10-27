// TODO: OLD IMPLEMENTATION

// // Function to merge form fields by ID dynamically
// function mergeFormFields(fields1: any, fields2: any) {
//   const fieldMap = new Map();

//   fields1.forEach((field: any) => {
//     fieldMap.set(field.id, { ...field });
//   });

//   fields2.forEach((field: any) => {
//     if (fieldMap.has(field.formFieldId)) {
//       fieldMap.set(field.formFieldId, {
//         ...fieldMap.get(field.formFieldId),
//         response: field.response,
//       });
//     }
//   });

//   return Array.from(fieldMap.values());
// }

// // Function to merge form sections by ID dynamically
// function mergeFormSections(sections1: any, sections2: any) {
//   const sectionMap = new Map();

//   sections1.forEach((section: any) => {
//     sectionMap.set(section.id, { ...section });
//   });

//   sections2.forEach((section: any) => {
//     if (sectionMap.has(section.formSectionId)) {
//       const mergedSection = sectionMap.get(section.formSectionId);
//       mergedSection.formFields = mergeFormFields(
//         mergedSection.formFields,
//         section.formDataFields
//       );
//       sectionMap.set(section.formSectionId, mergedSection);
//     }
//   });

//   return Array.from(sectionMap.values());
// }

// TODO: NEW IMPLEMENTATION
// Function to merge form fields by ID dynamically
function mergeFormFields(fields1: any, fields2: any) {
  const fieldMap = new Map();

  // Add fields from the first object
  fields1.forEach((field: any) => {
    fieldMap.set(field.id, { ...field });
  });

  // Merge fields from the second object
  fields2.forEach((field: any) => {
    const existingField = fieldMap.get(field.formFieldId);
    if (existingField) {
      fieldMap.set(field.formFieldId, { ...existingField, ...field });
    } else {
      fieldMap.set(field.formFieldId, { ...field });
    }
  });

  return Array.from(fieldMap.values());
}

// Function to merge form sections by ID dynamically
function mergeFormSections(sections1: any, sections2: any) {
  const sectionMap = new Map();

  // Add sections from the first object
  sections1.forEach((section: any) => {
    sectionMap.set(section.id, { ...section, formSectionId: section.id });
  });

  // Merge sections from the second object
  sections2.forEach((section: any) => {
    const existingSection = sectionMap.get(section.formSectionId);
    if (existingSection) {
      existingSection.formFields = mergeFormFields(
        existingSection.formFields,
        section.formDataFields
      );
      existingSection.id = section.id; // Use the id from the second object
      existingSection.formSectionId = section.formSectionId;
      sectionMap.set(section.formSectionId, existingSection);
    } else {
      sectionMap.set(section.formSectionId, { ...section });
    }
  });

  return Array.from(sectionMap.values());
}

// Merge the main objects dynamically
export default function mergeForm(responseId: number, obj1: any, obj2: any) {
  return {
    ...obj1,
    responseId,
    formSections: mergeFormSections(
      obj1?.formSections?.filter((item: any) => !item?.isDeleted),
      obj2.formSections
    ),
  };
}
