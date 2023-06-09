use chicochico;
insert into user_table (created_at, updated_at, email, follower_count, following_count, introduction, is_deleted,
                        nickname, password, profile_image_path, user_store)
values (now(), now(), 'gc@ssafy.com', 0, 0, '', 'N', '재롱둥이',
        '$2a$10$JVWPF/wbrqs6HYteRuWWNuEuPvJw0wv00KLoS0ZCVULpZigruABDi', '/user/default.png', 'DB');
SET @user := last_insert_id();

insert into tag (created_at, updated_at, content, count)
values (now(), now(), '다육/선인장', 0),
       (now(), now(), '초보자용', 0),
       (now(), now(), '공기정화', 0),
       (now(), now(), '빛이적어도되는', 0),
       (now(), now(), '잎을감상하는', 0),
       (now(), now(), '꽃을감상하는', 0),
       (now(), now(), '향기나는', 0),
       (now(), now(), '선물하기좋은', 0),
       (now(), now(), '열매를감상하는', 0),
       (now(), now(), '목대있는', 0),
       (now(), now(), '봄', 0),
       (now(), now(), '보라', 0),
       (now(), now(), '노랑', 0),
       (now(), now(), '밝은느낌', 0),
       (now(), now(), '인테리어', 0),
       (now(), now(), '플랜테리어', 0),
       (now(), now(), '제철', 0),
       (now(), now(), '튼튼', 0),
       (now(), now(), '물을자주주지않아도되는', 0),
       (now(), now(), '여름', 0),
       (now(), now(), '흙이필요없는', 0),
       (now(), now(), '꿀팁', 0),
       (now(), now(), '고양이', 0)
;
SET @tag := last_insert_id() - 1;

SET @plant_default_image_path := '/plant/default.jpg';
insert into feed (feed_code, created_at, updated_at, comment_count, content, image_path, is_deleted, like_count,
                  user_id)
values ('FEED_POST', now(), now(), 0,
        '[ 사계귤 (유주나무) ]
        유주나무라 불려지는 사계귤은 광택이 나는 잎을 가진 과실수예요. 사계절 흰 꽃이 계속 피고 지며 열매를 맺는다고 해서 붙여진 이름이랍니다. 소박한 하얀 꽃에서 풍기는 상큼한 꽃향기가 매력적인 사계귤은 초여름부터 꽃이 피고, 꽃이 진 자리에서 열매가 맺혀요. 진 녹색의 열매는 주황색으로 익어가요. 새콤한 맛이 강해 바로 먹기보다는 잼, 청 등으로 만들어 먹으면 향긋한 향이 나 별미라고 해요. 열매가 너무 많이 달리면 무게 때문에 가지가 쳐지고 양분소모가 열매에만 집중되어 잎이 시들 수 있으니 어느정도 익은 열매는 따주세요.',
        'https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/156865224090302_season_gardening_54248035_330095877637258_7657305843191570226_n.jpg',
        'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '[ 옥천앵두 (예루살렘 처리) ]
        동글동글 귀여운 주황색 열매가 달린 옥천 앵두는 햇빛을사랑하는 가지과의 식물이에요. 고추, 가지, 토마토와 같은 ‘Solanum’속에 속한답니다. 종명인 ‘pseudocapsicum’은 가짜 고추를 의미해요. 옥천 앵두는 여름에 하얀 꽃이 피고 가을에 열매가 맺혀 겨울까지 지속되어 ‘크리스마스 체리’, ‘예루살렘 체리’라고 불리게 되었답니다. 옥천 앵두의 열매는 독성이 있어 인간에게도 동물에게도 해롭기 때문에 섭취하면 안돼요. 반려동물과 어린 아이가 있다면 섭취하지 않도록 주의가 필요합니다.',
        'https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/16642771815801.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '[ 오렌지 자스민 ]
        오렌지 자스민은 나팔 같은 하얀 꽃에서 나는 향이 자스민 꽃 향을 닮았고, 그 열매가 오렌지의 모양을 닮았다고 붙여진 이름입니다. 실제로 자스민과는 다른 종류 운향과에 속하는 식물로, 서아시아, 북 오스트레일리아, 뉴칼레도니아가 원산이 작은 나무 식물이랍니ㅏㄷ. 연중 따뜻한 기온을 유지하는 곳에서 온 오렌지 자스민은 추위에 약하고 촉촉한 습도를 좋아하고, 한 번 걸러진 밝은 빛을 오래 받을 수 있으면 일년 내내 꽃이 피는 식물이에요. 오렌지 자스민 꽃의 수명은 짧지만 계속해서 새 꽃을 감상할 수 있어 인기가 많은 식물이랍니다. 꽃이 지면 꽃의 암술이 있던 자리에 열매가 생기고, 열매가 익으면 열매 속의 씨앗으로 새로운 오렌지 자스민 새싹을 볼 수 있지만, 꽃을 계속 감상하고 싶으시다면 열매가 맺히기 전에 암술을 따주어야 에너지 소모가 줄어 아름다운 꽃을 더 많이 내어준답니다.',
        'https://i.pinimg.com/564x/51/c9/39/51c93945e236ff4e6b4a41293f67a1a7.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '[ 안스리움 ]
        화려한 색깔과 하트모양의 잎이 사랑스러운 안스리움은 꼬리를 닮아 ‘Tail Flower’라고도 해요. 안스리움은 원통형의 꼬리를 닮은 신기한 꽃모양을 가지고 있고, 꽃을 감싸고 있는 불염포에 붉은색, 분홍색, 흰색 등 다양한 색깔로 물들어 있답니다. 계절에 상관없이 온도만 맞으면 실내에서도 꽃을 피울 수 있고, 꽃이 한 번 피면 7주 정도는 지속되어 오래 감상할 수 있답니다! 또한 공기 중의 일산화탄소와 암모니아, 포름 알데히드를 제거하는 능력이 뛰어나 훌륭한 실내 공기정화 식물로 오랫동안 사랑받고 있답니다.',
        'https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/16583148489411.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '[ 히아신스 ]
        진한 향기와 선명한 색깔의 꽃으로 봄을 알리는 히아신스는 양파 같은 알뿌리를 가진 구근식물이에요. 새촉이 나오고 나면 빛이 잘 드는 곳에서 서늘하게 관리해주면 되어 초보 식집사들도 쉽게 꽃을 볼 수 있답니다. 흙에 심지 않고 수경재배로도 아름다운 꽃을 감상할 수 있어요. 꽃이 지기 전에 꽃대를 잘라주고, 잎까지 모두 시들 때까지 구근이 통통하게 살찔 수 있독록 두세요. 여름이 되면 구근을 캐내 말린 후에 신문지에 꽁꽁 싸서 어둡고 바람이 잘 통하는 곳에 보관해주세요. 심기 전 냉장고에 두 달 정도 보관했다가 가을에 심어주면 이듬해에도 아름다운 꽃은 다시 만날 수 있어요. 백합과인 히아신스에는 독성이 있어 반려동물, 특히 고양이 주인님을 섬기시는 집사님들은 각별한 주의가 필요해요.',
        'https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/1674134676394144214253_552624845702350_956334313459154524_n.jpg',
        'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '[ 수선화 ]
        트럼펫 같은 노란 꽃이 아름다운 수선화는 알뿌리를 가진 구근 식물이에요. 새촉이 나오고 나면 빛이 잘 드는 곳에서 서늘하게 관리해주면 되어 초보 식집사들도 쉽게 꽃을 볼 수 있답니다. 흙에 심지 않고 수경재배로도 아름다운 꽃을 감상할 수 있어요. 꽃이 지기 전에 꽃대를 잘라주고, 잎까지 모두 시들 때까지 구근이 통통하게 살찔 수 있독록 두세요. 여름이 되면 구근을 캐내 말린 후에 신문지에 꽁꽁 싸서 어둡고 바람이 잘 통하는 곳에 보관해주세요. 심기 전 냉장고에 두 달 정도 보관했다가 가을에 심어주면 이듬해에도 아름다운 꽃은 다시 만날 수 있어요. 수선화에는 독성이 있어 반려동물, 특히 고양이 주인님을 섬기시는 집사님들은 각별한 주의가 필요해요.',
        'https://i.pinimg.com/564x/b3/fa/cc/b3faccaae972013a234369e6d14792ff.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '[ 만세 선인장 ]
        만세선인장은 가시가 거의 없는 선인장이에요. 납작하고 울퉁불퉁한 모양이 꼭 타이어가 밟고 지나간 것 같아서 서양에서는 ‘로드킬 선인장’이라고 불린답니다. 우리나라에서는 두 팔을 벌려서 “만세!”를 부르는 것 같아서 만세 선인장이라고 불리우고 있어요. 키우기 까다롭지 않고 가시가 없어 안전해 초보 가드너들도 부담 없이 키울 수 있는 식물이에요.',
        'https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/16613458705093.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '[ 산세베리아 ]
        산세베리아는 잎의 무늬가 뱀 껍질처럼 생겨서 ‘Snake plant’라고도 이름을 가진 실내 공기정화 식물이에요. ‘산세베리아’는 이탈리아의 왕자였던 산그로 왕자를 기리기 위해 이름붙여졌다고 알려져 있어요. 산세베리아는 밤에 산소를 내어주고 이산화탄소를 흡수해 밤에 공기정화 능력이 아주 뛰어난 식물이랍니다. 또한 물을 자주 주지 않아도 되고 병해충에도 강한 편이어서 키우기 쉬운 식물이기도 해요. 반려동물에게는 독성이 있으니 섭취하지 않도록 주의해야 해요.',
        'https://i.pinimg.com/564x/25/12/40/2512407636c49ff300508d8a0968e59a.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '[ 금전수 ]
        잎이 동전 모양을 닮아서 금전수라고 불리는 이 식물은 ‘부자 되세요’는 의미로 개업, 집들이 선물로 인기 있는 식물이에요. 빛이 적은 곳에서도 잘 자라고 건조에도 강한 식물이라 초보가드너도 쉽게 키울 수 있답니다. 폭우가 내리는 기간과 비가 오지 않아 건조한 기간이 공존하는 동아프리카가 원산지 랍니다. 극단적인 환경에 잘 적응했기 때문에 다양한 환경에서 잘 견디는 편이에요. 식물에는 독성이 있어서 반려동물과 어린아이가 있는 집이라면 주의를 기울여야 해요.',
        'https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/16557967453111.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '[ 행운목 ]
        행운목으로 잘 알려진 드라세나 맛상게아나는 1700년대부터 유럽에서 실내식물로 이용되었어요. 행운목은 빛이 적은 곳에서도 잘 자라 초보가드너도 쉽게 키울 수 있는 식물이에요. 또한 주변 습도를 촉촉하게 만들어주는 능력이 뛰어나 실내 공기정화식물로 오랫동안 사랑 받는 식물이랍니다. 영어이름은 ‘Corn plant’인데, 행운목의 잎 모양이 옥수수 잎 모양과 닮아있어서 붙여진 이름이랍니다. 종명인 ‘Fragrans’는 향기로운 꽃을 의미하는데, 향기로운 행운목 꽃은 7년에 한 번 정도 불규칙적으로 피어서 굉장히 드물어 꽃을 본 사람은 ‘다시 오지 않을 행운이 온다’는 이야기도 있어요. 다만, 반려동물에게 독성이 있으므로 주의해 주세요.',
        'https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/16571933693961.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '[ 스투키 ]
        건조하고 따뜻한 아프리카에서 온 스투키는 강한 생명력을 가지고 있어 식물을 처음 키우는 초보자들에게 많이 추천하는 식물이에요. 사실 ‘스투키’라는 식물은 우리가 키우는 스투키와는 다른 식물이에요 국내에서 유통되는 스투키의 대부분은 ‘실린드리카’라는 식물이랍니다. 스투키와 비슷하게 생겼지만 성장 속도가 빨라서 성장 속도가 느린 스투키 대신 유통되고 있어요. 밤에 산소를 내뿜어 침실에 적합한 식물로 인기가 좋지만, 독성이 있어 반려동물과 어린아이가 먹지 않도록 조심해야 합니다.',
        'https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/1662619339309275685073_451859856695918_7461780793129810940_n.jpg',
        'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '오늘의 추천!따뜻한 봄날에 어울리는 식물인 민들레 어떠신가요? \r\n
        민들레는 대부분 노란색을 띄고 있어 하루를 싱그럽게 시작할 수 있어요 봄의 민들레를 놓치지 말아요!
        \r\n \r\n
        사진 출처 : 핀터레스트
        ',
        'https://i.pinimg.com/564x/18/b7/f1/18b7f16266e9a4b1107228328dbe3831.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '식덕후 관리자 추천 \r\n
        저는 집을 자주 비워 식물에 물을 자주 주지 못해요~ 그래서 저는 스투키와 다육이를 키우고 있답니다
        저와 같이 집을 자주 비우시거나 물을 주기 귀찮다 하시는 분들은 이 두 가지 식물을 키워보시는 건 어떠신가요?
        \r\n \r\n
        사진 출처 : 핀터레스트
        ',
        'https://i.pinimg.com/736x/78/07/8e/78078e0c7d82696577f33b960b3010ee.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '이 플랜테리어 좀 봐주세요~!~!~! \r\n
        유행에 맞게 플랜테리어에 관심을 가지고 있는 관리자랍니다! \r\n
        초보자다 하시는 분들은 몬스테라를 이용하시면 풍성하고 독특한 잎으로 멋진 인테리어를 하실 수 있을 거예요
        \r\n \r\n
        사진 출처 : 핀터레스트
        ',
        'https://i.pinimg.com/564x/d0/4e/67/d04e674a3f140a79057805a3e96ec30f.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '
        오늘 같은 화창한 날씨에 밖에 피어있는 들꽃 사진을 올려주시는 건 어떨까요? \r\n
        우리 사용자님들도 밖에서 꽃을 보는 여유로운 시간을 가지실 수 있으면 좋겠네요
        \r\n \r\n
        사진 출처 : 핀터레스트
        ',
        'https://i.pinimg.com/564x/9c/d4/4f/9cd44fb26498fbe7804a892d4d49a0da.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '관리자가 추천하는 봄 꽃! \r\n
        봄 향기를 물씬 품은 라벤더 \r\n
        보라보라한 색상이 보라색 덕후인 관리자 마음을 관통했답니다
        거기에 은은한 향기까지 기분 전환이 필요하신 우리 식집사님들께 추천드려요~
        \r\n \r\n
        사진 출처 : 핀터레스트
        ',
        'https://i.pinimg.com/564x/16/a9/f8/16a9f83b4719ebe2cbcb0a1ee29bf9fd.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '관리자의 오늘의 꽃 알라만다 \r\n
        알라만다로 공기전환과 기분전환 두마리의 토끼를 잡아요~
        \r\n \r\n
        사진 출처 : 다음 티스토리',
        'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F99EA20365B8F604D36',
        'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '관리자 픽 봄에는 뭐니뭐니해도 벚꽃! \r\n
        너무 빨리 벚꽃이 폈네요 \r\n
        우리 식집사님들도 벚꽃을 만끽하였으면 좋겠어요~
        \r\n \r\n
        사진 출처 : 핀터레스트
        ',
        'https://i.pinimg.com/564x/77/40/e1/7740e181c59bc7ed6e0bd407e3dd7ebe.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '관리자 추천 진달래 명소!
        안 간 사람은 있어도 한 번 간 사람은 없다는 진달래 명소를 추천해드려요
        경남 밀양 종남산, 경남 창원 천주산, 부천 원미산이 있어요!
        \r\n \r\n
        사진 출처 : 핀터레스트
        ',
        'https://i.pinimg.com/564x/90/e2/99/90e299ddf1a7a6c119285b8cbaf7f81c.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '먹잘알 관리자가 추천하는 봄 제철 채소 \r\n
        싱싱한 달래를 넣은 달래 간장 비빔밥과 달래 된장국으로 봄을 몸소 느껴보세요!
        \r\n \r\n
        사진 출처 : 핀터레스트
        ',
        'https://i.pinimg.com/564x/52/8c/37/528c37e90e82849b83e3cf1675729759.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '키우는 재미와 먹는 재미까지 대파키우기! \r\n
        대파값이 어마무시하게 오르면서 집에서 대파를 키우고 계신 식집사분들 많으시죠? \r\n
        조금의 팁을 드리자면 흰 부분을 최대한 자르지 않으면 더욱 신선하답니다
        \r\n \r\n
        사진 출처 : 핀터레스트',
        'https://i.pinimg.com/564x/da/09/20/da09200224266c829eb25b826b239e48.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '봄하면 생각나는 개나리! \r\n
        관리자는 돌담에 있는 개나리가 정말 이쁘더라구요~ \r\n
        개나리보신다면 사진 공유하며 기분 좋게 하루를 보내보아요
        \r\n \r\n
        사진 출처 : 핀터레스트',
        'https://i.pinimg.com/564x/30/fc/08/30fc08ff4f9d90e9a868799143e01379.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '초보식집사를 위한 식물 추천! \r\n
        키우기 쉽고 예쁜 식물을 추천해드려요~ \r\n
        드라세나 마지나타라는 식물은 잎이 독특해서 인테리어 요소로 좋고 음지에도 잘 견디는 강한 생명력을 가지고 있답니다!
        \r\n \r\n
        사진 출처 : 오늘의집
        ',
        'https://image.ohou.se/i/bucketplace-v2-development/uploads/cards/advices/164795184816809571.jpg?gif=1&w=720',
        'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '초보식집사를 위한 식물 추천! \r\n
        키우기 쉽고 예쁜 식물을 추천해드려요~ \r\n
        아라 우카리아라는 식물은 직사광선을 피하는 게 좋아요 공기정화 능력이 있어 실내에거 키우기 좋아요~ \r\n
        집이나 회사에서도 키우기 좋은 이쁜 아이랍니다
        \r\n \r\n
        사진 출처 : 오늘의집
        ',
        'https://image.ohou.se/i/bucketplace-v2-development/uploads/cards/advices/164795184777633866.jpg?gif=1&w=720',
        'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '초보식집사를 위한 식물 추천! \r\n
        키우기 쉽고 예쁜 식물을 추천해드려요~ \r\n
        드라세나 마지나타라는 식물은 잎이 독특해서 인테리어 요소로 좋고 음지에도 잘 견디는 강한 생명력을 가지고 있답니다!
        \r\n \r\n
        사진 출처 : 오늘의집
        ',
        'https://image.ohou.se/i/bucketplace-v2-development/uploads/cards/advices/164795184817569371.jpg?gif=1&w=720',
        'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '초보식집사를 위한 식물 추천! \r\n
        키우기 쉽고 예쁜 식물을 추천해드려요~ \r\n
        야레카야자는 물은 자주 주지 않아도 돼요 그래도 적당 온도는 꼭 유지해주어야 해요 큰 이파리로 생기를 불어주는 이쁜 식물이에요
        \r\n \r\n
        사진 출처 : 오늘의집
        ',
        'https://image.ohou.se/i/bucketplace-v2-development/uploads/cards/advices/164795184831144828.jpg?gif=1&w=720',
        'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '독특한 인테리어를 원한다면 \r\n
         호프셀렘을 키우시는 건 어떠신가요?\r\n
        물결모양의 이파리를 가져 매력적인 호프셀렘은 키우기도 까다롭지 않아 추천드리는 식물이에요!
        \r\n \r\n
        사진 출처 : 핀터레스트
        ',
        'https://i.pinimg.com/564x/a1/a5/25/a1a525d7c7ace86c11a149108d36975c.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '공기정화 식물 추천 \r\n
         공기정화와 예쁜 식물 두 가지를 모두 충족시키는 식물을 찾고 계신가요?\r\n
        긴기아난은 공기 정화와 꽃향기, 예쁜 꽃까지 가지고 있는 식물이에요 반양지 식물로 키우기 어렵지 않으실 거예요
        \r\n \r\n
        사진 출처 : 핀터레스트
        ',
        'https://i.pinimg.com/564x/7f/74/ce/7f74ce3ef4925d0a5e82cf0f355bdf0b.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '이쁜 필로덴드론 버킨을 키워보아요 \r\n
         무늬콩고나무는 이쁜 무늬가 있습니다\r\n
        밝은 색 부분의 면적이 달라지며 다채로운 색다른 매력을 느낄 수 있어요! \r\n
        밝고 간접적인 햇빛에 잘 자라요 여름 직사 광선에 의해 잎이 화상을 입을 수 있으니 주의해주세요
        \r\n \r\n
        사진 출처 : 플립
        ',
        'https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/16575175567503.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '먹잘알 관리자는 미나리를 위해 봄을 기다린답니다 \r\n
        미나리를 먹으며 향긋한 봄을 느끼곤 해요 \r\n
        여러분들도 미나리전, 미나리무침 등 다양한 요리를 통해 봄을 만끽해 보아요
        \r\n \r\n
        사진 출처 : 핀터레스트
        ',
        'https://i.pinimg.com/564x/34/f9/b4/34f9b4a9caa04b991d7cd57b03331093.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '집안 분위기를 바꿀 식물 추천 \r\n
         큼지막한 식물로 집 분위기를 바꾸어 보아요! \r\n
        알로카시아는 적은 빛으로도 잘 자라 실내 인테리어 식물로 꾸준한 사랑을 받고 있어요 건조에 견디는 능력도 뛰어나 편히 키우실 수 있을 거예요
        \r\n \r\n
        사진 출처 : 핀터레스트
        ',
        'https://i.pinimg.com/564x/c2/e9/c2/c2e9c27d5e6704a5d692d45b04cff6cf.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '관리자가 행잉할 식물 추천해드려요 \r\n
         늘어나는 식물을 행잉으로 다는 것이 요즘 유행이라면서요 \r\n
        그래서 관리자의 취향을 듬뿍 담아 추천해드려요~ 립살리스 카스타는 물을 자주 주지 않아도 되고 키우기 까다롭지 않답니다 아래로 흘러 내리면서 자라는 모습이 굉장히 싱그럽습니다!
        \r\n \r\n
        사진 출처 : 플립
        ',
        'https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/1671714493859307254818_620860486281598_7821593844307380632_n.jpg',
        'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '독특한 다육식물 추천 \r\n
         요즘 키우기 쉬운 다육이를 집에 두는 경우가 많죠? \r\n
         다육이 중에서도 독특하고 흔하지 않은 제옥을 소개해드릴게요~ 제옥은 마치 코뿔소를 연상시키는 특이한 모양의 다육식물이에요 바위틈이나 자갈들 사이에서 성장하고 주변 색과 비슷한 색과 질감으로 자랍니다 탈피도 하는데 오래된 잎이 벌어지면 그 사이에서 새 잎이 나오는 신기한 식물이랍니다!
        \r\n \r\n
        사진 출처 : 플립
        ',
        'https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/16642770672522.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '개업, 집들이 선물로는 천냥금 \r\n
         천냥금은 부와 재산을 상징하고 있어요! \r\n
         빛이 적은 곳에서도 잘 자라고 관리하기 까다롭지 않아 초보 식집사분들도 잘 키우실 수 있을 거예요! 귀여운 열매와 하얀 꽃을 모두 볼 수 있는 매력둥이입니다
        \r\n \r\n
        사진 출처 : 플립
        ',
        'https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/16741205500694.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '특별한 날 선물해주세요, 칼랑코에 \r\n
         가리비모양의 도톰한 잎과 풍성한 꽃으로 마음을 설레게 하는 칼랑코에는 다육식물이기 때문에 물을 자주 주지 않아도 된답니다. 밤 시간에는 빛을 차단해주어야 하는 점만 유의한다면 초보 식집자님들도 잘 키우실 수 있을 거예요~
        \r\n \r\n
        사진 출처 : 플립
        ',
        'https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/156981324789603_kolopejka-3375163_1280.jpg', 'N', 0,
        @user),
       ('FEED_POST', now(), now(), 0,
        '오늘 같은 날 당신에게 이런 선물을, 틸란드시아 키아네아  \r\n
         잎의 한 가운데서 보라색 꽃이 피는 식물이에요 파인애플과에 속하고 공기 중에 미세먼지를 먹고 자라 공기 정화에도 도움이 된답니다! 건조한 지역에서 온 키아네아는 물이 없고 자라기 힘든 곳에서도 자라난답니다! 유럽에서 아주 인기가 좋은 식물이에요
        \r\n \r\n
        사진 출처 : 플립
        ',
        'https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/1571715151029suful.flower_72889204_381951532681565_6827525839335107255_n.jpg',
        'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '보라보라해, 삼색 달개비 \r\n
        보라 덕후 관리자의 최애 식물을 소개시켜주려고 해요! \r\n
        보라색을 좋아하는 사람이라면 쉽사리 넘어갈 수 없을 만큼 이쁜 식물이랍니다.
        삼색 달개비는 예쁜 색감 덕분에 꾸준하게 인기 있는 식물이에요. 과습에만 주의해주신다면 초보 가드너도 잘 키울 수 있어요 또한 성장 속도가 매우 빨라 키우는 재미도 쏠쏠하답니다!
        \r\n \r\n
        사진 출처 : 플립
        ',
        'https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/16781037244642.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '하트하트해, 하트 호야 \r\n
        사랑하는 사람에게 마음을 전할 식물을 추천해드릴게요 \r\n
        하트 모양이 선명한 하트호야는 예쁜 생김사는 물론이고 키우기도 까다롭지 않아 식물을 처음 키우는 분들께도 선물하기 좋아요. \r\n
        사랑스러운 생김새에 서양에서는 발렌타인 데이에 연인에게 선물해준다고 하네요! 통통한 잎에는 수분을 많이 머금고 있어 물을 자주 주지 않아도 되고 평균 실내 습도에서도 잘 자라는 순둥이랍니다!
        \r\n \r\n
        사진 출처 : 플립
        ',
        'https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/16655792924111.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '여름에 추천하는 칼라디움 \r\n
        칼라디움은 여름을 대표하는 관엽식물이에요 \r\n
        잎만응로도 꽃보다 아름다운 미모를 뽐내는 칼라디움은 다양한 크기, 화려한 무늬의 잎을 가지고 있답니다. 밤 온도가 20℃ 이하로 떨어지면 겨울잠을 잘 준비를 하는 귀여운 식물이에요 \r\n
        겨울잠을 재우지 않고 계속 키워주셔도 되지만, 더 풍성한 잎과 예쁜 무늬를 위해서는 겨울잠을 재워주는 게 좋아요
        \r\n \r\n
        사진 출처 : 플립
        ',
        'https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/16614198340501.webp', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '여름을 대표하는 수국 \r\n
        수국은 여름을 대표하는 꽃이에요 \r\n
        아름다운 색깔의 앙증맞은 꽃이 여러 개 모여 동그란 구모양을 이룬 모습이 보기만해도 청량하고 시원해지는 느낌을 준답니다. 이름에 물이 들어가는만큼 물을 좋아하는 수국은 꽃이 피기 시작하면 물 마름이 아주 빠르고, 조금만 목이 말라도 잎과 꽃이 축 처져 물주기에 주의를 기울여야하는 식물이에요 \r\n \r\n
        \r\n \r\n
        사진 출처 : 플립
        ',
        'https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/16614198340501.webp', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '귀여운 틸란드시아 이오난사으로 소확행을 꿈꿔봐요 \r\n
        이오난사는 멕시코에서 온 흙없이 키우는 공중식물이에요 \r\n
        은빛이 도는 초록 잎을 빨갛게 물들인 후 보라색 꽃이 피는데, 이오난사의 꽃은 이오난사가 죽기 직전 마지막으로 주는 선물이라고해요 낭만을 가지고 있는 식집사들에게 아주 좋은 식물이 될 듯 하네요
        \r\n \r\n
        사진 출처 : 핀터레스트
        ',
        'https://i.pinimg.com/736x/51/f3/7d/51f37dca589ccbd481978df8ac5a1945.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '흔하지 않은 다육이를 키우고 싶다면, 덕구리 난 \r\n
        덕구리 난은 백합과 식물로 천년을 살아간다고 하는 식물이에요. 이름에 난이 들어가지만 난의 종류는 아니랍니다 \r\n
         줄기 부분이 코끼리의 발을 닮았다고 해서 elephant foot이라는 영어 이름을 가지고 있는 독특한 식물이에요
        \r\n \r\n
        사진 출처 : 플립
        ',
        'https://huga.s3.ap-northeast-2.amazonaws.com/plantImages/16557975698544.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '햇빛이 안 드는 집에서 식물 키우기 \r\n
        햇빛이 잘 안드는 곳에서 식물을 키우는 것이 굉장히 힘들죠~ \r\n
        물론 햇빛이 많이 필요하지 않는 식물을 키우는 방법도 있지만, 햇빛이 잘 안들어 오는 공간이라면 물 주기르 신경쓰기보다 환기를 잘하는 것이 더욱 튼튼한 식물을 키우는 데 도움이 된답니다
        \r\n \r\n
        사진 출처 : 핀터레스트
        ',
        'https://i.pinimg.com/564x/78/0d/3e/780d3ea2f6377dba8f9c3e01dbdcb65f.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '냥집사와 식집사 동시에?! \r\n
        식물이 독성으로 인해 냥주인들에게 좋지 않은 영향을 주어 걱정하는 분들이 많이 늘었더라구요 \r\n
        그 분들을 위한 꿀팁을 가지고 왔습니다 접란, 덕구리 난, 시페루스는 고양이에게 아주 안전하답니다~ 반려묘를 키우시는 분들은 참고해서 식물을 들이면 좋을 것 같네요
        \r\n \r\n
        사진 출처 : 핀터레스트
        ',
        'https://i.pinimg.com/564x/8a/c2/a0/8ac2a0b68245587e225a54fda775f6b3.jpg', 'N', 0, @user),
       ('FEED_POST', now(), now(), 0,
        '플랜테리어하면서도 건강한 식물로 가꾸는 법 \r\n
        플랜테리어 하면서 식물이 금방 시든다며 고민이 많으신 분들이 있으시더라구요 \r\n
        그 분들을 위한 꿀팁을 가지고 왔습니다 \r\n
        첫 번째, 좋은 환경 순서로 순위를 매기기 (햇빛이 어디까지 오는지 확인) \r\n
        두 번째, 처음 집에 온 식물은 무조건 가장 좋은 자리에! \r\n
        마지막, 자리를 순회하며 식물의 위치를 바꿔줍니다! \r\n
        모두 이쁜 인테리어와 식물 관리까지 성공하셨으면 좋겠네요
        \r\n \r\n
        사진 출처 : 핀터레스트',
        'https://i.pinimg.com/736x/b6/80/eb/b680ebd7fdb2f64a34dbf0d917482718.jpg', 'N', 0, @user)
;
SET @feed := last_insert_id() - 1;

insert into post (id)
values (@feed + 1),
       (@feed + 2),
       (@feed + 3),
       (@feed + 4),
       (@feed + 5),
       (@feed + 6),
       (@feed + 7),
       (@feed + 8),
       (@feed + 9),
       (@feed + 10),
       (@feed + 11),
       (@feed + 12),
       (@feed + 13),
       (@feed + 14),
       (@feed + 15),
       (@feed + 16),
       (@feed + 17),
       (@feed + 18),
       (@feed + 19),
       (@feed + 20),
       (@feed + 21),
       (@feed + 22),
       (@feed + 23),
       (@feed + 24),
       (@feed + 25),
       (@feed + 26),
       (@feed + 27),
       (@feed + 28),
       (@feed + 29),
       (@feed + 30),
       (@feed + 31),
       (@feed + 32),
       (@feed + 33),
       (@feed + 34),
       (@feed + 35),
       (@feed + 36),
       (@feed + 37),
       (@feed + 38),
       (@feed + 39),
       (@feed + 40),
       (@feed + 41),
       (@feed + 42),
       (@feed + 43),
       (@feed + 44),
       (@feed + 45);

insert into feed_tag (feed_id, tag_id)
values (@feed + 1, @tag + 9),
       (@feed + 1, @tag + 3),
       (@feed + 1, @tag + 10),
       (@feed + 2, @tag + 9),
       (@feed + 2, @tag + 10),
       (@feed + 3, @tag + 6),
       (@feed + 3, @tag + 7),
       (@feed + 3, @tag + 10),
       (@feed + 4, @tag + 6),
       (@feed + 4, @tag + 2),
       (@feed + 4, @tag + 3),
       (@feed + 4, @tag + 4),
       (@feed + 5, @tag + 6),
       (@feed + 5, @tag + 2),
       (@feed + 5, @tag + 8),
       (@feed + 5, @tag + 7),
       (@feed + 6, @tag + 6),
       (@feed + 6, @tag + 7),
       (@feed + 6, @tag + 2),
       (@feed + 6, @tag + 8),
       (@feed + 7, @tag + 1),
       (@feed + 7, @tag + 2),
       (@feed + 7, @tag + 3),
       (@feed + 7, @tag + 19),
       (@feed + 8, @tag + 1),
       (@feed + 8, @tag + 2),
       (@feed + 8, @tag + 3),
       (@feed + 8, @tag + 4),
       (@feed + 8, @tag + 18),
       (@feed + 9, @tag + 5),
       (@feed + 9, @tag + 2),
       (@feed + 9, @tag + 3),
       (@feed + 10, @tag + 2),
       (@feed + 10, @tag + 3),
       (@feed + 10, @tag + 4),
       (@feed + 10, @tag + 5),
       (@feed + 11, @tag + 1),
       (@feed + 11, @tag + 2),
       (@feed + 11, @tag + 3),
       (@feed + 11, @tag + 4),
       (@feed + 11, @tag + 19),
       (@feed + 11, @tag + 18),
       (@feed + 12, @tag + 11),
       (@feed + 12, @tag + 13),
       (@feed + 12, @tag + 14),
       (@feed + 13, @tag + 1),
       (@feed + 13, @tag + 2),
       (@feed + 13, @tag + 3),
       (@feed + 14, @tag + 15),
       (@feed + 14, @tag + 16),
       (@feed + 15, @tag + 6),
       (@feed + 15, @tag + 11),
       (@feed + 15, @tag + 14),
       (@feed + 16, @tag + 11),
       (@feed + 16, @tag + 12),
       (@feed + 17, @tag + 13),
       (@feed + 17, @tag + 11),
       (@feed + 17, @tag + 6),
       (@feed + 18, @tag + 11),
       (@feed + 18, @tag + 6),
       (@feed + 19, @tag + 11),
       (@feed + 19, @tag + 4),
       (@feed + 19, @tag + 22),
       (@feed + 20, @tag + 17),
       (@feed + 20, @tag + 11),
       (@feed + 22, @tag + 11),
       (@feed + 22, @tag + 13),
       (@feed + 22, @tag + 14),
       (@feed + 23, @tag + 2),
       (@feed + 23, @tag + 10),
       (@feed + 23, @tag + 16),
       (@feed + 24, @tag + 2),
       (@feed + 24, @tag + 5),
       (@feed + 24, @tag + 4),
       (@feed + 24, @tag + 3),
       (@feed + 25, @tag + 2),
       (@feed + 25, @tag + 10),
       (@feed + 25, @tag + 18),
       (@feed + 26, @tag + 2),
       (@feed + 26, @tag + 19),
       (@feed + 26, @tag + 18),
       (@feed + 27, @tag + 15),
       (@feed + 27, @tag + 16),
       (@feed + 27, @tag + 5),
       (@feed + 27, @tag + 2),
       (@feed + 28, @tag + 3),
       (@feed + 28, @tag + 7),
       (@feed + 28, @tag + 6),
       (@feed + 28, @tag + 5),
       (@feed + 29, @tag + 5),
       (@feed + 29, @tag + 16),
       (@feed + 29, @tag + 17),
       (@feed + 30, @tag + 7),
       (@feed + 30, @tag + 17),
       (@feed + 30, @tag + 11),
       (@feed + 31, @tag + 4),
       (@feed + 31, @tag + 16),
       (@feed + 31, @tag + 15),
       (@feed + 31, @tag + 10),
       (@feed + 32, @tag + 1),
       (@feed + 32, @tag + 19),
       (@feed + 32, @tag + 16),
       (@feed + 32, @tag + 4),
       (@feed + 32, 18),
       (@feed + 33, @tag + 1),
       (@feed + 33, @tag + 19),
       (@feed + 33, @tag + 18),
       (@feed + 34, @tag + 9),
       (@feed + 34, @tag + 8),
       (@feed + 34, @tag + 2),
       (@feed + 34, @tag + 10),
       (@feed + 34, @tag + 3),
       (@feed + 35, @tag + 1),
       (@feed + 35, @tag + 6),
       (@feed + 35, @tag + 3),
       (@feed + 35, @tag + 2),
       (@feed + 35, @tag + 8),
       (@feed + 36, @tag + 3),
       (@feed + 36, @tag + 6),
       (@feed + 36, @tag + 8),
       (@feed + 36, @tag + 19),
       (@feed + 37, @tag + 12),
       (@feed + 37, @tag + 2),
       (@feed + 37, @tag + 5),
       (@feed + 37, @tag + 8),
       (@feed + 37, @tag + 15),
       (@feed + 38, @tag + 2),
       (@feed + 38, @tag + 8),
       (@feed + 38, @tag + 5),
       (@feed + 38, @tag + 19),
       (@feed + 39, @tag + 4),
       (@feed + 39, @tag + 5),
       (@feed + 39, @tag + 20),
       (@feed + 40, @tag + 4),
       (@feed + 40, @tag + 6),
       (@feed + 40, @tag + 20),
       (@feed + 41, @tag + 2),
       (@feed + 41, @tag + 3),
       (@feed + 41, @tag + 5),
       (@feed + 41, @tag + 8),
       (@feed + 41, @tag + 21),
       (@feed + 42, @tag + 1),
       (@feed + 42, @tag + 2),
       (@feed + 42, @tag + 10),
       (@feed + 43, @tag + 4),
       (@feed + 43, @tag + 22),
       (@feed + 44, @tag + 22),
       (@feed + 44, @tag + 23),
       (@feed + 45, @tag + 15),
       (@feed + 45, @tag + 16),
       (@feed + 45, @tag + 22)
;

SELECT @Cnt1 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 1;
update tag
set count=@Cnt1
where id = @tag + 1;
SELECT @Cnt2 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 2;
update tag
set count=@Cnt2
where id = @tag + 2;
SELECT @Cnt3 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 3;
update tag
set count=@Cnt3
where id = @tag + 3;
SELECT @Cnt4 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 4;
update tag
set count=@Cnt4
where id = @tag + 4;
SELECT @Cnt5 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 5;
update tag
set count=@Cnt5
where id = @tag + 5;
SELECT @Cnt6 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 6;
update tag
set count=@Cnt6
where id = @tag + 6;
SELECT @Cnt7 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 7;
update tag
set count=@Cnt7
where id = @tag + 7;
SELECT @Cnt8 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 8;
update tag
set count=@Cnt8
where id = @tag + 8;
SELECT @Cnt9 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 9;
update tag
set count=@Cnt9
where id = @tag + 9;
SELECT @Cnt10 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 10;
update tag
set count=@Cnt10
where id = @tag + 10;
SELECT @Cnt11 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 11;
update tag
set count=@Cnt11
where id = @tag + 11;
SELECT @Cnt12 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 12;
update tag
set count=@Cnt12
where id = @tag + 12;
SELECT @Cnt13 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 13;
update tag
set count=@Cnt13
where id = @tag + 13;
SELECT @Cnt14 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 14;
update tag
set count=@Cnt14
where id = @tag + 14;
SELECT @Cnt15 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 15;
update tag
set count=@Cnt15
where id = @tag + 15;
SELECT @Cnt16 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 16;
update tag
set count=@Cnt16
where id = @tag + 16;
SELECT @Cnt17 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 17;
update tag
set count=@Cnt17
where id = @tag + 17;
SELECT @Cnt18 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 18;
update tag
set count=@Cnt18
where id = @tag + 18;
SELECT @Cnt19 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 19;
update tag
set count=@Cnt19
where id = @tag + 19;
SELECT @Cnt20 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 20;
update tag
set count=@Cnt20
where id = @tag + 20;
SELECT @Cnt21 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 21;
update tag
set count=@Cnt21
where id = @tag + 21;
SELECT @Cnt22 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 22;
update tag
set count=@Cnt22
where id = @tag + 22;
SELECT @Cnt23 := COUNT(*)
FROM feed_tag
where tag_id = @tag + 23;
update tag
set count=@Cnt23
where id = @tag + 23;

-- gorse items
DROP DATABASE IF EXISTS gorse;
CREATE DATABASE gorse;

DROP TABLE IF EXISTS `gorse`.`feedback`;
DROP TABLE IF EXISTS `gorse`.`users`;
DROP TABLE IF EXISTS `gorse`.`items`;

CREATE TABLE IF NOT EXISTS `gorse`.items
(
    `item_id`    varchar(256) NOT NULL,
    `is_hidden`  tinyint(1)   NOT NULL,
    `categories` json         NOT NULL,
    `time_stamp` datetime     NOT NULL,
    `labels`     json         NOT NULL,
    `comment`    text         NOT NULL,
    PRIMARY KEY (`item_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `gorse`.`users`
(
    `user_id`   varchar(256) NOT NULL,
    `labels`    json         NOT NULL,
    `subscribe` json         NOT NULL,
    `comment`   text         NOT NULL,
    PRIMARY KEY (`user_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `gorse`.`feedback`
(
    `feedback_type` varchar(256) NOT NULL,
    `user_id`       varchar(256) NOT NULL,
    `item_id`       varchar(256) NOT NULL,
    `time_stamp`    datetime     NOT NULL,
    `comment`       text         NOT NULL,
    PRIMARY KEY (`feedback_type`, `user_id`, `item_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

-- item에 넣을 labels를 생성하는 함수
-- SET GLOBAL log_bin_trust_function_creators = 1;
-- 함수 생성 시작
-- DELIMITER $$
-- DROP FUNCTION IF EXISTS `gorse`.`CREATE_LABEL`$$
-- CREATE FUNCTION `gorse`.`CREATE_LABEL`(
-- 	`get_feed_id` bigint
-- ) RETURNS json
-- BEGIN
-- 	DECLARE labels json;
-- 	select CONCAT('[', GROUP_CONCAT('"',content,'"'), ']')
-- 		from `chicochico`.`tag`
-- 		where id in (
-- 			select tag_id from `chicochico`.`feed_tag` where feed_id = get_feed_id
-- 		)
-- 		into labels;
-- 	RETURN labels;
-- END$$
-- DELIMITER ;
-- -- 함수 생성 종료
-- SET GLOBAL log_bin_trust_function_creators = 0;

-- -- gorse에 item을 넣는 프로시저
-- DELIMITER $$
-- DROP PROCEDURE IF EXISTS `gorse`.`INSERT_ITEMS`$$
-- CREATE PROCEDURE `gorse`.`INSERT_ITEMS`(IN `startFeedId` bigint, IN `endFeedId` bigint)
-- BEGIN
-- 	DECLARE labels json;
--     while startFeedId <= endFeedId do
--         select `gorse`.CREATE_LABEL(startFeedId)
--         into labels;
--
--        INSERT INTO `gorse`.`items`
-- 			(`item_id`,`is_hidden`,`categories`,`time_stamp`,`labels`,`comment`)
-- 			VALUES
-- 			(startFeedId, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"',content,'"'), ']')
-- 		from `chicochico`.`tag`
-- 		where id in (
-- 			select tag_id from `chicochico`.`feed_tag` where feed_id = get_feed_id
-- 		)
--         ), '[]'), "");
--        SET startFeedId = startFeedId + 1;
--     END while;
-- END $$
-- DELIMITER ;
-- -- 프로시저 실행
-- CALL `gorse`.`INSERT_ITEMS`(@feed+1, @feed+45);


INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 1, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                           from `chicochico`.`tag`
                                           where id in (select tag_id
                                                        from `chicochico`.`feed_tag`
                                                        where feed_id =
                                                              @feed + 1)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 2, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                           from `chicochico`.`tag`
                                           where id in (select tag_id
                                                        from `chicochico`.`feed_tag`
                                                        where feed_id =
                                                              @feed + 2)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 3, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                           from `chicochico`.`tag`
                                           where id in (select tag_id
                                                        from `chicochico`.`feed_tag`
                                                        where feed_id =
                                                              @feed + 3)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 4, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                           from `chicochico`.`tag`
                                           where id in (select tag_id
                                                        from `chicochico`.`feed_tag`
                                                        where feed_id =
                                                              @feed + 4)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 5, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                           from `chicochico`.`tag`
                                           where id in (select tag_id
                                                        from `chicochico`.`feed_tag`
                                                        where feed_id =
                                                              @feed + 5)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 6, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                           from `chicochico`.`tag`
                                           where id in (select tag_id
                                                        from `chicochico`.`feed_tag`
                                                        where feed_id =
                                                              @feed + 6)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 7, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                           from `chicochico`.`tag`
                                           where id in (select tag_id
                                                        from `chicochico`.`feed_tag`
                                                        where feed_id =
                                                              @feed + 7)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 8, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                           from `chicochico`.`tag`
                                           where id in (select tag_id
                                                        from `chicochico`.`feed_tag`
                                                        where feed_id =
                                                              @feed + 8)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 9, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                           from `chicochico`.`tag`
                                           where id in (select tag_id
                                                        from `chicochico`.`feed_tag`
                                                        where feed_id =
                                                              @feed + 9)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 10, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 10)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 11, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 11)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 12, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 12)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 13, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 13)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 14, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 14)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 15, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 15)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 16, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 16)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 17, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 17)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 18, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 18)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 19, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 19)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 20, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 20)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 21, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 21)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 22, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 22)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 23, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 23)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 24, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 24)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 25, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 25)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 26, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 26)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 27, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 27)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 28, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 28)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 29, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 29)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 30, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 30)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 31, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 31)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 32, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 32)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 33, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 33)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 34, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 34)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 35, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 35)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 36, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 36)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 37, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 37)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 38, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 38)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 39, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 39)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 40, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 40)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 41, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 41)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 42, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 42)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 43, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 43)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 44, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 44)), '[]'), "");
INSERT INTO `gorse`.`items` (`item_id`, `is_hidden`, `categories`, `time_stamp`, `labels`, `comment`)
VALUES (@feed + 45, 0, '[]', now(), ifnull((select CONCAT('[', GROUP_CONCAT('"', content, '"'), ']')
                                            from `chicochico`.`tag`
                                            where id in (select tag_id
                                                         from `chicochico`.`feed_tag`
                                                         where feed_id =
                                                               @feed + 45)), '[]'), "");