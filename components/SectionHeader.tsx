import { ScrollReveal } from "./ScrollReveal";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({ eyebrow, title, description, align = "left" }: Props) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && (
        <ScrollReveal as="span" className="eyebrow inline-block">
          {eyebrow}
        </ScrollReveal>
      )}
      <ScrollReveal delay={80}>
        <h2 className="display mt-4 text-balance text-4xl sm:text-5xl lg:text-[3.5rem]">
          {title}
        </h2>
      </ScrollReveal>
      {description && (
        <ScrollReveal delay={160}>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-[color:var(--color-fog)]/85">
            {description}
          </p>
        </ScrollReveal>
      )}
    </div>
  );
}
