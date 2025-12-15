const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend');
const skip = ['node_modules', '.next', '.git'];

function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (skip.includes(file)) return;
        
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walk(filePath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
            processFile(filePath);
        }
    });
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let changed = false;

    const lines = content.split('\n');
    const newLines = lines.map(line => {
        if (!line.includes('http://localhost:5000')) return line;
        
        let newline = line;
        
        // Strategy:
        // 1. Convert single/double quoted strings strictly starting with "http://localhost:5000" to backticks
        //    Examples: 'http://localhost:5000/api/users' -> `...`
        
        // Regex for 'http://localhost:5000...'
        // We capture the suffix in group 1 ($1)
        if (/'http:\/\/localhost:5000([^']*)'/.test(newline)) {
            newline = newline.replace(/'http:\/\/localhost:5000([^']*)'/g, "`\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}$1`");
        }
        
        // Regex for "http://localhost:5000..."
        if (/"http:\/\/localhost:5000([^"]*)"/.test(newline)) {
             newline = newline.replace(/"http:\/\/localhost:5000([^"]*)"/g, "`\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}$1`");
        }

        // 2. Handle strings that are ALREADY backticks, but contain http://localhost:5000
        //    Example: `http://localhost:5000/api/${id}`
        //    We want: `${process.env...}/api/${id}`
        //    We must NOT replace the fallback string 'http://localhost:5000' created in step 1.
        //    The fallback is wrapped in single quotes: ... || 'http://localhost:5000' ...
        
        // Check if line has backticks and localhost
        if (newline.includes('`') && newline.includes('http://localhost:5000')) {
             // Lookbehind to Ensure we are NOT preceded by ' (quote) which indicates it's the fallback string
             // Logic: Replace http://localhost:5000 ONLY if NOT preceded by '
             
             // Note: nodejs supports lookbehind in recent versions
             try {
                const regex = /(?<!')http:\/\/localhost:5000/g;
                if (regex.test(newline)) {
                     newline = newline.replace(regex, "${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}");
                }
             } catch (e) {
                 console.log('Regex error:', e);
             }
        }
        
        return newline;
    });

    if (newLines.join('\n') !== originalContent) {
        fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
        console.log('Updated:', filePath);
    }
}

console.log('Starting Update...');
walk(dir);
console.log('Done.');
