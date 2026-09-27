import { useEffect, useRef } from "react";

function ConfirmDialog({ title, message, isOpen, onConfirm, onCancel }) {
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

    dialog.addEventListener("cancel", onCancel);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
    };
  }, [onCancel]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box">
        <h3 className="font-display text-lg font-semibold">{title}</h3>

        <p className="mt-2 text-base-content/70">{message}</p>

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost hover:text-accent"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button type="button" className="btn btn-error" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default ConfirmDialog;
