import { Provider } from "react-redux"
import { RouterProvider } from "react-router-dom"
import { router } from "./app/routes"
import { store } from "./app/store"
import "./App.css"

export function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App
