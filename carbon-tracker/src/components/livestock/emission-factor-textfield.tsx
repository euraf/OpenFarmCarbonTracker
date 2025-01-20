import { autoUpdate } from "@floating-ui/dom";
import { useFloating } from "solid-floating-ui";
import { createSignal, Show } from "solid-js";
import { TextField, TextFieldInput, TextFieldLabel } from "../ui/text-field";
import { IconUpdates } from "../ui/icons";

export function EmissionFactorField({
  label,
  value,
  defaultValue,
  onChange,
}: {
  label: string;
  value: () => number;
  defaultValue: number;
  onChange: (value: number) => void;
}) {
  const [reference, setReference] = createSignal();
  const [floating, setFloating] = createSignal();

  const position = useFloating(reference, floating, {
    whileElementsMounted: (reference, floating, update) =>
      autoUpdate(reference, floating, update, {
        animationFrame: true,
      }),
  });

  const [isHovered, setIsHovered] = createSignal(false);

  return (
    <TextField class="w-full max-w-sm">
      <TextFieldLabel>{label}</TextFieldLabel>
      <div class="flex items-center">
        <TextFieldInput
          type="number"
          class={value() !== defaultValue ? "border-blue-500 border-4" : ""}
          min={0}
          value={value()}
          onInput={(e) => onChange(parseFloat(e.currentTarget.value))}
        />
        <Show when={value() !== defaultValue}>
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <IconUpdates
              ref={setReference}
              color="black"
              class="ml-2"
              height={30}
              onclick={() => onChange(defaultValue)}
            />
            <Show when={isHovered()}>
              <div
                ref={setFloating}
                style={{
                  position: position.strategy,
                  top: `${position.y ?? 0}px`,
                  left: `${position.x ?? 0}px`,
                }}
              >
                Reset
              </div>
            </Show>
          </div>
        </Show>
      </div>
    </TextField>
  );
}