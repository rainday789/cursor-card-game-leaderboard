# 카드 뒤집기 게임 (리더보드)

4×4 메모리 매칭 게임. HTML, CSS, Vanilla JavaScript로 구현했으며 Supabase `game_scores` 테이블에 기록을 저장합니다.

## 실행 방법

1. `config.example.js`를 복사해 `config.js`를 만듭니다.
2. Supabase 프로젝트 URL과 anon key를 `config.js`에 입력합니다.
3. 로컬 서버로 `index.html`을 엽니다.

```bash
npx serve .
```

또는 VS Code Live Server 확장을 사용해도 됩니다.

## 게임 규칙

- 16장의 카드(8쌍) 중 같은 그림을 찾습니다.
- 이동 횟수가 적고, 시간이 짧을수록 리더보드 상위에 올라갑니다.
- 게임 완료 후 닉네임을 입력해 점수를 저장할 수 있습니다.

## Supabase

- 테이블: `game_scores`
- 컬럼: `player_name`, `moves`, `elapsed_seconds`, `created_at`
- 리더보드 정렬: `moves` 오름차순 → `elapsed_seconds` 오름차순
