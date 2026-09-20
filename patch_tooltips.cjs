const fs = require('fs');
let content = fs.readFileSync('src/components/pages/BugChecker.tsx', 'utf8');

// Close buttons tooltips
content = content.replace(
  `className="text-[#8eaccb] hover:text-white"><X`,
  `className="text-[#8eaccb] hover:text-white" title="Close"><X`
);
content = content.replace(
  `className="text-[#8eaccb] hover:text-white"><X`,
  `className="text-[#8eaccb] hover:text-white" title="Close"><X`
);
content = content.replace(
  `className="text-[#8eaccb] hover:text-white"><X`,
  `className="text-[#8eaccb] hover:text-white" title="Close"><X`
);

// Commit dropdown split arrow
content = content.replace(
  `className="px-2 bg-[#00d3a0] text-[#060d17] rounded-r hover:bg-[#00c79e] transition-colors flex items-center justify-center">`,
  `className="px-2 bg-[#00d3a0] text-[#060d17] rounded-r hover:bg-[#00c79e] transition-colors flex items-center justify-center" title="More Commit Options">`
);

// Diff dropdown split arrow
content = content.replace(
  `className="h-full px-3.5 py-[9px] bg-[#2684ff] text-white rounded-r-md hover:bg-[#1e88ff] transition-colors flex items-center justify-center"`,
  `className="h-full px-3.5 py-[9px] bg-[#2684ff] text-white rounded-r-md hover:bg-[#1e88ff] transition-colors flex items-center justify-center" title="Diff Options"`
);

// Language dropdown arrow
content = content.replace(
  `className="flex items-center gap-1.5 px-3 py-[9px] bg-[#0b1523] border border-[#1b2938] rounded-md text-[13px] text-[#8eaccb] hover:bg-[#101827] transition-colors whitespace-nowrap shrink-0"`,
  `className="flex items-center gap-1.5 px-3 py-[9px] bg-[#0b1523] border border-[#1b2938] rounded-md text-[13px] text-[#8eaccb] hover:bg-[#101827] transition-colors whitespace-nowrap shrink-0" title="Select Language"`
);

fs.writeFileSync('src/components/pages/BugChecker.tsx', content);
