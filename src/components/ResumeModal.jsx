import { useEffect, useRef } from "react";

export default function ResumeModal({ open, onClose, resumeHref }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    document.body.style.overflow = "hidden";
    if (closeRef.current) closeRef.current.focus();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      if (previous && previous.focus) previous.focus();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Résumé preview" onClick={(e) => e.stopPropagation()}>
        <div className="modal-bar">
          <span className="modal-title">john-yates-resume.pdf</span>
          <div className="modal-actions">
            <a href={resumeHref} download="John_Yates_Resume.pdf" className="btn-ghost btn-sm">Download</a>
            <a href={resumeHref} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm">Open in new tab</a>
            <button ref={closeRef} type="button" className="btn-ghost btn-sm" onClick={onClose}>Close</button>
          </div>
        </div>
        <iframe src={`${resumeHref}#view=FitH`} title="John Yates résumé" className="modal-frame" />
      </div>
    </div>
  );
}
