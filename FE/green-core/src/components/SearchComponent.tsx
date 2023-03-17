import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getTagFeedList, getTagFeedListMore } from '@/core/feed/feedAPI';
import { searchByUser, searchByUserMore } from '@/core/user/userAPI';
import styles from '@/styles/feed.module.scss';
import SearchFedListItem from '@/components/SearchFeedListItem';
import SearchUserListItem from '@/components/SearchUserListItem';

export default function SearchComponent() {
  const dispatch = useAppDispatch();

  // 검색창
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<string>('feed');
  const [searchTypeTemp, setSearchTypeTemp] = useState<string>('feed');
  const [inputData, setInputData] = useState<string>(''); // 인풋데이터

  // -------------------------- 태그 검색 변수 -----------------------------
  const tagFeedList = useAppSelector((state) => state.feed.tagFeedList);
  const isStopedAtTag = useAppSelector((state) => state.feed.isStopedAtTag);
  const pageAtTag = useAppSelector((state) => state.feed.pageAtTag);

  const [sizeAtTag, setSizeAtTag] = useState<number>(10);
  const [targetAtTag, setTargetAtTag] = useState(null); // 관찰 대상 target
  const [isLoadedAtTag, setIsLoadedAtTag] = useState(true); // 데이터 로딩 상태

  // -------------------------- 사용자 검색 변수 -----------------------------
  const searchUserList = useAppSelector((state) => state.user.searchUserList);
  const isStopedAtUser = useAppSelector((state) => state.user.isStopedAtUser);
  const pageAtUser = useAppSelector((state) => state.user.pageAtUser);

  const [sizeAtUser, setSizeAtUser] = useState<number>(10);
  const [targetAtUser, setTargetAtUser] = useState(null); // 관찰 대상 target
  const [isLoadedAtUser, setIsLoadedAtUser] = useState(true); // 데이터 로딩 상태

  // -------------------------- 태그 -------------------------------

  function searchTag(search: string) {
    const params = {
      search: search,
      page: 0,
      size: sizeAtTag,
    };
    dispatch(getTagFeedList(params));
    setIsLoadedAtTag(false);
  }

  // 타겟 설정
  useEffect(() => {
    let observer2;
    if (targetAtTag && !isStopedAtTag && inputData) {
      setTimeout(() => {
        observer2 = new IntersectionObserver(onIntersect2, {
          threshold: 1, // 배열의 요소가 100% 보여질때마다 콜백을 실행
        });
        observer2.observe(targetAtTag);
      }, 100);
    }
    return () => observer2 && observer2.disconnect();
  }, [targetAtTag, isLoadedAtTag]);

  // 타겟을 만났을 때 실행하는 로직
  const onIntersect2 = async ([entry2]: any, observer2: any) => {
    if (entry2.isIntersecting && !isLoadedAtTag) {
      observer2.unobserve(entry2.target); // 관찰 멈춤
      getMoreItem2(); // isLoaded를 바꿈
      observer2.observe(entry2.target); // 관찰 재시작
    }
  };

  // 추가 데이터 요청
  const getMoreItem2 = () => {
    setIsLoadedAtTag(true);
  };

  // isLoadedAtTag 가 변할 때 실행
  useEffect(() => {
    if (inputData !== '' && isLoadedAtTag) {
      fetchTagFeedList();
    }
    return () => {};
  }, [isLoadedAtTag]);

  // 추가 데이터 요청하기
  async function fetchTagFeedList() {
    const params = {
      search: inputData,
      page: pageAtTag,
      size: sizeAtTag,
    };
    await dispatch(getTagFeedListMore(params));
    setIsLoadedAtTag(false);
  }

  // -------------------------- 프로필 -------------------------------

  function searchUser(search: string) {
    const params = {
      search: search,
      page: 0,
      size: sizeAtUser,
    };
    dispatch(searchByUser(params));
    setIsLoadedAtUser(false);
  }

  // 타겟 설정
  useEffect(() => {
    let observerAtUser;
    if (targetAtUser && !isStopedAtUser && inputData) {
      setTimeout(() => {
        observerAtUser = new IntersectionObserver(onIntersectAtUser, {
          threshold: 1, // 배열의 요소가 100% 보여질때마다 콜백을 실행
        });
        observerAtUser.observe(targetAtUser);
      }, 100);
    }
    return () => observerAtUser && observerAtUser.disconnect();
  }, [targetAtUser, isLoadedAtUser]);

  // 타겟을 만났을 때 실행하는 로직
  const onIntersectAtUser = async ([entryAtUser]: any, observer2: any) => {
    if (entryAtUser.isIntersecting && !isLoadedAtUser) {
      observer2.unobserve(entryAtUser.target); // 관찰 멈춤
      getMoreItemAtUser(); // isLoaded를 바꿈
      observer2.observe(entryAtUser.target); // 관찰 재시작
    }
  };

  // 추가 데이터 요청
  const getMoreItemAtUser = () => {
    setIsLoadedAtUser(true);
  };

  // isLoadedAtTag 가 변할 때 실행
  useEffect(() => {
    if (inputData !== '' && isLoadedAtUser) {
      fetchUserList();
    }
    return () => {};
  }, [isLoadedAtUser]);

  // 추가 데이터 요청하기
  async function fetchUserList() {
    const params = {
      search: inputData,
      page: pageAtUser,
      size: sizeAtUser,
    };
    await dispatch(searchByUserMore(params));
    setIsLoadedAtUser(false);
  }

  // ------------------------------------------------------------셀렉트 박스

  const OPTIONS = [
    { value: 'feed', name: '피드' },
    { value: 'profile', name: '사용자' },
    { value: 'plant', name: '식물도감' },
  ];

  const SelectBox = (props) => {
    const handleChange = (e) => {
      setSearchType(e.target.value);
    };

    return (
      <select className={`${styles.selectBox}`} onChange={handleChange} defaultValue={searchType}>
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    );
  };

  // 검색
  function handleKeyUp(event) {
    if (event.key === 'Enter') {
      setIsSearched(true);
      setInputData(event.target.value);
      setSearchTypeTemp(searchType); // 결과 디브 재렌더링 하기!

      if (searchType === 'feed') {
        // 태그 검색
        searchTag(event.target.value);
      } else if (searchType === 'profile') {
        searchUser(event.target.value);
        // 닉네임 검색
      } else if (searchType === 'plant') {
        // 식물이름 검색
      }
    }
  }

  // ----------------------------------------------------------------

  return (
    <>
      <div className={`${styles.search} w-full flex`}>
        <SelectBox options={OPTIONS} defaultValue='feed'></SelectBox>
        <input
          type='text'
          placeholder={searchType === 'feed' ? '태그를 입력하세요' : searchType === 'feed' ? '닉네임을 입력하세요' : '식물 이름을 입력하세요'}
          onKeyUp={handleKeyUp}
        />
        <img src='https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/icon/search.png' />
      </div>
      {!isSearched ? (
        <div>첫 검색 전에 데이터 놔둘 곳</div>
      ) : searchTypeTemp === 'feed' ? (
        tagFeedList.length === 0 ? (
          <div>조회된 게시글이 없습니다</div>
        ) : (
          <div className={`overflow-auto`} style={{ height: '700px' }}>
            {tagFeedList.map((tagFeed) => (
              <SearchFedListItem key={tagFeed.feedId} tagFeed={tagFeed}></SearchFedListItem>
            ))}
            <div ref={setTargetAtTag} />
            <div className={`p-5`}></div>
          </div>
        )
      ) : searchTypeTemp === 'profile' ? (
        searchUserList.length === 0 ? (
          <div>조회된 유저가 없습니다</div>
        ) : (
          <div className={`overflow-auto`} style={{ height: '700px' }}>
            {searchUserList.map((user) => (
              <SearchUserListItem key={user.nickname} searchUser={user}></SearchUserListItem>
            ))}
            <div ref={setTargetAtUser} />
            <div className={`p-5`}></div>
          </div>
        )
      ) : (
        <div></div>
      )}
    </>
  );
}
