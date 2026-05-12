import { useEffect, useState, useMemo } from 'react';
import './App.css';

// Sequência de caracteres geométricos e "shades" que imitam estampas de azulejo.
// Duplicamos massivamente os caracteres de degradê (FiraCode) para que eles
// ocupem a maior parte da área de transição, criando um espaço enorme de textura.
const TILE_CHARS = [
  'solid', 
  
  // A parte do degradê do FiraCode (super denso)
  '▓▓', '▓▓', '▓▓', '▓▓', '▓▓', '▓▓', 
  '▒▒', '▒▒', '▒▒', '▒▒', '▒▒',       
  '░░', '░░', '░░', '░░',             
  
  // Voltando para os azulejos geométricos originais
  '▦', '▦',     
  '▣',     
  '□',     
  '◈',     
  '◇',     
  '❖',     
  '✥',     
  '+', '+',      
  '·', '·',      
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

  // Gera as células do grid usando ruído 2D para simular "Papel Pegando Fogo"
  const cells = useMemo(() => {
    const { cols, rows } = gridConfig;
    if (cols === 0 || rows === 0) return [];

    const items = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const rowRatio = y / Math.max(rows - 1, 1);
        
        // BaseOffset: define a progressão vertical do fogo (de 0.35 até 1.0)
        const baseOffset = 0.35 + ((1 - rowRatio) * 0.65);
        
        // Ruído 2D "Papel Pegando Fogo"
        // Misturar X e Y faz com que a velocidade e o formato da queima sejam orgânicos e imprevisíveis.
        // Cria baías profundas e labaredas que sobem mais rápido em certas áreas.
        const burnNoise = 
            Math.sin(x * 0.10 + y * 0.05) * 0.20 + 
            Math.sin(x * 0.30 - y * 0.15) * 0.12 + 
            Math.sin(x * 0.80 + y * 0.30) * 0.08;
        
        items.push({
          id: `${x}-${y}`,
          offset: baseOffset + burnNoise
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
          // Multiplicamos o scroll por 1.9 para garantir que ele ultrapasse o maior offset possível + a janela gigante.
          const effectiveScroll = scrollProgress * 1.9;
          
          // A janela de transição agora é MASSIVA (0.50). 
          // O degradê ocupa metade da página inteira!
          const localProgress = (effectiveScroll - cell.offset) / 0.50;
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
