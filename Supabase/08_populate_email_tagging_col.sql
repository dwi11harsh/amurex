UPDATE users
SET email_tagging_enabled = CASE 
    WHEN random() < 0.6 THEN TRUE 
    ELSE FALSE 
END;