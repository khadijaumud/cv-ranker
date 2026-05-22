export const metadata = {
  title: 'CV Ranker',
  description: 'AI-powered CV analysis and ranking system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}