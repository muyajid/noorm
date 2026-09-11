CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    parent_id UUID NOT NULL,
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_comment_post_id ON comments (post_id);

CREATE INDEX idx_comment_user_id ON comments (user_id);