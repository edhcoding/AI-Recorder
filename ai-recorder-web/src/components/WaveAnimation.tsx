export default function WaveAnimation({ recordState }: { recordState: 'recording' | 'paused' | null }) {
  if (recordState !== 'recording') return null;

  return (
    <>
      <span className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary opacity-50 pointer-events-none animate-wave" />
      <span className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary opacity-50 pointer-events-none animate-wave-delay-750" />
    </>
  );
}
