import { useEffect, useRef } from "react";

function Modal({ isOpen, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.addEventListener("cancel", onClose);
    return () => dialog.removeEventListener("cancel", onClose);
  }, [onClose]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box">{children}</div>
    </dialog>
  );
}

export default Modal;
