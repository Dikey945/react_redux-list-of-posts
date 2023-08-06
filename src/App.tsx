import React, { useEffect } from 'react';
import 'bulma/bulma.sass';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';
import classNames from 'classnames';
import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { User } from './types/User';
import { Post } from './types/Post';
import { Counter } from './features/counter/Counter';
import { useAppDispatch, useAppSelector } from './app/hooks';
import * as postSlice from './features/posts';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const author: User | null = useAppSelector(state => state.user).selectedUser;
  const { allPosts: posts, selectedPost, status } = useAppSelector(
    state => state.posts,
  );
  const selectPost = (post: Post | null) => dispatch(postSlice.setPost(post));

  function loadUserPosts(userId: number) {
    dispatch(postSlice.getAsyncPosts(userId));
  }

  useEffect(() => {
    // we clear the post when an author is changed
    // not to confuse the user
    selectPost(null);

    if (author) {
      loadUserPosts(author.id);
    }
  }, [author?.id]);

  return (
    <main className="section">
      <Counter />

      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector value={author} />
              </div>

              <div className="block" data-cy="MainContent">
                {!author && (
                  <p data-cy="NoSelectedUser">
                    No user selected
                  </p>
                )}

                {author && status === 'loading' && (
                  <Loader />
                )}

                {author && status === 'failed' && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {author
                  && status === 'idle'
                  && posts.length === 0
                  && (
                    <div
                      className="notification is-warning"
                      data-cy="NoPostsYet"
                    >
                      No posts yet
                    </div>
                  )}

                {author && status === 'idle' && posts.length > 0 && (
                  <PostsList
                    posts={posts}
                    selectedPostId={selectedPost?.id}
                    onPostSelected={selectPost}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              {
                'Sidebar--open': selectedPost,
              },
            )}
          >
            <div className="tile is-child box is-success ">
              {selectedPost && (
                <PostDetails post={selectedPost} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
