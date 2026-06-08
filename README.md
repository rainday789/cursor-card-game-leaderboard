# 카드 뒤집기 게임 (리더보드)

4×4 메모리 매칭 게임. HTML, CSS, Vanilla JavaScript로 구현했으며 Supabase `game_scores` 테이블에 기록을 저장합니다.

## 로컬 실행

1. Supabase 설정 파일을 만듭니다.

```bash
cp supabase-config.example.js supabase-config.js
```

2. `supabase-config.js`에 Supabase 프로젝트 URL과 anon key를 입력합니다.
3. 로컬 서버로 실행합니다.

```bash
npx serve .
```

## 보안 — Supabase 키 관리

| 파일 | Git 커밋 | 용도 |
|------|----------|------|
| `supabase-config.example.js` | ✅ | 설정 템플릿 (플레이스홀더만 포함) |
| `supabase-config.js` | ❌ | 실제 Supabase URL / anon key |
| `.env.example` | ✅ | 배포용 환경 변수 템플릿 |
| `.env` | ❌ | 로컬/배포 환경 변수 |

**절대 Git에 커밋하지 말 것:** `supabase-config.js`, `config.local.js`, `config.js`, `.env`

## 배포 (Vercel)

### 1. Vercel 환경 변수 등록

Vercel 프로젝트 → **Settings** → **Environment Variables**

| Name | Value |
|------|-------|
| `SUPABASE_URL` | Supabase Project URL |
| `SUPABASE_ANON_KEY` | Supabase anon public key |

Production / Preview / Development 모두 체크 후 저장합니다.

### 2. 빌드 시 자동 생성

`vercel.json`과 `package.json`에 빌드 스크립트가 설정되어 있습니다.

```bash
npm run build
# → scripts/generate-supabase-config.mjs 실행
# → supabase-config.js 자동 생성
```

Vercel은 배포 시 위 빌드 명령을 자동 실행합니다. 환경 변수만 등록하면 `supabase-config.js`가 생성됩니다.

`vercel.json`의 `outputDirectory`는 `.`(프로젝트 루트)로 설정되어 있습니다. Vercel 대시보드의 Output Directory가 `public`으로 되어 있으면 **비워두거나 `.`로 변경**하세요.

### 3. 재배포

환경 변수 저장 후 **Redeploy**를 실행해야 반영됩니다.

## 게임 규칙

- 16장의 카드(8쌍) 중 같은 그림을 찾습니다.
- 이동 횟수가 적고, 시간이 짧을수록 리더보드 상위에 올라갑니다.
- 게임 완료 후 닉네임을 입력해 점수를 저장할 수 있습니다.

## Supabase

- 테이블: `game_scores`
- 컬럼: `player_name`, `moves`, `elapsed_seconds`, `created_at`
- 리더보드 정렬: `moves` 오름차순 → `elapsed_seconds` 오름차순
