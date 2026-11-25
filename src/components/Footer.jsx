export default function Footer({ email, copied, onCopy }) {
  return (
    <footer>
      <div className="foot">
        <span>© 2026 JOHN YATES</span>
        <a href={`mailto:${email}`} onClick={onCopy}>
          {copied ? "copied to clipboard" : email}
        </a>
      </div>
    </footer>
  );
}
