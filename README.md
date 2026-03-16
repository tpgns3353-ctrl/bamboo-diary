# 🎋 대나무숲 일기

속마음을 대나무에 적어 털어놓는 익명 일기 웹사이트입니다.

## 기능

- 🎋 일기를 대나무 형태로 표시
- 😊 감정 상태 선택 (기쁨, 슬픔, 화남, 평온, 의지)
- 🐼 일기 삭제 시 귀여운 판다 애니메이션
- 🌥️ 자연스러운 대나무 숲 배경
- 🔍 감정별 필터링 및 내용 검색
- 📱 반응형 디자인

## 설정 방법

### 1. GitHub 저장소 생성
새 저장소 생성 (예: `bamboo-diary`)

### 2. GitHub Pages 활성화
Settings → Pages → Source: main 브랜치

### 3. config.js 수정
```javascript
const CONFIG = {
    owner: '본인_GITHUB_아이디',
    repo: '저장소_이름'
};
```

### 4. 감정 Labels 생성
Issues → Labels에서 생성:

| Label 이름 | 색상 |
|-----------|------|
| 😊 기쁨 | 노랑 (#FFD700) |
| 😢 슬픔 | 파랑 (#4169E1) |
| 😠 화남 | 빨강 (#DC143C) |
| 😌 평온 | 민트 (#98FB98) |
| 💪 의지 | 주황 (#FF8C00) |

## 사용 방법

### 일기 쓰기
1. 우측 하단 🎋 버튼 클릭
2. Title: 제목 (선택)
3. Body: 속마음 작성
4. Labels: 감정 선택
5. Submit

### 일기 보기
- 대나무 카드 클릭 → GitHub Issue로 이동
- 감정 필터로 원하는 감정만 보기
- 검색창으로 내용 검색

## 파일 구조

```
bamboo-diary/
├── index.html      # 메인 페이지
├── style.css       # 2D 애니메이션 스타일
├── app.js          # GitHub API + 애니메이션
├── config.js       # 설정
└── README.md       # 사용 가이드
```

## 라이선스

MIT
