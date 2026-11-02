# figma-make-app

React + Vite + Tailwind CSS project running inside Figma Make.

## Development Server

A Vite development server is **already running** on `$PORT` (default 8443). You don't need to start it manually.

- Preview URL: The user can access the running app through the preview panel
- Hot reload: Changes to source files are reflected immediately

## Project Structure

This is the canonical project structure. Start with task-relevant files below. Only follow imports or inspect other files when required, when a documented path is missing, or when the repository contradicts this guide.

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Primary application component and the usual starting point for UI work
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`
- `package.json` - Project dependencies and the Vite build, development, preview, and formatting scripts
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4, and Figma Make plugins plus the `@` alias for `src`
- `.mise.toml` - Toolchain versions for Node.js and pnpm

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`
- Formatting: oxfmt

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `vite.config.ts`. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/index.css`. This scaffold does not need a Tailwind config file or PostCSS config.

`src/main.tsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.

Tailwind emits utility classes in `@layer utilities`, and CSS outside any cascade layer overrides every layer regardless of specificity. Put global element styles, such as resets and defaults for `body`, headings, `button`, or `input`, inside `@layer base { ... }` so utility classes on those elements still apply. Tailwind's Preflight already applies `box-sizing: border-box`, removes default margins, and sets `font: inherit` on form controls, so do not repeat those rules.


# Mail nội bộ - Web (React)

Ứng dụng mail nội bộ công ty (kiểu Gmail), giao diện web React. Mã nguồn khởi tạo từ Figma Make, từ đây phát triển tiếp bằng Antigravity. Dữ liệu là mock, chưa có backend.

## Chạy dự án

- Cài: `pnpm install`. Chạy thử: `pnpm dev` (cổng 8443). Kiểm tra: `pnpm exec tsc --noEmit` và `pnpm build`.
- `vite.config.ts` có plugin của Figma Make. Nếu plugin này làm app không chạy hoặc không build được, hãy gỡ nó ra và báo lại.

## Cấu trúc dự án

- `src/main.tsx`, `src/App.tsx`, `src/index.css`: điểm vào và CSS toàn cục (Tailwind v4).
- `src/layouts`: AppShell, SettingsLayout, AdminLayout, AuthLayout.
- `src/features/<nhóm>`: mailbox, thread, compose, search, labels, filters, contacts, settings, notifications, security, admin, auth.
- `src/shared`: components dùng chung, hooks, state (`mailStore.ts`), types, mock data.
- Cấu trúc có thể nhiều hơn mô tả này; khi mâu thuẫn, tin vào mã thật.
- `index.html`, `package.json`, `vite.config.ts` (alias `@` trỏ vào `src`), `.mise.toml` (phiên bản Node, pnpm).

## Dependencies

- Runtime: React 19, React DOM 19, react-router-dom 7, zustand, dompurify, lucide-react.
- Styling: Tailwind CSS v4 qua plugin `@tailwindcss/vite`.
- Build: Vite 8, TypeScript 5.9, `@vitejs/plugin-react`. Định dạng: oxfmt.

## Styling

Dùng Tailwind CSS v4 qua `@tailwindcss/vite` (đã cấu hình trong `vite.config.ts`). `src/index.css` nạp Tailwind bằng `@import 'tailwindcss';`. Dùng class tiện ích trực tiếp trong JSX; CSS toàn cục và tùy biến theme Tailwind v4 đặt trong `src/index.css`. Không cần tệp cấu hình Tailwind hay PostCSS.

Các `@import` CSS đặt trước; sau đó mới đến `@font-face` và font mặc định. CSS nằm ngoài mọi cascade layer sẽ đè lên mọi layer, nên style toàn cục cho phần tử (`body`, tiêu đề, `button`, `input`) phải đặt trong `@layer base { ... }` để class tiện ích vẫn có tác dụng. Preflight của Tailwind đã đặt `box-sizing: border-box`, bỏ margin mặc định và `font: inherit` cho form, đừng lặp lại.

## Quy ước dự án

- Mọi chữ trên giao diện bằng tiếng Việt.
- Đặc tả nằm ở `docs/spec-giao-dien-web.md`, bảng chức năng ở `docs/bang-chuc-nang.md`. Mỗi tính năng có mã (ví dụ SO-07). Mọi mã được giao phải dùng được thật trên giao diện, không báo xong khi mới có khung giữ chỗ.
- Tiến độ nằm ở `docs/tien-do.md`; đọc nó trước, không làm lại phần đã xong, và cập nhật nó sau mỗi lượt.
- Mọi trạng thái mail (thư, nhãn, đã đọc, nháp, đã lên lịch...) nằm trong kho dùng chung `src/shared/state/mailStore.ts`; thao tác gọi qua `useMailActions`, không giữ trạng thái riêng ở từng trang.
- Không gọi chéo giữa các feature; dùng chung thì chuyển vào `src/shared`.
- Màu và cỡ chữ lấy từ biến CSS đã có, hỗ trợ sáng và tối.
- Sau mỗi thay đổi: chạy `tsc` và build, rồi chạy app và tự thử các luồng đã làm. Không sửa trang không được nhắc tới.
- Cuối mỗi lượt: liệt kê từng mã tính năng và nơi nó xuất hiện, nêu rõ mã nào chưa làm.