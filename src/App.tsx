import { useEffect, useState, useMemo, useRef } from 'react';
import './App.css';

const TILE_CHARS = [
  'solid', 
  '▓▓', '▓▓', 
  '▒▒', '▒▒', 
  '░░', '░░', 
  '▦', '▣', '□', '◈', '◇', '❖', '✥', '+', '·', ' '      
];

const voidGalaLogo = `
 ██╗   ██╗ ██████╗ ██╗██████╗      ██████╗  █████╗ ██╗      █████╗ 
 ██║   ██║██╔═══██╗██║██╔══██╗    ██╔════╝ ██╔══██╗██║     ██╔══██╗
 ██║   ██║██║   ██║██║██║  ██║    ██║  ███╗███████║██║     ███████║
 ╚██╗ ██╔╝██║   ██║██║██║  ██║    ██║   ██║██╔══██║██║     ██╔══██║
  ╚████╔╝ ╚██████╔╝██║██████╔╝    ╚██████╔╝██║  ██║███████╗██║  ██║
   ╚═══╝   ╚═════╝ ╚═╝╚═════╝      ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
`;



// O NOVO SISTEMA: Todas as telas são definidas aqui.
// O efeito de "peeling" funciona como uma transição contínua entre elas.
const SCREENS = [
  {
    id: 'intro-letter',
    bgColor: '#ffffff',
    charColor: '#ffffff', // Cor dos caracteres da transição
    textColor: '#0033aa',
    content: (
      <div className="letter-container">
        <p>The VOID_GALA exists to celebrate what the mainstream industry ignores. While the world chases photorealism, we honor the soul of the code.</p>
        <p>We congratulate the developers who transform limitations into radical innovation. The works listed here, chosen directly by our community, are rare: pure manifestos of creativity that prove digital art does not depend on polygons, but on vision.</p>
        <p>In this niche, low-level execution is the highest form of art.</p>
      </div>
    )
  },
  {
    id: 'logo-screen',
    bgColor: '#0033aa',
    charColor: '#0033aa',
    textColor: '#ffffff',
    content: (
      <div className="logo-screen-content">
        <pre className="ascii-logo">{voidGalaLogo}</pre>
        <div className="welcome-text">
          <p>WELCOME TO THE 2025 VOID_GALA, THE FIRST EDITION OF OUR MANIFESTO. DISCOVER THIS YEAR'S CATEGORIES BELOW.</p>
        </div>
      </div>
    )
  },
  {
    id: 'category-1',
    bgColor: '#ffffff',
    charColor: '#ffffff',
    textColor: '#0033aa',
    content: (
      <div className="video-showcase">
        <div className="game-info">
          <h1 className="game-title">DWARF FORTRESS</h1>
          <p className="game-desc">
            In development since 2002 by Tarn and Zach Adams, Dwarf Fortress is a monumental achievement in procedural generation and systems design. What began as a simple text-based roguelike has evolved into the most intricate simulation ever conceived. It models everything from geological strata and shifting weather patterns to the individual dreams, memories, and personalities of every generated creature. Abandoning modern graphics for pure, unadulterated complexity, it is a legendary manifesto of low-level emergent storytelling.
          </p>
        </div>
        <div className="blueprint-wrapper">
          {/* Blueprint Lines */}
          <div className="blueprint-line h-line top"></div>
          <div className="blueprint-line h-line bottom"></div>
          <div className="blueprint-line v-line left"></div>
          <div className="blueprint-line v-line right"></div>

          {/* Crosshairs */}
          <div className="crosshair top-left">+</div>
          <div className="crosshair top-right">+</div>
          <div className="crosshair bottom-left">+</div>
          <div className="crosshair bottom-right">+</div>

          <div className="video-wrapper">
            {/* BARRA SUPERIOR (OH MY POSH) */}
            <div className="posh-bar">
              <div className="posh-seg" style={{ backgroundColor: '#111111', color: '#ffffff' }}>
                runner@void
              </div>
              <div className="posh-arrow right" style={{ backgroundColor: '#0033aa', color: '#111111' }}></div>
              <div className="posh-seg" style={{ backgroundColor: '#0033aa', color: '#ffffff' }}>
                 ~ / media / dwarf_fortress 
              </div>
              <div className="posh-arrow right" style={{ backgroundColor: '#0055ff', color: '#0033aa' }}></div>
              <div className="posh-seg" style={{ backgroundColor: '#0055ff', color: '#ffffff' }}>
                 * play 
              </div>
              <div className="posh-arrow right" style={{ backgroundColor: 'transparent', color: '#0055ff' }}></div>
            </div>

            <iframe
              className="crow-country-video"
              src="https://www.youtube.com/embed/jNbTQJUAYT0?autoplay=1&mute=1&loop=1&playlist=jNbTQJUAYT0&controls=0&rel=0"
              title="Crow Country Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>

            {/* BARRA INFERIOR (OH MY POSH) */}
            <div className="posh-bar" style={{ justifyContent: 'flex-end' }}>
              <div className="posh-arrow left" style={{ backgroundColor: 'transparent', color: '#0055ff' }}></div>
              <div className="posh-seg" style={{ backgroundColor: '#0055ff', color: '#ffffff' }}>
                 1080p 
              </div>
              <div className="posh-arrow left" style={{ backgroundColor: '#0055ff', color: '#0033aa' }}></div>
              <div className="posh-seg" style={{ backgroundColor: '#0033aa', color: '#ffffff' }}>
                 60FPS 
              </div>
              <div className="posh-arrow left" style={{ backgroundColor: '#0033aa', color: '#111111' }}></div>
              <div className="posh-seg" style={{ backgroundColor: '#111111', color: '#ffffff' }}>
                 [■] 
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
];

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [gridConfig, setGridConfig] = useState({ cols: 0, rows: 0, cellSize: 24 });

  useEffect(() => {
    const updateGrid = () => {
      const cellSize = 24; 
      const cols = Math.ceil(window.innerWidth / cellSize) + 1;
      const rows = Math.ceil(window.innerHeight / cellSize) + 1;
      setGridConfig({ cols, rows, cellSize });
    };

    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    window.requestAnimationFrame(() => handleScroll());
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cells = useMemo(() => {
    const { cols, rows } = gridConfig;
    if (cols === 0 || rows === 0) return [];

    const hash = (x: number, y: number) => {
      let h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
      return h - Math.floor(h);
    };

    const smoothNoise = (x: number, y: number) => {
      const ix = Math.floor(x);
      const iy = Math.floor(y);
      const fx = x - ix;
      const fy = y - iy;

      const ux = fx * fx * (3.0 - 2.0 * fx);
      const uy = fy * fy * (3.0 - 2.0 * fy);

      const v00 = hash(ix, iy);
      const v10 = hash(ix + 1, iy);
      const v01 = hash(ix, iy + 1);
      const v11 = hash(ix + 1, iy + 1);

      return (v00 * (1 - ux) + v10 * ux) * (1 - uy) + 
             (v01 * (1 - ux) + v11 * ux) * uy;
    };

    const fbm = (x: number, y: number) => {
      let v = 0;
      let a = 0.5;
      let f = 1.0;
      for (let i = 0; i < 3; i++) {
        v += a * smoothNoise(x * f, y * f);
        f *= 2.0;
        a *= 0.5;
      }
      return v; 
    };

    const items = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const rowRatio = y / Math.max(rows - 1, 1);
        const baseOffset = 0.2 + ((1 - rowRatio) * 0.6);
        const organicNoise = (fbm(x * 0.08, y * 0.08) - 0.5) * 0.35;
        
        items.push({
          id: `${x}-${y}`,
          offset: baseOffset + organicNoise
        });
      }
    }
    return items;
  }, [gridConfig]);

  if (gridConfig.cols === 0) return null;

  // Cada transição dura exatamente 200vh
  const transitionHeight = window.innerHeight * 2;
  const maxTransitions = SCREENS.length - 1;
  const rawTransition = scrollY / transitionHeight;
  
  // Limita o index atual para sempre termos a "currentScreen" e "nextScreen"
  const currentTransitionIndex = Math.min(Math.floor(rawTransition), maxTransitions - 1);
  const localProgress = Math.min(Math.max(rawTransition - currentTransitionIndex, 0), 1);
  
  // Verifica se o usuário chegou no final de todas as transições
  const isPastEnd = rawTransition >= maxTransitions;

  const currentScreen = SCREENS[currentTransitionIndex];
  const nextScreen = SCREENS[currentTransitionIndex + 1];

  const effectiveScrollWipe = localProgress * 1.25;
  const fireCenter = effectiveScrollWipe - 0.125;
  const screenWipe = ((fireCenter - 0.2) / 0.6) * 100;

  return (
    // Altura total: 100vh fixo da primeira tela + (número de transições * 200vh)
    <div className="app-container" style={{ height: `calc(100vh + ${maxTransitions * 200}vh)` }}>
      <div className="sticky-container">
        
        {/* BOTTOM LAYER: A tela de baixo que está sendo revelada progressivamente */}
        <div 
          className="screen-layer layer-bottom" 
          style={{ 
            backgroundColor: isPastEnd ? SCREENS[SCREENS.length - 1].bgColor : nextScreen.bgColor, 
            color: isPastEnd ? SCREENS[SCREENS.length - 1].textColor : nextScreen.textColor 
          }}
        >
          {isPastEnd ? SCREENS[SCREENS.length - 1].content : nextScreen.content}
        </div>

        {/* MIDDLE LAYER: O conteúdo da tela atual sendo apagado sincronizado com o fogo */}
        {!isPastEnd && (
          <div 
            className="screen-layer layer-middle" 
            style={{ 
              backgroundColor: 'transparent',
              color: currentScreen.textColor,
              WebkitMaskImage: `linear-gradient(to top, transparent ${screenWipe - 10}%, black ${screenWipe + 15}%)`,
              maskImage: `linear-gradient(to top, transparent ${screenWipe - 10}%, black ${screenWipe + 15}%)`
            }}
          >
            {currentScreen.content}
          </div>
        )}

        {/* TOP LAYER: O grid ASCII que simula o background da tela atual queimando */}
        {!isPastEnd && !(currentScreen as any).hideOverlay && (
          <div 
            className="tile-overlay layer-top"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridConfig.cols}, ${gridConfig.cellSize}px)`,
              gridTemplateRows: `repeat(${gridConfig.rows}, ${gridConfig.cellSize}px)`,
              // Injetamos as cores como variáveis no CSS para trocar o "corpo" do fogo
              '--peel-bg-color': currentScreen.bgColor,
              '--peel-char-color': currentScreen.charColor,
            } as React.CSSProperties}
          >
            {cells.map(cell => {
              const cellProgress = (effectiveScrollWipe - cell.offset) / 0.25;
              const clamped = Math.min(Math.max(cellProgress, 0), 1);
              const charIndex = Math.floor(clamped * (TILE_CHARS.length - 1));
              const char = TILE_CHARS[charIndex];

              return (
                <div 
                  key={cell.id} 
                  className={`tile ${char === 'solid' ? 'solid' : ''}`}
                >
                  {char !== 'solid' && char !== ' ' ? char : null}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
