# DeepLogo AI - AI-Powered Logo Generator

![DeepLogo AI Banner](https://via.placeholder.com/800x200?text=DeepLogo+AI)

DeepLogo AI is a modern web application that creates beautiful, unique logos for your business or project in seconds using artificial intelligence.

## Features

- 🤖 **AI-Powered Generation** - Create professional logos with just a text prompt.
- 🎨 **Customization Options** - Adjust colors, styles, and layouts to match your brand.
- 📊 **User Dashboard** - Save, manage, and edit your generated logos.
- 📥 **High-Resolution Export** - Download your logos in multiple formats.
- 🔐 **Secure Authentication** - User account management with Clerk.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Authentication:** Clerk
- **UI Components:** ShadcnUI
- **API Integration:** Axios

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/deeplogo-ai.git
   cd deeplogo-ai
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Create a `.env.local` file with the required environment variables:**
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_public_key
   CLERK_SECRET_KEY=your_secret_key
   ```
4. **Start the development server:**
   ```sh
   npm run dev
   ```
5. **Open the application in your browser:**
   ```
   http://localhost:3000
   ```

## How It Works

1. **Enter Your Business Name** - Provide the name or description of your business.
2. **AI Generation** - Our AI will create multiple logo options based on your input.
3. **Customize** - Fine-tune your preferred design with color and style adjustments.
4. **Download** - Export your logo in the format you need.

## Project Structure

```
app/
├── _components/    # Shared UI components
├── _context/       # Context providers
├── _data/          # Static data files
├── api/            # API endpoints
├── create/         # Logo creation page
├── dashboard/      # User dashboard
├── page.js         # Home page
components/         # UI component library
public/             # Static assets
```

## Deployment

The application is configured for deployment on Vercel:

1. **Deploy using Vercel CLI:**
   ```sh
   npm run build
   ```
2. **Or connect your GitHub repository to Vercel for automatic deployments.**

## Contact

📧 **Jeremiah Delacruz** - [zeremiahdelacruz@gmail.com](mailto:zeremiahdelacruz@gmail.com)

## License

This project is licensed under the **MIT License**.
