# VidyaQuest — React + Three.js Ohm's Law Lab (connected GLB)

## Run
```bash
npm install
npm run dev
```
Open the Vite URL (usually http://localhost:5173).

## Included Blender model
The exact uploaded `VidyaQuest_OhmsLaw.glb` is already placed at:
`public/models/VidyaQuest_OhmsLaw.glb`

The GLB was inspected and contains all eight required terminal node names:
- `TERM_PSU_POS`, `TERM_PSU_NEG`
- `TERM_AMMETER_IN`, `TERM_AMMETER_OUT`
- `TERM_RESISTOR_IN`, `TERM_RESISTOR_OUT`
- `TERM_VOLTMETER_POS`, `TERM_VOLTMETER_NEG`

It also contains `SWITCH_LEVER_ANIMATED` and an animation clip named
`SWITCH_LEVER_ANIMATEDAction.001`. The React power toggle drives that clip
to its on/off end position.

## Actual model integration
- Loads the included GLB with `useGLTF`.
- Reads terminal world positions from the real named nodes at runtime.
- Places interactive terminal hit targets at those exact positions.
- Sets imported meshes to cast and receive Three.js shadows.
- Uses the exported switch animation for the power toggle.
- Draws wire curves between the real terminal positions.

## Interaction
Press and hold a terminal, drag to another terminal, and release. Alternatively, click one terminal and then click another.
Drag empty space to orbit; scroll/pinch to zoom.
Adjust voltage and resistance; connect the three main series leads before
turning on the supply. The voltmeter leads are checked as a separate mission.

## Simulation scope
This is an educational fixed-topology Ohm's Law simulation using `I = V / R`.
It is not a general-purpose circuit solver; incorrect electrical topologies
are not yet solved for arbitrary circuit behaviour.

## Build
```bash
npm run build
```
Deploy `dist/` to Vercel, Netlify, or another static host.
