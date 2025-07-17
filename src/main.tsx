import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// ✅ PWA Service Worker 등록
import { registerSW } from 'virtual:pwa-register'

// Service Worker 등록 (자동 업데이트)
registerSW({
  onNeedRefresh() {
    console.log('새 버전이 있습니다. 페이지를 새로고침하세요.')
  },
  onOfflineReady() {
    console.log('앱이 오프라인에서도 준비되었습니다.')
  }
})


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
