# PRD: CNC TECH Detail Page Automation Web App MVP

## 1. Project Overview

Build an internal admin web app for CNC TECH that generates high-converting product detail page copy for coffee products.

This is not a simple copy/paste template tool.
The app should allow an operator to input product data, store brand rules, optionally attach research summaries, and generate the following outputs:

1. Smart Store detail page copy
2. Company website product section copy
3. Blog draft
4. Instagram card/news caption copy
5. FAQ
6. CTA variants

This tool is for internal use by one admin at first.

---

## 2. Product Goal

The purpose of this app is to systemize product marketing content production for CNC TECH.

The app must:
- reduce manual writing time
- keep brand tone consistent
- produce reusable multi-channel output
- support future startup use after testing in the company

---

## 3. Core User

Primary user:
- single internal admin/operator

Future users:
- internal marketer
- outsourced designer/editor

---

## 4. Brand Rules

Use the following brand rules as the default global rules.

### Brand Name
주식회사 씨앤씨테크 / CNC TECH

### Brand Positioning
로컬에 신뢰할 수 있는 로스팅 전문 업체

### Tone
- professional
- trustworthy
- consistent
- data-based
- practical
- grounded

### Avoid
- exaggerated marketing claims
- vague emotional-only language
- unsupported “best”, “ultimate”, “perfect” statements
- generic coffee clichés with no explanation

### Prioritize
- roasting intent
- why the flavor tastes that way
- extraction recommendation
- freshness
- practical customer use cases
- purchase conversion structure

---

## 5. MVP Features

### 5.1 Product Input Form

Create a product creation/edit page with the following fields.

#### Required Fields
- productName: string
- category: enum
  - espresso_blend
  - drip_blend
  - decaf
  - single_origin
- beanComposition: text
- roastPoint: text
- tastingNotes: string[]
- bodyScore: integer (1-5)
- acidityScore: integer (1-5)
- sweetnessScore: integer (1-5)
- balanceScore: integer (1-5)
- recommendedBrewMethods: string[]
- targetCustomer: text
- weightOptions: string[]
- priceInfo: text
- differentiators: string[]
- shippingFreshnessInfo: text

#### Optional Fields
- reviewTexts: string[]
- grindOptions: string[]
- faqSeedNotes: string[]
- photoNotes: text
- researchSummary: text

### 5.2 Brand Rules Management
Create a settings page where the admin can view and edit:
- brand name
- positioning
- tone rules
- avoid rules
- priority rules

### 5.3 Generate Content
Create a “Generate” action that produces:

- smartStoreCopy
- websiteCopy
- blogDraft
- instagramCopy
- faqItems (10 items)
- ctaVariants (5 items)

Generation should use:
- product data
- brand rules
- optional research summary

### 5.4 Save / Versioning
The admin must be able to:
- save a product draft
- update a product
- duplicate an existing product
- save generated outputs
- view previous generated versions

### 5.5 Export
Allow export/copy actions for each output block:
- copy to clipboard
- export as markdown
- export as plain text

---

## 6. Output Structure Requirements

### 6.1 Smart Store Copy
Should generate long-form conversion-oriented detail page text using this structure:

1. Hero headline
2. core customer benefit
3. why this coffee is different
4. roasting / blending intent
5. taste explanation
6. recommended customer and use cases
7. grind / extraction guide
8. customer review summary
9. FAQ
10. CTA

### 6.2 Website Copy
Should generate section-based copy for a product page:
- hero
- short summary
- taste profile
- differentiation
- brewing guide
- FAQ
- CTA

### 6.3 Blog Draft
Should generate SEO-friendly blog draft with:
- title
- intro
- product story
- roasting explanation
- taste profile
- who it is good for
- brewing guide
- conclusion

### 6.4 Instagram Copy
Should generate:
- short caption
- card/news slide copy blocks
- short CTA

### 6.5 FAQ
Generate 10 practical questions and answers based on product and coffee buying context.

### 6.6 CTA Variants
Generate 5 CTA options with different tones:
- direct
- soft
- trust-based
- freshness-based
- practical purchase-based

---

## 7. Screens

### 7.1 Dashboard
Show:
- recent products
- last updated date
- generation status
- quick actions:
  - new product
  - duplicate product
  - open settings

### 7.2 Product Form Page
Sections:
- basic info
- flavor profile
- use cases
- reviews
- grind & brew guide
- research summary
- photo notes

Actions:
- save draft
- generate content
- duplicate
- delete

### 7.3 Generated Results Page
Tabbed interface:
- Smart Store
- Website
- Blog
- Instagram
- FAQ
- CTA

Each tab must support:
- edit text
- copy
- export
- save version

### 7.4 Brand Rules Settings Page
Editable fields for all brand rules.

---

## 8. Data Model

Use Supabase as the database.

### Table: products
- id: uuid
- product_name: text
- category: text
- bean_composition: text
- roast_point: text
- tasting_notes: jsonb
- body_score: int
- acidity_score: int
- sweetness_score: int
- balance_score: int
- recommended_brew_methods: jsonb
- target_customer: text
- weight_options: jsonb
- price_info: text
- differentiators: jsonb
- shipping_freshness_info: text
- review_texts: jsonb
- grind_options: jsonb
- faq_seed_notes: jsonb
- photo_notes: text
- research_summary: text
- created_at: timestamp
- updated_at: timestamp

### Table: brand_rules
- id: uuid
- brand_name: text
- positioning: text
- tone_rules: jsonb
- avoid_rules: jsonb
- priority_rules: jsonb
- updated_at: timestamp

### Table: generated_outputs
- id: uuid
- product_id: uuid
- version_number: int
- smartstore_copy: text
- website_copy: text
- blog_draft: text
- instagram_copy: text
- faq_items: jsonb
- cta_variants: jsonb
- created_at: timestamp

---

## 9. API Requirements

Build API routes in Next.js.

### POST /api/generate
Input:
- product data
- brand rules
- research summary

Output:
- smartStoreCopy
- websiteCopy
- blogDraft
- instagramCopy
- faqItems
- ctaVariants

For now, implement with mock generator logic or placeholder service abstraction so that LLM integration can be swapped later.

### CRUD APIs
Implement:
- create product
- update product
- get product
- list products
- duplicate product
- delete product
- create generated output version
- list generated output versions
- get brand rules
- update brand rules

---

## 10. Tech Stack

Use:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- Zod
- React Hook Form

Use server actions or API routes where appropriate.

---

## 11. UI Requirements

- clean admin interface
- desktop-first
- responsive enough for tablet
- form should be easy to scan
- generated result tabs should be readable
- use cards and clear section separators
- use toast feedback for save/copy/export actions

---

## 12. Validation Rules

- required fields should be validated
- scores must be 1 to 5
- arrays should not break if empty
- product save should work before generation
- generation should gracefully handle missing optional fields

---

## 13. Non-Goals for MVP

Do NOT implement in MVP:
- public storefront
- automatic posting to Naver Smart Store
- Instagram API publishing
- user roles beyond one admin
- image generation
- analytics dashboard
- advanced SEO metrics

---

## 14. Seed Data

Create one seeded example product:
- productName: 아폴로 블렌드
- category: espresso_blend
- tastingNotes: ["초콜릿", "카라멜", "스모키"]
- bodyScore: 5
- acidityScore: 1
- sweetnessScore: 4
- balanceScore: 4
- recommendedBrewMethods: ["에스프레소", "카페라떼", "아이스 아메리카노"]
- targetCustomer: "묵직한 바디감과 진한 초콜릿 풍미를 선호하는 고객"
- weightOptions: ["200g", "500g", "1kg"]
- priceInfo: "200g 9,900원 / 500g 21,900원 / 1kg 40,000원"
- differentiators: ["당일 로스팅", "전문 로스터 설계", "다양한 분쇄 옵션"]
- shippingFreshnessInfo: "주문 확인 후 신선하게 준비하여 발송"
- reviewTexts:
  - "초콜릿 풍미가 진해서 라떼용으로 좋았어요"
  - "묵직하고 밸런스가 좋아 재구매했어요"

---

## 15. Implementation Plan

Build in this order:

1. project setup
2. Supabase schema
3. dashboard
4. product create/edit form
5. brand rules settings
6. generated output page with tabs
7. CRUD APIs
8. generate endpoint with placeholder generator
9. version history
10. seed data

---

## 16. Done Criteria

The MVP is complete when:
- admin can create/edit/save a product
- admin can edit brand rules
- admin can click generate
- generated outputs appear in tabs
- outputs can be edited and saved as versions
- outputs can be copied/exported
- seeded Apollo example works end-to-end

---

## 17. Code Quality Requirements

- write modular code
- separate UI, schema, data, and generation logic
- keep prompt/generation logic isolated in its own service layer
- use typed interfaces
- use reusable form components
- keep code readable and refactor-friendly

---

## 18. Final Instruction

Please build this MVP as a working admin web app, not just static mock screens.
Prioritize maintainability and clean structure.
Use placeholder/mock LLM generation logic if necessary, but architect the app so real OpenAI/Gemini integration can be added easily afterward.