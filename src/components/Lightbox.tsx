import { useCallback, useEffect, useRef } from "react";
import type { FC } from "react";
import { X } from "lucide-react";
interface LightboxProps {
  src: string;
  caption: string;
  credit?: string;
  onClose: () => void;
}
const Lightbox: FC<LightboxProps> = ({ src, caption, credit, onClose }) => {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = dialog.current;
    node?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return (): void => {
      document.body.style.overflow = previous;
      node?.close();
    };
  }, []);
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDialogElement>): void => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose],
  );
  return (
    <dialog
      ref={dialog}
      className="lightbox"
      onCancel={onClose}
      onClick={handleClick}
      aria-label={caption}
    >
      <button
        className="icon-button lightbox-close"
        onClick={onClose}
        aria-label="Close image viewer"
        autoFocus
      >
        <X />
      </button>
      <figure>
        <img src={src} alt={caption} />
        <figcaption>
          {caption}
          {credit && <span>Photography / {credit}</span>}
        </figcaption>
      </figure>
    </dialog>
  );
};
export default Lightbox;
