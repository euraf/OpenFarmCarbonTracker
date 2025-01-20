import { IconUpdates } from "../ui/icons";
import { TextField, TextFieldInput, TextFieldLabel } from "../ui/text-field";
import { Show, createSignal } from "solid-js";
import { useFloating } from "solid-floating-ui";
import { autoUpdate } from "@floating-ui/dom";

export function ConversionUnitField({
  label,
  value,
  defaultValue,
  onChange,
  unit,
}: {
  label: string;
  value: () => number;
  defaultValue: number;
  onChange: (value: number) => void;
  unit: string;
}) {
  const [reference, setReference] = createSignal();
  const [floating, setFloating] = createSignal();
  const [isHovered, setIsHovered] = createSignal(false);

  const position = useFloating(reference, floating, {
    whileElementsMounted: (reference, floating, update) =>
      autoUpdate(reference, floating, update, {
        animationFrame: true,
      }),
  });

  return (
    <TextField class="inline-grid w-full max-w-[200px] items-center gap-1.5">
      <TextFieldLabel>{label} ({unit})</TextFieldLabel>
      <div class="flex items-center">
        <TextFieldInput
          type="number"
          class={value() !== defaultValue ? `border-blue-500 border-4`: ''}
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
