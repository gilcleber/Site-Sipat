import React, { useEffect } from "react";
import "./index.css";
import { supabase } from "./supabaseClient";

function App() {
  const scrollToLivePlayer = () => {
    const player = document.getElementById("live-player");
    if (player) {
      player.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    // Check Supabase connection on load
    const checkSupabase = async () => {
      console.log("Supabase Client Loaded:", supabase);
    };
    checkSupabase();
  }, []);

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
                <i className="fab fa-youtube"></i> <span id="live-title">Transmissão Ao Vivo – SIPAT 2025</span>
            </h2>
            <p className="live-subtitle animate-fadeInUp" id="live-subtitle">
                
                Nos dias <strong>19, 20, 21 e 23 de Outubro</strong>, acompanhe as palestras ao vivo neste mesmo player.
            </p>

            <div className="text-center animate-fadeInUp" style={{animationDelay: "0.2s"}}>
                <div className="live-status-badge" id="live-status-badge">
                    🎬 Vídeos educativos em reprodução contínua
                </div>
            </div>

            <div className="live-video-wrapper animate-fadeInUp" style={{animationDelay: "0.3s"}}>
                <div className="live-video-container" id="live-player">
                    <iframe
                        id="live-iframe"
                        src=""
                        title="SIPAT 2025 - Vídeos Educativos"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen>
                    </iframe>
                </div>
            </div>

            <div className="live-actions animate-fadeInUp" style={{animationDelay: "0.4s"}}>
                <a
                    id="btn-open-youtube"
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-live-primary">
                    <i className="fab fa-youtube"></i> Abrir no YouTube
                </a>
            </div>

            <p className="live-note animate-fadeInUp" style={{animationDelay: "0.5s"}} id="live-note">
                <i className="fas fa-info-circle"></i> Os vídeos estão em reprodução contínua (loop). Nos dias de transmissão ao vivo (25, 26 e 28/Nov), este player exibirá as palestras em tempo real.
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
                            <i className="fas fa-gift text-yellow-500 text-lg sm:text-xl mr-2 sm:mr-3 w-5 sm:w-6 text-center"></i> 
                            <span>Prêmio a Escolher 1</span>
                        </li>
                        <li className="flex items-center font-medium text-sm sm:text-base bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition">
                            <i className="fas fa-gift text-yellow-500 text-lg sm:text-xl mr-2 sm:mr-3 w-5 sm:w-6 text-center"></i> 
                            <span>Prêmio a Escolher 2</span>
                        </li>
                        <li className="flex items-center font-medium text-sm sm:text-base bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition">
                            <i className="fas fa-gift text-yellow-500 text-lg sm:text-xl mr-2 sm:mr-3 w-5 sm:w-6 text-center"></i> 
                            <span>Prêmio a Escolher 3</span>
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
                    
                    <img src="https://cdn-icons-png.flaticon.com/512/4213/4213958.png" 
                         alt="Grande Prêmio" 
                         onerror="this.onerror=null; this.src='https://placehold.co/200x200/cccccc/333333?text=Air+Fryer+Mondial';"
                         className="air-fryer-image my-4 sm:my-6 animate-float" />
                    
                    <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-700 animate-pulse">
                        PRÊMIO SURPRESA
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

            {/* Card Especial: Sorteio Quiropraxia */}
            <div className="max-w-4xl mx-auto mt-6 sm:mt-8">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 sm:p-8 rounded-2xl shadow-2xl border-4 border-white text-center animate-fadeInUp shine">
                    <div className="flex items-center justify-center mb-4">
                        <i className="fas fa-spa text-5xl sm:text-6xl text-white animate-float"></i>
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4">
                        🎁 SORTEIO ESPECIAL
                    </h3>
                    <p className="text-xl sm:text-2xl font-bold text-yellow-300 mb-3">
                        PRESENTE DOS PALESTRANTES
                    </p>
                    <p className="text-lg sm:text-xl text-white mb-4">
                        Surpresa especial para você!
                    </p>
                    <div className="bg-white bg-opacity-20 rounded-lg p-4 inline-block">
                        <p className="text-white font-semibold text-sm sm:text-base">
                            <i className="fas fa-calendar-check mr-2"></i>
                            Sorteio realizado no encerramento da SIPAT
                        </p>
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
                    Agenda Completa da SIPAT 2025
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
                            <td className="font-semibold text-green-700">DANI VIDOTO</td>
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
                            <td className="font-semibold text-green-700">MICHELE PIVA</td>
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
                            <td className="font-semibold text-green-700">CARMEM REGINA</td>
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
                            <td className="text-gray-700">Conteúdo online enviado por e-mail.</td>
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
                            <td className="font-semibold text-green-700">NAYARA VILLAR</td>
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

    {/* Rodapé */}
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 sm:py-10">
        <div className="container mx-auto px-4 text-center">
            <div className="mb-4">
                <i className="fas fa-shield-alt text-3xl sm:text-4xl text-green-400 mb-3 inline-block"></i>
            </div>
            <p className="text-base sm:text-lg font-semibold">&copy; 2025 SIPAT Band Campinas</p>
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
