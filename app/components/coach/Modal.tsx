import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ open, title, description, onClose, children }: ModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-band/60 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="w-full max-w-md rounded-t-xl border border-ink/15 bg-card p-6 shadow-2xl sm:rounded-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-semibold tracking-[-0.02em]">
              {title}
            </h3>
            {description && (
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/15"
            aria-label="Close">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
