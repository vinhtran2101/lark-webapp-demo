import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

function toSelectOption(option) {
  return typeof option === "string" ? { value: option, label: option } : option;
}

export default function CustomSelect({
  value,
  options,
  onChange,
  placeholder = "Chọn",
  className = "",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState(null);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const normalizedOptions = options.map(toSelectOption);
  const selected = normalizedOptions.find((option) => option.value === value);
  const displayLabel = selected?.label || placeholder;
  const isPermissionSelect = className.includes("permission-level-select");

  useEffect(() => {
    if (!open) {
      setMenuStyle(null);
      return undefined;
    }
    if (typeof window === "undefined") return undefined;

    const updateMenuPosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const gap = 6;
      const preferredMaxHeight = 240;
      const optionHeight = Math.min(preferredMaxHeight, normalizedOptions.length * 44 + 12);
      const menuWidth = Math.min(
        Math.max(rect.width, isPermissionSelect ? 180 : rect.width),
        window.innerWidth - 16
      );
      const menuLeft = Math.min(Math.max(8, rect.left), window.innerWidth - menuWidth - 8);
      const spaceBelow = window.innerHeight - rect.bottom - gap;
      const spaceAbove = rect.top - gap;
      const placeAbove = spaceBelow < optionHeight && spaceAbove > spaceBelow;
      const availableHeight = Math.max(
        128,
        Math.min(preferredMaxHeight, (placeAbove ? spaceAbove : spaceBelow) - 8)
      );

      setMenuStyle({
        left: menuLeft,
        right: "auto",
        top: placeAbove ? "auto" : rect.bottom + gap,
        bottom: placeAbove ? window.innerHeight - rect.top + gap : "auto",
        width: menuWidth,
        maxHeight: availableHeight,
      });
    };

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open, normalizedOptions.length, isPermissionSelect]);

  useEffect(() => {
    if (!open || typeof document === "undefined") return undefined;

    const closeOnOutsidePointer = (event) => {
      if (wrapperRef.current?.contains(event.target) || menuRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsidePointer);
    return () => document.removeEventListener("mousedown", closeOnOutsidePointer);
  }, [open]);

  const menu = (
    <div
      className={`custom-select-menu floating-select-menu ${isPermissionSelect ? "permission-level-menu" : ""}`}
      role="listbox"
      ref={menuRef}
      style={menuStyle || undefined}
    >
      {normalizedOptions.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            type="button"
            role="option"
            aria-selected={isSelected}
            className={`custom-select-option ${isSelected ? "selected" : ""}`}
            key={option.value}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onChange(option.value);
              setOpen(false);
            }}
          >
            <Check size={16} />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div
      ref={wrapperRef}
      className={`custom-select ${open ? "open" : ""} ${disabled ? "disabled" : ""} ${className}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget) && !menuRef.current?.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className="custom-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{displayLabel}</span>
        <ChevronDown size={17} />
      </button>
      {open && !disabled && menuStyle && typeof document !== "undefined" && createPortal(menu, document.body)}
    </div>
  );
}
