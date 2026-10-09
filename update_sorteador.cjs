const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add new states at the top if they don't exist
if (!content.includes('const [telaSorteio, setTelaSorteio] = useState("lista");')) {
    content = content.replace(
        'const [sorteando, setSorteando] = useState(false);',
        'const [sorteando, setSorteando] = useState(false);\n  const [listaParticipantes, setListaParticipantes] = useState([]);\n  const [telaSorteio, setTelaSorteio] = useState("lista");\n  const [carregandoLista, setCarregandoLista] = useState(false);'
    );
}

// 2. Add fetch logic in the existing useEffect (the one checking window.location)
if (!content.includes('fetchParticipantes()')) {
    const fetchLogic = `
    // Check if it's the sorteador page
    if (window.location.pathname === "/sorteador") {
      setIsSorteador(true);
      const fetchParticipantes = async () => {
        setCarregandoLista(true);
        const { data, error } = await supabase.from('ifculos_participantes').select('*').order('data_cadastro', { ascending: false });
        if (data) setListaParticipantes(data);
        setCarregandoLista(false);
      };
      fetchParticipantes();
    }
`;
    // Replace the old simple check with the one that fetches
    content = content.replace(
        /if \(window\.location\.pathname === "\/sorteador"\) {\s*setIsSorteador\(true\);\s*}/g,
        fetchLogic
    );
}

// 3. Update the realizarSorteio function to use the loaded list instead of fetching again (optional, but faster)
// Actually, it's safer to fetch again to get any last-minute entries. The old logic fetches again, which is fine.
// I will just replace the whole `if (isSorteador) { return ( ... ) }` block.

const newSorteadorBlock = `
  if (isSorteador) {
    if (telaSorteio === "lista") {
      return (
        <div className="min-h-screen bg-gray-900 flex flex-col p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white"><i className="fas fa-clipboard-list text-yellow-400 mr-4"></i>Participantes do Sorteio</h1>
            <button 
              onClick={() => setTelaSorteio("roleta")}
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold text-lg md:text-xl py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105"
            >
              Ir para Roleta <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl flex-grow overflow-auto border-2 border-gray-700">
            <div className="flex justify-between text-gray-400 mb-4 border-b border-gray-700 pb-2">
              <span className="font-bold uppercase tracking-wider text-sm">Nome e Sobrenome</span>
              <span className="font-bold uppercase tracking-wider text-sm text-right">Setor</span>
            </div>
            {carregandoLista ? (
              <div className="text-center text-gray-500 my-12 text-xl"><i className="fas fa-spinner fa-spin mr-3"></i>Carregando lista...</div>
            ) : listaParticipantes.length === 0 ? (
              <div className="text-center text-gray-500 my-12 text-xl">Nenhum participante fez check-in ainda.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listaParticipantes.map((p, idx) => (
                  <div key={p.id || idx} className="bg-gray-700 hover:bg-gray-600 transition p-4 rounded-xl border border-gray-600 flex justify-between items-center">
                    <span className="text-white font-semibold truncate mr-3">{p.nome}</span>
                    <span className="text-gray-400 text-xs bg-gray-800 px-2 py-1 rounded-md whitespace-nowrap">{p.setor}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 text-center text-gray-400">
            Total de presentes: <strong className="text-white text-xl">{listaParticipantes.length}</strong>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 relative">
        <button 
          onClick={() => setTelaSorteio("lista")}
          className="absolute top-6 left-6 text-gray-400 hover:text-white transition flex items-center"
        >
          <i className="fas fa-arrow-left mr-2"></i> Voltar para Lista
        </button>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 text-center animate-pulse"><i className="fas fa-trophy text-yellow-400 mr-4"></i>Sorteador Oficial SIPAT 2026</h1>
        
        <div className="bg-gray-800 border-4 border-yellow-500 rounded-3xl p-8 md:p-16 shadow-2xl max-w-3xl w-full text-center">
          {vencedor ? (
            <div className="animate-fadeInUp">
              <p className="text-gray-400 text-xl mb-2">O grande ganhador é:</p>
              <h2 className="text-5xl md:text-7xl font-black text-green-400 mb-4 uppercase">{vencedor.nome}</h2>
              <p className="text-2xl text-yellow-300 font-bold"><i className="fas fa-briefcase mr-2"></i>Setor: {vencedor.setor}</p>
            </div>
          ) : (
            <div className="text-gray-500 text-2xl font-semibold my-12">
              <i className="fas fa-question-circle text-6xl mb-4 opacity-50 block"></i>
              Aguardando sorteio...
            </div>
          )}
        </div>

        <button 
          onClick={realizarSorteio}
          disabled={sorteando}
          className="mt-12 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-black text-2xl md:text-3xl py-6 px-12 rounded-full shadow-2xl transition transform hover:scale-110 disabled:opacity-50 disabled:scale-100"
        >
          {sorteando ? <><i className="fas fa-sync fa-spin mr-3"></i>Sorteando...</> : <><i className="fas fa-play mr-3"></i>REALIZAR SORTEIO</>}
        </button>
      </div>
    );
  }
`;

// Extract old block using regex
const regex = /if \(isSorteador\) \{[\s\S]*?\}\s*return \(/;
const match = content.match(regex);
if (match) {
    const oldBlock = match[0].replace('return (', '').trim();
    content = content.replace(oldBlock, newSorteadorBlock.trim());
} else {
    console.error("Could not find isSorteador block");
}

fs.writeFileSync('src/App.jsx', content, 'utf8');
