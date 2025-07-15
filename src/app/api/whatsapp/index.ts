export function generateWhatsAppLink({
  phone,
  product,
  name,
  email,
  selectedSizes,
  selectedColors,
  customSizing,
  imageUrl,
}: {
  phone: string;
  product: { name: string; price: number };
  name: string;
  email: string;
  selectedSizes: string[];
  selectedColors: string[];
  customSizing?: { shirtSize: string; pantsSize?: string };
  imageUrl?: string;
}) {
  const lines = [
    `Bonjour, je souhaite commander ce produit :`,
    ``,
    `🧥 Produit: ${product.name}`,
    `💰 Prix: ${product.price.toFixed(2)} CFA`,
  ];

  if (selectedSizes.length > 0) {
    lines.push(`📏 Tailles choisies: ${selectedSizes.join(", ")}`);
  }

  if (selectedColors.length > 0) {
    lines.push(`🎨 Couleurs choisies: ${selectedColors.join(", ")}`);
  }

  if (customSizing) {
    lines.push(`🪡 Confection sur mesure demandée:`);
    lines.push(` - Taille haut: ${customSizing.shirtSize}`);
    if (customSizing.pantsSize) {
      lines.push(` - Taille pantalon: ${customSizing.pantsSize}`);
    }
  }

  lines.push(``);
  lines.push(`👤 Nom: ${name}`);
  lines.push(`📧 Email: ${email}`);

  if (imageUrl) {
    lines.push(`📸 Image du produit: ${imageUrl}`);
  }

  lines.push(``);
  lines.push(`Merci !`);

  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
}
