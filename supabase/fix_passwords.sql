-- Set passwords for all seed users
UPDATE auth.users
SET
  encrypted_password = crypt('prof123', gen_salt('bf')),
  email_confirmed_at = NOW(),
  updated_at         = NOW()
WHERE email IN ('prof@nur.com', 'sarah@nur.com');

UPDATE auth.users
SET
  encrypted_password = crypt('parent123', gen_salt('bf')),
  email_confirmed_at = NOW(),
  updated_at         = NOW()
WHERE email IN ('parent@nur.com', 'fatima@nur.com', 'omar@nur.com');
