/** Inline message. Pass { type: 'error' | 'ok', text } or null. */
export default function Notice({ msg }) {
  if (!msg) return null;
  return <div className={`notice ${msg.type}`} role="status">{msg.text}</div>;
}
