import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from './components/ui/provider.tsx'
import { Toaster } from './components/ui/toaster.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // data stays fresh for 5 minutes
      retry: 2,                   // retry failed requests twice
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
)
