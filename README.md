# 🌌 Cosmic Explorer

An immersive, full-stack space exploration web application that brings the wonders of our solar system to your browser. Journey through realistic 3D planets, explore NASA's vast imagery database, and harness the power of AI to analyze celestial phenomena.

![Cosmic Explorer](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-Latest-black?style=for-the-badge&logo=three.js)

---

## ✨ Features

### 🪐 Interactive 3D Solar System
- **Realistic planet rendering** with high-resolution NASA textures (2048x1024+)
- **Interactive 3D models** powered by Three.js and React Three Fiber
- **Saturn's iconic rings** rendered with proper geometry and transparency
- **Orbiting moons** with accurate relative sizes and orbital mechanics
- **Smooth animations** with realistic rotation speeds
- **Advanced zoom controls** from 4x to 1000x magnification
- **Detailed planet facts** including diameter, orbit period, atmosphere composition

### 🔍 NASA Image Explorer
- **Real-time search** through NASA's extensive Image and Video Library
- **Smart category filters**: Planets, Stars, Satellites, Moons, Galaxies, Nebulae, Asteroids
- **Progressive image loading**: Preview → High-resolution (up to original quality)
- **Advanced image viewer** with zoom (up to 1000%), pan, rotate, and fullscreen
- **Quality indicator** showing current resolution level
- **Metadata display** including titles, descriptions, dates, and NASA IDs

### 🤖 AI-Powered Scientific Analysis
- **Comprehensive analysis** using Hugging Face Vision Transformer models
- **Region-specific analysis**: Analyzes the exact zoomed area you're viewing
- **Detailed scientific data**:
  - **Atmospheric Analysis**: Composition, pressure, presence/absence of air
  - **Weather Conditions**: Patterns, phenomena, cloud formations
  - **Temperature & Humidity**: Ranges, variations, climate zones
  - **Geological Features**: Surface composition, terrain types, impact craters
  - **Altitude & Height**: Elevation estimations, topography
  - **Celestial Objects**: Satellites, moons, nearby bodies
- **Confidence scores** for all detected features
- **Downloadable reports** in text format for offline study
- **Educational context** explaining scientific significance

### 📚 Celestial Research Database
- **Comprehensive research panel** with detailed information on celestial objects
- **Categorized objects**: Planets, Dwarf Planets, Moons, Stars, Asteroids, Comets, Satellites, Nebulae, Galaxies
- **Detailed scientific data** for each object:
  - Physical characteristics (diameter, mass, gravity, temperature, etc.)
  - Atmospheric composition and features
  - Surface features and composition
  - Moon systems and notable satellites
  - Exploration missions and discoveries
  - Scientific significance and importance
  - Fun facts and interesting trivia
- **Integrated NASA imagery**: Click suggestion images to view in detail viewer with AI analysis
- **Exportable research reports**: Download comprehensive reports in text format
- **Smart search**: Find objects by name or description
- **Category filters**: Browse by object type with emoji icons
- **Beautiful presentation**: Organized cards with images and descriptions

### 📝 Annotation System
- **Interactive annotations**: Click to add study notes on any image
- **Persistent storage** with Firebase Firestore
- **Rich annotations**: Title, description, coordinates
- **Edit and delete** capabilities
- **Automatic loading** when reopening images
- **Graceful degradation** if Firebase is not configured

### 🎨 Beautiful, Modern Design
- **Animated aurora background** with flowing cosmic waves
- **Dark space theme** optimized for viewing celestial imagery
- **Light theme option** for accessibility
- **Elegant typography**: Playfair Display for headings, Geist for body
- **Smooth animations** and transitions throughout
- **Fully responsive** design (mobile to 4K displays)
- **Glassmorphism effects** for depth and visual interest
- **Ambient space music** with volume controls

### 👥 Team & Community
- **About Team modal** with team logo and member information
- **GitHub integration** for open-source collaboration
- **Detailed documentation** for contributors

---

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 15** - React framework with App Router for optimal performance
- **React 19** - Latest UI library with concurrent features
- **TypeScript** - Type-safe development with full IntelliSense

### 3D Graphics & Visualization
- **Three.js** - Industry-standard WebGL 3D graphics library
- **React Three Fiber** - React renderer for Three.js with declarative API
- **@react-three/drei** - Useful helpers and abstractions for R3F

### UI & Styling
- **Tailwind CSS v4** - Utility-first CSS with inline theme configuration
- **shadcn/ui** - High-quality, accessible component library
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Beautiful, consistent icon library

### Backend & APIs
- **NASA Images API** - Official NASA image and video library
- **Hugging Face Inference API** - AI-powered image analysis
- **Firebase Authentication** - Secure user management
- **Firestore Database** - Real-time NoSQL database for annotations
- **Next.js Server Actions** - Type-safe server-side functions

### State Management & Data Fetching
- **React Hooks** - useState, useEffect, useRef, useContext
- **Context API** - Global state for authentication
- **Progressive loading** - Optimized image fetching strategy


### Prerequisites

- **Node.js** 18.17 or later
- **npm**, **yarn**, or **pnpm**
- **NASA API Key** (free from https://api.nasa.gov/)
- **Hugging Face API Key** (free from https://huggingface.co/)
- **Firebase Project** (optional, free from https://firebase.google.com/)

### Installation

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/yourusername/cosmic-explorer.git
cd cosmic-explorer
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**

Create `.env.local`:
\`\`\`env
# Firebase (Optional - app works without it)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# AI Analysis (Required for AI features)
HUGGINGFACE_API_KEY=your_huggingface_api_key
\`\`\`

4. **Run development server**
\`\`\`bash
npm run dev
\`\`\`

5. **Open browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🎯 How It Works

### 3D Planet Rendering

Planets are rendered using Three.js with React Three Fiber:

\`\`\`typescript
<Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
  <ambientLight intensity={0.3} />
  <pointLight position={[10, 10, 10]} intensity={1.5} />
  
  <PlanetSphere textureUrl="/saturn-texture.jpg" planetSize={2.5} />
  <SaturnRings planetSize={2.5} /> {/* Only for Saturn */}
  
  {moons.map(moon => <MoonOrbit moon={moon} />)}
  
  <OrbitControls minDistance={4} maxDistance={1000} />
</Canvas>
\`\`\`

**Key features:**
- High-resolution texture mapping with anisotropic filtering
- Smooth rotation animations using `useFrame` hook
- Saturn's rings use `RingGeometry` with gradient transparency
- Moon orbits rotate independently around planets
- Interactive controls for zoom, rotate, and pan

### NASA Image Search

Search uses NASA's official API:

\`\`\`typescript
const searchNASA = async (query: string, category: string) => {
  const searchQuery = category === 'all' ? query : `${query} ${category}`
  const response = await fetch(
    `https://images-api.nasa.gov/search?q=${encodeURIComponent(searchQuery)}&media_type=image`
  )
  const data = await response.json()
  return data.collection.items
}
\`\`\`

**Progressive loading:**
1. Display thumbnail from search results
2. Fetch asset manifest when image is opened
3. Load highest resolution available (`~orig.jpg`)
4. Show quality indicator to user

### AI Analysis

Uses Hugging Face Vision Transformer:

\`\`\`typescript
// Server action
export async function analyzeImage(imageUrl: string) {
  const response = await fetch(imageUrl)
  const blob = await response.blob()
  
  const hfResponse = await fetch(
    'https://api-inference.huggingface.co/models/google/vit-base-patch16-224',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
      body: blob,
    }
  )
  
  const labels = await hfResponse.json()
  
  // Enhance with scientific context
  return enhanceWithScientificData(labels)
}
\`\`\`

**Analysis includes:**
- Object detection with confidence scores
- Atmospheric composition estimation
- Weather pattern recognition
- Temperature and humidity ranges
- Geological feature identification
- Educational context for each finding

### Celestial Research Database

The Research Panel provides comprehensive scientific information:

\`\`\`typescript
// Organized celestial objects by category
const CELESTIAL_CATEGORIES = [
  { id: "planets", label: "Planets", icon: "🪐" },
  { id: "dwarf-planets", label: "Dwarf Planets", icon: "🌑" },
  { id: "moons", label: "Moons", icon: "🌙" },
  // ... more categories
]

// Detailed research data for each object
interface DetailedResearch {
  name: string
  category: string
  overview: string
  physicalCharacteristics: { diameter, mass, gravity, ... }
  atmosphere: { composition, pressure, features }
  surface: { features, composition, terrain }
  moons: { count, notable }
  exploration: { missions, discoveries }
  scientificSignificance: string
  funFacts: string[]
  nasaImageQuery: string
}
\`\`\`

**Key features:**
- Browse objects by category with smart filtering
- Search by name or description
- View comprehensive scientific data organized in sections
- Click NASA suggestion images to open in detail viewer
- Export complete research reports as text files
- Smooth animations and transitions between objects
- Responsive layout for all screen sizes

**Integration with existing features:**
- NASA images from research panel open in the existing Image Detail Viewer
- AI analysis available for all research images
- Consistent design language with rest of the app
- Accessible via new Research button in navigation

---

## 🎨 Design Philosophy

### Color System
- **Background**: Deep space black (#0a0a0f)
- **Foreground**: Soft white (#f5f5f7)
- **Primary**: Cosmic blue (#3b82f6)
- **Accent**: Purple (#8b5cf6)
- **Border**: Subtle gray (#27272a)

### Typography
- **Headings**: Playfair Display (serif) for elegance
- **Body**: Geist Sans for readability
- **Code**: Geist Mono for technical content

### Layout Principles
- **Mobile-first**: Responsive from 320px to 4K
- **Flexbox primary**: For most layouts
- **CSS Grid**: For image galleries
- **Consistent spacing**: 4px/8px scale

---

## 🔧 Configuration

### Tailwind CSS v4

Configured inline in `globals.css`:

\`\`\`css
@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-serif: var(--font-geist);
  --color-background: #0a0a0f;
  --color-foreground: #f5f5f7;
  --radius: 0.5rem;
}
\`\`\`

### Next.js

Key settings in `next.config.mjs`:

\`\`\`javascript
const nextConfig = {
  images: {
    domains: ['images-assets.nasa.gov'],
  },
}
\`\`\`

---

## 📦 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy automatically

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/cosmic-explorer)

### Other Platforms

Compatible with:
- **Netlify**
- **AWS Amplify**
- **Railway**
- **Render**

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 🐛 Troubleshooting

### Common Issues

**Build Error: "Cannot read properties of undefined":**
- This was fixed by using dynamic imports for Three.js components
- The `Planet3D` component now uses `next/dynamic` with `ssr: false`
- This prevents server-side rendering of WebGL components during build
- If you encounter similar errors, ensure all browser-only code is in client components with dynamic imports

**Saturn rings not visible:**
- Check `planetName` prop is "Saturn" (case-insensitive)
- Verify `SaturnRings` component is rendering
- Ensure ring geometry is outside planet sphere
- Ring texture is now created in `useEffect` to avoid SSR issues

**Images pixelated when zoomed:**
- Check network tab for `~orig.jpg` requests
- Verify progressive loading is working
- Ensure high-res fetch completes

**AI analysis fails:**
- Verify Hugging Face API key is valid
- Wait 20 seconds if model is loading
- Check server action logs

**Firebase offline error:**
- App works without Firebase (graceful degradation)
- Check environment variables if using Firebase
- Verify Firebase project is active

**Research panel images not loading:**
- Check NASA API is accessible
- Verify placeholder images are working
- Check browser console for errors

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details

---

## 🙏 Acknowledgments

- **NASA** - For providing free access to incredible space imagery
- **Hugging Face** - For AI model hosting and inference
- **Three.js Community** - For 3D graphics tools and examples
- **Vercel** - For Next.js framework and hosting
- **shadcn** - For beautiful, accessible UI components

---

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/cosmic-explorer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/cosmic-explorer/discussions)
- **Email**: your.email@example.com

---

## 🌟 Star History

If you find this project helpful, please consider giving it a star on GitHub!

---

**Built with ❤️ by the EXOGENESIS team**

*Explore the universe, one pixel at a time* 🚀✨
