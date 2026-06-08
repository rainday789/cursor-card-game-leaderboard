# 카드 뒤집기 게임 (리더보드)

4×4 메모리 매칭 게임. HTML, CSS, Vanilla JavaScript로 구현했으며 Supabase `game_scores` 테이블에 기록을 저장합니다.

## 로컬 실행

1. Supabase 설정 파일을 만듭니다.

```bash
cp config.local.example.js config.local.js
```

2. `config.local.js`에 Supabase 프로젝트 URL과 anon key를 입력합니다.
3. 로컬 서버로 실행합니다.

```bash
npx serve .
```

## 보안 — Supabase 키 관리

| 파일 | Git 커밋 | 용도 |
|------|----------|------|
| `config.local.example.js` | ✅ | 설정 템플릿 (플레이스홀더만 포함) |
| `config.local.js` | ❌ | 실제 Supabase URL / anon key |
| `.env.example` | ✅ | 배포용 환경 변수 템플릿 |
| `.env` | ❌ | 로컬/배포 환경 변수 |

**절대 Git에 커밋하지 말 것:** `config.local.js`, `config.js`, `.env`

Supabase anon key는 클라이언트에 노출되는 공개 키이지만, 저장소 유출을 방지하기 위해 별도 파일로 분리했습니다. 데이터 보호는 Supabase RLS 정책으로 처리됩니다.

## 배포 (Vercel / Netlify)

환경 변수를 설정합니다.

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

배포 전 설정 파일을 생성합니다.

```bash
node scripts/generate-config.mjs
```

Vercel 예시 (Build Command):

```bash
node scripts/generate-config.mjs
```

## 게임 규칙

- 16장의 카드(8쌍) 중 같은 그림을 찾습니다.
- 이동 횟수가 적고, 시간이 짧을수록 리더보드 상위에 올라갑니다.
- 게임 완료 후 닉네임을 입력해 점수를 저장할 수 있습니다.

## Supabase

- 테이블: `game_scores`
- 컬럼: `player_name`, `moves`, `elapsed_seconds`, `created_at`
- 리더보드 정렬: `moves` 오름차순 → `elapsed_seconds` 오름차순
