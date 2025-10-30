# 🚀 ORUS BUILDER - GETTING STARTED GUIDE
## Installation & First Generation in 5 Minutes

**Version:** 1.0  
**Date:** 2025-10-26  
**Status:** 🚀 Production Ready  
**Estimated Time:** 5 minutes

---

## 📋 WHAT YOU'LL LEARN

By the end of this guide, you will:
- ✅ Install ORUS Builder locally
- ✅ Configure AI Provider (Groq or Perplexity)
- ✅ Generate your first code
- ✅ Understand the basic workflow

---

## ⚡ QUICK START (5 MIN)

### Prerequisites

- **Node.js:** v18+ ([Download](https://nodejs.org))
- **Git:** ([Download](https://git-scm.com))
- **API Key:** From Groq or Perplexity (free)

### Step 1: Clone Repository

```bash
git clone https://github.com/OrusMind/Orus-Builder---Cognitive-Generation-FullStack.git
cd orus-builder
```

### Step 2: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

**Time:** ~2-3 minutes (depends on internet speed)

### Step 3: Get AI Provider Key

**Option A: Groq (Fastest & Free)**
```bash
1. Visit: https://console.groq.com
2. Sign up (takes 30 seconds)
3. Go to "API Keys"
4. Copy your key
```

**Option B: Perplexity (Web-Aware)**
```bash
1. Visit: https://www.perplexity.ai/api
2. Sign up
3. Go to API section
4. Create token
```

### Step 4: Configure Environment

```bash
# In backend directory
cd backend

# Create .env file
cat > .env << EOF
# AI Provider
AI_PROVIDER=groq
GROQ_API_KEY=your_key_here

# Server
PORT=5000
NODE_ENV=development
EOF
```

### Step 5: Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Should show: ✅ Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Should show: ✅ Frontend running on http://localhost:3000
```

### Step 6: Generate Your First Code

1. Open browser: `http://localhost:3000/generate`
2. Enter prompt: `"Create a reusable button component"`
3. Click: **"Create Project or Gerar Projeto"**
4. Wait 8-15 seconds
5. Download generated code!

**That's it! 🎉**

---

## 📚 UNDERSTANDING THE FOLDER STRUCTURE

```
orus-builder/
├── frontend/                    # React/Vue frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── PromptInput/    # Main input component
│   │   ├── pages/
│   │   │   └── GeneratePage.tsx
│   │   └── App.tsx
│   ├── package.json
│   └── .env                    # Frontend config
│
├── backend/                     # Express backend
│   ├── src/
│   │   ├── engines/
│   │   │   ├── cognitive-generation-engine.ts
│   │   │   └── orchestrator-engine.ts
│   │   ├── trinity/
│   │   │   └── ai-provider-factory.ts
│   │   ├── routes/
│   │   │   └── api.routes.ts
│   │   └── server.ts           # Main entry
│   ├── package.json
│   └── .env                    # Backend config
│
└── docs/                        # Documentation
    ├── PROMPT-TUTORIAL-GUIDE.md
    ├── PROVIDER-SETUP-GUIDE.md
    ├── ARCHITECTURE-ENGINES.md
    └── GETTING-STARTED.md       # This file!
```

---

## 🎯 BASIC WORKFLOW

### The 3-Step Process

```
┌─────────────────────────┐
│  1. WRITE PROMPT        │  Natural language description
│                         │  (10-5000 characters)
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  2. BACKEND GENERATES   │  Runs through 6-stage pipeline
│                         │  (8-15 seconds)
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  3. DOWNLOAD CODE       │  Get production-ready files
│                         │  as ZIP archive
└─────────────────────────┘
```

### Example Generation

**Your Prompt:**
```
Create a sales dashboard with a chart showing revenue trends, 
a KPI card section, and a data table with sorting. 
Include dark mode support.
```

**Generated Files (12-18 files):**
```
Dashboard/
├── Dashboard.tsx              # Main component
├── Dashboard.types.ts         # TypeScript types
├── Dashboard.styles.css       # Styles
├── Dashboard.test.tsx         # Tests
├── Dashboard.mock.ts          # Mock data
├── Dashboard.stories.tsx      # Storybook
├── RevenueChart.tsx           # Sub-component
├── KPICard.tsx
├── DataTable.tsx
├── hooks/
│   ├── useDarkMode.ts         # Custom hook
│   └── useChartData.ts
└── utils/
    └── formatters.ts          # Utilities
```

**Time to First Code:** ~15 seconds
**Files Generated:** 18
**Lines of Code:** ~800
**Ready to Use:** YES! ✅

---

## 🔧 COMMON TASKS

### Task 1: Change AI Provider

**From Groq to Perplexity:**

```bash
# Edit backend/.env
AI_PROVIDER=perplexity
PERPLEXITY_API_KEY=your_key_here
```

Restart backend:
```bash
# Ctrl+C to stop
npm run dev
```

**Done!** Next generation will use Perplexity.

### Task 2: Generate Different Types

**Simple Component:**
```
Create a reusable button component with hover effects
```
**Result:** 3-5 files, ~100 lines

**Complete Feature:**
```
Dashboard with analytics charts, user management table, 
and activity feed
```
**Result:** 12-20 files, ~500 lines

**Full Application:**
```
Complete e-commerce app with product listing, shopping cart, 
checkout, and admin dashboard. Include authentication.
```
**Result:** 50-80 files, 2000+ lines

### Task 3: Customize Generated Code

1. Download generated ZIP
2. Extract files
3. Import into your project
4. Customize as needed
5. Use as starting point

All code is yours to modify!

### Task 4: Debug Generation Issues

If generation fails:

```bash
# Check backend logs
# Look for error messages in Terminal 1

# Verify API key
cat backend/.env | grep API_KEY

# Test API key
curl -H "Authorization: Bearer YOUR_KEY" \
  https://api.groq.com/health

# Restart backend
# Ctrl+C and npm run dev
```

---

## 🎨 WRITE EFFECTIVE PROMPTS

### Good Prompt Structure

```
[WHAT] + [FEATURES] + [REQUIREMENTS]
```

### Examples

#### ✅ Good
```
Create a product filter component with category, price range, 
and rating filters. Include clear UI and responsive design.
```

#### ❌ Bad
```
Filter component
```

#### ✅ Good
```
Admin dashboard showing user statistics, recent activity, 
and quick action buttons. Should be mobile-responsive and 
support dark mode.
```

#### ❌ Bad
```
Make an admin thing
```

**Tip:** More details = Better code!

---

## 🐛 TROUBLESHOOTING

### Issue: "API_KEY not found"

**Solution:**
```bash
# 1. Check .env exists
ls backend/.env

# 2. Check format
cat backend/.env

# 3. Should look like:
# AI_PROVIDER=groq
# GROQ_API_KEY=gsk_xxxxx

# 4. Restart server
npm run dev
```

---

### Issue: "Cannot find module..."

**Solution:**
```bash
# Make sure you did npm install
cd backend && npm install
cd ../frontend && npm install

# If still failing:
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: "Generation takes too long"

**Solution:**
- Try simpler prompt first
- Check internet connection
- Verify API key is valid
- If using Perplexity, wait longer (includes web search)
- Try Groq for faster results

---

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Option 1: Change port in .env
PORT=5001

# Option 2: Find and kill process using port 5000
# Linux/Mac:
lsof -i :5000
kill -9 <PID>

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📖 NEXT STEPS

### Learn More

1. **Prompt Writing Guide**
   - Read: `PROMPT-TUTORIAL-GUIDE.md`
   - Learn best practices for prompts
   - See examples by use case

2. **Provider Configuration**
   - Read: `PROVIDER-SETUP-GUIDE.md`
   - Configure different AI providers
   - Compare options

3. **Architecture Deep Dive**
   - Read: `ARCHITECTURE-ENGINES.md`
   - Understand how system works internally
   - Learn to extend/contribute

### Try These Prompts

**Component (Beginner):**
```
Create a testimonial card component with quote, author name, 
and star rating
```

**Feature (Intermediate):**
```
Create a settings page with theme toggle, language selector, 
and notification preferences. Include form validation.
```

**Full App (Advanced):**
```
Build a Todo application with add/edit/delete functionality, 
categories, priorities, and due dates. Include authentication 
and dark mode.
```

---

## 💡 PRO TIPS

### Tip 1: Start Simple
First generation should be simple (button, card).
Get comfortable with the flow, then try complex.

### Tip 2: Review Generated Code
Read and understand what was generated.
Learn from examples.

### Tip 3: Iterate & Refine
Don't like result? Regenerate with different prompt!
Prompts are free, only API calls cost.

### Tip 4: Use Caching
Same prompt = instant response (from cache).
Great for testing different frameworks!

### Tip 5: Join Community
- GitHub Issues: Report bugs, request features
- Discord: Ask questions, show off creations
- Twitter: Share your generated projects

---

## ✅ CHECKLIST: You're Ready!

- [ ] Node.js v18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] API key obtained
- [ ] .env configured
- [ ] Backend running (localhost:5000)
- [ ] Frontend running (localhost:3000)
- [ ] Generated first code
- [ ] Downloaded result
- [ ] Read other docs

**Congratulations!** 🎉 You're ready to generate amazing code!

---

## 🆘 GETTING HELP

### Resources

- **Documentation:** `/docs` folder
- **GitHub Issues:** Report bugs
- **Discord Community:** Ask questions
- **Email:** support@orusbuilder.dev

### Before Asking for Help

1. Check the docs folder
2. Search existing GitHub issues
3. Verify your .env file
4. Restart services
5. Try with simpler prompt

---

## 🚀 NEXT MILESTONE

Once comfortable with basics:

1. **Write Custom Prompts** - Create something unique
2. **Tweak Generated Code** - Customize for your needs
3. **Learn Architecture** - Read `ARCHITECTURE-ENGINES.md`
4. **Contribute** - Add features, improve docs
5. **Deploy** - Get it running in production

---

## QUICK REFERENCE

| Task | Command |
|------|---------|
| Install | `npm install` (in backend & frontend) |
| Start Backend | `cd backend && npm run dev` |
| Start Frontend | `cd frontend && npm run dev` |
| Access App | `http://localhost:3000` |
| View Backend Logs | Check Terminal 1 |
| Change Provider | Edit `backend/.env` & restart |
| Get Help | Check `/docs` folder |

---

**Version:** 1.0  
**Last Updated:** 2025-10-26  
**Status:** Production Ready  
**License:** MIT

**Happy generating!** 🧬💎⚡
