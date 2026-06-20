import { cn } from "@/lib/utils";
import {
	Avatar,
	AvatarFallback,
} from "@/components/ui/avatar";
import { DecorIcon } from "@/components/decor-icon";
import { QuoteIcon } from "lucide-react";

type Testimonial = {
	quote: string;
	name: string;
	role: string;
	company: string;
};

const testimonials: Testimonial[] = [
	{
		quote:
			"What stood out with Dako Studios is the rare combination of precision and range. Every layer of the project was handled with genuine attention to detail — and they moved across disciplines without losing quality at any point.",
		name: "Steve Gukas",
		role: "MD & Director",
		company: "Native Filmworks",
	},
	{
		quote:
			"The work ethic at Dako Studios is the kind you don't often encounter. They stay committed from brief to handoff — no corners cut, no excuses. That consistency is what builds real trust in a creative partner.",
		name: "Nono Bukiti",
		role: "Transformation Leader",
		company: "Data Sentinels",
	},
	{
		quote:
			"Dako Studios delivered on every front. Professional, thorough, and the results spoke for themselves. Exactly what we needed.",
		name: "David",
		role: "CEO",
		company: "Amnik Enterprise",
	},
];

export function TestimonialsSection() {
	return (
		<section id="testimonials" className="py-24 sm:py-32 bg-background border-t border-border/40">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="mx-auto max-w-3xl text-center mb-20">
					<span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
						Client Voices
					</span>
					<h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-foreground leading-none">
						What clients say.
					</h2>
				</div>

				{/* Cards */}
				<div className="mx-auto -mt-10 grid w-full max-w-5xl gap-8 md:grid-cols-3 md:gap-6">
					{testimonials.map((testimonial, index) => (
						<TestimonialCard
							index={index}
							key={testimonial.name}
							testimonial={testimonial}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

function TestimonialCard({
	testimonial,
	index,
	className,
	...props
}: React.ComponentProps<"figure"> & {
	testimonial: Testimonial;
	index: number;
}) {
	const { quote, name, role, company } = testimonial;
	const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);

	return (
		<figure
			className={cn(
				"relative flex flex-col justify-between gap-6 px-8 pt-8 pb-6 shadow-xs md:translate-y-[calc(3rem*var(--t-card-index))]",
				"dark:bg-[radial-gradient(50%_80%_at_25%_0%,--theme(--color-foreground/.1),transparent)]",
				className
			)}
			style={
				{
					"--t-card-index": index,
				} as React.CSSProperties
			}
			{...props}
		>
			<div className="absolute -inset-y-4 -left-px w-px bg-border" />
			<div className="absolute -inset-y-4 -right-px w-px bg-border" />
			<div className="absolute -inset-x-4 -top-px h-px bg-border" />
			<div className="absolute -right-4 -bottom-px -left-4 h-px bg-border" />
			<DecorIcon className="size-3.5" position="top-left" />

			<blockquote className="flex gap-4">
				<QuoteIcon aria-hidden="true" className="size-6 shrink-0 stroke-1" />
				<p className="flex-1 font-normal text-base text-muted-foreground leading-relaxed">
					{quote}
				</p>
			</blockquote>

			<figcaption className="flex items-center gap-3">
				<Avatar className="size-10 rounded-full ring-2 ring-border ring-offset-2 ring-offset-background bg-primary/10">
					<AvatarFallback className="text-primary font-semibold text-sm">{initials}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<cite className="font-medium text-foreground text-sm not-italic">
						{name}
					</cite>
					<p className="text-muted-foreground text-xs">
						{role}, <span className="text-foreground/80">{company}</span>
					</p>
				</div>
			</figcaption>
		</figure>
	);
}
