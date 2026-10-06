import re

with open('index_old.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract CSS
style_match = re.search(r'<style>(.*?)</style>', html, re.DOTALL)
if style_match:
    css = style_match.group(1)
    with open('src/index.css', 'w', encoding='utf-8') as f:
        f.write('@tailwind base;\n@tailwind components;\n@tailwind utilities;\n')
        f.write(css)

# Extract body content
body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL)
if body_match:
    body_html = body_match.group(1)
    
    # Convert HTML to JSX
    jsx = body_html.replace('class=', 'className=')
    jsx = re.sub(r'<!--(.*?)-->', r'{/*\1*/}', jsx) # comments
    
    # Close specific unclosed tags
    jsx = re.sub(r'<img([^>]*?)(?<!/)>', r'<img\1 />', jsx)
    jsx = re.sub(r'<br([^>]*?)(?<!/)>', r'<br\1 />', jsx)
    jsx = re.sub(r'<input([^>]*?)(?<!/)>', r'<input\1 />', jsx)
    jsx = re.sub(r'<hr([^>]*?)(?<!/)>', r'<hr\1 />', jsx)
    
    # Fix inline styles (very basic fix)
    jsx = jsx.replace('style="animation-delay: 0.2s;"', 'style={{animationDelay: "0.2s"}}')
    jsx = jsx.replace('style="animation-delay: 0.3s;"', 'style={{animationDelay: "0.3s"}}')
    jsx = jsx.replace('style="animation-delay: 0.4s;"', 'style={{animationDelay: "0.4s"}}')
    jsx = jsx.replace('style="animation-delay: 0.5s;"', 'style={{animationDelay: "0.5s"}}')
    jsx = jsx.replace('style="animation-delay: 0.6s;"', 'style={{animationDelay: "0.6s"}}')
    
    # Remove script tags from body
    jsx = re.sub(r'<script.*?>.*?</script>', '', jsx, flags=re.DOTALL)
    
    # Fix onclick
    jsx = jsx.replace('onclick="scrollToLivePlayer()"', 'onClick={scrollToLivePlayer}')
    
    # Fix iframe properties (frameborder -> frameBorder, allowfullscreen -> allowFullScreen)
    jsx = jsx.replace('frameborder="0"', 'frameBorder="0"')
    jsx = jsx.replace('allowfullscreen', 'allowFullScreen')
    
    # Create App.jsx
    app_code = """import React, { useEffect } from "react";
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
""" + jsx + """
    </div>
  );
}

export default App;
"""
    with open('src/App.jsx', 'w', encoding='utf-8') as f:
        f.write(app_code)

print('Conversion completed.')
