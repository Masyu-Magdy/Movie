export default function SprocketDivider() {
  return (
    <div className="sprocket-divider" aria-hidden="true">
      <div className="holes">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>
    </div>
  );
}