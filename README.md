# MAIDDY Frontend

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Animation:** Framer Motion
- **State Management:** React Hooks
- **Authentication:** JWT
- **Code Quality:** ESLint
- **HTTP Client:** Custom API Client (src/lib/apiClient.ts)

## Project Structure

```
src/
├── app/               # Next.js App Router
├── components/        # 재사용 가능한 컴포넌트
├── containers/        # 각 페이지별 로직 컨테이너
└── lib/               # 유틸리티 및 설정
```
## Features

ESLint를 통한 코드 스타일 통일

TypeScript를 통한 타입 관련 에러 즉시 확인 

Husky를 통한 커밋 전 코드 검사

Next.js SSR/CSR 하이브리드 렌더링

이미지 자동 최적화 (Next/Image)

코드 스플리팅 > page, constants, css, type, utils로 파일 나눔

모션 효과를 통한 로딩 UI 개선 


## 레퍼런스 

https://miriya.net/blog/cliz752zc000lwb86y5gtxstu

## Getting Started

 **환경 설정**
```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

----

도커 실행

docker-compose up --build
