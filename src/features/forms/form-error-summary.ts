import type { FieldErrors, FieldValues } from "react-hook-form";

function appendFieldMessages(messages: Set<string>, field: unknown) {
  if (!field) {
    return;
  }

  if (Array.isArray(field)) {
    field.forEach((item) => appendFieldMessages(messages, item));
    return;
  }

  if (typeof field === "object" && field !== null) {
    const nextField = field as { message?: unknown };

    if (typeof nextField.message === "string" && nextField.message.length > 0) {
      messages.add(nextField.message);
    }
  }
}

export function collectErrorSummary<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
  fieldNames: Array<keyof FieldErrors<TFieldValues>>,
) {
  const messages = new Set<string>();

  fieldNames.forEach((fieldName) => {
    appendFieldMessages(messages, errors[fieldName]);
  });

  return Array.from(messages);
}
