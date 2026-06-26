import { InnerPage } from "@/components/InnerPage";
import { ContactForm } from "@/components/ContactForm";
import "./contact.css";

export const metadata = { title: "The Underwater Post Office", description: "Send something thoughtful across the water." };
export default function ContactPage() { return <InnerPage eyebrow="Turtle mail · ocean route 01" title="The Underwater Post Office" intro="Every good conversation starts by sending something across the water." variant="contact"><ContactForm/></InnerPage>; }
