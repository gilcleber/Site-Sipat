import React, { useEffect, useState } from "react";
import "./index.css";
import { supabase } from "./supabaseClient";

function App() {
  const scrollToLivePlayer = () => {
    const player = document.getElementById("live-player");
    if (player) {
      player.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
    const [nome, setNome] = useState("");
  const [setor, setSetor] = useState("");
  const [pin, setPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [status, setStatus] = useState("idle");
  const [mensagem, setMensagem] = useState("");
  const [isPresencial, setIsPresencial] = useState(true);
  const [isSorteador, setIsSorteador] = useState(false);
  
  // Download logic for Oct 22
  const [canDownload, setCanDownload] = useState(false);
  useEffect(() => {
    const today = new Date();
    const releaseDate = new Date("2026-10-22T00:00:00-03:00");
    if (today >= releaseDate) {
      setCanDownload(true);
    }
  }, []);
  // Sorteador states
  const [vencedor, setVencedor] = useState(null);
  const [sorteando, setSorteando] = useState(false);
  const [listaParticipantes, setListaParticipantes] = useState([]);
  const [telaSorteio, setTelaSorteio] = useState("lista");
  const [filtroVisao, setFiltroVisao] = useState("hoje");
  const [carregandoLista, setCarregandoLista] = useState(false);
  const [nomePremio, setNomePremio] = useState("");
  const [isGrandeSorteio, setIsGrandeSorteio] = useState(false);
  const [ganhadoresHoje, setGanhadoresHoje] = useState([]);

  // Galeria de Álbuns states
  const [albumAtivo, setAlbumAtivo] = useState(null);
  const [fotoAtivaIndex, setFotoAtivaIndex] = useState(0);

  const albunsSipat = [
    {
      dia: 1,
      data: "19/Out (Segunda)",
      tema: "Autocuidado e Gestão do Estresse",
      palestrante: "Vanessa Favin",
      capa: "/fotos/dia1_capa.jpg",
      disponivel: true,
      fotos: [
        { id: 1, src: "/fotos/dia1_capa.jpg", titulo: "Foto Oficial da Equipe • Dia 1", desc: "Equipe Band Campinas reunida no encerramento da palestra de Autocuidado e Gestão do Estresse" }
      ]
    },
    {
      dia: 2,
      data: "20/Out (Terça)",
      tema: "Saúde Mental no Trabalho",
      palestrante: "Michele Sarkis",
      capa: "/fotos/dia2_capa.jpg",
      disponivel: true,
      fotos: [
        { id: 2, src: "/fotos/dia2_capa.jpg", titulo: "Foto Oficial da Equipe e Palestrante • Dia 2", desc: "Equipe Band Campinas reunida com a palestrante no encerramento da palestra de Saúde Mental" },
        { id: 3, src: "/fotos/foto_01.jpg", titulo: "Auditório e Colaboradores", desc: "Equipe presente acompanhando a apresentação" },
        { id: 4, src: "/fotos/foto_02.jpg", titulo: "Exercício Prático", desc: "Dinâmica e exercícios durante a sessão" },
        { id: 5, src: "/fotos/foto_03.jpg", titulo: "Mente x Cérebro", desc: "Conceitos de neurociência e saúde mental aplicados à rotina" },
        { id: 6, src: "/fotos/foto_04.jpg", titulo: "Participação Ativa", desc: "Visão ampla da sala durante a palestra" },
        { id: 7, src: "/fotos/foto_05.jpg", titulo: "Apresentação e Palestrante", desc: "Orientações sobre qualidade de vida e rotina" },
        { id: 8, src: "/fotos/foto_06.jpg", titulo: "Qualidade do Sono", desc: "A importância do descanso e hábitos saudáveis" },
        { id: 9, src: "/fotos/foto_07.jpg", titulo: "Saúde Mental no Trabalho", desc: "Reflexão sobre equilíbrio emocional e profissional" }
      ]
    },
    {
      dia: 3,
      data: "21/Out (Quarta)",
      tema: "Equilíbrio, Ansiedade e Qualidade do Sono",
      palestrante: "Dra. Carmen Regina",
      capa: "/fotos/dia3_capa.jpg",
      disponivel: true,
      fotos: [
        { id: 301, src: "/fotos/dia3_capa.jpg", titulo: "Foto Oficial da Equipe e Palestrante • Dia 3", desc: "Equipe Band Campinas reunida com a Dra. Carmen Regina ao término da palestra sobre Equilíbrio, Ansiedade e Qualidade do Sono" },
        { id: 302, src: "/fotos/dia3_foto_01.jpg", titulo: "Corpo em Equilíbrio", desc: "Acupuntura, Medicina Tradicional Chinesa e Qi Gong para o bem-estar no trabalho" },
        { id: 303, src: "/fotos/dia3_foto_02.jpg", titulo: "Encerramento e Agradecimentos", desc: "Dra. Carmen Regina interagindo com os colaboradores e tirando dúvidas" },
        { id: 304, src: "/fotos/dia3_foto_03.jpg", titulo: "Pilares do Bem-Estar", desc: "Apresentação dos conceitos fundamentais de equilíbrio físico e mental" },
        { id: 305, src: "/fotos/dia3_foto_04.jpg", titulo: "Medicina Integrativa", desc: "Práticas e orientações aplicadas ao dia a dia profissional" },
        { id: 306, src: "/fotos/dia3_foto_05.jpg", titulo: "Auditório e Colaboradores", desc: "Visão ampla da sala acompanhando a exposição e as técnicas" },
        { id: 307, src: "/fotos/dia3_foto_06.jpg", titulo: "Participação Ativa da Equipe", desc: "Colaboradores atentos aos ensinamentos de saúde preventiva" },
        { id: 308, src: "/fotos/dia3_foto_07.jpg", titulo: "O Olhar da Medicina Chinesa", desc: "Visão integral: corpo, mente, ambiente e hábitos saudáveis" },
        { id: 309, src: "/fotos/dia3_foto_08.jpg", titulo: "Qualidade do Sono e Ansiedade", desc: "Orientações práticas para redução do estresse e recuperação de energia" }
      ]
    },
    {
      dia: 4,
      data: "23/Out (Sexta)",
      tema: "Cuidados com o Corpo & Grande Sorteio",
      palestrante: "Nayara Vilar",
      capa: null,
      disponivel: false,
      fotos: []
    }
  ];

  // Base Oficial de Participantes (Registros das Listas Presenciais Físicas)
  const participantesOficiais = [
    // --- DIA 1: 19/10/2026 ---
    { id: "d1_01", nome: "Juliano C. Chiquitame", setor: "Band", matricula_ou_email: "juliano c. chiquitame_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_02", nome: "Karina Cardoso Vergílio", setor: "Band", matricula_ou_email: "karina cardoso vergílio_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_03", nome: "Valentina Peixoto da Silva", setor: "Band", matricula_ou_email: "valentina peixoto da silva_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_04", nome: "Fabio Alexandre Vieira dos Santos", setor: "Band", matricula_ou_email: "fabio alexandre vieira dos santos_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_05", nome: "Gabriella G. Bittencourt Souza", setor: "Band", matricula_ou_email: "gabriella g. bittencourt souza_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_06", nome: "Bruna Farina", setor: "Band", matricula_ou_email: "bruna farina_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_07", nome: "Elizabeth Zoccoli", setor: "Band", matricula_ou_email: "elizabeth zoccoli_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_08", nome: "Igor de Paula Rocha", setor: "Band", matricula_ou_email: "igor de paula rocha_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_09", nome: "Gilson Del Passo", setor: "Band", matricula_ou_email: "gilson del passo_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_10", nome: "José Ricardo Fazio Luiz", setor: "Band", matricula_ou_email: "josé ricardo fazio luiz_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_11", nome: "Camila Ap. M. Trindade", setor: "Band", matricula_ou_email: "camila ap. m. trindade_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_12", nome: "Michely Rodrigues de Souza", setor: "Band", matricula_ou_email: "michely rodrigues de souza_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_13", nome: "Audrey de Andrade e Silva", setor: "Band", matricula_ou_email: "audrey de andrade e silva_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_14", nome: "Débora C. L. Santos", setor: "Band", matricula_ou_email: "débora c. l. santos_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_15", nome: "Bianca Amabile Crista Terzan", setor: "Band", matricula_ou_email: "bianca amabile crista terzan_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_16", nome: "Marilia Renaldo", setor: "Band", matricula_ou_email: "marilia renaldo_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_17", nome: "Vanessa C. Ribeiro", setor: "Band", matricula_ou_email: "vanessa c. ribeiro_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_18", nome: "Larissa L. Ramos", setor: "Band", matricula_ou_email: "larissa l. ramos_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_19", nome: "Leticia Fernanda Reis Santos", setor: "Band", matricula_ou_email: "leticia fernanda reis santos_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_20", nome: "Marcela P. Gomide Picardo", setor: "Band", matricula_ou_email: "marcela p. gomide picardo_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },
    { id: "d1_21", nome: "Gil Cleber", setor: "Band", matricula_ou_email: "gil cleber_19/10/2026", data_cadastro: "2026-10-19T15:00:00.000Z" },

    // --- DIA 2: 20/10/2026 ---
    { id: "d2_01", nome: "Vítor Barbosa Martins de Andrade", setor: "Band", matricula_ou_email: "vítor barbosa martins de andrade_20/10/2026", data_cadastro: "2026-10-20T15:00:00.000Z" },
    { id: "d2_02", nome: "Bianca Amabile Crista Terzan", setor: "Band", matricula_ou_email: "bianca amabile crista terzan_20/10/2026", data_cadastro: "2026-10-20T15:00:00.000Z" },
    { id: "d2_03", nome: "Erick Henrique da Silva Barros", setor: "Band", matricula_ou_email: "erick henrique da silva barros_20/10/2026", data_cadastro: "2026-10-20T15:00:00.000Z" },
    { id: "d2_04", nome: "Cinthia Zotarelli Leonel", setor: "Band", matricula_ou_email: "cinthia zotarelli leonel_20/10/2026", data_cadastro: "2026-10-20T15:00:00.000Z" },
    { id: "d2_05", nome: "Karina Cardoso Vergílio", setor: "Band", matricula_ou_email: "karina cardoso vergílio_20/10/2026", data_cadastro: "2026-10-20T15:00:00.000Z" },
    { id: "d2_06", nome: "Juliano C. Chiquitame", setor: "Band", matricula_ou_email: "juliano c. chiquitame_20/10/2026", data_cadastro: "2026-10-20T15:00:00.000Z" },
    { id: "d2_07", nome: "Fabio Alexandre Vieira dos Santos", setor: "Band", matricula_ou_email: "fabio alexandre vieira dos santos_20/10/2026", data_cadastro: "2026-10-20T15:00:00.000Z" },
    { id: "d2_08", nome: "Camila Ap. M. Trindade", setor: "Band", matricula_ou_email: "camila ap. m. trindade_20/10/2026", data_cadastro: "2026-10-20T15:00:00.000Z" },
    { id: "d2_09", nome: "Leticia Fernanda Reis Santos", setor: "Band", matricula_ou_email: "leticia fernanda reis santos_20/10/2026", data_cadastro: "2026-10-20T15:00:00.000Z" },
    { id: "d2_10", nome: "Larissa L. Ramos", setor: "Band", matricula_ou_email: "larissa l. ramos_20/10/2026", data_cadastro: "2026-10-20T15:00:00.000Z" },
    { id: "d2_11", nome: "Franciéle B. Cerqueira", setor: "Band", matricula_ou_email: "franciéle b. cerqueira_20/10/2026", data_cadastro: "2026-10-20T15:00:00.000Z" },
    { id: "d2_12", nome: "Débora C. L. Santos", setor: "Band", matricula_ou_email: "débora c. l. santos_20/10/2026", data_cadastro: "2026-10-20T15:00:00.000Z" },
    { id: "d2_13", nome: "Gilson Del Passo", setor: "Band", matricula_ou_email: "gilson del passo_20/10/2026", data_cadastro: "2026-10-20T15:00:00.000Z" },
    { id: "d2_14", nome: "José Ricardo Fazio Luiz", setor: "Band", matricula_ou_email: "josé ricardo fazio luiz_20/10/2026", data_cadastro: "2026-10-20T15:00:00.000Z" },
    { id: "d2_15", nome: "Audrey de Andrade e Silva", setor: "Band", matricula_ou_email: "audrey de andrade e silva_20/10/2026", data_cadastro: "2026-10-20T15:00:00.000Z" },
    { id: "d2_16", nome: "Gil Cleber", setor: "Band", matricula_ou_email: "gil cleber_20/10/2026", data_cadastro: "2026-10-20T15:00:00.000Z" },
    { id: "d2_17", nome: "Vinicius E. Mota", setor: "Band", matricula_ou_email: "vinicius e. mota_20/10/2026", data_cadastro: "2026-10-20T15:00:00.000Z" },
    { id: "d2_18", nome: "Luiz Carlos", setor: "Band", matricula_ou_email: "luiz carlos_20/10/2026", data_cadastro: "2026-10-20T15:00:00.000Z" },

    // --- DIA 3: 21/10/2026 ---
    { id: "d3_01", nome: "Léo Rossetti B. T. Corrêa", setor: "Band", matricula_ou_email: "léo rossetti b. t. corrêa_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" },
    { id: "d3_02", nome: "Gislayne Gomes", setor: "Band", matricula_ou_email: "gislayne gomes_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" },
    { id: "d3_03", nome: "Bianca Amabile Crista Terzan", setor: "Band", matricula_ou_email: "bianca amabile crista terzan_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" },
    { id: "d3_04", nome: "Fabio Alexandre Vieira dos Santos", setor: "Band", matricula_ou_email: "fabio alexandre vieira dos santos_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" },
    { id: "d3_05", nome: "Juliano C. Chiquitame", setor: "Band", matricula_ou_email: "juliano c. chiquitame_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" },
    { id: "d3_06", nome: "Valentina Peixoto da Silva", setor: "Band", matricula_ou_email: "valentina peixoto da silva_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" },
    { id: "d3_07", nome: "Vanessa C. Ribeiro", setor: "Band", matricula_ou_email: "vanessa c. ribeiro_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" },
    { id: "d3_08", nome: "Vítor Barbosa Martins de Andrade", setor: "Band", matricula_ou_email: "vítor barbosa martins de andrade_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" },
    { id: "d3_09", nome: "Erick Henrique da Silva Barros", setor: "Band", matricula_ou_email: "erick henrique da silva barros_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" },
    { id: "d3_10", nome: "Gilson Del Passo", setor: "Band", matricula_ou_email: "gilson del passo_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" },
    { id: "d3_11", nome: "Cinthia Zotarelli Leonel", setor: "Band", matricula_ou_email: "cinthia zotarelli leonel_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" },
    { id: "d3_12", nome: "Renato Azevedo", setor: "Band", matricula_ou_email: "renato azevedo_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" },
    { id: "d3_13", nome: "José Ricardo Fazio Luiz", setor: "Band", matricula_ou_email: "josé ricardo fazio luiz_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" },
    { id: "d3_14", nome: "Gil Cleber", setor: "Band", matricula_ou_email: "gil cleber_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" },
    { id: "d3_15", nome: "Débora C. L. Santos", setor: "Band", matricula_ou_email: "débora c. l. santos_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" },
    { id: "d3_16", nome: "Larissa L. Ramos", setor: "Band", matricula_ou_email: "larissa l. ramos_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" },
    { id: "d3_17", nome: "Leticia Fernanda Reis Santos", setor: "Band", matricula_ou_email: "leticia fernanda reis santos_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" },
    { id: "d3_18", nome: "Marcela P. Gomide Picardo", setor: "Band", matricula_ou_email: "marcela p. gomide picardo_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" },
    { id: "d3_19", nome: "Marilia Renaldo", setor: "Band", matricula_ou_email: "marilia renaldo_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" },
    { id: "d3_20", nome: "Camila Ap. M. Trindade", setor: "Band", matricula_ou_email: "camila ap. m. trindade_21/10/2026", data_cadastro: "2026-10-21T15:00:00.000Z" }
  ];

  const fetchParticipantes = async () => {
    setCarregandoLista(true);
    try {
      // 1. Inicia com a base física oficial
      const mapa = new Map();
      participantesOficiais.forEach(p => {
        const key = `${p.nome.trim().toLowerCase()}_${p.matricula_ou_email}`;
        mapa.set(key, p);
      });

      // 2. Mescla com check-ins salvos localmente
      try {
        let locais = JSON.parse(localStorage.getItem('sipat26_participantes') || '[]');
        // Limpa qualquer cache antigo com o nome incorreto "José Renato"
        locais = locais.filter(p => !p.nome || !p.nome.toLowerCase().includes("renato") || p.nome.toLowerCase().includes("azevedo"));
        localStorage.setItem('sipat26_participantes', JSON.stringify(locais));
        locais.forEach(p => {
          const key = `${p.nome.trim().toLowerCase()}_${p.matricula_ou_email}`;
          if (!mapa.has(key)) mapa.set(key, p);
        });
      } catch (e) {
        console.warn("Erro ao ler participantes do localStorage:", e);
      }

      // 3. Tenta mesclar com Supabase (se conectado e online)
      try {
        const { data, error } = await supabase.from('ifculos_participantes').select('*').order('data_cadastro', { ascending: false });
        if (data && !error) {
          data.forEach(p => {
            const key = `${p.nome.trim().toLowerCase()}_${p.matricula_ou_email}`;
            if (!mapa.has(key)) mapa.set(key, p);
          });
        }
      } catch (err) {
        console.warn("Supabase indisponível no momento, utilizando registros locais:", err);
      }

      setListaParticipantes(Array.from(mapa.values()));
    } catch (err) {
      console.error("Erro ao buscar participantes:", err);
      setListaParticipantes(participantesOficiais);
    } finally {
      setCarregandoLista(false);
    }
  };

  useEffect(() => {
    fetchParticipantes();

    // Check URL parameters for QR Code access
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("presencial") === "sipat26") {
      setIsPresencial(true);
    }
    
    // Check if it's the sorteador or sorteio page
    const fullLoc = (window.location.pathname + window.location.search + window.location.hash).toLowerCase();
    if (fullLoc.includes("sorteio") || fullLoc.includes("sorteador")) {
      setIsSorteador(true);
    }
  }, []);

  // Navegação por teclado no álbum de fotos
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!albumAtivo) return;
      if (e.key === "Escape") setAlbumAtivo(null);
      if (e.key === "ArrowLeft" && albumAtivo.fotos && albumAtivo.fotos.length > 1) {
        setFotoAtivaIndex((prev) => (prev - 1 + albumAtivo.fotos.length) % albumAtivo.fotos.length);
      }
      if (e.key === "ArrowRight" && albumAtivo.fotos && albumAtivo.fotos.length > 1) {
        setFotoAtivaIndex((prev) => (prev + 1) % albumAtivo.fotos.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [albumAtivo]);

  const handleSorteioSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMensagem("");

    try {
      const todayString = new Date().toLocaleDateString('pt-BR');
      const setorFinal = setor.trim() || "Band";
      const nomeLimpo = nome.trim();
      const matricula = `${nomeLimpo.toLowerCase()}_${todayString}`;

      // Salva no localStorage imediatamente para garantir
      try {
        const locais = JSON.parse(localStorage.getItem('sipat26_participantes') || '[]');
        const jaExiste = locais.some(p => p.matricula_ou_email === matricula) ||
          listaParticipantes.some(p => p.matricula_ou_email === matricula);

        if (jaExiste) {
          setStatus("error");
          setMensagem("Você já está cadastrado para o sorteio de hoje!");
          return;
        }

        const novo = {
          id: 'local_' + Date.now(),
          nome: nomeLimpo,
          matricula_ou_email: matricula,
          setor: setorFinal,
          data_cadastro: new Date().toISOString()
        };
        locais.push(novo);
        localStorage.setItem('sipat26_participantes', JSON.stringify(locais));
      } catch (errLocal) {
        console.warn("Erro ao salvar local:", errLocal);
      }

      // Tenta gravar no Supabase em segundo plano
      try {
        await supabase.from('ifculos_participantes').insert([{
          nome: nomeLimpo,
          matricula_ou_email: matricula,
          setor: setorFinal
        }]);
      } catch (errSupa) {
        console.warn("Supabase não respondeu, registro persistido com segurança localmente:", errSupa);
      }

      setStatus("success");
      setMensagem("Presença confirmada com sucesso! Boa sorte no sorteio 🍀");
      setNome("");
      setSetor("");
      fetchParticipantes();
    } catch (err) {
      setStatus("error");
      setMensagem("Ocorreu um erro ao registrar. Tente novamente.");
    }
  };

  const realizarSorteio = async () => {
    setSorteando(true);
    setVencedor(null);
    try {
      let candidatos = [...listaParticipantes];
      if (candidatos.length === 0) {
        alert("Nenhum participante encontrado.");
        setSorteando(false);
        return;
      }

      const norm = (s) => {
        const clean = (s || "").trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (clean.includes("JOSE RICARDO") || clean.includes("JOSE RENATO")) return "JOSE RICARDO FAZIO LUIZ";
        if (clean.includes("LARISSA L. RAMOS") || clean.includes("LARISSA LIMA") || clean.includes("LARISSA RAMOS")) return "LARISSA L. RAMOS";
        if (clean.includes("LETICIA FERNANDA")) return "LETICIA FERNANDA REIS SANTOS";
        if (clean.includes("MARCELA GOMIDE") || clean.includes("MARCELA P. GOMIDE")) return "MARCELA P. GOMIDE PICARDO";
        if (clean.includes("CAMILA TRINDADE") || clean.includes("CAMILA AP. M. TRINDADE")) return "CAMILA AP. M. TRINDADE";
        return clean;
      };

      // Se for o grande prêmio final:
      if (isGrandeSorteio) {
          const contagem = {};
          candidatos.forEach(p => {
              const nameKey = norm(p.nome);
              if (!contagem[nameKey]) contagem[nameKey] = { ...p, count: 0, dias: new Set() };
              contagem[nameKey].count += 1;
              if (p.matricula_ou_email) {
                if (p.matricula_ou_email.includes("19/10")) contagem[nameKey].dias.add("19");
                if (p.matricula_ou_email.includes("20/10")) contagem[nameKey].dias.add("20");
                if (p.matricula_ou_email.includes("21/10")) contagem[nameKey].dias.add("21");
                if (p.matricula_ou_email.includes("23/10")) contagem[nameKey].dias.add("23");
              }
          });

          // Determina o máximo de dias que já ocorreram
          const maxDiasAtingidos = Math.max(...Object.values(contagem).map(v => v.dias.size || v.count), 1);
          const diasExigidos = maxDiasAtingidos >= 4 ? 4 : maxDiasAtingidos;

          const elegiveis = Object.values(contagem).filter(p => (p.dias.size >= diasExigidos) || (p.count >= diasExigidos));

          if (elegiveis.length === 0) {
              alert(`Nenhum participante atingiu as presenças exigidas (${diasExigidos} dias) até o momento.`);
              setSorteando(false);
              return;
          }

          candidatos = elegiveis;
      } else {
          // Sorteio diário: Pega os registros de HOJE ou do dia mais recente
          const todayString = new Date().toLocaleDateString('pt-BR');
          let participantesHoje = candidatos.filter(p => p && p.matricula_ou_email && p.matricula_ou_email.endsWith(`_${todayString}`));

          // Se ninguém fez checkin hoje ainda (ex: antes de começar a palestra de hoje), permite sortear quem esteve no Dia 3 (21/Out)
          if (participantesHoje.length === 0) {
             participantesHoje = candidatos.filter(p => p && p.matricula_ou_email && p.matricula_ou_email.includes("21/10"));
          }

          if (participantesHoje.length > 0) {
              candidatos = participantesHoje;
          }

          // Remove quem já ganhou hoje da lista
          candidatos = candidatos.filter(p => p && p.nome && !ganhadoresHoje.includes(p.nome));
          
          if (candidatos.length === 0) {
              alert("Todos os participantes deste sorteio já foram contemplados!");
              setSorteando(false);
              return;
          }
      }

      // Efeito de roleta
      let counter = 0;
      const maxIterations = isGrandeSorteio ? 180 : 90; // 18s ou 9s
      
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


  
  if (isSorteador) {
    if (!isUnlocked) {
      return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
          <div className="bg-gray-800 border-2 border-gray-700 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
            <i className="fas fa-lock text-5xl text-yellow-400 mb-4"></i>
            <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito - CIPA</h2>
            <p className="text-sm text-gray-400 mb-6">Digite o PIN de 6 dígitos para acessar o painel do sorteio.</p>
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              if (pin === "134679") {
                setIsUnlocked(true);
                fetchParticipantes();
              } else { 
                alert("PIN incorreto!"); 
                setPin(""); 
              } 
            }}>
              <input 
                className="shadow appearance-none border-2 border-gray-600 bg-gray-900 rounded-lg w-full py-4 px-4 text-center text-2xl tracking-widest text-white font-bold focus:outline-none focus:border-yellow-500 mb-6 transition" 
                type="password" 
                placeholder="******" 
                maxLength="6"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                autoFocus
              />
              <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg shadow-lg transition transform hover:scale-105">
                <i className="fas fa-unlock-alt mr-2"></i> Liberar Sorteador
              </button>
              <div className="mt-4">
                <button 
                  type="button"
                  onClick={() => setIsSorteador(false)} 
                  className="text-xs text-gray-400 hover:text-white transition"
                >
                  <i className="fas fa-arrow-left mr-1"></i> Voltar à página inicial
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    if (telaSorteio === "lista") {
      return (
        <div className="min-h-screen bg-gray-900 flex flex-col p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSorteador(false)} 
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-xl text-sm font-semibold transition border border-gray-700 flex items-center"
              >
                <i className="fas fa-arrow-left mr-2"></i>Voltar ao Site
              </button>
              <h1 className="text-2xl md:text-4xl font-extrabold text-white">
                <i className="fas fa-clipboard-list text-yellow-400 mr-3"></i>Participantes do Sorteio
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={fetchParticipantes}
                disabled={carregandoLista}
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold text-sm md:text-base py-3 px-5 rounded-full shadow border border-gray-600 transition flex items-center"
              >
                <i className={`fas fa-sync-alt mr-2 ${carregandoLista ? 'fa-spin' : ''}`}></i> Atualizar Lista
              </button>
              <button 
                onClick={() => setTelaSorteio("roleta")}
                className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold text-base md:text-lg py-3 px-6 rounded-full shadow-lg transition transform hover:scale-105 flex items-center"
              >
                Ir para Roleta <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
          
          
          {/* Toggle de Filtro */}
          <div className="flex justify-center mb-6 overflow-x-auto py-1">
            <div className="bg-gray-800 p-1.5 rounded-2xl flex flex-wrap justify-center gap-1.5 border border-gray-700">
              <button 
                onClick={() => setFiltroVisao("hoje")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${filtroVisao === "hoje" ? "bg-green-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
              >
                <i className="fas fa-calendar-check"></i> Hoje (23/Out)
              </button>
              <button 
                onClick={() => setFiltroVisao("dia3")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${filtroVisao === "dia3" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
              >
                <i className="fas fa-calendar-day"></i> Dia 3 (21/Out)
              </button>
              <button 
                onClick={() => setFiltroVisao("dia2")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${filtroVisao === "dia2" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
              >
                <i className="fas fa-calendar-day"></i> Dia 2 (20/Out)
              </button>
              <button 
                onClick={() => setFiltroVisao("dia1")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${filtroVisao === "dia1" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
              >
                <i className="fas fa-calendar-day"></i> Dia 1 (19/Out)
              </button>
              <button 
                onClick={() => setFiltroVisao("final")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${filtroVisao === "final" ? "bg-yellow-500 text-gray-900 shadow-lg font-black" : "text-gray-400 hover:text-white"}`}
              >
                <i className="fas fa-star text-yellow-900"></i> ⭐ Aptos Prêmio Final (100%)
              </button>
              <button 
                onClick={() => setFiltroVisao("todos")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${filtroVisao === "todos" ? "bg-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
              >
                <i className="fas fa-users"></i> Todos os Registros
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl flex-grow overflow-auto border-2 border-gray-700">
            <div className="flex justify-between text-gray-400 mb-4 border-b border-gray-700 pb-2 px-2">
              <span className="font-bold uppercase tracking-wider text-sm">Nome do Participante</span>
              <span className="font-bold uppercase tracking-wider text-sm text-right">Setor / Status</span>
            </div>
            {(() => {
                if (carregandoLista) {
                    return <div className="text-center text-gray-500 my-12 text-xl"><i className="fas fa-spinner fa-spin mr-3"></i>Carregando lista...</div>;
                }
                
                const todayString = new Date().toLocaleDateString('pt-BR');
                let exibir = [];
                let labelVazio = "";

                if (filtroVisao === "hoje") {
                    exibir = listaParticipantes.filter(p => p.matricula_ou_email && p.matricula_ou_email.endsWith(`_${todayString}`));
                    labelVazio = "Nenhum participante fez check-in online hoje ainda (23/Out).";
                } else if (filtroVisao === "dia3") {
                    exibir = listaParticipantes.filter(p => p.matricula_ou_email && p.matricula_ou_email.includes("21/10"));
                    labelVazio = "Nenhum participante cadastrado para o Dia 3 (21/Out).";
                } else if (filtroVisao === "dia2") {
                    exibir = listaParticipantes.filter(p => p.matricula_ou_email && p.matricula_ou_email.includes("20/10"));
                    labelVazio = "Nenhum participante cadastrado para o Dia 2 (20/Out).";
                } else if (filtroVisao === "dia1") {
                    exibir = listaParticipantes.filter(p => p.matricula_ou_email && p.matricula_ou_email.includes("19/10"));
                    labelVazio = "Nenhum participante cadastrado para o Dia 1 (19/Out).";
                } else if (filtroVisao === "final") {
                    const norm = (s) => {
        const clean = (s || "").trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (clean.includes("JOSE RICARDO") || clean.includes("JOSE RENATO")) return "JOSE RICARDO FAZIO LUIZ";
        if (clean.includes("LARISSA L. RAMOS") || clean.includes("LARISSA LIMA") || clean.includes("LARISSA RAMOS")) return "LARISSA L. RAMOS";
        if (clean.includes("LETICIA FERNANDA")) return "LETICIA FERNANDA REIS SANTOS";
        if (clean.includes("MARCELA GOMIDE") || clean.includes("MARCELA P. GOMIDE")) return "MARCELA P. GOMIDE PICARDO";
        if (clean.includes("CAMILA TRINDADE") || clean.includes("CAMILA AP. M. TRINDADE")) return "CAMILA AP. M. TRINDADE";
        return clean;
      };
                    const contagem = {};
                    listaParticipantes.forEach(p => {
                        const nameKey = norm(p.nome);
                        if (!contagem[nameKey]) contagem[nameKey] = { ...p, count: 0, dias: new Set() };
                        contagem[nameKey].count += 1;
                        if (p.matricula_ou_email) {
                          if (p.matricula_ou_email.includes("19/10")) contagem[nameKey].dias.add("D1");
                          if (p.matricula_ou_email.includes("20/10")) contagem[nameKey].dias.add("D2");
                          if (p.matricula_ou_email.includes("21/10")) contagem[nameKey].dias.add("D3");
                          if (p.matricula_ou_email.includes("23/10")) contagem[nameKey].dias.add("D4");
                        }
                    });
                    // Quem participou de todos os 3 dias realizados (D1, D2 e D3)
                    const maxDias = Math.max(...Object.values(contagem).map(v => v.dias ? v.dias.size : v.count), 1);
                    const exigidos = maxDias >= 3 ? 3 : maxDias;
                    exibir = Object.values(contagem).filter(p => (p.dias && p.dias.size >= exigidos) || p.count >= exigidos);
                    labelVazio = "Ninguém atingiu 100% de presenças até agora.";
                } else {
                    exibir = listaParticipantes;
                    labelVazio = "Nenhum participante registrado.";
                }

                if (exibir.length === 0) {
                    return <div className="text-center text-gray-500 my-12 text-xl">{labelVazio}</div>;
                }

                return (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {exibir.map((p, idx) => (
                        <div key={idx} className="bg-gray-700/80 hover:bg-gray-700 transition p-4 rounded-xl border border-gray-600 flex justify-between items-center shadow-md">
                          <div className="truncate mr-3">
                            <span className="text-white font-bold text-sm block truncate">{p.nome.toUpperCase()}</span>
                            <span className="text-gray-400 text-xs">Setor: {p.setor || "Band"}</span>
                          </div>
                          {filtroVisao === "final" ? (
                             <span className="text-yellow-400 text-xs bg-yellow-950/90 px-3 py-1.5 rounded-full border border-yellow-500/50 font-black whitespace-nowrap shadow-sm">
                               ⭐ {p.dias ? Array.from(p.dias).join(" + ") : `${p.count} Dias`} (Apto)
                             </span>
                          ) : (
                             <span className="text-green-400 text-xs bg-gray-900/90 px-3 py-1 rounded-md whitespace-nowrap border border-green-500/30 font-semibold">
                               {p.matricula_ou_email && p.matricula_ou_email.includes("_") ? p.matricula_ou_email.split("_")[1] : "Presencial"}
                             </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 text-center text-gray-400 bg-gray-900/50 py-3 px-6 rounded-xl border border-gray-700 max-w-md mx-auto">
                      Total exibido: <strong className="text-white text-lg ml-1">{exibir.length}</strong> {filtroVisao === "final" ? "colaboradores com 100% de presença!" : "registros"}
                    </div>
                  </div>
                );
            })()}
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 relative">
        <div className="absolute top-6 left-6 flex gap-3">
          <button 
            onClick={() => setTelaSorteio("lista")}
            className="text-gray-300 hover:text-white transition flex items-center bg-gray-800 px-4 py-2 rounded-xl border border-gray-700 text-sm font-semibold"
          >
            <i className="fas fa-arrow-left mr-2"></i> Voltar para Lista
          </button>
          <button 
            onClick={() => setIsSorteador(false)}
            className="text-gray-300 hover:text-white transition flex items-center bg-gray-800 px-4 py-2 rounded-xl border border-gray-700 text-sm font-semibold"
          >
            <i className="fas fa-home mr-2"></i> Ir ao Site
          </button>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 text-center animate-pulse"><i className="fas fa-trophy text-yellow-400 mr-4"></i>Sorteador Oficial SIPAT 2026</h1>
        
        {!vencedor && !sorteando && (
          <div className="mb-8 w-full max-w-3xl bg-gray-800 p-6 rounded-2xl border-2 border-gray-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeInUp">
              <input 
                  type="text" 
                  placeholder="Nome do Prêmio (Ex: Voucher Giovanetti)" 
                  value={nomePremio}
                  onChange={(e) => setNomePremio(e.target.value)}
                  className="w-full md:w-2/3 py-3 px-4 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:border-yellow-500 font-semibold"
              />
              <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                      type="checkbox" 
                      checked={isGrandeSorteio}
                      onChange={(e) => setIsGrandeSorteio(e.target.checked)}
                      className="h-6 w-6 text-yellow-500 rounded focus:ring-yellow-500 bg-gray-900 border-gray-600"
                  />
                  <span className="text-yellow-400 font-bold uppercase tracking-wider text-sm">Grande Sorteio Final</span>
              </label>
          </div>
        )}
        
        {vencedor && nomePremio && (
           <div className="mb-6 bg-yellow-500 text-gray-900 py-2 px-8 rounded-full text-2xl font-black shadow-lg animate-bounce">
              Prêmio: {nomePremio}
           </div>
        )}
        
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

  return (
    <div className="antialiased">


    {/* ============================================ */}
    {/* 🎯 COLOQUE O ID DO VÍDEO DO YOUTUBE AQUI 👇 */}
    {/* ============================================ */}
    
    {/* ============================================ */}

    {/* Cabeçalho */}
    <header className="bg-white shadow-lg sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3 animate-fadeInUp">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Band_logo_2018.png" 
                     alt="Logo Band" 
                     className="h-10 sm:h-12 w-auto transition-transform hover:scale-110"
                     onerror="this.onerror=null; this.src='https://placehold.co/48x48/047857/ffffff?text=BAND'" />
                <span className="text-xl font-bold text-gray-800">Campinas</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 hidden md:block animate-fadeInUp">
                SIPAT 2026
            </h1>
            
            <div className="flex items-center gap-2 sm:gap-3 animate-fadeInUp">
                <button onClick={scrollToLivePlayer} className="btn-header-player">
                    <i className="fas fa-play-circle"></i>
                    <span className="hidden sm:inline">IR PARA PLAYER</span>
                    <span className="sm:hidden">PLAYER</span>
                </button>
                <a href="#fotos" className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-3 sm:px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105 text-sm sm:text-base flex items-center">
                    <i className="fas fa-camera mr-1.5 text-green-600"></i>
                    <span>Fotos</span>
                </a>
                <a href="#agenda" className="btn-primary bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 sm:px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105 text-sm sm:text-base">
                    Ver Agenda
                </a>
            </div>
        </div>
    </header>

    {/* Hero */}
    <section className="text-white py-12 sm:py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
            <p className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 animate-fadeInUp opacity-90">
                Semana Interna de Prevenção de Acidentes de Trabalho
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 leading-tight animate-fadeInUp" style={{animationDelay: "0.2s"}}>
                SIPAT BAND CAMPINAS 2026
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-fadeInUp opacity-90" style={{animationDelay: "0.4s"}}>
                A partir de 19 de Outubro. Participe e garanta um ambiente de trabalho e vida mais seguros!
            </p>
            <a href="#agenda" className="btn-primary inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-extrabold text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-10 rounded-full shadow-2xl uppercase tracking-wider transition duration-300 transform hover:scale-110 animate-fadeInUp" style={{animationDelay: "0.6s"}}>
                <i className="fas fa-calendar-check mr-2"></i>
                Não Perca! Veja a Programação
            </a>
        </div>
    </section>
    
    {/* Transmissão Ao Vivo */}
    <section id="ao-vivo" className="live-section">
        <div className="container">
            <h2 className="animate-fadeInUp">
                <i className="fab fa-youtube"></i> <span id="live-title">Transmissão Ao Vivo – SIPAT 2026</span>
            </h2>
            <p className="live-subtitle animate-fadeInUp" id="live-subtitle">
                
                Nos dias <strong>19, 20, 21 e 23 de Outubro</strong>, acompanhe as palestras ao vivo neste mesmo player.
            </p>

            <div className="text-center animate-fadeInUp" style={{animationDelay: "0.2s"}}>
                <div className="live-status-badge is-live" id="live-status-badge">
                    🔴 Transmissão Ao Vivo em andamento
                </div>
            </div>

            <div className="live-video-wrapper animate-fadeInUp" style={{animationDelay: "0.3s"}}>
                <div className="live-video-container" id="live-player">
                    <iframe
                        id="live-iframe"
                        src="https://www.youtube.com/embed/J6VlXZr4nHE?autoplay=1&rel=0"
                        title="SIPAT 2026 - Transmissão Ao Vivo"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen>
                    </iframe>
                </div>
            </div>

            <div className="live-actions animate-fadeInUp" style={{animationDelay: "0.4s"}}>
                <a
                    id="btn-open-youtube"
                    href="https://www.youtube.com/live/J6VlXZr4nHE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-live-primary">
                    <i className="fab fa-youtube"></i> Abrir no YouTube
                </a>
            </div>

            <p className="live-note animate-fadeInUp" style={{animationDelay: "0.5s"}} id="live-note">
                <i className="fas fa-info-circle"></i> Transmissão oficial da SIPAT 2026 ao vivo.
            </p>
        </div>
    </section>

    {/* Prêmios */}
    <section id="premios" className="py-12 sm:py-20 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 animate-fadeInUp">
                    <i className="fas fa-gift text-yellow-400 mr-3"></i>
                    Sorteio de Prêmios
                </h2>
                <p className="text-lg sm:text-xl text-gray-300 animate-fadeInUp">Participe e Concorra a Prêmios Incríveis!</p>
                <p className="text-lg sm:text-xl text-yellow-300 animate-fadeInUp mt-2 font-bold">
    <i className="fas fa-exclamation-triangle mr-2"></i>
    ATENÇÃO! Apenas os colaboradores presentes no presencial participarão dos sorteios.
</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
                
                {/* Prêmios Diários */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl prize-card border-4 border-yellow-400 animate-fadeInUp">
                    <div className="text-center mb-4">
                        <i className="fas fa-star text-yellow-500 text-4xl sm:text-5xl icon-bounce"></i>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center border-b-2 border-yellow-400 pb-3">
                        Prêmios Diários
                    </h3>
                    <p className="text-center text-xs sm:text-sm bg-yellow-100 text-yellow-800 font-bold py-2 px-3 rounded-lg mb-4">
                        <i className="fas fa-users mr-2"></i>PRESENCIAL
                    </p>
                    <p className="text-base sm:text-lg font-semibold mb-3 text-gray-700 text-center">
                        Concorra nos dias 19, 20, 21 e 23 de Outubro!
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-4 text-center">Serão sorteados:</p>
                    <ul className="space-y-2 sm:space-y-3 text-gray-700">
                        <li className="flex items-center font-medium text-sm sm:text-base bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition">
                            <i className="fas fa-hamburger text-yellow-500 text-lg sm:text-xl mr-2 sm:mr-3 w-5 sm:w-6 text-center"></i> 
                            <span>Voucher R$ 250 Giovanetti</span>
                        </li>
                        <li className="flex items-center font-medium text-sm sm:text-base bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition">
                            <i className="fas fa-star text-yellow-500 text-lg sm:text-xl mr-2 sm:mr-3 w-5 sm:w-6 text-center"></i> 
                            <span>Convites Hopi Hari</span>
                        </li>
                        <li className="flex items-center font-medium text-sm sm:text-base bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition">
                            <i className="fas fa-water text-yellow-500 text-lg sm:text-xl mr-2 sm:mr-3 w-5 sm:w-6 text-center"></i> 
                            <span>Thermas de São Pedro</span>
                        </li>
                        <li className="flex items-center font-medium text-sm sm:text-base bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition">
                            <i className="fas fa-swimmer text-yellow-500 text-lg sm:text-xl mr-2 sm:mr-3 w-5 sm:w-6 text-center"></i> 
                            <span>Convites Wet'n Wild</span>
                        </li>
                        <li className="flex items-center font-medium text-sm sm:text-base bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition">
                            <i className="fas fa-film text-yellow-500 text-lg sm:text-xl mr-2 sm:mr-3 w-5 sm:w-6 text-center"></i> 
                            <span>Ingressos de Cinema</span>
                        </li>
                    </ul>
                </div>

                {/* GRANDE PRÊMIO */}
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 sm:p-8 rounded-2xl shadow-2xl text-center border-4 border-white flex flex-col items-center justify-center transform md:scale-110 shine animate-fadeInUp" style={{animationDelay: "0.2s"}}>
                    <div className="mb-3">
                        <i className="fas fa-trophy text-5xl sm:text-6xl text-red-700 animate-float"></i>
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                        GRANDE PRÊMIO FINAL!
                    </h3>
                    <p className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                        Para quem participar de <span className="text-red-700 font-extrabold">TODOS OS DIAS</span> no presencial:
                    </p>
                    
                    <img src="/airfryer.png" 
                         alt="Air Fryer Mondial" 
                         className="air-fryer-image my-4 sm:my-6 animate-float" />
                    <p className="text-[11px] sm:text-xs text-gray-700 italic font-semibold -mt-2 mb-2">
                        *Imagem meramente ilustrativa
                    </p>
                    
                    <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-700 animate-pulse">
                        AIR FRYER MONDIAL
                    </p>
                    <p className="text-xs sm:text-sm text-gray-800 mt-3 font-semibold">
                        <i className="fas fa-check-circle mr-1"></i>
                        Presença obrigatória: 19, 20, 21 e 23/Out
                    </p>
                </div>

                {/* Conteúdo Online */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 sm:p-8 rounded-2xl shadow-2xl prize-card border-4 border-blue-300 flex items-center justify-center text-center animate-fadeInUp" style={{animationDelay: "0.4s"}}>
                    <div>
                        <div className="mb-4">
                            <i className="fas fa-book-reader text-4xl sm:text-5xl text-blue-600 icon-bounce"></i>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-blue-800 mb-4">
                            Conteúdo de Leitura Online
                        </h3>
                        <p className="text-blue-700 text-base sm:text-lg mb-4">
                            No dia <strong>22 de Outubro</strong>, material informativo digital (PDF) sobre temas cruciais para sua segurança e bem-estar.
                        </p>
                        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-inner mb-4">
                            <ul className="space-y-2 text-blue-700 text-sm sm:text-base font-medium">
                                <li className="flex items-center justify-start">
                                    <i className="fas fa-home text-blue-500 mr-2"></i>
                                    <span>Informativo Especial (22/Out)</span>
                                </li>
                                
                            </ul>
                        </div>
                        <p className="text-blue-600 text-xs sm:text-sm font-semibold">
                            <i className="fas fa-envelope mr-1"></i>
                            Disponível no seu e-mail corporativo
                        </p>
                    </div>
                </div>
                
            </div>

                            {/* Check-in and Prizes side-by-side block */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6 sm:mt-8 w-full">
                    
                    {/* Registration Form */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-2xl border-4 border-green-300 flex flex-col items-center justify-center animate-fadeInUp h-full">
                        <div className="w-full text-center mb-6">
                            <i className="fas fa-ticket-alt text-4xl text-green-600 mb-3 icon-bounce"></i>
                            <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">Check-in e Sorteio</h3>
                            <p className="text-green-700 text-sm sm:text-base">Área exclusiva para os Cipeiros registrarem a presença dos funcionários nos sorteios diários.</p>
                        </div>
                        <div className="w-full max-w-md">
                            {!isUnlocked ? (
                                <form className="bg-white p-6 rounded-xl shadow-inner w-full text-center" onSubmit={(e) => { e.preventDefault(); if(pin === "134679") setIsUnlocked(true); else { alert("PIN incorreto!"); setPin(""); } }}>
                                    <i className="fas fa-lock text-4xl text-gray-400 mb-3"></i>
                                    <h4 className="text-lg font-bold text-gray-700 mb-2">Acesso Restrito - CIPA</h4>
                                    <p className="text-xs text-gray-500 mb-4">Digite o PIN de 6 dígitos para liberar.</p>
                                    <div className="mb-4">
                                        <input 
                                          className="shadow appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-center text-xl tracking-widest text-gray-700 font-bold focus:outline-none focus:border-green-500 transition" 
                                          type="password" 
                                          placeholder="******" 
                                          maxLength="6"
                                          value={pin}
                                          onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                                        />
                                    </div>
                                    <button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition transform hover:scale-105 text-sm">
                                        <i className="fas fa-unlock-alt mr-2"></i> Liberar Formulário
                                    </button>
                                </form>
                            ) : (
                                <form className="bg-white p-6 rounded-xl shadow-inner w-full animate-fadeInUp" id="form-sorteio" onSubmit={handleSorteioSubmit}>
                                    <div className="flex justify-between items-center mb-4 border-b pb-3">
                                      <h4 className="font-bold text-gray-800 text-sm">Check-in de Presença</h4>
                                      <div className="flex items-center gap-2">
                                        <button 
                                          type="button" 
                                          onClick={() => {
                                            setIsSorteador(true);
                                            fetchParticipantes();
                                          }} 
                                          className="text-xs text-yellow-900 hover:text-black font-extrabold px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 rounded-lg shadow-sm border border-yellow-500 flex items-center transition transform hover:scale-105 cursor-pointer"
                                        >
                                          <i className="fas fa-trophy mr-1.5 text-yellow-800"></i>Abrir Sorteador
                                        </button>
                                        <button 
                                          type="button" 
                                          onClick={() => {setIsUnlocked(false); setPin("");}} 
                                          className="text-xs text-red-600 hover:text-red-800 font-bold px-2 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition"
                                        >
                                          <i className="fas fa-lock mr-1"></i>Bloquear
                                        </button>
                                      </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="nome">Nome Completo</label>
                                        <input className="shadow appearance-none border rounded w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 font-medium" id="nome" type="text" placeholder="Digite seu nome e sobrenome" required value={nome} onChange={(e) => setNome(e.target.value)} disabled={status === "loading"} />
                                    </div>
                                    <div className="mb-5">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="setor">
                                            Setor / Departamento <span className="text-gray-400 font-normal">(Opcional)</span>
                                        </label>
                                        <input className="shadow appearance-none border rounded w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" id="setor" type="text" placeholder="Setor (Padrão: Band)" value={setor} onChange={(e) => setSetor(e.target.value)} disabled={status === "loading"} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <button className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-3 px-4 rounded-lg shadow-lg focus:outline-none focus:shadow-outline transition transform hover:scale-105 disabled:opacity-50 flex justify-center items-center text-sm" type="submit" disabled={status === "loading"}>
                                            {status === "loading" ? (
                                                <><i className="fas fa-circle-notch fa-spin mr-2"></i> Registrando...</>
                                            ) : (
                                                <><i className="fas fa-check-circle mr-2"></i> Confirmar</>
                                            )}
                                        </button>
                                    </div>
                                    {mensagem && (
                                        <div className={`mt-4 p-2 rounded-lg text-center font-semibold text-xs ${status === "success" ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
                                            {status === "success" ? <i className="fas fa-check mr-1"></i> : <i className="fas fa-exclamation-triangle mr-1"></i>}
                                            {mensagem}
                                        </div>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Card Especial: Sorteio Quiropraxia / Prêmios Incríveis */} 
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-2xl shadow-2xl border-4 border-white text-center animate-fadeInUp shine flex flex-col justify-center h-full">
                        <div className="flex items-center justify-center mb-4">
                            <i className="fas fa-spa text-5xl sm:text-6xl text-white animate-float"></i>
                        </div>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4">
                            🎁 PRÊMIOS INCRÍVEIS
                        </h3>
                        <p className="text-xl sm:text-2xl font-bold text-yellow-300 mb-3">
                            SORTEIOS TODOS OS DIAS
                        </p>
                        <p className="text-lg sm:text-xl text-white mb-6">
                            Participe presencialmente e concorra!
                        </p>
                        <div>
                            <div className="bg-white/20 rounded-lg p-3 inline-block">
                                <p className="text-white font-semibold text-xs sm:text-sm">
                                    <i className="fas fa-calendar-check mr-2"></i>
                                    Sorteio realizado no encerramento da SIPAT
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </section>

    {/* Agenda */}
    <section id="agenda" className="py-12 sm:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3 animate-fadeInUp">
                    <i className="fas fa-calendar-alt text-green-600 mr-3"></i>
                    Agenda Completa da SIPAT 2026
                </h2>
                <p className="text-base sm:text-lg text-gray-600 animate-fadeInUp">Confira toda a programação da semana</p>
            </div>

            <div className="overflow-x-auto shadow-2xl rounded-2xl animate-fadeInUp">
                <table className="min-w-full bg-white sipat-table">
                    <thead>
                        <tr>
                            <th className="rounded-tl-lg">Data</th>
                            <th>Formato</th>
                            <th>Hora</th>
                            <th>Tema</th>
                            <th>Profissional</th>
                            <th className="rounded-tr-lg">Detalhes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="font-bold text-gray-800">
                                <i className="fas fa-calendar-day text-green-600 mr-1 sm:mr-2"></i>
                                <span className="hidden sm:inline">Segunda, </span>19/Out
                            </td>
                            <td>
                                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-red-100 text-red-700">
                                    <i className="fas fa-users mr-1"></i>Presencial
                                </span>
                            </td>
                            <td className="font-bold text-red-600 text-base sm:text-lg">15h00</td>
                            <td className="font-bold text-gray-800">Autocuidado e gestão do estresse</td>
                            <td className="font-semibold text-green-700">VANESSA FAVIN</td>
                            <td className="text-gray-700">Abertura da semana e sorteio de 3 prêmios.</td>
                        </tr>
                        <tr>
                            <td className="font-bold text-gray-800">
                                <i className="fas fa-calendar-day text-green-600 mr-1 sm:mr-2"></i>
                                <span className="hidden sm:inline">Terça, </span>20/Out
                            </td>
                            <td>
                                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-red-100 text-red-700">
                                    <i className="fas fa-users mr-1"></i>Presencial
                                </span>
                            </td>
                            <td className="font-bold text-red-600 text-base sm:text-lg">15h00</td>
                            <td className="font-bold text-gray-800">Saúde mental no trabalho</td>
                            <td className="font-semibold text-green-700">MICHELE SARKIS</td>
                            <td className="text-gray-700">Sorteio de 3 prêmios.</td>
                        </tr>
                        <tr>
                            <td className="font-bold text-gray-800">
                                <i className="fas fa-calendar-day text-green-600 mr-1 sm:mr-2"></i>
                                <span className="hidden sm:inline">Quarta, </span>21/Out
                            </td>
                            <td>
                                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-red-100 text-red-700">
                                    <i className="fas fa-users mr-1"></i>Presencial
                                </span>
                            </td>
                            <td className="font-bold text-red-600 text-base sm:text-lg">15h00</td>
                            <td className="font-bold text-gray-800">Equilíbrio, ansiedade e qualidade do sono</td>
                            <td className="font-semibold text-green-700">CARMEN REGINA</td>
                            <td className="text-gray-700">Sorteio de 3 prêmios.</td>
                        </tr>
                        <tr>
                            <td className="font-bold text-gray-800">
                                <i className="fas fa-calendar-day text-green-600 mr-1 sm:mr-2"></i>
                                <span className="hidden sm:inline">Quinta, </span>22/Out
                            </td>
                            <td>
                                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-blue-100 text-blue-700">
                                    <i className="fas fa-laptop mr-1"></i>Informativo
                                </span>
                            </td>
                            <td className="text-gray-600 font-medium">Todo o dia</td>
                            <td className="font-bold text-gray-800">Informativo Especial</td>
                            <td className="font-semibold text-green-700">-</td>
                            <td className="text-gray-700">Prevenção de acidentes domésticos e noções de primeiros socorros.</td>
                        </tr>
                        <tr>
                            <td className="font-bold text-gray-800">
                                <i className="fas fa-calendar-day text-green-600 mr-1 sm:mr-2"></i>
                                <span className="hidden sm:inline">Sexta, </span>23/Out
                            </td>
                            <td>
                                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-red-100 text-red-700">
                                    <i className="fas fa-users mr-1"></i>Presencial
                                </span>
                            </td>
                            <td className="font-bold text-red-600 text-base sm:text-lg">15h00</td>
                            <td className="font-bold text-gray-800">Cuidados com o corpo na rotina de trabalho</td>
                            <td className="font-semibold text-green-700">NAYARA VILAR</td>
                            <td className="text-gray-700">Encerramento, Sorteio de 3 prêmios e <strong className="text-yellow-600">GRANDE SORTEIO FINAL!</strong></td>
                        </tr>
</tbody>
                </table>
            </div>

            <div className="text-center mt-8 sm:mt-12 p-6 sm:p-8 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl border-l-8 border-red-500 shadow-xl animate-fadeInUp">
                <p className="text-xl sm:text-2xl font-bold text-red-800 flex items-center justify-center flex-wrap gap-3">
                    <span className="text-3xl sm:text-4xl animate-pulse">🚨</span> 
                    <span>REGRAS DE PARTICIPAÇÃO:</span>
                </p>
                <p className="text-base sm:text-xl text-red-700 mt-3">
                    Para concorrer ao <strong>Grande Prêmio Final</strong>, a participação é <strong>obrigatória nos 4 dias presenciais</strong> (19, 20, 21 e 23 de Outubro).
                </p>
            </div>
        </div>
    </section>

    {/* Galeria de Fotos - Álbuns por Dia */}
    <section id="fotos" className="py-12 sm:py-20 bg-gray-950 text-white border-t border-gray-800 relative">
        <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-10 sm:mb-14">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-semibold text-sm mb-3">
                    <i className="fas fa-camera"></i> Registros dos Dias Presenciais
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-3">
                    📸 Galeria de Fotos – SIPAT 2026
                </h2>
                <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto">
                    Clique na capa de cada dia para abrir o álbum e visualizar todas as fotos das palestras e dos colaboradores!
                </p>
            </div>

            {/* Grid dos Álbuns (Apenas as Capas Oficiais) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {albunsSipat.map((album) => {
                    if (album.disponivel) {
                        return (
                            <div
                                key={album.dia}
                                onClick={() => {
                                    setAlbumAtivo(album);
                                    setFotoAtivaIndex(0);
                                }}
                                className="group relative bg-gray-900 rounded-3xl overflow-hidden border-2 border-gray-800 hover:border-green-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-950/40 cursor-pointer flex flex-col"
                            >
                                {/* Foto da Capa */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                                    <img
                                        src={album.capa}
                                        alt={album.tema}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-black/20 to-transparent"></div>

                                    {/* Badges no topo */}
                                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                                        <span className="bg-green-600/90 backdrop-blur-md text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                                            <i className="fas fa-calendar-day"></i> Dia {album.dia}
                                        </span>
                                        <span className="bg-black/75 backdrop-blur-md text-green-300 border border-green-500/40 text-[11px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                                            <i className="fas fa-images"></i> {album.fotos.length} {album.fotos.length === 1 ? "foto" : "fotos"}
                                        </span>
                                    </div>

                                    {/* Overlay hover CTA */}
                                    <div className="absolute inset-0 bg-green-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                                        <span className="bg-white text-gray-900 font-extrabold text-xs sm:text-sm px-4 py-2 rounded-full shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                            <i className="fas fa-folder-open text-green-600"></i> Abrir Álbum
                                        </span>
                                    </div>
                                </div>

                                {/* Conteúdo do Card */}
                                <div className="p-5 flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="text-xs text-green-400 font-semibold mb-1 flex items-center gap-1.5">
                                            <i className="far fa-clock"></i> {album.data}
                                        </div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors line-clamp-2">
                                            {album.tema}
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1.5">
                                            <i className="fas fa-user-tie text-gray-500"></i> {album.palestrante}
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs font-bold text-green-400 group-hover:text-green-300">
                                        <span>Visualizar fotos</span>
                                        <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    {/* Card Álbum Em Breve */}
                    return (
                        <div
                            key={album.dia}
                            className="bg-gray-900/60 rounded-3xl border-2 border-dashed border-gray-800 p-6 flex flex-col justify-between text-center relative overflow-hidden"
                        >
                            <div className="my-auto py-6">
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-800/80 border border-gray-700/60 flex items-center justify-center text-gray-500 mb-4">
                                    <i className="fas fa-lock text-xl"></i>
                                </div>
                                <span className="inline-block bg-gray-800 text-gray-400 text-[11px] font-bold px-3 py-1 rounded-full mb-2">
                                    Dia {album.dia} • {album.data}
                                </span>
                                <h3 className="text-base font-bold text-gray-300 mb-1">
                                    {album.tema}
                                </h3>
                                <p className="text-xs text-gray-500 mb-2">
                                    Palestrante: {album.palestrante}
                                </p>
                            </div>
                            <div className="pt-3 border-t border-gray-800/50">
                                <span className="text-[11px] font-medium text-gray-500 flex items-center justify-center gap-1.5">
                                    <i className="far fa-clock"></i> Fotos liberadas após a palestra
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Modal Visualizador do Álbum */}
        {albumAtivo && (
            <div
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 animate-fadeIn"
                onClick={() => setAlbumAtivo(null)}
            >
                {/* Topbar do Modal */}
                <div
                    className="w-full max-w-6xl flex items-center justify-between py-2 px-3 sm:px-4 bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800 mb-2 z-20"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-500/20 border border-green-500/40 text-green-400 flex items-center justify-center font-black text-sm">
                            D{albumAtivo.dia}
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-base font-extrabold text-white truncate max-w-[200px] sm:max-w-md">
                                {albumAtivo.tema}
                            </h3>
                            <p className="text-[11px] sm:text-xs text-gray-400">
                                {albumAtivo.data} • {albumAtivo.palestrante}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs sm:text-sm font-bold text-gray-300 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                            {fotoAtivaIndex + 1} / {albumAtivo.fotos.length}
                        </span>
                        <button
                            onClick={() => setAlbumAtivo(null)}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white flex items-center justify-center text-lg transition duration-200 cursor-pointer"
                            title="Fechar (ESC)"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                {/* Área Principal da Foto */}
                <div
                    className="relative w-full max-w-6xl flex-grow flex items-center justify-center my-auto min-h-0"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Botão Anterior */}
                    {albumAtivo.fotos.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setFotoAtivaIndex((fotoAtivaIndex - 1 + albumAtivo.fotos.length) % albumAtivo.fotos.length);
                            }}
                            className="absolute left-1 sm:left-4 z-20 text-white bg-black/60 hover:bg-green-600 w-10 h-10 sm:w-13 sm:h-13 rounded-full flex items-center justify-center text-base sm:text-xl transition backdrop-blur-sm border border-white/10 cursor-pointer shadow-2xl"
                            title="Foto Anterior (Seta Esquerda)"
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                    )}

                    {/* Foto Ativa */}
                    <div className="relative max-h-[66vh] sm:max-h-[72vh] w-full flex items-center justify-center">
                        <img
                            key={albumAtivo.fotos[fotoAtivaIndex]?.src}
                            src={albumAtivo.fotos[fotoAtivaIndex]?.src}
                            alt={albumAtivo.fotos[fotoAtivaIndex]?.titulo}
                            className="max-h-[66vh] sm:max-h-[72vh] max-w-full object-contain rounded-2xl shadow-2xl border border-gray-800 select-none"
                        />
                    </div>

                    {/* Botão Próximo */}
                    {albumAtivo.fotos.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setFotoAtivaIndex((fotoAtivaIndex + 1) % albumAtivo.fotos.length);
                            }}
                            className="absolute right-1 sm:right-4 z-20 text-white bg-black/60 hover:bg-green-600 w-10 h-10 sm:w-13 sm:h-13 rounded-full flex items-center justify-center text-base sm:text-xl transition backdrop-blur-sm border border-white/10 cursor-pointer shadow-2xl"
                            title="Próxima Foto (Seta Direita)"
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    )}
                </div>

                {/* Legenda e Miniaturas no Rodapé */}
                <div
                    className="w-full max-w-6xl bg-gray-900/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-gray-800 mt-2 z-20"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Título e Descrição da foto atual */}
                    <div className="text-center mb-2.5">
                        <h4 className="text-sm sm:text-base font-bold text-white">
                            {albumAtivo.fotos[fotoAtivaIndex]?.titulo}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-400 mt-0.5 max-w-2xl mx-auto truncate">
                            {albumAtivo.fotos[fotoAtivaIndex]?.desc}
                        </p>
                    </div>

                    {/* Barra de Miniaturas (se houver mais de 1 foto) */}
                    {albumAtivo.fotos.length > 1 && (
                        <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 px-2 no-scrollbar">
                            {albumAtivo.fotos.map((foto, idx) => {
                                const isCurrent = idx === fotoAtivaIndex;
                                return (
                                    <button
                                        key={foto.id || idx}
                                        onClick={() => setFotoAtivaIndex(idx)}
                                        className={`relative w-14 h-11 sm:w-18 sm:h-13 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                                            isCurrent
                                                ? "border-green-400 scale-105 shadow-md shadow-green-500/50 ring-2 ring-green-400/40"
                                                : "border-transparent opacity-50 hover:opacity-100 hover:border-gray-500"
                                        }`}
                                    >
                                        <img
                                            src={foto.src}
                                            alt={foto.titulo}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        )}
    </section>

    {/* Rodapé */}
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 sm:py-10">
        <div className="container mx-auto px-4 text-center">
            <div className="mb-4">
                <i className="fas fa-shield-alt text-3xl sm:text-4xl text-green-400 mb-3 inline-block"></i>
            </div>
            <p className="text-base sm:text-lg font-semibold">&copy; 2026 SIPAT Band Campinas</p>
            <p className="text-xs sm:text-sm mt-2 text-gray-400">Realização: CIPA e Segurança do Trabalho</p>
            <p className="text-base sm:text-lg mt-4 text-yellow-400 font-bold">
                <i className="fas fa-heart text-red-500 mr-2"></i>
                Sua segurança é o nosso maior prêmio.
            </p>
        </div>
    </footer>

    {/* Scripts */}
    


    </div>
  );
}

export default App;













