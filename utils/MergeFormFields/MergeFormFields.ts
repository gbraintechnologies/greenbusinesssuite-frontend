// Function to merge form fields by ID dynamically
function mergeFormFields(fields1: any, fields2: any) {
  const fieldMap = new Map();

  fields1.forEach((field: any) => {
    fieldMap.set(field.id, { ...field });
  });

  fields2.forEach((field: any) => {
    if (fieldMap.has(field.id)) {
      fieldMap.set(field.id, { ...fieldMap.get(field.id), ...field });
    } else {
      fieldMap.set(field.id, { ...field });
    }
  });

  return Array.from(fieldMap.values());
}

// Function to merge form sections by ID dynamically
function mergeFormSections(sections1: any, sections2: any) {
  const sectionMap = new Map();

  sections1.forEach((section: any) => {
    sectionMap.set(section.id, { ...section });
  });

  sections2.forEach((section: any) => {
    if (sectionMap.has(section.id)) {
      const mergedSection = sectionMap.get(section.id);
      mergedSection.formFields = mergeFormFields(
        mergedSection.formFields,
        section.formFields
      );
      sectionMap.set(section.id, mergedSection);
    } else {
      sectionMap.set(section.id, { ...section });
    }
  });

  return Array.from(sectionMap.values());
}

// Merge the main objects dynamically
export default function mergeForm(responseId: number, obj1: any, obj2: any) {
  return {
    ...obj1,
    ...obj2,
    responseId,
    formSections: mergeFormSections(obj1.formSections, obj2.formSections),
  };
}
