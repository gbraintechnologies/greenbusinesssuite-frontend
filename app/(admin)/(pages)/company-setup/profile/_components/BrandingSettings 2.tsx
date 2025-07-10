import Loader from "@/components/Loader/Loader";
import CloudUploadIcon from "@/public/icons/CloudUploadIcon";
import React from "react";

const BrandingSettings = ({
  brandingLoading,
  companySmallLogo,
  setCompanySmallLogo,
  smallLogoUrl,
  color,
  showColorPicker,
  setShowColorPicker,
  handleChangeComplete,
}: {
  brandingLoading: boolean;
  companySmallLogo: any;
  smallLogoUrl: string;
  setCompanySmallLogo: any;
  color: string;
  showColorPicker: boolean;
  setShowColorPicker: any;
  handleChangeComplete: any;
}) => {
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
                  Set your default branding elements to determine how the
                  interface appears to customers.
                </p>
              </div>
              {/* <button
                    type="button"
                    className="bg-white disabled:bg-gray-400 py-3 text-black border w-24 flex items-center justify-center border-[rgba(226, 232, 240, 1)] text-sm hover:opacity-95 items-center gap-2 rounded-xl"
                    onClick={editCompanyBranding}
                  >
                    Save
                  </button> */}
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
                      accept=".jpg, .png"
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
                    // onClick={() => setShowColorPicker(!showColorPicker)}
                  >
                    <div
                      className="w-5 h-8 rounded-tl-md rounded-bl-md"
                      style={{ backgroundColor: color }}
                    ></div>
                    <p className="p-2">{color}</p>
                  </button>
                )}

                {showColorPicker && <></>}
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default BrandingSettings;
