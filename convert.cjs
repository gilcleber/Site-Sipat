const fs = require('fs');

const html = fs.readFileSync('index_old.html', 'utf8');

// Extract CSS
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
    const css = styleMatch[1];
    fs.writeFileSync('src/index.css', '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n' + css, 'utf8');
}

// Extract body content
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
if (bodyMatch) {
    let jsx = bodyMatch[1];
    
    // Convert HTML to JSX
    jsx = jsx.replace(/class=/g, 'className=');
    jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}'); // comments
    
    // Close specific unclosed tags
    jsx = jsx.replace(/<img([^>]*?)(?<!\/)>/g, '<img$1 />');
    jsx = jsx.replace(/<br([^>]*?)(?<!\/)>/g, '<br$1 />');
    jsx = jsx.replace(/<input([^>]*?)(?<!\/)>/g, '<input$1 />');
    jsx = jsx.replace(/<hr([^>]*?)(?<!\/)>/g, '<hr$1 />');
    
    // Fix inline styles
    jsx = jsx.replace(/style="animation-delay:\s*0\.2s;"/g, 'style={{animationDelay: "0.2s"}}');
    jsx = jsx.replace(/style="animation-delay:\s*0\.3s;"/g, 'style={{animationDelay: "0.3s"}}');
    jsx = jsx.replace(/style="animation-delay:\s*0\.4s;"/g, 'style={{animationDelay: "0.4s"}}');
    jsx = jsx.replace(/style="animation-delay:\s*0\.5s;"/g, 'style={{animationDelay: "0.5s"}}');
    jsx = jsx.replace(/style="animation-delay:\s*0\.6s;"/g, 'style={{animationDelay: "0.6s"}}');
    
    // Remove script tags
    jsx = jsx.replace(/<script[\s\S]*?<\/script>/g, '');
    
    // Fix onclick
    jsx = jsx.replace(/onclick="scrollToLivePlayer\(\)"/g, 'onClick={scrollToLivePlayer}');
    
    // Fix iframe properties
    jsx = jsx.replace(/frameborder="0"/g, 'frameBorder="0"');
    jsx = jsx.replace(/allowfullscreen/g, 'allowFullScreen');
    
    // Create App.jsx
    const appCode = `import React, { useEffect } from "react";
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
${jsx}
    </div>
  );
}

export default App;
`;
    fs.writeFileSync('src/App.jsx', appCode, 'utf8');
    console.log('Conversion completed.');
}
