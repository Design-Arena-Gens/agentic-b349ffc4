## Veo 3.1 Prompt Architect

Transform messy brainstorm notes into production-ready, structured JSON prompts for Veo 3.1 video generation. The interface guides you through project identity, character continuity, narrative sequencing, cinematography, audio, and delivery specs—then produces a clean schema you can copy directly into your Veo workflow.

### Features

- Stream-of-consciousness parser that hydrates project fields, characters, and sequences from unstructured text.
- Persistent continuity IDs for characters and sequences to keep Veo renders consistent across shots.
- Detailed cinematography and audio directives aligned with high-end commercial language.
- Real-time JSON preview with one-click copy for immediate use.

### Getting Started

```bash
cd web
npm install
npm run dev
```

Visit `http://localhost:3000` to begin shaping prompts. Edit `src/app/page.tsx` to evolve the planner.

### Production Checklist

- Run `npm run lint` to confirm code quality.
- Run `npm run build` to ensure the prompt architect is production-ready.
- Deploy with `vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-b349ffc4`.

### Tech Stack

- Next.js App Router + TypeScript
- Tailwind CSS with modern glassmorphic UI
- Client-side state orchestration with React hooks
