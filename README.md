# AI Story Generator - Choose Your Own Adventure

An interactive story generation application that creates dynamic, branching narratives using AI. Users can influence the story direction and make choices that affect the outcome.

## 🚀 Features

### Story Generation
- AI-powered interactive storytelling
- Theme-based story generation (pirates, space, medieval, etc.)
- Dynamic branching narratives with multiple endings
- Win/lose story endings for game-like experience
- Asynchronous story generation with job tracking
- Session-based story persistence
- Real-time generation status updates
- Error handling and recovery

### User Experience
- Real-time text streaming with typewriter effect
- Text-to-speech narration with mute/unmute option
- Pause/resume story playback control
- Interactive choice selection system
- Visual loading status indicators
- Error handling and validation

### Technical Features
- RESTful API integration with real-time status polling
- Asynchronous story generation with job tracking
- Session-based story management
- Cross-browser text-to-speech compatibility
- Efficient story tree navigation system
- SQLite database with SQLAlchemy ORM

### Story Generation Process
- Create a story job with theme and session ID
- Asynchronous processing with real-time status updates
- Poll job status until completion
- Retrieve generated story using story ID
- Navigate through story nodes based on user choices

## 📊 Database Models

### Story Model
```sql
stories
├── id (Primary Key)
├── title (String, Indexed)
├── session_id (String, Indexed)
└── created_at (DateTime)
```
Represents a complete story with multiple nodes and branching paths.

### StoryNode Model
```sql
story_nodes
├── id (Primary Key)
├── story_id (Foreign Key → stories.id)
├── content (String)
├── is_root (Boolean)
├── is_ending (Boolean)
├── is_winning_ending (Boolean)
└── options (JSON)
```
Represents individual story segments with content and branching options.

### StoryJob Model
```sql
story_jobs
├── id (Primary Key)
├── job_id (String, Unique, Indexed)
├── session_id (String, Indexed)
├── theme (String)
├── status (String)
├── story_id (Integer, Nullable)
├── error (String, Nullable)
├── created_at (DateTime)
└── completed_at (DateTime, Nullable)
```
Tracks the asynchronous story generation process from request to completion.

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs with Python
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **Python 3.11+** - Core programming language
- **GROQ AI** - AI model integration for story generation

### Frontend
- **React** - UI library
- **Vite** - Next generation frontend tooling
- **Axios** - HTTP client
- **React Router** - Navigation and routing

## 📋 Prerequisites

- Python 3.11 or higher
- Node.js 16 or higher
- npm or yarn
- GROQ API key

## 🔧 Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a .env file in the backend directory with:
```env
DEBUG=True
API_PREFIX=/api
ALLOWED_ORIGINS=https://localhost:3000,https://localhost:5173
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the frontend directory with:
```env
VITE_BACKEND_URL=http://localhost:8000
```

## 🚀 Running the Application

### Start the Backend

```bash
cd backend
python main.py
```
The API will be available at http://localhost:8000
API documentation will be available at http://localhost:8000/docs

### Start the Frontend

```bash
cd frontend
npm run dev
```
The application will be available at http://localhost:5173

## 🎮 How to Use

1. Access the web interface at http://localhost:5173
2. Enter a theme or topic for your story
3. The AI will generate an initial story segment
4. Make choices at each branch point to influence the story
5. Continue the adventure based on your decisions

## 🌟 Project Structure

```
.
├── backend/
│   ├── core/           # Core functionality and configuration
│   ├── db/            # Database models and configuration
│   ├── models/        # Data models
│   ├── routers/       # API routes
│   ├── schemas/       # Pydantic schemas
│   └── main.py        # Application entry point
└── frontend/
    ├── src/
    │   ├── components/ # React components
    │   ├── App.jsx    # Main application component
    │   └── util.js    # Utility functions
    └── index.html     # Entry HTML file
```

## 🙏 Acknowledgments

- GROQ AI for providing the AI model
- FastAPI for the excellent Python web framework
- React and Vite teams for the frontend tools