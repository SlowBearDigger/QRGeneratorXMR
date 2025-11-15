export type ShapeType = 'square' | 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'extra-rounded';
export type CornerType = 'square' | 'dot' | 'extra-rounded';
export type GradientType = 'linear' | 'radial';
export type CryptoType = 'monero' | 'bitcoin' | 'ethereum';

export interface Preset {
  name: string;
  options: {
    color: string;
    useGradient: boolean;
    gradientColor: string;
    gradientType: GradientType;
    backgroundColor: string;
    shape: ShapeType;
    cornerType: CornerType;
  };
  randomColors?: string[];
}