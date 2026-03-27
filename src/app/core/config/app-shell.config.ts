export interface NavigationItem {
  label: string;
  path: string;
}

export interface AppShellConfig {
  brand: string;
  tagline: string;
  navigation: NavigationItem[];
  footerNote: string;
}

export const APP_SHELL_CONFIG: AppShellConfig = {
  brand: 'Catalogo arcade',
  tagline: 'Base modular para minijuegos en Angular y HTML Canvas.',
  navigation: [
    {
      label: 'Catalogo',
      path: '/catalog'
    }
  ],
  footerNote: 'Cada juego se integra como una feature aislada, con codigo y assets propios.'
};
