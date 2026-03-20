import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Advisor",
  description: "Your personal AI advisor powered by Gemini",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
