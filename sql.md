# CNC TECH MVP Database SQL

아래 SQL은 Supabase(PostgreSQL) 기준으로 작성된 초기 스키마입니다.

포함 내용:

- `pgcrypto` 확장 활성화
- `updated_at` 자동 갱신 트리거 함수
- `brand_rules` 테이블
- `products` 테이블
- `generated_outputs` 테이블
- 최신 생성 버전 조회용 뷰
- 기본 브랜드 규칙 시드 데이터
- 아폴로 블렌드 시드 데이터

실행용 파일:

- [sql.sql](/C:/Users/user/cnc-tech-admin/sql.sql)

핵심 테이블 요약:

1. `brand_rules`
- 브랜드명, 포지셔닝, 톤 규칙, 금지 규칙, 우선 규칙 저장

2. `products`
- 제품 기본 정보, 향미 점수, 추출 추천, 리뷰, FAQ 메모, 리서치 요약 저장

3. `generated_outputs`
- 생성 결과 버전별 저장
- `product_id + version_number` 유니크 제약 포함

최신 생성본 조회:

- `latest_generated_outputs` 뷰로 제품별 최신 버전 1건만 조회 가능

시드 데이터:

- 기본 브랜드 규칙 1건
- `아폴로 블렌드` 제품 1건

주의:

- 실제 실행은 문서 파일이 아니라 `sql.sql` 파일을 사용하면 됩니다.
