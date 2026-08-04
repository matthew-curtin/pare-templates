import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Your basket",
};

export default function CartPage() {
  return (
    <>
      <PageHeader eyebrow="Basket" title="What you are taking home" />
      <Container width="wide" className="py-12 sm:py-16">
        <CartView />
      </Container>
    </>
  );
}
