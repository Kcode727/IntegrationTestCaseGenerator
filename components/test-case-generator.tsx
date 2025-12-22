"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Sparkles, FileCode } from "lucide-react"
import { TestCaseOutput } from "@/components/test-case-output"
import type { TestCase } from "@/types/test-case"

export default function TestCaseGenerator() {
  const [inputType, setInputType] = useState<"user-story" | "api-contract">("user-story")
  const [inputText, setInputText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [testCases, setTestCases] = useState<TestCase[]>([])
  const [mobileView, setMobileView] = useState<"input" | "output">("input")

  const handleGenerate = async () => {
    if (!inputText.trim()) return

    setIsGenerating(true)

    // Simulate API call to generate test cases
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const generatedCases =
      inputType === "user-story" ? generateFromUserStory(inputText) : generateFromApiContract(inputText)

    setTestCases(generatedCases)
    setIsGenerating(false)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <div className="lg:hidden border-b border-border bg-background">
        <div className="flex">
          <button
            onClick={() => setMobileView("input")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              mobileView === "input" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            Input
          </button>
          <button
            onClick={() => setMobileView("output")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              mobileView === "output" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground"
            }`}
          >
            Output {testCases.length > 0 && `(${testCases.length})`}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Input Section */}
        <div
          className={`w-full lg:w-1/2 border-r border-border overflow-y-auto ${
            mobileView === "output" ? "hidden lg:block" : ""
          }`}
        >
          <div className="bg-background border-b border-border">
            <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Integration Test Case Generator</h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Generate comprehensive integration test cases from user stories or API contracts
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
            <Card className="p-4 sm:p-6">
              <Tabs value={inputType} onValueChange={(v) => setInputType(v as typeof inputType)}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="user-story">User Story</TabsTrigger>
                  <TabsTrigger value="api-contract">API Contract</TabsTrigger>
                </TabsList>

                <TabsContent value="user-story" className="space-y-3">
                  <Label htmlFor="user-story-input">User Story</Label>
                  <Textarea
                    id="user-story-input"
                    placeholder="As a user, I want to log in so that I can access my dashboard"
                    className="min-h-[200px] font-mono text-sm"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: <span className="italic">As a [role], I want to [action] so that [benefit]</span>
                  </p>
                </TabsContent>

                <TabsContent value="api-contract" className="space-y-3">
                  <Label htmlFor="api-contract-input">API Contract</Label>
                  <Textarea
                    id="api-contract-input"
                    placeholder='{"openapi":"3.0.0","paths":{"/api/users":{"get":{}}}}'
                    className="min-h-[200px] font-mono text-sm"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Supports OpenAPI, Swagger, or plain JSON</p>
                </TabsContent>
              </Tabs>

              <Button
                onClick={handleGenerate}
                disabled={!inputText.trim() || isGenerating}
                className="w-full mt-6"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <FileCode className="mr-2 h-4 w-4" />
                    Generate Test Cases
                  </>
                )}
              </Button>
            </Card>

            {/* Feature Highlights */}
            {testCases.length === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FeatureCard title="Smart Analysis" description="Understands user intent and API structure" />
                <FeatureCard title="Complete Coverage" description="Positive, negative, and edge cases included" />
                <FeatureCard title="Jest Ready" description="Outputs clean, readable Jest test code" />
                <FeatureCard title="Best Practices" description="AAA pattern and integration-friendly tests" />
              </div>
            )}
          </div>
        </div>

        {/* Output Section */}
        <div
          className={`w-full lg:w-1/2 bg-muted/40 overflow-hidden ${mobileView === "input" ? "hidden lg:block" : ""}`}
        >
          <TestCaseOutput testCases={testCases} isGenerating={isGenerating} />
        </div>
      </div>
    </div>
  )
}

export { TestCaseGenerator }

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <h4 className="font-medium mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function generateFromUserStory(story: string): TestCase[] {
  const testCases: TestCase[] = []

  // Extract role, action, and benefit
  const roleMatch = story.match(/As an? (.*?),/i) || story.match(/As an? (.*?) I/i)
  const role = roleMatch ? roleMatch[1].trim() : "user"

  const actionMatch = story.match(/I want to (.*?) so that/i) || story.match(/I want to (.*?)$/i)
  const action = actionMatch ? actionMatch[1].trim() : story.substring(0, 100)

  const benefitMatch = story.match(/so that (.*?)$/i)
  const benefit = benefitMatch ? benefitMatch[1].trim() : "achieve the desired outcome"

  // Extract entities and subjects from the story
  const entities = extractEntities(story)
  const primaryEntity = entities[0] || "resource"

  // Extract verbs and actions
  const verbs = extractVerbs(action)
  const primaryVerb = verbs[0] || "interact with"

  // Determine context and feature type
  const context = extractContext(story, action)

  // Generate positive test case with specific details
  testCases.push({
    id: "1",
    title: `${context.feature} - ${role} can successfully ${action}`,
    description: `Verify that a ${role} can successfully ${action} ${benefit ? `to ${benefit}` : ""}`,
    type: "positive",
    priority: "high",
    steps: [
      `User with role "${role}" authenticates with the system`,
      `Navigate to the ${context.feature} interface`,
      `${capitalizeFirst(primaryVerb)} the ${primaryEntity} with valid data`,
      `Submit the request to ${action}`,
      `Verify success response and confirmation message`,
      `Verify the ${primaryEntity} reflects the expected changes`,
    ],
    expectedResult: `${capitalizeFirst(role)} successfully ${action} and the system confirms: "${benefit}"`,
    preconditions: [
      `System is accessible`,
      `${capitalizeFirst(role)} has valid credentials and required permissions`,
      context.prerequisites.length > 0 ? context.prerequisites.join(", ") : "Required data exists in the system",
    ],
    testData: {
      role: role,
      action: action,
      entity: primaryEntity,
      sampleData: generateSampleData(primaryEntity, action),
    },
  })

  // Generate negative test case - missing/invalid input
  testCases.push({
    id: "2",
    title: `${context.feature} - Cannot ${action} with invalid ${primaryEntity} data`,
    description: `Verify that ${role} receives appropriate error when attempting to ${action} with invalid or incomplete ${primaryEntity} information`,
    type: "negative",
    priority: "high",
    steps: [
      `User "${role}" authenticates with the system`,
      `Attempt to ${action} with missing required fields for ${primaryEntity}`,
      `Submit the invalid request`,
      `Verify error response with status code 400`,
      `Verify specific validation error message identifies missing/invalid fields`,
      `Verify the ${primaryEntity} was not modified in the system`,
    ],
    expectedResult: `Request fails with clear validation error: "Unable to ${action}: ${primaryEntity} data is invalid or incomplete"`,
    preconditions: [`System is accessible`],
    testData: {
      role: role,
      invalidData: `Missing required fields for ${primaryEntity}`,
      entity: primaryEntity,
    },
  })

  // Generate negative test case - unauthorized user
  testCases.push({
    id: "3",
    title: `${context.feature} - Unauthorized user cannot ${action}`,
    description: `Verify that users without proper authorization cannot ${action} as intended for ${role}`,
    type: "negative",
    priority: "high",
    steps: [
      `Attempt to ${action} without authentication token`,
      `Verify request is rejected with 401/403 status code`,
      `Verify error message: "Insufficient permissions to ${action}"`,
      `Confirm the ${primaryEntity} remains unchanged`,
      `Test with authenticated user lacking required role`,
      `Verify similar authorization error occurs`,
    ],
    expectedResult: `Unauthorized access prevented: users who are not "${role}" cannot ${action}`,
    preconditions: [`System is accessible`, `Role-based access control is configured`],
    testData: {
      unauthorizedRole: "guest",
      requiredRole: role,
      entity: primaryEntity,
    },
  })

  // Generate edge case - boundary conditions specific to the entity
  const boundaryConditions = generateBoundaryTests(primaryEntity, action)
  testCases.push({
    id: "4",
    title: `${context.feature} - Boundary conditions when ${action}`,
    description: `Verify system correctly handles edge cases and boundary values when ${role} attempts to ${action}`,
    type: "edge-case",
    priority: "medium",
    steps: [
      `Test ${action} with maximum allowed ${boundaryConditions.maxField}`,
      `Test ${action} with minimum allowed ${boundaryConditions.minField}`,
      `Test ${action} with empty or null values for optional fields`,
      `Test ${action} with special characters in ${primaryEntity} ${boundaryConditions.textField}`,
      `Verify appropriate validation or acceptance for each scenario`,
      `Verify data integrity is maintained`,
    ],
    expectedResult: `System handles boundary cases gracefully: accepts valid edge values, rejects invalid ones with clear messages for "${primaryEntity}"`,
    preconditions: [`System is accessible`, `${capitalizeFirst(role)} is authenticated`],
    testData: {
      boundaries: boundaryConditions,
      entity: primaryEntity,
      testScenarios: [
        `Maximum ${boundaryConditions.maxField}`,
        `Minimum ${boundaryConditions.minField}`,
        `Special characters in ${boundaryConditions.textField}`,
      ],
    },
  })

  // Generate edge case - concurrent operations specific to the action
  testCases.push({
    id: "5",
    title: `${context.feature} - Concurrent attempts to ${action}`,
    description: `Verify data consistency when multiple ${role}s attempt to ${action} simultaneously on the same ${primaryEntity}`,
    type: "edge-case",
    priority: "medium",
    steps: [
      `Setup: Create test ${primaryEntity} in known state`,
      `Simulate ${context.concurrencyScenario}`,
      `Execute concurrent requests from multiple ${role} sessions`,
      `Verify the final state of ${primaryEntity} is consistent`,
      `Verify no data corruption or race conditions occurred`,
      `Verify all operations are properly logged with timestamps`,
    ],
    expectedResult: `System maintains data integrity: ${primaryEntity} state is consistent, conflicts are detected and handled appropriately`,
    preconditions: [
      `System supports concurrent access`,
      `Multiple ${role} accounts available for testing`,
      `${primaryEntity} exists and is in testable state`,
    ],
    testData: {
      concurrencyTest: context.concurrencyScenario,
      entity: primaryEntity,
      numberOfSimultaneousUsers: context.concurrencyCount,
    },
  })

  // Add integration-specific test if the story involves multiple systems
  if (story.match(/integrat|connect|sync|webhook|api|external|third[- ]party/i)) {
    testCases.push({
      id: "6",
      title: `${context.feature} - Integration flow when ${role} ${action}`,
      description: `Verify end-to-end integration between systems when ${role} attempts to ${action}`,
      type: "positive",
      priority: "high",
      steps: [
        `${capitalizeFirst(role)} initiates request to ${action}`,
        `Verify request is properly formatted and sent to integrated system`,
        `Monitor for expected response from external system`,
        `Verify data transformation and mapping between systems`,
        `Confirm ${primaryEntity} is updated based on integration response`,
        `Verify audit trail captures integration events`,
      ],
      expectedResult: `Integration completes successfully: ${primaryEntity} is synchronized across systems, ${role} receives confirmation that ${benefit}`,
      preconditions: [
        `All integrated systems are available and accessible`,
        `Integration credentials are valid`,
        `${capitalizeFirst(role)} has permissions for cross-system operations`,
      ],
      testData: {
        integration: "External system integration",
        entity: primaryEntity,
        expectedResponseTime: "< 3 seconds",
      },
    })
  }

  return testCases
}

function generateFromApiContract(contract: string): TestCase[] {
  const testCases: TestCase[] = []
  const lowerContract = contract.toLowerCase()

  try {
    // Try to parse as JSON
    let parsedContract: any = {}
    try {
      parsedContract = JSON.parse(contract)
    } catch {
      // If not valid JSON, analyze as text
      parsedContract = { text: contract }
    }

    // Extract endpoints and methods
    const endpoints: Array<{ path: string; method: string }> = []

    // Check for OpenAPI/Swagger format
    if (parsedContract.paths) {
      Object.keys(parsedContract.paths).forEach((path) => {
        const pathObj = parsedContract.paths[path]
        Object.keys(pathObj).forEach((method) => {
          if (["get", "post", "put", "patch", "delete"].includes(method.toLowerCase())) {
            endpoints.push({ path, method: method.toUpperCase() })
          }
        })
      })
    } else {
      // Extract from text patterns
      const getMatch = contract.match(/GET\s+([/\w-:{}]+)/i) || contract.match(/"get".*?"([/\w-:{}]+)"/i)
      const postMatch = contract.match(/POST\s+([/\w-:{}]+)/i) || contract.match(/"post".*?"([/\w-:{}]+)"/i)
      const putMatch = contract.match(/PUT\s+([/\w-:{}]+)/i) || contract.match(/"put".*?"([/\w-:{}]+)"/i)
      const deleteMatch = contract.match(/DELETE\s+([/\w-:{}]+)/i) || contract.match(/"delete".*?"([/\w-:{}]+)"/i)

      if (getMatch) endpoints.push({ path: getMatch[1], method: "GET" })
      if (postMatch) endpoints.push({ path: postMatch[1], method: "POST" })
      if (putMatch) endpoints.push({ path: putMatch[1], method: "PUT" })
      if (deleteMatch) endpoints.push({ path: deleteMatch[1], method: "DELETE" })
    }

    // If no endpoints found, create generic ones based on common patterns
    if (endpoints.length === 0) {
      if (lowerContract.includes("user")) {
        endpoints.push({ path: "/api/users", method: "GET" })
        endpoints.push({ path: "/api/users", method: "POST" })
      } else if (lowerContract.includes("product")) {
        endpoints.push({ path: "/api/products", method: "GET" })
        endpoints.push({ path: "/api/products", method: "POST" })
      } else if (lowerContract.includes("order")) {
        endpoints.push({ path: "/api/orders", method: "GET" })
        endpoints.push({ path: "/api/orders", method: "POST" })
      } else {
        endpoints.push({ path: "/api/resource", method: "GET" })
        endpoints.push({ path: "/api/resource", method: "POST" })
      }
    }

    let testId = 1

    // Generate test cases for each endpoint
    endpoints.slice(0, 3).forEach((endpoint) => {
      const resourceName = endpoint.path.split("/").pop() || "resource"
      const hasPathParam = endpoint.path.includes(":")

      // Positive test case
      testCases.push({
        id: String(testId++),
        title: `${endpoint.method} ${endpoint.path} - Successful Request`,
        description: `Verify successful ${endpoint.method} request to ${endpoint.path}`,
        type: "positive",
        priority: "high",
        steps: [
          `Send ${endpoint.method} request to ${endpoint.path}`,
          `Include valid headers and authentication`,
          endpoint.method === "POST" || endpoint.method === "PUT" || endpoint.method === "PATCH"
            ? "Include valid request body"
            : "Verify request parameters",
          `Verify response status code is ${endpoint.method === "POST" ? "201" : "200"}`,
          "Verify response body structure matches schema",
        ],
        expectedResult: `Returns ${endpoint.method === "POST" ? "201 Created" : "200 OK"} with expected data structure`,
        preconditions: ["API is running", "Valid authentication token available"],
        testData: {
          endpoint: endpoint.path,
          method: endpoint.method,
          headers: { Authorization: "Bearer <token>", "Content-Type": "application/json" },
        },
      })

      // Negative test case - Invalid data
      if (endpoint.method === "POST" || endpoint.method === "PUT" || endpoint.method === "PATCH") {
        testCases.push({
          id: String(testId++),
          title: `${endpoint.method} ${endpoint.path} - Invalid Data`,
          description: `Verify validation of invalid data for ${endpoint.method} request`,
          type: "negative",
          priority: "high",
          steps: [
            `Send ${endpoint.method} request with invalid/missing fields`,
            "Verify response status code is 400",
            "Verify error message describes validation issues",
            `Verify ${resourceName} was not created/updated`,
          ],
          expectedResult: "Returns 400 Bad Request with validation error details",
          preconditions: ["API is running"],
          testData: {
            endpoint: endpoint.path,
            method: endpoint.method,
            body: { invalid: "data" },
          },
        })
      }

      // Negative test case - Unauthorized
      testCases.push({
        id: String(testId++),
        title: `${endpoint.method} ${endpoint.path} - Unauthorized Access`,
        description: `Verify authentication required for ${endpoint.method} request`,
        type: "negative",
        priority: "high",
        steps: [
          `Send ${endpoint.method} request without authentication token`,
          "Verify response status code is 401",
          "Verify appropriate error message",
        ],
        expectedResult: 'Returns 401 Unauthorized with error message "Authentication required"',
        preconditions: ["API is running"],
        testData: {
          endpoint: endpoint.path,
          method: endpoint.method,
        },
      })

      // Negative test case - Not Found (for endpoints with path params)
      if (hasPathParam || endpoint.method === "GET") {
        testCases.push({
          id: String(testId++),
          title: `${endpoint.method} ${endpoint.path} - Resource Not Found`,
          description: `Verify handling of non-existent ${resourceName}`,
          type: "negative",
          priority: "medium",
          steps: [
            `Send ${endpoint.method} request with non-existent ID`,
            "Verify response status code is 404",
            "Verify appropriate error message",
          ],
          expectedResult: `Returns 404 Not Found with error message "${resourceName} not found"`,
          preconditions: ["API is running"],
          testData: {
            endpoint: endpoint.path.replace(/:\w+/, "99999"),
            method: endpoint.method,
          },
        })
      }
    })

    // Add rate limiting test
    if (testCases.length > 0) {
      testCases.push({
        id: String(testId++),
        title: "API Rate Limiting",
        description: "Verify API rate limiting is enforced",
        type: "edge-case",
        priority: "medium",
        steps: [
          "Send multiple rapid requests to API endpoint",
          "Verify rate limit threshold is enforced",
          "Verify response status code is 429",
          "Verify retry-after header is present",
        ],
        expectedResult: "Returns 429 Too Many Requests when rate limit is exceeded",
        preconditions: ["API is running"],
        testData: {
          description: "Multiple rapid requests",
        },
      })
    }

    return testCases
  } catch (error) {
    // Return generic test cases if parsing fails
    return generateGenericApiTests()
  }
}

function generateGenericApiTests(): TestCase[] {
  return [
    {
      id: "1",
      title: "API Endpoint - Successful Request",
      description: "Verify successful API request with valid data",
      type: "positive",
      priority: "high",
      steps: [
        "Send request to API endpoint with valid parameters",
        "Verify response status code is 200",
        "Verify response contains expected data structure",
      ],
      expectedResult: "Returns 200 OK with valid response data",
      preconditions: ["API is running", "Valid authentication if required"],
      testData: {
        endpoint: "/api/endpoint",
        method: "GET",
      },
    },
    {
      id: "2",
      title: "API Endpoint - Invalid Request",
      description: "Verify error handling for invalid requests",
      type: "negative",
      priority: "high",
      steps: [
        "Send request with invalid parameters",
        "Verify appropriate error status code",
        "Verify error message is descriptive",
      ],
      expectedResult: "Returns error status code with descriptive error message",
      preconditions: ["API is running"],
      testData: {
        endpoint: "/api/endpoint",
        method: "GET",
      },
    },
  ]
}

function extractEntities(text: string): string[] {
  const entities: string[] = []
  const lowerText = text.toLowerCase()

  // Common entities in user stories
  const entityPatterns = [
    /\b(order|orders|product|products|user|users|account|accounts|profile|profiles|payment|payments|cart|booking|bookings|reservation|reservations|ticket|tickets|item|items|document|documents|report|reports|invoice|invoices|message|messages|notification|notifications|comment|comments|post|posts|article|articles|event|events|task|tasks|project|projects|file|files|image|images|video|videos|customer|customers|employee|employees)\b/g,
  ]

  entityPatterns.forEach((pattern) => {
    const matches = text.match(pattern)
    if (matches) {
      matches.forEach((match) => {
        if (!entities.includes(match)) {
          entities.push(match)
        }
      })
    }
  })

  // If no common entities found, extract nouns from the action
  if (entities.length === 0) {
    const nounMatch = text.match(/\b(my|the|a|an) ([a-z]+)/i)
    if (nounMatch) {
      entities.push(nounMatch[2])
    }
  }

  return entities.length > 0 ? entities : ["item"]
}

function extractVerbs(action: string): string[] {
  const verbs: string[] = []
  const commonVerbs = [
    "create",
    "add",
    "update",
    "edit",
    "modify",
    "delete",
    "remove",
    "view",
    "see",
    "display",
    "search",
    "find",
    "filter",
    "sort",
    "upload",
    "download",
    "send",
    "receive",
    "submit",
    "approve",
    "reject",
    "cancel",
    "book",
    "reserve",
    "purchase",
    "pay",
    "login",
    "logout",
    "register",
    "authenticate",
    "share",
    "export",
    "import",
    "sync",
  ]

  commonVerbs.forEach((verb) => {
    if (action.toLowerCase().includes(verb)) {
      verbs.push(verb)
    }
  })

  return verbs.length > 0 ? verbs : ["perform"]
}

function extractContext(
  story: string,
  action: string,
): {
  feature: string
  prerequisites: string[]
  concurrencyScenario: string
  concurrencyCount: number
} {
  const lowerStory = story.toLowerCase()
  const lowerAction = action.toLowerCase()

  let feature = "Feature"
  const prerequisites: string[] = []
  let concurrencyScenario = "multiple users accessing the resource"
  let concurrencyCount = 3

  // Determine feature name and specific context
  if (lowerStory.includes("login") || lowerStory.includes("sign in") || lowerStory.includes("authenticate")) {
    feature = "User Authentication"
    prerequisites.push("User account exists in system")
    concurrencyScenario = "multiple login attempts from different locations"
  } else if (lowerStory.includes("register") || lowerStory.includes("sign up")) {
    feature = "User Registration"
    concurrencyScenario = "simultaneous registrations with similar email addresses"
  } else if (lowerStory.includes("order") || lowerStory.includes("purchase")) {
    feature = "Order Management"
    prerequisites.push("Products available in inventory", "Payment method configured")
    concurrencyScenario = "multiple users ordering the last available item"
    concurrencyCount = 5
  } else if (lowerStory.includes("payment") || lowerStory.includes("checkout")) {
    feature = "Payment Processing"
    prerequisites.push("Valid payment method", "Sufficient funds/credit")
    concurrencyScenario = "duplicate payment submissions"
  } else if (lowerAction.includes("create") || lowerAction.includes("add")) {
    feature = "Resource Creation"
    concurrencyScenario = "simultaneous creation of resources with same identifiers"
  } else if (lowerAction.includes("update") || lowerAction.includes("edit")) {
    feature = "Resource Update"
    prerequisites.push("Resource exists in system")
    concurrencyScenario = "conflicting updates to the same resource"
  } else if (lowerAction.includes("delete") || lowerAction.includes("remove")) {
    feature = "Resource Deletion"
    prerequisites.push("Resource exists and is not referenced by other entities")
    concurrencyScenario = "simultaneous deletion attempts on the same resource"
  } else if (lowerAction.includes("view") || lowerAction.includes("display")) {
    feature = "Data Retrieval"
    prerequisites.push("Data exists in system")
    concurrencyScenario = "high-volume concurrent read operations"
    concurrencyCount = 20
  }

  return { feature, prerequisites, concurrencyScenario, concurrencyCount }
}

function generateSampleData(entity: string, action: string): any {
  const samples: Record<string, any> = {
    user: { username: "test_user", email: "test@example.com", password: "SecurePass123!" },
    account: { accountName: "Test Account", accountType: "Premium" },
    product: { name: "Sample Product", price: 29.99, sku: "PROD-001" },
    order: { orderId: "ORD-12345", total: 99.99, items: ["item1", "item2"] },
    payment: { amount: 99.99, currency: "USD", method: "credit_card" },
    booking: { date: "2024-01-15", time: "14:00", duration: 60 },
    profile: { firstName: "John", lastName: "Doe", bio: "Test user profile" },
    message: { subject: "Test Message", body: "Sample message content", recipient: "user@example.com" },
    file: { fileName: "document.pdf", fileSize: "2MB", fileType: "application/pdf" },
    cart: { items: [{ productId: "123", quantity: 2 }], subtotal: 59.98 },
  }

  return samples[entity.toLowerCase()] || { name: `Sample ${entity}`, id: "TEST-001" }
}

function generateBoundaryTests(
  entity: string,
  action: string,
): {
  maxField: string
  minField: string
  textField: string
} {
  const boundaries: Record<string, any> = {
    user: { maxField: "username length (50 chars)", minField: "username length (3 chars)", textField: "username" },
    product: { maxField: "price value ($999,999)", minField: "price value ($0.01)", textField: "description" },
    order: { maxField: "item quantity (9999)", minField: "item quantity (1)", textField: "notes" },
    payment: { maxField: "amount ($100,000)", minField: "amount ($0.01)", textField: "description" },
    message: { maxField: "message length (5000 chars)", minField: "message length (1 char)", textField: "content" },
    file: { maxField: "file size (100MB)", minField: "file size (1KB)", textField: "filename" },
    booking: { maxField: "duration (8 hours)", minField: "duration (15 minutes)", textField: "notes" },
  }

  return (
    boundaries[entity.toLowerCase()] || {
      maxField: "field value (max limit)",
      minField: "field value (min limit)",
      textField: "text field",
    }
  )
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
