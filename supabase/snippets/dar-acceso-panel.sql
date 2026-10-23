-- Goodview: da acceso al panel /admin a un usuario.
-- 1) En Supabase > Authentication > Users > Add user, crea el usuario con email y contraseña
--    (marca "Auto Confirm User").
-- 2) Cambia el email de abajo por el de ese usuario, pega esto en SQL Editor y pulsa Run.
insert into staff (user_id)
select id from auth.users where email = 'hola@goodview.es'
on conflict do nothing;
