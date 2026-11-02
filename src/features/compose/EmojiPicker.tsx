import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { Popover } from "@/shared/ui/Popover"
import { Smile } from "lucide-react"

const CATEGORIES: { label: string emojis: string[] }[] = [
  {
    label: "😀 Cảm xúc",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "🤣",
      "😂",
      "🙂",
      "🙃",
      "😉",
      "😊",
      "😇",
      "🥰",
      "😍",
      "🤩",
      "😘",
      "😗",
      "😚",
      "😙",
      "😋",
      "😛",
      "😜",
      "🤪",
      "😝",
      "🤑",
      "🤗",
      "🤭",
      "🤫",
      "🤔",
      "🤐",
      "🤨",
      "😐",
      "😑",
      "😶",
      "😏",
      "😒",
      "🙄",
      "😬",
      "🤥",
      "😌",
      "😔",
      "😪",
      "🤤",
      "😴",
      "😷",
      "🤒",
      "🤕",
      "🤧",
      "🥵",
      "🥶",
      "🥴",
      "😵",
      "🤯",
      "🤠",
      "🥳",
      "😎",
      "🤓",
      "🧐",
      "😕",
      "😟",
      "🙁",
      "☹️",
      "😮",
      "😯",
      "😲",
      "😳",
      "🥺",
      "😦",
      "😧",
      "😨",
      "😰",
      "😥",
      "😢",
      "😭",
      "😱",
      "😖",
      "😣",
      "😞",
      "😓",
      "😩",
      "😫",
      "🥱",
    ],
  },
  {
    label: "👍 Cử chỉ",
    emojis: [
      "👍",
      "👎",
      "👌",
      "🤌",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "🖕",
      "👇",
      "☝️",
      "👋",
      "🤚",
      "🖐️",
      "✋",
      "🖖",
      "👏",
      "🙌",
      "🤲",
      "🤝",
      "🙏",
      "✍️",
      "💪",
      "🦾",
      "🦿",
      "🦵",
      "🦶",
      "👂",
      "🦻",
      "👃",
      "🧠",
      "👀",
      "👁️",
      "👅",
      "🦷",
      "👄",
    ],
  },
  {
    label: "❤️ Trái tim",
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❣️",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "💟",
      "☮️",
      "✝️",
      "☪️",
      "🕉️",
      "✡️",
      "🔯",
      "🕎",
      "☯️",
      "☦️",
      "⭐",
      "🌟",
      "💫",
      "✨",
      "🔥",
      "💥",
      "❄️",
      "🌈",
      "☁️",
      "⛅",
      "🌤️",
      "🌥️",
    ],
  },
  {
    label: "🐶 Động vật",
    emojis: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐮",
      "🐷",
      "🐸",
      "🐵",
      "🙈",
      "🙉",
      "🙊",
      "🐔",
      "🐧",
      "🐦",
      "🦆",
      "🦅",
      "🦉",
      "🦇",
      "🐺",
      "🐗",
      "🐴",
      "🦄",
      "🐝",
      "🐛",
      "🦋",
      "🐌",
      "🐞",
      "🐜",
    ],
  },
  {
    label: "🍎 Đồ ăn",
    emojis: [
      "🍎",
      "🍊",
      "🍋",
      "🍇",
      "🍓",
      "🫐",
      "🍈",
      "🍑",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
      "🍅",
      "🥑",
      "🍆",
      "🥦",
      "🌽",
      "🌶️",
      "🥗",
      "🍜",
      "🍣",
      "🍔",
      "🍕",
      "🌮",
      "🍦",
      "🎂",
      "🍰",
      "🧁",
      "🍩",
      "🍫",
      "☕",
      "🍵",
      "🧃",
      "🥤",
    ],
  },
  {
    label: "🌍 Địa điểm",
    emojis: [
      "🌍",
      "🌎",
      "🌏",
      "🗺️",
      "🧭",
      "🏔️",
      "🌋",
      "🏕️",
      "🏖️",
      "🏜️",
      "🏝️",
      "🌅",
      "🌄",
      "🌠",
      "🎇",
      "🎆",
      "🌃",
      "🌆",
      "🌇",
      "🌉",
      "🌁",
      "🏠",
      "🏡",
      "🏢",
      "🏣",
      "🏤",
      "🏥",
      "🏦",
      "🏧",
      "🏨",
      "🏩",
      "🏪",
      "🏫",
      "🏬",
      "🏭",
      "🗼",
      "🗽",
    ],
  },
  {
    label: "⚽ Thể thao",
    emojis: [
      "⚽",
      "🏀",
      "🏈",
      "⚾",
      "🥎",
      "🎾",
      "🏐",
      "🏉",
      "🥏",
      "🎱",
      "🎿",
      "🏒",
      "🏓",
      "🏸",
      "🥊",
      "🥋",
      "🎯",
      "🤿",
      "🧗",
      "🏋️",
      "🤸",
      "⛹️",
      "🤺",
      "🏇",
      "🧘",
      "🏊",
      "🏄",
      "🧜",
      "🚴",
      "🚵",
    ],
  },
  {
    label: "🎵 Hoạt động",
    emojis: [
      "🎵",
      "🎶",
      "🎼",
      "🎤",
      "🎧",
      "🎷",
      "🎸",
      "🎹",
      "🎺",
      "🎻",
      "🪕",
      "🥁",
      "🎬",
      "📺",
      "📻",
      "🎮",
      "🕹️",
      "🎲",
      "🎯",
      "🎳",
      "🎰",
      "🧩",
      "🪆",
      "🪅",
      "🎭",
      "🎨",
      "🎪",
      "🎢",
      "🎡",
      "🎠",
    ],
  },
]

const RECENT_KEY = "emoji-recent"
const MAX_RECENT = 20

function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]")
  } catch {
    return []
  }
}

function saveRecent(emoji: string) {
  const prev = loadRecent().filter((e) => e !== emoji)
  const next = [emoji, ...prev].slice(0, MAX_RECENT)
  localStorage.setItem(RECENT_KEY, JSON.stringify(next))
}

type Props = { onInsert: (emoji: string) => void }

/** Bảng chọn emoji (SO-11) */
export function EmojiPicker({ onInsert }: Props) {
  const [query, setQuery] = useState("")
  const [catIdx, setCatIdx] = useState(0)
  const [recent, setRecent] = useState<string[]>(loadRecent)
  const inputRef = useRef<HTMLInputElement>(null)

  const allEmojis = CATEGORIES.flatMap((c) => c.emojis)
  const filtered = query
    ? allEmojis.filter((e) => {
        // Simple search by category label
        const cat = CATEGORIES.find((c) => c.emojis.includes(e))
        return (
          cat?.label.toLowerCase().includes(query.toLowerCase()) ||
          e.includes(query)
        )
      })
    : null

  const handleInsert = (emoji: string, close: () => void) => {
    onInsert(emoji)
    saveRecent(emoji)
    setRecent(loadRecent())
    close()
  }

  return (
    <Popover
      align="left"
      up
      className="w-80 overflow-hidden p-0"
      trigger={({ toggle }) => (
        <button
          type="button"
          title="Chèn emoji"
          aria-label="Chèn emoji"
          onClick={toggle}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-hover"
        >
          <Smile size={17} />
        </button>
      )}
    >
      {(close) => (
        <div className="flex h-80 flex-col">
          {/* Search */}
          <div className="border-b border-line p-2">
            <div className="flex items-center gap-2 rounded border border-line bg-surface px-2">
              <Search size={14} className="text-muted" />
              <input
                ref={inputRef}
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm emoji..."
                className="h-8 flex-1 bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          {/* Category tabs */}
          {!query && (
            <div className="flex overflow-x-auto border-b border-line">
              {CATEGORIES.map((cat, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCatIdx(i)}
                  className={`shrink-0 px-2 py-1.5 text-base hover:bg-hover ${
                    catIdx === i ? "border-b-2 border-accent" : ""
                  }`}
                  title={cat.label}
                >
                  {cat.emojis[0]}
                </button>
              ))}
            </div>
          )}

          {/* Emoji grid */}
          <div className="flex-1 overflow-y-auto p-2">
            {query ? (
              <>
                {filtered && filtered.length > 0 ? (
                  <div className="grid grid-cols-8 gap-0.5">
                    {filtered.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => handleInsert(e, close)}
                        className="h-9 w-9 cursor-pointer rounded text-xl hover:bg-hover"
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm text-muted">
                    Không tìm thấy emoji
                  </p>
                )}
              </>
            ) : (
              <>
                {recent.length > 0 && (
                  <div className="mb-2">
                    <p className="mb-1 text-xs font-semibold text-muted">
                      Gần đây
                    </p>
                    <div className="grid grid-cols-8 gap-0.5">
                      {recent.map((e) => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => handleInsert(e, close)}
                          className="h-9 w-9 cursor-pointer rounded text-xl hover:bg-hover"
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <p className="mb-1 text-xs font-semibold text-muted">
                  {CATEGORIES[catIdx].label}
                </p>
                <div className="grid grid-cols-8 gap-0.5">
                  {CATEGORIES[catIdx].emojis.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => handleInsert(e, close)}
                      className="h-9 w-9 cursor-pointer rounded text-xl hover:bg-hover"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Popover>
  )
}
