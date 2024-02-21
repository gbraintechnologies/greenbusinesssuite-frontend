import React from "react";
import Logo from "../../(login)/components/Logo";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";

function CreatePassword() {
  return (
    <div>
      <div
        id="left"
        className="flex px-4 md:flex flex-[2] items-center justify-center py-12 mt-20"
      >
        <div className="mb-10">
          <div className="flex items-left justify-left mb-10">
            <Logo src={"/svg/mesh_logo.svg"} width={100} />
          </div>
          <form className=" loginFrame flex flex-col  max-w-[414px] w-full gap-y-6 shadow-2xl py-10 bg-white p-6 rounded-[20px] ">
            <div>
              <Badge
                color="primary"
                badgeContent={4}
                showZero
                style={{
                  backgroundColor: "#F8FAFC",
                  borderRadius: "4px",
                  padding: "8px",
                }}
              >
                <MailIcon
                  style={{
                    color: "#FFFFFF",
                    fontSize: "350px",
                    padding: "50px",
                  }}
                />
              </Badge>
            </div>
            <h6 className="font-bold text-xl">Magic link sent to your mail</h6>
            <p>
              Thank you. If an account exist with your email address, you should
              receive an email address to reset your password.
            </p>
          </form>
        </div>
      </div>
      <div className="flex flex-col mt-20 items-center ">
        <div className="flex items-center gap-x-4 text-xs text-opacity-30 text-black font-medium">
          <p className="font-xs">&copy;&nbsp;Mesh Agent</p>
          <p>&bull;&nbsp;Contact</p>
          <p>&bull;&nbsp;Privacy policy</p>
        </div>
      </div>
    </div>
  );
}

export default CreatePassword;
