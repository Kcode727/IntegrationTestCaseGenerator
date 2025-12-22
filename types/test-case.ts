export interface TestCase {
  id: string
  title: string
  description: string
  type: "positive" | "negative" | "edge"
  priority: "high" | "medium" | "low"
  steps: string[]
  expectedResult: string
  preconditions: string[]
  testData: Record<string, any>
}
