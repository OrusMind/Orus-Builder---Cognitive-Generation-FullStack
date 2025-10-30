# 🧬 ORUS BUILDER - PROMPT TUTORIAL & DOCUMENTATION
## The Art of Natural Language Code Generation

**Version:** 3.0  
**Date:** 2025-10-26  
**Status:** 🚀 Production Ready  
**Audience:** Developers, Open Source Community

---

## 📖 TABLE OF CONTENTS

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Prompt Structure & Best Practices](#prompt-structure--best-practices)
4. [Scope Detection Guide](#scope-detection-guide)
5. [Examples by Use Case](#examples-by-use-case)
6. [Advanced Techniques](#advanced-techniques)
7. [Common Mistakes & How to Fix](#common-mistakes--how-to-fix)
8. [FAQ](#faq)

---

## INTRODUCTION

### What is ORUS Builder?

ORUS Builder is an **AI-powered code generation engine** that transforms natural language descriptions into production-ready code. Unlike traditional code generators that require configuration files or UI selections, ORUS Builder uses **artificial intelligence to automatically detect the complexity and scope** of your project based solely on your prompt description.

### How It Works

```
┌─────────────────────────────────────┐
│  You describe what you want         │
│  in natural language (up to 5000)   │
└─────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Trinity AI analyzes your prompt    │
│  - Extracts entities & requirements │
│  - Detects project complexity       │
│  - Identifies technology stack      │
└─────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  AI decides SCOPE automatically     │
│  - Single Component (3-5 files)     │
│  - Feature (6-12 files)             │
│  - Landing Page (8-15 files)        │
│  - Backend API (10-20 files)        │
│  - Fullstack (30-60 files)          │
└─────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Production-ready code generated    │
│  - React/Vue/Angular components     │
│  - TypeScript types                 │
│  - Tests & Mocks                    │
│  - Storybook stories                │
│  - Complete styles                  │
└─────────────────────────────────────┘
```

### The Philosophy: "Natural Language First"

ORUS Builder operates on a simple principle: **The AI is smarter than you at deciding complexity**.

Instead of choosing from dropdowns like "Minimal", "Standard", "Feature Rich", etc., you simply **describe what you want**. The system analyzes your description and automatically determines the appropriate scope.

**Why?**
- ✅ Less decision fatigue for users
- ✅ More accurate results (AI understands context)
- ✅ Natural writing process (like talking to a developer)
- ✅ Better code quality (system optimizes for intent, not user selection)

---

## GETTING STARTED

### Step 1: Access ORUS Builder

Navigate to the web interface:
```
http://localhost:3000/generate
```

Or use the REST API:
```bash
curl -X POST http://localhost:5000/api/v1/generation/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Your prompt here",
    "framework": "react",
    "language": "typescript"
  }'
```

### Step 2: Write Your Prompt

The prompt input supports:
- **Minimum:** 10 characters
- **Maximum:** 5000 characters
- **Language:** Portuguese, English, or mix of both
- **Format:** Natural language (no special syntax needed)

### Step 3: Submit

Click **"Gerar Projeto"** or press **Ctrl+Enter**

### Step 4: Download

Wait for generation to complete (~8-15 seconds), then download your code as a ZIP file.

---

## PROMPT STRUCTURE & BEST PRACTICES

### The Anatomy of a Good Prompt

```
[WHAT] + [DETAILS] + [FEATURES] + [REQUIREMENTS]
```

#### 1. **WHAT** (Required)
Describe the main deliverable:
```
✅ GOOD:
"Create a dashboard"

✅ BETTER:
"Build a sales dashboard"

✅ BEST:
"Create an admin dashboard for e-commerce"
```

#### 2. **DETAILS** (Recommended)
Add specifics about the component:
```
✅ GOOD:
"Dashboard with graphs"

✅ BETTER:
"Dashboard with line graphs showing sales trends"

✅ BEST:
"Dashboard with 3 line graphs (daily/weekly/monthly sales), 
a KPI card section, and a data table with filters"
```

#### 3. **FEATURES** (Recommended)
Specify what functionality is needed:
```
✅ GOOD:
"Dark mode support"

✅ BETTER:
"Dark mode toggle, responsive design, export to CSV"

✅ BEST:
"Dark/light mode toggle, fully responsive (mobile/tablet/desktop), 
export data to CSV, date range filter, real-time updates"
```

#### 4. **REQUIREMENTS** (Optional but Powerful)
Mention technical or business requirements:
```
✅ GOOD:
"Uses TypeScript"

✅ BETTER:
"Built with React and TypeScript, with unit tests"

✅ BEST:
"Built with React 18 + TypeScript, uses Redux for state management, 
includes unit tests with Jest, accessibility compliant (WCAG 2.1)"
```

### The Formula

```
[Simple Adjective] [Type] with [Feature 1], [Feature 2], and [Feature 3]. 
[Additional Requirements]
```

### Examples

#### Example 1 (Simple)
```
Create a reusable button component with multiple variants 
(primary, secondary, danger), hover states, and loading animation.
```
**Expected Scope:** SINGLE_COMPONENT (3-5 files)

#### Example 2 (Medium)
```
Build a landing page for a SaaS product. Include hero section, 
features showcase with icons, pricing table with comparison, 
testimonials carousel, FAQ accordion, and contact form.
```
**Expected Scope:** LANDING_PAGE (8-15 files)

#### Example 3 (Complex)
```
Create a complete project management dashboard with:
- User authentication (login/register)
- Project list with filters and search
- Kanban board for tasks (drag & drop)
- Team collaboration features
- Real-time notifications
- Dark mode support
- Mobile responsive design
Built with React, TypeScript, Redux, and include comprehensive tests.
```
**Expected Scope:** FEATURE (12-20 files)

#### Example 4 (Fullstack)
```
Build a complete blog application with:
Frontend: Post listing page, individual post pages, author pages, 
search functionality, dark/light mode, responsive design
Backend: REST API with post, author, and comment endpoints, 
authentication system, database integration
Database: PostgreSQL schema with posts, authors, comments, and users tables
Include: Unit tests, API documentation, Docker setup
```
**Expected Scope:** FULLSTACK (35-50 files)

---

## SCOPE DETECTION GUIDE

The AI automatically detects which category your project falls into based on keywords and context:

### 1. SINGLE_COMPONENT (3-5 files)

**Keywords detected:** button, card, input, dropdown, modal, badge, spinner, etc.

**When to use:**
- Creating reusable UI components
- Building component library items
- Simple, isolated functionality

**Example prompts:**
```
✅ "Create a customizable button component with variants"
✅ "Build a card component for product display"
✅ "Make a date picker input field"
✅ "Simple dropdown select component"
```

**Output includes:**
- Component file (.tsx)
- Types file (.types.ts)
- Styles file (.styles.css or .scss)
- Mock data (.mock.ts)
- Tests (.test.tsx)

---

### 2. FEATURE (6-12 files)

**Keywords detected:** dashboard, admin panel, feature, form, page, section

**When to use:**
- Building a specific feature within an app
- Mid-complexity components with multiple parts
- Pages with several integrated elements

**Example prompts:**
```
✅ "Dashboard with graphs and metrics"
✅ "Admin panel for user management"
✅ "Settings page with multiple tabs"
✅ "Product catalog with filters and search"
```

**Output includes:**
- Component files
- Sub-components
- Types & interfaces
- Styles
- Mock data
- Tests & Storybook

---

### 3. LANDING_PAGE (8-15 files)

**Keywords detected:** landing, hero, marketing, promotional, sales page

**When to use:**
- Creating marketing/promotional pages
- Landing pages for products or services
- Static pages with hero sections

**Example prompts:**
```
✅ "Landing page for SaaS product"
✅ "Marketing website for agency"
✅ "Promotional page with testimonials"
✅ "Product showcase with pricing"
```

**Output includes:**
- Hero section component
- Features component
- Pricing component
- Testimonials carousel
- FAQ section
- Contact form
- All with styles, types, and tests

---

### 4. BACKEND (10-20 files)

**Keywords detected:** API, backend, database, server, endpoints, routes, middleware

**When to use:**
- Building REST APIs
- Creating backend services
- Database operations

**Example prompts:**
```
✅ "REST API for user management with authentication"
✅ "Backend API for blog posts and comments"
✅ "Server with endpoints for product catalog"
```

**Output includes:**
- Route handlers
- Controllers
- Models/Services
- Database migrations
- Authentication middleware
- API documentation
- Tests

---

### 5. FULLSTACK (30-60 files)

**Keywords detected:** fullstack, full stack, system, complete application, frontend + backend

**When to use:**
- Building complete applications
- Projects requiring frontend AND backend
- Complex systems with database

**Example prompts:**
```
✅ "Complete e-commerce system with frontend, backend, and database"
✅ "Full-stack project management application"
✅ "Complete blog platform with admin panel"
```

**Output includes:**
- Complete Frontend (components, pages, routing)
- Complete Backend (APIs, authentication)
- Database (migrations, models)
- Tests (unit + integration)
- Docker configuration
- Documentation

---

## EXAMPLES BY USE CASE

### Use Case 1: Component Library

**Scenario:** You're building a design system

**Prompt:**
```
Create a badge component with multiple color variants (primary, success, 
warning, error) and sizes (small, medium, large). Include hover effects 
and support for icon + text combinations.
```

**Expected Output:**
- Badge.tsx
- Badge.types.ts
- Badge.styles.css
- Badge.mock.ts
- Badge.test.tsx
- Badge.stories.tsx

**Generated Features:**
- ✅ Responsive design
- ✅ TypeScript types
- ✅ CSS-in-JS with Tailwind
- ✅ Unit tests
- ✅ Storybook stories
- ✅ Accessibility (ARIA)

---

### Use Case 2: Admin Dashboard

**Scenario:** Building an admin interface for SaaS app

**Prompt:**
```
Create an admin dashboard with:
- User management table (add, edit, delete, sort, pagination)
- Sales metrics with line chart showing revenue trends
- Recent activity feed
- Quick stats cards (total users, active sessions, revenue)
- Date range filter
- Export data to CSV button
Dark mode support, fully responsive, TypeScript strict mode, 
include unit and integration tests.
```

**Expected Output:** 12-18 files including:
- Dashboard.tsx (main layout)
- UserTable.tsx
- MetricsChart.tsx
- ActivityFeed.tsx
- StatsCard.tsx
- All with types, styles, mocks, tests

**Generated Features:**
- ✅ State management (Redux)
- ✅ Data fetching (RTK Query)
- ✅ Charts (Recharts/Chart.js)
- ✅ Complex tables (sorting, pagination, filtering)
- ✅ Dark mode
- ✅ Accessibility
- ✅ Performance optimizations

---

### Use Case 3: API Backend

**Scenario:** Building a REST API for mobile app

**Prompt:**
```
Create a REST API with the following endpoints:

Authentication:
- POST /auth/register - user registration
- POST /auth/login - user login
- POST /auth/refresh - refresh token

Users:
- GET /users/:id - get user profile
- PUT /users/:id - update profile
- DELETE /users/:id - delete account

Posts:
- GET /posts - list posts with pagination
- POST /posts - create post
- GET /posts/:id - get post details
- PUT /posts/:id - update post
- DELETE /posts/:id - delete post

Database: PostgreSQL with Prisma ORM
Authentication: JWT tokens
Include: input validation, error handling, logging, tests
```

**Expected Output:** 15-20 files including:
- auth.routes.ts
- users.routes.ts
- posts.routes.ts
- auth.controller.ts
- users.controller.ts
- posts.controller.ts
- Database migrations
- Tests

---

### Use Case 4: Full-Stack Application

**Scenario:** Building complete e-commerce app

**Prompt:**
```
Build a complete e-commerce platform with:

FRONTEND:
- Product listing page with filters (category, price, rating)
- Product detail page with images gallery and reviews
- Shopping cart (add/remove items, quantity adjustment)
- Checkout process (shipping, payment)
- User authentication (login/register)
- Order history page
- Admin dashboard for product management
- Responsive design (mobile/tablet/desktop)
- Dark mode support

BACKEND:
- User authentication and authorization
- Product catalog API
- Shopping cart management
- Order processing
- Payment integration (Stripe ready)
- Admin APIs for product management

DATABASE:
- PostgreSQL with users, products, orders, reviews tables
- Proper relationships and constraints

TECH STACK:
- Frontend: React, TypeScript, Redux, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL with Prisma
- Testing: Jest, React Testing Library

Include: Unit tests, integration tests, API docs, Docker setup, CI/CD ready
```

**Expected Output:** 50-80 files including:
- Complete React frontend with routing
- Express backend with all endpoints
- Database migrations
- Authentication system
- Complete test coverage
- Docker configuration
- Environment setup docs

---

## ADVANCED TECHNIQUES

### 1. Context-Rich Descriptions

**Pattern:** [What] + [Why] + [How]

**Example:**
```
Create a real-time chat component for a support dashboard 
(so support agents can help customers). It should display 
conversation history, auto-scroll to latest messages, 
show typing indicators, and handle emoji reactions.
```

**Why it's better:**
- AI understands the context (support use case)
- Justification helps AI make better design decisions
- Implementation hints guide the generation

### 2. Technology Stack Hints

If you prefer specific technologies, mention them:

```
✅ "Build using React Hooks + Context API instead of Redux"
✅ "Use Tailwind CSS for styling"
✅ "Implement with Next.js 13+ App Router"
✅ "Use Zod for validation"
```

### 3. Specification Details

For complex projects, be specific about business logic:

```
✅ "Calculate discount: 10% off orders > $100, 15% off > $500"
✅ "User roles: admin (full access), moderator (edit others), user (edit own)"
✅ "Email validation: RFC 5322 compliant"
```

### 4. Accessibility Requirements

Call out accessibility explicitly:

```
✅ "WCAG 2.1 AAA compliant"
✅ "Support keyboard navigation throughout"
✅ "Include ARIA labels for screen readers"
✅ "Ensure 4.5:1 contrast ratio for text"
```

### 5. Performance Considerations

Mention performance needs:

```
✅ "Optimized for 1000+ item lists with virtualization"
✅ "Under 3s page load time on 4G"
✅ "Memoize expensive computations"
```

---

## COMMON MISTAKES & HOW TO FIX

### ❌ Mistake 1: Too Vague

**WRONG:**
```
"Create a dashboard"
```

**WHY:** AI doesn't know what kind of dashboard, what data, what features

**RIGHT:**
```
"Create a sales analytics dashboard showing daily, weekly, and monthly 
revenue trends with charts, key metrics cards, and an interactive 
data table with sorting and filtering."
```

---

### ❌ Mistake 2: Too Technical

**WRONG:**
```
"Create a React component using HOCs with Redux selectors and 
middleware orchestration patterns"
```

**WHY:** Overcomplicating makes AI miss the actual user need

**RIGHT:**
```
"Create a product filter component that updates a list as users 
select categories, price ranges, and ratings"
```

---

### ❌ Mistake 3: Missing Context

**WRONG:**
```
"Add payment"
```

**WHY:** Too vague - payment button? Payment form? Payment processing?

**RIGHT:**
```
"Add a payment form that accepts credit card information, 
validates it, and processes payment through Stripe"
```

---

### ❌ Mistake 4: Mixing Multiple Unrelated Projects

**WRONG:**
```
"Create a blog app AND a shop AND a forum"
```

**WHY:** These are 3 separate applications

**RIGHT:**
```
"Create a blog application with..." (one prompt per project)
```

---

### ❌ Mistake 5: Unrealistic Expectations

**WRONG:**
```
"Create a complete AI-powered SaaS platform with ML model training, 
vector databases, and real-time collaboration in one component"
```

**WHY:** This is too complex for one generation

**RIGHT:**
```
"Create a document collaboration interface with real-time editing, 
cursor tracking, and version history" 
(for frontend component-level generation)
```

---

## FAQ

### Q1: How long does generation take?

**A:** Typically 8-15 seconds depending on project complexity. Fullstack projects may take 15-20 seconds.

### Q2: Can I use non-English prompts?

**A:** Yes! ORUS Builder supports English, Portuguese, and mixed-language prompts.

**Example:**
```
"Crie um dashboard com gráficos de vendas e tabela de produtos. 
Include dark mode support and responsive design."
```

### Q3: What if the generated code isn't exactly what I want?

**A:** You can:
1. Regenerate with a more specific prompt
2. Manually edit the generated code (it's meant to be a starting point)
3. Provide feedback for future versions

### Q4: Can I use the generated code commercially?

**A:** Yes! Generated code is yours to use, modify, and distribute freely.

### Q5: Does ORUS Builder support frameworks other than React?

**A:** Currently supports React, Vue, and Angular. More coming soon!

### Q6: Can I request specific libraries (Redux, Zustand, Recoil)?

**A:** Mention them in your prompt! Example:
```
"Create a dashboard using Zustand for state management and 
SWR for data fetching"
```

### Q7: How accurate is the scope detection?

**A:** ~90% accuracy. If it detects the wrong scope, you can:
- Add more detail to your prompt
- Manually override in future versions
- Report issues for improvement

### Q8: Can I generate multiple projects at once?

**A:** One prompt = one project. For multiple projects, create separate prompts.

### Q9: Is the generated code production-ready?

**A:** It's a solid foundation! We recommend:
- Review generated code
- Add business-specific logic
- Test thoroughly in your environment
- Follow security best practices

### Q10: How do I report issues with generated code?

**A:** Create an issue on our GitHub with:
- Your original prompt
- Generated code snippet
- What's wrong/what you expected
- Your framework and version

---

## PROMPT EXAMPLES REFERENCE

### Quick Reference Table

| Type | Example Prompt | Expected Files | Complexity |
|------|---|---|---|
| **Component** | "Create a reusable button" | 3-5 | Simple |
| **Feature** | "Dashboard with charts" | 6-12 | Medium |
| **Landing** | "SaaS marketing page" | 8-15 | Medium |
| **Backend** | "REST API for users" | 10-20 | High |
| **Fullstack** | "Complete e-commerce" | 35-60 | Very High |

---

## BEST PRACTICES CHECKLIST

Before submitting your prompt, verify:

- ✅ **Minimum 10 characters** (maximum 5000)
- ✅ **Clear main objective** (what are you building?)
- ✅ **Specific features** (what should it do?)
- ✅ **Context** (why is this being built?)
- ✅ **Requirements** (any tech preferences or constraints?)
- ✅ **Not too vague** (avoid single-word descriptions)
- ✅ **Not too specific** (let AI make design decisions)
- ✅ **Natural language** (no special syntax needed)
- ✅ **One project** (don't mix multiple unrelated apps)
- ✅ **Realistic scope** (achievable in one generation pass)

---

## TIPS FOR GETTING BETTER RESULTS

1. **Be Descriptive:** More details = better code
2. **Include Examples:** "Like Figma's component panel"
3. **Mention Constraints:** "Mobile-first, accessibility-focused"
4. **Use Comparisons:** "Similar to Stripe Dashboard"
5. **State the Goal:** "This is for enterprise users"
6. **Include Context:** "Part of a larger SaaS app"
7. **Mention Scale:** "Needs to handle 10K+ records"
8. **Specify Integrations:** "Connect to Firebase, Stripe"

---

## TROUBLESHOOTING

### Generation Failed?

1. Check prompt is 10+ characters
2. Ensure no special formatting characters
3. Try a simpler version first
4. Check internet connection
5. Report if issue persists

### Generated Code Not What I Expected?

1. Regenerate with more specific prompt
2. Provide examples of what you want
3. Mention specific libraries/patterns
4. Break into smaller requests

### Performance Issues?

1. Try with smaller dataset descriptions
2. Request optimization explicitly
3. Mention performance targets

---

## NEXT STEPS

1. **Try Your First Generation:** Start with a simple component
2. **Read Generated Code:** Understand the structure
3. **Customize:** Add business logic and polish
4. **Share Feedback:** Help us improve!
5. **Explore Advanced:** Try more complex projects

---

## ADDITIONAL RESOURCES

- **GitHub:** [github.com/tulio-orus/orus-builder](https://github.com/tulio-orus/orus-builder)
- **Issues & Feedback:** Report problems and suggestions
- **Community:** Join our Discord for questions
- **Roadmap:** See what's coming next

---

## CONCLUSION

The art of prompting is about **clear communication with AI**. The better you describe what you want, the better code you get. 

Remember: **ORUS Builder is your coding partner, not a magic wand.** Give it good information, and it will generate good code.

---

**Happy generating! 🚀**

---

**Document Version:** 3.0  
**Last Updated:** 2025-10-26  
**Status:** Production Ready  
**License:** MIT (same as ORUS Builder)
