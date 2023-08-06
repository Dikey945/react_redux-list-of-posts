import React, { useEffect, useState } from 'react';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';
import { Post } from '../types/Post';
import * as commentsSlice from '../features/comments';
import { useAppDispatch, useAppSelector } from '../app/hooks';

type Props = {
  post: Post;
};

export const PostDetails: React.FC<Props> = ({ post }) => {
  // const [comments, setComments] = useState<Comment[]>([]);
  // const [loaded, setLoaded] = useState(false);
  // const [hasError, setError] = useState(false);
  const [visible, setVisible] = useState(false);
  const dispatch = useAppDispatch();
  const {
    allComments: comments,
    commentsStatus,
  } = useAppSelector((state) => state.comments);

  function loadComments() {
    dispatch(commentsSlice.getCommentsAsync(post.id));
  }

  useEffect(loadComments, [post.id]);

  // The same useEffect with async/await
  /*
  async function loadComments() {
    setLoaded(false);
    setVisible(false);
    setError(false);

    try {
      const commentsFromServer = await commentsApi.getPostComments(post.id);

      setComments(commentsFromServer);
    } catch (error) {
      setError(true);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  useEffect(loadComments, [post.id]); // Wrong!
  // effect can return only a function but not a Promise
  */

  return (
    <div className="content" data-cy="PostDetails">
      <div className="block">
        <h2 data-cy="PostTitle">
          {`#${post.id}: ${post.title}`}
        </h2>

        <p data-cy="PostBody">
          {post.body}
        </p>
      </div>

      <div className="block">
        {commentsStatus === 'loading' && (
          <Loader />
        )}

        {commentsStatus === 'failed' && (
          <div className="notification is-danger" data-cy="CommentsError">
            Something went wrong
          </div>
        )}

        {commentsStatus === 'idle' && comments && comments.length === 0 && (
          <p className="title is-4" data-cy="NoCommentsMessage">
            No comments yet
          </p>
        )}

        {commentsStatus === 'idle' && comments && comments.length > 0 && (
          <>
            <p className="title is-4">Comments:</p>

            {comments.map(comment => (
              <article
                className="message is-small"
                key={comment.id}
                data-cy="Comment"
              >
                <div className="message-header">
                  <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                    {comment.name}
                  </a>

                  <button
                    data-cy="CommentDelete"
                    type="button"
                    className="delete is-small"
                    aria-label="delete"
                    onClick={
                      () => dispatch(commentsSlice
                        .deleteCommentAsync(comment.id))
                    }
                  >
                    delete button
                  </button>
                </div>

                <div className="message-body" data-cy="CommentBody">
                  {comment.body}
                </div>
              </article>
            ))}
          </>
        )}

        {commentsStatus === 'idle' && !visible && (
          <button
            data-cy="WriteCommentButton"
            type="button"
            className="button is-link"
            onClick={() => setVisible(true)}
          >
            Write a comment
          </button>
        )}

        {commentsStatus === 'idle' && visible && (
          <NewCommentForm />
        )}
      </div>
    </div>
  );
};
