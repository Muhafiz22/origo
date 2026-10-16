import { useEffect, useRef, useState } from "react";
import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

function ActionMenu({ label, onEdit, onDelete, alwaysVisible = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleMouseDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function run(action) {
    setIsOpen(false);
    action();
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={`btn btn-ghost btn-sm btn-square transition-opacity ${
          alwaysVisible
            ? "opacity-100"
            : isOpen
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
        }`}
      >
        <EllipsisHorizontalIcon className="size-5" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute left-4 bottom-full z-50 mb-1 w-40 border border-base-300 bg-base-200"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => run(onEdit)}
            className="flex w-full items-center justify-between px-4 py-3 text-left font-mono text-sm text-base-content/70 transition-colors hover:bg-base-300/60 hover:text-base-content"
          >
            <span>Edit</span>
            <PencilSquareIcon className="size-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => run(onDelete)}
            className="flex w-full items-center justify-between border-t border-base-300 px-4 py-3 text-left font-mono text-sm text-error transition-colors hover:bg-error/10"
          >
            <span>Delete</span>
            <TrashIcon className="size-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

export default ActionMenu;
