import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { Router, useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import AppModal from './common/AppModal';
import styles from '@/styles/user/feed.module.scss';
import ReactPaginate from 'react-paginate';
import { deletePost, deleteSelectedPost, getPostList } from '@/core/post/postAPI';

type PostType = {
  postId: number;
  content: string;
  commentCount: number;
  likeCount: number;
  createdAt: string;
};

type StateType = {
  checkedPostList: Array<PostType>;
};

const initialState: StateType = {
  checkedPostList: [],
};

export default function UserFeedPost({ nickname }) {
  const isSameUser = useAppSelector((state) => state.user.isSameUser);

  const { register, getValues, watch } = useForm<StateType>({ defaultValues: initialState });
  const [checkedPostList] = getValues(['checkedPostList']);

  const [isOpenPostDeleteModal, setIsOpenPostDeleteModal] = useState(false);
  const [isOpenSelectedPostDeleteModal, setIsOpenSelectedPostDeleteModal] = useState(false);

  const [postList, setPostList] = useState([]);
  const [postListTotalCount, setPostListTotalCount] = useState(0);
  const [postPage, setPostPage] = useState(0);
  const [postSize, setPostSize] = useState(3);
  const [postId, setPostId] = useState<number>();

  useEffect(() => {
    watch();
    return () => {};
  }, [nickname, checkedPostList]);

  useEffect(() => {
    fetchPostList();
    return () => {};
  }, [postPage, nickname]);

  async function fetchPostList() {
    try {
      const params = { page: postPage, size: postSize };
      const { data } = await getPostList(nickname, params);
      const content = data.content;
      const totalElements = data.totalElements;
      setPostList(content);
      setPostListTotalCount(Math.ceil(totalElements / postSize));
    } catch (error) {
      console.error(error);
    }
  }

  async function handlePostPageClick(e) {
    setPostPage(e.selected);
  }

  function handleIsOpenPostDelete(postId) {
    setPostId(postId);
    setIsOpenPostDeleteModal(true);
  }

  async function handlePostDelete() {
    try {
      const { data } = await deleteSelectedPost(postId);
      setIsOpenPostDeleteModal(false);
      await fetchPostList();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSelectedPostDelete() {
    checkedPostList.forEach(async (postId) => {
      const { data } = await deleteSelectedPost(postId);
      setIsOpenSelectedPostDeleteModal(false);
      await fetchPostList();
    });
  }

  return (
    <>
      <AppModal
        isOpen={isOpenPostDeleteModal}
        title='포스트 삭제'
        handleModalClose={() => setIsOpenPostDeleteModal(false)}
        handleModalConfirm={handlePostDelete}
      />
      <AppModal
        isOpen={isOpenSelectedPostDeleteModal}
        title='포스트 삭제'
        handleModalClose={() => setIsOpenSelectedPostDeleteModal(false)}
        handleModalConfirm={handleSelectedPostDelete}
      />

      <div className='px-3 py-6'>
        <div className='flex justify-between items-center mb-7 mx-4'>
          <div className='text-md font-semibold'>포스트 😀</div>

          {isSameUser ? (
            <div
              className='flex items-center cursor-pointer border border-2 bg-black border-black rounded-full p-0.5'
              onClick={() => setIsOpenSelectedPostDeleteModal(true)}>
              <span className='material-symbols-outlined font-bold text-white' style={{ fontSize: '1.2rem' }}>
                remove
              </span>
              <div className='pr-1 font-bold text-white' style={{ fontSize: '0.8rem' }}>
                REMOVE
              </div>
            </div>
          ) : null}
        </div>

        <div className={`mx-4`}>
          {postList.map((p) => (
            <div className={`${styles.post} mb-2 flex space-x-2 justify-between`} key={p.postId}>
              <div className='flex items-center ml-2 space-x-2 w-full'>
                {isSameUser ? <input type='checkbox' value={p.postId} className='w-1 h-1' {...register('checkedPostList')} /> : null}

                <div className='flex justify-between w-full'>
                  <Link href={`/post/${p.postId}`} className={`hover:underline ${styles.content}`}>
                    {p.content}
                  </Link>

                  <div className='flex space-x-1 ml-1'>
                    <div className='flex items-center space-x-0.5 text-sm cursor-default'>
                      <span className='material-symbols-outlined md-small' style={{ fontSize: '1rem' }}>
                        chat
                      </span>
                      <div className='text-xs font-bold'>{p.commentCount}</div>
                    </div>
                    <div className='flex items-center space-x-0.5 text-sm cursor-default'>
                      <span className={`material-symbols-outlined md-small fill-small `} style={{ fontSize: '1rem', color: 'var(--like-color)' }}>
                        favorite
                      </span>
                      <div className='text-xs font-bold'>{p.likeCount}</div>
                    </div>
                  </div>
                </div>
              </div>

              {isSameUser ? (
                <span
                  className='pr-1 material-symbols-outlined cursor-pointer like '
                  style={{ fontSize: '1.2rem' }}
                  onClick={() => handleIsOpenPostDelete(p.postId)}>
                  close
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className='flex items-center justify-center'>
        <ReactPaginate
          pageCount={postListTotalCount}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          breakLabel={'...'}
          previousLabel={
            <div className='block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
              <span className='sr-only'>Previous</span>
              <svg aria-hidden='true' className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                <path
                  strokeWidth='evenodd'
                  d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                  clipRule='evenodd'></path>
              </svg>
            </div>
          }
          nextLabel={
            <div>
              <div className='block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                <span className='sr-only'>Next</span>
                <svg aria-hidden='true' className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    strokeWidth='evenodd'
                    d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                    clipRule='evenodd'></path>
                </svg>
              </div>
            </div>
          }
          onPageChange={handlePostPageClick}
          containerClassName={'pagination-ul inline-flex items-center -space-x-px'}
          pageClassName={'block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300  hover:bg-gray-100 hover:text-gray-700'}
          activeClassName={
            'currentPage main px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-pink-500'
          }
          previousClassName={'pageLabel-btn '}
          nextClassName={'pageLabel-btn'}
        />
      </div>
    </>
  );
}
