import TestCaseGenerator from "@/components/test-case-generator"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col">
      
      {/* Header */}
      <header className="text-center py-10 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          Integration Test Case Generator
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
          Generate detailed, AI-powered integration test cases from user stories,
          requirements, or API contracts in seconds.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center px-4">
        <div className="w-full max-w-6xl bg-background/80 backdrop-blur rounded-xl shadow-lg p-6 md:p-10">
          <TestCaseGenerator />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground py-6">
        Built with by Next.js · Tailwind CSS
      </footer>

    </div>
  )
}
