import { useEffect, useState, useMemo } from 'react';
import './App.css';

// Sequência de caracteres geométricos e "shades" que imitam estampas de azulejo.
// Sequência de caracteres originais (do branco sólido para o transparente).
// Isso garante que os caracteres brancos "rasguem" em direção ao fundo azul,
// e não o contrário, mantendo a estética perfeita.
const TILE_CHARS = [
  'solid', 
  
  // Degradê FiraCode mais curto
  '▓▓', '▓▓', 
  '▒▒', '▒▒', 
  '░░', '░░', 
  
  // Desconstrução
  '▦', 
  '▣', 
  '□', 
  '◈', 
  '◇', 
  '❖', 
  '✥', 
  '+', 
  '·', 
  ' '      
];

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [gridConfig, setGridConfig] = useState({ cols: 0, rows: 0, cellSize: 40 });

  useEffect(() => {
    const updateGrid = () => {
      // Diminuindo o tamanho da célula (de 40 para 24) para 
      // multiplicar a quantidade de quadrados e aumentar a resolução!
      const cellSize = 24; 
      // +1 para garantir que preencha até a borda sem falhas
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
          const scrollY = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
          setScrollProgress(Math.min(Math.max(progress, 0), 1));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Forçar uma atualização inicial segura
    window.requestAnimationFrame(() => {
      handleScroll();
    });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gera as células do grid usando ruído orgânico avançado (FBM - Fractal Brownian Motion)
  // Isso remove completamente o formato "gráfico de senoide" e cria manchas como nuvens.
  const cells = useMemo(() => {
    const { cols, rows } = gridConfig;
    if (cols === 0 || rows === 0) return [];

    // Função de hash pseudo-aleatória clássica
    const hash = (x: number, y: number) => {
      let h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
      return h - Math.floor(h);
    };

    // Value Noise 2D suave (interpolação cúbica para curvas orgânicas)
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

    // FBM mistura 3 camadas (octaves) de ruído para dar detalhe e complexidade às "chamas"
    const fbm = (x: number, y: number) => {
      let v = 0;
      let a = 0.5;
      let f = 1.0;
      for (let i = 0; i < 3; i++) {
        v += a * smoothNoise(x * f, y * f);
        f *= 2.0;
        a *= 0.5;
      }
      return v; // Retorna valor entre aprox 0.0 e 1.0
    };

    const items = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const rowRatio = y / Math.max(rows - 1, 1);
        
        // BaseOffset: define a progressão vertical do fogo (de 0.2 até 0.8)
        const baseOffset = 0.2 + ((1 - rowRatio) * 0.6);
        
        // Escala 0.08 define o tamanho das "manchas" orgânicas.
        // Multiplicar por 0.35 faz com que as manchas invadam a área das outras.
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

  return (
    <div className="app-container">
      {/* O background escondido, fundo azul sólido como solicitado */}
      <div className="hidden-background">
        {/* Fundo liso sem elementos extras por enquanto */}
      </div>

      {/* Container invisível para dar área de rolagem (scroll) */}
      <div className="scroll-space"></div>

      {/* A carta fixada no centro do "quadro branco" */}
      <div className="letter-container">
        <p>The VOID_GALA exists to celebrate what the mainstream industry ignores. While the world chases photorealism, we honor the soul of the code.</p>
        <p>We congratulate the developers who transform limitations into radical innovation. The works listed here are rare: pure manifestos of creativity that prove digital art does not depend on polygons, but on vision.</p>
        <p>In this niche, low-level execution is the highest form of art.</p>
      </div>

      {/* 
        O grid de caracteres que imitam azulejos.
      */}
      <div 
        className="white-overlay"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridConfig.cols}, ${gridConfig.cellSize}px)`,
          gridTemplateRows: `repeat(${gridConfig.rows}, ${gridConfig.cellSize}px)`
        }}
      >
        {cells.map(cell => {
          // Multiplicamos o scroll por 1.25 para garantir que cubra o offset máximo (0.97) + janela (0.25).
          const effectiveScroll = scrollProgress * 1.25;
          
          // Reduzimos a janela massiva de 0.50 para 0.25.
          // Isso "espreme" a transição, fazendo com que as faixas de caracteres 
          // fiquem muito mais finas e afiadas, parecendo uma verdadeira borda de fogo.
          const localProgress = (effectiveScroll - cell.offset) / 0.25;
          const clamped = Math.min(Math.max(localProgress, 0), 1);
          
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
    </div>
  );
}

export default App;
