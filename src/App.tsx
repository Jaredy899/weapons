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
          <div className="container mx-auto flex h-14 items-center justify-between">
            <div className="flex items-center">
              <a className="mr-6 flex items-center space-x-2" href="/">
                <span className="font-bold">Gun Inventory</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal" />
              </SignedOut>
            </div>
          </div>
        </header>
        <main className="container mx-auto py-6">
          <SignedIn>
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </SignedIn>
          <SignedOut>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Welcome to Gun Inventory</h1>
                <p className="text-muted-foreground max-w-md">
                  Please sign in to access your firearm inventory and manage your collection.
                </p>
              </div>
              <SignInButton mode="modal">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                  Sign In to Continue
                </button>
              </SignInButton>
            </div>
          </SignedOut>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App 