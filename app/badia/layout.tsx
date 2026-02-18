export default function BadiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "#FFFBF7",
      minHeight: "100vh",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "auto"
    }}>
      {children}
    </div>
  );
}
