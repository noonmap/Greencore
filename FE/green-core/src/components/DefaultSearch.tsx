import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { getTagFeedList, getTagFeedListMore } from '@/core/feed/feedAPI';
import { searchByUser, searchByUserMore } from '@/core/user/userAPI';
import { searchByPlantName, searchByPlantNameMore } from '@/core/plant/plantAPI';
import Image from 'next/image';
import styles from './DefaultSearch.module.scss';
import SearchFedListItem from '@/components/SearchFeedListItem';
import SearchUserListItem from '@/components/SearchUserListItem';
import SearchPlantListItem from '@/components/SearchPlantListItem';

export default function DefaultSearch() {
  const dispatch = useAppDispatch();

  // 태그 클릭 이벤트
  const searchTagValue = useAppSelector((state) => state.search.searchTag);

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

  // -------------------------- 식물 검색 변수 -----------------------------
  const searchPlantList = useAppSelector((state) => state.plant.searchPlantList);
  const isStopedAtPlant = useAppSelector((state) => state.plant.isStopedAtPlant);
  const pageAtPlant = useAppSelector((state) => state.plant.pageAtPlant);

  const [sizeAtPlant, setSizeAtPlant] = useState<number>(10);
  const [targetAtPlant, setTargetAtPlant] = useState(null); // 관찰 대상 target
  const [isLoadedAtPlant, setIsLoadedAtPlant] = useState(true); // 데이터 로딩 상태

  // -------------------------- 태그 -------------------------------

  // 태그 클릭 이벤트
  useEffect(() => {
    if (searchTagValue !== '') {
      setIsSearched(true);
      setInputData(searchTagValue);
      // setSearchTypeTemp(searchType); // 결과 디브 재렌더링 하기!

      searchTag(searchTagValue);
    }
  }, [searchTagValue]);

  // -----------------------------------

  function searchTag(search: string) {
    const params = {
      search: search,
      page: 0,
      size: sizeAtTag,
    };
    console.log(params);
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

  // -------------------------- 식물 -------------------------------

  function searchPlant(search: string) {
    const params = {
      search: search,
      page: 0,
      size: sizeAtPlant,
    };
    console.log('22', params);
    dispatch(searchByPlantName(params));
    setIsLoadedAtPlant(false);
  }

  // 타겟 설정
  useEffect(() => {
    let observerAtPlant;
    if (targetAtPlant && !isStopedAtPlant && inputData) {
      setTimeout(() => {
        observerAtPlant = new IntersectionObserver(onIntersectAtPlant, {
          threshold: 1, // 배열의 요소가 100% 보여질때마다 콜백을 실행
        });
        observerAtPlant.observe(targetAtPlant);
      }, 100);
    }
    return () => observerAtPlant && observerAtPlant.disconnect();
  }, [targetAtPlant, isLoadedAtPlant]);

  // 타겟을 만났을 때 실행하는 로직
  const onIntersectAtPlant = async ([entryAtPlant]: any, observer2: any) => {
    if (entryAtPlant.isIntersecting && !isLoadedAtPlant) {
      observer2.unobserve(entryAtPlant.target); // 관찰 멈춤
      getMoreItemAtPlant(); // isLoaded를 바꿈
      observer2.observe(entryAtPlant.target); // 관찰 재시작
    }
  };

  // 추가 데이터 요청
  const getMoreItemAtPlant = () => {
    setIsLoadedAtPlant(true);
  };

  // isLoadedAtTag 가 변할 때 실행
  useEffect(() => {
    if (inputData !== '' && isLoadedAtPlant) {
      fetchPlantList();
    }
    return () => {};
  }, [isLoadedAtPlant]);

  // 추가 데이터 요청하기
  async function fetchPlantList() {
    const params = {
      search: inputData,
      page: pageAtPlant,
      size: sizeAtPlant,
    };
    await dispatch(searchByPlantNameMore(params));
    setIsLoadedAtPlant(false);
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
      <select
        className={`p-2 mr-3 rounded-xl border-0`}
        style={{ backgroundColor: 'var(--thin-color)' }}
        onChange={handleChange}
        defaultValue={searchType}>
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
      handleSearch(event);
    }
  }

  function handleSearch(event) {
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
      searchPlant(event.target.value);
    }
  }

  // ----------------------------------------------------------------

  return (
    <>
      {/* 검색창 */}
      <div className={`h-full w-full flex flex-col`}>
        <div className={`w-full flex relative`}>
          <SelectBox options={OPTIONS} defaultValue='feed'></SelectBox>
          <input
            className={`p-2 rounded-xl border-0 w-full`}
            style={{ backgroundColor: 'var(--thin-color)' }}
            type='text'
            placeholder={searchType === 'feed' ? '태그를 입력하세요' : searchType === 'profile' ? '닉네임을 입력하세요' : '식물 이름을 입력하세요'}
            onKeyUp={handleKeyUp}
          />
          <div className={`absolute`} style={{ right: '10px', top: '10px', color: 'var(--main-color)' }} onClick={handleSearch}>
            <span className='material-symbols-outlined'>search</span>
          </div>
        </div>
        {!isSearched ? (
          // 검색 데이터 없을 떄
          <div className='flex justify-center items-center w-full h-full relative' style={{ color: 'var(--title-light-color' }}>
            <span>식물이나 사용자, 태그 등을 검색해 보세요!</span>
            <div>
              <Image priority src='/images/leaf4.png' width={512} height={512} alt='' className={`${styles.leaf4}`} />
            </div>
          </div>
        ) : // 검색 데이터 있을 때
        searchTypeTemp === 'feed' ? (
          // 태그 검색일 때
          tagFeedList?.length === 0 ? (
            <div>조회된 게시글이 없습니다</div>
          ) : (
            <div className={`overflow-auto rounded-xl mt-5`} style={{ backgroundColor: 'var(--thin-color)' }}>
              <div className='text-xl p-5 font-bold'>
                <span>게시글 검색</span>
              </div>
              {tagFeedList?.map((tagFeed) => (
                <SearchFedListItem key={tagFeed.feedId} tagFeed={tagFeed}></SearchFedListItem>
              ))}
              <div ref={setTargetAtTag} />
              <div className={`p-5`}></div>
            </div>
          )
        ) : searchTypeTemp === 'profile' ? (
          // 유저 검색일 때
          searchUserList?.length === 0 ? (
            <div>조회된 유저가 없습니다</div>
          ) : (
            <div className={`overflow-auto rounded-xl mt-5`} style={{ backgroundColor: 'var(--thin-color)' }}>
              <div className='text-xl pr-5  font-bold'>
                <span>사용자 검색</span>
              </div>
              {searchUserList?.map((user) => (
                <SearchUserListItem key={user.nickname} searchUser={user}></SearchUserListItem>
              ))}
              <div ref={setTargetAtUser} />
              <div className={`p-5`}></div>
            </div>
          )
        ) : searchPlantList?.length === 0 ? (
          // 식물 검색일 때
          <div>조호된 식물이 없습니다</div>
        ) : (
          <div className={`overflow-auto rounded-xl mt-5`} style={{ backgroundColor: 'var(--thin-color)' }}>
            <div className='text-xl p-5 font-bold'>
              <span>식물검색</span>
            </div>
            {searchPlantList?.map((plant) => (
              <SearchPlantListItem key={plant.plantId} searchPlant={plant}></SearchPlantListItem>
            ))}
            <div ref={setTargetAtPlant} />
            <div className={`p-5`}></div>
          </div>
        )}
      </div>
    </>
  );
}
