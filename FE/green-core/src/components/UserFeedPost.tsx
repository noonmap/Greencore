import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch } from '@/core/hooks';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import AppModal from './common/AppModal';
import styles from './UserFeedPost.module.scss';
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
  }, [postPage]);

  async function fetchPostList() {
    try {
      const params = { page: postPage, size: postSize };
      const { data } = await getPostList(nickname, params);
      const content = data.content;
      const totalElements = data.totalElements;
      setPostList(content);
      setPostListTotalCount(totalElements / postSize);
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
    });
    setIsOpenSelectedPostDeleteModal(false);
    await fetchPostList();
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

      <div className='space-y-2 px-10 py-5'>
        <div className='flex justify-between space-y-2 mb-5'>
          <div className='text-xl font-semibold'>포스트</div>

          <div className='flex main cursor-pointer'>
            <span className='material-symbols-outlined'>delete</span>
            <div className='hover:underline' onClick={() => setIsOpenSelectedPostDeleteModal(true)}>
              선택 삭제
            </div>
          </div>
        </div>

        <div className={``}>
          {postList.map((p) => (
            <div className={`${styles.card} mb-2 flex space-x-2 justify-between`} key={p.postId}>
              <div className='flex items-center  space-x-2'>
                <input type='checkbox' value={p.postId} className='w-1 h-1' {...register('checkedPostList')} />
                <Link href={`/post/${p.postId}`}>{p.content}</Link>

                <div className='flex items-center space-x-0.5 text-sm cursor-default'>
                  <span className='material-symbols-outlined md-small'>chat</span>
                  <div>{p.commentCount}</div>
                </div>
                <div className='flex items-center space-x-0.5 text-sm cursor-default'>
                  <span className={`material-symbols-outlined md-small fill-small ${styles.like}`}>favorite</span>
                  <div>{p.likeCount}</div>
                </div>
              </div>

              <span className='material-symbols-outlined cursor-pointer close' onClick={() => handleIsOpenPostDelete(p.postId)}>
                close
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className='flex items-center justify-center'>
        <ReactPaginate
          pageCount={postListTotalCount}
          pageRangeDisplayed={10}
          marginPagesDisplayed={10}
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
            'currentPage main px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-green-500'
          }
          previousClassName={'pageLabel-btn '}
          nextClassName={'pageLabel-btn'}
        />
      </div>
    </>
  );
}
