import "./globals.css";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de">
      <body>
        <div style={{ isolation: "isolate" }}>{children}</div>
      </body>
    </html>
  );
}
