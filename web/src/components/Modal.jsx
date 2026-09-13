function Modal({ isOpen, onClose, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <dialog open className="modal">
      <div className="modal-box">{children}</div>
    </dialog>
  );
}

export default Modal;
