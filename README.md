# AryanVerse — cinematic portfolio

A responsive portfolio with a cinematic project showcase, dark/light theme, motion effects, certificate links, a visit counter, and an optional secure Supabase-powered admin workspace.

## Run locally

Use VS Code Live Server or another local web server. Because the project uses JavaScript modules for Supabase integration, opening `index.html` directly as a `file://` URL is not recommended.

## IBM PBEL certificate

The IBM PBEL certificate card opens the official Skills Network certificate verification page supplied by Aryan:
https://courses.ibmmooc.skillsnetwork.site/certificates/443cd7c1399649229d3c1b4655b6f2ce

## Secure project/certificate manager setup (required once)

The admin interface is at `admin.html`. **It is intentionally not active until Supabase is configured.** This is necessary for real authentication and secure cross-device storage; a password-only front-end/localStorage implementation would not protect the data from visitors.

1. Create a project at https://supabase.com/ and open its Project Settings → API.
2. Open `supabase-config.js` and set:
   - `SUPABASE_URL` to your Project URL
   - `SUPABASE_ANON_KEY` to the publishable/anon key
   - `ADMIN_EMAIL` to your own verified email address
   Never use or expose the `service_role` key in browser code.
3. Open Supabase → SQL Editor. In `supabase-setup.sql`, replace every occurrence of `YOUR_VERIFIED_ADMIN_EMAIL@example.com` with the same admin email, then run the SQL.
4. In Supabase → Authentication → Providers, keep Email enabled and require email confirmation. Set the site URL and allowed redirect URLs to your deployed portfolio origin.
5. In Supabase → Authentication → Users, create/invite only your own admin user. Verify the email. Use that account to sign in at `/admin.html`.
6. In Supabase → Storage, create a **public** bucket named `portfolio-assets` (the SQL policies restrict uploads/changes to the allow-listed admin email; public users can only read public assets).
7. Deploy the whole folder to your static host. Ensure `admin.html`, `admin.js`, `public-data.js`, `supabase-config.js`, `supabase-setup.sql`, and the existing assets are uploaded together.

### Admin capabilities

- Sign in with verified email + password.
- Add, edit, and delete projects.
- Add, edit, and delete certificates.
- Upload project images and certificate PDFs/images (12 MB maximum per upload).
- Add official verification URLs; public cards link directly to the issuer/verification page.
- Content is stored in Supabase and can appear on the public portfolio across devices.

### Security notes

- Supabase Row Level Security policies limit writes to the exact allow-listed admin email. Public visitors have read-only access to published project/certificate data and public asset files.
- The admin page is not a substitute for server-side security; the SQL RLS policies are the enforcement layer. Do not disable RLS.
- Use a strong unique password and keep email confirmation enabled. Do not share the admin account.
- Public portfolio entries and uploaded files are intentionally public. Do not upload private documents.
- The public visit counter uses a third-party counter API and counts visits, not unique people; the service may be unavailable sometimes.

## Existing portfolio links

- GitHub: https://github.com/Engineer9336
- LinkedIn: https://www.linkedin.com/in/aryan-mishra93
- IBM PBEL certificate: https://courses.ibmmooc.skillsnetwork.site/certificates/443cd7c1399649229d3c1b4655b6f2ce
