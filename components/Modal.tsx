"use client";

import React from "react";
import { X } from "lucide-react";
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "motion/react";

interface ModalProps extends React.PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed h-dvh z-100 inset-0 flex items-center justify-center bg-white bg-opacity-50`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`bg-white max-w-xl z-100 h-dvh text-primary overflow-y-auto relative w-full flex flex-col justify-start items-center sm:justify-start  sm:shadow-lg sm:items-start`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0 }}
          >
            <div
              className="w-full flex h-dvh flex-col"
              role="dialog"
              aria-modal="true"
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-darkgray hover:text-primary"
                onClick={handleClose}
              >
                <X className="w-6 h-6" />
              </button>

              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body // Attach the modal to the body in the browser
  );
};

export default Modal;
