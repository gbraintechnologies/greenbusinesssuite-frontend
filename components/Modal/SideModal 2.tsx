"use client";

import { Modal, ModalBody, ModalContent } from "@nextui-org/modal";

export default function SideModal({
  isOpen,
  onOpenChange,
  onClose,
  children,
}: {
  isOpen: any;
  onOpenChange: any;
  onClose: any;
  children: any;
}) {
  return (
    <div>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          onOpenChange={onOpenChange}
          // backdrop="blur"
          scrollBehavior="inside"
          size="xl"
          className="fixed bg-white -top-10  bottom-0 -right-5 h-[150vh] rounded-2xl z-50 py-5"
          motionProps={{
            variants: {
              enter: {
                x: -20,
                opacity: 1,
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              },
              exit: {
                x: 0,
                opacity: 0,
                transition: {
                  duration: 0.2,
                  ease: "easeIn",
                },
              },
            },
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody className="bg-white rounded-2xl  py-0">
                  {children}
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
