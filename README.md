# StickyThoughts

A collaborative wall where people can share their thoughts, opinions, and experiences anonymously or with attribution. Whether you're venting about your day, sharing political views, or connecting with others, StickyThoughts provides a space for expression.

## Features

- 📝 Post thoughts anonymously or with your profile
- 🔐 Secure authentication with Google OAuth
- 💾 Media storage with Cloudflare R2
- 📧 Email notifications via Resend
- 🎨 Modern, responsive interface

## Prerequisites

Before you begin, ensure you have:

- Node.js (v20.9.0 or higher)
- npm or yarn
- A PostgreSQL database
- Accounts for: Google Cloud Console, Cloudflare, and Resend

## Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd sticky-thoughts
npm install
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public

# Authentication
BETTER_AUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudflare R2 Storage
CLOUDFLARE_R2_BUCKET_NAME=your-bucket-name
CLOUDFLARE_R2_BUCKET_REGION=auto
CLOUDFLARE_R2_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_ID=your-access-id
CLOUDFLARE_R2_ACCESS_KEY=your-access-key
CLOUDFLARE_R2_ENDPOINT_ACCESS=your-endpoint-url

# Email
RESEND_API_KEY=your-resend-api-key
```

### 3. Obtain Environment Variables

<details>
  <summary><strong>DATABASE_URL</strong> - PostgreSQL Connection String</summary>

1. Create a database using [Prisma](https://www.prisma.io/) or any PostgreSQL compatible provider
2. Copy your connection string in the format:

```
  postgresql://postgres:password@localhost:5432/stickythoughts
```

3. Paste it as the `DATABASE_URL` value

</details>

<details>
  <summary><strong>BETTER_AUTH_SECRET</strong> - Authentication Secret</summary>

Generate a secure random string:

```bash
openssl rand -base64 32
```

Or use an online generator like [1Password's generator](https://1password.com/password-generator/)

</details>

<details>
<summary><strong>GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET</strong> - OAuth Credentials</summary>

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or select existing)
3. Enable Google+ API
4. Create OAuth 2.0 Client ID credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret

</details>

<details>
<summary><strong>Cloudflare R2 Variables</strong> - Object Storage</summary>

1. Sign up at [Cloudflare](https://dash.cloudflare.com/)
2. Navigate to **R2 Object Storage**
3. Create a new bucket and note the bucket name
4. Go to **Manage R2 API Tokens** → Create API token
5. Copy the following values:
   - Account ID
   - Access Key ID
   - Secret Access Key
   - Bucket endpoint URL
6. Region is typically `auto`

</details>

<details>
<summary><strong>RESEND_API_KEY</strong> - Email Service</summary>

1. Sign up at [Resend](https://resend.com/)
2. Navigate to **API Keys**
3. Create a new API key
4. Copy the key value

</details>

### 4. Database Setup

Run Prisma migrations to set up your database:

```bash
npx prisma generate
```

### 5. Run the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and start sharing thoughts! 🎉

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/alexndrho/stickythoughts/issues) on GitHub.
