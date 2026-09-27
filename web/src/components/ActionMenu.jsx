import { useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";

function ActionMenu({ label, onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-sm btn-square"
        aria-label={label}
      >
        <EllipsisHorizontalIcon className="size-6" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-32 rounded-md border border-base-300 bg-base-100 p-1 shadow-lg">
          <button
            type="button"
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="w-full rounded px-3 py-2 text-left text-sm hover:bg-base-200"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="w-full rounded px-3 py-2 text-left text-sm text-error hover:bg-base-200"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default ActionMenu;
