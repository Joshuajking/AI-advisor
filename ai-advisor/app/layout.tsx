import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI ADVISOR",
  description: "Your personal AI advisor powered by Gemini",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#000",
          color: "#00ff41",
          fontFamily: "'Courier New', Courier, monospace",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
