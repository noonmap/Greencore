# 🌱 그린코아

> ⚡일해라일조 (부울경 1반 1조)
>
> 반려식물 SNS 플랫폼
>
> [Notion](https://www.notion.so/yeomss/5124ae734ee54c5bbecc120cf571f55b)

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/yeomss">
            <img src="https://avatars.githubusercontent.com/u/50233862?v=4" width="100px;" alt="Kent C. Dodds"/>
            <br />
            <sub><b>팀장 염정아</b></sub>
        </a>
        <div>FE 팀장</div>
      </td>
      <br />
      <td align="center">
        <a href="https://github.com/noonmap">
            <img src="https://avatars.githubusercontent.com/u/36250213?v=4" width="100px;" alt="Jeroen Engels"/>
            <br />
            <sub><b>팀원 정채원</b></sub>
        </a>
        <br />
        <div>BE 팀장, CI/CD</div>
      </td>
      <br/>
      <td align="center">
        <a href="https://github.com/dhyunee">
            <img src="https://avatars.githubusercontent.com/u/101089655?v=4" width="100px;" alt="Jeroen Engels"/>
            <br />
            <sub><b>팀원 김송빈</b></sub>
        </a>
        <br />
        <div>AI 팀장</div>
      </td>
    </tr>
    <tr>
      <td align="center">
        <a href="https://github.com/seungtaeryu">
            <img src="https://avatars.githubusercontent.com/u/81846487?v=4" width="100px;" alt="Jeroen Engels"/>
            <br />
            <sub><b>팀원 류승태</b></sub>
        </a>
        <br />
        <div>FE</div>
      </td>
      <td align="center">
        <a href="https://github.com/hyeonaseome">
            <img src="https://avatars.githubusercontent.com/u/109887404?v=4" width="100px;" alt="Jeroen Engels"/>
            <br />
            <sub><b>팀원 서현아</b></sub>
        </a>
        <br />
        <div>BE</div>
      </td>
      <td align="center">
        <a href="https://github.com/Choihyoungkyu">
            <img src="https://avatars.githubusercontent.com/u/109322428?v=4" width="100px;" alt="Jeroen Engels"/>
            <br />
            <sub><b>팀원 최형규</b></sub>
        </a>
        <br />
        <div>AI</div>
      </td>
    </tr>
    </tbody>
</table>

<br/>
<br/>
<br/>

## 👍 서비스 개요

<br/>
<br/>
<br/>

## 📝 팀 규칙 (코드 컨벤션)

### Commit Convention

```
[part] type : subject

body

footer

- 모든 타입 메시지는 `영어`로 작성
- 나머지는 `한글`로 작성

ex) [FE] feat : 메인 페이지 버튼 컴포넌트 구현
```

### Commit Type

```
- `feat` : 새로운 기능 추가
- `fix` : 버그 수정
- `docs`: 문서 내용 변경
- `style`: 포맷, 세미콜론 수정 등 코드가 아닌 스타일에 관련된 수정
- `refactor`: 리팩토링 코드
- `test`: 테스트 코드 추가 및 리팩토링 테스트 등
- `chore`: build task 수정, 프로젝트 매니저 설정 수정 등
- `cleanup`: 사소한 수정. (간단한 타입 수정, 포맷팅 수정, 문법 수정 등) feat이나 refactor, style 등으로 설정하기 애매한 작업일 때 사용
```

### Front Naming Convention

```
handle [부가정보] [event명]

onClick
onMouseOver

handleCreateBtnClick

- 예시
    - handleBoardCreateClick
    - handleLogInClick
    - handleAlertHover
    - handleUpdateFormChange
```

| 타입      | 기능                           | 변수명                   | 변수명 예시             |
| --------- | ------------------------------ | ------------------------ | ----------------------- |
| boolean   | true/false                     | is [목적어] [동사(원형)] | isModalOpen             |
| array []  | 목록                           | ~~List                   | categoryList            |
| number 0  | 페이지네이션 관련 totalCount   | ~~TotalCount             | categoryListTotalCount  |
| object {} | user 관련 상세 정보 JSON type  | ~~Info                   | clientInfo , HelperInfo |
| object {} | 그 밖 관련 상세 정보 JSON type | ~~Detail                 | themeDetail             |
| number 0  | 평균 (점수)                    | ~~Avg                    | helperAvg               |
| string "” | 코드                           | ~~Code                   | groupCode               |

### Back Naming Convention

| 패키지     | 상세 분류       | 파일명        | 파일명 예시      |
| ---------- | --------------- | ------------- | ---------------- |
| Controller |                 | ~~Controller  | LoginController  |
| Service    |                 | ~~Service     | LoginService     |
| Dto        | Client → Server | ~~RequestDto  | TonnyRequestDto  |
|            | Server → Client | ~~ResponseDto | TonnyResponseDto |
| Entity     |                 | ~~Entity      | TonnyEntity      |
| Repository |                 | ~~Repository  | UserRepository   |
| Common     |                 | x             | x                |
| Exception  |                 | ~~Exception   | GlobalException  |

| 기능 | 상세 기능 | 함수명                          |
| ---- | --------- | ------------------------------- |
| 생성 |           | insert[이름]                    |
| 조회 | 상세 조회 | find[이름] , find[이름]By[조건] |
|      | 목록 조회 | find[이름]List                  |
| 수정 |           | update[이름]                    |
| 삭제 |           | remove[이름]                    |

| 기능     | 상세 기능 | 함수명        |
| -------- | --------- | ------------- |
| 회원가입 |           | signup        |
| 생성     |           | create[이름]  |
| 조회     | 상세 조회 | get[이름]     |
|          | 목록 조회 | get[이름]List |
| 수정     |           | modify[이름]  |
| 삭제     |           | delete[이름]  |

<br/>
<br/>
<br/>

## ✨ 와이어프레임

<img href="./output/와이어프레임/[홈] 메인 화면.png"/>

<br/>
<br/>
<br/>

## 기능 정의서

```
반려식물을 키우는, 혹은 키우고 싶은 사람들을 위한 식물 SNS 서비스
```

### Web

1. 식물 관찰 일지

- 사용자가 식물에 대한 관찰일지를 쓸 수 있다.
- SNS 피드 형식으로 제공하여 다른 사용자들과 일지를 공유할 수 있다.
- 사용자는 하나의 관찰 일지에 여러 개의 일지를 추가할 수 있다.

2. 식물 관리

- 키우고 있는 식물에 대한 돌보기 스케줄링을 제공한다.
- 물주기, 분갈이, 햇빛 등등의 식물 관리 할 일을 표시한다.
- 식물 관리 스케줄을 등록해 놓으면 때에 맞춰 알림이 간다.

3. 식물 추천 피드

- 협업 필터링을 기반으로 사용자에게 맞춤형 추천 피드를 제공한다.
- 추천 피드는 인기 일지, 같은 종의 식물을 키우는 사람들의 일지 등을 제공한다.

4. 식물 가이드

- 식물을 검색하여 정보 및 키우기 가이드를 제공한다.
- 식물 이름, 식물 이미지 등으로 검색할 수 있다.
- 식물 이미지 검색은 AI 기술을 사용한다.

### AI

1. 식물 검색

- 식물의 이미지를 검색하면 해당 이미지를 분석하여 어떤 식물인지 결과를 반환한다.
- 해당 결과에 따른 식물에 대한 정보 및 가이드를 제공한다.

2. 식물 일러스트화

- 식물 관찰 일지를 올릴 때 식물 사진을 일러스트화하여 보여준다.

<br/>
<br/>
<br/>

## 📅 일정

<table>
  <thead>
    <tr>
      <th>스프린트</th>
      <th>기간</th>
      <th>제목</th>
      <th>설명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1주차 스프린트</td>
      <td>2023.02.27(월) ~ 2023.03.05(일)</td>
      <td colspan=2>프로젝트 세팅 기간</td>
    </tr>
    <tr>
      <td>1주차-1</td>
      <td>02.27 (월)</td>
      <td>Git, Jira 초기화</td>
      <td>
        <a href="https://lab.ssafy.com/s08-ai-image-sub2/S08P22E101">Git</a>,
        <a href="https://ssafy.atlassian.net/jira/software/c/projects/S08P22E101/boards/1774/roadmap">Jira</a>
      </td>
    </tr>
    <tr>
      <td>1주차-2</td>
      <td>03.01 (수)</td>
      <td>와이어프레임 설계</td>
      <td>
        <a href="https://www.figma.com/file/SSW9jcaWkLAZYcKkrFbzCB/%EC%B9%98%EC%BD%94%EC%B9%98%EC%BD%94?node-id=0-1&t=R9bg0OJ3IIaGVgJX-0">Figma</a>
      </td>
    </tr>
    <tr>
      <td>1주차-3</td>
      <td>03.03 (금)</td>
      <td>와이어프레임 기반 더미데이터 작성</td>
      <td>
        <a href="https://yeomss.notion.site/fbabee703f5c48429e96b0764cca911f">기능 명세서</a>
      </td>
    </tr>
    <tr>
      <td>2주차 스프린트</td>
      <td>2023.03.06(월) ~ 2023.03.12(일)</td>
      <td colspan=2>프로젝트 설계 기간</td>
    </tr>
    <tr>
      <td>2주차-1</td>
      <td>03.06 (월)</td>
      <td>Entity/Dto 설계</td>
      <td>
        <a href="https://www.notion.so/yeomss/DB-ERD-ae5386e172924417aa21a576a6a05ac9">ERD</a>
      </td>
    </tr>
    <tr>
      <td>2주차-2</td>
      <td>03.08 (수)</td>
      <td>GIT, JIRA 작업 영역 변경, ERD 설계</td>
      <td>
        <a href="https://lab.ssafy.com/s08-ai-image-sub2/S08P22E101">Git</a>,
        <a href="https://ssafy.atlassian.net/jira/software/c/projects/S08P22E101/boards/1774/roadmap">Jira</a>
      </td>
    </tr>
    <tr>
      <td>2주차-3</td>
      <td>03.10 (금)</td>
      <td>현업자 리뷰, REST API 목업 구현 개발 시작</td>
      <td>
        <a href="https://yeomss.notion.site/API-665f6c71569e45f8a26a0a2274a2e3e2">API 명세서</a>
      </td>
    </tr>
    <tr>
      <td>3주차 스프린트</td>
      <td>2023.03.13(월) ~ 2023.03.19(일)</td>
      <td colspan=2>프로젝트 개발 기간 (1)</td>
    </tr>
    <tr>
      <td>3주차-1</td>
      <td>03.13 (월)</td>
      <td>[FE] REST API 목업 구현, [BE] REST API 상세 구현</td>
      <td></td>
    </tr>
    <tr>
      <td>3주차-2</td>
      <td>03.15 (수)</td>
      <td>[FE] REST API 목업 구현, [BE] REST API 상세 구현</td>
      <td>
      </td>
    </tr>
    <tr>
      <td>3주차-3</td>
      <td>03.17 (금)</td>
      <td>[FE] REST API 목업 구현, [BE] REST API 상세 구현</td>
      <td>
      </td>
    </tr>
  </tbody>
</table>

<br/>
<br/>

## 📁 프로젝트 구조

```
AI
BE
FE
```

<br/>
<br/>
