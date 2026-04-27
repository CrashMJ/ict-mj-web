import {Suspense, useEffect} from 'react'
import {Outlet} from 'react-router-dom'
import {I18nProvider} from '../_metronic/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from '../_metronic/layout/core'
import {MasterInit} from '../_metronic/layout/MasterInit'
import CountdownTimer from './modules/widgets/components/CountdownTimer'
import {AuthInit} from './modules/auth'

const WatermarkOverlay = () => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(255, 255, 255, 0.01)', // Invisible overlay
      zIndex: 9999,
      pointerEvents: 'none', // Doesn't block interaction
      userSelect: 'none',
    }}
  />
)

const App = () => {
  useEffect(() => {
    const disableContextMenu = (event: any) => {
      event.preventDefault()
    }

    const disableKeys = (event: any) => {
      if (
        event.key === 'F12' || // Disable F12
        (event.ctrlKey && event.shiftKey && event.key === 'I') || // Ctrl+Shift+I
        (event.ctrlKey && event.shiftKey && event.key === 'J') || // Ctrl+Shift+J
        (event.ctrlKey && event.key === 'U') // Ctrl+U
      ) {
        event.preventDefault()
      }
    }

    document.addEventListener('contextmenu', disableContextMenu)
    document.addEventListener('keydown', disableKeys)

    return () => {
      document.removeEventListener('contextmenu', disableContextMenu)
      document.removeEventListener('keydown', disableKeys)
    }
  }, [])
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <I18nProvider>
        <LayoutProvider>
          <AuthInit>
            <Outlet />
            <MasterInit />
            <CountdownTimer />
          </AuthInit>
        </LayoutProvider>
      </I18nProvider>
    </Suspense>
  )
}

export {App}
