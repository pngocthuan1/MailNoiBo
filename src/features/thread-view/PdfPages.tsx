import { useRef, useState } from "react"

type Props = { name: string pages: number zoom: number }

const lines = [
  "CÔNG TY CỔ PHẦN HOÀNG LONG GROUP",
  "Tài liệu nội bộ - bản xem trước mô phỏng",
  "Nội dung trang này được tạo tự động để minh họa trình xem PDF. Trình xem hỗ trợ cuộn theo từng trang, phóng to và thu nhỏ.",
  "Điều khoản thanh toán: thanh toán 50% khi ký, 50% còn lại trong vòng 15 ngày sau nghiệm thu.",
  "Thời hạn hiệu lực: 12 tháng kể từ ngày ký, tự động gia hạn nếu hai bên không có thông báo khác.",
]

/** Các trang PDF xếp dọc, cuộn theo trang. */
export function PdfPages({ name, pages, zoom }: Props) {
  const [current, setCurrent] = useState(1)
  const box = useRef<HTMLDivElement>(null)
  const pageWidth = 595 * zoom
  const pageHeight = 842 * zoom

  return (
    <div className="relative h-full w-full">
      <div
        ref={box}
        className="h-full overflow-auto py-6"
        onScroll={(e) =>
          setCurrent(
            Math.min(
              pages,
              Math.floor(
                (e.currentTarget.scrollTop + 120) / (pageHeight + 24),
              ) + 1,
            ),
          )
        }
      >
        {Array.from({ length: pages }, (_, i) => (
          <div
            key={i}
            className="mx-auto mb-6 overflow-hidden bg-white p-[8%] text-[#1f2430] shadow-xl"
            style={{
              width: pageWidth,
              height: pageHeight,
              fontSize: 13 * zoom,
            }}
            aria-label={`Trang ${i + 1}`}
          >
            <p className="font-bold">
              {i === 0 ? name : `${name} - trang ${i + 1}`}
            </p>
            {lines.map((l, k) => (
              <p key={k} className="mt-3">
                {l}
              </p>
            ))}
            {Array.from({ length: 10 }, (_, k) => (
              <div
                key={k}
                className="mt-3 h-2 rounded bg-[#e6e9ef]"
                style={{ width: `${95 - ((k * 13) % 40)}%` }}
              />
            ))}
          </div>
        ))}
      </div>
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
        Trang {current} / {pages}
      </span>
    </div>
  )
}
