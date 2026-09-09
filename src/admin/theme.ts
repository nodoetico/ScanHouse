import type { CSSProperties } from 'react';
import type { AgencyBranding } from '../types/agency';

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(v => v / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function isLightBrand(hex: string): boolean {
  return luminance(hex) > 0.55;
}

export function panelTokens(branding: AgencyBranding): CSSProperties {
  const light = isLightBrand(branding.backgroundColor);
  const base = light ? '15,15,15' : '255,255,255';
  const rgba = (a: number) => `rgba(${base},${a})`;

  return {
    '--sh-bg': branding.backgroundColor,
    '--sh-sidebar': light ? 'rgba(255,255,255,0.82)' : 'rgba(0,0,0,0.6)',
    '--sh-header': light ? 'rgba(255,255,255,0.62)' : 'rgba(0,0,0,0.42)',
    '--sh-surface': rgba(0.035),
    '--sh-surface-2': rgba(0.06),
    '--sh-inset': rgba(0.09),
    '--sh-inset-2': rgba(0.15),
    '--sh-text': branding.textColor,
    '--sh-text-soft': rgba(light ? 0.75 : 0.78),
    '--sh-muted': rgba(light ? 0.52 : 0.5),
    '--sh-faint': rgba(light ? 0.36 : 0.32),
    '--sh-border': rgba(light ? 0.13 : 0.13),
    '--sh-border-soft': rgba(light ? 0.08 : 0.07),
    '--sh-border-strong': rgba(light ? 0.32 : 0.32),
    '--sh-primary': branding.primaryColor,
    '--sh-accent': branding.accentColor,
    '--sh-on-primary': isLightBrand(branding.primaryColor) ? '#0a0a0a' : '#ffffff',
  } as CSSProperties;
}