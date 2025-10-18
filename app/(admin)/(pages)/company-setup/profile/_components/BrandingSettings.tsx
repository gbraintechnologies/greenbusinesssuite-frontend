import Loader from "@/components/Loader/Loader";
import useFileUpload from "@/hooks/useFileUpload";
import CloudUploadIcon from "@/public/icons/CloudUploadIcon";
import services from "@/services";
import { Button } from "@heroui/react";
import React, { useRef, useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";

const BrandingSettings = ({
  brandingLoading,
  companySmallLogo,
  setCompanySmallLogo,
  smallLogoUrl,
  color,
  showColorPicker,
  setShowColorPicker,
  handleChangeComplete,
  companyBranding,
  companyData,
}: {
  brandingLoading: boolean;
  companySmallLogo: any;
  smallLogoUrl: string;
  setCompanySmallLogo: any;
  color: string;
  showColorPicker: boolean;
  setShowColorPicker: any;
  handleChangeComplete: any;
  companyBranding: any;
  companyData: any;
}) => {
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const { handleFileUpload } = useFileUpload();

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker, setShowColorPicker]);

  const [loading, setLoading] = useState(false);

  const createBranding = async () => {
    if (!smallLogoUrl) {
      toast.error("Logo is required");
      return;
    }

    try {
      setLoading(true);
      const companySmallLogoURL =
        companySmallLogo && (await handleFileUpload(companySmallLogo as File));

      await services
        .createCompanyBranding(
          companyData?.id!,
          companyData?.companyIdentifier!,
          companySmallLogoURL,
          color,
          companyData?.companyName!,
          [],
          []
        )
        .then((res) => {
          setLoading(false);
          toast.success("Branding saved successfully");
        });
    } catch (e) {
      setLoading(false);
      toast.error("An error occured");
    }
  };

  const editCompanyBranding = async () => {
    if (!smallLogoUrl) {
      toast.error("Logo is required");
      return;
    }
    try {
      setLoading(true);
      const companySmallLogoURL =
        companySmallLogo && (await handleFileUpload(companySmallLogo as File));

      await services.editCompanyBranding(
        companyBranding?.id,
        companyData?.id,
        companyData?.companyIdentifier,
        companySmallLogo ? companySmallLogoURL : companyBranding?.logo,
        color,
        companyData?.companyName!,
        companyBranding?.modules?.map((module: any) => module?.id),
        companyBranding?.categorySpecificModules?.map(
          (module: any) => module?.id
        )
      );
      setLoading(false);
      toast.success("Company branding updated successfully");
    } catch (error) {
      toast.error("Failed to update company branding");
      setLoading(false);
    }
  };

  return (
    <div>
      <>
        {brandingLoading ? (
          <Loader text="Fetching company branding information" />
        ) : (
          <div className="pt-6">
            <header className="pb-3 flex justify-between items-center w-full">
              <div>
                <h3 className="text-lg text-primary-dark font-semibold">
                  Branding Settings
                </h3>
                <p className="text-sm text-[#667085]">
                  Set your default branding elements to control the appearance
                  of the company dashboard to users.
                </p>
              </div>
              <Button
                color="primary"
                className="px-10"
                isLoading={loading}
                isDisabled={loading}
                onPress={() => {
                  if (companyBranding == undefined) {
                    // create
                    createBranding();
                  } else {
                    // edit
                    editCompanyBranding();
                  }
                }}
              >
                Save
              </Button>
            </header>

            <div className="max-w-2xl">
              {/* COMPANY SMALL LOGO */}
              <div className="mt-2 mb-4">
                <h2 className="text-base text-primary-dark font-medium">
                  Upload small icon
                </h2>
                <p className="text-sm text-[#667085]">
                  A smaller representation of your logo to be used as a favicon.
                  It must be squared and at least 128px by 128px with a max size
                  of 512KB. Supported formats are JPG and PNG only.
                </p>

                {!companySmallLogo && !smallLogoUrl && (
                  <label className="mt-2 flex gap-2 items-center my-2 bg-white w-fit h-fit border p-2 rounded-md text-[#334155] font-medium border-[#E2E8F0] text-sm cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        setCompanySmallLogo(
                          e.target.files && e.target.files[0]
                        );
                      }}
                      accept=".jpg, .png, .avif"
                    />
                    <CloudUploadIcon />
                    <p>Upload</p>
                  </label>
                )}

                {smallLogoUrl && (
                  <div
                    className="w-32 h-32 rounded-md my-3"
                    style={{
                      backgroundImage: `url(${smallLogoUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      border: "1px solid #E2E8F0",
                      position: "relative",
                    }}
                  >
                    {/* <div className="absolute bottom-3 right-[-2.1rem] border border-[#E2E8F0] rounded-md bg-white flex items-center">
                          <div
                            className="border-r border-[#E2E8F0] flex justify-center items-center w-8 py-2 cursor-pointer"
                            onClick={() => {
                              setCompanySmallLogo(null);
                              setSmallLogoUrl("");
                            }}
                          >
                            <RiDeleteBin6Line color="#0E121B" />
                          </div>
                          <label className="flex justify-center items-center w-8 py-2 relative cursor-pointer">
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                setCompanySmallLogo(
                                  e.target.files && e.target.files[0]
                                );
                              }}
                              accept=".jpg, .png"
                            />
                            <WriteIcon />
                          </label>
                        </div> */}{" "}
                  </div>
                )}
              </div>

              {/* COMPANY COLOR */}
              <div className="input-holder">
                <h2 className="text-base text-primary-dark font-medium">
                  Company Color
                </h2>
                <p className="text-sm text-[#667085]">
                  Add a splash of color to your pages
                </p>

                {!color && (
                  <button
                    className="mt-2 flex gap-2 items-center my-2 bg-white w-fit h-fit border py-2 px-4 rounded-md text-[#334155] font-medium border-[#E2E8F0] text-sm cursor-pointer"
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  >
                    Select
                  </button>
                )}

                {color && (
                  <button
                    className="mt-2 flex items-center my-2 bg-white w-fit h-8 border rounded-md text-[#334155] font-medium border-[#E2E8F0] text-sm cursor-pointer"
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  >
                    <div
                      className="w-5 h-8 rounded-tl-md rounded-bl-md"
                      style={{ backgroundColor: color }}
                    ></div>
                    <p className="p-2">{color}</p>
                  </button>
                )}

                {showColorPicker && (
                  <div className="relative mt-4">
                    <div
                      ref={colorPickerRef}
                      className="absolute z-10 bg-white p-4 rounded-lg shadow-lg border border-[#E2E8F0]"
                    >
                      <HexColorPicker
                        color={color}
                        onChange={(newColor) =>
                          handleChangeComplete({ hex: newColor })
                        }
                      />
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={color}
                          onChange={(e) =>
                            handleChangeComplete({ hex: e.target.value })
                          }
                          className="px-3 py-2 border border-[#E2E8F0] rounded-md text-sm w-32"
                          placeholder="#000000"
                        />
                        <button
                          type="button"
                          onClick={() => setShowColorPicker(false)}
                          className="px-4 py-2 bg-primary-green text-white text-sm rounded-md hover:opacity-90"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default BrandingSettings;
