"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, ClipboardCopy, Check, Sparkles } from "lucide-react"
import type { TestCase } from "@/types/test-case"

interface TestCaseOutputProps {
  testCases: TestCase[]
  isGenerating: boolean
}

export function TestCaseOutput({ testCases, isGenerating }: TestCaseOutputProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [exportFormat, setExportFormat] = useState<"jest" | "playwright" | "cypress">("jest")

  const handleCopy = (testCase: TestCase) => {
    const formatted = formatTestCase(testCase, exportFormat)
    navigator.clipboard.writeText(formatted)
    setCopiedId(testCase.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleExportAll = () => {
    const allTests = testCases.map((tc) => formatTestCase(tc, exportFormat)).join("\n\n")
    const blob = new Blob([allTests], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `test-cases-${exportFormat}.${exportFormat === "jest" ? "test.js" : "spec.js"}`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 sm:p-8">
        <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 mb-4 animate-pulse text-primary" />
        <h3 className="font-semibold text-base sm:text-lg mb-2">Generating Test Cases</h3>
        <p className="text-sm sm:text-base text-muted-foreground text-center max-w-sm">
          Analyzing input and creating comprehensive test scenarios...
        </p>
      </div>
    )
  }

  if (testCases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 sm:p-8">
        <div className="rounded-full bg-muted w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-base sm:text-lg mb-2">No Test Cases Yet</h3>
        <p className="text-sm sm:text-base text-muted-foreground text-center max-w-md px-4">
          Enter a user story or API contract and click generate to create integration test cases
        </p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 bg-background border-b border-border p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Generated Test Cases</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {testCases.length} test scenario{testCases.length !== 1 ? "s" : ""} created
            </p>
          </div>
          <Button onClick={handleExportAll} size="sm" variant="outline" className="w-full sm:w-auto bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            <span className="text-xs sm:text-sm">Export All</span>
          </Button>
        </div>
        <Tabs value={exportFormat} onValueChange={(v) => setExportFormat(v as typeof exportFormat)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jest" className="text-xs sm:text-sm">
              Jest
            </TabsTrigger>
            <TabsTrigger value="playwright" className="text-xs sm:text-sm">
              Playwright
            </TabsTrigger>
            <TabsTrigger value="cypress" className="text-xs sm:text-sm">
              Cypress
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {testCases.map((testCase) => (
            <Card key={testCase.id} className="p-4 sm:p-6 bg-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-semibold text-sm sm:text-base">{testCase.title}</h3>
                    <Badge
                      variant={
                        testCase.type === "positive"
                          ? "default"
                          : testCase.type === "negative"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {testCase.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {testCase.priority}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{testCase.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={() => handleCopy(testCase)}
                  title="Copy test code"
                >
                  {copiedId === testCase.id ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <ClipboardCopy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {testCase.preconditions.length > 0 && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold mb-2 text-foreground">Preconditions</h4>
                    <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                      {testCase.preconditions.map((pre, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span className="flex-1">{pre}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="text-xs sm:text-sm font-semibold mb-2 text-foreground">Test Steps</h4>
                  <ol className="text-xs sm:text-sm text-muted-foreground space-y-1">
                    {testCase.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-primary font-medium flex-shrink-0">{idx + 1}.</span>
                        <span className="flex-1">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-semibold mb-2 text-foreground">Expected Result</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-md p-2 sm:p-3">
                    {testCase.expectedResult}
                  </p>
                </div>

                {Object.keys(testCase.testData).length > 0 && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold mb-2 text-foreground">Test Data</h4>
                    <pre className="text-xs bg-muted p-2 sm:p-3 rounded-md overflow-x-auto border border-border">
                      {JSON.stringify(testCase.testData, null, 2)}
                    </pre>
                  </div>
                )}

                <div>
                  <h4 className="text-xs sm:text-sm font-semibold mb-2 text-foreground">
                    Generated Code ({exportFormat})
                  </h4>
                  <pre className="text-xs bg-background p-3 sm:p-4 rounded-md overflow-x-auto border border-border font-mono leading-relaxed">
                    {formatTestCase(testCase, exportFormat)}
                  </pre>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function formatTestCase(testCase: TestCase, format: "jest" | "playwright" | "cypress"): string {
  switch (format) {
    case "jest":
      return `describe('${testCase.title}', () => {
  test('${testCase.description}', async () => {
    // Arrange
    ${testCase.preconditions.map((p) => `// ${p}`).join("\n    ")}
    ${Object.keys(testCase.testData).length > 0 ? `const testData = ${JSON.stringify(testCase.testData, null, 2)};` : ""}
    
    // Act
    ${testCase.steps.map((s, i) => `// Step ${i + 1}: ${s}`).join("\n    ")}
    
    // Assert
    // ${testCase.expectedResult}
    expect(result).toBeDefined();
  });
});`

    case "playwright":
      return `test('${testCase.title}', async ({ page }) => {
  // ${testCase.description}
  
  // Preconditions
  ${testCase.preconditions.map((p) => `// ${p}`).join("\n  ")}
  
  // Test Steps
  ${testCase.steps.map((s, i) => `// ${i + 1}. ${s}`).join("\n  ")}
  
  // Expected Result: ${testCase.expectedResult}
  await expect(page).toBeDefined();
});`

    case "cypress":
      return `describe('${testCase.title}', () => {
  it('${testCase.description}', () => {
    // Preconditions
    ${testCase.preconditions.map((p) => `// ${p}`).join("\n    ")}
    
    // Test Steps
    ${testCase.steps.map((s, i) => `// ${i + 1}. ${s}`).join("\n    ")}
    
    // Expected Result: ${testCase.expectedResult}
    cy.visit('/');
  });
});`
  }
}
