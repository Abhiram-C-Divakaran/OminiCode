import { useId,type SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & { size?: number; title?: string };

/** Circular slash mark. Per-instance IDs avoid SVG collisions in repeated logos. */
export default function OminiCodeMark({ size = 32, title, ...props }: Props) {
  const id = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} {...props}>
      <defs>
        <linearGradient id={id} x1="3" y1="7" x2="37" y2="33" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-primary, #7C3AED)" />
          <stop offset=".5" stopColor="var(--color-primary-indigo, #4F46E5)" />
          <stop offset="1" stopColor="var(--color-accent, #3B82F6)" />
        </linearGradient>
      </defs>
      <path d="M22 4A16 16 0 0 0 7 30M28 7A16 16 0 0 1 18 36" stroke={`url(#${id})`} strokeWidth="6" />
      <path d="M27 3 8 37h8L35 3z" fill={`url(#${id})`} />
    </svg>
  );
}
