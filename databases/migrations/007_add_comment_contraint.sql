ALTER TABLE comments
ADD CONSTRAINT fk_comment_parent
FOREIGN KEY (parent_id)
REFERENCES comments(id)
ON DELETE CASCADE;

CREATE INDEX idx_comment_parent
ON comments(parent_id);