# Columbia Commodity Club Website

A modern, professional React + TypeScript website for the Columbia Commodity Club, a student-run finance and commodities organization at Columbia University.

## Features

- **React + TypeScript**: Built with modern React and TypeScript for type safety
- **Clean, Institutional Design**: Premium finance/trading desk aesthetic with neutral color palette
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Subtle animations, hover effects, and smooth transitions
- **Comprehensive Content**: Home, News, Weekly Trading Strategies, and Events pages
- **Easy to Expand**: Component-based structure for adding future content

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **CSS** - Custom stylesheets with CSS variables

## Project Structure

```
commoditiesclubcolumbia/
├── public/
│   └── assets/
│       └── logo.png          # Club logo (to be added)
├── src/
│   ├── components/
│   │   ├── Header.tsx        # Navigation header component
│   │   ├── Header.css
│   │   ├── Footer.tsx         # Footer component
│   │   └── Footer.css
│   ├── pages/
│   │   ├── Home.tsx           # Home page
│   │   ├── Home.css
│   │   ├── News.tsx           # News & Analysis page
│   │   ├── News.css
│   │   ├── Strategies.tsx     # Weekly Trading Strategies page
│   │   ├── Strategies.css
│   │   ├── Events.tsx         # Events page
│   │   └── Events.css
│   ├── App.tsx                # Main app component with routing
│   ├── App.css
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles and CSS variables
├── index.html
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Add your logo:
   - Place your logo image in `public/assets/` folder
   - Name it `logo.png`
   - Recommended size: 200px width (height will scale proportionally)
   - Format: PNG with transparent background (recommended)

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service.

## Customization

### Colors

Edit the CSS variables in `src/index.css`:

```css
:root {
  --color-primary: #1a365d;
  --color-accent: #2563eb;
  /* ... */
}
```

### Content

Update the content in each page component:
- `src/pages/Home.tsx` - Home page content
- `src/pages/News.tsx` - News articles
- `src/pages/Strategies.tsx` - Trading strategies
- `src/pages/Events.tsx` - Event listings

### Fonts

The site uses Google Fonts (Inter and Playfair Display). To change fonts, update the `<link>` tags in `index.html`.

## Deployment

The website can be deployed to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions or deploy manually
- **AWS S3 + CloudFront**: Upload `dist` folder to S3 bucket

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Design Notes

- **Color Palette**: Dark blue primary (#1a365d) with neutral grays
- **Typography**: Inter for body text, Playfair Display for headings
- **Layout**: Clean, spacious design with strong visual hierarchy
- **Responsive Breakpoints**: 480px (mobile), 768px (tablet), 1024px (desktop)

## Contact

For questions or support, please contact the Columbia Commodity Club leadership team.

---

**Note**: This website is for educational and informational purposes. Trading strategies and market analysis do not constitute investment advice.
