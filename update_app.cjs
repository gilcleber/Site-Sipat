const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Update Live Streaming Text
content = content.replace('Nos dias <strong>25, 26 e 28 de Novembro</strong>', 'Nos dias <strong>19, 20, 21 e 23 de Outubro</strong>');
content = content.replace('Nos dias de transmisso ao vivo (25, 26 e 28/Nov)', 'Nos dias de transmissão ao vivo (19, 20, 21 e 23/Out)');

// 2. Update Daily Prizes Text
content = content.replace('Concorra nos dias 25, 26 e 28 de Novembro!', 'Concorra nos dias 19, 20, 21 e 23 de Outubro!');

// Replace the <li> items for prizes
const oldPrizes = `<li className="flex items-center font-medium text-sm sm:text-base bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition">
                            <i className="fas fa-star text-yellow-500 text-lg sm:text-xl mr-2 sm:mr-3 w-5 sm:w-6 text-center"></i> 
                            <span>Convites HOPI HARI</span>
                        </li>
                        <li className="flex items-center font-medium text-sm sm:text-base bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition">
                            <i className="fas fa-film text-yellow-500 text-lg sm:text-xl mr-2 sm:mr-3 w-5 sm:w-6 text-center"></i> 
                            <span>Convites CINEMA</span>
                        </li>
                        <li className="flex items-center font-medium text-sm sm:text-base bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition">
                            <i className="fas fa-hamburger text-yellow-500 text-lg sm:text-xl mr-2 sm:mr-3 w-5 sm:w-6 text-center"></i> 
                            <span>Vouchers R$200 GIOVANETTI</span>
                        </li>
                        <li className="flex items-center font-medium text-sm sm:text-base bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition">
                            <i className="fas fa-water text-yellow-500 text-lg sm:text-xl mr-2 sm:mr-3 w-5 sm:w-6 text-center"></i> 
                            <span>Convites THERMAS</span>
                        </li>`;

const newPrizes = `<li className="flex items-center font-medium text-sm sm:text-base bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition">
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
                        </li>`;
content = content.replace(oldPrizes, newPrizes);

// 3. Update Grand Prize
content = content.replace('https://gazin-images.gazin.com.br/FvUHVP2VyngzEi0HUgXjMkudEHg=/1920x/filters:format(webp):quality(75)/https://gazin-marketplace.s3.amazonaws.com/midias/imagens/2024/11/fritadeira-eletrica-air-fryer-mondial-pratic-af-36-36l-1500w-162411030410.jpg', 'https://cdn-icons-png.flaticon.com/512/4213/4213958.png');
content = content.replace('Air Fryer Mondial', 'Grande Prêmio');
content = content.replace('AIR FRYER MONDIAL', 'PRÊMIO SURPRESA');
content = content.replace('Presena obrigatria: 25, 26 e 28/Nov', 'Presença obrigatória: 19, 20, 21 e 23/Out');
content = content.replace('Presença obrigatória: 25, 26 e 28/Nov', 'Presença obrigatória: 19, 20, 21 e 23/Out');
content = content.replace('Prêmio Final (Air Fryer)', 'Grande Prêmio Final');
content = content.replace('Prmio Final (Air Fryer)', 'Grande Prêmio Final');
content = content.replace('3 dias presenciais</strong> (25, 26 e 28 de Novembro)', '4 dias presenciais</strong> (19, 20, 21 e 23 de Outubro)');

// 4. Update Online Content
content = content.replace('Nos dias <strong>24 e 27</strong>', 'No dia <strong>22 de Outubro</strong>');
content = content.replace('Segurança Doméstica (24/Nov)', 'Informativo Especial (22/Out)');
content = content.replace('Segurana Domstica (24/Nov)', 'Informativo Especial (22/Out)');
content = content.replace(/<li className="flex items-center justify-start">\s*<i className="fas fa-dollar-sign text-blue-500 mr-2"><\/i>\s*<span>Bem-Estar Financeiro \(27\/Nov\)<\/span>\s*<\/li>/, '');

// 5. Update Special Prize (Quiropraxia) -> Presente Palestrantes
content = content.replace('🎁 SORTEIO ESPECIAL DIA 28/NOV', '🎁 SORTEIO ESPECIAL');
content = content.replace('SESSÕES DE QUIROPRAXIA', 'PRESENTE DOS PALESTRANTES');
content = content.replace('SESSES DE QUIROPRAXIA', 'PRESENTE DOS PALESTRANTES');
content = content.replace('com o Profissional <strong className="text-yellow-300">KADU MIRANDA</strong>', 'Surpresa especial para você!');

// 6. Update Agenda Table
const oldTableMatch = content.match(/<tbody>([\s\S]*?)<\/tbody>/);
if (oldTableMatch) {
    const newTable = `
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
`;
    content = content.replace(oldTableMatch[1], newTable);
}

fs.writeFileSync('src/App.jsx', content, 'utf8');
console.log("Updated App.jsx successfully.");
