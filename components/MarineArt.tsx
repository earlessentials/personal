import type { World } from "@/content/worlds";

type ArtProps = { className?: string };

const ShellTexture = () => (
  <defs>
    <filter id="rough" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence baseFrequency=".035" numOctaves="3" seed="7" type="fractalNoise" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" />
    </filter>
    <linearGradient id="cream" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#f4f0e8" />
      <stop offset=".58" stopColor="#d7c4a3" />
      <stop offset="1" stopColor="#9a5570" />
    </linearGradient>
    <radialGradient id="wine" cx="48%" cy="45%" r="70%">
      <stop offset="0" stopColor="#e7d8c8" />
      <stop offset=".54" stopColor="#9a5570" />
      <stop offset="1" stopColor="#681d3c" />
    </radialGradient>
  </defs>
);

export function ShellArt({ type, className = "" }: { type: World["shellType"]; className?: string }) {
  const common = { fill: "url(#cream)", stroke: "#681d3c", strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg className={className} viewBox="0 0 220 180" role="img" aria-label={`${type} shell illustration`}>
      <ShellTexture />
      {type === "nautilus" && <>
        <path {...common} d="M46 151c-15-21-20-54-10-84C48 31 78 13 113 17c43 5 73 38 70 77-2 22-13 39-30 50-12 8-24 13-28 22H66c-2-11-9-12-20-15Z" filter="url(#rough)" />
        <path d="M143 116c-25 13-59 2-66-27-7-30 18-55 46-51 25 4 39 31 27 52-9 17-31 22-45 9-11-10-7-28 5-34 10-5 22 2 21 13-1 8-9 13-16 10" fill="none" stroke="#681d3c" strokeWidth="5" />
        <path d="M48 145c20-9 31-27 30-49M153 143c-6 9-12 15-13 23" fill="none" stroke="#81294c" strokeWidth="3" opacity=".75" />
      </>}
      {type === "conch" && <>
        <path {...common} d="M110 15 181 67l-27 92H66L39 67Z" filter="url(#rough)" />
        <path d="m110 24 55 47-21 73H76L55 71Z" fill="none" stroke="#81294c" strokeWidth="3" />
        <path d="m110 24v120M55 71l89 73m21-73-89 73M76 144l34-120 34 120" fill="none" stroke="#81294c" strokeWidth="2.5" opacity=".72" />
        <circle cx="110" cy="91" r="18" fill="url(#wine)" stroke="#681d3c" strokeWidth="3" />
      </>}
      {type === "scallop" && <>
        <path {...common} d="M26 146C18 91 37 40 74 29c15-5 28 5 36 20 9-15 22-25 37-20 37 11 56 62 47 117-46 25-122 25-168 0Z" filter="url(#rough)" />
        <path d="M39 135C67 111 74 74 110 52c36 22 43 59 71 83M42 145c32-18 44-48 68-69 25 21 36 51 69 69M54 151c24-12 34-31 56-49 22 18 32 37 56 49" fill="none" stroke="#81294c" strokeWidth="3" opacity=".78" />
        <path d="M29 146q81 28 162 0" fill="none" stroke="#681d3c" strokeWidth="5" />
      </>}
      {type === "spiral" && <>
        <path {...common} d="M40 133c11-22 29-36 51-42-8-41 17-72 52-70 39 2 61 42 42 74-13 23-40 31-63 19 13 12 23 27 25 45-35 11-77 7-107-26Z" filter="url(#rough)" />
        <path d="M97 94c-11-28 8-57 35-58 24-1 42 21 34 42-7 18-29 24-43 12-10-9-7-25 4-30" fill="none" stroke="#81294c" strokeWidth="4" />
        <path d="M88 99C60 93 45 101 21 119m81-5c-31 3-45 20-70 29m91-20c-22 16-31 28-48 43m68-46c17 4 32 1 55-10m-45 24c15 9 29 11 49 7" fill="none" stroke="#9a5570" strokeWidth="3" strokeLinecap="round" />
      </>}
      {type === "clam" && <>
        <path {...common} d="M25 134C36 71 68 33 111 33c43 0 75 38 86 101-49 31-123 31-172 0Z" filter="url(#rough)" />
        <path d="M34 127C49 79 76 52 111 52s62 27 77 75M43 137c18-39 41-60 68-60s50 21 68 60M57 147c17-28 34-42 54-42s37 14 54 42" fill="none" stroke="#81294c" strokeWidth="5" opacity=".78" />
        <path d="M31 136q80-36 160 0-21 35-80 36-59-1-80-36Z" fill="url(#wine)" stroke="#681d3c" strokeWidth="4" />
        <circle cx="111" cy="128" r="17" fill="#f4f0e8" stroke="#d7c4a3" strokeWidth="3" />
      </>}
    </svg>
  );
}

export function StarfishArt({ className = "" }: ArtProps) {
  return <svg className={className} viewBox="0 0 200 200" role="img" aria-label="A starfish holding social links">
    <defs><radialGradient id="starfish" cx="44%" cy="42%"><stop stopColor="#d9a6b8"/><stop offset="1" stopColor="#81294c"/></radialGradient></defs>
    <path d="M101 17c12 0 18 47 25 53 8 6 50-14 57-4 7 10-29 39-31 49-2 10 30 43 22 52-9 9-46-19-57-17-11 2-30 44-42 40-12-4 0-51-5-60-5-9-53-13-54-25-1-12 48-18 55-26 7-8 17-62 30-62Z" fill="url(#starfish)" stroke="#681d3c" strokeWidth="5"/>
    <circle cx="101" cy="105" r="31" fill="#e7d8c8" stroke="#681d3c" strokeWidth="3"/>
    {[0,1,2,3,4,5,6,7,8,9].map((n)=><circle key={n} cx={74 + (n%4)*18} cy={64 + Math.floor(n/4)*24} r="3" fill="#f4f0e8" opacity=".7"/>)}
    <circle cx="90" cy="99" r="4" fill="#38252d"/><circle cx="112" cy="99" r="4" fill="#38252d"/>
    <circle cx="80" cy="111" r="5" fill="#d99aaa" opacity=".72"/><circle cx="122" cy="111" r="5" fill="#d99aaa" opacity=".72"/>
    <path d="M91 113q10 10 20 0" fill="none" stroke="#81294c" strokeWidth="3" strokeLinecap="round"/>
  </svg>;
}

export function TurtleArt({ className = "" }: ArtProps) {
  return <svg className={className} viewBox="0 0 240 140" role="img" aria-label="A turtle carrying sea mail">
    <defs><linearGradient id="turtle" x1="0" x2="1"><stop stopColor="#bfd8d2"/><stop offset="1" stopColor="#487f91"/></linearGradient></defs>
    <path d="M184 57c19-9 41-4 48 8-10 14-29 21-46 18" fill="url(#turtle)" stroke="#082f49" strokeWidth="3"/>
    <ellipse cx="120" cy="72" rx="70" ry="51" fill="#487f91" stroke="#082f49" strokeWidth="4"/>
    <path d="M69 45c29-28 79-26 105 3l-14 54c-31 17-70 12-92-12Z" fill="#bfd8d2" stroke="#082f49" strokeWidth="3"/>
    <path d="m76 47 34 20 28-29 29 25-25 37-42-2-29-24Z" fill="none" stroke="#487f91" strokeWidth="2"/>
    <path d="M69 35C49 17 29 17 16 26c11 19 29 30 49 28M67 105c-22 20-39 20-52 10 11-18 27-29 48-29M166 104c17 19 37 22 51 13-8-19-24-31-44-33" fill="#bfd8d2" stroke="#082f49" strokeWidth="3"/>
    <path d="m99 45 7-26 36 2 5 27" fill="#e7d8c8" stroke="#681d3c" strokeWidth="3"/>
    <path d="m107 24 17 13 17-12" fill="none" stroke="#81294c" strokeWidth="2"/>
    <circle cx="215" cy="65" r="3" fill="#17191b"/>
  </svg>;
}

export function OysterArt({ className = "" }: ArtProps) {
  return <svg className={className} viewBox="0 0 180 150" role="img" aria-label="An oyster holding a pearl">
    <path d="M28 87C16 46 41 17 88 20c47-3 72 26 60 67-34 14-86 14-120 0Z" fill="#d7c4a3" stroke="#681d3c" strokeWidth="4"/>
    <path d="M25 91q65-25 130 0-8 45-65 50-57-5-65-50Z" fill="#9a5570" stroke="#681d3c" strokeWidth="4"/>
    <circle cx="91" cy="98" r="19" fill="#f4f0e8" stroke="#e7d8c8" strokeWidth="4"/>
    <path d="M42 73 30 45M64 67 57 31M90 65V22m26 45 11-38m10 47 16-31" stroke="#81294c" strokeWidth="2" opacity=".7"/>
  </svg>;
}

export function ArcadeShellArt({ className = "" }: ArtProps) {
  return <svg className={className} viewBox="0 0 180 150" role="img" aria-label="A spotted cowrie shell holding an arcade pearl">
    <defs><linearGradient id="arcade-shell" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f4f0e8"/><stop offset=".6" stopColor="#d7c4a3"/><stop offset="1" stopColor="#9a5570"/></linearGradient></defs>
    <path d="M91 13c40 0 69 31 65 69-4 38-31 58-66 58S27 120 24 82C21 44 50 13 91 13Z" fill="url(#arcade-shell)" stroke="#681d3c" strokeWidth="4"/>
    <path d="M90 25c-10 21-12 80 0 103M70 31c-15 21-16 70 0 91m41-91c15 21 16 70 0 91" fill="none" stroke="#81294c" strokeWidth="3" strokeLinecap="round" opacity=".8"/>
    <path d="M91 35c8 12 9 73 0 87-9-14-8-75 0-87Z" fill="#681d3c" opacity=".9"/>
    <circle cx="91" cy="78" r="13" fill="#f4f0e8" stroke="#9a5570" strokeWidth="3"/>
    {[40,55,70,85,100,115,130].map((x, index)=><circle key={x} cx={x} cy={index % 2 ? 47 : 103} r="4" fill="#81294c" opacity=".72"/>)}
  </svg>;
}

export function CompassArt({ className = "" }: ArtProps) {
  return <svg className={className} viewBox="0 0 80 80" aria-hidden="true">
    <circle cx="40" cy="40" r="34" fill="#e7d8c8" stroke="#681d3c" strokeWidth="3" />
    <path d="m40 11 8 21 21 8-21 8-8 21-8-21-21-8 21-8Z" fill="#81294c" stroke="#082f49" strokeWidth="2"/>
    <circle cx="40" cy="40" r="6" fill="#f4f0e8"/>
  </svg>;
}

export function BottleArt({ className = "" }: ArtProps) {
  return <svg className={className} viewBox="0 0 120 180" role="img" aria-label="A mysterious message bottle">
    <path d="M48 13h25v29l14 13c20 20 23 80 5 108H26C8 155 11 75 31 55l17-13Z" fill="#bfd8d2" fillOpacity=".45" stroke="#d7c4a3" strokeWidth="4"/>
    <path d="m29 100 57-16 8 39-57 16Z" fill="#e7d8c8" stroke="#681d3c" strokeWidth="2"/>
    <path d="M45 22h31" stroke="#681d3c" strokeWidth="10"/>
    <path d="m42 111 37-10m-34 22 26-7" stroke="#81294c" strokeWidth="2"/>
  </svg>;
}
