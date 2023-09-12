# 회원 가입
> 예상 UI 이미지 추가 예정 <br>

아이디 및 비밀번호, 이메일을 입력후 이메일 인증 및 학생 인증을 하여 회원가입 진행<br>
## 학생인증 방법
* **학생증 사진과 본인 셀카를 찍어 보낸후 관리자가 확인하여 본교 학생을 확인**<br>
사진을 도용할 수 있고 일일이 사람이 확인 후 승인을 해줘야함
* **[리로스쿨 API](https://github.com/zeroday0619/Riroschool-DOCS)를 이용해 본교 학생 인증**<br>
가장 확실한 방법이나 비공식 API로 추정되어 현재까지 작동 여부를 모름<br>
또한 이용하는 사용자들에게 어떤 불이익이 가는지 불분명함
* **학교 GSuite 이메일 인증 사용**<br>
학교에서 제공해주는 GSuite 계정 이메일을 이용하여 학생 인증 진행

# 메인 화면
> 예상 UI 이미지 추가 예정 <br>

# 상품 화면
> 예상 UI 이미지 추가 예정 <br>

# 채팅
> 예상 UI 이미지 추가 예정 <br>

# DB 구조
> \* 고유 ID는 사용자에게 직접적으로 나타나지 않는 시스템이 사용자나 판매글 등을 식별하기 위한 숫자로 된 ID 입니다.

SQLite 사용

## User
사용자 정보
|id|isVerified|username|password|email|location|rate|
|-|-|-|-|-|-|-|
|사용자 고유 ID|사용자 인증 여부|사용자에게 표시될 ID|사용자 비밀번호(SHA512 해시화로 저장)|사용자 이메일|사용자 거주 위치|평점|

## Trade
판매 물품
|id|ownerId|price|title|content|status|category|timestamp|photos|view|heart|
|-|-|-|-|-|-|-|-|-|-|-|
|판매글 고유 ID|판매자 고유 ID|상품 가격|상품 제목|상품 설명|판매 상태|카테고리|업로드 날짜|사진 목록|조회수|관심수|

## Chat
채팅 기록
|id|timestamp|tradeId|ownerId|content|isRead|
|-|-|-|-|-|-|
|채팅 고유 ID|채팅 시간|판매글 고유 ID|사용자 고유 ID|채팅 내용|읽음 여부|