import { useEffect, useRef, useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";

function ActionMenu({ label, onEdit, onDelete, alwaysVisible = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleMouseDown(event) {
      if (!rootRef.current.contains(event.target)) {
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
        className={`btn btn-ghost btn-sm btn-square transition-opacity ${
          alwaysVisible
            ? "opacity-100"
            : isOpen
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
        }`}
        aria-label={label}
      >
        <EllipsisHorizontalIcon className="size-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-1 w-32 rounded-md border border-base-300 bg-base-100 p-1 shadow-lg">
          <button
            type="button"
            onClick={() => run(onEdit)}
            className="w-full rounded px-3 py-2 text-left text-sm hover:bg-base-200"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => run(onDelete)}
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
