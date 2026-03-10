"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { collectErrorSummary } from "@/features/forms/form-error-summary";

import { ProductArrayField } from "./product-array-field";
import {
  productCategoryOptions,
  productFormDefaults,
  productFormSchema,
  type ProductFormValues,
} from "./product-form-schema";
import { createProductRequest, updateProductRequest } from "./products.api";
import { ProductRowActions } from "./product-row-actions";

type ProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
  initialValues?: ProductFormValues;
};

const selectClassName =
  "flex h-11 w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-destructive">{message}</p>;
}

function ScoreField({
  id,
  label,
  description,
  error,
  register,
}: {
  id: keyof Pick<
    ProductFormValues,
    "bodyScore" | "acidityScore" | "sweetnessScore" | "balanceScore"
  >;
  label: string;
  description: string;
  error?: string;
  register: ReturnType<typeof useForm<ProductFormValues>>["register"];
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        className={selectClassName}
        {...register(id, { valueAsNumber: true })}
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      <p className="text-sm text-muted-foreground">{description}</p>
      <FieldError message={error} />
    </div>
  );
}

export function ProductForm({
  mode,
  productId,
  initialValues = productFormDefaults,
}: ProductFormProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  const {
    control,
    formState: { errors, isDirty, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
  } = form;

  const tastingNotes = useWatch({ control, name: "tastingNotes" });
  const differentiators = useWatch({ control, name: "differentiators" });
  const weightOptions = useWatch({ control, name: "weightOptions" });
  const faqSeedNotes = useWatch({ control, name: "faqSeedNotes" });
  const reviewTexts = useWatch({ control, name: "reviewTexts" });
  const recommendedBrewMethods = useWatch({
    control,
    name: "recommendedBrewMethods",
  });
  const grindOptions = useWatch({ control, name: "grindOptions" });

  const isWorking = isSubmitting || isPending;

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const errorSummary = useMemo(
    () =>
      collectErrorSummary(errors, [
        "productName",
        "category",
        "beanComposition",
        "roastPoint",
        "priceInfo",
        "shippingFreshnessInfo",
        "targetCustomer",
        "tastingNotes",
        "recommendedBrewMethods",
        "weightOptions",
        "differentiators",
        "reviewTexts",
        "grindOptions",
        "faqSeedNotes",
      ]),
    [errors],
  );

  function handleCancel() {
    if (isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Leave this page anyway?",
      );

      if (!confirmed) {
        return;
      }
    }

    router.push("/");
  }

  const onSubmit = handleSubmit((values) => {
    setSubmitMessage(null);

    startTransition(async () => {
      try {
        if (mode === "create") {
          const { product } = await createProductRequest(values);
          pushToast({
            tone: "success",
            title: "Product created",
            description: "The new draft is ready on the detail page.",
          });
          reset(values);
          router.push(`/products/${product.id}`);
          router.refresh();
          return;
        }

        if (!productId) {
          throw new Error("Missing product id for update.");
        }

        await updateProductRequest(productId, values);
        reset(values);
        setSubmitMessage("Latest changes have been saved.");
        pushToast({
          tone: "success",
          title: "Product updated",
        });
        router.refresh();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Please try again shortly.";

        setSubmitMessage(message);
        pushToast({
          tone: "error",
          title: "Save failed",
          description: message,
        });
      }
    });
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <Card>
        <CardHeader className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-1">
            <CardTitle>
              {mode === "create" ? "Create product draft" : "Edit product"}
            </CardTitle>
            <CardDescription>
              Save product data first, then continue into the generation workspace.
            </CardDescription>
          </div>

          {mode === "edit" && productId ? (
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/products/${productId}/results`}>
                  Open generation workspace
                </Link>
              </Button>
              <ProductRowActions productId={productId} redirectOnDeleteTo="/" compact />
            </div>
          ) : null}
        </CardHeader>
      </Card>

      {errorSummary.length > 0 ? (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-base text-destructive">
              Some fields need attention
            </CardTitle>
            <CardDescription>
              Fix the items below, then try saving again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-destructive">
              {errorSummary.map((message) => (
                <li key={message}>- {message}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Basic info</CardTitle>
          <CardDescription>
            Core catalog information and commercial basics used across channels.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="productName">Product name</Label>
            <Input id="productName" placeholder="Apollo Blend" {...register("productName")} />
            <FieldError message={errors.productName?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select id="category" className={selectClassName} {...register("category")}>
              {productCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FieldError message={errors.category?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="beanComposition">Bean composition</Label>
            <Textarea
              id="beanComposition"
              placeholder="Blend structure, origin mix, and why the beans were selected."
              {...register("beanComposition")}
            />
            <FieldError message={errors.beanComposition?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roastPoint">Roast point</Label>
            <Textarea
              id="roastPoint"
              placeholder="Roast degree and intended extraction behavior."
              {...register("roastPoint")}
            />
            <FieldError message={errors.roastPoint?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceInfo">Price info</Label>
            <Textarea
              id="priceInfo"
              placeholder="200g 9,900 KRW / 500g 21,900 KRW / 1kg 40,000 KRW"
              {...register("priceInfo")}
            />
            <FieldError message={errors.priceInfo?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shippingFreshnessInfo">Shipping freshness info</Label>
            <Textarea
              id="shippingFreshnessInfo"
              placeholder="How roasting freshness and shipping handling should be explained."
              {...register("shippingFreshnessInfo")}
            />
            <FieldError message={errors.shippingFreshnessInfo?.message} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Flavor profile</CardTitle>
          <CardDescription>
            Sensory profile, taste scores, and product differentiation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-4">
            <ScoreField
              id="bodyScore"
              label="Body score"
              description="1 is light, 5 is heavy."
              error={errors.bodyScore?.message}
              register={register}
            />
            <ScoreField
              id="acidityScore"
              label="Acidity score"
              description="1 is low acidity, 5 is bright acidity."
              error={errors.acidityScore?.message}
              register={register}
            />
            <ScoreField
              id="sweetnessScore"
              label="Sweetness score"
              description="1 is dry, 5 is sweet."
              error={errors.sweetnessScore?.message}
              register={register}
            />
            <ScoreField
              id="balanceScore"
              label="Balance score"
              description="Overall harmony of the cup."
              error={errors.balanceScore?.message}
              register={register}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <ProductArrayField
              errors={errors}
              values={tastingNotes}
              setValue={setValue}
              name="tastingNotes"
              label="Tasting notes"
              description="Core flavor cues you want the generator to emphasize."
              placeholder="Chocolate"
              minimumRows={1}
            />
            <ProductArrayField
              errors={errors}
              values={differentiators}
              setValue={setValue}
              name="differentiators"
              label="Differentiators"
              description="What makes this product commercially distinct."
              placeholder="Roasting structure tuned for milk drinks"
              minimumRows={1}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer and use cases</CardTitle>
          <CardDescription>
            Position the product for the right buyer and buying context.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-2 xl:col-span-2">
            <Label htmlFor="targetCustomer">Target customer</Label>
            <Textarea
              id="targetCustomer"
              placeholder="Who this coffee is best for and how they use it."
              {...register("targetCustomer")}
            />
            <FieldError message={errors.targetCustomer?.message} />
          </div>

          <ProductArrayField
            errors={errors}
            values={weightOptions}
            setValue={setValue}
            name="weightOptions"
            label="Weight options"
            description="Pack sizes sold for this product."
            placeholder="200g"
            minimumRows={1}
          />

          <ProductArrayField
            errors={errors}
            values={faqSeedNotes}
            setValue={setValue}
            name="faqSeedNotes"
            label="FAQ seed notes"
            description="Common buying questions or objections to address later."
            placeholder="Does this work well as espresso?"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>
            Optional customer language that can be echoed in marketing copy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductArrayField
            errors={errors}
            values={reviewTexts}
            setValue={setValue}
            name="reviewTexts"
            label="Review texts"
            description="Short review quotes or paraphrased review patterns."
            placeholder="Great chocolate depth with milk-based drinks."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grind and brew</CardTitle>
          <CardDescription>
            Brewing recommendations and purchase-time preparation options.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 xl:grid-cols-2">
          <ProductArrayField
            errors={errors}
            values={recommendedBrewMethods}
            setValue={setValue}
            name="recommendedBrewMethods"
            label="Recommended brew methods"
            description="Methods the product is designed to perform well in."
            placeholder="Espresso"
            minimumRows={1}
          />

          <ProductArrayField
            errors={errors}
            values={grindOptions}
            setValue={setValue}
            name="grindOptions"
            label="Grind options"
            description="Grinding choices available to customers."
            placeholder="Whole bean"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Research and photo notes</CardTitle>
          <CardDescription>
            Optional context used later during content generation and review.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="researchSummary">Research summary</Label>
            <Textarea
              id="researchSummary"
              placeholder="Market context, roasting notes, or operator research summary."
              {...register("researchSummary")}
            />
            <FieldError message={errors.researchSummary?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoNotes">Photo notes</Label>
            <Textarea
              id="photoNotes"
              placeholder="Packaging, visual cues, detail page image ideas, or visual constraints."
              {...register("photoNotes")}
            />
            <FieldError message={errors.photoNotes?.message} />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="text-sm text-muted-foreground">
          {submitMessage ??
            (isDirty
              ? "You have unsaved changes."
              : "Current changes are already saved.")}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isWorking} className="gap-2">
            {isWorking ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {isWorking
              ? mode === "create"
                ? "Creating..."
                : "Saving..."
              : mode === "create"
                ? "Create product"
                : "Save product"}
          </Button>
        </div>
      </div>
    </form>
  );
}
