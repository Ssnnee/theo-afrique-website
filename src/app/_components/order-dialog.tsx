"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { generateWhatsAppLink } from "~/lib/whatsapp";
import { ProductSchema } from "~/types";
import { OrderFormSchema } from "~/types";
import Image from "next/image";

type OrderFormValues = z.infer<typeof OrderFormSchema>;

export default function OrderDialog({
  product,
}: {
  product: z.infer<typeof ProductSchema>;
}) {
  const [open, setOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      name: "",
      selectedSizes: [],
      selectedColors: [],
      quantity: 1,
      customSizing: false,
      shirtSize: "",
      pantsSize: "",
    },
  });

  const quantity = form.watch("quantity");
  const selectedSizes = form.watch("selectedSizes");
  const selectedColors = form.watch("selectedColors");
  const customSizing = form.watch("customSizing");

  useEffect(() => {
    const errors: string[] = [];

    if (selectedSizes.length > quantity) {
      errors.push(`Vous ne pouvez sélectionner que ${quantity} taille(s) maximum`);
    }

    if (selectedColors.length > quantity) {
      errors.push(`Vous ne pouvez sélectionner que ${quantity} couleur(s) maximum`);
    }

    if (!customSizing) {
      if (selectedSizes.length === 0) {
        errors.push("Veuillez sélectionner au moins une taille");
      }
      if (selectedColors.length === 0) {
        errors.push("Veuillez sélectionner au moins une couleur");
      }
    }

    setValidationErrors(errors);
  }, [quantity, selectedSizes, selectedColors, customSizing]);

  useEffect(() => {
    if (selectedSizes.length > quantity) {
      form.setValue("selectedSizes", selectedSizes.slice(0, quantity));
    }
    if (selectedColors.length > quantity) {
      form.setValue("selectedColors", selectedColors.slice(0, quantity));
    }
  }, [quantity, selectedSizes, selectedColors, form]);

  const toggleMultiSelect = (
    field: keyof Pick<OrderFormValues, "selectedSizes" | "selectedColors">,
    value: string
  ) => {
    const current = form.getValues(field);
    const isSelected = current.includes(value);

    if (isSelected) {
      form.setValue(
        field,
        current.filter((v) => v !== value)
      );
    } else {
      if (current.length < quantity) {
        form.setValue(field, [...current, value]);
      }
    }
  };

  const isSelectionDisabled = (
    field: keyof Pick<OrderFormValues, "selectedSizes" | "selectedColors">,
    value: string
  ) => {
    const current = form.getValues(field);
    return !current.includes(value) && current.length >= quantity;
  };

  const onSubmit = (values: OrderFormValues) => {
    if (validationErrors.length > 0) {
      return;
    }

    const link = generateWhatsAppLink({
      product: {
        name: product.name,
        price: product.price,
      },
      name: values.name,
      quantity: values.quantity,
      selectedSizes: values.selectedSizes,
      selectedColors: values.selectedColors,
      imageUrl: product.imageUrl,
      customSizing: values.customSizing
        ? {
            shirtSize: values.shirtSize || "",
            pantsSize: values.pantsSize || undefined,
          }
        : undefined,
    });

    window.open(link, "_blank");
    form.reset();
    setOpen(false);
  };

  const getSelectionSummary = () => {
    const sizesCount = selectedSizes.length;
    const colorsCount = selectedColors.length;
    const remaining = quantity - Math.max(sizesCount, colorsCount);

    return {
      sizesCount,
      colorsCount,
      remaining,
      isComplete: !customSizing && sizesCount > 0 && colorsCount > 0
    };
  };

  const summary = getSelectionSummary();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center justify-center gap-2 cursor-pointer">
          <Image
            src="/icons/light-whatsapp.svg"
            alt="WhatsApp Icon"
            width={15}
            height={15}
          />
          <span>Commander</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Commander : {product.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Mettez un nom ou pseudo par lequel vous souhaitez être
                    appelé.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantité</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      {...field}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-sm p-2">
              Quantité: {quantity} | Tailles: {summary.sizesCount} | Couleurs: {summary.colorsCount}
            </div>

            <FormField
              control={form.control}
              name="customSizing"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="custom-sizing"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FormLabel htmlFor="custom-sizing">
                      Taille indisponible ? Faire confectionner
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {!customSizing && (
              <>
                <div className="space-y-2">
                  <FormLabel>
                    Tailles disponibles ({selectedSizes.length}/{quantity})
                  </FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSizes.includes(size);
                      const isDisabled = isSelectionDisabled("selectedSizes", size);

                      return (
                        <label
                          key={size}
                          className={`flex items-center gap-2 ${ isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer' }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            disabled={isDisabled}
                            onCheckedChange={() => toggleMultiSelect("selectedSizes", size)}
                          />
                          <span className={isSelected ? 'font-medium' : ''}>{size}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <FormLabel>
                    Couleurs disponibles ({selectedColors.length}/{quantity})
                  </FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => {
                      const isSelected = selectedColors.includes(color);
                      const isDisabled = isSelectionDisabled("selectedColors", color);

                      return (
                        <label
                          key={color}
                          className={`flex items-center gap-2 ${
isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
}`}
                        >
                          <Checkbox
                            checked={isSelected}
                            disabled={isDisabled}
                            onCheckedChange={() => toggleMultiSelect("selectedColors", color)}
                          />
                          <span className={isSelected ? 'font-medium' : ''}>{color}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {customSizing && (
              <div className="space-y-2 p-4 rounded">
                <FormField
                  control={form.control}
                  name="shirtSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taille haut *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: M, L, XL ou mesures spécifiques" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pantsSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taille pantalon (optionnel)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: 32, 34, 36 ou mesures spécifiques" />
                      </FormControl>
                      <FormDescription>
                        Vous pouvez laisser vide si vous ne souhaitez pas de
                        pantalon. Ou si le produit n'en nécessite pas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  <ul className="list-disc pl-4">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={validationErrors.length > 0}
            >
              Envoyer sur WhatsApp
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
