import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { ShopFilters } from "@/components/shop-filters";
import { coffees } from "@/content/coffees";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Six single lots and one blend, roasted the night before we post them.",
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        eyebrow="The coffee"
        title="Six at a time, no more"
        description="We roast a small range properly rather than a long one adequately. Everything here was roasted this week, and everything lists what is in it."
      />
      <Container width="wide" className="py-12 sm:py-16">
        <ShopFilters coffees={coffees} />
      </Container>
    </>
  );
}
