export function Footer({ text }: { text: string }) {
  return (
    <footer className="mx-auto max-w-[1560px] px-5 pb-5 text-center text-[12.5px] tracking-wide text-[var(--color-muted)]">
      {text}
    </footer>
  );
}
