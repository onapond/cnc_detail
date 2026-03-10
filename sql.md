-- Enable uuid extension
create extension if not exists "pgcrypto";

-- updated_at trigger function
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =========================================================
-- 1. brand_rules
-- =========================================================
create table if not exists public.brand_rules (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null default '주식회사 씨앤씨테크',
  positioning text not null default '로컬에 신뢰할 수 있는 로스팅 전문 업체',
  tone_rules jsonb not null default '[
    "professional",
    "trustworthy",
    "consistent",
    "data-based",
    "practical",
    "grounded"
  ]'::jsonb,
  avoid_rules jsonb not null default '[
    "과장 광고",
    "근거 없는 최고 표현",
    "모호한 감성 위주 표현",
    "상투적인 커피 홍보 문구"
  ]'::jsonb,
  priority_rules jsonb not null default '[
    "로스팅 의도",
    "왜 이런 맛이 나는지",
    "추출 가이드",
    "신선도",
    "실사용 상황",
    "구매 전환 구조"
  ]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_brand_rules_updated_at on public.brand_rules;
create trigger trg_brand_rules_updated_at
before update on public.brand_rules
for each row
execute function set_updated_at();

-- seed default brand rule row
insert into public.brand_rules (brand_name, positioning)
select '주식회사 씨앤씨테크', '로컬에 신뢰할 수 있는 로스팅 전문 업체'
where not exists (
  select 1 from public.brand_rules
);

-- =========================================================
-- 2. products
-- =========================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),

  product_name text not null,
  category text not null check (
    category in ('espresso_blend', 'drip_blend', 'decaf', 'single_origin')
  ),

  bean_composition text not null,
  roast_point text not null,

  tasting_notes jsonb not null default '[]'::jsonb,

  body_score int not null check (body_score between 1 and 5),
  acidity_score int not null check (acidity_score between 1 and 5),
  sweetness_score int not null check (sweetness_score between 1 and 5),
  balance_score int not null check (balance_score between 1 and 5),

  recommended_brew_methods jsonb not null default '[]'::jsonb,
  target_customer text not null,
  weight_options jsonb not null default '[]'::jsonb,
  price_info text not null,
  differentiators jsonb not null default '[]'::jsonb,
  shipping_freshness_info text not null,

  review_texts jsonb not null default '[]'::jsonb,
  grind_options jsonb not null default '[]'::jsonb,
  faq_seed_notes jsonb not null default '[]'::jsonb,

  photo_notes text,
  research_summary text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row
execute function set_updated_at();

create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_name on public.products(product_name);

-- =========================================================
-- 3. generated_outputs
-- =========================================================
create table if not exists public.generated_outputs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  version_number int not null,

  smartstore_copy text not null default '',
  website_copy text not null default '',
  blog_draft text not null default '',
  instagram_copy text not null default '',
  faq_items jsonb not null default '[]'::jsonb,
  cta_variants jsonb not null default '[]'::jsonb,

  created_at timestamptz not null default now(),

  constraint generated_outputs_product_version_unique unique (product_id, version_number)
);

create index if not exists idx_generated_outputs_product_id
on public.generated_outputs(product_id);

-- =========================================================
-- 4. helper view for latest version
-- =========================================================
create or replace view public.latest_generated_outputs as
select go.*
from public.generated_outputs go
join (
  select product_id, max(version_number) as max_version
  from public.generated_outputs
  group by product_id
) latest
  on go.product_id = latest.product_id
 and go.version_number = latest.max_version;

-- =========================================================
-- 5. seed product: 아폴로 블렌드
-- =========================================================
insert into public.products (
  product_name,
  category,
  bean_composition,
  roast_point,
  tasting_notes,
  body_score,
  acidity_score,
  sweetness_score,
  balance_score,
  recommended_brew_methods,
  target_customer,
  weight_options,
  price_info,
  differentiators,
  shipping_freshness_info,
  review_texts,
  grind_options,
  faq_seed_notes,
  photo_notes,
  research_summary
)
select
  '아폴로 블렌드',
  'espresso_blend',
  '에스프레소 블렌드 구성 원두',
  '묵직한 바디감과 초콜릿 풍미가 살아나도록 설계된 로스팅 포인트',
  '["초콜릿", "카라멜", "스모키"]'::jsonb,
  5,
  1,
  4,
  4,
  '["에스프레소", "카페라떼", "아이스 아메리카노"]'::jsonb,
  '묵직한 바디감과 진한 초콜릿 풍미를 선호하는 고객',
  '["200g", "500g", "1kg"]'::jsonb,
  '200g 9,900원 / 500g 21,900원 / 1kg 40,000원',
  '["당일 로스팅", "전문 로스터 설계", "다양한 분쇄 옵션"]'::jsonb,
  '주문 확인 후 신선하게 준비하여 발송',
  '[
    "초콜릿 풍미가 진해서 라떼용으로 좋았어요",
    "묵직하고 밸런스가 좋아 재구매했어요"
  ]'::jsonb,
  '["홀빈", "핸드드립", "에스프레소"]'::jsonb,
  '[
    "산미가 강한 편인가요?",
    "라떼용으로 어울리나요?",
    "분쇄 선택은 어떻게 해야 하나요?"
  ]'::jsonb,
  '로스팅 장면, 원두 클로즈업, 패키지 컷, 추출 컷 추가 예정',
  '경쟁 상품 대비 묵직한 바디감과 초콜릿 계열 풍미 강조'
where not exists (
  select 1 from public.products where product_name = '아폴로 블렌드'
);