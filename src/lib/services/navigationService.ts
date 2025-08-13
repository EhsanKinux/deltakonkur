import { NavigateFunction } from "react-router-dom";

class NavigationService {
  private static instance: NavigationService;
  private navigateFunction: NavigateFunction | null = null;

  private constructor() {}

  public static getInstance(): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService();
    }
    return NavigationService.instance;
  }

  public setNavigateFunction(navigate: NavigateFunction) {
    this.navigateFunction = navigate;
  }

  public navigate(path: string, options?: { replace?: boolean; state?: any }) {
    if (this.navigateFunction) {
      this.navigateFunction(path, options);
    } else {
      // Fallback to window.location if navigate function is not available
      window.location.href = path;
    }
  }

  public navigateToLogin() {
    this.navigate("/auth/signIn", { replace: true });
  }

  public navigateToDashboard() {
    this.navigate("/dashboard", { replace: true });
  }

  public navigateToUnauthorized() {
    this.navigate("/unauthorized", { replace: true });
  }

  public goBack() {
    if (this.navigateFunction) {
      this.navigateFunction(-1);
    } else {
      window.history.back();
    }
  }

  public replace(path: string, state?: any) {
    this.navigate(path, { replace: true, state });
  }
}

export default NavigationService.getInstance();
