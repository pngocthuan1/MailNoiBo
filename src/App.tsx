import { RouterProvider } from "react-router-dom"
import { router } from "@/app/routes"
import { UIProvider } from "@/shared/state/UIProvider"
import { SnackbarProvider } from "@/shared/ui/Snackbar"

export default function App() {
  return (
    <UIProvider>
      <SnackbarProvider>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </UIProvider>
  )
}
