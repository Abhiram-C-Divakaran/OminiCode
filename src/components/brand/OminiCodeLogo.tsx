import type { CSSProperties } from 'react';
import { PRODUCT } from '../../config/product';
import OminiCodeMark from './OminiCodeMark';

type Props = { size?: number; className?: string; style?: CSSProperties };

export default function OminiCodeLogo({ size = 32, className = '', style }: Props) {
  return (
    <span className={`ominicode-logo ${className}`} style={style} role="img" aria-label={PRODUCT.name}>
      <OminiCodeMark size={size} className="ominicode-logo__mark" />
      <span aria-hidden="true">Omini<span className="ominicode-logo__code">Code</span></span>
    </span>
  );
}
