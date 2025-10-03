# FL Studio 25 Web Clone

1:1 FL Studio 25 Web Clone - React (Vite) + Tone.js + Tailwind CSS

## 🎹 Project Overview

A high-fidelity web-based recreation of FL Studio 25's core functionality, featuring:

- **Channel Rack / Step Sequencer**: 4/4 time signature with 16/32/64 step support
- **Piano Roll**: Full MIDI note editing with pitch, duration, and velocity controls
- **Mixer**: 8-10 channel mixer with Volume, Pan, Mute/Solo, and FX slots (Reverb, Delay)
- **Instrument Loading**: Drag-and-drop sample loading + virtual analog synthesizer (3x Osc clone)
- **Transport Controls**: Play, Stop, Record, and adjustable BPM (60-240)
- **Supabase Integration**: User authentication and persistent project storage

## 🛠 Tech Stack

- **Framework**: React 18 with Vite
- **Audio Engine**: Tone.js + Web Audio API
- **Styling**: Tailwind CSS
- **Database/Auth**: Supabase
- **Deployment**: Vercel

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account ([sign up here](https://supabase.com))

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Apex-dev01/fl-studio-25-web-clone.git
   cd fl-studio-25-web-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   
   a. Create a new project at [app.supabase.com](https://app.supabase.com)
   
   b. In your Supabase project, go to Settings > API and copy:
      - Project URL
      - Anon/Public Key
   
   c. Create a `.env` file in the project root (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   
   d. Add your Supabase credentials to `.env`:
   ```env
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

   e. Set up the database table in Supabase SQL Editor:
   ```sql
   create table projects (
     id uuid default uuid_generate_v4() primary key,
     user_id uuid references auth.users not null,
     project_data jsonb not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   alter table projects enable row level security;

   create policy "Users can view own projects" 
     on projects for select 
     using (auth.uid() = user_id);

   create policy "Users can insert own projects" 
     on projects for insert 
     with check (auth.uid() = user_id);

   create policy "Users can update own projects" 
     on projects for update 
     using (auth.uid() = user_id);
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 🚀 Deployment to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. Push your code to GitHub (if not already done)
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Import Project" and select your GitHub repository
4. Configure environment variables:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

During deployment, add the environment variables when prompted.

## 📖 Usage

1. **Sign Up / Sign In**: Create an account or log in with existing credentials
2. **Load Samples**: Drag and drop audio files (WAV, MP3) into the Channel Rack
3. **Program Patterns**: Click step sequencer grid to activate/deactivate steps
4. **Edit MIDI**: Use the Piano Roll to create melodies and adjust note properties
5. **Mix Tracks**: Adjust volume, panning, and add effects in the Mixer
6. **Save Projects**: Your project state is automatically saved to your Supabase account

## 🔧 Project Structure

```
fl-studio-25-web-clone/
├── src/
│   ├── components/
│   │   ├── Auth.jsx              # Authentication UI
│   │   ├── ChannelRack.jsx       # Step sequencer
│   │   ├── PianoRoll.jsx         # MIDI editor
│   │   ├── Mixer.jsx             # Audio mixer
│   │   └── InstrumentLoader.jsx  # Sample/synth loader
│   ├── contexts/
│   │   └── AuthContext.jsx       # Auth state management
│   ├── services/
│   │   └── projectService.js     # Supabase project CRUD
│   ├── supabaseClient.js         # Supabase initialization
│   ├── App.jsx                   # Main application
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── .env.example                  # Environment variables template
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎯 Phase 2 Completion Status

✅ **Phase 1**: Core audio engine and UI (Channel Rack, Piano Roll, Mixer, Transport)
✅ **Phase 2**: Supabase authentication and persistent project storage
⏳ **Phase 3**: Deployment and testing (pending)

## 🐛 Known Issues

- Browser audio context requires user interaction to start
- Large sample files may cause performance issues
- Mobile device support is limited

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

**Built with ❤️ using React, Tone.js, and Supabase**
