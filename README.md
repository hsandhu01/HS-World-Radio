# 🌍 World Radio

A modern web application for streaming radio stations from around the world, built with React, TypeScript, and Tailwind CSS.

## 🎵 Features

- **Global Radio Stations**: Access hundreds of radio stations worldwide
- **Real-time Search**: Search stations by name, country, or genre
- **Genre Filtering**: Quick filtering by popular music genres
- **Favorites System**: Save your favorite stations for quick access
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Audio Controls**: Play/pause, volume control, and mute functionality

## 🚀 Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Radio Browser API

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/hsandhu01/HS-World-Radio
cd world-radio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 to view it in the browser.

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.4",
    "lucide-react": "^0.290.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
```

## 🏗️ Project Structure

```
world-radio/
├── src/
│   ├── components/
│   │   └── WorldRadio.tsx
│   ├── types/
│   │   └── radio.ts
│   ├── utils/
│   │   └── radio-utils.ts
│   ├── App.tsx
│   └── index.css
├── public/
├── index.html
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🎯 Core Features

### Radio Station Integration
- Uses the Radio Browser API to fetch stations
- Real-time search functionality
- Genre-based filtering
- Station metadata display

### Audio Player
- Play/pause controls
- Volume adjustment
- Mute functionality
- Current station display

### User Interface
- Modern, minimalist design
- Responsive layout
- Smooth animations
- Loading states
- Error handling

## 🔧 Configuration

### Vite Config
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://nl1.api.radio-browser.info',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### Tailwind Config
```typescript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 🌐 API Integration

The application uses the [Radio Browser API](https://api.radio-browser.info/) for fetching radio station data. Key endpoints include:

- `/stations/topclick`: Fetch popular stations
- `/stations/search`: Search for stations
- `/stations/byname`: Search stations by name

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

## 🎨 UI/UX Features

- Dark theme with purple gradient accents
- Glass morphism effects
- Smooth animations using Framer Motion
- Interactive hover states
- Loading and error states
- Accessibility considerations

## 🔮 Future Enhancements

- [ ] Station favorites system
- [ ] Recently played history
- [ ] Audio visualizer
- [ ] Sleep timer
- [ ] Share functionality
- [ ] Offline mode
- [ ] Custom themes
- [ ] Multiple language support

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](link-to-issues).

## 📄 License

This project is [MIT](LICENSE) licensed.

## 👏 Acknowledgments

- [Radio Browser API](https://api.radio-browser.info/) for providing the radio station database
- All the contributors and maintainers of the dependencies used in this project

## 📧 Contact

Harry Sandhu - [me@harrysandhu.tech](mailto:me@harrysandhu.tech)
