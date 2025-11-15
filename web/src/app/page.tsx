'use client';

import { useMemo, useState } from "react";

type CharacterPlan = {
  id: string;
  name: string;
  essence: string;
  visualTraits: string;
  wardrobe: string;
  motivations: string;
  consistencyNotes: string;
};

type SequencePlan = {
  id: string;
  title: string;
  narrativeBeat: string;
  location: string;
  timeOfDay: string;
  mood: string;
  keyShots: string;
  transitions: string;
};

type CinematographyPlan = {
  cameraLanguage: string;
  lensing: string;
  movement: string;
  lighting: string;
  colorPalette: string;
  vfx: string;
};

type AudioPlan = {
  soundtrack: string;
  rhythm: string;
  soundDesign: string;
  dialogue: string;
  mixingNotes: string;
};

type DeliveryPlan = {
  aspectRatio: string;
  duration: string;
  renderFormat: string;
  fps: string;
  negativePrompts: string;
};

type PromptState = {
  title: string;
  logline: string;
  tone: string;
  theme: string;
  brandKeywords: string;
  referenceFilms: string;
  characters: CharacterPlan[];
  sequences: SequencePlan[];
  cinematography: CinematographyPlan;
  audio: AudioPlan;
  continuity: {
    colorContinuity: string;
    propsContinuity: string;
    brandRules: string;
  };
  directives: {
    mustInclude: string;
    avoid: string;
    creativeRisks: string;
  };
  delivery: DeliveryPlan;
  messyIdeas: string;
  notes: string;
};

const createId = () => {
  if (
    typeof globalThis === "object" &&
    globalThis !== null &&
    "crypto" in globalThis &&
    typeof globalThis.crypto?.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2, 10);
};

const defaultState: PromptState = {
  title: "Untitled Veo 3.1 Masterpiece",
  logline:
    "A high-end cinematic journey that follows a central hero through escalating stakes, showcasing premium visuals and emotive storytelling.",
  tone: "Prestige, cinematic, emotionally resonant, confident, high-budget aesthetic.",
  theme: "Transformation and aspiration powered by human ingenuity.",
  brandKeywords:
    "high luxury, precision, premium craftsmanship, timeless confidence, future-forward",
  referenceFilms: "Blade Runner 2049, Dune, Top Gun Maverick, Dior commercials",
  characters: [
    {
      id: createId(),
      name: "Avery Cole — Visionary Protagonist",
      essence:
        "Brilliant creative director orchestrating a breakthrough launch, grounded yet inspiring.",
      visualTraits: "Sharp jawline, expressive eyes, iconic haircut, confident stance.",
      wardrobe:
        "Tailored monochrome suit with subtle metallic accents, signature smart watch.",
      motivations:
        "Deliver a flawless reveal that cements their legacy; protect their team while chasing innovation.",
      consistencyNotes:
        "Always carries a sleek tablet prop, subtle lens flares highlight their presence.",
    },
  ],
  sequences: [
    {
      id: createId(),
      title: "Cold Open — The Spark",
      narrativeBeat:
        "Establish Avery in a cavernous dark space, single beam of light, hint of the product core.",
      location: "Industrial cathedral, volumetric light shafts, reflective floor.",
      timeOfDay: "Blue hour interior",
      mood: "Anticipation, restrained energy, electric calm before ignition.",
      keyShots:
        "Slow reveal push-in, macro inserts of activation gestures, drone orbit establishing scale.",
      transitions:
        "Match-cut from light flare into title graphic, whoosh of air and rising score.",
    },
  ],
  cinematography: {
    cameraLanguage:
      "Hybrid of controlled Steadicam and precision robotic moves; balanced motion with moments of stillness.",
    lensing: "Anamorphic 40mm and 65mm for hero moments, macro probe for detail.",
    movement:
      "Cinematic pushes, orbiting reveals, suspended crane drops synced with musical hits.",
    lighting:
      "High-contrast chiaroscuro with motivated practicals, volumetric atmospherics.",
    colorPalette:
      "Gunmetal, obsidian, aurora highlights with warm skin balance; cinematic LUT.",
    vfx: "Subtle particle sims, holographic UI overlays, light bloom enhancements.",
  },
  audio: {
    soundtrack:
      "Hybrid orchestral synth score; pulses build into heroic crescendo with vocal textures.",
    rhythm: "Three-act build: hush → acceleration → triumphant release.",
    soundDesign:
      "Futuristic foley, tactile UI interactions, engineered impacts supporting cuts.",
    dialogue:
      "Minimal voiceover; intentional lines that reinforce core theme and call-to-action.",
    mixingNotes:
      "Keep low-end tight, ensure clarity around hero product hits, widen mix at finale.",
  },
  continuity: {
    colorContinuity:
      "Maintain consistent cyan accent across sequences; product glow always same hue.",
    propsContinuity:
      "Tablet prop in left hand, ring bevel detail visible, hero product illuminated by rim light.",
    brandRules:
      "Premium minimalism, no slapstick, reinforce innovation, aspirational yet grounded.",
  },
  directives: {
    mustInclude:
      "Hero product hero shot, team synergy montage, macro detail showcase, triumphant skyline reveal.",
    avoid:
      "Cartoonish lighting, handheld shake, cluttered frames, overt references to competitors.",
    creativeRisks:
      "Experimental lighting transitions, abstract montage overlays, bold time-ramp cuts.",
  },
  delivery: {
    aspectRatio: "2.39:1 anamorphic",
    duration: "60 seconds total runtime",
    renderFormat: "ProRes 4444 with alpha-safe HUD layers",
    fps: "24fps master, provide 60fps optical flow variant",
    negativePrompts:
      "No low-budget cues, no inconsistent character faces, avoid pastel color schemes.",
  },
  messyIdeas: "",
  notes:
    "Ensure Veo prompt mentions continuity of hero and consistent wardrobe across shots.",
};

const normalizeKeywordList = (value: string) =>
  value
    .split(/[,|\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

function parseMessyIdeas(raw: string, state: PromptState): Partial<PromptState> {
  if (!raw.trim()) {
    return {};
  }

  const clean = raw.replace(/\r/g, "");
  const lines = clean.split("\n").map((line) => line.trim()).filter(Boolean);
  const paragraphs = clean
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const partial: Partial<PromptState> = {};
  const directiveOverrides: Partial<PromptState["directives"]> = {};
  const continuityOverrides: Partial<PromptState["continuity"]> = {};
  const deliveryOverrides: Partial<PromptState["delivery"]> = {};
  const cinematographyOverrides: Partial<CinematographyPlan> = {};
  const audioOverrides: Partial<AudioPlan> = {};
  const characters: CharacterPlan[] = [];
  const sequences: SequencePlan[] = [];

  for (const line of lines) {
    const [rawKey, ...rest] = line.split(":");
    if (!rest.length) {
      continue;
    }

    const key = rawKey.toLowerCase();
    const value = rest.join(":").trim();

    if (key.startsWith("title")) {
      partial.title = value;
    } else if (key.startsWith("logline")) {
      partial.logline = value;
    } else if (key.startsWith("tone")) {
      partial.tone = value;
    } else if (key.startsWith("theme")) {
      partial.theme = value;
    } else if (key.includes("keyword") || key.startsWith("brand")) {
      partial.brandKeywords = value;
    } else if (key.includes("reference") || key.includes("film")) {
      partial.referenceFilms = value;
    } else if (key.includes("must include") || key.includes("must-have")) {
      directiveOverrides.mustInclude = value;
    } else if (key.startsWith("avoid") || key.startsWith("don't") || key.startsWith("do not")) {
      directiveOverrides.avoid = value;
    } else if (key.includes("risk") || key.includes("experiment")) {
      directiveOverrides.creativeRisks = value;
    } else if (key.includes("color continuity")) {
      continuityOverrides.colorContinuity = value;
    } else if (key.includes("props") || key.includes("set continuity")) {
      continuityOverrides.propsContinuity = value;
    } else if (key.includes("brand rule") || key.includes("governance")) {
      continuityOverrides.brandRules = value;
    } else if (key.includes("aspect")) {
      deliveryOverrides.aspectRatio = value;
    } else if (key.includes("duration") || key.includes("length")) {
      deliveryOverrides.duration = value;
    } else if (key.includes("format")) {
      deliveryOverrides.renderFormat = value;
    } else if (key.includes("frame") || key.includes("fps")) {
      deliveryOverrides.fps = value;
    } else if (key.includes("negative prompt")) {
      deliveryOverrides.negativePrompts = value;
    } else if (key.startsWith("notes") || key.startsWith("note")) {
      partial.notes = value;
    } else if (key.includes("soundtrack") || key.includes("music")) {
      audioOverrides.soundtrack = value;
    } else if (key.includes("rhythm") || key.includes("pace")) {
      audioOverrides.rhythm = value;
    } else if (key.includes("sound design") || key.includes("foley")) {
      audioOverrides.soundDesign = value;
    } else if (key.includes("dialogue") || key.includes("voice")) {
      audioOverrides.dialogue = value;
    } else if (key.includes("mix")) {
      audioOverrides.mixingNotes = value;
    } else if (key.includes("camera")) {
      cinematographyOverrides.cameraLanguage = value;
    } else if (key.includes("lens")) {
      cinematographyOverrides.lensing = value;
    } else if (key.includes("movement")) {
      cinematographyOverrides.movement = value;
    } else if (key.includes("lighting")) {
      cinematographyOverrides.lighting = value;
    } else if (key.includes("color")) {
      cinematographyOverrides.colorPalette = value;
    } else if (key.includes("vfx") || key.includes("effects")) {
      cinematographyOverrides.vfx = value;
    }
  }

  for (const block of paragraphs) {
    const lowerBlock = block.toLowerCase();

    if (
      /(character|protagonist|antagonist|hero|villain)/.test(lowerBlock) &&
      !/(scene|sequence|shot|beat)/.test(lowerBlock)
    ) {
      const nameMatch = block.match(/^[^\n:]+(?=[:\-])/);
      const name = nameMatch ? nameMatch[0].trim() : `Character ${characters.length + 1}`;
      characters.push({
        id: createId(),
        name,
        essence: block,
        visualTraits: "",
        wardrobe: "",
        motivations: "",
        consistencyNotes: "",
      });
      continue;
    }

    if (/(scene|sequence|beat|montage|shot)/.test(lowerBlock)) {
      const titleMatch = block.match(/^[^\n:]+(?=[:\-])/);
      const title = titleMatch ? titleMatch[0].trim() : `Sequence ${sequences.length + 1}`;
      sequences.push({
        id: createId(),
        title,
        narrativeBeat: block,
        location: "",
        timeOfDay: "",
        mood: "",
        keyShots: "",
        transitions: "",
      });
      continue;
    }

    if (/(lighting|chiaroscuro|exposure)/.test(lowerBlock)) {
      cinematographyOverrides.lighting = block;
    }
    if (/(camera|framing|lense|lens|shot style)/.test(lowerBlock)) {
      cinematographyOverrides.cameraLanguage ??= block;
    }
    if (/(movement|tracking|steadicam|drone)/.test(lowerBlock)) {
      cinematographyOverrides.movement = block;
    }
    if (/(color|palette|grading|lut)/.test(lowerBlock)) {
      cinematographyOverrides.colorPalette = block;
    }
    if (/(vfx|effects|particles|hologram)/.test(lowerBlock)) {
      cinematographyOverrides.vfx = block;
    }
    if (/(music|score|soundtrack)/.test(lowerBlock)) {
      audioOverrides.soundtrack ??= block;
    }
    if (/(rhythm|pace|tempo)/.test(lowerBlock)) {
      audioOverrides.rhythm ??= block;
    }
    if (/(sound design|foley|audio texture)/.test(lowerBlock)) {
      audioOverrides.soundDesign ??= block;
    }
    if (/(voice|dialogue|narration)/.test(lowerBlock)) {
      audioOverrides.dialogue ??= block;
    }
  }

  if (characters.length) {
    partial.characters = characters;
  }

  if (sequences.length) {
    partial.sequences = sequences;
  }

  if (Object.keys(directiveOverrides).length) {
    partial.directives = {
      ...state.directives,
      ...directiveOverrides,
    };
  }

  if (Object.keys(continuityOverrides).length) {
    partial.continuity = {
      ...state.continuity,
      ...continuityOverrides,
    };
  }

  if (Object.keys(deliveryOverrides).length) {
    partial.delivery = {
      ...state.delivery,
      ...deliveryOverrides,
    };
  }

  if (Object.keys(cinematographyOverrides).length) {
    partial.cinematography = {
      ...state.cinematography,
      ...cinematographyOverrides,
    };
  }

  if (Object.keys(audioOverrides).length) {
    partial.audio = {
      ...state.audio,
      ...audioOverrides,
    };
  }

  return partial;
}

function buildPrompt(state: PromptState) {
  return {
    model: "Veo 3.1",
    project: {
      title: state.title,
      logline: state.logline,
      tone: state.tone,
      theme: state.theme,
      keywords: normalizeKeywordList(state.brandKeywords),
      referenceFilms: normalizeKeywordList(state.referenceFilms),
    },
    characters: state.characters.map((character, index) => ({
      continuityId: `character_${index + 1}`,
      name: character.name,
      essence: character.essence,
      visualTraits: character.visualTraits,
      wardrobe: character.wardrobe,
      motivations: character.motivations,
      consistencyNotes: character.consistencyNotes,
    })),
    sequences: state.sequences.map((sequence, index) => ({
      continuityId: `sequence_${index + 1}`,
      title: sequence.title,
      narrativeBeat: sequence.narrativeBeat,
      location: sequence.location,
      timeOfDay: sequence.timeOfDay,
      mood: sequence.mood,
      keyShots: sequence.keyShots,
      transitions: sequence.transitions,
    })),
    cinematography: {
      cameraLanguage: state.cinematography.cameraLanguage,
      lensing: state.cinematography.lensing,
      movement: state.cinematography.movement,
      lighting: state.cinematography.lighting,
      colorPalette: state.cinematography.colorPalette,
      vfx: state.cinematography.vfx,
    },
    audio: {
      soundtrack: state.audio.soundtrack,
      rhythm: state.audio.rhythm,
      soundDesign: state.audio.soundDesign,
      dialogue: state.audio.dialogue,
      mixingNotes: state.audio.mixingNotes,
    },
    continuity: {
      color: state.continuity.colorContinuity,
      props: state.continuity.propsContinuity,
      brand: state.continuity.brandRules,
    },
    directives: {
      mustInclude: state.directives.mustInclude,
      avoid: state.directives.avoid,
      creativeRisks: state.directives.creativeRisks,
    },
    delivery: {
      aspectRatio: state.delivery.aspectRatio,
      duration: state.delivery.duration,
      renderFormat: state.delivery.renderFormat,
      fps: state.delivery.fps,
      negativePrompts: state.delivery.negativePrompts,
    },
    notes: state.notes,
  };
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-zinc-800">{label}</span>
      <textarea
        className="h-auto w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
      />
    </label>
  );
}

export default function Home() {
  const [state, setState] = useState<PromptState>(defaultState);
  const [isCopied, setIsCopied] = useState(false);

  const promptJson = useMemo(
    () => JSON.stringify(buildPrompt(state), null, 2),
    [state],
  );

  const handleUpdate = <K extends keyof PromptState>(
    key: K,
    value: PromptState[K],
  ) => {
    setState((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleCharacterChange = (id: string, key: keyof CharacterPlan, value: string) => {
    setState((previous) => ({
      ...previous,
      characters: previous.characters.map((character) =>
        character.id === id ? { ...character, [key]: value } : character,
      ),
    }));
  };

  const addCharacter = () => {
    setState((previous) => ({
      ...previous,
      characters: [
        ...previous.characters,
        {
          id: createId(),
          name: "New Character",
          essence: "",
          visualTraits: "",
          wardrobe: "",
          motivations: "",
          consistencyNotes: "",
        },
      ],
    }));
  };

  const removeCharacter = (id: string) => {
    setState((previous) => ({
      ...previous,
      characters: previous.characters.filter((character) => character.id !== id),
    }));
  };

  const handleSequenceChange = (id: string, key: keyof SequencePlan, value: string) => {
    setState((previous) => ({
      ...previous,
      sequences: previous.sequences.map((sequence) =>
        sequence.id === id ? { ...sequence, [key]: value } : sequence,
      ),
    }));
  };

  const addSequence = () => {
    setState((previous) => ({
      ...previous,
      sequences: [
        ...previous.sequences,
        {
          id: createId(),
          title: "New Sequence",
          narrativeBeat: "",
          location: "",
          timeOfDay: "",
          mood: "",
          keyShots: "",
          transitions: "",
        },
      ],
    }));
  };

  const removeSequence = (id: string) => {
    setState((previous) => ({
      ...previous,
      sequences: previous.sequences.filter((sequence) => sequence.id !== id),
    }));
  };

  const handleParseIdeas = () => {
    const parsed = parseMessyIdeas(state.messyIdeas, state);
    if (!Object.keys(parsed).length) {
      return;
    }

    setState((previous) => ({
      ...previous,
      ...parsed,
    }));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptJson);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy prompt", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-24 pt-12 lg:px-10">
        <header className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-lg shadow-zinc-200/30 backdrop-blur">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Veo 3.1 Prompt Architect
            </span>
            <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">
              Transform raw ideas into structured cinematic prompt blueprints
            </h1>
            <p className="text-sm text-zinc-600 sm:text-base">
              Feed your messy notes, lock in continuity, and export a Veo-ready JSON spec that preserves
              characters, cinematography language, and high-budget polish.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Shot Continuity
              </p>
              <p className="mt-2 text-sm text-zinc-800">
                Persistent character IDs map straight into Veo 3.1 for consistent faces and wardrobe.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Cinematic Language
              </p>
              <p className="mt-2 text-sm text-zinc-800">
                Capture lensing, movement, and lighting directives the model understands instantly.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Narrative Flow
              </p>
              <p className="mt-2 text-sm text-zinc-800">
                Outline sequences with beats, transitions, and mood to guide shot orchestration.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Export Ready
              </p>
              <p className="mt-2 text-sm text-zinc-800">
                Copy clean JSON instantly or paste directly into your Veo 3.1 workflow.
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-md shadow-zinc-200/40">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-zinc-900">
                  01. Normalize messy ideas
                </h2>
                <button
                  onClick={handleParseIdeas}
                  className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
                >
                  Auto-Structure Notes
                </button>
              </div>
              <TextField
                label="Stream-of-consciousness input"
                value={state.messyIdeas}
                onChange={(value) => handleUpdate("messyIdeas", value)}
                placeholder="Paste fragments, beats, keywords, character blurbs… the parser will surface structure."
                rows={6}
              />
              <p className="mt-2 text-xs text-zinc-500">
                Tip: Use prefixes like “Character - Avery:”, “Sequence - Launch reveal:”, “Lighting:”, “Must include:” for higher fidelity extraction.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-md shadow-zinc-200/40">
              <h2 className="text-lg font-semibold text-zinc-900">02. Project identity</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <TextField
                  label="Title"
                  value={state.title}
                  onChange={(value) => handleUpdate("title", value)}
                  placeholder="Enter project title"
                  rows={2}
                />
                <TextField
                  label="Theme"
                  value={state.theme}
                  onChange={(value) => handleUpdate("theme", value)}
                  placeholder="e.g. Courage through innovation"
                  rows={2}
                />
                <TextField
                  label="Logline"
                  value={state.logline}
                  onChange={(value) => handleUpdate("logline", value)}
                  placeholder="High-level story summary"
                  rows={4}
                />
                <TextField
                  label="Tone"
                  value={state.tone}
                  onChange={(value) => handleUpdate("tone", value)}
                  placeholder="Prestige, emotive, cinematic"
                  rows={4}
                />
                <TextField
                  label="Brand keywords"
                  value={state.brandKeywords}
                  onChange={(value) => handleUpdate("brandKeywords", value)}
                  placeholder="Separate with commas"
                  rows={3}
                />
                <TextField
                  label="Reference films & content"
                  value={state.referenceFilms}
                  onChange={(value) => handleUpdate("referenceFilms", value)}
                  placeholder="List signature campaigns or films"
                  rows={3}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-md shadow-zinc-200/40">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900">
                  03. Characters & continuity
                </h2>
                <button
                  onClick={addCharacter}
                  className="rounded-full border border-dashed border-zinc-400 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
                >
                  Add character
                </button>
              </div>
              <div className="mt-5 flex flex-col gap-6">
                {state.characters.map((character) => (
                  <div
                    key={character.id}
                    className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 shadow-sm"
                  >
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <h3 className="text-sm font-semibold text-zinc-900">
                        {character.name || "Unnamed Character"}
                      </h3>
                      <button
                        onClick={() => removeCharacter(character.id)}
                        className="text-xs font-medium uppercase tracking-wide text-zinc-500 transition hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <TextField
                        label="Name & archetype"
                        value={character.name}
                        onChange={(value) =>
                          handleCharacterChange(character.id, "name", value)
                        }
                        placeholder="Avery Cole — Visionary Protagonist"
                        rows={2}
                      />
                      <TextField
                        label="Essence"
                        value={character.essence}
                        onChange={(value) =>
                          handleCharacterChange(character.id, "essence", value)
                        }
                        placeholder="Core personality, role, and goals."
                        rows={2}
                      />
                      <TextField
                        label="Visual traits"
                        value={character.visualTraits}
                        onChange={(value) =>
                          handleCharacterChange(character.id, "visualTraits", value)
                        }
                        placeholder="Face structure, hair, posture, hero props."
                      />
                      <TextField
                        label="Wardrobe"
                        value={character.wardrobe}
                        onChange={(value) =>
                          handleCharacterChange(character.id, "wardrobe", value)
                        }
                        placeholder="Signature wardrobe for continuity."
                      />
                      <TextField
                        label="Motivations"
                        value={character.motivations}
                        onChange={(value) =>
                          handleCharacterChange(character.id, "motivations", value)
                        }
                        placeholder="What drives them through the story."
                      />
                      <TextField
                        label="Consistency notes"
                        value={character.consistencyNotes}
                        onChange={(value) =>
                          handleCharacterChange(character.id, "consistencyNotes", value)
                        }
                        placeholder="Continuity notes, recurring props, camera treatment."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-md shadow-zinc-200/40">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900">
                  04. Narrative sequences
                </h2>
                <button
                  onClick={addSequence}
                  className="rounded-full border border-dashed border-zinc-400 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
                >
                  Add sequence
                </button>
              </div>
              <div className="mt-5 flex flex-col gap-6">
                {state.sequences.map((sequence) => (
                  <div
                    key={sequence.id}
                    className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 shadow-sm"
                  >
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <h3 className="text-sm font-semibold text-zinc-900">
                        {sequence.title || "Untitled Sequence"}
                      </h3>
                      <button
                        onClick={() => removeSequence(sequence.id)}
                        className="text-xs font-medium uppercase tracking-wide text-zinc-500 transition hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <TextField
                        label="Title"
                        value={sequence.title}
                        onChange={(value) =>
                          handleSequenceChange(sequence.id, "title", value)
                        }
                        placeholder="Launch reveal, Montage, Finale..."
                        rows={2}
                      />
                      <TextField
                        label="Narrative beat"
                        value={sequence.narrativeBeat}
                        onChange={(value) =>
                          handleSequenceChange(sequence.id, "narrativeBeat", value)
                        }
                        placeholder="What happens emotionally and story-wise."
                        rows={2}
                      />
                      <TextField
                        label="Location"
                        value={sequence.location}
                        onChange={(value) =>
                          handleSequenceChange(sequence.id, "location", value)
                        }
                        placeholder="Set design, environment, geography."
                      />
                      <TextField
                        label="Time of day"
                        value={sequence.timeOfDay}
                        onChange={(value) =>
                          handleSequenceChange(sequence.id, "timeOfDay", value)
                        }
                        placeholder="Golden hour, night interior, etc."
                      />
                      <TextField
                        label="Mood & intention"
                        value={sequence.mood}
                        onChange={(value) =>
                          handleSequenceChange(sequence.id, "mood", value)
                        }
                        placeholder="How should the audience feel?"
                      />
                      <TextField
                        label="Key shots & blocking"
                        value={sequence.keyShots}
                        onChange={(value) =>
                          handleSequenceChange(sequence.id, "keyShots", value)
                        }
                        placeholder="Signature frames, moves, focal lengths."
                      />
                      <TextField
                        label="Transitions"
                        value={sequence.transitions}
                        onChange={(value) =>
                          handleSequenceChange(sequence.id, "transitions", value)
                        }
                        placeholder="Match cut, whip pan, cross dissolve, etc."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-md shadow-zinc-200/40">
              <h2 className="text-lg font-semibold text-zinc-900">05. Cinematography & audio</h2>
              <div className="mt-5 grid gap-6 lg:grid-cols-2">
                <div className="flex flex-col gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-5 shadow-sm">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
                    Cinematography
                  </h3>
                  <TextField
                    label="Camera language"
                    value={state.cinematography.cameraLanguage}
                    onChange={(value) =>
                      handleUpdate("cinematography", {
                        ...state.cinematography,
                        cameraLanguage: value,
                      })
                    }
                    placeholder="Shot cadence, perspective, overall approach."
                  />
                  <TextField
                    label="Lensing"
                    value={state.cinematography.lensing}
                    onChange={(value) =>
                      handleUpdate("cinematography", {
                        ...state.cinematography,
                        lensing: value,
                      })
                    }
                    placeholder="Preferred focal lengths, anamorphic vs spherical, etc."
                  />
                  <TextField
                    label="Movement"
                    value={state.cinematography.movement}
                    onChange={(value) =>
                      handleUpdate("cinematography", {
                        ...state.cinematography,
                        movement: value,
                      })
                    }
                    placeholder="Steadicam, drone, slow pushes, etc."
                  />
                  <TextField
                    label="Lighting"
                    value={state.cinematography.lighting}
                    onChange={(value) =>
                      handleUpdate("cinematography", {
                        ...state.cinematography,
                        lighting: value,
                      })
                    }
                    placeholder="Lighting design, contrast, practicals."
                  />
                  <TextField
                    label="Color palette"
                    value={state.cinematography.colorPalette}
                    onChange={(value) =>
                      handleUpdate("cinematography", {
                        ...state.cinematography,
                        colorPalette: value,
                      })
                    }
                    placeholder="Color theory, LUT references, accents."
                  />
                  <TextField
                    label="VFX & enhancements"
                    value={state.cinematography.vfx}
                    onChange={(value) =>
                      handleUpdate("cinematography", {
                        ...state.cinematography,
                        vfx: value,
                      })
                    }
                    placeholder="HUD overlays, particles, simulations."
                  />
                </div>
                <div className="flex flex-col gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-5 shadow-sm">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
                    Audio & rhythm
                  </h3>
                  <TextField
                    label="Soundtrack direction"
                    value={state.audio.soundtrack}
                    onChange={(value) =>
                      handleUpdate("audio", {
                        ...state.audio,
                        soundtrack: value,
                      })
                    }
                    placeholder="Composer references, instrumentation."
                  />
                  <TextField
                    label="Rhythm & pacing"
                    value={state.audio.rhythm}
                    onChange={(value) =>
                      handleUpdate("audio", {
                        ...state.audio,
                        rhythm: value,
                      })
                    }
                    placeholder="Act structure of energy, beat mapping."
                  />
                  <TextField
                    label="Sound design palette"
                    value={state.audio.soundDesign}
                    onChange={(value) =>
                      handleUpdate("audio", {
                        ...state.audio,
                        soundDesign: value,
                      })
                    }
                    placeholder="UI, mechanical, environmental layers."
                  />
                  <TextField
                    label="Dialogue & voice"
                    value={state.audio.dialogue}
                    onChange={(value) =>
                      handleUpdate("audio", {
                        ...state.audio,
                        dialogue: value,
                      })
                    }
                    placeholder="Voiceover beats, character lines, taglines."
                  />
                  <TextField
                    label="Mixing notes"
                    value={state.audio.mixingNotes}
                    onChange={(value) =>
                      handleUpdate("audio", {
                        ...state.audio,
                        mixingNotes: value,
                      })
                    }
                    placeholder="Spatialization, clarity priorities, dynamics."
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-md shadow-zinc-200/40">
              <h2 className="text-lg font-semibold text-zinc-900">06. Continuity & directives</h2>
              <div className="mt-5 grid gap-6 lg:grid-cols-2">
                <div className="flex flex-col gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-5 shadow-sm">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
                    Continuity Control
                  </h3>
                  <TextField
                    label="Color continuity"
                    value={state.continuity.colorContinuity}
                    onChange={(value) =>
                      handleUpdate("continuity", {
                        ...state.continuity,
                        colorContinuity: value,
                      })
                    }
                    placeholder="Hero hues, brand gradients, lighting continuity."
                  />
                  <TextField
                    label="Props & set continuity"
                    value={state.continuity.propsContinuity}
                    onChange={(value) =>
                      handleUpdate("continuity", {
                        ...state.continuity,
                        propsContinuity: value,
                      })
                    }
                    placeholder="Recurring props, product placement, environmental details."
                  />
                  <TextField
                    label="Brand governance"
                    value={state.continuity.brandRules}
                    onChange={(value) =>
                      handleUpdate("continuity", {
                        ...state.continuity,
                        brandRules: value,
                      })
                    }
                    placeholder="Visual guardrails, values, tone boundaries."
                  />
                </div>
                <div className="flex flex-col gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-5 shadow-sm">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
                    Director&apos;s Notes
                  </h3>
                  <TextField
                    label="Must include"
                    value={state.directives.mustInclude}
                    onChange={(value) =>
                      handleUpdate("directives", {
                        ...state.directives,
                        mustInclude: value,
                      })
                    }
                    placeholder="Non-negotiable beats, shots, narrative essentials."
                  />
                  <TextField
                    label="Avoid"
                    value={state.directives.avoid}
                    onChange={(value) =>
                      handleUpdate("directives", {
                        ...state.directives,
                        avoid: value,
                      })
                    }
                    placeholder="Visual tropes or misalignments to exclude."
                  />
                  <TextField
                    label="Creative risks & experimentation"
                    value={state.directives.creativeRisks}
                    onChange={(value) =>
                      handleUpdate("directives", {
                        ...state.directives,
                        creativeRisks: value,
                      })
                    }
                    placeholder="Bold ideas worth pushing into Veo variants."
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-md shadow-zinc-200/40">
              <h2 className="text-lg font-semibold text-zinc-900">07. Delivery & metadata</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <TextField
                  label="Aspect ratio"
                  value={state.delivery.aspectRatio}
                  onChange={(value) =>
                    handleUpdate("delivery", {
                      ...state.delivery,
                      aspectRatio: value,
                    })
                  }
                  rows={2}
                />
                <TextField
                  label="Duration"
                  value={state.delivery.duration}
                  onChange={(value) =>
                    handleUpdate("delivery", {
                      ...state.delivery,
                      duration: value,
                    })
                  }
                  rows={2}
                />
                <TextField
                  label="Render format"
                  value={state.delivery.renderFormat}
                  onChange={(value) =>
                    handleUpdate("delivery", {
                      ...state.delivery,
                      renderFormat: value,
                    })
                  }
                  rows={2}
                />
                <TextField
                  label="Frame rate"
                  value={state.delivery.fps}
                  onChange={(value) =>
                    handleUpdate("delivery", {
                      ...state.delivery,
                      fps: value,
                    })
                  }
                  rows={2}
                />
                <TextField
                  label="Negative prompts"
                  value={state.delivery.negativePrompts}
                  onChange={(value) =>
                    handleUpdate("delivery", {
                      ...state.delivery,
                      negativePrompts: value,
                    })
                  }
                  placeholder="List anything Veo must avoid rendering."
                  rows={3}
                />
                <TextField
                  label="Director notes"
                  value={state.notes}
                  onChange={(value) => handleUpdate("notes", value)}
                  placeholder="Any overarching direction for the final render."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <aside className="sticky top-6 flex h-fit flex-col gap-4 rounded-3xl border border-zinc-200 bg-zinc-900 p-6 text-white shadow-xl shadow-zinc-900/30">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">Veo JSON blueprint</h2>
              <p className="text-sm text-zinc-300">
                Copy and feed directly into your Veo 3.1 generation request. All sections map to high-budget
                cinematography controls.
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
            >
              {isCopied ? "Copied ✓" : "Copy prompt JSON"}
            </button>
            <div className="relative h-full overflow-hidden rounded-2xl border border-zinc-800 bg-black/60 p-4 font-mono text-xs leading-relaxed text-zinc-200">
              <pre className="max-h-[70vh] overflow-auto">
                <code>{promptJson}</code>
              </pre>
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
