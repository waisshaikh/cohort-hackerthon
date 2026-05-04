import { RouterProvider } from "react-router-dom"
import { router } from "./app.routes"
import { AuthProvider } from "../features/auth/AuthContext"
import { ThemeProvider } from "../Context/ThemeContext"

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
      <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
