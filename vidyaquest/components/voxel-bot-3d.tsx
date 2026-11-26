"use client"

import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { VoxelMascot3D, type MascotPhase } from "@/components/voxel-mascot-3d"

interface ChatMsg {
  sender: "bot" | "student"
  text: string
}

export function FloatingVoxelChatbot({ studentName }: { studentName: string }) {
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<MascotPhase>("idle")
  const [input, setInput] = useState("")
  const id = useId()
  const launcher = useRef<HTMLButtonElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const transcript = useRef<HTMLDivElement>(null)
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const thinking = phase === "thinking"
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      sender: "bot",
      text: `Hey ${studentName}! I'm QuestBot 3D. Drag me to spin me around, or ask me for a hint on your labs and quests!`,
    },
  ])

  useEffect(() => {
    return () => {
      if (replyTimer.current !== null) clearTimeout(replyTimer.current)
    }
  }, [])

  useEffect(() => {
    if (open) closeButton.current?.focus()
  }, [open])

  useEffect(() => {
    if (phase !== "reply") return
    const settle = setTimeout(() => setPhase("idle"), 600)
    return () => clearTimeout(settle)
  }, [phase])

  useEffect(() => {
    const element = transcript.current
    if (element) element.scrollTop = element.scrollHeight
  }, [messages, open])

  function close() {
    setOpen(false)
    launcher.current?.focus()
  }

  function getBotReply(query: string): string {
    const q = query.toLowerCase()
    if (q.includes("circuit") || q.includes("bulb") || q.includes("ohm")) {
      return "In Simple Circuits, current flows when the loop is closed. Try raising the battery voltage in Virtual Labs to see I = V / R in action!"
    }
    if (
      q.includes("olympiad") ||
      q.includes("hackathon") ||
      q.includes("scholarship")
    ) {
      return "Check your Opportunities tab! You're eligible for the National Junior Science Olympiad (due Dec 18) and the Merit Curiosity Scholarship."
    }
    if (q.includes("xp") || q.includes("task") || q.includes("quest")) {
      return "You have 8.966 points! Finishing the Smart Lamp Prototype in your Task List will boost your Innovation City progress."
    }
    return "Great curiosity! Break the problem into smaller steps: what variable are we changing, and what do you expect to observe?"
  }

  function sendPrompt(text: string) {
    const trimmed = text.trim()
    if (!trimmed || replyTimer.current !== null) return
    setMessages((prev) => [...prev, { sender: "student", text: trimmed }])
    setInput("")
    setPhase("thinking")

    replyTimer.current = setTimeout(() => {
      replyTimer.current = null
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: getBotReply(trimmed) },
      ])
      setPhase("reply")
    }, 550)
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    sendPrompt(input)
  }

  return (
    <div className="fixed [right:max(1rem,env(safe-area-inset-right))] [bottom:max(1rem,env(safe-area-inset-bottom))] z-50 flex flex-col items-end gap-3">
      {open && (
        <section
          id={id}
          aria-labelledby={`${id}-title`}
          onKeyDown={(event) => {
            if (event.key === "Escape") close()
          }}
          className="w-[min(370px,calc(100vw_-_2rem))] overflow-hidden rounded-3xl border border-orange-200 bg-[color:var(--vq-surface)] shadow-[0_24px_60px_rgba(23,45,74,0.22)]"
        >
          {/* Header with Interactive 3D Mascot */}
          <div className="flex items-center justify-between border-b border-[color:light-dark(#fff,var(--vq-border))]/70 bg-gradient-to-r from-[color:light-dark(#fff7ed,var(--vq-tone-amber))]/90 via-[color:light-dark(#ffedd5,var(--vq-tone-amber))]/80 to-[color:light-dark(#fef3c7,var(--vq-tone-amber))]/80 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <VoxelMascot3D scale={0.68} phase={phase} />
              <div>
                <h2
                  id={`${id}-title`}
                  className="text-sm font-extrabold text-[color:light-dark(#172d4a,var(--vq-ink))]"
                >
                  QuestBot 3D
                </h2>
                <p
                  role="status"
                  className="text-[11px] font-medium text-[color:light-dark(#9a3412,var(--vq-accent-amber))]"
                >
                  {thinking ? "Thinking…" : "Drag or tap QuestBot to turn it"}
                </p>
              </div>
            </div>
            <button
              type="button"
              ref={closeButton}
              onClick={close}
              aria-label="Close 3D chatbot"
              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full bg-[color:var(--vq-surface)]/80 text-xs font-bold text-[color:var(--vq-muted)] hover:bg-[color:var(--vq-surface)]"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            ref={transcript}
            role="log"
            aria-label="QuestBot conversation"
            className="max-h-[min(16rem,40dvh)] space-y-2.5 overflow-y-auto p-4"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "student" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed wrap-anywhere ${
                    msg.sender === "student"
                      ? "bg-[#111827] text-white"
                      : "border border-[color:light-dark(#fff,var(--vq-border))]/90 bg-[color:var(--vq-surface)]/90 text-[color:light-dark(#172d4a,var(--vq-ink))] shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Chips */}
          <div className="flex flex-wrap gap-1.5 px-4 pb-2">
            {["Help with Circuits", "My XP & Quests", "Find Olympiads"].map(
              (chip) => (
                <button
                  key={chip}
                  type="button"
                  disabled={thinking}
                  onClick={() => sendPrompt(chip)}
                  className="cursor-pointer rounded-full border border-orange-200 bg-[color:light-dark(var(--color-orange-50),var(--vq-tone-amber))] px-2.5 py-1 text-[10px] font-semibold text-[color:light-dark(#9a3412,var(--vq-accent-amber))] hover:bg-[color:light-dark(var(--color-orange-100),var(--vq-tone-amber))] disabled:opacity-60"
                >
                  {chip}
                </button>
              )
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-[color:light-dark(#fff,var(--vq-border))]/70 bg-[color:var(--vq-surface)]/60 p-3"
          >
            <input
              type="text"
              name="questbot-question"
              aria-label="Question for QuestBot"
              autoComplete="off"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask QuestBot 3D…"
              className="min-w-0 flex-1 rounded-xl border border-[color:light-dark(var(--color-slate-200),var(--vq-border))] bg-[color:var(--vq-surface)] px-3 py-2 text-xs text-[color:light-dark(#172d4a,var(--vq-ink))] placeholder:text-[color:var(--vq-muted)]"
            />
            <button
              type="submit"
              disabled={thinking || !input.trim()}
              className="cursor-pointer rounded-xl bg-orange-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-orange-800 disabled:opacity-60"
            >
              Ask
            </button>
          </form>
        </section>
      )}

      {/* Floating 3D Mascot Launcher */}
      <button
        type="button"
        ref={launcher}
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label={open ? "Minimize QuestBot 3D" : "Open QuestBot 3D"}
        className="cursor-pointer rounded-xl border-0 bg-transparent p-0"
      >
        <VoxelMascot3D scale={0.74} phase={phase} interactive={false} />
      </button>
    </div>
  )
}
