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
├── app/               # Next.js 14 App Router
├── components/        # 재사용 가능한 컴포넌트
├── containers/        # 페이지별 비즈니스 로직 컨테이너
└── lib/              # 유틸리티 및 설정
```
## 개발 가이드 
 **코드 품질**

ESLint를 통한 코드 스타일 통일

TypeScript를 통한 타입 안정성 확보

Husky를 통한 커밋 전 코드 검사

 **성능 최적화**

Next.js SSR/CSR 하이브리드 렌더링

이미지 자동 최적화 (Next/Image)

코드 스플리팅

모션 효과를 통한 로딩 Ui 개선 


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



