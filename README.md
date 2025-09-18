# 🎨 RangDarshan Rangoli Studio

*Where Tradition Meets Design Intelligence*

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)

## 🌟 What is RangDarshan?

RangDarshan Rangoli Studio is an innovative AI-powered web application that brings the ancient art of rangoli into the digital age. Using cutting-edge computer vision and machine learning, it helps users analyze, learn, and create authentic Indian rangoli patterns while preserving cultural heritage.

### ✨ Key Features

- 🔍 **AI-Powered Analysis** - Upload rangoli images for detailed geometric and cultural analysis
- 📚 **Interactive Tutorials** - Step-by-step guidance with animated instructions
- 🏛️ **Heritage Gallery** - Explore traditional patterns from different Indian regions
- 🎓 **Cultural Learning** - Understand the history and significance of rangoli art
- 📱 **Mobile-Friendly** - Responsive design that works on all devices
- 🌐 **Modern Web Tech** - Built with React, TypeScript, and FastAPI

## 🚀 Quick Start Guide

### 📋 Prerequisites

Before you begin, make sure you have the following installed on your computer:

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **Python** (version 3.8 or higher) - [Download here](https://python.org/)
- **Git** - [Download here](https://git-scm.com/)

> 💡 **Tip for beginners**: If you're new to development, we recommend installing Node.js using [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) for easier version management.

### 🛠️ Installation

#### Step 1: Clone the Repository

```bash
# Clone the project to your computer
git clone https://github.com/your-username/rangdarshan-ai-creations.git

# Navigate to the project folder
cd rangdarshan-ai-creations-main
```

#### Step 2: Set Up the Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install all required dependencies
npm install

# Start the development server
npm run dev
```

Your frontend will be running at `http://localhost:5173` 🎉

#### Step 3: Set Up the Backend

Open a new terminal window/tab and run:

```bash
# Navigate to the backend directory (from project root)
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload
```

Your backend API will be running at `http://localhost:8000` 🚀

### 🌐 Access the Application

Once both servers are running:

1. Open your web browser
2. Go to `http://localhost:5173`
3. Start exploring RangDarshan!

## 🏗️ Project Structure

```
rangdarshan-ai-creations-main/
├── 📁 frontend/              # React TypeScript frontend
│   ├── 📁 src/
│   │   ├── 📁 components/    # Reusable UI components
│   │   ├── 📁 pages/         # Main application pages
│   │   ├── 📁 hooks/         # Custom React hooks
│   │   └── 📁 lib/           # Utility functions
│   ├── 📄 package.json      # Frontend dependencies
│   └── 📄 vite.config.ts    # Vite configuration
├── 📁 backend/               # Python FastAPI backend
│   ├── 📄 main.py           # Main API server
│   ├── 📄 image_processing.py # AI image analysis
│   ├── 📄 heritage_data.py   # Cultural pattern database
│   └── 📄 requirements.txt   # Python dependencies
├── 📄 README.md             # This file!
└── 📄 prd.txt               # Product Requirements Document
```

## 📚 How to Use RangDarshan

### For Beginners

1. **Upload Your First Rangoli** 📷
   - Click "Explore RangDarshan" on the homepage
   - Upload a photo of a rangoli pattern (or use our sample images)
   - Watch as AI analyzes the geometric patterns and cultural significance

2. **Learn from Tutorials** 🎓
   - Navigate to the Heritage section
   - Choose a pattern from different Indian regions
   - Follow step-by-step animated instructions

3. **Explore Cultural Heritage** 🏛️
   - Browse patterns by region (Tamil Nadu, Maharashtra, Bengal, Kerala)
   - Learn about festivals and occasions
   - Understand the cultural significance of different designs

### For Developers

#### Frontend Development
```bash
# Available scripts
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint for code quality
```

#### Backend API Endpoints
- `POST /analyze` - Upload and analyze rangoli images
- `POST /new_analyze` - Streaming analysis with real-time updates
- `POST /suggestions` - Get AI-powered pattern suggestions
- `GET /heritage` - Access cultural heritage database

## 🛠️ Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|----------|
| **React** | 18.3.1 | UI Framework |
| **TypeScript** | 5.8.3 | Type Safety |
| **Vite** | 5.4.19 | Build Tool |
| **Tailwind CSS** | 3.4.17 | Styling |
| **shadcn/ui** | Latest | Component Library |
| **Radix UI** | Latest | Accessible Primitives |

### Backend Technologies

| Technology | Purpose |
|------------|----------|
| **FastAPI** | REST API Framework |
| **OpenCV** | Computer Vision |
| **NumPy** | Numerical Computing |
| **scikit-image** | Image Processing |
| **NetworkX** | Graph Analysis |

## 📱 Features in Detail

### 🔍 AI Image Analysis
- **Pattern Recognition**: Identifies geometric structures and symmetries
- **Cultural Classification**: Determines regional style and cultural origin
- **Mathematical Analysis**: Calculates proportions, angles, and geometric properties
- **Detailed Reports**: Provides comprehensive analysis with cultural insights

### 🏛️ Heritage Database
- **Regional Patterns**: Authentic designs from across India
- **Cultural Context**: Historical background and significance
- **Festival Associations**: Patterns specific to occasions and celebrations
- **Skill Levels**: From beginner-friendly to expert-level designs

### 🎓 Interactive Learning
- **Step-by-step Tutorials**: Animated guidance for pattern creation
- **Progressive Difficulty**: Learn at your own pace
- **Cultural Education**: Understand the story behind each pattern
- **Practice Exercises**: Hands-on activities to improve skills

## 🛠️ Troubleshooting

### Common Issues

**Frontend not starting?**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Backend API errors?**
```bash
# Check Python dependencies
pip install -r requirements.txt

# Verify Python version (should be 3.8+)
python --version

# Restart the server
uvicorn main:app --reload
```

**Port already in use?**
- Frontend (5173): `npm run dev -- --port 3000`
- Backend (8000): `uvicorn main:app --reload --port 8001`

### 🆘 Need Help?

- 🐛 **Found a bug?** Open an issue on GitHub
- ❓ **Have questions?** Check our documentation or ask in discussions
- 💡 **Feature request?** We'd love to hear your ideas!

## 📦 Deployment

### Using Lovable Platform

1. Open your [Lovable Project](https://lovable.dev/projects/a20499e1-ec5f-4c96-83ad-9e4f41b911c1)
2. Click "Share" → "Publish"
3. Your app will be live instantly! 🎉

### Custom Domain Setup

1. Navigate to Project > Settings > Domains
2. Click "Connect Domain"
3. Follow the setup instructions

For detailed deployment guide, see [Lovable Documentation](https://docs.lovable.dev/tips-tricks/custom-domain)

### Self-Hosting

```bash
# Build frontend for production
cd frontend
npm run build

# Serve with your preferred web server (nginx, apache, etc.)
# Backend can be deployed using Docker or cloud platforms
```

## 🤝 Contributing

We welcome contributions from developers, cultural experts, and art enthusiasts!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper testing
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Contribution Guidelines

- 🎨 **Cultural Sensitivity**: Ensure accuracy and respect for traditional art forms
- 📝 **Documentation**: Update docs for any new features
- ✅ **Testing**: Include tests for new functionality
- 🌍 **Accessibility**: Follow web accessibility standards

## 📋 Roadmap

### 🔌 Current Version (v1.0)
- ✅ AI-powered image analysis
- ✅ Heritage pattern gallery
- ✅ Interactive tutorials
- ✅ Cultural education content
- ✅ Mobile-responsive design

### 🔮 Upcoming Features
- 🔄 Advanced pattern generation
- 🌍 Multi-language support
- 📱 Native mobile apps
- 🤝 Community features
- 🎯 AR/VR integration

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Traditional rangoli artists and cultural practitioners
- Open source community for amazing tools and libraries
- Cultural institutions preserving heritage art forms
- Everyone contributing to digital preservation of traditional arts

## 📧 Contact

- **Project Website**: [RangDarshan Studio](https://your-domain.com)
- **GitHub Issues**: [Report Issues](https://github.com/your-username/rangdarshan-ai-creations/issues)
- **Discussions**: [Join Conversations](https://github.com/your-username/rangdarshan-ai-creations/discussions)

---

<div align="center">

**Made with ❤️ for preserving cultural heritage through technology**

[Explore RangDarshan](https://your-domain.com) • [Documentation](https://docs.your-domain.com) • [Community](https://community.your-domain.com)

</div>
#   K o l a m -  
 