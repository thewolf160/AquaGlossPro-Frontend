import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  deleteText?: string;
  restoreText?: string;
  actions?: React.ReactNode;
}

function Modal({
  isOpen,
  onClose,
  children,
  title,
  deleteText,
  restoreText,
  actions,
}: ModalProps) {
  if (!isOpen) return null;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      <dialog
        open={isOpen}
        className="modal"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="modal-box w-full max-w-sm md:max-w-xl">
          {title ? (
            <div className="w-full border-b border-slate-200 p-4 mb-4">
              <p className="text-2xl font-semibold text-slate-800">{title}</p>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center gap-3">
              <div
                className={`${deleteText ? "bg-red-200 rounded-full p-5" : "bg-green-100 rounded-lg p-3"}`}
              >
                {deleteText ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    fill="currentColor"
                    className="bi bi-exclamation-triangle text-red-800"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
                    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    fill="currentColor"
                    className="bi bi-arrow-clockwise text-green-800"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
                    />
                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                  </svg>
                )}
              </div>
              <p className="text-2xl font-bold text-slate-900">{deleteText || restoreText}</p>
            </div>
          )}

          <div className="">{children}</div>

          <div className="flex justify-end gap-8 mt-5">
            <button className="btn" onClick={onClose}>
              Cerrar
            </button>
            {actions}
          </div>
        </div>
      </dialog>
    </>
  );
}

export default Modal;
