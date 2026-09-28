import { useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  Loader2,
  Compass,
  MapPin,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import visheshImage from "@/assets/vishesh.jpg";
import mayaImage from "@/assets/maya.jpg";
import andreImage from "@/assets/andre.jpg";
import elenaImage from "@/assets/elena.jpg";
import jonahImage from "@/assets/jonah.jpg";
import leilaImage from "@/assets/leila.jpg";
import noahImage from "@/assets/noah.jpg";
import sanaImage from "@/assets/sana.jpg";
import priyaImage from "@/assets/priya.jpg";
import tomasImage from "@/assets/tomas.jpg";
import amaraImage from "@/assets/amara.jpg";
import kenjiImage from "@/assets/kenji.jpg";
import isabelleImage from "@/assets/isabelle.jpg";
import marcusImage from "@/assets/marcus.jpg";
import nadiaImage from "@/assets/nadia.jpg";
import felixImage from "@/assets/felix.jpg";

type Tier = "closest" | "trusted" | "wider";

type Person = {
  id: string;
  name: string;
  role: string;
  company: string;
  business: string;
  bio: string;
  interests: string[];
  note: string;
  image: string;
  match: number;
  tier: Tier;
  s: number;
  recommended?: boolean;
  linkedinUrl?: string;
};

const people: Person[] = [
  { id: "ethan", name: "Ethan Carter", role: "Founder", company: "Techrupt", business: "A startup collective that helps ambitious builders find co-founders, first users, and each other. Runs founder sprints, a 4,000-person community, and a matching process behind 200+ launched companies.", bio: "Building better ways for ambitious people to find each other. He's spent four years studying why some partnerships click and most don't — his answer is shared taste, not shared skills. Currently writing a book on co-founder chemistry.", interests: ["AI", "Community", "Future of work"], note: "shares your interest in meaningful communities.", image: visheshImage, match: 98, tier: "closest", s: 1, recommended: true },
  { id: "maya", name: "Maya Chen", role: "Partner", company: "Northstar Climate", business: "An early-stage climate fund backing founders rebuilding the energy, food, and urban systems our world depends on. Writes first checks of $500K–$2M and has backed 31 companies across three continents.", bio: "Backing founders rebuilding the systems our world depends on. Before Northstar she spent a decade in grid infrastructure, so she reads an energy market the way founders read a term sheet. She's hunting for the two or three teams she'll champion this quarter.", interests: ["Climate", "Venture", "Cities"], note: "has a climate portfolio that overlaps with your urban systems thesis.", image: mayaImage, match: 94, tier: "trusted", s: .92, recommended: true },
  { id: "andre", name: "Andre Wallace", role: "Design Director", company: "Form / Function", business: "A design studio partnering with founders to craft digital products that feel effortless, warm, and inevitable. Their work has shipped for 40+ startups — including two products you probably used this morning.", bio: "Designing digital products that feel inevitable, warm, and human. He leads a team of twelve and still opens Figma every morning — taste, he believes, is a daily practice. Ask him which interface conventions he thinks we should retire.", interests: ["Design", "AI", "Culture"], note: "shares your point of view on humane AI and product craft.", image: andreImage, match: 91, tier: "closest", s: .9, recommended: true },
  { id: "elena", name: "Elena Rossi", role: "Research Lead", company: "Agora AI", business: "A research lab studying how intelligent systems can amplify — rather than replace — collective decisions. Its findings shape policy at three national governments and two major open-source AI projects.", bio: "Studying how intelligent systems can amplify collective decisions. Her lab's latest paper argues the best human-AI teams argue more, not less. She's collecting stories from founders who've watched their own tools change how their teams decide.", interests: ["AI", "Research", "Governance"], note: "is researching a question you saved last week.", image: elenaImage, match: 89, tier: "wider", s: .86 },
  { id: "sana", name: "Sana Okafor", role: "Founder", company: "Morrow Health", business: "A health company bringing preventative care to emerging markets through mobile-first clinics. Morrow's 200 clinics now reach half a million patients who previously lived hours from care.", bio: "Making preventative care accessible across emerging markets. She left a comfortable clinical career after one statistic kept her up at night. She's here to trade distribution lessons with anyone who's built for markets the industry overlooked.", interests: ["Health", "Impact", "Startups"], note: "could unlock growth with her distribution experience.", image: sanaImage, match: 79, tier: "wider", s: .64 },
  { id: "jonah", name: "Jonah Reed", role: "Co-founder", company: "Common Ground", business: "A civic-tech company creating shared spaces and programs that bring city neighbors together. Its pilots in three cities have turned vacant lots and libraries into 40,000 recurring community gatherings.", bio: "Creating civic spaces for the next generation of city life. He left a big-tech product role after realizing the best feature he ever shipped was a park bench. He's mapping how third places survive, one neighborhood at a time.", interests: ["Cities", "Community", "Design"], note: "also cares about turning spaces into communities.", image: jonahImage, match: 86, tier: "trusted", s: .78 },
  { id: "emily", name: "Emily Brooks", role: "Journalist", company: "The New Assembly", business: "An independent newsroom covering technology, power, and the people shaping both. Her investigations have prompted two regulatory hearings and more than a few awkward board meetings.", bio: "Writing about power, technology, and the people shaping both. She's spent six years explaining boardroom decisions to everyone they affect. Her current series asks what happens to ambition when the ladder it climbed disappears.", interests: ["Culture", "Media", "Technology"], note: "is researching the shift your company is pioneering.", image: leilaImage, match: 83, tier: "wider", s: .72 },
  { id: "priya", name: "Priya Raman", role: "VP Engineering", company: "Lumen Labs", business: "An AI infrastructure company building model serving that stays fast, affordable, and honest about its limits. Lumen now runs inference for 900 engineering teams, from weekend hacks to public companies.", bio: "Scaling AI infrastructure that stays fast, cheap, and honest. Her team's benchmark suite has become the industry's quiet standard for calling out inflated claims. She wants to meet the people building on top — their failures shape her roadmap.", interests: ["AI", "Infrastructure", "Startups"], note: "also pushes on what it takes to ship AI beyond the demo.", image: priyaImage, match: 77, tier: "trusted", s: .58 },
  { id: "tomas", name: "Tomás Rivera", role: "Urban Planner", company: "Civic Form", business: "An urban design practice helping cities redesign streets and public space around people instead of cars. Its redesigns have already converted 60 km of asphalt into walkable, living streets.", bio: "Redesigning city streets around people instead of cars. He carries before-and-after photos of every intersection his studio has transformed. He's convinced the future of cities is decided at the scale of one street corner.", interests: ["Cities", "Community", "Climate"], note: "has work that complements your community experiments.", image: tomasImage, match: 75, tier: "wider", s: .56 },
  { id: "noah", name: "Noah Williams", role: "Product Lead", company: "Arc", business: "A fintech company turning complex financial tools into calm, trustworthy everyday products. Arc now serves 1.2 million people who previously found money apps intimidating.", bio: "Turning complex financial tools into calm everyday products. He believes the best fintech feels boring in the moment and trustworthy forever. He's stress-testing how far simplicity can go before it hides something people need to know.", interests: ["Fintech", "Design", "Startups"], note: "has complementary experience in trust-first product design.", image: noahImage, match: 81, tier: "trusted", s: .66 },
  { id: "amara", name: "Amara Diallo", role: "Climate Scientist", company: "Verdant Institute", business: "A climate research institute translating planetary data into decisions leaders actually make. Its open models are cited everywhere from city planning offices to corporate boardrooms.", bio: "Translating climate data into decisions leaders actually make. She grew up watching flood seasons shift on the Senegal river and never stopped asking why projections arrive too late. She's here to find the messengers her data still needs.", interests: ["Climate", "Research", "Impact"], note: "can pressure-test the climate claims behind your thesis.", image: amaraImage, match: 74, tier: "wider", s: .5 },
  { id: "kenji", name: "Kenji Watanabe", role: "Creative Technologist", company: "Studio Kin", business: "A creative technology studio building interactive installations where craft meets code. Their work has appeared in four museums and one unforgettable subway station.", bio: "Building interactive installations where craft meets code. He prototype-tests everything in his own living room before any client sees it. He's exploring how physical spaces could borrow the joy of good software.", interests: ["Design", "AI", "Culture"], note: "could shape how your product feels through his generative work.", image: kenjiImage, match: 72, tier: "trusted", s: .46 },
  { id: "isabelle", name: "Isabelle Fournier", role: "Head of Community", company: "Gather", business: "A community platform helping organizers host gatherings people rearrange their week to attend. Gather now powers 12,000 recurring gatherings across 30 cities.", bio: "Growing gatherings people rearrange their week to attend. She has attended, organized, or rescued over a thousand events and knows exactly why most rooms feel flat. Ask her the three-question test she runs before any venue is booked.", interests: ["Community", "Culture", "Cities"], note: "knows exactly who you should meet in every city you enter.", image: isabelleImage, match: 70, tier: "wider", s: .42 },
  { id: "marcus", name: "Marcus Bennett", role: "Partner", company: "First Bloom Ventures", business: "A seed fund investing early in founders fixing broken essential systems, from energy to housing. First Bloom has backed 22 companies — eleven of which began as dinner conversations.", bio: "Investing early in founders fixing broken essential systems. He spent eight years building housing before crossing to the other side of the table. He keeps a list of twenty problems he'd fund tomorrow if the right founder walked in.", interests: ["Climate", "Venture", "Startups"], note: "led the last round in a space adjacent to yours.", image: marcusImage, match: 68, tier: "trusted", s: .36 },
  { id: "nadia", name: "Nadia Petrova", role: "AI Ethicist", company: "Polaris Institute", business: "A research institute building practical frameworks for responsible, trustworthy AI. Its evaluation frameworks are now embedded in the release process of several major labs.", bio: "Asking who intelligent systems serve before they ship. She works at the exact point where ethics becomes engineering checklists instead of essays. She's collecting the trust questions founders actually face — not the ones philosophers prefer.", interests: ["AI", "Governance", "Research"], note: "has a framework that maps to the trust questions you keep raising.", image: nadiaImage, match: 66, tier: "wider", s: .3 },
  { id: "felix", name: "Felix Andersson", role: "Founder", company: "Hearth", business: "A housing company turning apartment buildings into real neighborhoods with shared life built in. Hearth's 3,000 residents share kitchens, gardens, and — per its own surveys — considerably better dinners.", bio: "Turning apartment buildings into real neighborhoods again. He left architecture after realizing the loneliest buildings he designed were also his best-reviewed ones. He's testing whether belonging can be zoned, funded, and repeated at scale.", interests: ["Community", "Cities", "Future of work"], note: "also believes belonging is a product worth building.", image: felixImage, match: 64, tier: "wider", s: .24 },
];

const filters = ["For you", "AI", "Design", "Climate", "Community", "Cities"];

type Box = { width: number; height: number };
type Ring = { rx: number; ry: number };
type LayoutPerson = { person: Person; x: number; y: number; size: number; tierIndex: number };

const tierNames: Record<Tier, string> = { closest: "Closest", trusted: "Trusted", wider: "Wider world" };
const tierStarts: Record<Tier, number> = { closest: -140, trusted: -70, wider: -100 };

function useNetworkLayout(networkPeople: Person[]) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<Box>({ width: 0, height: 0 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setBox({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const layout = useMemo(() => {
    const w = box.width;
    const h = box.height;
    if (!w || !h) return null;
    const narrow = w < 640;
    const base = Math.min(84, Math.max(36, Math.min(w, h * .85) * .135));
    const sizes = { center: base * 1.5, closest: base, trusted: base * .8, wider: base * .6 };
    const labelW = narrow ? 34 : 70;
    const labelH = narrow ? 18 : 34;
    const padX = sizes.wider / 2 + labelW * .5 + 4;
    const padTop = sizes.wider / 2 + 8;
    const padBot = sizes.wider / 2 + labelH + 8;
    const ry = Math.max(1, (h - padTop - padBot) / 2);
    const rx = Math.max(1, Math.min(w / 2 - padX, ry * 1.7));
    const cx = w / 2;
    const cy = padTop + ry;
    const gap = narrow ? 14 : 22;
    const rMin = sizes.center / 2 + sizes.closest / 2 + gap;
    const closest = { rx: Math.max(rMin, rx * .3), ry: Math.max(rMin, ry * .3) };
    const wider = { rx, ry };
    const trusted = { rx: closest.rx + (rx - closest.rx) * .52, ry: closest.ry + (ry - closest.ry) * .52 };
    const rings: Record<Tier, Ring> = { closest, trusted, wider };
    const placed: LayoutPerson[] = [];

    (["closest", "trusted", "wider"] as Tier[]).forEach((tier) => {
      const members = networkPeople.filter((person) => person.tier === tier);
      members.forEach((person, index) => {
        const angle = (tierStarts[tier] + index * 360 / members.length) * Math.PI / 180;
        const band = .9 + (1 - person.s) * .16;
        placed.push({
          person,
          x: cx + Math.cos(angle) * rings[tier].rx * band,
          y: cy + Math.sin(angle) * rings[tier].ry * band,
          size: sizes[tier],
          tierIndex: index,
        });
      });
    });
    return { w, h, narrow, cx, cy, sizes, rings, placed };
  }, [box, networkPeople]);

  return { stageRef, layout };
}

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5" aria-label="Harmony">
      <span className="relative grid size-7 place-items-center">
        <span className="absolute size-5 rounded-full border border-primary/45" />
        <span className="absolute left-0 size-3 rounded-full bg-signal" />
        <span className="absolute right-0 size-3 rounded-full bg-primary" />
      </span>
      <span className="font-display text-lg font-semibold">harmony</span>
    </div>
  );
}

function Intro({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-ink text-paper">
      <div className="absolute inset-0 opacity-40 harmony-grid" />
      <div className="relative mx-auto max-w-3xl px-6 text-center animate-rise">
        <div className="mx-auto mb-12 flex justify-center"><BrandMark /></div>
        <p className="mb-5 text-xs font-semibold uppercase text-paper/55">Welcome to the room</p>
        <h1 className="text-balance font-display text-5xl font-medium leading-[0.98] sm:text-7xl lg:text-8xl">
          Meet people.<br />Discover connections.<br /><em className="font-serif font-normal text-signal">Go further.</em>
        </h1>
        <p className="mx-auto mt-8 max-w-md text-base leading-7 text-paper/60">The people worth knowing are closer than you think.</p>
        <Button onClick={onEnter} className="mt-10 h-12 rounded-full bg-paper px-6 text-ink hover:bg-paper/90">
          Enter the room <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

function PersonCard({ person, onSelect }: { person: Person; onSelect: (person: Person) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(person)}
      className="group min-w-0 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`View ${person.name}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {person.recommended && (
          <span className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1.5 rounded-full bg-ink/55 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-paper ring-1 ring-inset ring-paper/25 backdrop-blur-md">
            <Sparkles className="size-2.5 text-signal" /> Recommended
          </span>
        )}
        <img src={person.image} alt="" width={768} height={1024} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/65 to-transparent p-4 pt-16 text-paper">
          <span className="text-xs font-semibold">{person.match}% aligned</span>
          <span className="grid size-8 translate-y-1 place-items-center rounded-full bg-paper/95 text-ink opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100"><ArrowRight className="size-4" /></span>
        </div>
      </div>
      <div className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div><h3 className="font-display text-xl font-semibold leading-none">{person.name}</h3><p className="mt-1.5 text-sm text-muted-foreground">{person.role} · {person.company}</p></div>
          <span className="mt-1 size-2 shrink-0 rounded-full bg-success" title="In the room" />
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-5 text-foreground/75">{person.bio}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">{person.interests.slice(0, 2).map((interest) => <span key={interest} className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground">{interest}</span>)}</div>
        <p className="mt-4 border-l-2 border-signal pl-3 text-xs leading-5 text-muted-foreground"><span className="font-semibold text-foreground">Why meet:</span> {person.note}</p>
      </div>
    </button>
  );
}

function DetailPanel({ person, onClose, onExplore }: { person: Person; onClose: () => void; onExplore: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-ink/20 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="h-full w-full overflow-y-auto bg-background shadow-panel animate-slide-in-right sm:max-w-[470px]">
        <div className="relative aspect-[5/4] overflow-hidden bg-muted">
          <img src={person.image} alt={person.name} width={768} height={1024} className="h-full w-full object-cover object-[center_28%]" />
          <Button variant="secondary" size="icon" onClick={onClose} className="absolute right-5 top-5 rounded-full bg-background/85 backdrop-blur"><X /></Button>
        </div>
        <div className="p-7 sm:p-9">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-success"><span className="size-2 rounded-full bg-success" /> In the room</div>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-none">{person.name}</h2>
          <p className="mt-2 text-base text-muted-foreground">{person.role} at {person.company}</p>
          <p className="mt-7 text-lg leading-7">{person.bio}</p>
          <div className="mt-7 rounded-md bg-secondary p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-primary"><Sparkles className="size-3.5" /> Why you should meet</div>
            <p className="mt-3 text-sm leading-6">{person.note}</p>
          </div>
          <div className="mt-4 rounded-md border border-border p-5">
            <div className="text-xs font-semibold uppercase text-muted-foreground">About {person.company}</div>
            <p className="mt-3 text-sm leading-6 text-foreground/80">{person.business}</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-2">{person.interests.map((interest) => <span key={interest} className="rounded-full border border-border px-3 py-1.5 text-xs font-medium">{interest}</span>)}</div>
          <Button onClick={onExplore} className="mt-9 h-12 w-full rounded-full bg-ink text-paper hover:bg-ink/90">Explore {person.name.split(" ")[0]}’s world <Compass /></Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">12 people are one introduction away</p>
        </div>
      </aside>
    </div>
  );
}

const tierDot = (tier: Tier) => tier === "closest" ? "bg-signal" : tier === "trusted" ? "bg-primary" : "bg-paper/40";

// TODO: replace with a real intro-request call once persistence is added.
function requestIntro(_targetId: string, _message: string, _meta?: { requesterId: string; introducerId: string }) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, 900));
}

function PersonDetailCard({ person, center, headingRef, sent, onSent, onViewWorld }: { person: Person; center: Person; headingRef: RefObject<HTMLHeadingElement | null>; sent: boolean; onSent: () => void; onViewWorld: () => void }) {
  const centerFirst = center.name.split(" ")[0];
  const [mode, setMode] = useState<"detail" | "compose" | "success">("detail");
  const [reason, setReason] = useState("");
  const baseMessage = `Hi ${centerFirst}, I'd love an introduction to ${person.name} (${person.role}).`;
  const [message, setMessage] = useState(baseMessage);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const linkedinLabel = person.linkedinUrl?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  const updateReason = (value: string) => {
    setReason(value);
    setMessage(value.trim() ? `${baseMessage} ${value.trim()}` : baseMessage);
  };
  const copy = async () => {
    if (!person.linkedinUrl) return;
    await navigator.clipboard.writeText(person.linkedinUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  const send = async () => {
    setSending(true); setError(false);
    try {
      await requestIntro(person.id, message, { requesterId: "me", introducerId: center.id });
      onSent(); setMode("success");
    } catch { setError(true); } finally { setSending(false); }
  };

  const header = (
    <div className="flex items-center gap-3">
      <img src={person.image} alt="" width={768} height={1024} className="size-11 shrink-0 rounded-full object-cover" />
      <div className="min-w-0">
        <h2 ref={headingRef} tabIndex={-1} className="truncate text-sm font-semibold text-paper outline-none">{person.name}</h2>
        <p className="truncate text-xs text-paper/55">{person.role} · {person.company}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-paper/45"><i className={cn("size-2 rounded-full", tierDot(person.tier))} /> {tierNames[person.tier]}</p>
      </div>
    </div>
  );

  if (mode === "success") return <div>
    {header}
    <p className="mt-4 flex gap-2 text-sm leading-5 text-paper/80"><Check className="mt-0.5 size-4 shrink-0 text-success" /> Request sent to {centerFirst}. You'll see their reply in your inbox.</p>
    <Button size="sm" onClick={() => setMode("detail")} className="mt-3 min-h-11 rounded-full sm:min-h-9">Done</Button>
  </div>;

  if (mode === "compose") return <div>
    {header}
    <p className="mt-4 truncate text-xs text-paper/55">You → {center.name} → {person.name}</p>
    <label className="mt-3 block text-[11px] font-medium text-paper/60" htmlFor="intro-reason">Why do you want to meet? (optional)</label>
    <Input id="intro-reason" value={reason} onChange={(e) => updateReason(e.target.value)} className="mt-1 min-h-11 border-paper/15 bg-paper/5 text-paper sm:min-h-9" />
    <label className="mt-3 block text-[11px] font-medium text-paper/60" htmlFor="intro-message">Message</label>
    <textarea id="intro-message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="mt-1 w-full resize-none rounded-md border border-paper/15 bg-paper/5 p-2.5 text-sm text-paper outline-none focus-visible:ring-2 focus-visible:ring-ring" />
    {error && <p role="alert" className="mt-2 text-xs text-destructive">Couldn't send your request. Try again.</p>}
    <div className="mt-3 flex gap-2">
      <Button onClick={send} disabled={sending || !message.trim()} className="min-h-11 flex-1 rounded-full sm:min-h-9">{sending ? <><Loader2 className="animate-spin" /> Sending</> : "Send request"}</Button>
      <Button variant="ghost" onClick={() => { setMode("detail"); setError(false); }} disabled={sending} className="min-h-11 rounded-full text-paper hover:bg-paper/10 hover:text-paper sm:min-h-9">Cancel</Button>
    </div>
  </div>;

  return <div>
    {header}
    <div className="mt-4 flex min-h-11 items-center gap-2 text-xs sm:min-h-8">
      {person.linkedinUrl ? <>
        <a href={person.linkedinUrl} target="_blank" rel="noopener noreferrer" className="min-w-0 truncate text-paper/80 underline-offset-4 hover:underline">{linkedinLabel}</a>
        <Button variant="ghost" size="icon" onClick={copy} aria-label="Copy LinkedIn URL" className="size-11 shrink-0 text-paper/60 hover:bg-paper/10 hover:text-paper sm:size-8"><Copy /></Button>
        {copied && <span className="text-[11px] text-success">Copied</span>}
      </> : <span className="text-paper/40">LinkedIn not added yet</span>}
    </div>
    {sent
      ? <span className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-paper/10 text-sm text-paper/60 sm:min-h-9" aria-disabled="true"><Check className="size-4" /> Request sent</span>
      : <Button onClick={() => setMode("compose")} className="mt-3 min-h-11 w-full rounded-full sm:min-h-9">Ask {centerFirst} to connect you</Button>}
    <Button variant="link" onClick={onViewWorld} className="mt-1 min-h-11 w-full text-paper/70 hover:text-paper sm:min-h-9">View their world <ArrowRight /></Button>
  </div>;
}

function NetworkExplorer({ initial, onExit }: { initial: Person; onExit: () => void }) {
  const [center, setCenter] = useState(initial);
  const [trail, setTrail] = useState<Person[]>([initial]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [entranceActive, setEntranceActive] = useState(true);
  const connections = useMemo(() => people.filter((person) => person.id !== center.id).slice(0, 6), [center.id]);
  const defaultSelection = connections.find((person) => person.tier === "closest") ?? connections[0];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<string[]>([]);
  const selected = connections.find((person) => person.id === selectedId) ?? null;
  const { stageRef, layout } = useNetworkLayout(connections);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const avatarRefs = useRef(new Map<string, HTMLButtonElement>());
  const lastSelectedRef = useRef<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setEntranceActive(false), 1900);
    return () => window.clearTimeout(timer);
  }, []);

  const moveTo = (person: Person) => {
    setSelectedId(null);
    lastSelectedRef.current = null;
    setCenter(person);
    setTrail((current) => [...current, person].slice(-4));
  };

  const selectPerson = (person: Person) => {
    lastSelectedRef.current = person.id;
    setSelectedId(person.id);
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const clearSelection = () => {
    if (!selectedId) return;
    const previous = selectedId;
    setSelectedId(null);
    requestAnimationFrame(() => avatarRefs.current.get(previous)?.focus());
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") clearSelection(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const promisingPath = defaultSelection && <>
    <p className="text-[10px] font-semibold uppercase text-signal">A promising path</p>
    <p className="mt-2 text-xs leading-5 text-paper/65"><strong className="text-paper">{defaultSelection.name}</strong> {defaultSelection.note}</p>
    <p className="mt-2 flex min-w-0 items-center gap-2 truncate text-[10px] text-paper/45"><i className={cn("size-2 shrink-0 rounded-full", tierDot(defaultSelection.tier))} /> {tierNames[defaultSelection.tier]} · {defaultSelection.role}</p>
  </>;

  return (
    <main className="min-h-screen overflow-hidden bg-ink text-paper">
      <header className="relative z-30 flex h-20 items-center justify-between border-b border-paper/10 px-5 sm:px-8">
        <Button variant="ghost" onClick={onExit} className="rounded-full text-paper hover:bg-paper/10 hover:text-paper"><ArrowLeft /> Room</Button>
        <div className="hidden min-w-0 items-center gap-1 overflow-hidden text-xs text-paper/45 sm:flex">
          {trail.map((person, index) => <div key={`${person.id}-${index}`} className="flex shrink-0 items-center gap-1"><span className={cn(index === trail.length - 1 && "text-paper")}>{person.name.split(" ")[0]}</span>{index < trail.length - 1 && <ChevronRight className="size-3" />}</div>)}
        </div>
        <BrandMark />
      </header>

      <section className="relative flex h-[calc(100dvh-5rem)] min-h-[560px] flex-col overflow-hidden pb-[env(safe-area-inset-bottom)] sm:min-h-[620px]">
        <div className="absolute inset-0 harmony-network-bg" />
        <div className="relative z-20 shrink-0 px-5 pb-2 pt-4 sm:absolute sm:left-8 sm:top-8 sm:max-w-[250px] sm:p-0">
          <p className="text-[10px] font-semibold uppercase text-signal sm:text-xs">Inside their world</p>
          <h1 className="mt-1 truncate font-display text-xl font-semibold sm:mt-2 sm:text-3xl">{center.name}</h1>
          <p className="mt-0.5 truncate text-xs text-paper/50 sm:mt-1 sm:text-sm">{center.role} · {center.company}</p>
        </div>

        <div ref={stageRef} onClick={clearSelection} className="network-stage relative z-10 min-h-0 flex-1 overflow-hidden">
          {layout && <>
            <svg className="pointer-events-none absolute inset-0 size-full" viewBox={`0 0 ${layout.w} ${layout.h}`} aria-hidden="true">
              {(["closest", "trusted", "wider"] as Tier[]).map((tier) => {
                const ring = layout.rings[tier];
                const captionAngle = -14 * Math.PI / 180;
                const captionX = layout.cx + Math.cos(captionAngle) * ring.rx;
                const captionY = layout.cy + Math.sin(captionAngle) * ring.ry;
                return <g key={tier}>
                  <ellipse cx={layout.cx} cy={layout.cy} rx={ring.rx} ry={ring.ry} className={`network-ring network-ring-${tier}`} />
                  {!(layout.narrow && tier === "closest") && <text x={captionX} y={captionY} className="network-ring-caption">{tierNames[tier]}</text>}
                </g>;
              })}
              {layout.placed.map(({ person, x, y }) => {
                const active = selected?.id === person.id || hoveredId === person.id;
                return <line key={person.id} x1={layout.cx} y1={layout.cy} x2={x} y2={y} className={cn("network-spoke", `network-spoke-${person.tier}`, active && "is-active", entranceActive && "is-entering")} />;
              })}
            </svg>

            <div onClick={(event) => event.stopPropagation()} className="absolute z-20 overflow-hidden rounded-full border-[3px] border-signal bg-muted network-center" style={{ width: layout.sizes.center, height: layout.sizes.center, transform: `translate(${layout.cx - layout.sizes.center / 2}px, ${layout.cy - layout.sizes.center / 2}px)` }}>
              <img src={center.image} alt={center.name} width={768} height={1024} className="size-full object-cover" />
            </div>

            {layout.placed.map(({ person, x, y, size, tierIndex }) => {
              const active = selected?.id === person.id;
              const highlighted = active || hoveredId === person.id;
              const tierDelay = person.tier === "closest" ? 0 : person.tier === "trusted" ? .22 : .44;
              const showName = !layout.narrow || person.tier !== "wider" || active;
              const showRole = active || (!layout.narrow && person.tier !== "wider");
              return (
                <Button
                  key={person.id}
                  ref={(node) => { if (node) avatarRefs.current.set(person.id, node); else avatarRefs.current.delete(person.id); }}
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-pressed={active}
                  onClick={(event) => { event.stopPropagation(); selectPerson(person); }}
                  onMouseEnter={() => setHoveredId(person.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(person.id)}
                  onBlur={() => setHoveredId(null)}
                  aria-label={`${person.name}, ${person.role}, ${tierNames[person.tier]}`}
                  className={cn("network-person absolute left-0 top-0 z-10 block rounded-full p-0 hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper", `network-person-${person.tier}`, highlighted && "is-active", entranceActive && "is-entering")}
                  style={{
                    width: size,
                    height: size,
                    transform: `translate(${x - size / 2}px, ${y - size / 2}px)`,
                    animationDelay: `${tierDelay + tierIndex * .05}s`,
                    "--network-dx": `${layout.cx - x}px`,
                    "--network-dy": `${layout.cy - y}px`,
                  } as CSSProperties}
                >
                  <span className="block size-full overflow-hidden rounded-full border-2 bg-muted network-person-avatar"><img src={person.image} alt="" width={768} height={1024} loading="lazy" className="size-full object-cover" /></span>
                  {showName && <span className={cn("pointer-events-none absolute left-1/2 top-full mt-1.5 block w-[132px] -translate-x-1/2 text-center", person.tier === "wider" ? "text-[12.5px] font-medium text-paper/70" : "text-sm font-semibold text-paper")}>
                    <span className="block truncate">{person.name}</span>
                    {showRole && <span className="block truncate text-[11px] font-normal text-paper/45">{person.role} · {person.company}</span>}
                  </span>}
                </Button>
              );
            })}
          </>}
        </div>

        <div className="relative z-20 grid shrink-0 gap-4 px-5 pb-4 pt-3 sm:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] sm:items-end sm:px-8 sm:pb-6">
          <div className="order-2 flex gap-4 text-[10px] font-medium text-paper/45 sm:order-1 sm:gap-5 sm:text-[11px]">
            <span className="flex items-center gap-2"><i className="size-2 rounded-full bg-signal" /> Closest</span>
            <span className="flex items-center gap-2"><i className="size-2 rounded-full bg-primary" /> Trusted</span>
            <span className="flex items-center gap-2"><i className="size-2 rounded-full bg-paper/40" /> Wider world</span>
          </div>
          {/* The slot keeps the default card's height so the stage never resizes; taller cards grow upward over the network. */}
          <div className="relative order-1 w-full sm:order-2 sm:justify-self-end">
            <div aria-hidden="true" className="invisible rounded-md border p-4">{promisingPath}</div>
            <div aria-live="polite" className="absolute inset-x-0 bottom-0 max-h-[55dvh] overflow-y-auto rounded-md border border-paper/10 bg-ink/85 p-4 backdrop-blur-xl sm:max-h-[60vh]">
              {selected
                ? <PersonDetailCard key={selected.id} person={selected} center={center} headingRef={headingRef} sent={sentIds.includes(selected.id)} onSent={() => setSentIds((ids) => [...ids, selected.id])} onViewWorld={() => moveTo(selected)} />
                : promisingPath}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function HarmonyApp() {
  const [intro, setIntro] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("For you");
  const [selected, setSelected] = useState<Person | null>(null);
  const [networkPerson, setNetworkPerson] = useState<Person | null>(null);

  const visiblePeople = useMemo(() => people.filter((person) => {
    const textMatch = `${person.name} ${person.role} ${person.company} ${person.interests.join(" ")}`.toLowerCase().includes(query.toLowerCase());
    return textMatch && (filter === "For you" || person.interests.includes(filter));
  }), [filter, query]);

  if (networkPerson) return <NetworkExplorer initial={networkPerson} onExit={() => setNetworkPerson(null)} />;

  return (
    <div className="min-h-screen bg-background">
      {intro && <Intro onEnter={() => setIntro(false)} />}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 sm:px-8"><BrandMark /><div className="flex items-center gap-3 text-xs font-medium text-muted-foreground"><span className="hidden sm:inline">Founders’ House</span><span className="flex items-center gap-1.5 text-foreground"><span className="size-2 rounded-full bg-success" /> 128 here</span><div className="ml-1 size-8 overflow-hidden rounded-full bg-muted"><img src={visheshImage} alt="Your profile" width={768} height={1024} className="h-full w-full object-cover" /></div></div></div>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        <section className="flex flex-col justify-between gap-8 border-b border-border pb-9 lg:flex-row lg:items-end">
          <div><div className="flex items-center gap-2 text-xs font-semibold uppercase text-primary"><MapPin className="size-3.5" /> Shoreditch, London · Now</div><h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[0.95] sm:text-7xl">Find your people<br /><em className="font-serif font-normal text-signal">in the room.</em></h1><p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">A room full of possibility, ordered around what matters to you.</p></div>
          <div className="w-full lg:max-w-md"><label className="relative block"><Search className="absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people, ideas, companies…" className="h-12 rounded-full border-border bg-card pl-11 pr-12 shadow-none" />{query && <Button variant="ghost" size="icon" onClick={() => setQuery("")} className="absolute right-1.5 top-1.5 rounded-full"><X /></Button>}</label></div>
        </section>

        <div className="no-scrollbar flex gap-2 overflow-x-auto py-6">
          {filters.map((item) => <Button key={item} variant={filter === item ? "default" : "outline"} onClick={() => setFilter(item)} className={cn("rounded-full shadow-none", filter === item ? "bg-ink text-paper hover:bg-ink/90" : "bg-transparent")}>{filter === item && <Check className="size-3.5" />}{item}</Button>)}
        </div>

        <div className="mb-6 flex items-center justify-between"><p className="text-xs font-semibold uppercase text-muted-foreground">Curated for you · {visiblePeople.length} people</p><span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Users className="size-3.5" /> Live room</span></div>

        {visiblePeople.length > 0 ? <section className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">{visiblePeople.map((person) => <PersonCard key={person.id} person={person} onSelect={setSelected} />)}</section> : <div className="grid min-h-80 place-items-center border-y border-border text-center"><div><p className="font-display text-2xl font-semibold">No one here yet</p><p className="mt-2 text-sm text-muted-foreground">Try a broader idea or clear your search.</p><Button variant="outline" onClick={() => { setQuery(""); setFilter("For you"); }} className="mt-5 rounded-full">Show everyone</Button></div></div>}
      </main>

      {selected && <DetailPanel person={selected} onClose={() => setSelected(null)} onExplore={() => { setNetworkPerson(selected); setSelected(null); }} />}
    </div>
  );
}