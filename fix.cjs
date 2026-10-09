const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

const old_html = `                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 sm:p-8 rounded-2xl shadow-2xl border-4 border-green-300 md:col-span-3 flex flex-col md:flex-row items-center animate-fadeInUp mt-6">
                    <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8 text-center md:text-left">
                        <i className="fas fa-ticket-alt text-5xl text-green-600 mb-4 icon-bounce"></i>
                        <h3 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">Check-in e Sorteio</h3>
                        <p className="text-green-700 text-lg">Confirme sua presença e participe automaticamente dos sorteios diários e do Grande Prêmio Final!</p>
                    </div>
                    <div className="md:w-1/2 w-full">`;

const new_html = `                <div className={\`bg-gradient-to-br from-green-50 to-green-100 p-6 sm:p-8 rounded-2xl shadow-2xl border-4 border-green-300 md:col-span-3 flex flex-col items-center justify-center animate-fadeInUp mt-6 \${isPresencial ? 'md:flex-row' : ''}\`}>
                    {isPresencial && (
                    <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8 text-center md:text-left w-full">
                        <i className="fas fa-ticket-alt text-5xl text-green-600 mb-4 icon-bounce"></i>
                        <h3 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">Check-in e Sorteio</h3>
                        <p className="text-green-700 text-lg">Confirme sua presença e participe automaticamente dos sorteios diários e do Grande Prêmio Final!</p>
                    </div>
                    )}
                    <div className={isPresencial ? "md:w-1/2 w-full" : "w-full"}>`;

content = content.replace(old_html, new_html);
fs.writeFileSync('src/App.jsx', content, 'utf8');
