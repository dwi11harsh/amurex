CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_preferences_updated_at
    BEFORE UPDATE ON email_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- New user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Vector search function (from existing migration)
CREATE OR REPLACE FUNCTION match_page_sections(
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int,
  user_id uuid
)
RETURNS TABLE (
  document_id integer,
  context text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ps.document_id,
    ps.context,
    (ps.embedding <#> query_embedding) * -1 as similarity
  FROM
    page_sections ps
    INNER JOIN documents d ON ps.document_id = d.id
  WHERE
    d.user_id = match_page_sections.user_id
    AND (ps.embedding <#> query_embedding) * -1 > similarity_threshold
  ORDER BY
    similarity DESC
  LIMIT match_count;
END;
$$;
