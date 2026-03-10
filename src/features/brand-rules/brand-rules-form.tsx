"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
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

import { updateBrandRulesRequest } from "./brand-rules.api";
import { BrandRulesArrayField } from "./brand-rules-array-field";
import {
  brandRulesFormSchema,
  type BrandRulesFormValues,
} from "./brand-rules-form-schema";

type BrandRulesFormProps = {
  brandRulesId: string;
  initialValues: BrandRulesFormValues;
};

export function BrandRulesForm({
  brandRulesId,
  initialValues,
}: BrandRulesFormProps) {
  const { pushToast } = useToast();
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<BrandRulesFormValues>({
    resolver: zodResolver(brandRulesFormSchema),
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

  const toneRules = useWatch({ control, name: "toneRules" });
  const avoidRules = useWatch({ control, name: "avoidRules" });
  const priorityRules = useWatch({ control, name: "priorityRules" });

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
        "brandName",
        "positioning",
        "toneRules",
        "avoidRules",
        "priorityRules",
      ]),
    [errors],
  );

  const isWorking = isSubmitting || isPending;

  const onSubmit = handleSubmit((values) => {
    setSubmitMessage(null);

    startTransition(async () => {
      try {
        const { brandRules } = await updateBrandRulesRequest(brandRulesId, values);
        reset(values);
        setSubmitMessage("Brand rules have been saved.");
        pushToast({
          tone: "success",
          title: "Brand rules updated",
          description: `${brandRules.brandName} guidance is now active.`,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Please try again shortly.";

        setSubmitMessage(message);
        pushToast({
          tone: "error",
          title: "Brand rules save failed",
          description: message,
        });
      }
    });
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
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
          <CardTitle>Global brand configuration</CardTitle>
          <CardDescription>
            This is the shared guidance layer used by every generation flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand name</Label>
            <Input id="brandName" {...register("brandName")} />
            <p className="text-sm text-muted-foreground">
              Used as the primary brand identifier across generated copy.
            </p>
            <p className="text-sm text-destructive">{errors.brandName?.message}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="positioning">Positioning</Label>
            <Textarea id="positioning" {...register("positioning")} />
            <p className="text-sm text-muted-foreground">
              Define how the brand should be framed in marketing language.
            </p>
            <p className="text-sm text-destructive">{errors.positioning?.message}</p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <BrandRulesArrayField
              errors={errors}
              values={toneRules}
              setValue={setValue}
              name="toneRules"
              label="Tone rules"
              description="Voice and wording guidance the generator should consistently follow."
              placeholder="practical and confident"
            />

            <BrandRulesArrayField
              errors={errors}
              values={avoidRules}
              setValue={setValue}
              name="avoidRules"
              label="Avoid rules"
              description="Claims, tones, or patterns the brand should stay away from."
              placeholder="exaggerated claims"
            />
          </div>

          <BrandRulesArrayField
            errors={errors}
            values={priorityRules}
            setValue={setValue}
            name="priorityRules"
            label="Priority rules"
            description="Messages that should be emphasized first during generation."
            placeholder="roasting intent"
          />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="text-sm text-muted-foreground">
          {submitMessage ??
            (isDirty
              ? "You have unsaved changes."
              : "Current changes are already saved.")}
        </div>
        <Button type="submit" disabled={isWorking} className="gap-2">
          {isWorking ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {isWorking ? "Saving..." : "Save brand rules"}
        </Button>
      </div>
    </form>
  );
}
