# VolunteerCal Deployment Guide

## ✅ Completed Steps

1. **Git Setup** - Configured and ready
2. **GitHub Repository** - Created at https://github.com/NPNMD/VolunteerCal
3. **Code Pushed** - All code is now on GitHub
4. **Supabase CLI** - Initialized (available via `npx supabase`)

## 🔄 Remaining Deployment Steps

### Step 1: Get Supabase Access Token

To deploy migrations and Edge Functions, you need a Supabase access token:

1. Go to: https://supabase.com/dashboard/account/tokens
2. Sign in to your Supabase account
3. Click "Generate new token"
4. Name it "CLI Access" or "Deployment Token"
5. Copy the token (save it securely - it won't be shown again)

### Step 2: Login to Supabase CLI

Once you have the token, run:

```cmd
set SUPABASE_ACCESS_TOKEN=<your-token-here>
npx supabase login
```

Or login with the token directly:

```cmd
npx supabase login --token <your-token-here>
```

### Step 3: Link Your Supabase Project

Link to your existing Supabase project:

```cmd
npx supabase link --project-ref qzxtosuktcefpcbxeznh
```

When prompted, enter your database password.

### Step 4: Deploy Database Migrations

Deploy all 5 database migrations:

```cmd
npx supabase db push
```

This will execute:
- `001_create_users.sql` - User profiles and dependents
- `002_create_groups.sql` - Groups and memberships
- `003_create_events.sql` - Events
- `004_create_signups.sql` - Event signups
- `005_create_notifications.sql` - Notifications system
- `006_fix_groups_invite_code_default.sql` - Fix invite_code default
- `007_reload_postgrest_schema.sql` - Reload PostgREST schema cache

### Step 5: Set Up Resend API Key Secret

Your Resend API key is already in `.env.local`. Now set it as a Supabase secret for Edge Functions:

```cmd
npx supabase secrets set RESEND_API_KEY=re_fg6fu2rs_MJyxBEZWinaV2vDyYEdm8Szw
```

### Step 6: Deploy Edge Functions

Deploy both Edge Functions:

```cmd
npx supabase functions deploy schedule-reminders
npx supabase functions deploy send-reminder
```

These functions handle:
- **schedule-reminders**: Scheduled job to find upcoming events and queue reminders
- **send-reminder**: Sends reminder emails via Resend

### Step 7: Set Up Cron Job for Reminders (Optional)

To automatically send reminders, set up a cron job in Supabase Dashboard:

1. Go to https://supabase.com/dashboard/project/qzxtosuktcefpcbxeznh/database/cron-jobs
2. Create a new cron job
3. Name: "Daily Reminder Check"
4. Schedule: `0 9 * * *` (9 AM daily, adjust to your timezone)
5. SQL Command:
```sql
SELECT net.http_post(
  url := 'https://qzxtosuktcefpcbxeznh.supabase.co/functions/v1/schedule-reminders',
  headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
);
```

Replace `YOUR_SERVICE_ROLE_KEY` with your service role key from the Supabase dashboard.

## 🚀 Frontend Deployment

After backend deployment is complete, deploy your frontend:

### Option A: Vercel (Recommended)

1. Go to https://vercel.com
2. Import your GitHub repository: `NPNMD/VolunteerCal`
3. Configure environment variables:
   - `VITE_SUPABASE_URL`: `https://qzxtosuktcefpcbxeznh.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `sb_publishable_5KLZFxJHqf6InYPV7wY79A_pttBOJI3`
4. Deploy!

### Option B: Netlify

1. Go to https://netlify.com
2. Import your GitHub repository
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables (same as Vercel)
5. Deploy!

### Option C: Other Platforms

The app can be deployed to any static hosting platform:
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 📋 Verification Checklist

After deployment, verify:

- [ ] Database tables created (check Supabase Table Editor)
- [ ] Edge Functions deployed (check Supabase Functions dashboard)
- [ ] Resend API key secret set
- [ ] Frontend deployed and accessible
- [ ] Users can register and login
- [ ] Events can be created
- [ ] Email reminders work (test by creating an event)

## 🔒 Security Notes

- Never commit `.env.local` to Git (already in `.gitignore`)
- Service role key should only be used server-side
- Anon key is safe for frontend use
- Resend API key is stored as a Supabase secret

## 📚 Useful Commands

```cmd
# Check Supabase CLI status
npx supabase status

# View function logs
npx supabase functions logs schedule-reminders
npx supabase functions logs send-reminder

# List secrets
npx supabase secrets list

# Pull remote schema changes
npx supabase db pull

# Create a new migration
npx supabase migration new migration_name
```

## 🆘 Troubleshooting

### "Access token not provided"
- Run `npx supabase login` with your token from Step 1

### "Project not linked"
- Run `npx supabase link --project-ref qzxtosuktcefpcbxeznh`

### Edge Function errors
- Check logs: `npx supabase functions logs <function-name>`
- Verify RESEND_API_KEY secret is set

### Database migration errors
- Check migration files for SQL errors
- Verify you have proper database permissions

### 500 Internal Server Error on groups/events API calls
If you see 500 errors when loading groups, events, or creating groups:

1. **Reload PostgREST schema cache**: In Supabase Dashboard → SQL Editor, run:
   ```sql
   NOTIFY pgrst, 'reload schema';
   ```

2. **Ensure migrations 006 and 007 are applied**:
   ```cmd
   npx supabase db push
   ```

3. **Check Supabase logs**: Dashboard → Logs → API to see the actual error message

## 📞 Support

- Supabase Docs: https://supabase.com/docs
- Resend Docs: https://resend.com/docs
- GitHub Repo: https://github.com/NPNMD/VolunteerCal

---

**Next Steps**: Follow steps 1-6 above to complete your backend deployment, then deploy your frontend using one of the options listed.
