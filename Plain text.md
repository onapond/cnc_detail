# CNC TECH Plain Text Export Guide

이 문서는 CNC TECH 상세페이지 자동화 앱에서 `Export TXT`로 내보내는 plain text 형식을 설명합니다.

적용 대상:

- Smart Store Copy
- Website Copy
- Blog Draft
- Instagram Copy
- FAQ
- CTA Variants

원칙:

- 마크다운 문법 없이 순수 텍스트로 저장
- 복사 후 외부 문서, 메신저, 쇼핑몰 관리자 페이지에 바로 붙여넣을 수 있어야 함
- 구조는 유지하되 HTML, JSON, 불필요한 메타데이터는 포함하지 않음

---

## 1. Smart Store Copy

plain text 예시 구조:

Hero headline
[헤드라인]

Core customer benefit
[핵심 고객 효익]

Why this coffee is different
[차별점]

Roasting / blending intent
[로스팅 및 블렌딩 의도]

Taste explanation
[맛 설명]

Recommended customer and use cases
[추천 고객 / 사용 상황]

Grind / extraction guide
[분쇄 / 추출 가이드]

Customer review summary
[리뷰 요약]

FAQ
[FAQ 본문]

CTA
[구매 유도 문구]

---

## 2. Website Copy

plain text 예시 구조:

Hero
[히어로 문구]

Short Summary
[짧은 요약]

Taste Profile
[향미 / 점수 / 특징]

Differentiation
[차별 포인트]

Brewing Guide
[추출 가이드]

FAQ
[FAQ 요약]

CTA
[CTA]

---

## 3. Blog Draft

plain text 예시 구조:

Title
[블로그 제목]

Intro
[도입부]

Product Story
[제품 스토리]

Roasting Explanation
[로스팅 설명]

Taste Profile
[맛 프로파일]

Who It Is Good For
[추천 고객]

Brewing Guide
[브루잉 가이드]

Conclusion
[마무리]

---

## 4. Instagram Copy

plain text 예시 구조:

Caption
[짧은 캡션]

Card 1
[카드 문구]

Card 2
[카드 문구]

Card 3
[카드 문구]

Card 4
[카드 문구]

Short CTA
[짧은 CTA]

---

## 5. FAQ

plain text 예시 구조:

Q. [질문 1]
A. [답변 1]

Q. [질문 2]
A. [답변 2]

...

Q. [질문 10]
A. [답변 10]

---

## 6. CTA Variants

plain text 예시 구조:

1. [직접형 CTA]
2. [부드러운 CTA]
3. [신뢰형 CTA]
4. [신선도형 CTA]
5. [실용 구매형 CTA]

---

## 7. 현재 앱 적용 방식

현재 앱에서는 각 결과 탭에서 아래 기능을 제공합니다.

- `Copy`: 현재 탭 내용을 클립보드로 복사
- `Export MD`: `.md` 파일로 저장
- `Export TXT`: `.txt` 파일로 저장

`Export TXT` 동작 방식:

- Smart Store / Website / Blog / Instagram: 본문 전체를 plain text로 저장
- FAQ: `Q.` / `A.` 형식으로 직렬화하여 저장
- CTA: 번호 목록 형식으로 직렬화하여 저장

관련 구현 파일:

- [results-editor.tsx](/C:/Users/user/cnc-tech-admin/components/outputs/results-editor.tsx)

---

## 8. 검토 결과

기존 `Plain text.md` 파일은 아래 이유로 재작성 필요 상태였습니다.

- 파일명과 다르게 plain text 규격 문서가 아니라 SQL 내용이 들어 있었음
- 한글 문자열이 깨져 있었음
- 실행용 SQL 문서와 plain text 규격 문서가 혼재되어 있었음

현재는 plain text 규격 문서 역할에 맞게 재작성했습니다.
