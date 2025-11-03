import {
  Modal as NextUIModal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { GrClose } from "react-icons/gr";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  content?: React.ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  placement?: "auto" | "bottom" | "center" | "top";
  onOpen: any;
  onOpenChange: any;
  isDissmissable?: boolean;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  size?:
    | "sm"
    | "xl"
    | "3xl"
    | "2xl"
    | "5xl"
    | "md"
    | "lg"
    | "xs"
    | "4xl"
    | "full";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title = "",
  onOpenChange,
  action = null,
  size = "lg",
  isDissmissable = false,
  placement = "center",
  icon,
  content = "This is the modal content.",
}) => {
  return (
    <>
      <NextUIModal
        placement={placement}
        isDismissable={isDissmissable}
        scrollBehavior="inside"
        shadow={size == "full" ? "none" : "md"}
        classNames={{
          wrapper: size == "full" && "bg-white",
        }}
        closeButton={
          <Button variant="light" className="bg-white w-10 h-10">
            <GrClose size={16} />
          </Button>
        }
        size={size}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="p-2 md:p-5">
          {(onClose) => (
            <>
              <ModalBody>
                {!icon ? (
                  // NO ICON SO USE DEFAULT TITLE
                  <h2 className="flex flex-col items-center gap-1 header-2">
                    {title && title}
                  </h2>
                ) : (
                  // ICON WITH CUSTOM TITLE
                  <div className="flex flex-col items-center gap-5 header-2">
                    {icon} {title}
                  </div>
                )}

                {content}
              </ModalBody>
              {action && (
                <ModalFooter className="mx-auto">
                  <Button onPress={onClose}>Close</Button>
                  {action}
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </NextUIModal>
    </>
  );
};

export default Modal;
