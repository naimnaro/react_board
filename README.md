**[배포완료] https://jungpyo.net/**
<br>(사진 클릭시 동영상으로 이동합니다.)
<br>[![YouTube Thumbnail](https://img.youtube.com/vi/EIK0m_DOJgM/0.jpg)](https://youtu.be/EIK0m_DOJgM)


도메인 : https://jungpyo.net/ ( jungpyo.net )
<br>기능 : 웹 게시판 ( 회원가입 | 글쓰기/수정/삭제/읽기 | 댓글쓰기/삭제) 
<br>프론트엔드 : react +  bootstrap + modal 
<br>백엔드 : nodejs + expressjs  + axios + cors 
<br>DB : Mysql 
<br>서버 : aws ec2 
<br>보안 : SSL 인증서를 사용하여 HTTPS 적용 
<br>

후기 :
후기: 목표는 웹 게시판 구현이었고, 많은 사람들이 포트폴리오를 위해 게시판을 선택하는데, 그 이유는 게시판의 메커니즘인 쓰기/읽기/수정/삭제 (Create/Read/Update/Delete), 줄여서 CRUD라 부르는 것이 우리가 사용 중인 대부분의 웹/앱의 기본이자 사실상 전부이기 때문입니다. 일단은 학습을 위해 로컬 서버로만 돌렸고, 나중에는 배포까지 해볼 생각입니다. 제 블로그에 방명록 같은 기능을 수행할 수 있겠죠. 한 달 동안 도서관을 반복했는데, 막판에 밤낮이 꼬여서 약간 지체되었습니다.

배포후기 : 내가 만든 게시판, 즉 웹 어플리케이션을 다른사람도 이용하게 하고싶다. 라는  근거로 개발자에게 가장 중요한 "배포"를 이행해야 겠다고 결심헀다.  사실 당연한 과정이다.

기존에는 로컬 서버에서 프론트엔드와 백엔드간의 정보 교환이 이루어졌고 로컬 db에 데이터가 저장되었다면, 다른 사람이 접근하기 위해서는 백엔드,프론트엔드가 호스팅되야한다.

즉 우리는 필연적으로 aws 서비스를 이용해야한다. 서치끝에 내린결론은 프론트 (로그인/회원가입/게시글 페이지)는 s3로 정적 웹호스팅,

그리고 백엔드 서버는 ec2 인스턴스로 호스팅해야한다. ec2 인스턴스는 대충 가상서버개념으로 보면된다. 그리고 db는 기존 로컬에서 사용하던 mysql 아닌 , aws rds에서 새로 mysql db를 생성해야한다.

나는 내 mysql db를 어느 환경에서도 관리하기 위해 ec2인스턴스에 배포하였고 도커를 이용해 phpmyadmin을 매핑하였다. 프론트엔드는 s3에서 리액트 빌드파일을 업로드하기만하면 끝난다. 

물론 도메인 적용과 https (ssl 인증서) 적용과정이 조금 귀찮긴하다. 나같은 경우엔 aws route 53에서 구매한 도메인을 aws acm의서 발급받은 인증서로 땜빵쳤다 백엔드는 ec2 인스턴스에서 

얻은 키페어 파일을 바탕으로 로컬폴더와 ec2를 연결하고 백엔드폴더를 넘겨줘야한다 다 넘겨주고나면, 이제 ec2 에 백엔드에 쓰인 모든 의존성패치를 하고 nodejs를 설치해서 

똑같이 서버를 켜주면된다. ( ec2 인스턴스는 내가 컴퓨터를 종료해도 유지된다) 백엔드서버도 https보안이 적용되어야한다. 따라서 도메인을 하나더 구입,

아파치와 certbot을 이용해 무료 인증서를 발급받고, 백엔드 서버에  개인키값을 적용하고 https 모듈을 설치했다. 이러면 모든게 끝난다.  배포를 하기위해 생각보다 사전에 설정해야 할것들

이 매우많고 이제는 비용도 생긴다. 그래도 처음 기획한 웹 게시판을  마침내 배포까지 끝냈다. 개발자 커뮤니티엔 OKKY에도 올렸다. 역시 전문 개발자들이 많은커뮤니티라 반응은 시원찮았지만 난 더 할수있다.

난점 1: DB 연동. MySQL을 웹으로 관리하기 위해 phpMyAdmin이라는 웹에서 DB를 다루는 툴을 사용하기로 결정했는데, PHP와 웹 서버인 아파치가 필요했습니다. 거기다 ini 확장자를 가진 몇몇 구성 설정 파일을 수정해야 MySQL과 연동할 수 있었습니다. 브라우저를 통해 로컬 주소로 들어가 DB를 관리하는 툴인 phpMyAdmin을 키는데 성공하고, React와 내 DB를 연동하는 과정도 막막했습니다. 이 과정에서 axios 라이브러리를 사용해 클라이언트와 서버 사이의 데이터를 주고받는 문법을 사용하고 MySQL 콘솔창까지 켜서 데이터 로그를 확인하면서 작었습니다. 해본 경험이 없어서 매우 막막했습니다.

난점 2: 성공적으로 회원가입/로그인이 구현되었고 DB에 계정이 생성되는 것도 확인했습니다. 그런데 로그인을 했는데, 다른 페이지로 넘어가거나 새로고침하면 로그인한 증거가 없습니다. 그니까 기억을 못합니다. 일단, 그냥 localstorage로 현재 세션에서 로그인한 유저 DB를 기억하기로 했습니다. 즉, 이 세션이 현재 기억하는 유저 이름으로 활동하는 거죠. 글을 쓰면 post 테이블의 author_name은 현재 세션이 기억하는 유저의 이름 값이 그대로 박히는 것입니다. 즉, user 테이블과 post 테이블에 외래키를 사용할 필요가 사라집니다. 그리고 자신이 쓴 글을 수정하거나 삭제하려면, 여기 post 테이블에 박힌 author_name과 현재 세션이 기억하는 이름이 일치해야 자신이 쓴 글이 되므로 수정/삭제 버튼이 활성화됩니다. 댓글도 마찬가지입니다.

난점 3.  배포의 개념이, 처음에는 정확히 무엇이고 뭘 해야할지 도저히 감이 안잡힌다.  결론부터 간단하게 말하자면 배포라는 것은 내가 로컬 서버에서 돌리던 서버와 클라이언트간 데이터 정보가 교환되는 특정 환경을, 
클라우드 서버로 올려서 24시간 다른 사람도 접속가능한것 , aws의 역할이 배포와 직결된다고 볼수있다. 이 과정에서 프론트를 배포하고, 백엔드 서버를 aws로 넘겨주는 과정도 매우 쉽지가 않았다. 하지만 결국, 
몰라서 그랬던것 뿐이고, 현재는 아무렇지도 않게 행할수있다.

난점 4. 프론트와 백엔드 서버를 모두 업로드했는데, 여기에 https , 즉 보안 인증서를 적용하는 과정이 매우 복잡하다.  일단 보안 인증서는, 각 도메인에 한개씩 필요한데,  프론트의 도메인 주소와 
백엔드의 도메인 주소에 둘다 적용해야한다. 이 과정에서 프론트 도메인에 적용한 인증서는 aws acm에서 발급받은 인증서인데,  여기서 발급받은 인증서는 개인 키가가 나오지않는다. 
aws 측에서 관리하기 때문, 따라서 백엔드 서버에는 다른 인증서를 준비해야하는데, 유료 인증서를 구입할까 했지만, 아파치와 certbot으로 무료 인증서를 
발급받을수 있다는 서치가있었고 인증서를 발급받고, ssl 설정파일을뜯어서 개인 키와 포트에 관한 설정, 그리고 프론트와 백엔드 간의 주소가 다르기떄문에,
cors 정책을 위한 설정도 필요했다. 

