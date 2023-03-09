import React, { useEffect } from "react";
import AppLayout from "@/layout/AppLayout";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/core/hooks";
import { getPostList } from "@/core/temp/post/postAPI";
import useSWR from "swr";
import http from "@/lib/http";
import PostListItem from "@/components/PostListItem";

export default function post() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.post.isLoading);
  const postList = useAppSelector((state) => state.post.postList);
  // const fetcher = (url: string) => http.get(url).then((res) => res.data);
  // const { data:postList, error, isLoading } = useSWR("/posts", fetcher);

  useEffect(() => {
    dispatch(getPostList());

    if (!isLoading) {
      console.log(postList[0].id);
    }

    return () => {
      console.log("unmounted");
    };
  }, []);

  return (
    <AppLayout>
      <div className='mx-auto max-w-7xl p-6 lg:px-8 '>
        {isLoading ? (
          new Array(10).fill(1).map((_, i) => {
            return <PostListItem key={i} />;
          })
        ) : (
          <div>
            {postList.map((post) => (
              <PostListItem key={post.id} post={post} id={post.id} userId={post.userId} title={post.title} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

/*

<div className="mx-auto max-w-7xl p-6 lg:px-8">
				{isLoading ? (
					<div>로딩중..</div>
				) : (
					<div>
						{postList.map((post) => (
							<ul key={post.id} className="mb-5">
								<li>postId {post.id}</li>
								<li>userId {post.userId}</li>
								<Link
									href={{
										pathname: "/post/[id]",
										query: { id: post.id }
									}}
									className="hover:underline">
									title {post.title}
								</Link>
							</ul>
						))}
					</div>
				)}
			</div>
*/
