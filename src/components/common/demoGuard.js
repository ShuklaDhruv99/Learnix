export function demoGuard(isDemoMode, setDemoNotice) {
    if (isDemoMode) {
      setDemoNotice("This action isn't available in the demo — sign up to save your progress!")
      throw { status: 403, data: { error: 'Demo mode: sign up to unlock this.' }, demoBlocked: true }
    }
  }