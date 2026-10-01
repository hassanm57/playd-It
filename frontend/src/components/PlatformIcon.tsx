interface PlatformIconProps {
  platform: string;
  className?: string;
  size?: number;
}

export default function PlatformIcon({ platform, className = 'w-3.5 h-3.5', size }: PlatformIconProps) {
  const p = platform.toLowerCase();
  const style = size ? { width: size, height: size } : undefined;

  // 1. PlayStation (PS5, PS4, PS3, PS Vita, etc.)
  if (p.includes('playstation') || p.includes('ps5') || p.includes('ps4') || p.includes('ps3') || p.includes('ps2') || p.includes('ps vita') || p.includes('psp')) {
    return (
      <svg
        style={style}
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-label={platform}
      >
        <title>{platform}</title>
        <path d="M8.582 16.035c-2.457-.692-4.072-1.92-4.072-3.322 0-2.185 3.916-3.957 8.747-3.957 3.52 0 6.552.946 7.893 2.33-.42-.26-.88-.47-1.37-.62-1.57-.49-3.79-.76-6.26-.76-4.52 0-8.18 1.44-8.18 3.22 0 1.25 1.81 2.34 4.54 2.87l-.01.07.712.169zm4.238-14.035c-.47 0-.91.07-1.32.2-2.1.66-2.58 2.54-2.58 5.75v5.86l3.9-1.22V3.79c0-1.28.33-1.63 1.13-1.74.8-.11 1.48.24 1.48 1.52v4.44l2.76-.87V3.53c0-1.07-.63-1.53-1.7-1.53h-3.67zm-.38 12.87l-2.91.91v2.32c0 1.05.51 1.59 1.56 1.76 1.05.17 2.11-.2 2.68-.97l.02-.03-.02-2.61-1.33-1.38zm5.55 1.51c-1.34-.41-2.95-.64-4.69-.64-1.22 0-2.38.11-3.44.32l-.46.09v2.16l.89-.17c.94-.18 1.95-.27 3.01-.27 2.45 0 4.66.49 5.86 1.25.43.27.7.58.7.92 0 .55-.7 1.07-1.92 1.43-1.54.45-3.66.7-6.02.7-4.52 0-8.18-1.44-8.18-3.22 0-.6.42-1.16 1.16-1.64l-.56-.56c-1.01.62-1.6 1.39-1.6 2.2 0 2.185 3.916 3.957 8.747 3.957 2.65 0 5.06-.54 6.78-1.43 1.71-.88 2.65-2.02 2.65-3.23 0-1.37-1.12-2.45-2.94-2.91z" />
      </svg>
    );
  }

  // 2. Xbox (Xbox Series, Xbox One, Xbox 360, Original Xbox)
  if (p.includes('xbox')) {
    return (
      <svg
        style={style}
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-label={platform}
      >
        <title>{platform}</title>
        <path d="M12 0C5.372 0 0 5.372 0 12c0 6.626 5.372 12 12 12 6.626 0 12-5.374 12-12 0-6.628-5.374-12-12-12zm-3.28 4.26c1.173 0 2.65.626 4.316 2.015 1.668-1.389 3.143-2.015 4.316-2.015.65 0 1.21.2 1.666.58-1.264.928-2.67 2.213-4.14 3.784 1.78 2.062 3.86 4.908 4.79 7.378-1.16 1.69-2.73 3.01-4.56 3.79-.68-1.63-1.68-3.83-2.94-6.3-1.258 2.47-2.26 4.67-2.94 6.3-1.83-.78-3.4-2.1-4.56-3.79.93-2.47 3.01-5.316 4.79-7.378-1.47-1.57-2.876-2.856-4.14-3.784.456-.38 1.016-.58 1.666-.58z" />
      </svg>
    );
  }

  // 3. Nintendo Switch / Nintendo (Wii, GameCube, 3DS, DS, N64)
  if (p.includes('nintendo') || p.includes('switch') || p.includes('wii') || p.includes('ds') || p.includes('gamecube')) {
    return (
      <svg
        style={style}
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-label={platform}
      >
        <title>{platform}</title>
        <path d="M7.74 1.5C4.29 1.5 1.5 4.29 1.5 7.74v8.52c0 3.45 2.79 6.24 6.24 6.24h2.51V1.5H7.74zm-.8 9.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zm7.32-9.5v21h2.5c3.45 0 6.24-2.79 6.24-6.24V7.74c0-3.45-2.79-6.24-6.24-6.24h-2.5zm3.01 13.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5z" />
      </svg>
    );
  }

  // 4. PC / Windows
  if (p.includes('pc') || p.includes('windows')) {
    return (
      <svg
        style={style}
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-label={platform}
      >
        <title>{platform}</title>
        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
      </svg>
    );
  }

  // 5. Apple / macOS / iOS
  if (p.includes('mac') || p.includes('apple') || p.includes('ios')) {
    return (
      <svg
        style={style}
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-label={platform}
      >
        <title>{platform}</title>
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.9.04-2 .6-2.63 1.34-.56.64-1.05 1.71-.92 2.74 1.02.08 2.04-.52 2.63-1.21z" />
      </svg>
    );
  }

  // 6. Mobile / Android
  if (p.includes('android') || p.includes('mobile')) {
    return (
      <svg
        style={style}
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-label={platform}
      >
        <title>{platform}</title>
        <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4116 13.8533 8.1 12 8.1s-3.5902.3116-5.1367.8497L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
      </svg>
    );
  }

  // 7. Fallback: Minimalist Controller
  return (
    <svg
      style={style}
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label={platform}
    >
      <title>{platform}</title>
      <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  );
}

/**
 * Returns a friendly, short platform family label
 */
export function getPlatformFamilyName(platform: string): string {
  const p = platform.toLowerCase();
  if (p.includes('ps5')) return 'PS5';
  if (p.includes('ps4')) return 'PS4';
  if (p.includes('playstation')) return 'PlayStation';
  if (p.includes('series')) return 'Xbox Series';
  if (p.includes('xbox')) return 'Xbox';
  if (p.includes('switch')) return 'Switch';
  if (p.includes('nintendo')) return 'Nintendo';
  if (p.includes('pc') || p.includes('windows')) return 'PC';
  if (p.includes('mac') || p.includes('apple') || p.includes('ios')) return 'Apple';
  if (p.includes('android')) return 'Android';
  return platform;
}

/**
 * Helper component to render a row of distinct platform icons for a game
 */
export function PlatformIconList({
  platforms,
  max = 4,
  className = 'flex items-center gap-1.5 text-white/50',
  iconSize,
}: {
  platforms?: string[];
  max?: number;
  className?: string;
  iconSize?: number;
}) {
  if (!platforms || platforms.length === 0) return null;

  // Deduplicate platforms into major families (PlayStation, Xbox, Switch, PC, Apple, Mobile)
  const seenFamilies = new Set<string>();
  const distinctPlatforms: string[] = [];

  for (const plat of platforms) {
    const p = plat.toLowerCase();
    let family = 'other';
    if (p.includes('playstation') || p.includes('ps')) family = 'playstation';
    else if (p.includes('xbox')) family = 'xbox';
    else if (p.includes('switch') || p.includes('nintendo') || p.includes('wii')) family = 'nintendo';
    else if (p.includes('pc') || p.includes('windows')) family = 'pc';
    else if (p.includes('mac') || p.includes('apple') || p.includes('ios')) family = 'apple';
    else if (p.includes('android')) family = 'mobile';

    if (!seenFamilies.has(family)) {
      seenFamilies.add(family);
      distinctPlatforms.push(plat);
    }
  }

  return (
    <div className={className}>
      {distinctPlatforms.slice(0, max).map((plat) => (
        <span key={plat} title={plat} className="hover:text-white transition-colors">
          <PlatformIcon platform={plat} size={iconSize} className="w-3.5 h-3.5" />
        </span>
      ))}
    </div>
  );
}
