const fs = require('fs');
let content = fs.readFileSync('src/components/pages/LandingPage.tsx', 'utf8');

// replace buttons going to /register
content = content.replace(/navigate\('\/register'\)/g, "navigate('/dashboard')");
content = content.replace(/>\s*Get Started\s*<\/button>/g, ">Launch App</button>");
content = content.replace(/>\s*Get Started Free\s*<ArrowRight/g, ">Launch App <ArrowRight");

// also remove references to "Sign Up Free" or "Unlock Pro Access" if needed, but they are just marketing. We'll change them to "Launch App"
content = content.replace(/>\s*Sign Up Free\s*<\/button>/g, ">Launch App</button>");
content = content.replace(/>\s*Unlock Pro Access\s*<\/button>/g, ">Launch App</button>");
content = content.replace(/>\s*Contact Sales\s*<\/button>/g, ">Launch App</button>");

fs.writeFileSync('src/components/pages/LandingPage.tsx', content);
