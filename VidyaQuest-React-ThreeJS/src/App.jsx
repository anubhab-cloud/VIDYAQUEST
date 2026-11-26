import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Line, OrbitControls, Text, useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Activity, BookOpen, Check, ChevronRight, CircleHelp, Lightbulb, RotateCcw, Sparkles, Zap, Cable, Power } from "lucide-react";

const TERMINALS = [
  { id:"TERM_PSU_POS", label:"Power supply +", color:"#f0525d", pos:[-2.45, 1.34, 0.455] },
  { id:"TERM_PSU_NEG", label:"Power supply −", color:"#313b49", pos:[-3.05, 1.34, 0.455] },
  { id:"TERM_AMMETER_IN", label:"Ammeter IN", color:"#f0525d", pos:[-1.15, 1.2, 0.405] },
  { id:"TERM_AMMETER_OUT", label:"Ammeter OUT", color:"#313b49", pos:[-0.55, 1.2, 0.405] },
  { id:"TERM_RESISTOR_IN", label:"Resistor IN", color:"#f0525d", pos:[0.1, 1.36, 0.335] },
  { id:"TERM_RESISTOR_OUT", label:"Resistor OUT", color:"#313b49", pos:[1.6, 1.36, 0.335] },
  { id:"TERM_VOLTMETER_POS", label:"Voltmeter +", color:"#f0525d", pos:[2.42, 1.2, 0.405] },
  { id:"TERM_VOLTMETER_NEG", label:"Voltmeter −", color:"#313b49", pos:[3.08, 1.2, 0.405] }
];
const MAIN = [
  ["TERM_PSU_POS","TERM_AMMETER_IN"],
  ["TERM_AMMETER_OUT","TERM_RESISTOR_IN"],
  ["TERM_RESISTOR_OUT","TERM_PSU_NEG"]
];
const METER = [
  ["TERM_VOLTMETER_POS","TERM_RESISTOR_IN"],
  ["TERM_VOLTMETER_NEG","TERM_RESISTOR_OUT"]
];
const keyFor = (a,b) => [a,b].sort().join("|");

function FallbackLab() {
  const mat = (color, metal=0.1, rough=.5) => new THREE.MeshStandardMaterial({color,metalness:metal,roughness:rough});
  const wood=useMemo(()=>mat("#593b29"),[]);
  const navy=useMemo(()=>mat("#14263b",.5),[]);
  const white=useMemo(()=>mat("#e6edf1",.2),[]);
  const blue=useMemo(()=>mat("#1464b4",.3),[]);
  const dark=useMemo(()=>mat("#06121d",.1),[]);
  const metal=useMemo(()=>mat("#8d9ba8",.85,.25),[]);
  const red=useMemo(()=>mat("#ef4654",.2),[]);
  const green=useMemo(()=>mat("#20b98a",.2),[]);
  const box=(pos,scale,material,r=.05)=> <mesh position={pos} castShadow receiveShadow><boxGeometry args={scale}/><meshStandardMaterial color={material.color} metalness={material.metalness} roughness={material.roughness}/></mesh>;
  const device=(x,label,readout,color="#1b7b8c")=> <group position={[x,1.05,0]}>
    {box([0,0,0],[1.05,.72,.85],white)}
    {box([0,.10,-.44],[.73,.30,.025],dark)}
    <Text position={[0,.10,-.46]} fontSize={.14} color="#75e6ef" anchorX="center" anchorY="middle">{readout}</Text>
    <Text position={[0,.37,-.46]} fontSize={.10} color="#15283a" anchorX="center">{label}</Text>
  </group>;
  return <group>
    {box([0,.45,0],[8.3,.2,3.6],wood,.1)}
    {[-3.7,3.7].flatMap(x=>[-1.3,1.3].map(z=><mesh key={`${x}-${z}`} position={[x,-.15,z]} castShadow><boxGeometry args={[.2,1.1,.2]}/><meshStandardMaterial color="#24364a"/></mesh>))}
    {box([-2.75,1.05,0],[1.35,.8,1.05],blue)}
    {box([-.85,1.05,0],[1.05,.72,.95],white)}
    {box([.85,1.05,0],[1.45,.2,.85],navy)}
    {box([.85,1.35,0],[.75,.4,.42],white)}
    {device(2.75,"VOLTMETER","05.0 V")}
    <Text position={[-2.75,1.55,-.54]} fontSize={.13} color="white" anchorX="center">DC POWER</Text>
    <Text position={[-.85,1.50,-.50]} fontSize={.12} color="#14283c" anchorX="center">AMMETER</Text>
    <Text position={[.85,1.67,-.24]} fontSize={.12} color="white" anchorX="center">10 Ω RESISTOR</Text>
    {TERMINALS.map(t=><mesh key={t.id} position={[t.pos[0],t.pos[1],t.pos[2]]}><sphereGeometry args={[.001,8,8]}/><meshStandardMaterial color={t.color}/></mesh>)}
    {box([0,1.8,1.45],[8.2,1.7,.12],navy)}
    <Text position={[-3.65,2.15,1.36]} fontSize={.22} color="#eaf5ff" anchorX="left">VIDYAQUEST / PHYSICS LAB</Text>
    <Text position={[-3.65,1.85,1.36]} fontSize={.12} color="#53d7ed" anchorX="left">EXPERIMENT 01 — OHM'S LAW</Text>
  </group>;
}

function BlenderModel() {
  const { scene } = useGLTF("/models/VidyaQuest_OhmsLaw.glb");
  const clone = useMemo(()=>scene.clone(true),[scene]);
  return <primitive object={clone} />;
}

class ModelErrorBoundary extends React.Component {
  constructor(props){super(props);this.state={failed:false};}
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(){this.props.onFallback?.();}
  render(){return this.state.failed ? null : this.props.children;}
}

function Terminal({terminal,position,active,onStart,onFinish,onHover}) {
  const [hover,setHover]=useState(false);
  return <group position={position}>
    <mesh
      onPointerDown={e=>{e.stopPropagation();onStart(terminal.id);}}
      onPointerUp={e=>{e.stopPropagation();onFinish(terminal.id);}}
      onPointerOver={e=>{e.stopPropagation();setHover(true);document.body.style.cursor="crosshair";}}
      onPointerOut={()=>{setHover(false);document.body.style.cursor="auto";}}
    >
      <sphereGeometry args={[.19,18,18]}/>
      <meshBasicMaterial transparent opacity={0.001} depthWrite={false}/>
    </mesh>
    <mesh scale={active||hover?1.65:1}>
      <sphereGeometry args={[.073,20,20]}/>
      <meshStandardMaterial color={active?"#ffdf69":terminal.color} emissive={active?"#ffb800":"#000000"} emissiveIntensity={active?1.2:0}/>
    </mesh>
    {hover && <Text position={[0,.25,0]} fontSize={.11} color="white" outlineWidth={.012} outlineColor="#07111f" anchorX="center">{terminal.label}</Text>}
  </group>;
}

function CableLine({from,to,color,preview=false}) {
  const points=useMemo(()=>{
    if(!from||!to)return [];
    const a=new THREE.Vector3(...from), b=new THREE.Vector3(...to);
    const mid=a.clone().lerp(b,.5); mid.y-=.22;
    return new THREE.QuadraticBezierCurve3(a,mid,b).getPoints(36);
  },[from,to]);
  if(points.length<2)return null;
  return <Line points={points} color={color} lineWidth={preview?3.5:4.5} />;
}

function Scene({wires,positions,onPositions,dragStart,setDragStart,finishDrag,onConnect,previewPoint,isOn}) {
  const [useFallback,setUseFallback]=useState(false);
  const terms=useMemo(()=>TERMINALS.map(t=>({...t})),[]);
  const capturePositions=useCallback((found)=>{
    if(Object.keys(found).length===terms.length) onPositions(found);
  },[onPositions,terms]);

  useEffect(()=>{
    if(useFallback) onPositions(Object.fromEntries(terms.map(t=>[t.id,t.pos])));
  },[useFallback,onPositions,terms]);
  const positionsReady=Object.keys(positions).length===terms.length;
  return <>
    <color attach="background" args={["#091725"]}/>
    <ambientLight intensity={.75}/>
    <directionalLight position={[4,8,6]} intensity={2.1} castShadow shadow-mapSize={[2048,2048]}/>
    <directionalLight position={[-5,4,-4]} intensity={.65} color="#66cde8"/>
    <Suspense fallback={null}>
      <ModelErrorBoundary onFallback={()=>setUseFallback(true)}>
        {!useFallback && <ModelCapture onReady={capturePositions} isOn={isOn}/>}
      </ModelErrorBoundary>
    </Suspense>
    {useFallback && <FallbackLab/>}
    {positionsReady && terms.map(t=><Terminal key={t.id} terminal={t} position={positions[t.id]} active={dragStart===t.id} onStart={setDragStart} onFinish={finishDrag}/>)}
    {wires.map(w=><CableLine key={w.id} from={positions[w.a]} to={positions[w.b]} color={w.color}/>)}
    {dragStart&&previewPoint&&positions[dragStart]&&<CableLine from={positions[dragStart]} to={previewPoint} color="#ffcf4a" preview/>}
    <OrbitControls makeDefault target={[0,1,0]} minDistance={5} maxDistance={15} maxPolarAngle={Math.PI*.49}/>
    <Environment preset="city"/>
  </>;
}

function ModelCapture({onReady, isOn}) {
  const {scene, animations} = useGLTF("/models/VidyaQuest_OhmsLaw.glb");
  const cloned = useMemo(()=>scene.clone(true),[scene]);
  const group = useRef();
  const {actions, mixer} = useAnimations(animations, group);

  useEffect(()=>{
    cloned.traverse(obj=>{
      if(obj.isMesh){
        obj.castShadow = true;
        obj.receiveShadow = true;
        if(obj.material){
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach(m=>{ if(m) m.needsUpdate = true; });
        }
      }
    });
    cloned.updateMatrixWorld(true);
    const found = {};
    cloned.traverse(obj=>{
      if(TERMINALS.some(t=>t.id===obj.name)){
        const v = new THREE.Vector3();
        obj.getWorldPosition(v);
        found[obj.name] = v.toArray();
      }
    });
    onReady(found);
  },[cloned,onReady]);

  useEffect(()=>{
    const action = actions["SWITCH_LEVER_ANIMATEDAction.001"] || Object.values(actions)[0];
    if(!action) return;
    action.stop();
    action.reset();
    action.play();
    action.paused = true;
    action.time = isOn ? action.getClip().duration : 0;
    mixer.update(0);
  },[isOn,actions,mixer]);

  return <group ref={group}><primitive object={cloned}/></group>;
}

export default function App(){
  const [positions,setPositions]=useState({});
  const [wires,setWires]=useState([]);
  const [dragStart,setDragStart]=useState(null);
  const [voltage,setVoltage]=useState(5);
  const [resistance,setResistance]=useState(10);
  const [isOn,setIsOn]=useState(false);
  const [xp,setXp]=useState(0);
  const [notice,setNotice]=useState("Drag a wire from one terminal and release it over another terminal.");
  const [guide,setGuide]=useState(true);
  const [previewPoint,setPreviewPoint]=useState(null);
  const [modelFailed,setModelFailed]=useState(false);
  const xpAwarded = useRef(false);

  const has=(a,b)=>wires.some(w=>keyFor(w.a,w.b)===keyFor(a,b));
  const mainReady=MAIN.every(([a,b])=>has(a,b));
  const meterReady=METER.every(([a,b])=>has(a,b));
  const complete=mainReady&&meterReady&&isOn;
  const current=mainReady&&isOn?voltage/resistance:0;
  const addWire=useCallback((a,b)=>{
    if(has(a,b)){setNotice("Those terminals are already connected.");return;}
    const valid=MAIN.some(([x,y])=>keyFor(x,y)===keyFor(a,b))||METER.some(([x,y])=>keyFor(x,y)===keyFor(a,b));
    const color=(a.includes("NEG")||b.includes("NEG")||a.includes("OUT")&&b.includes("OUT"))?"#303b49":"#ef4654";
    setWires(old=>[...old,{id:crypto.randomUUID(),a,b,color,valid}]);
    if(!valid)setNotice("Wire placed. That connection is not part of the required circuit; undo it or continue exploring.");
    else setNotice("Good connection! Keep building the circuit.");
  },[wires]);
  useEffect(()=>{
    if(complete && !xpAwarded.current){
      xpAwarded.current = true;
      setXp(v=>v+100);
      setNotice("Experiment complete! You earned 100 XP.");
    }
    if(!mainReady || !meterReady) xpAwarded.current = false;
  },[complete,mainReady,meterReady]);
  const reset=()=>{setWires([]);setDragStart(null);setIsOn(false);setNotice("Experiment reset. Start wiring again.");};
  const togglePower=()=>{if(!mainReady){setNotice("Complete the three main series connections before switching on.");return;}setIsOn(v=>!v);};
  const meterV=mainReady&&meterReady&&isOn?voltage:0;

  return <div className="app">
    <header className="topbar">
      <div className="brand"><div className="brand-icon"><Zap size={18} fill="currentColor"/></div>Vidya<span>Quest</span></div>
      <div className="crumb">Physics <ChevronRight size={13}/> Electricity <ChevronRight size={13}/> <b>Ohm's Law</b></div>
      <div className="top-meta"><span className="live-dot"/> INTERACTIVE LAB <div className="xp"><Sparkles size={14}/>{xp} XP</div></div>
    </header>
    <main className="layout">
      <section className="main">
        <div className="page-heading">
          <div><div className="eyebrow">VIRTUAL EXPERIMENT 01</div><h1>Ohm's Law <span>Laboratory</span></h1><p>Build the circuit. Discover how voltage, current and resistance are related.</p></div>
          <button className="outline-btn" onClick={reset}><RotateCcw size={14}/> Reset</button>
        </div>
        <div className="viewport">
          <div className="view-label"><span><i/> 3D WORKSPACE</span><small>Drag wire ends to terminals · Drag empty space to orbit · Scroll to zoom</small></div>
          <Canvas shadows camera={{position:[6.8,6.8,10.5],fov:42}} onPointerMissed={()=>{}}>
            <Scene wires={wires} positions={positions} onPositions={setPositions} dragStart={dragStart}
              setDragStart={(id)=>{ if(!dragStart) setDragStart(id); }}
              finishDrag={(id)=>{ if(dragStart && dragStart!==id) addWire(dragStart,id); setDragStart(null); }}
              onConnect={addWire} previewPoint={previewPoint} isOn={isOn}/>
          </Canvas>
          <div className="viewport-bottom"><span>{mainReady?<><i className="ok"/> Main circuit connected</>:`${wires.length} wire${wires.length===1?"":"s"} connected`}</span><button onClick={()=>setWires(w=>w.slice(0,-1))} disabled={!wires.length}>Undo last wire</button></div>
        </div>
        <div className="notice"><Lightbulb size={16}/>{notice}</div>
        <div className="meters">
          <div className="meter"><label>VOLTAGE <b>V</b></label><strong>{meterV.toFixed(2)} <small>V</small></strong><span>Across the resistor</span></div>
          <div className="meter"><label>CURRENT <b>A</b></label><strong>{current.toFixed(3)} <small>A</small></strong><span>Measured in series</span></div>
          <div className="meter"><label>RESISTANCE <b>Ω</b></label><strong>{resistance} <small>Ω</small></strong><span>Selected resistance</span></div>
        </div>
      </section>
      <aside className="sidebar">
        <section className="panel">
          <div className="panel-heading"><div className="panel-icon"><Activity size={17}/></div><div><b>Experiment controls</b><small>Adjust circuit parameters</small></div></div>
          <div className="range-control"><label>Power supply voltage <b>{voltage.toFixed(1)} V</b></label><input type="range" min="1" max="12" step=".5" value={voltage} onChange={e=>setVoltage(+e.target.value)}/><div><small>1 V</small><small>12 V</small></div></div>
          <div className="range-control"><label>Resistance <b>{resistance} Ω</b></label><input type="range" min="5" max="100" step="5" value={resistance} onChange={e=>setResistance(+e.target.value)}/><div><small>5 Ω</small><small>100 Ω</small></div></div>
          <div className="power-row"><div><b><Power size={14}/> Power switch</b><small>{isOn?"Circuit is ON":"Circuit is OFF"}</small></div><button className={`toggle ${isOn?"on":""}`} onClick={togglePower} aria-label="Toggle circuit power"><span/></button></div>
          <div className="formula"><small>OHM'S LAW</small><strong>V = I × R</strong><span>{voltage.toFixed(1)} V ÷ {resistance} Ω = {(voltage/resistance).toFixed(3)} A</span></div>
        </section>
        <section className="panel">
          <div className="panel-heading"><div className="panel-icon purple"><BookOpen size={17}/></div><div><b>Your mission</b><small>Complete the experiment</small></div></div>
          <div className="mission">
            <div className="mission-item"><span className={mainReady?"done":""}>{mainReady?<Check size={12}/>:"1"}</span><div><b>Build the main circuit</b><small>Power + → Ammeter → Resistor → Power −</small></div></div>
            <div className="mission-item"><span className={meterReady?"done":""}>{meterReady?<Check size={12}/>:"2"}</span><div><b>Connect the voltmeter</b><small>Connect across the resistor in parallel</small></div></div>
            <div className="mission-item"><span className={complete?"done":""}>{complete?<Check size={12}/>:"3"}</span><div><b>Switch on and observe</b><small>Compare the voltage and current readings</small></div></div>
          </div>
          <div className="reward"><span><Sparkles size={13}/> Completion reward</span><b>+100 XP</b></div>
        </section>
        <button className="guide-toggle" onClick={()=>setGuide(v=>!v)}><CircleHelp size={15}/>{guide?"Hide":"Show"} connection guide</button>
        {guide&&<div className="guide"><b><Cable size={14}/> How to connect wires</b><p>Press and hold a terminal, drag to another terminal, then release. You can also click one terminal and then another if drag controls are difficult on your device.</p></div>}
      </aside>
    </main>
    <footer><span>VIDYAQUEST LABS</span><span>Learn by doing. Discover by playing.</span><span>OHM'S LAW · EXPERIMENT 01</span></footer>
  </div>;
}
useGLTF.preload("/models/VidyaQuest_OhmsLaw.glb");
