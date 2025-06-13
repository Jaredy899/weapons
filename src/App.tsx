import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { ThemeToggle } from './components/theme-toggle'
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react'
import HomePage from './pages/HomePage'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background font-sans antialiased">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center">
              <a className="mr-6 flex items-center space-x-2" href="/">
                <span className="font-bold">Gun Inventory</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal" />
              </SignedOut>
            </div>
          </div>
        </header>
        <main className="container py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-in/*" element={<div>Sign In Page</div>} />
            <Route path="/sign-up/*" element={<div>Sign Up Page</div>} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App 