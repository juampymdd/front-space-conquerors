import { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { SolarSystem } from './components/SolarSystem';
import { Planet } from './components/Planet';
import { JsonModal } from './components/JsonModal';
import { PlanetFactory } from './factory.planet';
import { SolarSystemGenerator } from './generators/solar-system-generator';
import type { PlanetType } from './types/planet.types';
import type { SolarPlanetData, SolarSystemData } from './types/solar-system.types';
import './App.css';

type ViewMode = 'solar-system' | 'single-planet';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('solar-system');
  const [seed, setSeed] = useState(12345);
  const [planetType, setPlanetType] = useState<PlanetType>('rocky');
  const [selectedPlanet, setSelectedPlanet] = useState<SolarPlanetData | null>(null);
  const [systemData, setSystemData] = useState<SolarSystemData | null>(null);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const controlsRef = useRef<any>(null);
  const [selectedPlanetPosition, setSelectedPlanetPosition] = useState<THREE.Vector3 | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);

  // Generar sistema cuando cambia la semilla
  const generator = useMemo(() => new SolarSystemGenerator(seed), [seed]);
  
  // Generar inicial
  useMemo(() => {
    if (!systemData) {
      const data = generator.generate();
      setSystemData(data);
    }
  }, [generator, systemData]);

  const handleRandomSeed = () => {
    const newSeed = Math.floor(Math.random() * 100000);
    setSeed(newSeed);
  };

  const handlePlanetSelect = (planet: SolarPlanetData | null) => {
    setSelectedPlanet(planet);
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
    setSelectedPlanet(null);
    setSelectedPlanetPosition(null);
  };

  const handlePlanetPositionUpdate = (planetId: string, position: THREE.Vector3) => {
    if (selectedPlanet?.id === planetId) {
      setSelectedPlanetPosition(position);
    }
  };

  return (
    <div className="app">
      {/* Toggle Button for Mobile */}
      <button 
        className="controls-toggle"
        onClick={() => setControlsVisible(!controlsVisible)}
        aria-label="Toggle controls"
      >
        {controlsVisible ? '✕' : '☰'}
      </button>

      {/* Panel de Control */}
      <div className={`controls ${controlsVisible ? 'visible' : 'hidden'}`}>
        <h2>🌌 Space Conquerors</h2>
        
        {/* Selector de Vista */}
        <div className="control-group">
          <label>Vista:</label>
          <div className="toggle-buttons">
            <button 
              className={viewMode === 'solar-system' ? 'active' : ''}
              onClick={() => setViewMode('solar-system')}
            >
              ☀️ Sistema Solar
            </button>
            <button 
              className={viewMode === 'single-planet' ? 'active' : ''}
              onClick={() => setViewMode('single-planet')}
            >
              🌍 Planeta
            </button>
          </div>
        </div>

        {/* Seed */}
        <div className="control-group">
          <label>Semilla:</label>
          <div className="seed-input">
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(Number(e.target.value))}
            />
            <button onClick={handleRandomSeed}>🎲</button>
          </div>
        </div>

        {/* Selector de Tipo y Controles Manuales (solo para vista de planeta) */}
        {viewMode === 'single-planet' && (
          <>
            <div className="control-group">
              <label>Tipo:</label>
              <div className="type-grid">
                {PlanetFactory.getAllTypes().map((type) => (
                  <button
                    key={type}
                    className={planetType === type ? 'active' : ''}
                    onClick={() => {
                      setPlanetType(type);
                      // Si hay un planeta seleccionado, actualizar su tipo también
                      if (selectedPlanet) {
                        const newPlanet = { ...selectedPlanet, type };
                        setSelectedPlanet(newPlanet);
                        if (systemData) {
                          const newPlanets = systemData.planets.map(p => 
                            p.id === selectedPlanet.id ? newPlanet : p
                          );
                          setSystemData({ ...systemData, planets: newPlanets });
                        }
                      }
                    }}
                  >
                    {getTypeEmoji(type)} {PlanetFactory.getTypeName(type)}
                  </button>
                ))}
              </div>
            </div>

            <div className="control-group">
              <label>Extras:</label>
              <div className="manual-controls" style={{ marginTop: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={!!selectedPlanet?.rings} 
                    onChange={(e) => {
                      // Si no hay planeta seleccionado (vista manual), crear un objeto temporal o manejar localmente
                      // Pero el componente Planet.tsx espera SolarPlanetData si queremos anillos
                      const currentPlanet = selectedPlanet || {
                        id: 'manual',
                        name: 'Manual Planet',
                        type: planetType,
                        seed: seed,
                        radius: 1,
                        orbit: { semiMajorAxis: 0, eccentricity: 0, inclination: 0, startAngle: 0, orbitalPeriod: 0 }
                      };

                      const updatedPlanet = { 
                        ...currentPlanet, 
                        rings: e.target.checked ? (currentPlanet.rings || { tilt: 0.3, bands: [{ innerRadius: 1.3, outerRadius: 2.0, color: '#d4a574', opacity: 0.6 }] }) : undefined 
                      };
                      
                      setSelectedPlanet(updatedPlanet);
                      if (systemData && selectedPlanet) {
                        const newPlanets = systemData.planets.map(p => p.id === selectedPlanet.id ? updatedPlanet : p);
                        setSystemData({ ...systemData, planets: newPlanets });
                      }
                    }}
                  />
                  Anillos
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedPlanet?.moons && selectedPlanet.moons.length > 0} 
                    onChange={(e) => {
                      const currentPlanet = selectedPlanet || {
                        id: 'manual',
                        name: 'Manual Planet',
                        type: planetType,
                        seed: seed,
                        radius: 1,
                        orbit: { semiMajorAxis: 0, eccentricity: 0, inclination: 0, startAngle: 0, orbitalPeriod: 0 }
                      };

                      const updatedPlanet = { 
                        ...currentPlanet, 
                        moons: e.target.checked ? (currentPlanet.moons?.length ? currentPlanet.moons : [{ id: `moon-${Date.now()}`, name: 'Luna Nueva', seed: Date.now(), radius: currentPlanet.radius * 0.2, orbit: { semiMajorAxis: currentPlanet.radius * 2.5, eccentricity: 0, inclination: 0, startAngle: 0, orbitalPeriod: 5 } }]) : []
                      };
                      
                      setSelectedPlanet(updatedPlanet);
                      if (systemData && selectedPlanet) {
                        const newPlanets = systemData.planets.map(p => p.id === selectedPlanet.id ? updatedPlanet : p);
                        setSystemData({ ...systemData, planets: newPlanets });
                      }
                    }}
                  />
                  Lunas
                </label>
              </div>
            </div>
          </>
        )}

        {/* Info del planeta seleccionado */}
        {viewMode === 'solar-system' && selectedPlanet && (
          <div className="planet-info">
            <h3>{selectedPlanet.name}</h3>
            <p>Tipo: {PlanetFactory.getTypeName(selectedPlanet.type)}</p>
            <p>Radio de órbita: {selectedPlanet.orbit.semiMajorAxis.toFixed(1)}</p>
            
            {/* Controles manuales */}
            <div className="manual-controls" style={{ marginTop: '15px', borderTop: '1px solid #333', paddingTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={!!selectedPlanet.rings} 
                  onChange={(e) => {
                    if (!systemData) return;
                    const newPlanets = systemData.planets.map((p: SolarPlanetData) => {
                      if (p.id === selectedPlanet.id) {
                        return { 
                          ...p, 
                          rings: e.target.checked ? (p.rings || { tilt: 0.3, bands: [{ innerRadius: 1.3, outerRadius: 2.0, color: '#d4a574', opacity: 0.6 }] }) : undefined 
                        };
                      }
                      return p;
                    });
                    const newData = { ...systemData, planets: newPlanets };
                    setSystemData(newData);
                    setSelectedPlanet(newPlanets.find((p: SolarPlanetData) => p.id === selectedPlanet.id) || null);
                  }}
                />
                Anillos
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={selectedPlanet.moons && selectedPlanet.moons.length > 0} 
                  onChange={(e) => {
                    if (!systemData) return;
                    const newPlanets = systemData.planets.map((p: SolarPlanetData) => {
                      if (p.id === selectedPlanet.id) {
                        return { 
                          ...p, 
                          moons: e.target.checked ? (p.moons?.length ? p.moons : [{ id: `moon-${Date.now()}`, name: 'Luna Nueva', seed: Date.now(), radius: p.radius * 0.2, orbit: { semiMajorAxis: p.radius * 2.5, eccentricity: 0, inclination: 0, startAngle: 0, orbitalPeriod: 5 } }]) : []
                        };
                      }
                      return p;
                    });
                    const newData = { ...systemData, planets: newPlanets };
                    setSystemData(newData);
                    setSelectedPlanet(newPlanets.find((p: SolarPlanetData) => p.id === selectedPlanet.id) || null);
                  }}
                />
                Lunas
              </label>
            </div>

            <button 
              onClick={() => setSelectedPlanet(null)}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                background: '#4a4aff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              ← Volver al Sistema
            </button>
          </div>
        )}

        {/* Botón Exportar JSON */}
        <div className="control-group" style={{ marginTop: 'auto' }}>
          <button 
            onClick={() => setShowJsonModal(true)}
            style={{ width: '100%', padding: '10px', background: '#333', border: '1px solid #555', marginBottom: '10px' }}
          >
            📋 Exportar JSON
          </button>
          
          <button 
            onClick={handleResetCamera}
            style={{ width: '100%', padding: '10px', background: '#333', border: '1px solid #555' }}
          >
            🎯 Centrar Cámara
          </button>
        </div>

      </div>

      {/* Canvas 3D */}
      <Canvas 
        camera={{ 
          position: viewMode === 'solar-system' ? [0, 50, 80] : [0, 0, 5], 
          fov: 50 
        }}
      >
        <color attach="background" args={['#000008']} />
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />
        
        <Stars radius={300} depth={50} count={5000} factor={4} />
        
        {viewMode === 'solar-system' ? (
          systemData && (
            <>
              <SolarSystem 
                data={systemData}
                onPlanetSelect={handlePlanetSelect}
                selectedPlanetId={selectedPlanet?.id || null}
                onPlanetPositionUpdate={handlePlanetPositionUpdate}
              />
              {selectedPlanetPosition && (
                <CameraFollower 
                  target={selectedPlanetPosition} 
                  controlsRef={controlsRef}
                />
              )}
            </>
          )
        ) : (
          <Planet 
            data={selectedPlanet || undefined}
            type={planetType} 
            seed={seed} 
            radius={2}
            resolution={100}
          />
        )}
        
        <OrbitControls 
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={viewMode === 'solar-system' ? 20 : 3}
          maxDistance={viewMode === 'solar-system' ? 200 : 15}
          enableDamping={true}
          dampingFactor={0.05}
          zoomToCursor={true}
        />
      </Canvas>

      <JsonModal 
        data={systemData}
        isOpen={showJsonModal}
        onClose={() => setShowJsonModal(false)}
      />

      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .app {
          width: 100%;
          height: 100%;
          position: fixed;
          top: 0;
          left: 0;
          overflow: hidden;
        }
        
        .controls {
          position: fixed;
          top: 20px;
          left: 20px;
          background: rgba(0, 0, 0, 0.85);
          padding: 20px;
          border-radius: 10px;
          color: white;
          z-index: 100;
          min-width: 200px;
          max-width: 250px;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          transition: transform 0.3s ease;
        }

        @media (max-width: 768px) {
          .controls {
            top: 0;
            left: 0;
            right: 0;
            bottom: auto;
            max-width: 100%;
            border-radius: 0 0 10px 10px;
            max-height: 80vh;
          }

          .controls.hidden {
            transform: translateY(-100%);
          }

          .controls.visible {
            transform: translateY(0);
          }
        }

        .controls-toggle {
          position: fixed;
          top: 10px;
          right: 10px;
          z-index: 101;
          background: rgba(0, 0, 0, 0.85);
          border: 1px solid #444;
          color: white;
          width: 44px;
          height: 44px;
          border-radius: 8px;
          font-size: 20px;
          cursor: pointer;
          display: none;
        }

        @media (max-width: 768px) {
          .controls-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        
        .controls h2 {
          margin: 0 0 15px 0;
          font-size: 18px;
        }
        
        .control-group {
          margin-bottom: 15px;
        }
        
        .control-group label {
          display: block;
          margin-bottom: 5px;
          opacity: 0.7;
          font-size: 12px;
        }
        
        .toggle-buttons {
          display: flex;
          gap: 5px;
        }
        
        .toggle-buttons button {
          flex: 1;
          padding: 8px;
          background: #222;
          border: 1px solid #444;
          color: white;
          cursor: pointer;
          border-radius: 4px;
          font-size: 11px;
        }
        
        .toggle-buttons button.active {
          background: #4a4aff;
          border-color: #6a6aff;
        }
        
        .seed-input {
          display: flex;
          gap: 5px;
        }
        
        .seed-input input {
          flex: 1;
          padding: 8px;
          background: #222;
          border: 1px solid #444;
          color: white;
          border-radius: 4px;
        }
        
        .seed-input button {
          padding: 8px 12px;
          background: #333;
          border: 1px solid #444;
          color: white;
          cursor: pointer;
          border-radius: 4px;
        }
        
        .type-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5px;
        }
        
        .type-grid button {
          padding: 8px;
          background: #222;
          border: 1px solid #444;
          color: white;
          cursor: pointer;
          border-radius: 4px;
          font-size: 11px;
          text-align: left;
        }
        
        .type-grid button.active {
          background: #4a4aff;
          border-color: #6a6aff;
        }
        
        .planet-info {
          background: #111;
          padding: 10px;
          border-radius: 5px;
          margin-top: 10px;
        }
        
        .planet-info h3 {
          margin: 0 0 5px 0;
          font-size: 14px;
        }
        
        .planet-info p {
          margin: 3px 0;
          font-size: 12px;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}

function getTypeEmoji(type: PlanetType): string {
  const emojis: Record<PlanetType, string> = {
    rocky: '🪨',
    oceanic: '🌊',
    volcanic: '🌋',
    icy: '❄️',
    jungle: '🌴',
    gas_giant: '🪐',
  };
  return emojis[type];
}

// Componente para seguir al planeta seleccionado
function CameraFollower({ target, controlsRef }: { target: THREE.Vector3; controlsRef: React.RefObject<any> }) {
  useFrame(({ camera }) => {
    if (controlsRef.current) {
      // Suavizar el movimiento del target hacia el planeta
      controlsRef.current.target.lerp(target, 0.1);
      
      // Calcular la dirección desde el target hacia la cámara
      const direction = new THREE.Vector3()
        .subVectors(camera.position, controlsRef.current.target)
        .normalize();
      
      // Distancia deseada desde el planeta (ajustable)
      const desiredDistance = 15;
      
      // Posición deseada de la cámara
      const desiredPosition = new THREE.Vector3()
        .copy(controlsRef.current.target)
        .add(direction.multiplyScalar(desiredDistance));
      
      // Suavizar el movimiento de la cámara hacia la posición deseada
      camera.position.lerp(desiredPosition, 0.05);
      
      controlsRef.current.update();
    }
  });
  return null;
}

export default App;