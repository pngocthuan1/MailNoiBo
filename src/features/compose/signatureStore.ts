import { create } from "zustand"

export type Signature = {
  id: string
  name: string
  /** HTML content of the signature */
  html: string
}

type SignatureState = {
  signatures: Signature[]
  /** ID chữ ký mặc định cho thư mới */
  defaultNewId: string | null
  /** ID chữ ký mặc định cho trả lời/chuyển tiếp */
  defaultReplyId: string | null
}

const LOGO_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline;vertical-align:middle;margin-right:4px"><rect width="24" height="24" rx="4" fill="#1a73e8"/><text x="12" y="17" text-anchor="middle" font-size="14" font-weight="bold" fill="white" font-family="Arial">H</text></svg>`

const MOCK_SIGNATURES: Signature[] = [
  {
    id: "sig-main",
    name: "Chữ ký chính",
    html: `<div><br/></div><div>--</div><div>${LOGO_SVG}<strong>Lê Hoàng Dũng</strong></div><div>Trưởng phòng Công nghệ thông tin</div><div><a href="https://hoanglong.vn">Hoàng Long Group</a> | <a href="tel:0987345678">0987 345 678</a></div>`,
  },
  {
    id: "sig-short",
    name: "Chữ ký ngắn",
    html: `<div><br/></div><div>--</div><div><strong>Lê Hoàng Dũng</strong> · CNTT · <a href="tel:0987345678">0987 345 678</a></div>`,
  },
  {
    id: "sig-en",
    name: "Chữ ký tiếng Anh",
    html: `<div><br/></div><div>--</div><div>${LOGO_SVG}<strong>Le Hoang Dung</strong></div><div>Head of Information Technology</div><div><a href="https://hoanglong.vn">Hoang Long Group</a> | <a href="mailto:dung.le@hoanglong.vn">dung.le@hoanglong.vn</a></div>`,
  },
]

export const useSignatureStore = create<SignatureState>(() => ({
  signatures: MOCK_SIGNATURES,
  defaultNewId: "sig-main",
  defaultReplyId: "sig-short",
}))

export function getDefaultSignatureHtml(mode: "new" | "reply"): string {
  const state = useSignatureStore.getState()
  const id = mode === "new" ? state.defaultNewId : state.defaultReplyId
  if (!id) return ""
  return state.signatures.find((s) => s.id === id)?.html ?? ""
}

export function addSignature(sig: Omit<Signature, "id">): Signature {
  const newSig: Signature = { ...sig, id: `sig-${Date.now()}` }
  useSignatureStore.setState((s) => ({ signatures: [...s.signatures, newSig] }))
  return newSig
}

export function updateSignature(
  id: string,
  patch: Partial<Omit<Signature, "id">>,
) {
  useSignatureStore.setState((s) => ({
    signatures: s.signatures.map((sig) =>
      sig.id === id ? { ...sig, ...patch } : sig,
    ),
  }))
}

export function deleteSignature(id: string) {
  useSignatureStore.setState((s) => ({
    signatures: s.signatures.filter((sig) => sig.id !== id),
    defaultNewId: s.defaultNewId === id ? null : s.defaultNewId,
    defaultReplyId: s.defaultReplyId === id ? null : s.defaultReplyId,
  }))
}

export function setSignatureDefaults(
  newId: string | null,
  replyId: string | null,
) {
  useSignatureStore.setState({ defaultNewId: newId, defaultReplyId: replyId })
}
