
import * as React from "react"

const MOBILE_BREAKPOINT = 768

interface MobileState {
  isMobile: boolean
  isLandscape: boolean
}

export function useIsMobile() {
  const [state, setState] = React.useState<MobileState>({
    isMobile: false,
    isLandscape: false
  })

  React.useEffect(() => {
    const checkOrientation = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setState({
        isMobile: width < MOBILE_BREAKPOINT,
        isLandscape: width > height
      })
    }
    
    // Initial check
    checkOrientation()
    
    // Event listeners
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener("change", checkOrientation)
    
    // Detect orientation changes
    window.addEventListener("resize", checkOrientation)
    window.addEventListener("orientationchange", checkOrientation)
    
    return () => {
      mql.removeEventListener("change", checkOrientation)
      window.removeEventListener("resize", checkOrientation)
      window.removeEventListener("orientationchange", checkOrientation)
    }
  }, [])

  return state.isMobile
}

// Add this alias for backward compatibility
export const useMobile = useIsMobile;
