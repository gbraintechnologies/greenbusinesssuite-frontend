"use state";

import React, { useEffect, useState } from "react";

// icons
import { CiCircleInfo } from "react-icons/ci";
import { VscCopy } from "react-icons/vsc";
import { PiCaretDown, PiCaretUp } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";

// components
import FormField from "./FormField";

import FormElementSelector from "./FormElementSelector";
import useForm from "@/hooks/useForm";
import { useQuery } from "@tanstack/react-query";
import services from "@/services";
import removeIds from "@/utils/RemoveIds/RemoveIds";
import { toast } from "sonner";
import Modal from "@/components/Modal/HeroModal";
import { Button, Input, Textarea, useDisclosure } from "@heroui/react";
import { MdOutlineModeEditOutline } from "react-icons/md";

function FormSection({ section, activeTab, setActiveTab, refetch }: any) {
  const { form, addFormSection, updateFormSectionsOrdering } = useForm();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: formStatusCount } = useQuery({
    queryKey: ["Get forms status count"],
    queryFn: services.getFormStatusCountById(Number(form?.id)),
    enabled: Boolean(form?.id),
  });
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  //
  let [localSection, setLocalSection] = useState(section);

  // update local copy if changes are made
  useEffect(() => {
    setLocalSection(section);
  }, [section]);

  const runUpdates = () => {
    // dont update if the name or description is blank
    if (
      localSection?.name?.length !== 0 ||
      localSection?.description?.length !== 0
    ) {
      setIsUpdating(true);
      updateSection(localSection);

      setTimeout(() => {
        setIsUpdating(false);
        onClose();
      }, 3000);
    }
  };

  const { removeSection, updateSection } = useForm();

  const [showSectionActions, setShowSectionActions] = useState(false);

  const handleDelete = () => {
    removeSection(section);
  };

  const handleSectionDuplicate = () => {
    let duplicate = {
      ...removeIds(section),
      name: section.name + " (Duplicated)",
      ordering: form?.formSections?.length,
    };

    addFormSection(duplicate);
    toast.success("Form section duplicated");
  };

  const moveUp = () => {
    toast.info("Moving section up. Please wait...");
    let sections = form?.formSections;

    const index = sections.findIndex(
      (sectionL: any) => sectionL?.id === section?.id
    );
    if (index > 0) {
      [sections[index - 1].ordering, sections[index].ordering] = [
        sections[index].ordering,
        sections[index - 1].ordering,
      ];
      sections.sort((a: any, b: any) => a.ordering - b.ordering);
    }
    updateFormSectionsOrdering(sections);
  };

  const moveDown = () => {
    toast.info("Moving section down. Please wait...");
    let sections = form?.formSections;
    const index = sections.findIndex(
      (sectionL: any) => sectionL.id === section?.id
    );
    if (index < sections.length - 1) {
      [sections[index + 1].ordering, sections[index].ordering] = [
        sections[index].ordering,
        sections[index + 1].ordering,
      ];
      sections.sort((a: any, b: any) => a.ordering - b.ordering);
    }

    updateFormSectionsOrdering(sections);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        title="Update Section"
        size="4xl"
        content={
          <div className="grid grid-cols-1 gap-5">
            {" "}
            <Input
              variant="bordered"
              label="Title"
              type="text"
              labelPlacement="outside"
              value={localSection?.name ?? ""}
              placeholder="Section title"
              className="outline-none focus:outline-none w-full input-custom"
              // onBlur={runUpdates}
              onChange={(e) => {
                setLocalSection((prev: any) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
            />
            <Textarea
              minRows={5}
              variant="bordered"
              label="Description"
              labelPlacement="outside"
              maxLength={254}
              value={localSection?.description ?? ""}
              placeholder="Section description"
              className="outline-none focus:outline-none w-full input-custom font-extralight text-sm"
              // onBlur={runUpdates}
              onChange={(e) => {
                setLocalSection((prev: any) => ({
                  ...prev,
                  description: e.target.value,
                }));
              }}
            />
            <Button
              color="primary"
              className="text-white"
              isLoading={isUpdating}
              disabled={isUpdating}
              onPress={runUpdates}
            >
              Update Section
            </Button>
          </div>
        }
      />
      <div
        onMouseEnter={() => setShowSectionActions(true)}
        onMouseLeave={() => setShowSectionActions(false)}
        className="form-section"
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="min-w-0 flex-1">
            <h5 className="break-words text-lg font-bold sm:text-xl">
              {section?.name}
            </h5>
            <p className="mb-3 break-words text-sm font-light text-gray-400 sm:mb-5">
              {section?.description ? section?.description : "No description"}
            </p>
          </div>
          <button
            onClick={onOpen}
            className="flex h-fit w-fit items-center gap-2 rounded-lg border px-3 py-2 text-xs hover:bg-black hover:text-white sm:text-sm"
          >
            <MdOutlineModeEditOutline /> Update
          </button>
        </div>

        {/* FORM FIELDS */}
        {localSection?.isTable ? (
          <div className="flex flex-row gap-1 overflow-x-auto">
            {localSection?.formFields
              ?.filter((item: any) => !item.isDeleted)
              .map((field: any) => {
                return (
                  <FormField
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    section={section}
                    field={field}
                  />
                );
              })}
          </div>
        ) : (
          <div className="builder-fields-grid grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
            {localSection?.formFields
              ?.filter((item: any) => !item.isDeleted)
              .map((field: any, idx: any) => {
                return (
                  <FormField
                    key={idx}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    section={section}
                    field={field}
                  />
                );
              })}
          </div>
        )}

        <div
          className={`${
            localSection.formFields.length === 0
              ? "bg-[#F8FAFC] p-3 my-4 min-h-48  rounded-2xl "
              : " text-center mx-auto mt-5 w-full"
          } flex flex-col items-center justify-center`}
        >
          {localSection.formFields.length == 0 && (
            <div className="mb-10 mx-auto text-center">
              <h4 className="font-bold mb-1">
                Click the button to add new elements
              </h4>
              <p className="text-sm">
                Optimize each section by including only closely related items.
              </p>
            </div>
          )}

          {/* ONLY ALLOW FORMS WITHOUT RESPONSES TO BE EDITED */}
          {formStatusCount && formStatusCount?.totalCount > 0 ? (
            <div className="bg-red-50 px-3 py-1 rounded-lg text-lg flex justify-center items-center flex-row gap-2">
              <CiCircleInfo size={20} />{" "}
              <p className="text-xs mt-1 font-light italic">
                No new fields can be added to this form once it has started
                accepting responses.{" "}
              </p>
            </div>
          ) : (
            <FormElementSelector section={section} />
          )}
        </div>

        {/* DELETE ICON && DUPLICATE BUTTON */}
        {showSectionActions && (
          <div
            className="bg-white flex flex-col py-2 items-center justify-center shadow-xl p-1 rounded-lg absolute top-3 -right-5"
            onMouseEnter={() => setShowSectionActions(true)}
            // onMouseLeave={() => setShowSectionActions(false)}
          >
            {" "}
            <button
              onClick={handleDelete}
              className="bg-white hover:bg-red-100 p-2 rounded-xl "
            >
              <RiDeleteBin6Line size={20} className="text-red-600" />
            </button>
            <div className="w-full my-3 px-5 border-[0.6px] border-t-[#CFCFCF]"></div>
            <button
              onClick={handleSectionDuplicate}
              className="bg-white hover:bg-blue-100  p-2 rounded-xl"
            >
              <VscCopy size={20} />
            </button>
            <div className="w-full my-3 px-5 border-[0.6px] border-t-[#CFCFCF]"></div>
            <button
              disabled={section?.ordering == 0}
              onClick={moveUp}
              className="bg-white hover:bg-orange-100 disabled:cursor-not-allowed  p-2 rounded-xl mb-2"
            >
              <PiCaretUp size={20} />
            </button>
            <button
              disabled={section?.ordering === form?.formSections?.length - 1}
              onClick={moveDown}
              className="bg-white hover:bg-orange-100 disabled:cursor-not-allowed  p-2 rounded-xl mb-2"
            >
              <PiCaretDown size={20} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default FormSection;
