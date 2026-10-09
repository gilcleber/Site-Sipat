import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Submit Logic (allow 1 per day instead of 1 ever)
old_submit = ".insert([{ nome, matricula_ou_email: nome.trim().toLowerCase(), setor }]);"
new_submit = """const todayString = new Date().toLocaleDateString('pt-BR');
        const insertData = { nome, matricula_ou_email: `${nome.trim().toLowerCase()}_${todayString}`, setor };
        const { data, error } = await supabase.from('ifculos_participantes').insert([insertData]);"""
content = content.replace(old_submit, new_submit)

# 2. Add New States
if "const [nomePremio, setNomePremio]" not in content:
    content = content.replace('const [carregandoLista, setCarregandoLista] = useState(false);', 
        'const [carregandoLista, setCarregandoLista] = useState(false);\n  const [nomePremio, setNomePremio] = useState("");\n  const [isGrandeSorteio, setIsGrandeSorteio] = useState(false);\n  const [ganhadoresHoje, setGanhadoresHoje] = useState([]);'
    )

# 3. Update realizarSorteio
old_sorteio_block = re.search(r'const realizarSorteio = async \(\) => \{.*?(?=\s*if \(isSorteador\))', content, re.DOTALL)
if old_sorteio_block:
    new_sorteio_logic = """const realizarSorteio = async () => {
    setSorteando(true);
    setVencedor(null);
    try {
      const { data, error } = await supabase.from('ifculos_participantes').select('*');
      if (error || !data || data.length === 0) {
        alert("Nenhum participante encontrado no banco de dados.");
        setSorteando(false);
        return;
      }
      
      let candidatos = data;

      // Se for o grande prêmio final, precisa ter registro nos 4 dias
      if (isGrandeSorteio) {
          // Conta as aparições de cada nome
          const contagem = {};
          data.forEach(p => {
              const nameKey = p.nome.trim().toLowerCase();
              contagem[nameKey] = (contagem[nameKey] || 0) + 1;
          });
          // Filtra só quem tem 4 (ou mais) dias
          const nomesElegiveis = Object.keys(contagem).filter(k => contagem[k] >= 4);
          
          candidatos = data.filter(p => nomesElegiveis.includes(p.nome.trim().toLowerCase()));
          
          // Remove duplicados para a roleta
          candidatos = candidatos.filter((v, i, a) => a.findIndex(t => (t.nome.trim().toLowerCase() === v.nome.trim().toLowerCase())) === i);

          if (candidatos.length === 0) {
              alert("Ninguém cumpriu a regra de estar presente todos os 4 dias!");
              setSorteando(false);
              return;
          }
      } else {
          // Sorteio normal: Pega apenas os registros de HOJE
          const todayString = new Date().toLocaleDateString('pt-BR');
          const participantesDeHoje = data.filter(p => p.matricula_ou_email.endsWith(`_${todayString}`));
          
          if (participantesDeHoje.length > 0) {
              candidatos = participantesDeHoje;
          }

          // Remove quem já ganhou hoje da lista
          candidatos = candidatos.filter(p => !ganhadoresHoje.includes(p.nome));
          
          if (candidatos.length === 0) {
              alert("Todos os participantes de hoje já foram sorteados!");
              setSorteando(false);
              return;
          }
      }

      // Efeito de roleta
      let counter = 0;
      const maxIterations = isGrandeSorteio ? 200 : 100; // 20s ou 10s (cada tick é 100ms)
      
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * candidatos.length);
        setVencedor(candidatos[randomIndex]);
        counter++;
        if (counter > maxIterations) {
          clearInterval(interval);
          const finalIndex = Math.floor(Math.random() * candidatos.length);
          const ganhadorFinal = candidatos[finalIndex];
          setVencedor(ganhadorFinal);
          setSorteando(false);
          setGanhadoresHoje(prev => [...prev, ganhadorFinal.nome]);
        }
      }, 100);

    } catch (err) {
      alert("Erro ao realizar sorteio.");
      setSorteando(false);
    }
  };
"""
    content = content.replace(old_sorteio_block.group(0), new_sorteio_logic)
else:
    print("Could not find realizarSorteio block!")

# 4. Update the UI to include Premio Input and Grand Sorteio toggle
ui_to_replace = """<h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 text-center animate-pulse"><i className="fas fa-trophy text-yellow-400 mr-4"></i>Sorteador Oficial SIPAT 2026</h1>"""
new_ui = """<h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 text-center animate-pulse"><i className="fas fa-trophy text-yellow-400 mr-4"></i>Sorteador Oficial SIPAT 2026</h1>
        
        {!vencedor && !sorteando && (
          <div className="mb-8 w-full max-w-3xl bg-gray-800 p-6 rounded-2xl border-2 border-gray-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <input 
                  type="text" 
                  placeholder="Nome do Prêmio (Ex: Voucher Giovanetti)" 
                  value={nomePremio}
                  onChange={(e) => setNomePremio(e.target.value)}
                  className="w-full md:w-2/3 py-3 px-4 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
              />
              <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                      type="checkbox" 
                      checked={isGrandeSorteio}
                      onChange={(e) => setIsGrandeSorteio(e.target.checked)}
                      className="form-checkbox h-6 w-6 text-yellow-500 rounded focus:ring-yellow-500 bg-gray-900 border-gray-600"
                  />
                  <span className="text-yellow-400 font-bold uppercase tracking-wider text-sm">Grande Sorteio Final</span>
              </label>
          </div>
        )}
        
        {vencedor && nomePremio && (
           <div className="mb-6 bg-yellow-500 text-gray-900 py-2 px-8 rounded-full text-2xl font-black shadow-lg animate-bounce">
              Prêmio: {nomePremio}
           </div>
        )}"""

content = content.replace(ui_to_replace, new_ui)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
