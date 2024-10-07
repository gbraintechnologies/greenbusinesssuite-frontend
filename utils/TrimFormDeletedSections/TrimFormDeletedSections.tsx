export default function TrimFormDeletedSections(form: any) {
  return {
    ...form,
    formSections: form?.formSections?.filter((item: any) => !item?.isDeleted),
  };
}
