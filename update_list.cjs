const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// Ensure we have a state for the filter
if (!content.includes('const [filtroVisao, setFiltroVisao] = useState("hoje");')) {
    content = content.replace('const [telaSorteio, setTelaSorteio] = useState("lista");',
        'const [telaSorteio, setTelaSorteio] = useState("lista");\n  const [filtroVisao, setFiltroVisao] = useState("hoje");'
    );
}

// Update the list rendering
const oldListRegex = /<div className="bg-gray-800 rounded-2xl p-6 shadow-2xl flex-grow overflow-auto border-2 border-gray-700">[\s\S]*?<div className="mt-4 text-center text-gray-400">[\s\S]*?<\/div>/;

const newListHtml = `
          {/* Toggle de Filtro */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-800 p-1 rounded-xl flex space-x-1 border border-gray-700">
              <button 
                onClick={() => setFiltroVisao("hoje")}
                className={\`px-6 py-2 rounded-lg font-semibold transition \${filtroVisao === "hoje" ? "bg-green-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}\`}
              >
                Presentes Hoje
              </button>
              <button 
                onClick={() => setFiltroVisao("final")}
                className={\`px-6 py-2 rounded-lg font-semibold transition \${filtroVisao === "final" ? "bg-yellow-500 text-gray-900 shadow-lg" : "text-gray-400 hover:text-white"}\`}
              >
                <i className="fas fa-star mr-2"></i>Classificados (Prêmio Final)
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl flex-grow overflow-auto border-2 border-gray-700">
            <div className="flex justify-between text-gray-400 mb-4 border-b border-gray-700 pb-2 px-2">
              <span className="font-bold uppercase tracking-wider text-sm">Nome e Sobrenome</span>
              <span className="font-bold uppercase tracking-wider text-sm text-right">Setor / Presenças</span>
            </div>
            {(() => {
                if (carregandoLista) {
                    return <div className="text-center text-gray-500 my-12 text-xl"><i className="fas fa-spinner fa-spin mr-3"></i>Carregando lista...</div>;
                }
                
                let exibir = [];
                if (filtroVisao === "hoje") {
                    const todayString = new Date().toLocaleDateString('pt-BR');
                    exibir = listaParticipantes.filter(p => p.matricula_ou_email && p.matricula_ou_email.endsWith(\`_\${todayString}\`));
                } else {
                    const contagem = {};
                    listaParticipantes.forEach(p => {
                        const nameKey = p.nome.trim().toUpperCase();
                        if (!contagem[nameKey]) contagem[nameKey] = { ...p, count: 0 };
                        contagem[nameKey].count += 1;
                    });
                    exibir = Object.values(contagem).filter(p => p.count >= 4);
                }

                if (exibir.length === 0) {
                    return <div className="text-center text-gray-500 my-12 text-xl">{filtroVisao === "hoje" ? "Nenhum participante fez check-in hoje ainda." : "Ninguém atingiu 4 presenças ainda."}</div>;
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exibir.map((p, idx) => (
                      <div key={idx} className="bg-gray-700 hover:bg-gray-600 transition p-4 rounded-xl border border-gray-600 flex justify-between items-center">
                        <span className="text-white font-semibold truncate mr-3">{p.nome.toUpperCase()}</span>
                        {filtroVisao === "hoje" ? (
                           <span className="text-gray-300 text-xs bg-gray-900 px-3 py-1 rounded-md whitespace-nowrap border border-gray-600">{p.setor}</span>
                        ) : (
                           <span className="text-yellow-400 text-xs bg-gray-900 px-3 py-1 rounded-md whitespace-nowrap border border-yellow-600 font-bold">{p.count} Presenças</span>
                        )}
                      </div>
                    ))}
                  </div>
                );
            })()}
          </div>
          <div className="mt-4 text-center text-gray-400">
            Total exibido: <strong className="text-white text-xl">
              {filtroVisao === "hoje" 
                ? listaParticipantes.filter(p => p.matricula_ou_email && p.matricula_ou_email.endsWith(\`_\${new Date().toLocaleDateString('pt-BR')}\`)).length 
                : Object.values(listaParticipantes.reduce((acc, p) => { const k = p.nome.trim().toUpperCase(); acc[k] = (acc[k]||0)+1; return acc; }, {})).filter(c => c >= 4).length}
            </strong>
          </div>`;

content = content.replace(oldListRegex, newListHtml);

fs.writeFileSync('src/App.jsx', content, 'utf8');
