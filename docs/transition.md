# Transitions

Five focused files — each transition type lives in its own component.

| File | Exports |
|------|---------|
| `components/ui/Transition.tsx` | `Transition`, `TransitionPreset` |
| `components/ui/TransitionGroup.tsx` | `TransitionGroup`, `TransitionItem`, `useTransitionGroup` |
| `components/ui/DrillTransition.tsx` | `DrillGroup`, `DrillItem`, `useDrill` |
| `components/ui/ContinuityTransition.tsx` | `ContinuityProvider`, `ContinuityElement`, `useContinuity` |
| `components/ui/TransitionLink.tsx` | `TransitionLink` |

---

## Transition — show / hide

```tsx
import { Transition } from "@/components/ui/Transition";

<Transition show={open} preset="slide-up" duration={250}>
  <div>Content</div>
</Transition>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `show` | `boolean` | — | Controls mount + visibility |
| `preset` | `TransitionPreset` | `"fade"` | Animation style |
| `duration` | `number` | `250` | Duration in ms |
| `className` | `string` | — | Extra classes |

**Presets:** `fade` · `slide-up` · `slide-down` · `slide-left` · `slide-right` · `scale`

Mounts on `show=true`, unmounts after exit animation completes.

---

## TransitionGroup — context-coordinated switching

```tsx
import { TransitionGroup, TransitionItem, useTransitionGroup } from "@/components/ui/TransitionGroup";

<TransitionGroup defaultKey="tab1" preset="fade">
  <TabNav />
  <TransitionItem id="tab1"><PanelA /></TransitionItem>
  <TransitionItem id="tab2"><PanelB /></TransitionItem>
</TransitionGroup>

function TabNav() {
  const { activeKey, navigate } = useTransitionGroup();
  return <button onClick={() => navigate("tab2")}>Tab 2</button>;
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultKey` | `string` | — | Initially active item |
| `preset` | `TransitionPreset` | `"fade"` | Shared animation |
| `duration` | `number` | `250` | Shared duration |

---

## DrillTransition — directional drill navigation

Tracks a history stack; direction reverses automatically on `back()`.

```tsx
import { DrillGroup, DrillItem, useDrill } from "@/components/ui/DrillTransition";

<DrillGroup defaultKey="home" className="h-96">
  <DrillItem id="home"><HomeScreen /></DrillItem>
  <DrillItem id="detail"><DetailScreen /></DrillItem>
</DrillGroup>

function HomeScreen() {
  const { navigate } = useDrill();
  return <button onClick={() => navigate("detail")}>Open →</button>;
}

function DetailScreen() {
  const { back } = useDrill();
  return <button onClick={back}>← Back</button>;
}
```

`DrillGroup` is `position: relative; overflow: hidden` — set an explicit height via `className`.

| `useDrill` value | Type | Description |
|-----------------|------|-------------|
| `navigate(key)` | `(key: string) => void` | Push screen (slides in from right) |
| `back()` | `() => void` | Pop screen (slides in from left) |
| `canGoBack` | `boolean` | False at root |

---

## ContinuityTransition — shared-element FLIP

Animates a named element from its old position/size to its new one, even across component unmounts.

```tsx
import { ContinuityProvider, ContinuityElement, useContinuity } from "@/components/ui/ContinuityTransition";

// 1. Wrap your feature in a provider
<ContinuityProvider duration={380}>
  <MyFeature />
</ContinuityProvider>

// 2. Call snapshot() before the state change, then change state
function MyFeature() {
  const [expanded, setExpanded] = useState(false);
  const { snapshot } = useContinuity();

  if (expanded) {
    return (
      <ContinuityElement name="hero">
        <div className="w-full h-64 bg-accent rounded-xl">
          <button onClick={() => { snapshot("hero"); setExpanded(false); }}>Close</button>
        </div>
      </ContinuityElement>
    );
  }

  return (
    <ContinuityElement name="hero">
      <button
        className="w-24 h-24 bg-accent rounded-xl"
        onClick={() => { snapshot("hero"); setExpanded(true); }}
      />
    </ContinuityElement>
  );
}
```

**How it works:** `snapshot(name)` records the element's current `DOMRect`. After the state change, the new `ContinuityElement` with the same `name` finds the snapshot in `useLayoutEffect`, applies the inverse transform (FLIP First/Invert), then animates to its natural position (Play).

| Prop / value | Type | Description |
|-------------|------|-------------|
| `ContinuityProvider duration` | `number` | Animation duration (default `380`) |
| `ContinuityElement name` | `string` | Unique key — matched elements FLIP between each other |
| `snapshot(name)` | `(name: string) => void` | Call before ANY state change that moves the element |

---

## TransitionLink — page navigation

```tsx
import { TransitionLink } from "@/components/ui/TransitionLink";

<TransitionLink href="/about" className="...">Go to About</TransitionLink>
```

Uses the [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) in Chrome/Edge. Falls back to `router.push()`.
CSS animations defined in `globals.css` via `::view-transition-old(root)` and `::view-transition-new(root)`.
